<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$orden_id = $_GET['orden_id'] ?? null;

if (!$orden_id) {

    echo json_encode([
        "success" => false,
        "error" => "Falta orden_id"
    ]);

    exit;
}

/* =========================
   CABECERA ORDEN
========================= */

$sqlOrden = "
SELECT 
    o.id,
    o.numero,
    o.fecha,
    o.total,

    p.id AS proveedor_id,
    p.nombre AS proveedor_nombre,
    p.ruc AS proveedor_ruc,
    p.telefono AS proveedor_contacto,
    p.detalle_pago AS proveedor_cuenta,
    p.medio_pago AS proveedor_medio_pago,
    p.email AS proveedor_email,

    e.id AS empresa_id,
    e.nombre AS empresa_nombre,
    e.ruc AS empresa_ruc,
    e.direccion AS empresa_direccion,
    e.web AS empresa_web,

    s.id AS sede_id,
    s.nombre AS sede_nombre

FROM ordenes_compra o

LEFT JOIN proveedores p 
ON o.proveedor_id = p.id

LEFT JOIN empresas e 
ON o.empresa_id = e.id

LEFT JOIN sedes s 
ON o.sede_id = s.id

WHERE o.id = ?
";

$stmt = $conn->prepare($sqlOrden);

$stmt->bind_param("i", $orden_id);

$stmt->execute();

$res = $stmt->get_result();

$orden = $res->fetch_assoc();

if (!$orden) {

    echo json_encode([
        "success" => false,
        "error" => "Orden no encontrada"
    ]);

    exit;
}

/* =========================
   ITEMS
========================= */

$sqlItems = "
SELECT 
    oci.id,
    oci.item_id,
    oci.descripcion,
    oci.cantidad,
    oci.precio,
    oci.total,

    i.centro_costo_id,
    cc.nombre AS centro_costo_nombre,

    i.area_costo_id,
    ac.nombre AS area_costo_nombre,

    r.departamento_id,
    d.nombre AS departamento_nombre

FROM orden_compra_items oci

LEFT JOIN items i 
ON oci.item_id = i.id

LEFT JOIN centros_costos cc 
ON i.centro_costo_id = cc.id

LEFT JOIN areas_costos ac 
ON i.area_costo_id = ac.id

LEFT JOIN requerimientos r 
ON i.requerimiento_id = r.id

LEFT JOIN departamentos d 
ON r.departamento_id = d.id

WHERE oci.orden_id = ?
";

$stmt2 = $conn->prepare($sqlItems);

$stmt2->bind_param("i", $orden_id);

$stmt2->execute();

$res2 = $stmt2->get_result();

$items = [];

while ($row = $res2->fetch_assoc()) {

    $items[] = [

        "id" => $row["id"],

        "item_id" => $row["item_id"],

        "descripcion" => $row["descripcion"],

        "cantidad" => (int)$row["cantidad"],

        "precio_unitario" => (float)$row["precio"],

        "total" => (float)$row["total"],

        "centro_costo" => [
            "id" => $row["centro_costo_id"],
            "nombre" => $row["centro_costo_nombre"]
        ],

        "area_costo" => [
            "id" => $row["area_costo_id"],
            "nombre" => $row["area_costo_nombre"]
        ],

        "departamento" => $row["departamento_nombre"]

    ];
}

/* =========================
   FIRMAS
========================= */

$firmas = [
    "tesoreria" => null,
    "administracion" => null
];

/* =========================
   TESORERIA
========================= */

$sqlTesoreria = "
SELECT 
    u.nombre,
    u.firma

FROM usuarios u

INNER JOIN departamentos d
ON u.departamento_id = d.id

WHERE LOWER(d.nombre) = 'tesoreria'
AND u.firma IS NOT NULL
AND u.firma <> ''

LIMIT 1
";

$resTes = $conn->query($sqlTesoreria);

if ($resTes && $resTes->num_rows > 0) {

    $rowTes = $resTes->fetch_assoc();

    $firmas["tesoreria"] = [
        "nombre" => $rowTes["nombre"],
        "firma" => $rowTes["firma"]
    ];
}

/* =========================
   ADMINISTRACION
========================= */

$sqlAdmin = "
SELECT 
    u.nombre,
    u.firma

FROM usuarios u

INNER JOIN departamentos d
ON u.departamento_id = d.id

WHERE LOWER(d.nombre) = 'administracion'
AND u.firma IS NOT NULL
AND u.firma <> ''

LIMIT 1
";

$resAdmin = $conn->query($sqlAdmin);

if ($resAdmin && $resAdmin->num_rows > 0) {

    $rowAdmin = $resAdmin->fetch_assoc();

    $firmas["administracion"] = [
        "nombre" => $rowAdmin["nombre"],
        "firma" => $rowAdmin["firma"]
    ];
}

/* =========================
   RESPONSE FINAL
========================= */

echo json_encode([

    "success" => true,

    "orden" => [

        "id" => $orden["id"],

        "numero" => $orden["numero"],

        "fecha" => $orden["fecha"],

        "total" => (float)$orden["total"],

        "proveedor" => [
            "id" => $orden["proveedor_id"],
            "nombre" => $orden["proveedor_nombre"],
            "ruc" => $orden["proveedor_ruc"],
            "contacto" => $orden["proveedor_contacto"],
            "cuenta_bancaria" => $orden["proveedor_cuenta"],
            "medio_pago" => $orden["proveedor_medio_pago"],
            "email" => $orden["proveedor_email"]
        ],

        "empresa" => [
            "id" => $orden["empresa_id"],
            "nombre" => $orden["empresa_nombre"],
            "ruc" => $orden["empresa_ruc"],
            "direccion" => $orden["empresa_direccion"],
            "web" => $orden["empresa_web"]
        ],

        "sede" => [
            "id" => $orden["sede_id"],
            "nombre" => $orden["sede_nombre"]
        ],

        "items" => $items,

        "firmas" => $firmas
    ]
]);