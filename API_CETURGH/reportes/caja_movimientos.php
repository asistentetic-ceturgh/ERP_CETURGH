<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$fecha_inicio = $data['fecha_inicio'] ?? null;
$fecha_fin = $data['fecha_fin'] ?? null;
$sede_id = $data['sede_id'] ?? null;

$sql = "
SELECT 
    ce.id,
    ce.persona,
    ce.motivo,
    ce.monto,
    ce.fecha,
    ce.estado,
    cc.nombre as centro_costo,
    c.sede_id
FROM caja_entregas ce
JOIN cajas_chicas c ON ce.caja_id = c.id
LEFT JOIN centros_costos cc ON ce.centro_costo_id = cc.id
WHERE 1=1
";

$params = [];
$types = "";

// Filtro por fechas
if ($fecha_inicio && $fecha_fin) {
    $sql .= " AND ce.fecha BETWEEN ? AND ?";
    $params[] = $fecha_inicio;
    $params[] = $fecha_fin;
    $types .= "ss";
}

// Filtro por sede
if ($sede_id) {
    $sql .= " AND c.sede_id = ?";
    $params[] = $sede_id;
    $types .= "i";
}

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);