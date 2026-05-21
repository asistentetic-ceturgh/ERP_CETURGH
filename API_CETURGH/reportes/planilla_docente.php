<?php

header("Content-Type: application/json");
require_once "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$programa_id = $data['programa_id'] ?? null;
$sede_id = $data['sede_id'] ?? null;

$sql = "
SELECT 
    pd.nombre,
    pd.curso,
    pd.horas,
    pd.costo,
    pd.total,
    p.nombre as programa
FROM planilla_docente pd
LEFT JOIN programas p ON pd.programa_id = p.id
WHERE 1=1
";

$params = [];
$types = "";

if ($programa_id) {
    $sql .= " AND pd.programa_id = ?";
    $params[] = $programa_id;
    $types .= "i";
}

if ($sede_id) {
    $sql .= " AND pd.sede_id = ?";
    $params[] = $sede_id;
    $types .= "i";
}

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$res = $stmt->get_result();

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $data
]);