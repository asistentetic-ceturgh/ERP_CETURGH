<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$tipo = $data["tipo"] ?? '';
$caja_id = $data["caja_id"] ?? null;

$empresa_id = $data["empresa_id"] ?? null;
$sede_id = $data["sede_id"] ?? null;
$centro_costo_id = $data["centro_costo_id"] ?? null;

$monto = $data["monto"] ?? 0;
$motivo = trim($data["motivo"] ?? '');

if (!$tipo) {
    echo json_encode([
        "ok" => false,
        "error" => "Tipo requerido"
    ]);
    exit;
}

if ($monto <= 0) {
    echo json_encode([
        "ok" => false,
        "error" => "Monto inválido"
    ]);
    exit;
}

$stmt = $conn->prepare("
INSERT INTO solicitudes_caja (
    caja_id,
    tipo,
    empresa_id,
    sede_id,
    centro_costo_id,
    monto,
    motivo
)
VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "isiiids",
    $caja_id,
    $tipo,
    $empresa_id,
    $sede_id,
    $centro_costo_id,
    $monto,
    $motivo
);

$stmt->execute();

$id = $stmt->insert_id;

echo json_encode([
    "ok" => true,
    "id" => $id
]);