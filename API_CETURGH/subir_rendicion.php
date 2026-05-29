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

$solicitud_id = intval($_POST["solicitud_id"] ?? 0);
$usuario_id   = intval($_POST["usuario_id"] ?? 0);

if ($solicitud_id <= 0 || $usuario_id <= 0) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

if (!isset($_FILES["files"]) || empty($_FILES["files"]["name"][0])) {
    echo json_encode(["success" => false, "message" => "No se recibieron archivos"]);
    exit;
}

// Obtener solicitud y sus gastos
$stmt = $conn->prepare("
    SELECT s.id, s.tipo, s.estado, s.monto_solicitado, 
           COALESCE(SUM(g.monto), 0) as monto_rendido_real
    FROM solicitudes_fondo s
    LEFT JOIN solicitud_gastos g ON g.solicitud_id = s.id
    WHERE s.id = ?
    GROUP BY s.id
");
$stmt->bind_param("i", $solicitud_id);
$stmt->execute();
$sol = $stmt->get_result()->fetch_assoc();

if (!$sol) {
    echo json_encode(["success" => false, "message" => "Solicitud no existe"]);
    exit;
}

$tipo = strtoupper(trim($sol["tipo"] ?? ""));
$estado = strtoupper(trim($sol["estado"] ?? ""));
$montoSolicitado = floatval($sol["monto_solicitado"] ?? 0);
$montoRendidoReal = floatval($sol["monto_rendido_real"] ?? 0);
$diferencia = $montoSolicitado - $montoRendidoReal;

// Validar estado permitido para subir archivos
$permitido = false;

if ($tipo === "ADELANTO") {
    // Anticipo: puede subir rendición después de pagado
    if ($estado === "PAGADO" || $estado === "EN_RENDICION") {
        $permitido = true;
    }
} else if ($tipo === "VIATICOS") {
    // Viáticos: puede subir rendición después de pagado (igual que anticipo)
    if ($estado === "PAGADO" || $estado === "EN_RENDICION") {
        $permitido = true;
    }
} else if ($tipo === "REEMBOLSO") {
    // Reembolso: puede subir sustento después de aprobado
    if ($estado === "APROBADO" || $estado === "EN_RENDICION") {
        $permitido = true;
    }
}

if (!$permitido) {
    echo json_encode([
        "success" => false,
        "message" => "La solicitud no puede rendirse en el estado actual: $estado para tipo $tipo"
    ]);
    exit;
}

// Subir archivos
$dir = "uploads/rendiciones/";
if (!file_exists($dir)) mkdir($dir, 0777, true);

$permitidos = ["pdf", "jpg", "jpeg", "png"];
$subidos = [];

foreach ($_FILES["files"]["tmp_name"] as $i => $tmp) {
    $original = $_FILES["files"]["name"][$i];
    $error = $_FILES["files"]["error"][$i];
    if ($error !== UPLOAD_ERR_OK) continue;

    $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
    if (!in_array($ext, $permitidos)) continue;

    $nuevoNombre = uniqid() . "_" . time() . "." . $ext;
    $ruta = $dir . $nuevoNombre;

    if (!move_uploaded_file($tmp, $ruta)) continue;

    $stmtArchivo = $conn->prepare("
        INSERT INTO solicitud_archivos (solicitud_id, tipo, nombre_original, nombre_guardado, ruta, subido_por)
        VALUES (?, 'RENDICION', ?, ?, ?, ?)
    ");
    if ($stmtArchivo) {
        $stmtArchivo->bind_param("isssi", $solicitud_id, $original, $nuevoNombre, $ruta, $usuario_id);
        $stmtArchivo->execute();
        $subidos[] = ["archivo" => $nuevoNombre, "ruta" => $ruta];
    }
}

if (count($subidos) === 0) {
    echo json_encode(["success" => false, "message" => "No se pudo subir archivos"]);
    exit;
}

// Definir nuevo estado según tipo y diferencia
$nuevoEstado = "EN_RENDICION";

if ($tipo === "ADELANTO" || $tipo === "VIATICOS") {
    // Anticipo y Viáticos: después de subir rendición, revisar diferencia
    if ($diferencia > 0) {
        $nuevoEstado = "POR_DEVOLVER";  // Sobró dinero, solicitante debe devolver
    } else if ($diferencia < 0) {
        $nuevoEstado = "POR_REEMBOLSAR"; // Faltó dinero, tesorería debe reembolsar
    } else {
        $nuevoEstado = "CERRADO"; // Cuadrada perfecta
    }
} else if ($tipo === "REEMBOLSO") {
    // Reembolso: después de subir sustento, queda pendiente de pago
    $nuevoEstado = "POR_REEMBOLSAR";
}

// Actualizar solicitud con monto_rendido y diferencia reales
$stmtUpdate = $conn->prepare("
    UPDATE solicitudes_fondo
    SET estado=?, monto_rendido=?, diferencia=?
    WHERE id=?
");
$stmtUpdate->bind_param("sddi", $nuevoEstado, $montoRendidoReal, $diferencia, $solicitud_id);
$stmtUpdate->execute();

// Historial
$descripcion = "Se subieron " . count($subidos) . " archivo(s) de rendición";
if ($nuevoEstado === "POR_REEMBOLSAR") {
    $descripcion = "Rendición subida. Diferencia de S/ " . number_format(abs($diferencia), 2) . " a favor del solicitante. Pendiente reembolso.";
} elseif ($nuevoEstado === "POR_DEVOLVER") {
    $descripcion = "Rendición subida. Diferencia de S/ " . number_format($diferencia, 2) . " a favor de la cooperativa. Pendiente devolución.";
} elseif ($nuevoEstado === "CERRADO") {
    $descripcion = "Rendición cuadrada correctamente. Total rendido: S/ " . number_format($montoRendidoReal, 2);
}

$stmtHist = $conn->prepare("
    INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion)
    VALUES (?, ?, 'RENDICION', ?)
");
if ($stmtHist) {
    $stmtHist->bind_param("iis", $solicitud_id, $usuario_id, $descripcion);
    $stmtHist->execute();
}

echo json_encode([
    "success" => true,
    "message" => "Archivos subidos correctamente",
    "estado" => $nuevoEstado,
    "monto_rendido" => $montoRendidoReal,
    "diferencia" => $diferencia,
    "files" => $subidos
]);

$conn->close();
?>