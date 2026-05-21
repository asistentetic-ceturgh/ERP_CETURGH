<?php

// 🔥 CONFIGURACIÓN SEGURA (evita HTML en errores)
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// 🔥 CAPTURAR ERRORES COMO JSON
set_exception_handler(function($e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
    exit();
});

require_once "db.php";

// 🔥 PREFLIGHT
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =======================
// 🔥 LEER FLAG IGV
// =======================
$incluye_igv = isset($_POST['incluye_igv']) ? (int)$_POST['incluye_igv'] : 0;

// =======================
// 🔥 VALIDAR ITEMS
// =======================
if (!isset($_POST['items'])) {
    throw new Exception("No hay items");
}

$items = json_decode($_POST['items'], true);

if (!is_array($items) || count($items) === 0) {
    throw new Exception("Items inválidos");
}

// =======================
// 📁 ARCHIVO OPCIONAL
// =======================
$ruta = null;

if (
    isset($_FILES['archivo']) &&
    $_FILES['archivo']['error'] === UPLOAD_ERR_OK
) {

    $file = $_FILES['archivo'];

    $ext = strtolower(
        pathinfo($file['name'], PATHINFO_EXTENSION)
    );

    $allowed = ['pdf', 'jpg', 'jpeg', 'png'];

    if (!in_array($ext, $allowed)) {
        throw new Exception("Formato no permitido");
    }

    // =======================
    // 📁 ASEGURAR DIRECTORIO
    // =======================
    $dir = "uploads/guias/";

    if (!is_dir($dir)) {

        if (!mkdir($dir, 0777, true)) {
            throw new Exception(
                "No se pudo crear directorio uploads/guias"
            );
        }
    }

    // =======================
    // 📁 GUARDAR ARCHIVO
    // =======================
    $nombre = time() . "_" .
        preg_replace(
            "/[^a-zA-Z0-9.]/",
            "_",
            $file['name']
        );

    $ruta = $dir . $nombre;

    if (
        !move_uploaded_file(
            $file['tmp_name'],
            $ruta
        )
    ) {
        throw new Exception("Error subiendo archivo");
    }
}

// =======================
// 🔥 TRANSACCIÓN
// =======================
$conn->begin_transaction();

try {

    // 🔥 1. CREAR GRUPO CON IGV
    $stmt = $conn->prepare("
        INSERT INTO grupos_tesoreria (guia_url, incluye_igv)
        VALUES (?, ?)
    ");

    if (!$stmt) {
        throw new Exception("Error prepare INSERT: " . $conn->error);
    }

    $stmt->bind_param("si", $ruta, $incluye_igv);

    if (!$stmt->execute()) {
        throw new Exception("Error execute INSERT: " . $stmt->error);
    }

    $grupo_id = $conn->insert_id;

    // 🔥 2. ACTUALIZAR ITEMS
    $stmtUpdate = $conn->prepare("
        UPDATE items
        SET 
            flujo_estado = 'ADMINISTRACION',
            estado_logistica = 'ENVIADO',
            estado_administracion = 'PENDIENTE',
            grupo_id = ?
        WHERE id = ?
    ");

    if (!$stmtUpdate) {
        throw new Exception("Error prepare UPDATE: " . $conn->error);
    }

    foreach ($items as $item) {

        if (!isset($item['id'])) {
            throw new Exception("Item sin ID");
        }

        $item_id = (int)$item['id'];

        $stmtUpdate->bind_param("ii", $grupo_id, $item_id);

        if (!$stmtUpdate->execute()) {
            throw new Exception("Error actualizando item ID {$item_id}: " . $stmtUpdate->error);
        }
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "grupo_id" => $grupo_id,
        "archivo" => $ruta,
        "incluye_igv" => $incluye_igv
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}