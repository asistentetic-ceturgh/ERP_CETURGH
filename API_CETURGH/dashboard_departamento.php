<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once "db.php";

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión"]));
}

$departamento_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($departamento_id <= 0) {
    echo json_encode(["error" => "ID de departamento inválido"]);
    exit;
}

// ==========================================
// 1. OBTENER INFORMACIÓN DEL DEPARTAMENTO (con herencia de presupuesto)
// ==========================================
$deptoSql = "
    SELECT 
        d.id,
        d.nombre,
        d.presupuesto as presupuesto_base,
        d.parent_id,
        CASE 
            WHEN d.parent_id IS NOT NULL THEN (
                SELECT presupuesto FROM departamentos WHERE id = d.parent_id
            )
            ELSE d.presupuesto
        END as presupuesto_total
    FROM departamentos d
    WHERE d.id = $departamento_id
";

$deptoRes = $conn->query($deptoSql);
$departamento = $deptoRes->fetch_assoc();

if (!$departamento) {
    echo json_encode(["error" => "Departamento no encontrado"]);
    exit;
}

// El presupuesto efectivo es el heredado si es subdepartamento
$presupuesto_efectivo = (float)$departamento['presupuesto_total'];

// ==========================================
// 2. CALCULAR GASTOS DEL DEPARTAMENTO (considerando subdepartamentos)
// ==========================================

// 2.1 Obtener IDs de todos los subdepartamentos (si es padre)
$subIds = [$departamento_id];
if ($departamento['parent_id'] === null) {
    // Es departamento padre, incluir todos sus subdepartamentos
    $subSql = "SELECT id FROM departamentos WHERE parent_id = $departamento_id";
    $subRes = $conn->query($subSql);
    while ($sub = $subRes->fetch_assoc()) {
        $subIds[] = (int)$sub['id'];
    }
}
$idsStr = implode(',', $subIds);

// 2.2 GASTOS EN ITEMS (REQUERIMIENTOS)
$itemsSql = "
    SELECT COALESCE(SUM(i.total), 0) as total
    FROM items i
    JOIN requerimientos r ON r.id = i.requerimiento_id
    WHERE r.departamento_id IN ($idsStr)
    AND i.estado_pago = 'Pagado'
";
$itemsRes = $conn->query($itemsSql);
$gastado_items = (float)$itemsRes->fetch_assoc()["total"];

// 2.3 GASTOS EN MOVILIDAD
$movSql = "
    SELECT COALESCE(SUM(monto_total), 0) as total
    FROM planilla_movilidad
    WHERE departamento_id IN ($idsStr)
    AND estado = 'Pagado'
";
$movRes = $conn->query($movSql);
$gastado_movilidad = (float)$movRes->fetch_assoc()["total"];

// 2.4 GASTOS EN SOLICITUDES DE FONDO
$fondoSql = "
    SELECT COALESCE(SUM(sg.monto), 0) as total
    FROM solicitud_gastos sg
    JOIN solicitudes_fondo sf ON sf.id = sg.solicitud_id
    WHERE sf.departamento_id IN ($idsStr)
    AND sf.estado IN ('PAGADO', 'CERRADO', 'POR_REEMBOLSAR', 'POR_DEVOLVER')
";
$fondoRes = $conn->query($fondoSql);
$gastado_fondo = (float)$fondoRes->fetch_assoc()["total"];

// Total gastado
$gastado_total = $gastado_items + $gastado_movilidad + $gastado_fondo;

// ==========================================
// 3. OBTENER REQUERIMIENTOS RECIENTES
// ==========================================
$requerimientosSql = "
    SELECT 
        codigo,
        fecha,
        total,
        estado,
        DATE_FORMAT(fecha, '%d/%m/%Y') as fecha_formateada
    FROM requerimientos
    WHERE departamento_id IN ($idsStr)
    ORDER BY fecha DESC
    LIMIT 10
";
$requerimientos = $conn->query($requerimientosSql)->fetch_all(MYSQLI_ASSOC);

// ==========================================
// 4. OBTENER MOVILIDADES RECIENTES
// ==========================================
$movilidadSql = "
    SELECT 
        id,
        motivo,
        fecha,
        monto_total,
        estado,
        DATE_FORMAT(fecha, '%d/%m/%Y') as fecha_formateada
    FROM planilla_movilidad
    WHERE departamento_id IN ($idsStr)
    ORDER BY fecha DESC
    LIMIT 10
";
$movilidad = $conn->query($movilidadSql)->fetch_all(MYSQLI_ASSOC);

// ==========================================
// 5. OBTENER USUARIOS DEL DEPARTAMENTO (y subdepartamentos)
// ==========================================
$usuariosSql = "
    SELECT 
        u.id,
        u.nombre,
        u.usuario,
        u.tipo
    FROM usuarios u
    JOIN usuarios_departamentos ud ON ud.usuario_id = u.id
    WHERE ud.departamento_id IN ($idsStr)
    GROUP BY u.id
    LIMIT 20
";
$usuarios = $conn->query($usuariosSql)->fetch_all(MYSQLI_ASSOC);

// ==========================================
// 6. RESPUESTA FINAL
// ==========================================
echo json_encode([
    "resumen" => [
        "presupuesto" => $presupuesto_efectivo,
        "gastado" => $gastado_total,
        "gastado_items" => $gastado_items,
        "gastado_movilidad" => $gastado_movilidad,
        "gastado_fondo" => $gastado_fondo,
        "disponible" => $presupuesto_efectivo - $gastado_total,
        "porcentaje" => $presupuesto_efectivo > 0 ? round(($gastado_total / $presupuesto_efectivo) * 100, 2) : 0,
        "es_subdepartamento" => $departamento['parent_id'] !== null,
        "departamento_padre" => $departamento['parent_id']
    ],
    "requerimientos" => $requerimientos,
    "movilidad" => $movilidad,
    "usuarios" => $usuarios
]);

$conn->close();
?>