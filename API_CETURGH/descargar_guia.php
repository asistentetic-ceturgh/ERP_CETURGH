<?php
// descargar_guia.php
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . basename($_GET['file']) . '"');
header('Access-Control-Allow-Origin: *');

$filePath = $_GET['file'];
$fullPath = 'uploads/guias/' . basename($filePath);

if (file_exists($fullPath)) {
    readfile($fullPath);
} else {
    http_response_code(404);
    echo "Archivo no encontrado";
}
?>