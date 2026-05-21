<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$empresa_id = $_GET["empresa_id"] ?? 0;

$stmt = $conn->prepare("SELECT id, nombre FROM sedes WHERE empresa_id = ?");
$stmt->bind_param("i", $empresa_id);
$stmt->execute();

$res = $stmt->get_result();

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $data
]);