<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db.php";

$departamento_id = $_GET['id'] ?? 0;

// ================= RESUMEN =================

// 🔹 PRESUPUESTO
$sql = "SELECT presupuesto FROM departamentos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $departamento_id);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();

$presupuesto = (float)($res['presupuesto'] ?? 0);

// ================= GASTOS REALES =================

// 🔥 ITEMS PAGADOS
$sql_items = "
SELECT COALESCE(SUM(i.total),0) as total
FROM items i
JOIN requerimientos r ON r.id = i.requerimiento_id
WHERE r.departamento_id = ?
AND i.estado_pago = 'Pagado'
";

$stmt = $conn->prepare($sql_items);
$stmt->bind_param("i", $departamento_id);
$stmt->execute();
$items = $stmt->get_result()->fetch_assoc();

$gastado_items = (float)$items['total'];

// 🔥 MOVILIDAD PAGADA
$sql_mov = "
SELECT COALESCE(SUM(monto_total),0) as total
FROM planilla_movilidad
WHERE departamento_id = ?
AND estado = 'Pagado'
";

$stmt = $conn->prepare($sql_mov);
$stmt->bind_param("i", $departamento_id);
$stmt->execute();
$mov = $stmt->get_result()->fetch_assoc();

$gastado_movilidad = (float)$mov['total'];

// 🔥 TOTAL REAL
$gastado = $gastado_items + $gastado_movilidad;

// 🔥 SALDO
$saldo = $presupuesto - $gastado;

// 🔥 PORCENTAJE
$porcentaje = $presupuesto > 0 
    ? round(($gastado / $presupuesto) * 100, 2) 
    : 0;

$resumen = [
    "presupuesto" => $presupuesto,
    "gastado" => $gastado,
    "saldo" => $saldo,
    "porcentaje" => $porcentaje,

    // 🔹 EXTRA (clave para UI)
    "gastado_items" => $gastado_items,
    "gastado_movilidad" => $gastado_movilidad
];

// ================= REQUERIMIENTOS =================
// (solo referencia, no cálculo)
$sql = "
SELECT id, codigo, fecha, estado
FROM requerimientos
WHERE departamento_id = ?
ORDER BY created_at DESC
LIMIT 5
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $departamento_id);
$stmt->execute();
$requerimientos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ================= MOVILIDAD =================
$sql = "
SELECT id, motivo, fecha, estado, monto_total
FROM planilla_movilidad
WHERE departamento_id = ?
ORDER BY fecha DESC
LIMIT 5
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $departamento_id);
$stmt->execute();
$movilidad = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ================= USUARIOS =================
$sql = "
SELECT id, nombre, usuario, tipo
FROM usuarios
WHERE departamento_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $departamento_id);
$stmt->execute();
$usuarios = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// ================= RESPUESTA =================
echo json_encode([
    "resumen" => $resumen,
    "requerimientos" => $requerimientos,
    "movilidad" => $movilidad,
    "usuarios" => $usuarios
]);