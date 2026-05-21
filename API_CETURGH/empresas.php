<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$res = $conn->query("SELECT id, nombre FROM empresas ORDER BY nombre");

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $data
]);