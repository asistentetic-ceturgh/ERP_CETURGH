<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$requerimiento_id = (int)($_GET['requerimiento_id'] ?? 0);
$q = $conn->real_escape_string($_GET['q'] ?? '');

if ($requerimiento_id === 0) {
    echo json_encode([]);
    exit;
}

// 🔥 traer empresa y sede del requerimiento
$sqlReq = "SELECT empresa_id, sede_id FROM requerimientos WHERE id = $requerimiento_id";
$resReq = $conn->query($sqlReq);

if (!$resReq || $resReq->num_rows === 0) {
    echo json_encode([]);
    exit;
}

$req = $resReq->fetch_assoc();
$empresa_id = (int)$req['empresa_id'];
$sede_id = (int)$req['sede_id'];

// 🔥 query real de centros
$sql = "
SELECT id, codigo, nombre
FROM centros_costos
WHERE (empresa_id = $empresa_id OR empresa_id IS NULL)
AND (sede_id = $sede_id OR sede_id IS NULL)
";

if ($q !== '') {
    $sql .= " AND (codigo LIKE '%$q%' OR nombre LIKE '%$q%')";
}

$sql .= " LIMIT 10";

$res = $conn->query($sql);

$data = [];

if ($res) {
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);