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

/* =========================================
   INPUT
========================================= */

$solicitud_id = intval($_POST["solicitud_id"] ?? 0);
$usuario_id   = intval($_POST["usuario_id"] ?? 0);

if ($solicitud_id <= 0 || $usuario_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);

    exit;
}

/* =========================================
   VALIDAR USUARIO
========================================= */

$stmtUser = $conn->prepare("
    SELECT id, tipo
    FROM usuarios
    WHERE id = ?
");

if (!$stmtUser) {

    echo json_encode([
        "success" => false,
        "message" => "Error SQL USER: " . $conn->error
    ]);

    exit;
}

$stmtUser->bind_param("i", $usuario_id);
$stmtUser->execute();

$user = $stmtUser->get_result()->fetch_assoc();

if (!$user) {

    echo json_encode([
        "success" => false,
        "message" => "Usuario no existe"
    ]);

    exit;
}

/* =========================================
   OBTENER SOLICITUD
========================================= */

$stmtSol = $conn->prepare("
    SELECT
        id,
        tipo,
        estado,
        monto_solicitado,
        monto_rendido,
        diferencia
    FROM solicitudes_fondo
    WHERE id = ?
");

if (!$stmtSol) {

    echo json_encode([
        "success" => false,
        "message" => "Error SQL SOLICITUD: " . $conn->error
    ]);

    exit;
}

$stmtSol->bind_param("i", $solicitud_id);
$stmtSol->execute();

$sol = $stmtSol->get_result()->fetch_assoc();

if (!$sol) {

    echo json_encode([
        "success" => false,
        "message" => "Solicitud no existe"
    ]);

    exit;
}

$tipo        = strtoupper(trim($sol["tipo"] ?? ""));
$estado      = strtoupper(trim($sol["estado"] ?? ""));
$diferencia  = floatval($sol["diferencia"] ?? 0);

/* =========================================
   VALIDAR FLUJO
========================================= */

$permitido = false;

/* =========================================
   ADELANTO
========================================= */

if (
    $tipo === "ADELANTO"
    &&
    $estado === "APROBADO"
) {

    $permitido = true;
}

/* =========================================
   REEMBOLSO
========================================= */

if (
    $tipo === "REEMBOLSO"
    &&
    (
        $estado === "POR_REEMBOLSAR"
        ||
        $estado === "POR_DEVOLVER"
        ||
        $estado === "EN_RENDICION"
    )
) {

    $permitido = true;
}

if (!$permitido) {

    echo json_encode([
        "success" => false,
        "message" => "La solicitud no puede procesarse en el estado actual"
    ]);

    exit;
}

/* =========================================
   VALIDAR ARCHIVO
========================================= */

if (!isset($_FILES["comprobante"])) {

    echo json_encode([
        "success" => false,
        "message" => "Debe subir comprobante"
    ]);

    exit;
}

$file = $_FILES["comprobante"];

if ($file["error"] !== UPLOAD_ERR_OK) {

    echo json_encode([
        "success" => false,
        "message" => "Error al subir archivo"
    ]);

    exit;
}

/* =========================================
   VALIDAR EXTENSION
========================================= */

$ext = strtolower(
    pathinfo($file["name"], PATHINFO_EXTENSION)
);

$permitidos = ["pdf", "jpg", "jpeg", "png"];

if (!in_array($ext, $permitidos)) {

    echo json_encode([
        "success" => false,
        "message" => "Formato no permitido"
    ]);

    exit;
}

/* =========================================
   CREAR DIRECTORIO
========================================= */

$dir = "uploads/pagos/";

if (!file_exists($dir)) {

    mkdir($dir, 0777, true);
}

/* =========================================
   GENERAR NOMBRE
========================================= */

$name = uniqid() . "_" . time() . "." . $ext;

$path = $dir . $name;

/* =========================================
   SUBIR ARCHIVO
========================================= */

if (!move_uploaded_file($file["tmp_name"], $path)) {

    echo json_encode([
        "success" => false,
        "message" => "No se pudo guardar archivo"
    ]);

    exit;
}

/* =========================================
   DEFINIR TIPO ARCHIVO
========================================= */

$tipoArchivo = "PAGO_TESORERIA";

/*
TABLA solicitud_archivos SOLO ACEPTA:

'SOLICITUD',
'PAGO_TESORERIA',
'RENDICION',
'DEVOLUCION',
'REEMBOLSO'

NO uses:
- REEMBOLSO_TESORERIA
- DEVOLUCION_SOLICITANTE
*/

if ($tipo === "REEMBOLSO") {

    if ($diferencia < 0) {

        $tipoArchivo = "REEMBOLSO";

    } else if ($diferencia > 0) {

        $tipoArchivo = "DEVOLUCION";

    } else {

        $tipoArchivo = "PAGO_TESORERIA";
    }
}

/* =========================================
   REGISTRAR ARCHIVO
========================================= */

$stmtArchivo = $conn->prepare("
    INSERT INTO solicitud_archivos
    (
        solicitud_id,
        tipo,
        nombre_original,
        nombre_guardado,
        ruta,
        subido_por
    )
    VALUES
    (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    )
");

if (!$stmtArchivo) {

    echo json_encode([
        "success" => false,
        "message" => "Error SQL ARCHIVO: " . $conn->error
    ]);

    exit;
}

$nombreOriginal = $file["name"];

$stmtArchivo->bind_param(
    "issssi",
    $solicitud_id,
    $tipoArchivo,
    $nombreOriginal,
    $name,
    $path,
    $usuario_id
);

if (!$stmtArchivo->execute()) {

    echo json_encode([
        "success" => false,
        "message" => "Error insertando archivo: " . $stmtArchivo->error
    ]);

    exit;
}

/* =========================================
   DEFINIR NUEVO ESTADO
========================================= */

$nuevoEstado = "PAGADO";

/* =========================================
   REEMBOLSO
========================================= */

if ($tipo === "REEMBOLSO") {

    $nuevoEstado = "CERRADO";
}

/* =========================================
   ACTUALIZAR SOLICITUD
========================================= */

$stmtUpdate = $conn->prepare("
    UPDATE solicitudes_fondo
    SET
        estado = ?,
        pagado_por = ?,
        fecha_pago = NOW(),
        firma_digital = ?
    WHERE id = ?
");

if (!$stmtUpdate) {

    echo json_encode([
        "success" => false,
        "message" => "Error SQL UPDATE: " . $conn->error
    ]);

    exit;
}

$stmtUpdate->bind_param(
    "sisi",
    $nuevoEstado,
    $usuario_id,
    $path,
    $solicitud_id
);

if (!$stmtUpdate->execute()) {

    echo json_encode([
        "success" => false,
        "message" => "Error actualizando solicitud: " . $stmtUpdate->error
    ]);

    exit;
}

/* =========================================
   HISTORIAL
========================================= */

$accion = "PAGAR";
$descripcion = "Pago registrado por tesorería";

if ($tipo === "REEMBOLSO") {

    if ($diferencia < 0) {

        $accion = "REEMBOLSAR";
        $descripcion = "Tesorería realizó reembolso";

    } else if ($diferencia > 0) {

        $accion = "DEVOLUCION";
        $descripcion = "Solicitante devolvió saldo";

    } else {

        $accion = "CERRAR";
        $descripcion = "Rendición cerrada";
    }
}

$stmtHist = $conn->prepare("
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
        ?,
        ?
    )
");

if ($stmtHist) {

    $stmtHist->bind_param(
        "iiss",
        $solicitud_id,
        $usuario_id,
        $accion,
        $descripcion
    );

    $stmtHist->execute();
}

/* =========================================
   RESPONSE
========================================= */

echo json_encode([
    "success" => true,
    "message" => "Proceso registrado correctamente",
    "estado" => $nuevoEstado,
    "archivo" => $path,
    "tipo_archivo" => $tipoArchivo
]);

$conn->close();
?>