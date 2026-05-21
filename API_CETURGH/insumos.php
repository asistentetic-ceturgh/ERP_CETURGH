<?php
// ==============================
// HEADERS
// ==============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ==============================
// ERRORES → JSON
// ==============================
error_reporting(E_ALL);
ini_set('display_errors', 0);

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    echo json_encode([
        "success" => false,
        "error" => "$errstr en $errfile:$errline"
    ]);
    exit;
});

// ==============================
// CONEXIÓN
// ==============================
require_once "db.php";
$conn->set_charset("utf8");

// ==============================
// VALIDAR ACCIÓN
// ==============================
$accion = $_GET['accion'] ?? null;

if (!$accion) {
    echo json_encode([
        "success" => false,
        "error" => "Acción requerida"
    ]);
    exit;
}

// ==============================
// 📦 LISTAR INSUMOS
// ==============================
if ($accion === 'listar') {

    $sql = "
        SELECT 
            i.id,
            i.codigo,
            i.nombre,
            i.marca,
            i.categoria,
            i.unidad,
            i.stock_min,
            i.ubicacion,
            ins.proveedor,
            ins.dias_alerta AS dias_alerta_vencimiento
        FROM inventario i
        INNER JOIN inventario_insumos ins 
            ON ins.inventario_id = i.id
        WHERE i.tipo = 'INSUMO'
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

        $inventario_id = (int)$row['id'];

        // ==========================
        // 🔥 TRAER LOTES (SEGURO)
        // ==========================
        $stmt = $conn->prepare("
            SELECT lote, cantidad, vencimiento
            FROM inventario_lotes
            WHERE inventario_id = ?
        ");
        $stmt->bind_param("i", $inventario_id);
        $stmt->execute();

        $lotes_res = $stmt->get_result();

        $lotes = [];

        while ($l = $lotes_res->fetch_assoc()) {
            $lotes[] = [
                "lote" => $l["lote"],
                "cantidad" => (int)$l["cantidad"],
                "vencimiento" => $l["vencimiento"]
            ];
        }

        // SI NO HAY LOTES → ARRAY VACÍO (CLAVE)
        $row['lotes'] = $lotes;

        $data[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
}

// ==============================
// ➕ INGRESAR LOTE (OPCIONAL PRO)
// ==============================
// Esto conecta PERFECTO con tu sistema (siguiente nivel)
if ($accion === 'agregar_lote') {

    $input = json_decode(file_get_contents("php://input"), true);

    $inventario_id = $input['inventario_id'] ?? null;
    $lote = $input['lote'] ?? null;
    $cantidad = $input['cantidad'] ?? 0;
    $vencimiento = $input['vencimiento'] ?? null;

    if (!$inventario_id || !$lote || !$cantidad) {
        echo json_encode([
            "success" => false,
            "error" => "Datos incompletos"
        ]);
        exit;
    }

    // INSERT LOTE
    $stmt = $conn->prepare("
        INSERT INTO inventario_lotes (inventario_id, lote, cantidad, vencimiento)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("isis", $inventario_id, $lote, $cantidad, $vencimiento);

    if (!$stmt->execute()) {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
        exit;
    }

    // 🔥 ACTUALIZAR STOCK GENERAL
    $update = $conn->prepare("
        UPDATE inventario 
        SET stock_actual = stock_actual + ?
        WHERE id = ?
    ");
    $update->bind_param("ii", $cantidad, $inventario_id);
    $update->execute();

    echo json_encode([
        "success" => true
    ]);
    exit;
}

// ==============================
// ❌ DEFAULT
// ==============================
echo json_encode([
    "success" => false,
    "error" => "Acción no válida"
]);