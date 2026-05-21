<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

/* =========================
   VALIDAR ID
========================= */

$id = $_GET['orden_id'] ?? $_GET['id'] ?? 0;

if (!$id) {
    echo json_encode([
        "success" => false,
        "error" => "ID no recibido"
    ]);
    exit;
}

/* =========================
   ORDEN + PROVEEDOR + EMPRESA + SEDE
========================= */

$stmt = $conn->prepare("
    SELECT 
        o.id,
        o.numero,
        o.fecha,
        o.subtotal,
        o.igv,
        o.total,
        o.modo_igv,
        o.condiciones,
        o.observaciones,
        p.nombre AS proveedor_nombre,
        p.ruc AS proveedor_ruc,
        p.direccion AS proveedor_direccion,
        p.telefono AS proveedor_telefono,
        p.detalle_pago AS proveedor_cuenta,
        e.nombre AS empresa_nombre,
        e.ruc AS empresa_ruc,
        e.direccion AS empresa_direccion,
        e.web AS empresa_web,
        s.nombre AS sede_nombre
    FROM ordenes_compra o
    LEFT JOIN proveedores p ON o.proveedor_id = p.id
    LEFT JOIN empresas e ON o.empresa_id = e.id
    LEFT JOIN sedes s ON o.sede_id = s.id
    WHERE o.id = ?
");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => "Error SQL orden: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$orden = $result->fetch_assoc();
$stmt->close();

if (!$orden) {
    echo json_encode([
        "success" => false,
        "error" => "Orden no encontrada"
    ]);
    exit;
}

/* =========================
   ITEMS CON CÓDIGO DE CENTRO DE COSTO Y NOMBRE DE DEPARTAMENTO
   ========================= */
$stmtItems = $conn->prepare("
    SELECT 
        oi.id,
        oi.descripcion,
        oi.cantidad,
        oi.precio,
        oi.total,
        oi.tipo,
        cc.codigo AS centro_costo_codigo,
        d.nombre AS departamento_nombre
    FROM orden_compra_items oi
    LEFT JOIN items i ON oi.item_id = i.id
    LEFT JOIN centros_costos cc ON i.centro_costo_id = cc.id
    LEFT JOIN requerimientos r ON i.requerimiento_id = r.id
    LEFT JOIN departamentos d ON r.departamento_id = d.id
    WHERE oi.orden_id = ?
");

if (!$stmtItems) {
    echo json_encode([
        "success" => false,
        "error" => "Error SQL items: " . $conn->error
    ]);
    exit;
}

$stmtItems->bind_param("i", $id);
$stmtItems->execute();
$resItems = $stmtItems->get_result();
$items = [];

while ($row = $resItems->fetch_assoc()) {
    $items[] = [
        "id" => intval($row["id"]),
        "descripcion" => $row["descripcion"],
        "cantidad" => floatval($row["cantidad"]),
        "precio" => floatval($row["precio"]),
        "total" => floatval($row["total"]),
        "tipo" => $row["tipo"],
        "centro_costo" => $row["centro_costo_codigo"] ?? null,
        "departamento" => $row["departamento_nombre"] ?? null
    ];
}
$stmtItems->close();

/* =========================
   FIRMAS
========================= */

$firmas = [
    "tesoreria" => null,
    "administracion" => null
];

// Firma Tesorería
$stmtTesoreria = $conn->prepare("
    SELECT u.nombre, u.firma
    FROM usuarios u
    INNER JOIN departamentos d ON u.departamento_id = d.id
    WHERE UPPER(d.nombre) = 'TESORERIA'
    LIMIT 1
");
if ($stmtTesoreria) {
    $stmtTesoreria->execute();
    $resTesoreria = $stmtTesoreria->get_result();
    if ($resTesoreria && $resTesoreria->num_rows > 0) {
        $tesoreria = $resTesoreria->fetch_assoc();
        $firmas["tesoreria"] = [
            "nombre" => $tesoreria["nombre"],
            "firma" => $tesoreria["firma"]
        ];
    }
    $stmtTesoreria->close();
}

// Firma Administración
$stmtAdmin = $conn->prepare("
    SELECT u.nombre, u.firma
    FROM usuarios u
    INNER JOIN departamentos d ON u.departamento_id = d.id
    WHERE UPPER(d.nombre) = 'ADMINISTRACION'
    LIMIT 1
");
if ($stmtAdmin) {
    $stmtAdmin->execute();
    $resAdmin = $stmtAdmin->get_result();
    if ($resAdmin && $resAdmin->num_rows > 0) {
        $admin = $resAdmin->fetch_assoc();
        $firmas["administracion"] = [
            "nombre" => $admin["nombre"],
            "firma" => $admin["firma"]
        ];
    }
    $stmtAdmin->close();
}

/* =========================
   RESPUESTA FINAL
========================= */

echo json_encode([
    "success" => true,
    "orden" => [
        "id" => intval($orden["id"]),
        "numero" => $orden["numero"],
        "fecha" => $orden["fecha"],
        "subtotal" => floatval($orden["subtotal"]),
        "igv" => floatval($orden["igv"]),
        "total" => floatval($orden["total"]),
        "modo_igv" => $orden["modo_igv"],
        "condiciones" => $orden["condiciones"],
        "observaciones" => $orden["observaciones"],
        "proveedor" => [
            "nombre" => $orden["proveedor_nombre"],
            "ruc" => $orden["proveedor_ruc"],
            "direccion" => $orden["proveedor_direccion"],
            "telefono" => $orden["proveedor_telefono"],
            "cuenta" => $orden["proveedor_cuenta"]
        ],
        "empresa" => [
            "nombre" => $orden["empresa_nombre"],
            "ruc" => $orden["empresa_ruc"],
            "direccion" => $orden["empresa_direccion"],
            "web" => $orden["empresa_web"]
        ],
        "sede" => [
            "nombre" => $orden["sede_nombre"]
        ],
        "firmas" => $firmas,
        "items" => $items
    ]
]);

$conn->close();
?>