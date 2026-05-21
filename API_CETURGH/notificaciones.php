<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$usuario_id = isset($_GET['usuario_id'])
    ? intval($_GET['usuario_id'])
    : 0;

if ($usuario_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "usuario_id inválido"
    ]);

    exit();
}

$stmt = $conn->prepare("
    SELECT
        id,
        titulo,
        mensaje,
        tipo,
        leido,
        item_id,
        requerimiento_id,
        referencia_estado,
        created_at
    FROM notificaciones
    WHERE usuario_id = ?
    ORDER BY created_at DESC
    LIMIT 100
");

$stmt->bind_param("i", $usuario_id);

$stmt->execute();

$res = $stmt->get_result();

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);