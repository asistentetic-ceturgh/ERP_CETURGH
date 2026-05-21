<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
    exit;
}

if (!isset($_FILES['file']) || !isset($_POST['grupo_id'])) {
    echo json_encode(["success" => false, "error" => "Faltan datos"]);
    exit;
}

$grupo_id = intval($_POST['grupo_id']);
$file = $_FILES['file'];

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed = ['pdf'];
if (!in_array($ext, $allowed)) {
    echo json_encode(["success" => false, "error" => "Solo se permiten archivos PDF"]);
    exit;
}

$dir = "uploads/guias/";
if (!is_dir($dir)) mkdir($dir, 0777, true);

$nombreArchivo = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $file['name']);
$ruta = $dir . $nombreArchivo;

if (!move_uploaded_file($file['tmp_name'], $ruta)) {
    echo json_encode(["success" => false, "error" => "Error al mover archivo"]);
    exit;
}

// Obtener la URL actual y concatenar
$stmt = $conn->prepare("SELECT guia_url FROM grupos_tesoreria WHERE id = ?");
$stmt->bind_param("i", $grupo_id);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();
$current = $row['guia_url'] ?? '';
$newUrls = $current ? $current . ',' . $ruta : $ruta;

$update = $conn->prepare("UPDATE grupos_tesoreria SET guia_url = ? WHERE id = ?");
$update->bind_param("si", $newUrls, $grupo_id);
if ($update->execute()) {
    echo json_encode(["success" => true, "url" => $ruta]);
} else {
    echo json_encode(["success" => false, "error" => $update->error]);
}
?>