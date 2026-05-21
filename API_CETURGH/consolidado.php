<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "db.php";
$conn->set_charset("utf8");

// ==============================
// 🔥 QUERY CONSOLIDADO
// ==============================
$sql = "
SELECT 
    i.id,
    i.tipo,
    i.codigo,
    i.nombre,
    i.estado,

    -- datos dinámicos
    m.modelo AS movil_modelo,
    m.numero AS movil_numero,

    h.cantidad AS herramienta_cantidad,

    o.modelo AS oficina_modelo,

    me.material AS menaje_material

FROM inventario i

LEFT JOIN inventario_moviles m 
    ON i.id = m.inventario_id

LEFT JOIN inventario_herramientas h 
    ON i.id = h.inventario_id

LEFT JOIN inventario_oficina o 
    ON i.id = o.inventario_id

LEFT JOIN inventario_menaje me 
    ON i.id = me.inventario_id

ORDER BY i.id DESC
";

$res = $conn->query($sql);

if (!$res) {
    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);
    exit;
}

$data = [];

while ($row = $res->fetch_assoc()) {

    // 🔥 NORMALIZAR MODELO
    $modelo = 
        $row['movil_modelo'] ??
        $row['oficina_modelo'] ??
        $row['menaje_material'] ??
        $row['nombre'];

    $data[] = [
        "id" => $row['id'],
        "tipo" => $row['tipo'],
        "codigo" => $row['codigo'],
        "modelo" => $modelo,
        "estado" => $row['estado']
    ];
}

echo json_encode([
    "success" => true,
    "data" => $data
]);