<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$sql = "
SELECT
    sc.*,

    e.nombre AS empresa,
    s.nombre AS sede,

    CONCAT(cc.codigo, ' - ', cc.nombre) AS centro_costo

FROM solicitudes_caja sc

LEFT JOIN empresas e
ON e.id = sc.empresa_id

LEFT JOIN sedes s
ON s.id = sc.sede_id

LEFT JOIN centros_costos cc
ON cc.id = sc.centro_costo_id

ORDER BY sc.id DESC
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