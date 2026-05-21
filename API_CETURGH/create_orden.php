<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "No hay datos"]);
    exit;
}

// =========================
// DATOS
// =========================
$numero = $data["numero"];
$fecha = $data["fecha"];
$total = $data["total"];

$proveedor_id = $data["proveedor_id"]; // 👈 YA EXISTENTE
$empresa_id = $data["empresa_id"];     // 👈 YA EXISTENTE

// =========================
// VALIDACIÓN
// =========================
if (!$proveedor_id || !$empresa_id) {
    echo json_encode([
        "success" => false,
        "error" => "Faltan IDs de proveedor o empresa"
    ]);
    exit;
}

// =========================
// INSERTAR ORDEN
// =========================
$stmtOrden = $conn->prepare("
    INSERT INTO ordenes_compra (numero, fecha, total, proveedor_id, empresa_id)
    VALUES (?, ?, ?, ?, ?)
");

$stmtOrden->bind_param("ssdii", $numero, $fecha, $total, $proveedor_id, $empresa_id);
$stmtOrden->execute();

$orden_id = $conn->insert_id;

// =========================
// INSERTAR ITEMS
// =========================
$stmtItem = $conn->prepare("
    INSERT INTO orden_compra_items (orden_id, descripcion, cantidad, precio, total)
    VALUES (?, ?, ?, ?, ?)
");

foreach ($data["items"] as $item) {
    $stmtItem->bind_param(
        "isidd",
        $orden_id,
        $item["descripcion"],
        $item["cantidad"],
        $item["precio"],
        $item["total"]
    );
    $stmtItem->execute();
}

// =========================
// RESPUESTA
// =========================
echo json_encode([
    "success" => true,
    "id" => $orden_id
]);