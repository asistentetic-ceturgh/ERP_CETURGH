<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión"]));
}

// Verificar si existe la tabla de presupuestos históricos
$checkTable = $conn->query("SHOW TABLES LIKE 'presupuestos_historicos'");
$usaHistoricos = $checkTable->num_rows > 0;

$method = $_SERVER['REQUEST_METHOD'];

// =====================================================
// GET → LISTAR DEPARTAMENTOS (CON GASTOS)
// =====================================================
if ($method === 'GET') {

    // Lista completa de departamentos (para combos)
    if (isset($_GET['todos']) && $_GET['todos'] == '1') {
        $sql = "SELECT id, nombre, parent_id FROM departamentos ORDER BY nombre";
        $result = $conn->query($sql);
        $departamentos = [];
        while ($row = $result->fetch_assoc()) {
            $departamentos[] = [
                "id" => (int)$row['id'],
                "nombre" => $row['nombre'],
                "parent_id" => $row['parent_id'] ? (int)$row['parent_id'] : null
            ];
        }
        echo json_encode($departamentos);
        exit;
    }
    
    $mes_actual = isset($_GET['mes']) ? (int)$_GET['mes'] : date('n');
    $anio_actual = isset($_GET['anio']) ? (int)$_GET['anio'] : date('Y');
    
    $sql = "SELECT id, nombre, presupuesto FROM departamentos WHERE parent_id IS NULL";
    $result = $conn->query($sql);
    $departamentos = [];
    
    while ($row = $result->fetch_assoc()) {
        $id = (int)$row["id"];
        
        // ==========================
        // PRESUPUESTO (histórico o base)
        // ==========================
        $presupuestoActual = (float)$row["presupuesto"];
        if ($usaHistoricos) {
            $presupuestoHistSql = "SELECT presupuesto_asignado FROM presupuestos_historicos 
                                   WHERE departamento_id = $id AND mes = $mes_actual AND anio = $anio_actual";
            $presupuestoRes = $conn->query($presupuestoHistSql);
            if ($presupuestoRes && $presupuestoRes->num_rows > 0) {
                $presupuestoActual = (float)$presupuestoRes->fetch_assoc()['presupuesto_asignado'];
            }
        }
        
        // ==========================
        // GASTOS DIRECTOS DEL PADRE (en el período seleccionado)
        // ==========================
        // Items (requerimientos)
        $itemsSql = "SELECT COALESCE(SUM(i.total),0) as total FROM items i
                     JOIN requerimientos r ON r.id = i.requerimiento_id
                     WHERE r.departamento_id = $id AND i.estado_pago = 'Pagado'
                     AND MONTH(r.fecha)=$mes_actual AND YEAR(r.fecha)=$anio_actual";
        $itemsRes = $conn->query($itemsSql);
        $gastado_items = $itemsRes ? (float)$itemsRes->fetch_assoc()["total"] : 0;
        
        // Movilidades
        $movSql = "SELECT COALESCE(SUM(monto_total),0) as total FROM planilla_movilidad
                   WHERE departamento_id = $id AND estado='Pagado'
                   AND MONTH(fecha)=$mes_actual AND YEAR(fecha)=$anio_actual";
        $movRes = $conn->query($movSql);
        $gastado_movilidad = $movRes ? (float)$movRes->fetch_assoc()["total"] : 0;
        
        // Fondos
        $gastosFondoSql = "SELECT COALESCE(SUM(sg.monto),0) as total
                           FROM solicitud_gastos sg
                           JOIN solicitudes_fondo sf ON sf.id = sg.solicitud_id
                           WHERE sf.departamento_id = $id
                           AND sf.estado IN ('PAGADO','CERRADO','POR_REEMBOLSAR','POR_DEVOLVER')
                           AND MONTH(sg.fecha)=$mes_actual AND YEAR(sg.fecha)=$anio_actual";
        $gastosFondoRes = $conn->query($gastosFondoSql);
        $gastado_fondo = $gastosFondoRes ? (float)$gastosFondoRes->fetch_assoc()["total"] : 0;
        
        $gastado_total = $gastado_items + $gastado_movilidad + $gastado_fondo;
        
        // ==========================
        // SUBDEPARTAMENTOS
        // ==========================
        $subSql = "SELECT id, nombre FROM departamentos WHERE parent_id = $id";
        $subRes = $conn->query($subSql);
        $subdepartamentos = [];
        $subIds = [];
        
        while ($s = $subRes->fetch_assoc()) {
            $subId = (int)$s["id"];
            $subIds[] = $subId;
            
            // 🔥 CORREGIDO: usar r.departamento_id en lugar de i.area_costo_id
            $subItemsSql = "SELECT COALESCE(SUM(i.total),0) as total FROM items i
                            JOIN requerimientos r ON r.id = i.requerimiento_id
                            WHERE r.departamento_id = $subId AND i.estado_pago='Pagado'
                            AND MONTH(r.fecha)=$mes_actual AND YEAR(r.fecha)=$anio_actual";
            $subItemsRes = $conn->query($subItemsSql);
            $sub_items = $subItemsRes ? (float)$subItemsRes->fetch_assoc()["total"] : 0;
            
            // Movilidades del subdepartamento
            $subMovSql = "SELECT COALESCE(SUM(monto_total),0) as total FROM planilla_movilidad
                          WHERE departamento_id = $subId AND estado='Pagado'
                          AND MONTH(fecha)=$mes_actual AND YEAR(fecha)=$anio_actual";
            $subMovRes = $conn->query($subMovSql);
            $sub_mov = $subMovRes ? (float)$subMovRes->fetch_assoc()["total"] : 0;
            
            // Fondos del subdepartamento
            $subFondoSql = "SELECT COALESCE(SUM(sg.monto),0) as total FROM solicitud_gastos sg
                            JOIN solicitudes_fondo sf ON sf.id = sg.solicitud_id
                            WHERE sf.departamento_id = $subId
                            AND sf.estado IN ('PAGADO','CERRADO','POR_REEMBOLSAR','POR_DEVOLVER')
                            AND MONTH(sg.fecha)=$mes_actual AND YEAR(sg.fecha)=$anio_actual";
            $subFondoRes = $conn->query($subFondoSql);
            $sub_fondo = $subFondoRes ? (float)$subFondoRes->fetch_assoc()["total"] : 0;
            
            $subdepartamentos[] = [
                "id" => $subId,
                "nombre" => $s["nombre"],
                "gastado" => $sub_items + $sub_mov + $sub_fondo,
                "gastado_items" => $sub_items,
                "gastado_movilidad" => $sub_mov,
                "gastado_fondo" => $sub_fondo
            ];
        }
        
        // ==========================
        // ACUMULAR GASTOS DE HIJOS AL PADRE (para el resumen del período)
        // ==========================
        if (!empty($subIds)) {
            $subTotalItems = array_sum(array_column($subdepartamentos, 'gastado_items'));
            $subTotalMov   = array_sum(array_column($subdepartamentos, 'gastado_movilidad'));
            $subTotalFondo = array_sum(array_column($subdepartamentos, 'gastado_fondo'));
            $gastado_items   += $subTotalItems;
            $gastado_movilidad += $subTotalMov;
            $gastado_fondo   += $subTotalFondo;
            $gastado_total    = $gastado_items + $gastado_movilidad + $gastado_fondo;
        }
        
        // ==========================
        // HISTORIAL COMPLETO (sin filtrar por mes/año, solo por estado Pagado)
        // ==========================
        $idsHistorial = array_merge([$id], $subIds);
        $idsList = implode(',', $idsHistorial);
        
        // COMPRAS (items de requerimientos)
        $comprasSql = "
            SELECT 
                i.descripcion, i.total as monto, i.estado_pago as estado,
                r.fecha,
                COALESCE(sd.nombre, 'SIN ÁREA') as subdepartamento,
                'REQUERIMIENTO' as origen,
                r.departamento_id as departamento_id,
                (SELECT nombre FROM departamentos WHERE id = r.departamento_id) as departamento_nombre
            FROM items i
            JOIN requerimientos r ON r.id = i.requerimiento_id
            LEFT JOIN departamentos sd ON sd.id = i.area_costo_id
            WHERE r.departamento_id IN ($idsList) AND i.estado_pago = 'Pagado'
            ORDER BY r.fecha DESC
            LIMIT 200
        ";
        $comprasRes = $conn->query($comprasSql);
        $compras = [];
        while ($c = $comprasRes->fetch_assoc()) {
            $compras[] = [
                "descripcion" => $c["descripcion"],
                "monto" => (float)$c["monto"],
                "estado" => $c["estado"],
                "fecha" => $c["fecha"],
                "subdepartamento" => $c["subdepartamento"],
                "origen" => "REQUERIMIENTO",
                "departamento_id" => (int)$c["departamento_id"],
                "departamento_nombre" => $c["departamento_nombre"]
            ];
        }
        
        // MOVILIDADES
        $movilidadSql = "
            SELECT 
                pm.motivo as descripcion, pm.monto_total as monto, pm.estado, pm.fecha,
                pm.origen, pm.destino,
                COALESCE(u.nombre, 'No asignado') as usuario,
                d.nombre as departamento_nombre,
                pm.departamento_id
            FROM planilla_movilidad pm
            LEFT JOIN usuarios u ON pm.creador_id = u.id
            LEFT JOIN departamentos d ON pm.departamento_id = d.id
            WHERE pm.departamento_id IN ($idsList) AND pm.estado = 'Pagado'
            ORDER BY pm.fecha DESC
            LIMIT 200
        ";
        $movilidadRes = $conn->query($movilidadSql);
        $movilidades = [];
        while ($m = $movilidadRes->fetch_assoc()) {
            $movilidades[] = [
                "descripcion" => $m["descripcion"],
                "monto" => (float)$m["monto"],
                "estado" => $m["estado"],
                "fecha" => $m["fecha"],
                "origen" => $m["origen"],
                "destino" => $m["destino"],
                "usuario" => $m["usuario"],
                "departamento_nombre" => $m["departamento_nombre"],
                "departamento_id" => (int)$m["departamento_id"]
            ];
        }
        
        // GASTOS DE FONDO
        $gastosFondoHistorialSql = "
            SELECT 
                sg.descripcion, sg.monto, 'Pagado' as estado, sg.fecha,
                COALESCE(sd.nombre, 'SIN ÁREA') as subdepartamento,
                'FONDO' as origen,
                sf.departamento_id,
                (SELECT nombre FROM departamentos WHERE id = sf.departamento_id) as departamento_nombre
            FROM solicitud_gastos sg
            JOIN solicitudes_fondo sf ON sf.id = sg.solicitud_id
            LEFT JOIN departamentos sd ON sd.id = sf.departamento_id
            WHERE sf.departamento_id IN ($idsList)
            AND sf.estado IN ('PAGADO','CERRADO','POR_REEMBOLSAR','POR_DEVOLVER')
            ORDER BY sg.fecha DESC
        ";
        $gastosFondoHistorialRes = $conn->query($gastosFondoHistorialSql);
        $gastosFondoHistorial = [];
        while ($g = $gastosFondoHistorialRes->fetch_assoc()) {
            $gastosFondoHistorial[] = [
                "descripcion" => "[FONDO] " . $g["descripcion"],
                "monto" => (float)$g["monto"],
                "estado" => $g["estado"],
                "fecha" => $g["fecha"],
                "subdepartamento" => $g["subdepartamento"],
                "origen" => "FONDO",
                "departamento_id" => (int)$g["departamento_id"],
                "departamento_nombre" => $g["departamento_nombre"]
            ];
        }
        
        // Unificar y ordenar
        $todosGastos = array_merge($compras, $gastosFondoHistorial);
        usort($todosGastos, function($a, $b) {
            return strtotime($b['fecha']) - strtotime($a['fecha']);
        });
        
        $departamentos[] = [
            "id" => $id,
            "nombre" => $row["nombre"],
            "presupuestoTotal" => $presupuestoActual,
            "gastado" => $gastado_total,
            "gastado_items" => $gastado_items,
            "gastado_movilidad" => $gastado_movilidad,
            "gastado_fondo" => $gastado_fondo,
            "saldo" => $presupuestoActual - $gastado_total,
            "subdepartamentos" => $subdepartamentos,
            "compras" => $todosGastos,
            "movilidades" => $movilidades,
            "periodo" => ["mes" => $mes_actual, "anio" => $anio_actual]
        ];
    }
    
    echo json_encode($departamentos);
    exit;
}


// ==========================================
// POST → CREAR DEPARTAMENTO
// ==========================================
if ($method === 'POST' && (!isset($_GET['action']) || $_GET['action'] !== 'asignar_presupuesto')) {
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        echo json_encode(["error" => "Datos inválidos"]);
        exit();
    }
    
    $nombre = $data["nombre"] ?? '';
    $presupuesto = $data["presupuesto"] ?? 0;
    $empresa_id = $data["empresa_id"] ?? 1;
    $sede_id = $data["sede_id"] ?? 1;
    $parent_id = $data["parent_id"] ?? null;
    
    $stmt = $conn->prepare("
        INSERT INTO departamentos (nombre, presupuesto, empresa_id, sede_id, parent_id)
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param("sdiii", $nombre, $presupuesto, $empresa_id, $sede_id, $parent_id);
    
    if ($stmt->execute()) {
        $newId = $stmt->insert_id;
        
        // Si existe tabla de presupuestos históricos, crear registro para el mes actual
        if ($usaHistoricos && $presupuesto > 0) {
            $mesActual = date('n');
            $anioActual = date('Y');
            $insertHist = $conn->prepare("
                INSERT INTO presupuestos_historicos (departamento_id, mes, anio, presupuesto_asignado, registrado_por)
                VALUES (?, ?, ?, ?, 1)
                ON DUPLICATE KEY UPDATE presupuesto_asignado = VALUES(presupuesto_asignado)
            ");
            $insertHist->bind_param("iiid", $newId, $mesActual, $anioActual, $presupuesto);
            $insertHist->execute();
        }
        
        echo json_encode([
            "success" => true,
            "insert_id" => $newId
        ]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
    
    $stmt->close();
    exit;
}

// ==========================================
// POST → ASIGNAR PRESUPUESTO MENSUAL
// ==========================================
if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'asignar_presupuesto') {
    
    if (!$usaHistoricos) {
        echo json_encode(["error" => "Sistema de presupuestos históricos no disponible"]);
        exit();
    }
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    $departamento_id = (int)$data['departamento_id'];
    $mes = (int)$data['mes'];
    $anio = (int)$data['anio'];
    $presupuesto = (float)$data['presupuesto'];
    $registrado_por = (int)($data['registrado_por'] ?? 1);
    $nota = $data['nota'] ?? null;
    
    // Validar datos
    if ($departamento_id <= 0 || $mes < 1 || $mes > 12 || $anio < 2020 || $presupuesto < 0) {
        echo json_encode(["error" => "Datos inválidos"]);
        exit();
    }
    
    // Verificar si ya existe
    $checkSql = "SELECT id FROM presupuestos_historicos 
                 WHERE departamento_id = $departamento_id 
                 AND mes = $mes AND anio = $anio";
    $checkRes = $conn->query($checkSql);
    
    if ($checkRes && $checkRes->num_rows > 0) {
        // Actualizar
        $stmt = $conn->prepare("UPDATE presupuestos_historicos 
                                SET presupuesto_asignado = ?, registrado_por = ?, fecha_registro = NOW(), nota = ?
                                WHERE departamento_id = ? AND mes = ? AND anio = ?");
        $stmt->bind_param("disiii", $presupuesto, $registrado_por, $nota, $departamento_id, $mes, $anio);
    } else {
        // Insertar nuevo
        $stmt = $conn->prepare("INSERT INTO presupuestos_historicos 
                                (departamento_id, mes, anio, presupuesto_asignado, registrado_por, nota) 
                                VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iiidis", $departamento_id, $mes, $anio, $presupuesto, $registrado_por, $nota);
    }
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Presupuesto asignado correctamente"]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
    
    $stmt->close();
    exit;
}

// ==========================================
// PUT → EDITAR DEPARTAMENTO
// ==========================================
if ($method === 'PUT') {
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data["id"])) {
        echo json_encode(["error" => "ID requerido"]);
        exit();
    }
    
    $id = (int)$data["id"];
    $nombre = $data["nombre"] ?? null;
    $presupuesto = $data["presupuesto"] ?? null;
    
    $fields = [];
    $params = [];
    $types = "";
    
    if ($nombre !== null) {
        $fields[] = "nombre = ?";
        $params[] = $nombre;
        $types .= "s";
    }
    
    if ($presupuesto !== null) {
        $fields[] = "presupuesto = ?";
        $params[] = (float)$presupuesto;
        $types .= "d";
    }
    
    if (empty($fields)) {
        echo json_encode(["error" => "Nada para actualizar"]);
        exit();
    }
    
    $params[] = $id;
    $types .= "i";
    
    $sql = "UPDATE departamentos SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    
    if ($stmt->execute()) {
        // Si se actualizó el presupuesto base y existe tabla histórica, actualizar también el mes actual
        if ($usaHistoricos && $presupuesto !== null) {
            $mesActual = date('n');
            $anioActual = date('Y');
            $updateHist = $conn->prepare("
                UPDATE presupuestos_historicos 
                SET presupuesto_asignado = ? 
                WHERE departamento_id = ? AND mes = ? AND anio = ?
            ");
            $updateHist->bind_param("diii", $presupuesto, $id, $mesActual, $anioActual);
            $updateHist->execute();
        }
        
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
    
    $stmt->close();
    exit;
}

// ==========================================
// DELETE → ELIMINAR DEPARTAMENTO
// ==========================================
if ($method === 'DELETE') {
    
    $id = $_GET["id"] ?? null;
    
    if (!$id) {
        echo json_encode(["error" => "ID requerido"]);
        exit();
    }
    
    $id = (int)$id;
    
    // Verificar si tiene relaciones
    $res = $conn->query("SELECT COUNT(*) as total FROM area_departamento WHERE departamento_id = $id");
    $row = $res->fetch_assoc();
    
    if ($row["total"] > 0) {
        echo json_encode([
            "error" => "No puedes eliminar este departamento porque está en uso"
        ]);
        exit();
    }
    
    // Eliminar subdepartamentos primero
    $conn->query("DELETE FROM departamentos WHERE parent_id = $id");
    
    // Eliminar el departamento principal
    $stmt = $conn->prepare("DELETE FROM departamentos WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        // Los presupuestos históricos se eliminarán automáticamente por FOREIGN KEY CASCADE
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }
    
    $stmt->close();
    exit;
}

$conn->close();
?>