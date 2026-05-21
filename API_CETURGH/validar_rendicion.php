<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);
    exit;
}

$solicitud_id = intval($data["solicitud_id"] ?? 0);
$usuario_id = intval($data["usuario_id"] ?? 0);

if ($solicitud_id <= 0 || $usuario_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Datos incompletos"
    ]);
    exit;
}

/* =========================================
   SOLICITUD
========================================= */

$stmt = $conn->prepare("
SELECT
    monto_solicitado,
    estado,
    tipo
FROM solicitudes_fondo
WHERE id = ?
");

$stmt->bind_param("i", $solicitud_id);
$stmt->execute();

$sol = $stmt->get_result()->fetch_assoc();

if (!$sol) {
    echo json_encode([
        "success" => false,
        "message" => "Solicitud no existe"
    ]);
    exit;
}

if ($sol["estado"] !== "EN_RENDICION") {
    echo json_encode([
        "success" => false,
        "message" => "La solicitud no está en rendición"
    ]);
    exit;
}

/* =========================================
   SUMAR GASTOS
========================================= */

$stmt = $conn->prepare("
SELECT
    COALESCE(SUM(monto),0) total
FROM solicitud_gastos
WHERE solicitud_id = ?
");

$stmt->bind_param("i", $solicitud_id);
$stmt->execute();

$total = $stmt
    ->get_result()
    ->fetch_assoc()["total"];

$montoSolicitado =
    floatval($sol["monto_solicitado"]);

$montoRendido =
    floatval($total);

$diferencia =
    $montoSolicitado - $montoRendido;

/* =========================================
   DEFINIR ESTADO
========================================= */

$tipoSolicitud = strtoupper(
    trim($sol["tipo"])
);

/* =========================================
   ADELANTO
========================================= */

if ($tipoSolicitud === "ADELANTO") {

    if ($diferencia > 0) {

        $estado = "POR_DEVOLVER";

    } elseif ($diferencia < 0) {

        $estado = "POR_REEMBOLSAR";

    } else {

        $estado = "CERRADO";
    }
}

/* =========================================
   REEMBOLSO
========================================= */

if ($tipoSolicitud === "REEMBOLSO") {

    if ($diferencia < 0) {

        $estado = "POR_REEMBOLSAR";

    } else {

        $estado = "PAGADO";
    }
}

/* =========================================
   ACTUALIZAR SOLICITUD
========================================= */

$stmt = $conn->prepare("
UPDATE solicitudes_fondo
SET
    monto_rendido = ?,
    diferencia = ?,
    estado = ?
WHERE id = ?
");

$stmt->bind_param(
    "ddsi",
    $montoRendido,
    $diferencia,
    $estado,
    $solicitud_id
);

$stmt->execute();

/* =========================================
   HISTORIAL
========================================= */

$descripcion =
    "Rendición validada. Rendido: S/"
    . number_format($montoRendido, 2)
    . " | Diferencia: S/"
    . number_format($diferencia, 2);

$stmt = $conn->prepare("
INSERT INTO solicitud_historial
(
    solicitud_id,
    usuario_id,
    accion,
    descripcion
)
VALUES
(
    ?,
    ?,
    'VALIDAR_RENDICION',
    ?
)
");

$stmt->bind_param(
    "iis",
    $solicitud_id,
    $usuario_id,
    $descripcion
);

$stmt->execute();

/* =========================================
   RESPONSE
========================================= */

echo json_encode([
    "success" => true,
    "estado" => $estado,
    "monto_rendido" => $montoRendido,
    "diferencia" => $diferencia
]);

$conn->close();