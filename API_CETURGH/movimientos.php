<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["ok" => false, "error" => "Método no permitido"]);
    exit();
}

$caja_id = isset($_GET['caja_id']) ? intval($_GET['caja_id']) : 0;
if ($caja_id <= 0) {
    echo json_encode(["ok" => false, "error" => "Se requiere caja_id"]);
    exit();
}

$sql = "SELECT * FROM movimientos_caja WHERE caja_id = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $caja_id);
$stmt->execute();
$result = $stmt->get_result();
$movimientos = [];
while ($row = $result->fetch_assoc()) {
    $movimientos[] = $row;
}
echo json_encode(["ok" => true, "data" => $movimientos]);
?>