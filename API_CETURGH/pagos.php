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

$sql = "
SELECT 
    g.id as grupo_id,
    g.guia_url,
    g.comprobante_url,
    g.incluye_igv,                -- 🔥 NUEVO: flag IGV del grupo

    p.id AS proveedor_id,
    p.nombre AS proveedor,
    p.ruc AS proveedor_ruc,

    e.id AS empresa_id,
    e.nombre AS empresa_nombre,

    s.id AS sede_id,
    s.nombre AS sede_nombre,

    i.id,
    i.requerimiento_id,
    i.descripcion,
    i.cantidad,
    COALESCE(i.total, i.cantidad * i.precio_unitario) as monto,
    i.estado_pago,
    i.centro_costo_id,
    i.area_costo_id,
    r.fecha

FROM grupos_tesoreria g
INNER JOIN items i
    ON i.grupo_id = g.id
INNER JOIN requerimientos r
    ON i.requerimiento_id = r.id
LEFT JOIN proveedores p
    ON i.proveedor_id = p.id
LEFT JOIN empresas e
    ON r.empresa_id = e.id
LEFT JOIN sedes s
    ON r.sede_id = s.id

WHERE UPPER(COALESCE(i.estado_administracion, 'PENDIENTE')) = 'APROBADO'

ORDER BY g.id DESC
";

$res = $conn->query($sql);

if (!$res) {
    echo json_encode([
        "success" => false,
        "data" => [],
        "error" => $conn->error
    ]);
    exit();
}

$agrupado = [];

while ($row = $res->fetch_assoc()) {

    $key = 
        ($row['proveedor_id'] ?? 0) . "_" .
        ($row['empresa_id'] ?? 0) . "_" .
        ($row['sede_id'] ?? 0);
    $grupo_id = $row['grupo_id'];

    if (!isset($agrupado[$key])) {
        $agrupado[$key] = [
            "proveedor_id" => $row['proveedor_id'] ?? 0,
            "proveedor" => $row['proveedor'] ?? "SIN PROVEEDOR",
            "proveedor_ruc" => $row['proveedor_ruc'] ?? "-",
            "empresa_id" => $row['empresa_id'] ?? 0,
            "empresa_nombre" => $row['empresa_nombre'] ?? "",
            "sede_id" => $row['sede_id'] ?? 0,
            "sede_nombre" => $row['sede_nombre'] ?? "",
            "grupos" => []
        ];
    }

    if (!isset($agrupado[$key]["grupos"][$grupo_id])) {
        $agrupado[$key]["grupos"][$grupo_id] = [
            "grupo_id" => $grupo_id,
            "guia_url" => $row["guia_url"] ?? null,
            "comprobante_url" => $row["comprobante_url"] ?? null,
            "incluye_igv" => (int)($row["incluye_igv"] ?? 0),   // 🔥 NUEVO: incluye IGV
            "items" => [],
            "montoTotal" => 0
        ];
    }

    $monto = (float)$row["monto"];

    $agrupado[$key]["grupos"][$grupo_id]["items"][] = [
        "id" => $row["id"],
        "requerimiento_id" => $row["requerimiento_id"],
        "descripcion" => $row["descripcion"],
        "cantidad" => $row["cantidad"],
        "monto" => $monto,
        "estado_pago" => $row["estado_pago"],
        "fecha" => $row["fecha"],
        "centro_costo" => $row["centro_costo_id"],
        "area_costo" => $row["area_costo_id"]
    ];

    $agrupado[$key]["grupos"][$grupo_id]["montoTotal"] += $monto;
}

$resultado = [];

foreach ($agrupado as $prov) {
    $prov["grupos"] = array_values($prov["grupos"]);
    $resultado[] = $prov;
}

echo json_encode([
    "success" => true,
    "data" => $resultado
]);