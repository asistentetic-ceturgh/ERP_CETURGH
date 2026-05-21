<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$empresa_id = isset($_GET['empresa_id']) ? intval($_GET['empresa_id']) : 0;
$sede_id = isset($_GET['sede_id']) ? intval($_GET['sede_id']) : 0;

if (
    $q === '' ||
    !$empresa_id ||
    !$sede_id
) {
    echo json_encode([
        "ok" => true,
        "data" => []
    ]);
    exit();
}

$sql = "
    SELECT
        id,
        codigo,
        nombre
    FROM centros_costos
    WHERE
        empresa_id = ?
        AND sede_id = ?
        AND (
            codigo LIKE ?
            OR nombre LIKE ?
        )
    ORDER BY codigo ASC
    LIMIT 20
";

$stmt = $conn->prepare($sql);

$search = "%{$q}%";

$stmt->bind_param(
    "iiss",
    $empresa_id,
    $sede_id,
    $search,
    $search
);

$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $data
]);

$stmt->close();
$conn->close();