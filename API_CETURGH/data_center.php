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

$accion = $_GET['accion'] ?? null;

if (!$accion) {
    echo json_encode([
        "success" => false,
        "error" => "Acción requerida"
    ]);
    exit;
}

// ==============================
// 📦 LISTAR DATA CENTER
// ==============================
if ($accion === "listar") {

    $sql = "
        SELECT 
            i.id,
            i.codigo,
            i.nombre AS descripcion,
            i.ubicacion,

            dc.tipo_equipo,
            dc.marca_modelo,
            dc.serie,
            dc.estado,
            dc.observaciones

        FROM inventario i
        LEFT JOIN inventario_data_center dc 
            ON dc.inventario_id = i.id

        WHERE i.tipo = 'DATA_CENTER'
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
// ➕ CREAR ITEM DATA CENTER
// ==============================
if ($accion === "crear") {

    $input = json_decode(file_get_contents("php://input"), true);

    $descripcion = $input['descripcion'] ?? null;
    $codigo = $input['codigo'] ?? null;
    $ubicacion = $input['ubicacion'] ?? "DATA CENTER TIC";

    if (!$descripcion) {
        echo json_encode([
            "success" => false,
            "error" => "Descripción requerida"
        ]);
        exit;
    }

    // ==========================
    // 📦 INVENTARIO BASE
    // ==========================
    $stmt = $conn->prepare("
        INSERT INTO inventario 
        (codigo, nombre, tipo, estado, ubicacion)
        VALUES (?, ?, 'DATA_CENTER', 'ACTIVO', ?)
    ");

    $stmt->bind_param("sss", $codigo, $descripcion, $ubicacion);
    $stmt->execute();

    $inventario_id = $conn->insert_id;

    // ==========================
    // 🔧 DETALLE DATA CENTER
    // ==========================
    $stmt = $conn->prepare("
        INSERT INTO inventario_data_center
        (inventario_id, tipo_equipo, marca_modelo, serie, estado, observaciones)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "isssss",
        $inventario_id,
        $input['tipo_equipo'],
        $input['marca_modelo'],
        $input['serie'],
        $input['estado'],
        $input['observaciones']
    );

    if (!$stmt->execute()) {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
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
    "error" => "Acción no válida"
]);