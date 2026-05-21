<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function nullableInt($val) {
    return (isset($val) && $val !== "" && $val !== null) ? intval($val) : null;
}

# =========================
# 🔹 GET - LISTAR ITEMS
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

  $sql = "
SELECT 
    i.*,
    r.empresa_id,
    r.sede_id,
    s.nombre AS sede_nombre,
    cc.codigo AS centro_codigo,
    cc.nombre AS centro_nombre

FROM items i

INNER JOIN requerimientos r 
    ON i.requerimiento_id = r.id

LEFT JOIN sedes s 
    ON r.sede_id = s.id

LEFT JOIN centros_costos cc 
    ON i.centro_costo_id = cc.id

WHERE 
    i.flujo_estado IN (
        'LOGISTICA',
        'ADMINISTRACION',
        'TESORERIA'
    )

ORDER BY i.id DESC
";

    $res = $conn->query($sql);

    if (!$res) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }

    $data = [];

    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(["data" => $data]);
    exit();
}

# =========================
# 🔹 POST - ACTUALIZAR EN LOTE
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $items = json_decode(file_get_contents("php://input"), true);

    if (!$items) {
        echo json_encode(["success" => false, "error" => "Sin datos"]);
        exit();
    }

    $stmt = $conn->prepare("
        UPDATE items SET 
            precio_unitario = ?, 
            total = ?, 
            proveedor_id = ?, 
            centro_costo_id = ?, 
            requiere_cotizacion = ?, 
            es_insumo = ?, 
            estado_insumo = ?
        WHERE id = ?
    ");

    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }

    foreach ($items as $it) {

        $id = intval($it['id']);
        $precio = floatval($it['precio_unitario']);
        $cantidad = floatval($it['cantidad']);
        $total = $precio * $cantidad;

        $proveedor_id = nullableInt($it['proveedor_id'] ?? null);
        $centro = nullableInt($it['centro_costo_id'] ?? null);
        $requiere = intval($it['requiere_cotizacion'] ?? 0);
        $insumo = intval($it['es_insumo'] ?? 0);
        $estado_insumo = $it['estado_insumo'] ?? 'Pendiente';

        $stmt->bind_param(
            "ddiiissi",
            $precio,
            $total,
            $proveedor_id,
            $centro,
            $requiere,
            $insumo,
            $estado_insumo,
            $id
        );

        if (!$stmt->execute()) {
            echo json_encode(["error" => $stmt->error]);
            exit();
        }
    }

    echo json_encode(["success" => true]);
    exit();
}

# =========================
# 🔹 PUT - ACTUALIZAR 1 ITEM COMPLETO
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $it = json_decode(file_get_contents("php://input"), true);

    if (!$it || !isset($it['id'])) {
        echo json_encode(["success" => false, "error" => "Datos inválidos"]);
        exit();
    }

    $id = intval($it['id']);
    $precio = floatval($it['precio_unitario'] ?? 0);
    $cantidad = floatval($it['cantidad'] ?? 0);
    $total = $precio * $cantidad;

    $proveedor = $it['proveedor'] ?? "";
    $proveedor_id = nullableInt($it['proveedor_id'] ?? null);
    $centro = nullableInt($it['centro_costo_id'] ?? null);

    $requiere = intval($it['requiere_cotizacion'] ?? 0);
    $insumo = intval($it['es_insumo'] ?? 0);
    $estado_insumo = $it['estado_insumo'] ?? 'Pendiente';
    $estado_pago = $it['estado_pago'] ?? 'Pendiente';

    $stmt = $conn->prepare("
        UPDATE items SET 
            precio_unitario = ?, 
            total = ?, 
            proveedor = ?, 
            proveedor_id = ?, 
            centro_costo_id = ?, 
            requiere_cotizacion = ?, 
            es_insumo = ?, 
            estado_insumo = ?,
            estado_pago = ?
        WHERE id = ?
    ");

    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }

    $stmt->bind_param(
        "ddsiiisssi",
        $precio,
        $total,
        $proveedor,
        $proveedor_id,
        $centro,
        $requiere,
        $insumo,
        $estado_insumo,
        $estado_pago,
        $id
    );

    if (!$stmt->execute()) {
        echo json_encode(["error" => $stmt->error]);
        exit();
    }

    echo json_encode(["success" => true]);
    exit();
}

# =========================
# 🔥 PATCH - CAMBIAR ESTADO DEL ITEM
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['id']) || !isset($data['estado'])) {
        echo json_encode(["success" => false, "error" => "Datos incompletos"]);
        exit();
    }

    $id = intval($data['id']);
    $estado = $data['estado'];
    $motivo = $data['motivo'] ?? null;

    $stmt = $conn->prepare("
    UPDATE items 
    SET estado_administracion = ?, comentario_estado = ?
    WHERE id = ?
");

    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }

    $stmt->bind_param("ssi", $estado, $motivo, $id);

    if (!$stmt->execute()) {
        echo json_encode(["error" => $stmt->error]);
        exit();
    }

    echo json_encode(["success" => true]);
    exit();
}