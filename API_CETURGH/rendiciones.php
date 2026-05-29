<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

/**
 * Genera el siguiente número de rendición usando la tabla correlativos
 * Formato: REND-YYYY-XXXXX (ej: REND-2026-00001)
 */
function getNextCorrelativoRendicion($conn) {
    $anio = date('Y');
    $tipo = 'REND';
    
    $conn->begin_transaction();
    try {
        // Verificar si existe el registro para este año
        $check = $conn->prepare("SELECT numero_actual FROM correlativos WHERE tipo = ? AND anio = ? FOR UPDATE");
        $check->bind_param("si", $tipo, $anio);
        $check->execute();
        $res = $check->get_result();
        
        if ($res->num_rows == 0) {
            // Insertar nuevo registro para el año actual
            $insert = $conn->prepare("INSERT INTO correlativos (tipo, anio, numero_actual) VALUES (?, ?, 1)");
            $insert->bind_param("si", $tipo, $anio);
            $insert->execute();
            $numero = 1;
        } else {
            $row = $res->fetch_assoc();
            $numero = $row['numero_actual'] + 1;
            $update = $conn->prepare("UPDATE correlativos SET numero_actual = ? WHERE tipo = ? AND anio = ?");
            $update->bind_param("isi", $numero, $tipo, $anio);
            $update->execute();
        }
        $conn->commit();
        return "{$tipo}-{$anio}-" . str_pad($numero, 5, "0", STR_PAD_LEFT);
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
}

// ==================== GET ====================
if ($method === 'GET') {
    $caja_id = isset($_GET['caja_id']) ? intval($_GET['caja_id']) : 0;
    $rendicion_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($rendicion_id > 0) {
        $sql = "SELECT * FROM rendiciones_caja WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $rendicion_id);
        $stmt->execute();
        $rendicion = $stmt->get_result()->fetch_assoc();
        if (!$rendicion) {
            echo json_encode(["ok" => false, "error" => "Rendición no encontrada"]);
            exit();
        }
        $sqlItems = "SELECT * FROM rendicion_items WHERE rendicion_id = ? ORDER BY id";
        $stmtItems = $conn->prepare($sqlItems);
        $stmtItems->bind_param("i", $rendicion_id);
        $stmtItems->execute();
        $items = $stmtItems->get_result()->fetch_all(MYSQLI_ASSOC);
        $rendicion['items'] = $items;
        echo json_encode(["ok" => true, "data" => $rendicion]);
        exit();
    }
    
    if ($caja_id <= 0) {
        echo json_encode(["ok" => false, "error" => "Se requiere caja_id"]);
        exit();
    }
    
    $sql = "
        SELECT r.*, 
               (SELECT COUNT(*) FROM rendicion_items WHERE rendicion_id = r.id) as items_count
        FROM rendiciones_caja r
        WHERE r.caja_id = ?
        ORDER BY r.created_at DESC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $caja_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $rendiciones = [];
    while ($row = $result->fetch_assoc()) {
        $rendiciones[] = $row;
    }
    echo json_encode(["ok" => true, "data" => $rendiciones]);
    exit();
}

// ==================== POST ====================
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['caja_id']) || empty($input['items'])) {
        echo json_encode(["ok" => false, "error" => "Faltan datos: caja_id o items"]);
        exit();
    }
    
    $caja_id = intval($input['caja_id']);
    // GENERAR NÚMERO AUTOMÁTICAMENTE (ignorar lo que venga del frontend)
    try {
        $numero = getNextCorrelativoRendicion($conn);
    } catch (Exception $e) {
        echo json_encode(["ok" => false, "error" => "Error al generar correlativo: " . $e->getMessage()]);
        exit();
    }
    
    $fecha_rendicion = $input['fecha_rendicion'];
    $saldo_inicial = floatval($input['saldo_inicial']);
    $total_rendido = floatval($input['total_rendido']);
    $saldo_final = floatval($input['saldo_final']);
    // Estados permitidos al crear: 'BORRADOR' o 'ENVIADO' (el usuario puede enviar directamente a tesorería)
    $estado = $input['estado'];
    if (!in_array($estado, ['BORRADOR', 'ENVIADO'])) {
        echo json_encode(["ok" => false, "error" => "Estado no válido. Use 'BORRADOR' o 'ENVIADO'"]);
        exit();
    }
    $created_by = isset($input['created_by']) ? intval($input['created_by']) : 1;
    
    $conn->begin_transaction();
    try {
        // Insertar cabecera
        $sqlCab = "INSERT INTO rendiciones_caja 
                   (caja_id, numero, fecha_rendicion, saldo_inicial, total_rendido, saldo_final, estado, created_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmtCab = $conn->prepare($sqlCab);
        $stmtCab->bind_param("issdddsi", $caja_id, $numero, $fecha_rendicion, $saldo_inicial, $total_rendido, $saldo_final, $estado, $created_by);
        $stmtCab->execute();
        $rendicion_id = $conn->insert_id;
        
        // Insertar items
        $sqlItem = "INSERT INTO rendicion_items 
                    (rendicion_id, fecha, proveedor, ruc_dni, tipo_documento, numero_documento, descripcion, monto)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmtItem = $conn->prepare($sqlItem);
        foreach ($input['items'] as $item) {
            $fecha = $item['fecha'];
            $proveedor = $item['proveedor'];
            $ruc_dni = $item['ruc_dni'];
            $tipo_doc = $item['tipo_documento'];
            $num_doc = $item['numero_documento'];
            $descripcion = $item['descripcion'];
            $monto = floatval($item['monto']);
            $stmtItem->bind_param("issssssd", $rendicion_id, $fecha, $proveedor, $ruc_dni, $tipo_doc, $num_doc, $descripcion, $monto);
            $stmtItem->execute();
        }
        $stmtItem->close();
        
        // NOTA: No se actualiza el saldo de la caja hasta que la rendición sea APROBADA (vía PUT)
        // Si se crea como ENVIADO, solo se guarda; el flujo continuará con PUT.
        
        $conn->commit();
        echo json_encode(["ok" => true, "id" => $rendicion_id, "numero" => $numero, "message" => "Rendición guardada como {$estado}"]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["ok" => false, "error" => "Error al guardar: " . $e->getMessage()]);
    }
    exit();
}

// ==================== PUT ====================
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    $rendicion_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    $nuevo_estado = $input['estado'] ?? '';
    $observacion = $input['observacion'] ?? null; // opcional para OBSERVADO
    
    if (!$rendicion_id || !in_array($nuevo_estado, ['ENVIADO', 'OBSERVADO', 'APROBADO'])) {
        echo json_encode(["ok" => false, "error" => "Estado no válido. Use ENVIADO, OBSERVADO o APROBADO"]);
        exit();
    }
    
    // Obtener datos actuales
    $sql = "SELECT caja_id, total_rendido, estado FROM rendiciones_caja WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $rendicion_id);
    $stmt->execute();
    $rend = $stmt->get_result()->fetch_assoc();
    if (!$rend) {
        echo json_encode(["ok" => false, "error" => "Rendición no encontrada"]);
        exit();
    }
    
    $estado_actual = $rend['estado'];
    
    // Validar transiciones permitidas
    $transiciones = [
        'BORRADOR' => ['ENVIADO', 'OBSERVADO'],
        'ENVIADO'  => ['APROBADO', 'OBSERVADO'],
        'OBSERVADO'=> ['ENVIADO', 'APROBADO']
    ];
    if (!isset($transiciones[$estado_actual]) || !in_array($nuevo_estado, $transiciones[$estado_actual])) {
        echo json_encode(["ok" => false, "error" => "Transición de estado no permitida: de {$estado_actual} a {$nuevo_estado}"]);
        exit();
    }
    
    $conn->begin_transaction();
    try {
        // Actualizar estado (y opcionalmente guardar observación en algún campo, por ejemplo en descripción o crear tabla observaciones)
        $sqlUp = "UPDATE rendiciones_caja SET estado = ? WHERE id = ?";
        $stmtUp = $conn->prepare($sqlUp);
        $stmtUp->bind_param("si", $nuevo_estado, $rendicion_id);
        $stmtUp->execute();
        
        // Si se aprueba, actualizar saldo de la caja y registrar movimiento
        if ($nuevo_estado === 'APROBADO') {
            $caja_id = $rend['caja_id'];
            $total_rendido = $rend['total_rendido'];
            
            // Bloquear la fila de la caja para actualización
            $sqlSaldo = "SELECT saldo_actual FROM cajas_chicas WHERE id = ? FOR UPDATE";
            $stmtSaldo = $conn->prepare($sqlSaldo);
            $stmtSaldo->bind_param("i", $caja_id);
            $stmtSaldo->execute();
            $saldo_actual = $stmtSaldo->get_result()->fetch_assoc()['saldo_actual'];
            $nuevo_saldo = $saldo_actual - $total_rendido;
            if ($nuevo_saldo < 0) $nuevo_saldo = 0;
            $estado_caja = ($nuevo_saldo <= 0) ? 'AGOTADA' : 'ACTIVA';
            
            $sqlUpdate = "UPDATE cajas_chicas SET saldo_actual = ?, estado = ? WHERE id = ?";
            $stmtUpdate = $conn->prepare($sqlUpdate);
            $stmtUpdate->bind_param("dsi", $nuevo_saldo, $estado_caja, $caja_id);
            $stmtUpdate->execute();
            
            // Registrar movimiento
            $sqlMov = "INSERT INTO movimientos_caja (caja_id, tipo, referencia_id, salida, saldo_resultante, descripcion)
                       VALUES (?, 'RENDICION', ?, ?, ?, 'Rendición aprobada')";
            $stmtMov = $conn->prepare($sqlMov);
            $stmtMov->bind_param("iidd", $caja_id, $rendicion_id, $total_rendido, $nuevo_saldo);
            $stmtMov->execute();
        }
        
        $conn->commit();
        echo json_encode(["ok" => true, "message" => "Estado actualizado a {$nuevo_estado}"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["ok" => false, "error" => "Método no permitido"]);
?>