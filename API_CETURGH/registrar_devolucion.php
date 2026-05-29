<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$solicitud_id = intval($_POST["solicitud_id"] ?? 0);
$usuario_id = intval($_POST["usuario_id"] ?? 0);

if ($solicitud_id <= 0 || $usuario_id <= 0) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

if (!isset($_FILES["comprobante"]) || $_FILES["comprobante"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Debe subir comprobante"]);
    exit;
}

$file = $_FILES["comprobante"];
$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
$permitidos = ["pdf", "jpg", "jpeg", "png"];
if (!in_array($ext, $permitidos)) {
    echo json_encode(["success" => false, "message" => "Formato no permitido"]);
    exit;
}

$dir = "uploads/devoluciones/";
if (!file_exists($dir)) mkdir($dir, 0777, true);
$nombre = uniqid() . "_" . time() . "." . $ext;
$ruta = $dir . $nombre;

if (!move_uploaded_file($file["tmp_name"], $ruta)) {
    echo json_encode(["success" => false, "message" => "Error al guardar archivo"]);
    exit;
}

// Insertar archivo
$stmtArch = $conn->prepare("INSERT INTO solicitud_archivos (solicitud_id, tipo, nombre_original, nombre_guardado, ruta, subido_por) VALUES (?, 'DEVOLUCION', ?, ?, ?, ?)");
$stmtArch->bind_param("isssi", $solicitud_id, $file["name"], $nombre, $ruta, $usuario_id);
$stmtArch->execute();

// Cambiar estado a CERRADO
$update = $conn->prepare("UPDATE solicitudes_fondo SET estado = 'CERRADO' WHERE id = ?");
$update->bind_param("i", $solicitud_id);
$update->execute();

// Historial
$descripcion = "Solicitante registró devolución de dinero. Comprobante: " . $file["name"];
$hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, 'DEVOLUCION', ?)");
$hist->bind_param("iis", $solicitud_id, $usuario_id, $descripcion);
$hist->execute();

echo json_encode([
    "success" => true, 
    "message" => "Devolución registrada correctamente", 
    "estado" => "CERRADO"
]);
$conn->close();
?>