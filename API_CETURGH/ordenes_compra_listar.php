<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$sql = "
SELECT 
    o.id,
    o.numero,
    o.fecha,
    o.total,

    p.nombre AS proveedor,
    e.nombre AS empresa,
    s.nombre AS sede

FROM ordenes_compra o
LEFT JOIN proveedores p ON o.proveedor_id = p.id
LEFT JOIN empresas e ON o.empresa_id = e.id
LEFT JOIN sedes s ON o.sede_id = s.id

ORDER BY o.id DESC
";

$res = $conn->query($sql);

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);