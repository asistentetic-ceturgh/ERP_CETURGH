<?php

header("Content-Type: application/json");

require_once "db.php";

$id = $_POST['id'] ?? null;
$pagado_por = $_POST['pagado_por'] ?? null;

if (!$id || !isset($_FILES['comprobante'])) {
    echo json_encode([
        "ok" => false,
        "msg" => "Faltan datos"
    ]);
    exit;
}

$permitidos = ['image/png', 'image/jpeg', 'application/pdf'];

if (!in_array($_FILES['comprobante']['type'], $permitidos)) {
    echo json_encode([
        "ok" => false,
        "msg" => "Formato no permitido"
    ]);
    exit;
}

$ext = pathinfo($_FILES['comprobante']['name'], PATHINFO_EXTENSION);

$nombreArchivo = "movilidad_" . time() . "_" . rand(1000,9999) . "." . $ext;

$rutaDestino = "uploads/comprobantes_movilidad/" . $nombreArchivo;

if (!move_uploaded_file($_FILES['comprobante']['tmp_name'], $rutaDestino)) {
    echo json_encode([
        "ok" => false,
        "msg" => "Error subiendo archivo"
    ]);
    exit;
}

$tipo = strtolower($ext) === 'pdf' ? 'pdf' : 'imagen';

$stmt = $conexion->prepare("
    UPDATE planilla_movilidad
    SET
        estado = 'Pagado',
        comprobante_pago = ?,
        comprobante_tipo = ?,
        fecha_pago = NOW(),
        pagado_por = ?
    WHERE id = ?
");

$stmt->bind_param(
    "ssii",
    $rutaDestino,
    $tipo,
    $pagado_por,
    $id
);

$stmt->execute();

echo json_encode([
    "ok" => true,
    "archivo" => $rutaDestino
]);