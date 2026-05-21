<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {

    $search = $_GET['search'] ?? '';

    if ($search !== '') {
        $stmt = $conn->prepare("SELECT id, nombre FROM productos_select WHERE estado = 1 AND nombre LIKE CONCAT('%', ?, '%') LIMIT 20");
        $stmt->bind_param("s", $search);
    } else {
        $stmt = $conn->prepare("SELECT id, nombre FROM productos_select WHERE estado = 1 ORDER BY nombre ASC LIMIT 50");
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit();
}

// 👉 Crear nuevo producto si no existe
if ($method === 'POST') {

    $input = json_decode(file_get_contents("php://input"), true);
    $nombre = trim($input['nombre'] ?? '');

    if ($nombre === '') {
        http_response_code(400);
        echo json_encode(["error" => "Nombre requerido"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT IGNORE INTO productos_select (nombre) VALUES (?)");
    $stmt->bind_param("s", $nombre);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit();
}