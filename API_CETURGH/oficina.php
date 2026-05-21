<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

error_reporting(E_ALL);
ini_set('display_errors', 0);

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    echo json_encode([
        "success" => false,
        "error" => "$errstr en $errfile:$errline"
    ]);
    exit;
});

require_once "db.php";
$conn->set_charset("utf8");

$accion = $_GET['accion'] ?? null;

if (!$accion) {
    echo json_encode(["success" => false, "error" => "Acción requerida"]);
    exit;
}

# ==============================
# 📦 LISTAR ACTIVOS IT
# ==============================
if ($accion === "listar") {

    $sql = "
        SELECT 
            i.id,
            i.codigo,
            i.nombre AS descripcion,
            i.estado,
            i.ubicacion,

            o.equipo,
            o.marca,
            o.modelo,
            o.serie,
            o.sistema_operativo AS so,
            o.office,
            o.responsable,
            o.fecha_registro,
            o.anio_adquisicion AS tiempo,
            o.observacion

        FROM inventario i
        INNER JOIN inventario_oficina o 
            ON o.inventario_id = i.id

        WHERE i.tipo = 'OFICINA'
        ORDER BY i.id DESC
    ";

    $res = $conn->query($sql);

    if (!$res) {
        echo json_encode(["success" => false, "error" => $conn->error]);
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

# ==============================
# ➕ REGISTRAR ACTIVO IT
# ==============================
if ($accion === "crear") {

    $input = json_decode(file_get_contents("php://input"), true);

    $nombre = $input['descripcion'] ?? null;
    $tipo = "OFICINA";
    $codigo = $input['codigo'] ?? null;

    if (!$nombre || !$codigo) {
        echo json_encode(["success" => false, "error" => "Faltan datos"]);
        exit;
    }

    # 🔹 INVENTARIO BASE
    $stmt = $conn->prepare("
        INSERT INTO inventario (codigo, nombre, tipo, estado, ubicacion)
        VALUES (?, ?, 'OFICINA', 'OPERATIVO', ?)
    ");
    $stmt->bind_param("sss", $codigo, $nombre, $input['ubicacion']);
    $stmt->execute();

    $inventario_id = $conn->insert_id;

    # 🔹 DETALLE OFICINA
    $stmt = $conn->prepare("
        INSERT INTO inventario_oficina 
        (inventario_id, equipo, marca, modelo, serie, sistema_operativo, office, responsable, fecha_registro, anio_adquisicion, observacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "issssssssis",
        $inventario_id,
        $input['equipo'],
        $input['marca'],
        $input['modelo'],
        $input['serie'],
        $input['so'],
        $input['office'],
        $input['responsable'],
        $input['fecha'],
        $input['tiempo'],
        $input['observacion']
    );

    if (!$stmt->execute()) {
        echo json_encode(["success" => false, "error" => $stmt->error]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "inventario_id" => $inventario_id
    ]);
    exit;
}

echo json_encode(["success" => false, "error" => "Acción no válida"]);