<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$proveedor_id = $data['proveedor_id'] ?? null;
$empresa_id   = $data['empresa_id'] ?? null;
$sede_id      = $data['sede_id'] ?? null;

if (!$proveedor_id || !$empresa_id || !$sede_id) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

$conn->begin_transaction();

try {

    // =========================
    // 1. OBTENER ITEMS
    // =========================
    $sqlItems = "
        SELECT 
            i.id,
            i.descripcion,
            i.cantidad,
            i.precio_unitario,
            i.total,

            r.tipo AS tipo_requerimiento,

            p.id AS proveedor_id,
            p.nombre AS proveedor_nombre,
            p.ruc AS proveedor_ruc,

            e.id AS empresa_id,
            e.nombre AS empresa_nombre,
            e.ruc AS empresa_ruc,
            e.direccion AS empresa_direccion,
            e.web AS empresa_web

        FROM items i
        INNER JOIN requerimientos r ON i.requerimiento_id = r.id
        LEFT JOIN proveedores p ON i.proveedor_id = p.id
        LEFT JOIN empresas e ON r.empresa_id = e.id

        WHERE i.proveedor_id = ?
        AND r.empresa_id = ?
        AND r.sede_id = ?
        AND i.estado_pago = 'Pendiente'
    ";

    $stmtItems = $conn->prepare($sqlItems);

    if (!$stmtItems) {
        throw new Exception("SQL ERROR: " . $conn->error);
    }

    $stmtItems->bind_param("iii", $proveedor_id, $empresa_id, $sede_id);
    $stmtItems->execute();
    $res = $stmtItems->get_result();

    if ($res->num_rows === 0) {
        throw new Exception("No hay items pendientes");
    }

    $items = [];
    $total = 0;

    $empresa = null;
    $proveedor = null;

    while ($row = $res->fetch_assoc()) {

        $tipo = $row["tipo_requerimiento"] ?? "Producto";

        $items[] = [
            "id" => $row["id"],
            "descripcion" => $row["descripcion"],
            "cantidad" => (float)$row["cantidad"],
            "precio" => (float)$row["precio_unitario"],
            "total" => (float)$row["total"],
            "tipo" => $tipo
        ];

        $total += (float)$row["total"];

        if (!$proveedor) {
            $proveedor = [
                "id" => $row["proveedor_id"],
                "nombre" => $row["proveedor_nombre"],
                "ruc" => $row["proveedor_ruc"]
            ];
        }

        if (!$empresa) {
            $empresa = [
                "id" => $row["empresa_id"],
                "nombre" => $row["empresa_nombre"],
                "ruc" => $row["empresa_ruc"],
                "direccion" => $row["empresa_direccion"],
                "web" => $row["empresa_web"]
            ];
        }
    }

    $numero = "OC-" . date("Ymd-His");

    // =========================
    // 2. INSERT ORDEN
    // =========================
    $stmtOrden = $conn->prepare("
        INSERT INTO ordenes_compra 
        (numero, proveedor_id, empresa_id, sede_id, fecha, total)
        VALUES (?, ?, ?, ?, CURDATE(), ?)
    ");

    $stmtOrden->bind_param("siiid", $numero, $proveedor_id, $empresa_id, $sede_id, $total);
    $stmtOrden->execute();

    $orden_id = $conn->insert_id;

    // =========================
    // 3. ITEMS ORDEN
    // =========================
    $stmtItem = $conn->prepare("
        INSERT INTO orden_compra_items 
        (orden_id, item_id, descripcion, cantidad, precio, total, tipo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    foreach ($items as $it) {

        $stmtItem->bind_param(
            "iisddds",
            $orden_id,
            $it["id"],
            $it["descripcion"],
            $it["cantidad"],
            $it["precio"],
            $it["total"],
            $it["tipo"]
        );

        $stmtItem->execute();
    }

    // =========================
    // 4. UPDATE PAGADO
    // =========================
    $stmtUpdate = $conn->prepare("
        UPDATE items i
        INNER JOIN requerimientos r ON i.requerimiento_id = r.id
        SET i.estado_pago = 'Pagado'
        WHERE i.proveedor_id = ?
        AND r.empresa_id = ?
        AND r.sede_id = ?
    ");

    $stmtUpdate->bind_param("iii", $proveedor_id, $empresa_id, $sede_id);
    $stmtUpdate->execute();

    $conn->commit();

    // =========================
    // 5. RESPONSE
    // =========================
    echo json_encode([
        "success" => true,
        "orden" => [
            "id" => $orden_id,
            "numero" => $numero,
            "fecha" => date("Y-m-d"),
            "total" => $total,
            "proveedor" => $proveedor,
            "empresa" => $empresa,
            "items" => $items
        ]
    ]);

} catch (Exception $e) {
    $conn->rollback();

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}