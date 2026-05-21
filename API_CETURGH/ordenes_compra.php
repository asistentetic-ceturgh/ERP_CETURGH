<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "db.php";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

$requerimiento_id = $_GET['requerimiento_id'] ?? null;

if (!$requerimiento_id) {
    echo json_encode(["error" => "Falta requerimiento_id"]);
    exit;
}

/* =========================
   1. REQUERIMIENTO CABECERA
========================= */
$sqlReq = "
SELECT 
    r.id,
    r.codigo,
    r.fecha,
    r.estado,
    d.nombre AS departamento_nombre,
    s.nombre AS sede_nombre,
    e.id AS empresa_id,
    e.nombre AS empresa_nombre
FROM requerimientos r
LEFT JOIN departamentos d ON r.departamento_id = d.id
LEFT JOIN sedes s ON r.sede_id = s.id
LEFT JOIN empresas e ON r.empresa_id = e.id
WHERE r.id = ?
";

$stmt = $conn->prepare($sqlReq);
$stmt->bind_param("i", $requerimiento_id);
$stmt->execute();
$result = $stmt->get_result();

$requerimiento = $result->fetch_assoc();

if (!$requerimiento) {
    echo json_encode(["error" => "Requerimiento no encontrado"]);
    exit;
}

/* =========================
   2. ITEMS CON JOIN COMPLETO
========================= */
$sqlItems = "
SELECT 
    i.id,
    i.descripcion,
    i.cantidad,
    i.precio_unitario,
    i.total,

    i.proveedor_id,
    p.nombre AS proveedor_nombre,
    p.ruc AS proveedor_ruc,

    i.centro_costo_id,
    cc.nombre AS centro_costo_nombre,

    i.area_costo_id,
    ac.nombre AS area_costo_nombre

FROM items i

LEFT JOIN proveedores p ON i.proveedor_id = p.id
LEFT JOIN centros_costos cc ON i.centro_costo_id = cc.id
LEFT JOIN areas_costos ac ON i.area_costo_id = ac.id

WHERE i.requerimiento_id = ?
";

$stmt2 = $conn->prepare($sqlItems);
$stmt2->bind_param("i", $requerimiento_id);
$stmt2->execute();
$result2 = $stmt2->get_result();

$items = [];

while ($row = $result2->fetch_assoc()) {
    $items[] = [
        "id" => $row["id"],
        "descripcion" => $row["descripcion"],
        "cantidad" => (float)$row["cantidad"],
        "precio_unitario" => (float)$row["precio_unitario"],
        "total" => (float)$row["total"],

        "proveedor" => [
            "id" => $row["proveedor_id"],
            "nombre" => $row["proveedor_nombre"],
            "ruc" => $row["proveedor_ruc"]
        ],

        "centro_costo" => [
            "id" => $row["centro_costo_id"],
            "nombre" => $row["centro_costo_nombre"]
        ],

        "area_costo" => [
            "id" => $row["area_costo_id"],
            "nombre" => $row["area_costo_nombre"]
        ]
    ];
}

/* =========================
   3. RESPUESTA FINAL
========================= */
echo json_encode([
    "requerimiento" => $requerimiento,
    "items" => $items
], JSON_UNESCAPED_UNICODE);

$conn->close();