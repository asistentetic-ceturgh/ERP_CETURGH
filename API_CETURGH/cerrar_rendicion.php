<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

/* =========================================
   OPTIONS
========================================= */

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {

    http_response_code(200);
    exit;
}

/* =========================================
   VALIDAR REQUEST
========================================= */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);

    exit;
}

/* =========================================
   INPUTS
========================================= */

$solicitud_id = intval($_POST["solicitud_id"] ?? 0);

$usuario_id = intval($_POST["usuario_id"] ?? 0);

/* =========================================
   VALIDAR INPUTS
========================================= */

if (
    $solicitud_id <= 0
    ||
    $usuario_id <= 0
) {

    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);

    exit;
}

/* =========================================
   VALIDAR ARCHIVO
========================================= */

if (
    !isset($_FILES["comprobante"])
    ||
    $_FILES["comprobante"]["error"] !== 0
) {

    echo json_encode([
        "success" => false,
        "message" => "Debe subir un comprobante válido"
    ]);

    exit;
}

/* =========================================
   VALIDAR SOLICITUD
========================================= */

$stmt = $conn->prepare("
SELECT
    id,
    estado,
    diferencia,
    tipo
FROM solicitudes_fondo
WHERE id = ?
LIMIT 1
");

$stmt->bind_param(
    "i",
    $solicitud_id
);

$stmt->execute();

$result = $stmt->get_result();

$solicitud = $result->fetch_assoc();

$stmt->close();

if (!$solicitud) {

    echo json_encode([
        "success" => false,
        "message" => "Solicitud no encontrada"
    ]);

    exit;
}

/* =========================================
   ESTADO ACTUAL
========================================= */

$estadoActual = strtoupper(
    trim($solicitud["estado"])
);

/* =========================================
   VALIDAR ESTADO
========================================= */

if (
    $estadoActual !== "POR_DEVOLVER"
    &&
    $estadoActual !== "POR_REEMBOLSAR"
) {

    echo json_encode([
        "success" => false,
        "message" => "La solicitud no puede cerrarse"
    ]);

    exit;
}

/* =========================================
   DEFINIR TIPO ARCHIVO
========================================= */

$tipoArchivo =
    $estadoActual === "POR_DEVOLVER"
    ? "DEVOLUCION"
    : "REEMBOLSO";

/* =========================================
   CONFIG UPLOAD
========================================= */

$dir = "uploads/cierre_rendicion/";

if (!file_exists($dir)) {

    mkdir(
        $dir,
        0777,
        true
    );
}

/* =========================================
   EXTENSION
========================================= */

$file = $_FILES["comprobante"];

$extension = strtolower(
    pathinfo(
        $file["name"],
        PATHINFO_EXTENSION
    )
);

$permitidos = [
    "pdf",
    "jpg",
    "jpeg",
    "png"
];

if (!in_array($extension, $permitidos)) {

    echo json_encode([
        "success" => false,
        "message" => "Formato no permitido"
    ]);

    exit;
}

/* =========================================
   GENERAR NOMBRE
========================================= */

$nombreGuardado =
    "CIERRE_" .
    $solicitud_id .
    "_" .
    time() .
    "." .
    $extension;

$rutaCompleta =
    $dir .
    $nombreGuardado;

/* =========================================
   MOVER ARCHIVO
========================================= */

if (
    !move_uploaded_file(
        $file["tmp_name"],
        $rutaCompleta
    )
) {

    echo json_encode([
        "success" => false,
        "message" => "No se pudo subir el archivo"
    ]);

    exit;
}

/* =========================================
   INSERTAR ARCHIVO
========================================= */

$stmt = $conn->prepare("
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

$nombreOriginal = $file["name"];

$stmt->bind_param(
    "issssi",
    $solicitud_id,
    $tipoArchivo,
    $nombreOriginal,
    $nombreGuardado,
    $rutaCompleta,
    $usuario_id
);

$stmt->execute();

$stmt->close();

/* =========================================
   ACTUALIZAR SOLICITUD
========================================= */

$stmt = $conn->prepare("
UPDATE solicitudes_fondo
SET
    estado = 'CERRADO'
WHERE id = ?
");

$stmt->bind_param(
    "i",
    $solicitud_id
);

$stmt->execute();

$stmt->close();

/* =========================================
   HISTORIAL
========================================= */

$descripcion =
    $estadoActual === "POR_DEVOLVER"
    ? "TESORERIA registró devolución del saldo sobrante"
    : "TESORERIA registró reembolso de diferencia";

/* =========================================
   INSERT HISTORIAL
========================================= */

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
    'CERRAR_RENDICION',
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

$stmt->close();

/* =========================================
   RESPONSE
========================================= */

echo json_encode([
    "success" => true,
    "message" => "Proceso cerrado correctamente",
    "estado" => "CERRADO",
    "tipo_archivo" => $tipoArchivo,
    "ruta" => $rutaCompleta
]);

$conn->close();