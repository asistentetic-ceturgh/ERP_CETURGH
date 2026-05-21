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
// ERRORES A JSON
// ==============================
error_reporting(E_ALL);
ini_set('display_errors', 0);

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
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

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "error" => $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8");

// ==============================
// 🔍 GET → LISTAR HERRAMIENTAS
// ==============================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT 
            i.id,
            i.codigo,
            i.nombre,
            i.estado,
            h.cantidad
        FROM inventario i
        INNER JOIN inventario_herramientas h 
            ON i.id = h.inventario_id
        WHERE i.tipo = 'HERRAMIENTA'
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
        $data[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
    exit;
}

// ==============================
// ➕ POST → CREAR MANUAL
// ==============================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!is_array($input)) {
        echo json_encode([
            "success" => false,
            "error" => "JSON inválido"
        ]);
        exit;
    }

    $nombre = $input['nombre'] ?? null;
    $cantidad = $input['cantidad'] ?? 0;

    if (!$nombre) {
        echo json_encode([
            "success" => false,
            "error" => "Falta nombre"
        ]);
        exit;
    }

    // Generar código automático
    $codigo = "HER-" . strtoupper(substr(md5(uniqid()), 0, 6));

    // ==========================
    // 1. INSERT INVENTARIO
    // ==========================
    $stmt = $conn->prepare("
        INSERT INTO inventario 
        (codigo, nombre, tipo, estado, stock_actual)
        VALUES (?, ?, 'HERRAMIENTA', 'Disponible', ?)
    ");

    $stmt->bind_param("ssi", $codigo, $nombre, $cantidad);

    if (!$stmt->execute()) {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
        exit;
    }

    $inventario_id = $conn->insert_id;

    // ==========================
    // 2. INSERT DETALLE
    // ==========================
    $stmt2 = $conn->prepare("
        INSERT INTO inventario_herramientas (inventario_id, cantidad)
        VALUES (?, ?)
    ");

    $stmt2->bind_param("ii", $inventario_id, $cantidad);

    if (!$stmt2->execute()) {
        echo json_encode([
            "success" => false,
            "error" => $stmt2->error
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "inventario_id" => $inventario_id
    ]);
    exit;
}

// ==============================
// ❌ DEFAULT
// ==============================
echo json_encode([
    "success" => false,
    "error" => "Método no permitido"
]);