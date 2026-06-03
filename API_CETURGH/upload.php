<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["ok" => false, "error" => "Método no permitido"]);
    exit();
}

// Determinar subcarpeta según el campo (opcional)
$campo = key($_FILES); // 'voucher', 'archivo', etc.
$subDir = ($campo === 'voucher') ? 'vouchers/' : 'adjuntos_rendicion/';

$uploadDir = 'uploads/' . $subDir;
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if (!isset($_FILES[$campo]) || $_FILES[$campo]['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["ok" => false, "error" => "Error al subir el archivo"]);
    exit();
}

$extension = pathinfo($_FILES[$campo]['name'], PATHINFO_EXTENSION);
$nombreUnico = uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
$rutaDestino = $uploadDir . $nombreUnico;

if (move_uploaded_file($_FILES[$campo]['tmp_name'], $rutaDestino)) {
    echo json_encode(["ok" => true, "filepath" => $rutaDestino]);
} else {
    echo json_encode(["ok" => false, "error" => "No se pudo guardar el archivo"]);
}
?>