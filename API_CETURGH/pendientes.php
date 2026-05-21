<?php
// ==============================
// HEADERS
// ==============================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
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
// 🔍 1. LISTAR PENDIENTES
// ==============================
if (isset($_GET['accion']) && $_GET['accion'] === 'pendientes') {

    $sql = "
        SELECT 
            id,
            descripcion,
            cantidad,
            tipo_inventario
        FROM items
        WHERE estado_pago = 'Pagado'
        AND estado_inventario = 'PENDIENTE'
        ORDER BY id DESC
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
// 🚀 2. INGRESAR A INVENTARIO
// ==============================
if (isset($_GET['accion']) && $_GET['accion'] === 'ingresar_desde_item') {

    $item_id = $_POST['item_id'] ?? null;
    $tipo = $_POST['tipo'] ?? null;

    if (!$item_id || !$tipo) {
        echo json_encode([
            "success" => false,
            "error" => "Faltan datos"
        ]);
        exit;
    }

    // 🔎 Obtener item
    $stmt = $conn->prepare("SELECT * FROM items WHERE id = ?");
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $item = $res->fetch_assoc();

    if (!$item) {
        echo json_encode([
            "success" => false,
            "error" => "Item no existe"
        ]);
        exit;
    }

    $descripcion = $item['descripcion'];
    $cantidad = (int)$item['cantidad'];

    // ============================
    // 📦 1. INSERT INVENTARIO BASE
    // ============================
    $codigo = strtoupper(substr($tipo, 0, 3)) . "-" . str_pad($item_id, 4, "0", STR_PAD_LEFT);

    $stmt = $conn->prepare("
        INSERT INTO inventario 
        (item_id, codigo, nombre, tipo, stock_actual, estado)
        VALUES (?, ?, ?, ?, ?, 'ACTIVO')
    ");

    $stmt->bind_param("isssi", $item_id, $codigo, $descripcion, $tipo, $cantidad);

    if (!$stmt->execute()) {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
        exit;
    }

    $inventario_id = $conn->insert_id;

    // ============================
    // 📦 2. INSERT SEGÚN TIPO
    // ============================
    switch ($tipo) {

    case "MOVIL":
        $stmt = $conn->prepare("
            INSERT INTO inventario_moviles (inventario_id, modelo)
            VALUES (?, ?)
        ");
        $stmt->bind_param("is", $inventario_id, $descripcion);
        break;

    case "HERRAMIENTA":
        $stmt = $conn->prepare("
            INSERT INTO inventario_herramientas (inventario_id, cantidad)
            VALUES (?, ?)
        ");
        $stmt->bind_param("ii", $inventario_id, $cantidad);
        break;

    case "INSUMO":
        $stmt = $conn->prepare("
            INSERT INTO inventario_insumos (inventario_id)
            VALUES (?)
        ");
        $stmt->bind_param("i", $inventario_id);
        break;

    case "MENAJE":
        $stmt = $conn->prepare("
            INSERT INTO inventario_menaje (inventario_id)
            VALUES (?)
        ");
        $stmt->bind_param("i", $inventario_id);
        break;

    case "OFICINA":
        $stmt = $conn->prepare("
            INSERT INTO inventario_oficina (inventario_id)
            VALUES (?)
        ");
        $stmt->bind_param("i", $inventario_id);
        break;

    // 🔥 NUEVO: DATA CENTER
    case "DATA_CENTER":

        $stmt = $conn->prepare("
            INSERT INTO inventario_data_center
            (inventario_id, tipo_equipo, marca_modelo, serie, estado, observaciones)
            VALUES (?, ?, ?, ?, 'DISPONIBLE', ?)
        ");

        // 🔥 aquí puedes mejorar luego con inputs reales
        $tipo_equipo = "ADAPTADOR"; // default
        $marca_modelo = $descripcion;
        $serie = "N/A";
        $observaciones = "Ingreso automático desde requerimiento";

        $stmt->bind_param(
            "issss",
            $inventario_id,
            $tipo_equipo,
            $marca_modelo,
            $serie,
            $observaciones
        );

        break;

    case "LOGISTICA":
        $stmt = $conn->prepare("
            INSERT INTO articulos (codigo, nombre, stock_actual, stock_min)
            VALUES (?, ?, ?, 0)
        ");
        $stmt->bind_param("ssi", $codigo, $descripcion, $cantidad);
        break;

    default:
        echo json_encode([
            "success" => false,
            "error" => "Tipo inválido"
        ]);
        exit;
    }

    if (!$stmt->execute()) {
        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
        exit;
    }

    // ============================
    // ✅ 3. ACTUALIZAR ITEM
    // ============================
    $update = $conn->prepare("
        UPDATE items 
        SET tipo_inventario = ?, estado_inventario = 'INGRESADO'
        WHERE id = ?
    ");
    $update->bind_param("si", $tipo, $item_id);
    $update->execute();

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