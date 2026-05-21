<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$sql = "
SELECT
    r.*,

    c.codigo AS caja

FROM rendiciones_caja r

LEFT JOIN cajas_chicas c
ON c.id = r.caja_id

ORDER BY r.id DESC
";

$res = $conn->query($sql);

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $data
]);