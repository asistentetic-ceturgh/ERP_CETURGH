<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    exit(json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]));
}

/* ========================= */

$solicitante_id = intval($data["solicitante_id"] ?? 0);
$departamento_id = intval($data["departamento_id"] ?? 0);

$empresa = trim($data["empresa"] ?? "");
$sede = trim($data["sede"] ?? "");
$tipo = strtoupper(trim($data["tipo"] ?? "ADELANTO"));
$categoria = trim($data["categoria"] ?? "");
$concepto = trim($data["concepto"] ?? "");
$monto = floatval($data["monto_solicitado"] ?? 0);

/* ========================= */

if ($solicitante_id <= 0) {
    exit(json_encode(["success"=>false,"message"=>"Solicitante inválido"]));
}

if ($departamento_id <= 0) {
    exit(json_encode(["success"=>false,"message"=>"Departamento inválido"]));
}

if ($empresa === "" || $sede === "" || $concepto === "") {
    exit(json_encode(["success"=>false,"message"=>"Campos obligatorios faltantes"]));
}

if ($monto <= 0) {
    exit(json_encode(["success"=>false,"message"=>"Monto inválido"]));
}

/* ========================= */

$codigo = "FND-" . date("YmdHis");

$sql = "
INSERT INTO solicitudes_fondo (
    codigo,
    solicitante_id,
    departamento_id,
    empresa,
    sede,
    tipo,
    categoria,
    concepto,
    monto_solicitado,
    estado,
    firma_digital,
    firmado_por,
    fecha_firma,
    aprobado_por,
    fecha_aprobacion,
    pagado_por,
    fecha_pago,
    observaciones
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SIN_FIRMAR',
    NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL
)
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    exit(json_encode([
        "success" => false,
        "message" => "SQL error: " . $conn->error
    ]));
}

/* ========================= */
/* FIX CRÍTICO AQUÍ */
/* ========================= */

$stmt->bind_param(
    "siisssssd",
    $codigo,
    $solicitante_id,
    $departamento_id,
    $empresa,
    $sede,
    $tipo,
    $categoria,
    $concepto,
    $monto
);

if ($stmt->execute()) {

    $id = $stmt->insert_id;

    $historial = $conn->prepare("
        INSERT INTO solicitud_historial (
            solicitud_id,
            usuario_id,
            accion,
            descripcion
        ) VALUES (?, ?, ?, ?)
    ");

    $accion = "CREAR";
    $descripcion = "Solicitud creada";

    $historial->bind_param(
        "iiss",
        $id,
        $solicitante_id,
        $accion,
        $descripcion
    );

    $historial->execute();

    echo json_encode([
        "success" => true,
        "message" => "Solicitud creada correctamente",
        "id" => $id,
        "codigo" => $codigo,
        "estado" => "SIN_FIRMAR"
    ]);

} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$conn->close();