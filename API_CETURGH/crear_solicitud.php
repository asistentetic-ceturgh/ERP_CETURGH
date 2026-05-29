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

// Validar tipo permitido (ahora incluye VIATICOS)
$tiposPermitidos = ['ADELANTO', 'REEMBOLSO', 'VIATICOS'];
if (!in_array($tipo, $tiposPermitidos)) {
    exit(json_encode(["success"=>false,"message"=>"Tipo de solicitud no válido"]));
}

/* ========================= */
/* GENERAR CORRELATIVO */
/* ========================= */

$anio = date("Y");
$tipoCorrelativo = 'FND';

// Iniciar transacción
$conn->begin_transaction();

try {
    // Bloquear la fila para evitar concurrencia
    $stmtCorr = $conn->prepare("SELECT numero_actual FROM correlativos WHERE tipo = ? AND anio = ? FOR UPDATE");
    $stmtCorr->bind_param("si", $tipoCorrelativo, $anio);
    $stmtCorr->execute();
    $result = $stmtCorr->get_result();
    
    if ($result->num_rows > 0) {
        // Existe correlativo para este año, incrementar
        $row = $result->fetch_assoc();
        $numero = $row['numero_actual'] + 1;
        
        $stmtUpdate = $conn->prepare("UPDATE correlativos SET numero_actual = ? WHERE tipo = ? AND anio = ?");
        $stmtUpdate->bind_param("isi", $numero, $tipoCorrelativo, $anio);
        $stmtUpdate->execute();
    } else {
        // No existe correlativo para este año, crear con número 1
        $numero = 1;
        $stmtInsert = $conn->prepare("INSERT INTO correlativos (tipo, anio, numero_actual) VALUES (?, ?, ?)");
        $stmtInsert->bind_param("sii", $tipoCorrelativo, $anio, $numero);
        $stmtInsert->execute();
    }
    
    // Formatear código: FND-00001 (5 dígitos)
    $codigo = $tipoCorrelativo . "-" . str_pad($numero, 5, "0", STR_PAD_LEFT);
    
    /* ========================= */
    /* INSERTAR SOLICITUD */
    /* ========================= */
    
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
    )";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("SQL error: " . $conn->error);
    }
    
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
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }
    
    $id = $stmt->insert_id;
    
    // Registrar historial
    $historial = $conn->prepare("
        INSERT INTO solicitud_historial (
            solicitud_id,
            usuario_id,
            accion,
            descripcion
        ) VALUES (?, ?, ?, ?)
    ");
    
    $accion = "CREAR";
    $descripcion = "Solicitud creada con código: " . $codigo;
    
    $historial->bind_param("iiss", $id, $solicitante_id, $accion, $descripcion);
    $historial->execute();
    
    // Confirmar transacción
    $conn->commit();
    
    echo json_encode([
        "success" => true,
        "message" => "Solicitud creada correctamente",
        "id" => $id,
        "codigo" => $codigo,
        "estado" => "SIN_FIRMAR"
    ]);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conn->rollback();
    
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

$conn->close();
?>