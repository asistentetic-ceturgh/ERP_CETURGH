<?php
// ==============================
// HEADERS (CORS + JSON)
// ==============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Responder preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ==============================
// NO MOSTRAR HTML DE ERRORES
// ==============================
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Convertir cualquier warning/error a JSON
set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "PHP Error: $errstr en $errfile:$errline"
    ]);
    exit;
});

// Limpiar cualquier salida previa (espacios, BOM, etc.)
if (ob_get_length()) ob_clean();

// ==============================
// CONEXIÓN
// ==============================
require_once "db.php";

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "error" => "Error conexión BD: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8");

// ==============================
// GET
// ==============================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $res = $conn->query("SELECT * FROM articulos");

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
// POST
// ==============================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $raw = file_get_contents("php://input");
    $input = json_decode($raw, true);

    if (!is_array($input)) {
        echo json_encode([
            "success" => false,
            "error" => "JSON inválido",
            "raw" => $raw // 👈 útil para debug
        ]);
        exit;
    }

    $fields = ["codigo","nombre","marca","categoria","subcategoria","unidad","stock_actual","stock_min"];

    foreach ($fields as $f) {
        if (!isset($input[$f])) {
            echo json_encode([
                "success" => false,
                "error" => "Falta campo: $f"
            ]);
            exit;
        }
    }

    // ==============================
    // PREPARED STATEMENT (CLAVE 🔥)
    // ==============================
    $stmt = $conn->prepare("
        INSERT INTO articulos 
        (codigo, nombre, marca, categoria, subcategoria, unidad, stock_actual, stock_min)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "error" => $conn->error
        ]);
        exit;
    }

    $stmt->bind_param(
        "ssssssii",
        $input['codigo'],
        $input['nombre'],
        $input['marca'],
        $input['categoria'],
        $input['subcategoria'],
        $input['unidad'],
        $input['stock_actual'],
        $input['stock_min']
    );

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    $stmt->close();
    exit;
}

// ==============================
// 📦 AGREGAR STOCK
// ==============================
if (isset($_GET['accion']) && $_GET['accion'] === 'agregar_stock') {

    $articulo_id = $_POST['articulo_id'] ?? null;
    $cantidad = (int)($_POST['cantidad'] ?? 0);

    if (!$articulo_id || $cantidad <= 0) {
        echo json_encode([
            "success" => false,
            "error" => "Datos inválidos"
        ]);
        exit;
    }

    // 1. Registrar movimiento
    $stmt = $conn->prepare("
        INSERT INTO movimientos_stock (articulo_id, tipo, cantidad, motivo)
        VALUES (?, 'ENTRADA', ?, 'Stock inicial')
    ");
    $stmt->bind_param("ii", $articulo_id, $cantidad);
    $stmt->execute();

    // 2. Actualizar stock
    $stmt = $conn->prepare("
        UPDATE articulos 
        SET stock_actual = stock_actual + ?
        WHERE id = ?
    ");
    $stmt->bind_param("ii", $cantidad, $articulo_id);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}

// ==============================
// ✏️ EDITAR ARTICULO
// ==============================
if (isset($_GET['accion']) && $_GET['accion'] === 'editar') {

    $input = json_decode(file_get_contents("php://input"), true);

    $id = $input['id'] ?? null;

    if (!$id) {
        echo json_encode([
            "success" => false,
            "error" => "ID requerido"
        ]);
        exit;
    }

    $stmt = $conn->prepare("
        UPDATE articulos SET
            codigo = ?,
            nombre = ?,
            marca = ?,
            categoria = ?,
            subcategoria = ?,
            unidad = ?,
            stock_min = ?,
            ubicacion = ?,
            responsable = ?
        WHERE id = ?
    ");

    $stmt->bind_param(
        "ssssssissi",
        $input['codigo'],
        $input['nombre'],
        $input['marca'],
        $input['categoria'],
        $input['subcategoria'],
        $input['unidad'],
        $input['stock_min'],
        $input['ubicacion'],
        $input['responsable'],
        $id
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    exit;
}

// ==============================
// 🔄 MOVER STOCK (ENTRADA / SALIDA)
// ==============================
if (isset($_GET['accion']) && $_GET['accion'] === 'mover_stock') {

    $articulo_id = $_POST['articulo_id'] ?? null;
    $cantidad = (int)($_POST['cantidad'] ?? 0);
    $tipo = $_POST['tipo'] ?? null;

    if (!$articulo_id || $cantidad <= 0 || !$tipo) {
        echo json_encode([
            "success" => false,
            "error" => "Datos inválidos"
        ]);
        exit;
    }

    // 🔍 Obtener stock actual
    $res = $conn->query("SELECT stock_actual FROM articulos WHERE id = $articulo_id");
    $row = $res->fetch_assoc();
    $stock_actual = (int)$row['stock_actual'];

    // ❌ Evitar stock negativo
    if ($tipo === "SALIDA" && $stock_actual < $cantidad) {
        echo json_encode([
            "success" => false,
            "error" => "Stock insuficiente"
        ]);
        exit;
    }

    // 📦 Registrar movimiento
    $stmt = $conn->prepare("
        INSERT INTO movimientos_stock (articulo_id, tipo, cantidad, motivo)
        VALUES (?, ?, ?, ?)
    ");

    $motivo = $tipo === "ENTRADA" ? "Ingreso manual" : "Salida manual";

    $stmt->bind_param("isis", $articulo_id, $tipo, $cantidad, $motivo);
    $stmt->execute();

    // 📊 Actualizar stock
    if ($tipo === "ENTRADA") {
        $stmt = $conn->prepare("
            UPDATE articulos 
            SET stock_actual = stock_actual + ?
            WHERE id = ?
        ");
    } else {
        $stmt = $conn->prepare("
            UPDATE articulos 
            SET stock_actual = stock_actual - ?
            WHERE id = ?
        ");
    }

    $stmt->bind_param("ii", $cantidad, $articulo_id);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}

// ==============================
// MÉTODO NO PERMITIDO
// ==============================
echo json_encode([
    "success" => false,
    "error" => "Método no permitido"
]);