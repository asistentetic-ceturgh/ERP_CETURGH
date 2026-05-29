<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

/* ===========================
   ✅ PREFLIGHT
=========================== */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

/* ===========================
   🔍 LISTAR ITEMS ADMIN (con incluye_igv, fecha, comentario y archivo)
=========================== */
if ($method === 'GET') {

    $sql = "
        SELECT 
            i.id,
            i.requerimiento_id,
            i.descripcion,
            i.cantidad,
            i.unidad,
            i.precio_unitario,
            i.proveedor,
            i.flujo_estado,
            i.estado_logistica,
            i.estado_administracion,
            i.estado_tesoreria,
            i.comentario_estado,
            i.comentario_solicitante,
            i.archivo_adjunto,
            i.grupo_id,
            i.incluye_igv,

            r.codigo AS requerimiento_codigo,
            r.fecha,

            e.nombre AS empresa,
            s.nombre AS sede,
            d.nombre AS departamento,

            COALESCE(g.incluye_igv, 0) AS incluye_igv

        FROM items i

        INNER JOIN requerimientos r
            ON r.id = i.requerimiento_id

        LEFT JOIN empresas e
            ON e.id = r.empresa_id

        LEFT JOIN sedes s
            ON s.id = r.sede_id

        LEFT JOIN departamentos d
            ON d.id = r.departamento_id

        LEFT JOIN grupos_tesoreria g
            ON g.id = i.grupo_id

        WHERE i.flujo_estado IN (
            'LOGISTICA',
            'ADMINISTRACION',
            'TESORERIA'
        )

        ORDER BY r.id DESC, i.id DESC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode([
            "success" => false,
            "error" => $conn->error
        ]);
        exit();
    }

    $data = [];

    while ($row = $result->fetch_assoc()) {

        $data[] = [
            "id" => $row["id"],
            "requerimiento_id" => $row["requerimiento_id"],

            "descripcion" => $row["descripcion"],
            "cantidad" => $row["cantidad"],
            "unidad" => $row["unidad"],

            "precio_unitario" => $row["precio_unitario"],

            "proveedor" => $row["proveedor"],

            "flujo_estado" => $row["flujo_estado"],

            "estado_logistica" => $row["estado_logistica"],

            "estado_administracion" =>
                $row["estado_administracion"] ?: "PENDIENTE",

            "estado_tesoreria" => $row["estado_tesoreria"],

            "comentario_estado" => $row["comentario_estado"],
            
            "comentario_solicitante" => $row["comentario_solicitante"],
            
            "archivo_adjunto" => $row["archivo_adjunto"],

            "grupo_id" => $row["grupo_id"],

            "requerimiento_codigo" => $row["requerimiento_codigo"],

            "fecha" => $row["fecha"],

            "empresa" => $row["empresa"],
            "sede" => $row["sede"],
            "departamento" => $row["departamento"],

            "incluye_igv" => (int)$row["incluye_igv"]
        ];
    }

    echo json_encode([
        "success" => true,
        "total" => count($data),
        "data" => $data
    ]);

    exit();
}

/* ===========================
   🔄 CAMBIAR ESTADO (APROBAR, OBSERVAR, DENEGAR)
=========================== */
if ($method === 'POST') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    $item_id = $input['item_id'] ?? null;
    $estado = strtoupper(trim($input['estado'] ?? ""));
    $comentario = trim($input['comentario'] ?? "");

    if (!$item_id || !$estado) {
        echo json_encode([
            "success" => false,
            "message" => "Datos incompletos"
        ]);
        exit();
    }

    switch ($estado) {

        case "APROBADO":
    $conn->begin_transaction();
    try {
        $stmtItem = $conn->prepare("SELECT id, grupo_id FROM items WHERE id = ? LIMIT 1");
        $stmtItem->bind_param("i", $item_id);
        $stmtItem->execute();
        $resultItem = $stmtItem->get_result();
        $itemData = $resultItem->fetch_assoc();

        if (!$itemData) throw new Exception("Item no encontrado");
        if (empty($itemData['grupo_id'])) throw new Exception("El item no tiene grupo asignado desde logística");

        // 🔥 CORREGIDO: NO modificar grupo_id, solo cambiar estados
        $stmtUpdate = $conn->prepare("
            UPDATE items
            SET estado_administracion = 'APROBADO',
                flujo_estado = 'TESORERIA'
            WHERE id = ?
        ");
        $stmtUpdate->bind_param("i", $item_id);
        if (!$stmtUpdate->execute()) throw new Exception($stmtUpdate->error);

        $conn->commit();
        echo json_encode(["success" => true, "message" => "Item aprobado y enviado a Tesorería"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit();

        case "OBSERVADO":
            $stmt = $conn->prepare("UPDATE items SET estado_administracion = 'OBSERVADO', comentario_estado = ? WHERE id = ?");
            $stmt->bind_param("si", $comentario, $item_id);
            if (!$stmt->execute()) {
                echo json_encode(["success" => false, "error" => $stmt->error]);
            } else {
                echo json_encode(["success" => true, "message" => "Item observado"]);
            }
            exit();

        case "DENEGADO":
            $stmt = $conn->prepare("UPDATE items SET estado_administracion = 'DENEGADO', comentario_estado = ? WHERE id = ?");
            $stmt->bind_param("si", $comentario, $item_id);
            if (!$stmt->execute()) {
                echo json_encode(["success" => false, "error" => $stmt->error]);
            } else {
                echo json_encode(["success" => true, "message" => "Item denegado"]);
            }
            exit();

        default:
            echo json_encode(["success" => false, "message" => "Estado inválido"]);
            exit();
    }
}

/* ===========================
   ❌ MÉTODO INVÁLIDO
=========================== */
echo json_encode([
    "success" => false,
    "message" => "Método inválido"
]);
exit();
?>