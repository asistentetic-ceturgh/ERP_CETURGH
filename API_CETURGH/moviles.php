<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Responder preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "db.php";

$sql = "
SELECT 
    i.codigo,
    m.modelo,
    m.numero,
    i.estado
FROM inventario i
JOIN inventario_moviles m ON i.id = m.inventario_id
WHERE i.tipo = 'MOVIL'
ORDER BY i.id DESC
";

$res = $conn->query($sql);

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);