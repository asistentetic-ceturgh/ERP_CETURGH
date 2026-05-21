<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$solicitud_id = intval($_GET["solicitud_id"] ?? 0);

if ($solicitud_id <= 0) {

    echo json_encode([]);
    exit;
}

$sql = "
SELECT
    sa.id,
    sa.nombre_original,
    sa.ruta,
    sa.created_at,
    u.nombre AS usuario
FROM solicitud_archivos sa
LEFT JOIN usuarios u
ON u.id = sa.subido_por
WHERE sa.solicitud_id = ?
AND sa.tipo = 'RENDICION'
ORDER BY sa.created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $solicitud_id);
$stmt->execute();

$res = $stmt->get_result();

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$conn->close();