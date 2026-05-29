<?php
ob_clean();
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

// Función para generar código automático de caja (solo si el usuario no ingresa uno)
function generarCodigoCaja($conn) {
    $anio = date('Y');
    $sql = "SELECT COUNT(*) as total FROM cajas_chicas WHERE codigo LIKE 'CC-{$anio}-%'";
    $res = $conn->query($sql);
    $row = $res->fetch_assoc();
    $num = $row['total'] + 1;
    return "CC-{$anio}-" . str_pad($num, 3, "0", STR_PAD_LEFT);
}

// ==================== GET ====================
if ($method === 'GET') {
    try {
        $estado = isset($_GET['estado']) ? $_GET['estado'] : '';
        $tipo = isset($_GET['tipo']) ? $_GET['tipo'] : '';
        
        $sql = "SELECT s.*, 
                       e.nombre as empresa_nombre, 
                       sed.nombre as sede_nombre,
                       cc.nombre as centro_costo_nombre
                FROM solicitudes_caja s
                LEFT JOIN empresas e ON s.empresa_id = e.id
                LEFT JOIN sedes sed ON s.sede_id = sed.id
                LEFT JOIN centros_costos cc ON s.centro_costo_id = cc.id
                WHERE 1=1";
        $params = [];
        $types = "";
        
        if ($estado) {
            $sql .= " AND s.estado = ?";
            $params[] = $estado;
            $types .= "s";
        }
        if ($tipo) {
            $sql .= " AND s.tipo = ?";
            $params[] = $tipo;
            $types .= "s";
        }
        $sql .= " ORDER BY s.created_at DESC";
        
        $stmt = $conn->prepare($sql);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $solicitudes = [];
        while ($row = $result->fetch_assoc()) {
            $solicitudes[] = $row;
        }
        echo json_encode(["ok" => true, "data" => $solicitudes]);
    } catch (Exception $e) {
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit();
}

// ==================== POST ====================
if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['tipo'], $input['monto'], $input['motivo'])) {
            throw new Exception("Faltan datos requeridos");
        }
        
        $tipo = $input['tipo'];
        $empresa_id = isset($input['empresa_id']) ? intval($input['empresa_id']) : null;
        $sede_id = isset($input['sede_id']) ? intval($input['sede_id']) : null;
        $centro_costo_id = isset($input['centro_costo_id']) ? intval($input['centro_costo_id']) : null;
        $monto = floatval($input['monto']);
        $motivo = $input['motivo'];
        $caja_id = isset($input['caja_id']) ? intval($input['caja_id']) : null;
        $created_by = isset($input['created_by']) ? intval($input['created_by']) : 1;
        $codigo_solicitado = isset($input['codigo']) ? trim($input['codigo']) : null; // Nuevo campo
        
        if ($tipo === 'APERTURA') {
            if (!$empresa_id || !$sede_id || !$centro_costo_id) {
                throw new Exception("Para apertura se requiere empresa, sede y centro de costo");
            }
            if (empty($codigo_solicitado)) {
                throw new Exception("Debe ingresar un nombre para la caja (código)");
            }
        }
        if ($tipo === 'RECARGA' && !$caja_id) {
            throw new Exception("Para recarga se requiere caja_id");
        }
        
        $estado = 'PENDIENTE_ADMIN';
        $sql = "INSERT INTO solicitudes_caja 
                (caja_id, tipo, empresa_id, sede_id, centro_costo_id, monto, motivo, estado, created_by, codigo_solicitado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isiiidssis", $caja_id, $tipo, $empresa_id, $sede_id, $centro_costo_id, $monto, $motivo, $estado, $created_by, $codigo_solicitado);
        
        if ($stmt->execute()) {
            $id = $conn->insert_id;
            echo json_encode(["ok" => true, "id" => $id, "message" => "Solicitud creada"]);
        } else {
            throw new Exception($stmt->error);
        }
    } catch (Exception $e) {
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit();
}

// ==================== PUT ====================
if ($method === 'PUT') {
    try {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $input = json_decode(file_get_contents('php://input'), true);
        $accion = $input['accion'] ?? '';
        $usuario_id = intval($input['usuario_id'] ?? 1);
        
        if (!$id || !in_array($accion, ['aprobar_admin', 'rechazar_admin', 'pagar'])) {
            throw new Exception("Acción inválida");
        }
        
        $conn->begin_transaction();
        
        $sqlSel = "SELECT * FROM solicitudes_caja WHERE id = ? FOR UPDATE";
        $stmtSel = $conn->prepare($sqlSel);
        $stmtSel->bind_param("i", $id);
        $stmtSel->execute();
        $solicitud = $stmtSel->get_result()->fetch_assoc();
        if (!$solicitud) {
            throw new Exception("Solicitud no encontrada");
        }
        
        if ($accion === 'aprobar_admin') {
            if ($solicitud['estado'] !== 'PENDIENTE_ADMIN') {
                throw new Exception("La solicitud no está pendiente de admin");
            }
            $nuevo_estado = 'APROBADO_ADMIN';
            $sqlUp = "UPDATE solicitudes_caja SET estado = ?, aprobado_admin_por = ?, fecha_aprobacion_admin = NOW() WHERE id = ?";
            $stmtUp = $conn->prepare($sqlUp);
            $stmtUp->bind_param("sii", $nuevo_estado, $usuario_id, $id);
            $stmtUp->execute();
        } 
        elseif ($accion === 'rechazar_admin') {
            if ($solicitud['estado'] !== 'PENDIENTE_ADMIN') {
                throw new Exception("La solicitud no está pendiente de admin");
            }
            $nuevo_estado = 'RECHAZADO_ADMIN';
            $sqlUp = "UPDATE solicitudes_caja SET estado = ?, aprobado_admin_por = ?, fecha_aprobacion_admin = NOW() WHERE id = ?";
            $stmtUp = $conn->prepare($sqlUp);
            $stmtUp->bind_param("sii", $nuevo_estado, $usuario_id, $id);
            $stmtUp->execute();
        }
        elseif ($accion === 'pagar') {
            if (!in_array($solicitud['estado'], ['APROBADO_ADMIN', 'PENDIENTE_TESORERIA'])) {
                throw new Exception("La solicitud no está lista para pago");
            }
            $voucher = $input['voucher'] ?? null;
            $nuevo_estado = 'PAGADO';
            $sqlUp = "UPDATE solicitudes_caja SET estado = ?, pagado_por = ?, fecha_pago = NOW(), voucher_pago = ? WHERE id = ?";
            $stmtUp = $conn->prepare($sqlUp);
            $stmtUp->bind_param("siss", $nuevo_estado, $usuario_id, $voucher, $id);
            $stmtUp->execute();
            
            if ($solicitud['tipo'] === 'APERTURA') {
                $codigo = !empty($solicitud['codigo_solicitado']) ? $solicitud['codigo_solicitado'] : generarCodigoCaja($conn);
                $sqlCaja = "INSERT INTO cajas_chicas (empresa_id, sede_id, centro_costo_id, codigo, monto_base, saldo_actual, estado)
                            VALUES (?, ?, ?, ?, ?, ?, 'ACTIVA')";
                $stmtCaja = $conn->prepare($sqlCaja);
                $stmtCaja->bind_param("iiisdd", $solicitud['empresa_id'], $solicitud['sede_id'], $solicitud['centro_costo_id'], $codigo, $solicitud['monto'], $solicitud['monto']);
                $stmtCaja->execute();
                $nuevaCajaId = $conn->insert_id;
                $sqlMov = "INSERT INTO movimientos_caja (caja_id, tipo, ingreso, saldo_resultante, descripcion) VALUES (?, 'APERTURA', ?, ?, 'Apertura por solicitud')";
                $stmtMov = $conn->prepare($sqlMov);
                $stmtMov->bind_param("idd", $nuevaCajaId, $solicitud['monto'], $solicitud['monto']);
                $stmtMov->execute();
                $sqlUpCaja = "UPDATE solicitudes_caja SET caja_id = ? WHERE id = ?";
                $stmtUpCaja = $conn->prepare($sqlUpCaja);
                $stmtUpCaja->bind_param("ii", $nuevaCajaId, $id);
                $stmtUpCaja->execute();
            } 
            elseif ($solicitud['tipo'] === 'RECARGA') {
                $caja_id = $solicitud['caja_id'];
                if (!$caja_id) throw new Exception("La solicitud de recarga no tiene caja asociada");
                $sqlSaldo = "UPDATE cajas_chicas SET saldo_actual = saldo_actual + ?, estado = 'ACTIVA' WHERE id = ?";
                $stmtSaldo = $conn->prepare($sqlSaldo);
                $stmtSaldo->bind_param("di", $solicitud['monto'], $caja_id);
                $stmtSaldo->execute();
                $sqlGet = "SELECT saldo_actual FROM cajas_chicas WHERE id = ?";
                $stmtGet = $conn->prepare($sqlGet);
                $stmtGet->bind_param("i", $caja_id);
                $stmtGet->execute();
                $nuevo_saldo = $stmtGet->get_result()->fetch_assoc()['saldo_actual'];
                $sqlMov = "INSERT INTO movimientos_caja (caja_id, tipo, ingreso, saldo_resultante, descripcion) VALUES (?, 'RECARGA', ?, ?, 'Recarga por solicitud')";
                $stmtMov = $conn->prepare($sqlMov);
                $stmtMov->bind_param("idd", $caja_id, $solicitud['monto'], $nuevo_saldo);
                $stmtMov->execute();
            }
        }
        
        $conn->commit();
        echo json_encode(["ok" => true, "message" => "Solicitud actualizada"]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["ok" => false, "error" => "Método no permitido"]);
?>