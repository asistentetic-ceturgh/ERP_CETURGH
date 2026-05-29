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

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);
    exit;
}

$accion = strtoupper(trim($data["accion"] ?? ""));
$solicitud_id = intval($data["solicitud_id"] ?? 0);
$usuario_id = intval($data["usuario_id"] ?? 0);
$observacion = trim($data["observacion"] ?? "");
$monto_rendido = floatval($data["monto_rendido"] ?? 0);
$diferencia = floatval($data["diferencia"] ?? 0);

/* =========================================
   VALIDAR INPUT
========================================= */

if ($solicitud_id <= 0 || $usuario_id <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);
    exit;
}

/* =========================================
   USUARIO
========================================= */

$sqlUsuario = "SELECT u.id, u.nombre, u.tipo FROM usuarios u WHERE u.id = ? LIMIT 1";
$stmt = $conn->prepare($sqlUsuario);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Usuario no existe"
    ]);
    exit;
}

$usuario = $res->fetch_assoc();
$tipo_usuario = strtolower(trim($usuario["tipo"] ?? ""));

/* =========================================
   DEPARTAMENTOS
========================================= */

$sqlDeps = "
SELECT d.nombre
FROM usuarios_departamentos ud
INNER JOIN departamentos d ON d.id = ud.departamento_id
WHERE ud.usuario_id = ?";
$stmt = $conn->prepare($sqlDeps);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$res = $stmt->get_result();

$departamentos = [];
while ($row = $res->fetch_assoc()) {
    $departamentos[] = strtoupper(trim($row["nombre"]));
}

/* =========================================
   FLAGS
========================================= */

$esTIC = in_array("TIC", $departamentos);
$esTesoreria = in_array("TESORERIA", $departamentos) || in_array("TESORERÍA", $departamentos);
$esAdmin = in_array("ADMINISTRACION", $departamentos) || in_array("ADMINISTRACIÓN", $departamentos) || in_array("ADMIN", $departamentos);
$esJefe = ($tipo_usuario === "jefe");

/* =========================================
   SOLICITUD
========================================= */

$sqlSolicitud = "SELECT * FROM solicitudes_fondo WHERE id = ? LIMIT 1";
$stmt = $conn->prepare($sqlSolicitud);
$stmt->bind_param("i", $solicitud_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Solicitud no existe"
    ]);
    exit;
}

$solicitud = $res->fetch_assoc();
$estado_actual = strtoupper(trim($solicitud["estado"] ?? ""));
$tipoSolicitud = strtoupper(trim($solicitud["tipo"] ?? ""));
$esSolicitante = intval($solicitud["solicitante_id"]) === $usuario_id;

// Función para recalcular montos desde solicitud_gastos
function recalcularMontos($conn, $solicitud_id, $monto_solicitado) {
    $sumGastos = $conn->prepare("SELECT COALESCE(SUM(monto), 0) as total FROM solicitud_gastos WHERE solicitud_id = ?");
    $sumGastos->bind_param("i", $solicitud_id);
    $sumGastos->execute();
    $totalRendido = floatval($sumGastos->get_result()->fetch_assoc()["total"] ?? 0);
    $diferencia = $monto_solicitado - $totalRendido;
    
    $update = $conn->prepare("UPDATE solicitudes_fondo SET monto_rendido = ?, diferencia = ? WHERE id = ?");
    $update->bind_param("ddi", $totalRendido, $diferencia, $solicitud_id);
    $update->execute();
    
    return ["total_rendido" => $totalRendido, "diferencia" => $diferencia];
}

/* =========================================
   ACCIÓN: ENVIAR_RENDICION (después de agregar gastos)
========================================= */

if ($accion === "ENVIAR_RENDICION") {
    // Solo el solicitante puede enviar la rendición
    if (!$esSolicitante) {
        echo json_encode([
            "success" => false,
            "message" => "Solo el solicitante puede enviar la rendición"
        ]);
        exit;
    }

    // Verificar que haya al menos un gasto registrado
    $checkGastos = $conn->prepare("SELECT COUNT(*) as total FROM solicitud_gastos WHERE solicitud_id = ?");
    $checkGastos->bind_param("i", $solicitud_id);
    $checkGastos->execute();
    $gastosCount = $checkGastos->get_result()->fetch_assoc()["total"];
    
    if ($gastosCount == 0) {
        echo json_encode([
            "success" => false,
            "message" => "Debe registrar al menos un gasto antes de enviar la rendición"
        ]);
        exit;
    }

    // Recalcular montos
    $montos = recalcularMontos($conn, $solicitud_id, floatval($solicitud["monto_solicitado"]));
    $totalRendido = $montos["total_rendido"];
    $diferencia = $montos["diferencia"];

    // Determinar nuevo estado según tipo y diferencia
    $nuevoEstado = "";
    
    if ($tipoSolicitud === "ADELANTO" || $tipoSolicitud === "VIATICOS") {
        // Anticipo y Viáticos: después de enviar rendición, evaluar diferencia
        if ($diferencia > 0) {
            $nuevoEstado = "POR_DEVOLVER";  // Sobró dinero, solicitante debe devolver
        } else if ($diferencia < 0) {
            $nuevoEstado = "POR_REEMBOLSAR"; // Faltó dinero, tesorería debe reembolsar
        } else {
            $nuevoEstado = "CERRADO"; // Cuadrada perfecta
        }
    } else if ($tipoSolicitud === "REEMBOLSO") {
        // Reembolso: después de enviar sustento, queda pendiente de pago
        $nuevoEstado = "POR_REEMBOLSAR";
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Tipo de solicitud inválido"
        ]);
        exit;
    }

    // Actualizar estado
    $sql = "UPDATE solicitudes_fondo SET estado = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $nuevoEstado, $solicitud_id);
    
    $descripcion = "Rendición enviada a tesorería con " . $gastosCount . " gastos registrados. Total rendido: S/ " . number_format($totalRendido, 2);
    if ($diferencia > 0) {
        $descripcion .= ". Diferencia de S/ " . number_format($diferencia, 2) . " a favor de la cooperativa (solicitante debe devolver).";
    } else if ($diferencia < 0) {
        $descripcion .= ". Diferencia de S/ " . number_format(abs($diferencia), 2) . " a favor del solicitante (tesorería debe reembolsar).";
    } else {
        $descripcion .= ". Rendición cuadrada correctamente.";
    }
    
    if ($stmt->execute()) {
        $hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
        $hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $descripcion);
        $hist->execute();
        
        echo json_encode([
            "success" => true,
            "message" => "Rendición enviada correctamente a tesorería",
            "estado" => $nuevoEstado,
            "total_rendido" => $totalRendido,
            "diferencia" => $diferencia
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $stmt->error
        ]);
    }
    exit;
}

/* =========================================
   ACCIÓN: FIRMAR
========================================= */

if ($accion === "FIRMAR") {
    if (!($esTIC || ($esJefe && $esSolicitante))) {
        echo json_encode(["success" => false, "message" => "No autorizado para firmar"]); 
        exit;
    }
    if ($estado_actual !== "SIN_FIRMAR") {
        echo json_encode(["success" => false, "message" => "La solicitud ya fue firmada o no está en estado SIN_FIRMAR"]); 
        exit;
    }
    $nuevoEstado = "PENDIENTE";
    $sql = "UPDATE solicitudes_fondo SET estado=?, firmado_por=?, fecha_firma=NOW() WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sii", $nuevoEstado, $usuario_id, $solicitud_id);
    $descripcion = "Solicitud firmada por el jefe de departamento";
    
    if ($stmt->execute()) {
        $hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
        $hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $descripcion);
        $hist->execute();
        echo json_encode(["success" => true, "message" => "Solicitud firmada correctamente", "estado" => $nuevoEstado]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

/* =========================================
   ACCIÓN: APROBAR
========================================= */

if ($accion === "APROBAR") {
    if (!($esTIC || ($esAdmin && $esJefe))) {
        echo json_encode(["success" => false, "message" => "No autorizado para aprobar"]); 
        exit;
    }
    if ($estado_actual !== "PENDIENTE") {
        echo json_encode(["success" => false, "message" => "La solicitud debe estar PENDIENTE para aprobarse"]); 
        exit;
    }
    $nuevoEstado = "APROBADO";
    $sql = "UPDATE solicitudes_fondo SET estado=?, aprobado_por=?, fecha_aprobacion=NOW() WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sii", $nuevoEstado, $usuario_id, $solicitud_id);
    $descripcion = "Solicitud aprobada por administración";
    
    if ($stmt->execute()) {
        $hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
        $hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $descripcion);
        $hist->execute();
        echo json_encode(["success" => true, "message" => "Solicitud aprobada correctamente", "estado" => $nuevoEstado]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

/* =========================================
   ACCIÓN: RECHAZAR
========================================= */

if ($accion === "RECHAZAR") {
    if (!($esTIC || $esAdmin || $esJefe)) {
        echo json_encode(["success" => false, "message" => "No autorizado para rechazar"]); 
        exit;
    }
    if ($estado_actual !== "PENDIENTE") {
        echo json_encode(["success" => false, "message" => "Solo se pueden rechazar solicitudes en estado PENDIENTE"]); 
        exit;
    }
    $nuevoEstado = "RECHAZADO";
    $sql = "UPDATE solicitudes_fondo SET estado=?, observaciones=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $nuevoEstado, $observacion, $solicitud_id);
    $descripcion = "Solicitud rechazada. Motivo: " . ($observacion ?: "No especificado");
    
    if ($stmt->execute()) {
        $hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
        $hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $descripcion);
        $hist->execute();
        echo json_encode(["success" => true, "message" => "Solicitud rechazada", "estado" => $nuevoEstado]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

/* =========================================
   ACCIÓN: PAGAR (para ANTICIPO, REEMBOLSO y VIATICOS)
========================================= */

if ($accion === "PAGAR") {
    if (!($esTIC || $esTesoreria)) {
        echo json_encode(["success" => false, "message" => "No autorizado para pagar. Solo Tesorería o TIC"]); 
        exit;
    }
    
    // Recalcular montos desde solicitud_gastos
    $montos = recalcularMontos($conn, $solicitud_id, floatval($solicitud["monto_solicitado"]));
    $totalRendido = $montos["total_rendido"];
    $diferencia = $montos["diferencia"];
    
    // Validar según tipo y estado actual
    $nuevoEstado = "";
    $permitido = false;
    
    if ($tipoSolicitud === "ADELANTO") {
        // Anticipo: se paga cuando está APROBADO
        if ($estado_actual === "APROBADO") {
            $permitido = true;
            $nuevoEstado = "PAGADO";
        } else {
            echo json_encode(["success" => false, "message" => "El anticipo debe estar APROBADO para pagar. Estado actual: $estado_actual"]); 
            exit;
        }
    } 
    else if ($tipoSolicitud === "VIATICOS") {
        // Viáticos: se paga cuando está APROBADO (igual que anticipo)
        if ($estado_actual === "APROBADO") {
            $permitido = true;
            $nuevoEstado = "PAGADO";
        } else {
            echo json_encode(["success" => false, "message" => "Los viáticos deben estar APROBADOS para pagar. Estado actual: $estado_actual"]); 
            exit;
        }
    }
    else if ($tipoSolicitud === "REEMBOLSO") {
        // Reembolso: se paga después de la rendición (POR_REEMBOLSAR)
        if ($estado_actual === "POR_REEMBOLSAR" || $estado_actual === "EN_RENDICION") {
            $permitido = true;
            $nuevoEstado = "CERRADO";
        } else {
            echo json_encode(["success" => false, "message" => "El reembolso debe tener la rendición enviada para pagar. Estado actual: $estado_actual"]); 
            exit;
        }
    }
    else {
        echo json_encode(["success" => false, "message" => "Tipo de solicitud inválido: $tipoSolicitud"]); 
        exit;
    }
    
    if (!$permitido) {
        echo json_encode(["success" => false, "message" => "No se puede procesar el pago en el estado actual: $estado_actual para tipo $tipoSolicitud"]); 
        exit;
    }
    
    // Actualizar solicitud con estado, pagado_por, fecha_pago, y montos
    $sql = "UPDATE solicitudes_fondo SET estado=?, pagado_por=?, fecha_pago=NOW(), monto_rendido=?, diferencia=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("siidi", $nuevoEstado, $usuario_id, $totalRendido, $diferencia, $solicitud_id);
    
    $montoPagadoDesc = ($tipoSolicitud === "REEMBOLSO") ? $totalRendido : $solicitud["monto_solicitado"];
    $descripcion = "Pago registrado por tesorería por S/ " . number_format($montoPagadoDesc, 2);
    
    if ($tipoSolicitud === "ADELANTO" || $tipoSolicitud === "VIATICOS") {
        $descripcion = "Desembolso realizado por S/ " . number_format($solicitud["monto_solicitado"], 2) . ". Pendiente de rendición.";
    } else if ($tipoSolicitud === "REEMBOLSO") {
        if ($diferencia < 0) {
            $descripcion = "Reembolso realizado por S/ " . number_format(abs($diferencia), 2) . " (diferencia a favor del solicitante). Proceso cerrado.";
        } else {
            $descripcion = "Reembolso realizado por S/ " . number_format($totalRendido, 2) . ". Proceso cerrado correctamente.";
        }
    }
    
    if ($stmt->execute()) {
        $hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
        $hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $descripcion);
        $hist->execute();
        
        echo json_encode([
            "success" => true, 
            "message" => "Pago registrado correctamente", 
            "estado" => $nuevoEstado,
            "monto_rendido" => $totalRendido,
            "diferencia" => $diferencia
        ]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

/* =========================================
   ACCIÓN: DEVOLVER (cuando el solicitante devuelve dinero que sobró)
========================================= */

if ($accion === "DEVOLVER") {
    if (!($esTIC || $esTesoreria)) {
        echo json_encode(["success" => false, "message" => "No autorizado para registrar devolución"]); 
        exit;
    }
    
    if ($estado_actual !== "POR_DEVOLVER") {
        echo json_encode(["success" => false, "message" => "La solicitud debe estar en estado POR_DEVOLVER"]); 
        exit;
    }
    
    $nuevoEstado = "CERRADO";
    $sql = "UPDATE solicitudes_fondo SET estado=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $nuevoEstado, $solicitud_id);
    $descripcion = "Devolución registrada. Proceso cerrado.";
    
    if ($stmt->execute()) {
        $hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
        $hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $descripcion);
        $hist->execute();
        
        echo json_encode([
            "success" => true, 
            "message" => "Devolución registrada correctamente", 
            "estado" => $nuevoEstado
        ]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

/* =========================================
   ACCIÓN: REEMBOLSAR (cuando tesorería paga la diferencia que faltó)
========================================= */

if ($accion === "REEMBOLSAR") {
    if (!($esTIC || $esTesoreria)) {
        echo json_encode(["success" => false, "message" => "No autorizado para registrar reembolso"]); 
        exit;
    }
    
    if ($estado_actual !== "POR_REEMBOLSAR") {
        echo json_encode(["success" => false, "message" => "La solicitud debe estar en estado POR_REEMBOLSAR"]); 
        exit;
    }
    
    $nuevoEstado = "CERRADO";
    $sql = "UPDATE solicitudes_fondo SET estado=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $nuevoEstado, $solicitud_id);
    $descripcion = "Reembolso de diferencia registrado. Proceso cerrado.";
    
    if ($stmt->execute()) {
        $hist = $conn->prepare("INSERT INTO solicitud_historial (solicitud_id, usuario_id, accion, descripcion) VALUES (?, ?, ?, ?)");
        $hist->bind_param("iiss", $solicitud_id, $usuario_id, $accion, $descripcion);
        $hist->execute();
        
        echo json_encode([
            "success" => true, 
            "message" => "Reembolso registrado correctamente", 
            "estado" => $nuevoEstado
        ]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

/* =========================================
   ACCIÓN NO VÁLIDA
========================================= */

echo json_encode(["success" => false, "message" => "Acción inválida: " . $accion]);
$conn->close();
?>