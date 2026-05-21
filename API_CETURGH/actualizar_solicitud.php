<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "PUT") {
    exit(json_encode(["success"=>false,"message"=>"Método no permitido"]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    exit(json_encode(["success"=>false,"message"=>"Datos inválidos"]));
}

/* ========================= */

$id = intval($data["id"] ?? 0);

$departamento_id = intval($data["departamento_id"] ?? 0);

$empresa = trim($data["empresa"] ?? "");
$sede = trim($data["sede"] ?? "");
$tipo = strtoupper(trim($data["tipo"] ?? "ADELANTO"));
$categoria = trim($data["categoria"] ?? "");
$concepto = trim($data["concepto"] ?? "");
$monto = floatval($data["monto_solicitado"] ?? 0);
$estado = strtoupper(trim($data["estado"] ?? "PENDIENTE"));

/* ========================= */

if ($id <= 0) {
    exit(json_encode(["success"=>false,"message"=>"ID inválido"]));
}

if ($departamento_id <= 0) {
    exit(json_encode(["success"=>false,"message"=>"Departamento inválido"]));
}

if (empty($empresa) || empty($sede) || empty($categoria) || empty($concepto)) {
    exit(json_encode(["success"=>false,"message"=>"Campos obligatorios incompletos"]));
}

if ($monto <= 0) {
    exit(json_encode(["success"=>false,"message"=>"Monto inválido"]));
}

/* ========================= */

$sql = "
UPDATE solicitudes_fondo
SET
    departamento_id = ?,
    empresa = ?,
    sede = ?,
    tipo = ?,
    categoria = ?,
    concepto = ?,
    monto_solicitado = ?,
    estado = ?
WHERE id = ?
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    exit(json_encode(["success"=>false,"message"=>$conn->error]));
}

$stmt->bind_param(
    "isssssds i",
    $departamento_id,
    $empresa,
    $sede,
    $tipo,
    $categoria,
    $concepto,
    $monto,
    $estado,
    $id
);

$stmt->execute();

/* HISTORIAL */
$historial = $conn->prepare("
    INSERT INTO solicitud_historial (
        solicitud_id,
        usuario_id,
        accion,
        descripcion
    ) VALUES (?, ?, ?, ?)
");

$accion = "UPDATE";
$descripcion = "Solicitud actualizada";

$usuario_id = 1;

$historial->bind_param(
    "iiss",
    $id,
    $usuario_id,
    $accion,
    $descripcion
);

$historial->execute();

echo json_encode([
    "success" => true,
    "message" => "Solicitud actualizada correctamente"
]);

$conn->close();