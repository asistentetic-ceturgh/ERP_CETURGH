<?php

$file = $_GET['file'] ?? '';

$ruta = __DIR__ . '/' . $file;

if (!file_exists($ruta)) {
    http_response_code(404);
    echo "Archivo no encontrado";
    exit;
}

// Forzar descarga
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . basename($ruta) . '"');
header('Content-Length: ' . filesize($ruta));

readfile($ruta);
exit;