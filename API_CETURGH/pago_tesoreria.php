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
$monto_pagado = floatval($_POST["monto_pagado"] ?? 0);

if ($solicitud_id <= 0 || $usuario_id <= 0) {
    echo json_encode(["success" => false, "message" => "Datos inválidos"]);
    exit;
}

// Validar usuario (debe ser tesorería o TIC)
$stmt = $conn->prepare("SELECT tipo FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
if (!$user) {
    echo json_encode(["success" => false, "message" => "Usuario no existe"]);
    exit;
}

// Obtener solicitud con sus gastos
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

$tipo = $sol["tipo"];
$estado = $sol["estado"];
$monto_solicitado = floatval($sol["monto_solicitado"]);
$monto_rendido_real = floatval($sol["monto_rendido_real"]);
$diferencia = $monto_solicitado - $monto_rendido_real;

// Validar estado según tipo (NUEVA LÓGICA)
$permitido = false;
$nuevoEstado = "";

if ($tipo === "ADELANTO" || $tipo === "VIATICOS") {
    // Anticipo y Viáticos: se pagan cuando están APROBADO
    if ($estado === "APROBADO") {
        $permitido = true;
        $nuevoEstado = "PAGADO";
    }
} 
else if ($tipo === "REEMBOLSO") {
    // Reembolso: se paga después de que ADMIN aprueba la rendición (APROBADO)
    if ($estado === "APROBADO") {
        $permitido = true;
        $nuevoEstado = "CERRADO";
    }
}

if (!$permitido) {
    echo json_encode([
        "success" => false, 
        "message" => "Estado no válido para pago. Estado actual: $estado, Tipo: $tipo. Debe estar APROBADO."
    ]);
    exit;
}

// Validar archivo
if (!isset($_FILES["comprobante"]) || $_FILES["comprobante"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Debe subir comprobante"]);
    exit;
}

$file = $_FILES["comprobante"];
$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
$permitidos = ["pdf", "jpg", "jpeg", "png"];
if (!in_array($ext, $permitidos)) {
    echo json_encode(["success" => false, "message" => "Formato no permitido"]);
    exit;
}

$dir = "uploads/pagos/";
if (!file_exists($dir)) mkdir($dir, 0777, true);
$nombre = uniqid() . "_" . time() . "." . $ext;
$ruta = $dir . $nombre;
if (!move_uploaded_file($file["tmp_name"], $ruta)) {
    echo json_encode(["success" => false, "message" => "Error al guardar archivo"]);
    exit;
}

// Insertar archivo (tipo siempre PAGO_TESORERIA en este flujo)
$tipoArchivo = "PAGO_TESORERIA";
$stmtArch = $conn->prepare("INSERT INTO solicitud_archivos (solicitud_id, tipo, nombre_original, nombre_guardado, ruta, subido_por) VALUES (?, ?, ?, ?, ?, ?)");
$stmtArch->bind_param("issssi", $solicitud_id, $tipoArchivo, $file["name"], $nombre, $ruta, $usuario_id);
$stmtArch->execute();

// Actualizar solicitud con el monto_rendido real y diferencia
$update = $conn->prepare("UPDATE solicitudes_fondo SET estado = ?, pagado_por = ?, fecha_pago = NOW(), monto_rendido = ?, diferencia = ? WHERE id = ?");
$update->bind_param("siidi", $nuevoEstado, $usuario_id, $monto_rendido_real, $diferencia, $solicitud_id);
$update->execute();

// Historial
$hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
$accion = "PAGAR";
if ($tipo === "ADELANTO" || $tipo === "VIATICOS") {
    $desc = "Desembolso realizado por S/ " . number_format($monto_solicitado, 2) . ". Pendiente de rendición.";
} else {
    $desc = "Reembolso realizado por S/ " . number_format($monto_rendido_real, 2) . ". Proceso cerrado.";
}
$hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $desc);
$hist->execute();

echo json_encode([
    "success" => true, 
    "message" => "Pago registrado correctamente", 
    "estado" => $nuevoEstado,
    "monto_rendido" => $monto_rendido_real,
    "diferencia" => $diferencia
]);
$conn->close();
?>