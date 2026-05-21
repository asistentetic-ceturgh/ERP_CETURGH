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
        "message" => "Datos incompletos"
    ]);

    exit;
}

/* =========================================
   VALIDAR ARCHIVOS
========================================= */

if (
    !isset($_FILES["files"])
    ||
    empty($_FILES["files"]["name"][0])
) {

    echo json_encode([
        "success" => false,
        "message" => "No se recibieron archivos"
    ]);

    exit;
}

/* =========================================
   OBTENER SOLICITUD
========================================= */

$stmt = $conn->prepare("
    SELECT
        id,
        tipo,
        estado,
        monto_solicitado,
        monto_rendido,
        diferencia
    FROM solicitudes_fondo
    WHERE id=?
");

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

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

/* =========================================
   VARIABLES
========================================= */

$tipo   = strtoupper(trim($sol["tipo"] ?? ""));
$estado = strtoupper(trim($sol["estado"] ?? ""));

$montoSolicitado = floatval(
    $sol["monto_solicitado"] ?? 0
);

$montoRendido = floatval(
    $sol["monto_rendido"] ?? 0
);

/*
    DIFERENCIA:

    NEGATIVO  => TESORERIA REEMBOLSA
    POSITIVO  => USUARIO DEVUELVE
    CERO      => CUADRADO
*/

$diferencia = $montoSolicitado - $montoRendido;

/* =========================================
   VALIDAR ESTADO
========================================= */

$permitido = false;

/* =========================================
   ADELANTO
========================================= */

if ($tipo === "ADELANTO") {

    if (
        $estado === "PAGADO"
        ||
        $estado === "EN_RENDICION"
    ) {

        $permitido = true;
    }
}

/* =========================================
   REEMBOLSO
========================================= */

if ($tipo === "REEMBOLSO") {

    if (
        $estado === "APROBADO"
        ||
        $estado === "EN_RENDICION"
    ) {

        $permitido = true;
    }
}

if (!$permitido) {

    echo json_encode([
        "success" => false,
        "message" => "La solicitud no puede rendirse en el estado actual"
    ]);

    exit;
}

/* =========================================
   DIRECTORIO
========================================= */

$dir = "uploads/rendiciones/";

if (!file_exists($dir)) {
    mkdir($dir, 0777, true);
}

/* =========================================
   EXTENSIONES
========================================= */

$permitidos = ["pdf", "jpg", "jpeg", "png"];

$subidos = [];

/* =========================================
   SUBIR ARCHIVOS
========================================= */

foreach ($_FILES["files"]["tmp_name"] as $i => $tmp) {

    $original = $_FILES["files"]["name"][$i];

    $error = $_FILES["files"]["error"][$i];

    if ($error !== UPLOAD_ERR_OK) {
        continue;
    }

    $ext = strtolower(
        pathinfo($original, PATHINFO_EXTENSION)
    );

    if (!in_array($ext, $permitidos)) {
        continue;
    }

    $nuevoNombre =
        uniqid() .
        "_" .
        time() .
        "." .
        $ext;

    $ruta = $dir . $nuevoNombre;

    if (!move_uploaded_file($tmp, $ruta)) {
        continue;
    }

    /* =========================================
       INSERT ARCHIVO
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
            'RENDICION',
            ?,
            ?,
            ?,
            ?
        )
    ");

    if (!$stmtArchivo) {
        continue;
    }

    $stmtArchivo->bind_param(
        "isssi",
        $solicitud_id,
        $original,
        $nuevoNombre,
        $ruta,
        $usuario_id
    );

    $stmtArchivo->execute();

    $subidos[] = [
        "archivo" => $nuevoNombre,
        "ruta" => $ruta
    ];
}

/* =========================================
   VALIDAR SUBIDOS
========================================= */

if (count($subidos) === 0) {

    echo json_encode([
        "success" => false,
        "message" => "No se pudo subir archivos"
    ]);

    exit;
}

/* =========================================
   DEFINIR NUEVO ESTADO
========================================= */

$nuevoEstado = "EN_RENDICION";

/* =========================================
   ADELANTO
========================================= */

if ($tipo === "ADELANTO") {

    /*
        diferencia > 0
        SOBRÓ DINERO
        usuario devuelve
    */

    if ($diferencia > 0) {

        $nuevoEstado = "POR_DEVOLVER";
    }

    /*
        diferencia < 0
        FALTÓ DINERO
        tesorería reembolsa
    */

    else if ($diferencia < 0) {

        $nuevoEstado = "POR_REEMBOLSAR";
    }

    /*
        diferencia == 0
    */

    else {

        $nuevoEstado = "CERRADO";
    }
}

/* =========================================
   REEMBOLSO
========================================= */

if ($tipo === "REEMBOLSO") {

    /*
        En reembolso:
        siempre tesorería paga luego
    */

    $nuevoEstado = "POR_REEMBOLSAR";
}

/* =========================================
   ACTUALIZAR SOLICITUD
========================================= */

$stmtUpdate = $conn->prepare("
    UPDATE solicitudes_fondo
    SET
        estado=?,
        diferencia=?
    WHERE id=?
");

if (!$stmtUpdate) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$stmtUpdate->bind_param(
    "sdi",
    $nuevoEstado,
    $diferencia,
    $solicitud_id
);

$stmtUpdate->execute();

/* =========================================
   HISTORIAL
========================================= */

$descripcion = "Se subieron archivos de rendición";

if ($nuevoEstado === "POR_REEMBOLSAR") {

    $descripcion =
        "Rendición subida. Pendiente reembolso de tesorería";
}

if ($nuevoEstado === "POR_DEVOLVER") {

    $descripcion =
        "Rendición subida. Pendiente devolución de dinero";
}

if ($nuevoEstado === "CERRADO") {

    $descripcion =
        "Rendición cuadrada correctamente";
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
        'RENDICION',
        ?
    )
");

if ($stmtHist) {

    $stmtHist->bind_param(
        "iis",
        $solicitud_id,
        $usuario_id,
        $descripcion
    );

    $stmtHist->execute();
}

/* =========================================
   RESPONSE
========================================= */

echo json_encode([
    "success" => true,
    "message" => "Rendición subida correctamente",
    "estado" => $nuevoEstado,
    "diferencia" => $diferencia,
    "files" => $subidos
]);

$conn->close();
?>