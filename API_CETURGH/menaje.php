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

if (!$conn) {
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a BD"
    ]);
    exit;
}

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
// 📦 LISTAR MENAJE
// ==============================
if ($accion === 'listar') {

    $sql = "
        SELECT 
            i.codigo,
            i.nombre,
            i.stock_actual,
            i.stock_min,
            m.material,
            m.categoria,
            m.ubicacion,
            m.estado_conservacion,
            m.ultimo_inventario
        FROM inventario i
        INNER JOIN inventario_menaje m 
            ON m.inventario_id = i.id
        WHERE i.tipo = 'MENAJE'
        ORDER BY i.id DESC
    ";

    $res = $conn->query($sql);

    if (!$res) {
        echo json_encode([
            "success" => false,
            "error" => "Error SQL: " . $conn->error
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
// ❌ DEFAULT
// ==============================
echo json_encode([
    "success" => false,
    "error" => "Acción no válida"
]);
exit;