<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {
    echo json_encode([
        "success" => false
    ]);
    exit;
}

$sql = "
SELECT
    sa.*,
    u.nombre as usuario
FROM solicitud_archivos sa
LEFT JOIN usuarios u
ON u.id = sa.subido_por
WHERE sa.solicitud_id = ?
ORDER BY sa.created_at DESC
";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $id);

$stmt->execute();

$res = $stmt->get_result();

$archivos = [];

while ($row = $res->fetch_assoc()) {
    $archivos[] = $row;
}

echo json_encode([
    "success" => true,
    "archivos" => $archivos
]);

$conn->close();