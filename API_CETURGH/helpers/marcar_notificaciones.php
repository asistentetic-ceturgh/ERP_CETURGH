<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$usuario_id = isset($data['usuario_id'])
    ? intval($data['usuario_id'])
    : 0;

if ($usuario_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "usuario_id inválido"
    ]);

    exit();
}

$stmt = $conn->prepare("
    UPDATE notificaciones
    SET leido = 1
    WHERE usuario_id = ?
");

$stmt->bind_param("i", $usuario_id);

$ok = $stmt->execute();

echo json_encode([
    "success" => $ok
]);