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
   🔍 LISTAR ITEMS ADMIN (con incluye_igv)
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
            i.grupo_id,

            r.codigo AS requerimiento_codigo,
            r.fecha,

            e.nombre AS empresa,
            s.nombre AS sede,
            d.nombre AS departamento,

            -- 🔥 OBTENER FLAG IGV DESDE EL GRUPO (por defecto 0)
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

            "grupo_id" => $row["grupo_id"],

            "requerimiento_codigo" =>
                $row["requerimiento_codigo"],

            "fecha" => $row["fecha"],

            "empresa" => $row["empresa"],
            "sede" => $row["sede"],
            "departamento" => $row["departamento"],

            // 🔥 NUEVO CAMPO
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
   🔄 CAMBIAR ESTADO
=========================== */
if ($method === 'POST') {

    $input = json_decode(
        file_get_contents("php://input"),
        true
    );

    $item_id = $input['item_id'] ?? null;

    $estado = strtoupper(
        trim($input['estado'] ?? "")
    );

    $comentario = trim(
        $input['comentario'] ?? ""
    );

    /* ===========================
       VALIDAR
    =========================== */
    if (!$item_id || !$estado) {

        echo json_encode([
            "success" => false,
            "message" => "Datos incompletos"
        ]);

        exit();
    }

    /* ===========================
       SWITCH ESTADOS
    =========================== */
    switch ($estado) {

        /* ===========================
           ✅ APROBAR
        =========================== */
        case "APROBADO":

            $conn->begin_transaction();

            try {

                /* ===========================
                   🔍 OBTENER ITEM
                =========================== */
                $stmtItem = $conn->prepare("
                    SELECT 
                        id,
                        grupo_id
                    FROM items
                    WHERE id = ?
                    LIMIT 1
                ");

                if (!$stmtItem) {
                    throw new Exception($conn->error);
                }

                $stmtItem->bind_param(
                    "i",
                    $item_id
                );

                $stmtItem->execute();

                $resultItem = $stmtItem->get_result();

                $itemData = $resultItem->fetch_assoc();

                if (!$itemData) {
                    throw new Exception(
                        "Item no encontrado"
                    );
                }

                /* ===========================
                   VALIDAR GRUPO
                =========================== */
                if (
                    empty($itemData['grupo_id'])
                ) {

                    throw new Exception(
                        "El item no tiene grupo asignado desde logística"
                    );
                }

                $grupo_id = $itemData['grupo_id'];

                /* ===========================
                   UPDATE ITEM
                =========================== */
                $stmtUpdate = $conn->prepare("
                    UPDATE items
                    SET
                        estado_administracion = 'APROBADO',
                        flujo_estado = 'TESORERIA',
                        grupo_id = ?
                    WHERE id = ?
                ");

                if (!$stmtUpdate) {
                    throw new Exception($conn->error);
                }

                $stmtUpdate->bind_param(
                    "ii",
                    $grupo_id,
                    $item_id
                );

                if (!$stmtUpdate->execute()) {

                    throw new Exception(
                        $stmtUpdate->error
                    );
                }

                $conn->commit();

                echo json_encode([
                    "success" => true,
                    "message" => "Item aprobado y enviado a Tesorería"
                ]);

            } catch (Exception $e) {

                $conn->rollback();

                echo json_encode([
                    "success" => false,
                    "error" => $e->getMessage()
                ]);
            }

            exit();

        /* ===========================
           ⚠️ OBSERVADO
        =========================== */
        case "OBSERVADO":

            $stmt = $conn->prepare("
                UPDATE items
                SET
                    estado_administracion = 'OBSERVADO',
                    comentario_estado = ?
                WHERE id = ?
            ");

            if (!$stmt) {

                echo json_encode([
                    "success" => false,
                    "error" => $conn->error
                ]);

                exit();
            }

            $stmt->bind_param(
                "si",
                $comentario,
                $item_id
            );

            if (!$stmt->execute()) {

                echo json_encode([
                    "success" => false,
                    "error" => $stmt->error
                ]);

                exit();
            }

            echo json_encode([
                "success" => true,
                "message" => "Item observado"
            ]);

            exit();

        /* ===========================
           ❌ DENEGADO
        =========================== */
        case "DENEGADO":

            $stmt = $conn->prepare("
                UPDATE items
                SET
                    estado_administracion = 'DENEGADO',
                    comentario_estado = ?
                WHERE id = ?
            ");

            if (!$stmt) {

                echo json_encode([
                    "success" => false,
                    "error" => $conn->error
                ]);

                exit();
            }

            $stmt->bind_param(
                "si",
                $comentario,
                $item_id
            );

            if (!$stmt->execute()) {

                echo json_encode([
                    "success" => false,
                    "error" => $stmt->error
                ]);

                exit();
            }

            echo json_encode([
                "success" => true,
                "message" => "Item denegado"
            ]);

            exit();

        /* ===========================
           ⚠️ ESTADO INVÁLIDO
        =========================== */
        default:

            echo json_encode([
                "success" => false,
                "message" => "Estado inválido"
            ]);

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