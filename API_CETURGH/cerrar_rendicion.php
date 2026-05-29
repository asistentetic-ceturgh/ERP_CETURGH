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
$usuario_id   = intval($_POST["usuario_id"] ?? 0);

if ($solicitud_id <= 0 || $usuario_id <= 0) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

// Verificar solicitud
$stmt = $conn->prepare("SELECT id, tipo, estado, diferencia FROM solicitudes_fondo WHERE id = ?");
$stmt->bind_param("i", $solicitud_id);
$stmt->execute();
$sol = $stmt->get_result()->fetch_assoc();
if (!$sol) {
    echo json_encode(["success" => false, "message" => "Solicitud no existe"]);
    exit;
}

$estado = $sol["estado"];
$tipo = $sol["tipo"];

// Para POR_DEVOLVER, el solicitante usa registrar_devolucion.php, no cerrar_rendicion.php
// Para POR_REEMBOLSAR, tesorería usa este archivo
if ($estado !== "POR_REEMBOLSAR") {
    echo json_encode(["success" => false, "message" => "No se puede cerrar en este estado. Estado actual: $estado"]);
    exit;
}

// Validar archivo
if (!isset($_FILES["comprobante"]) || $_FILES["comprobante"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Debe subir un comprobante de reembolso"]);
    exit;
}

$file = $_FILES["comprobante"];
$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
$permitidos = ["pdf", "jpg", "jpeg", "png"];
if (!in_array($ext, $permitidos)) {
    echo json_encode(["success" => false, "message" => "Formato no permitido"]);
    exit;
}

$dir = "uploads/reembolsos/";
if (!file_exists($dir)) mkdir($dir, 0777, true);
$nombre = uniqid() . "_" . time() . "." . $ext;
$ruta = $dir . $nombre;
if (!move_uploaded_file($file["tmp_name"], $ruta)) {
    echo json_encode(["success" => false, "message" => "Error al guardar archivo"]);
    exit;
}

// Guardar archivo
$stmtArch = $conn->prepare("INSERT INTO solicitud_archivos (solicitud_id, tipo, nombre_original, nombre_guardado, ruta, subido_por) VALUES (?, 'REEMBOLSO', ?, ?, ?, ?)");
$stmtArch->bind_param("isssi", $solicitud_id, $file["name"], $nombre, $ruta, $usuario_id);
$stmtArch->execute();

// Actualizar estado a CERRADO
$update = $conn->prepare("UPDATE solicitudes_fondo SET estado = 'CERRADO' WHERE id = ?");
$update->bind_param("i", $solicitud_id);
$update->execute();

// Historial
$descripcion = "Tesorería registró reembolso. Comprobante: " . $file["name"];
$hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, 'REEMBOLSO', ?)");
$hist->bind_param("iis", $solicitud_id, $usuario_id, $descripcion);
$hist->execute();

echo json_encode(["success" => true, "message" => "Reembolso registrado correctamente", "estado" => "CERRADO"]);
$conn->close();
?>