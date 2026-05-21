<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$q = $_GET['q'] ?? '';

$sql = "SELECT id, nombre 
        FROM proveedores 
        WHERE nombre LIKE CONCAT('%', ?, '%') 
        LIMIT 10";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $q);
$stmt->execute();

$res = $stmt->get_result();

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);