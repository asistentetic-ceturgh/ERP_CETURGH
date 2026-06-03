<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once "db.php";

if (!isset($_GET['nombre'])) {
    echo json_encode(["ok" => false, "error" => "Falta nombre del departamento"]);
    exit();
}

$nombre = $_GET['nombre'];
$tipo = isset($_GET['tipo']) ? $_GET['tipo'] : 'jefe';

$sql = "SELECT u.id, u.nombre, u.firma, d.nombre as departamento 
        FROM usuarios u 
        JOIN departamentos d ON u.departamento_id = d.id 
        WHERE d.nombre = ? AND u.tipo = ? 
        LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $nombre, $tipo);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    echo json_encode(["ok" => true, "data" => $user]);
} else {
    echo json_encode(["ok" => false, "error" => "No se encontró usuario jefe para el departamento $nombre"]);
}
?>