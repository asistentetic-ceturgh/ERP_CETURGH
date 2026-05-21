<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once "db.php";

// 🔥 IMPORTANTE: ahora viene por FormData, no JSON directo
$items = isset($_POST['items']) ? json_decode($_POST['items'], true) : [];

if (!$items || count($items) === 0) {
    echo json_encode([
        "success" => false,
        "error" => "Sin items"
    ]);
    exit();
}

// ✅ VALIDACIÓN
foreach ($items as $it) {
    if (!isset($it['id']) || !isset($it['proveedor_id'])) {
        echo json_encode([
            "success" => false,
            "error" => "Falta proveedor_id o id en items"
        ]);
        exit();
    }
}

// ==============================
// 📁 SUBIDA DE ARCHIVO (GUÍA)
// ==============================

$guia_url = null;

if (isset($_FILES['guia']) && $_FILES['guia']['error'] === 0) {

    $permitidos = ['pdf', 'jpg', 'jpeg', 'png'];
    $ext = strtolower(pathinfo($_FILES['guia']['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $permitidos)) {
        echo json_encode([
            "success" => false,
            "error" => "Formato de archivo no permitido"
        ]);
        exit();
    }

    // Crear carpeta si no existe
    $dir = "uploads/guias/";
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    // Nombre único
    $nombre = time() . "_" . uniqid() . "." . $ext;
    $ruta = $dir . $nombre;

    if (!move_uploaded_file($_FILES['guia']['tmp_name'], $ruta)) {
        echo json_encode([
            "success" => false,
            "error" => "Error al guardar archivo"
        ]);
        exit();
    }

    $guia_url = $ruta;
}

// ==============================
// 🧠 TRANSACCIÓN (PRO)
// ==============================

$conn->begin_transaction();

try {

    // 1. CREAR GRUPO CON GUÍA
    $stmtGrupo = $conn->prepare("
        INSERT INTO grupos_tesoreria (guia_url)
        VALUES (?)
    ");
    $stmtGrupo->bind_param("s", $guia_url);
    $stmtGrupo->execute();

    $grupo_id = $stmtGrupo->insert_id;

    // 2. ACTUALIZAR ITEMS
    $stmt = $conn->prepare("
        UPDATE items 
        SET grupo_id = ?, proveedor_id = ?
        WHERE id = ?
    ");

    foreach ($items as $it) {
        $stmt->bind_param("iii", $grupo_id, $it['proveedor_id'], $it['id']);
        $stmt->execute();
    }

    // ==============================
// 🚀 ACTUALIZAR ESTADO REQUERIMIENTO A "COTIZADO"
// ==============================

// obtener requerimientos afectados por los items enviados
$req_ids = array_unique(array_column($items, 'requerimiento_id'));

if (count($req_ids) > 0) {

    foreach ($req_ids as $req_id) {

        // validar si TODOS los items tienen precio
        $sqlCheck = "
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN precio_unitario IS NULL OR precio_unitario <= 0 THEN 1 ELSE 0 END) AS sin_precio
            FROM items
            WHERE requerimiento_id = ?
        ";

        $stmtCheck = $conn->prepare($sqlCheck);
        $stmtCheck->bind_param("i", $req_id);
        $stmtCheck->execute();
        $res = $stmtCheck->get_result()->fetch_assoc();

        $total = $res['total'];
        $sin_precio = $res['sin_precio'];

        // si todos tienen precio → Cotizado
        if ($total > 0 && $sin_precio == 0) {

            $updateReq = "
                UPDATE requerimientos
                SET estado = 'Cotizado'
                WHERE id = ?
            ";

            $stmtUpd = $conn->prepare($updateReq);
            $stmtUpd->bind_param("i", $req_id);
            $stmtUpd->execute();
        }
    }
}

    // ✅ TODO OK
    $conn->commit();

    echo json_encode([
        "success" => true,
        "grupo_id" => $grupo_id,
        "guia_url" => $guia_url
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "error" => "Error en la transacción",
        "detalle" => $e->getMessage()
    ]);
}