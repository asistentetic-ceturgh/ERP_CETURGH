<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json");
require_once "db.php";

$items = isset($_POST['items']) ? json_decode($_POST['items'], true) : [];

if (!$items || count($items) === 0) {
    echo json_encode([
        "success" => false,
        "error" => "Sin items"
    ]);
    exit();
}

foreach ($items as $it) {
    if (!isset($it['id']) || !isset($it['proveedor_id'])) {
        echo json_encode([
            "success" => false,
            "error" => "Falta proveedor_id o id en items"
        ]);
        exit();
    }
}

$guia_url = null;

if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === 0) {

    $permitidos = ['pdf', 'jpg', 'jpeg', 'png'];
    $ext = strtolower(pathinfo($_FILES['archivo']['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $permitidos)) {
        echo json_encode([
            "success" => false,
            "error" => "Formato de archivo no permitido"
        ]);
        exit();
    }

    $dir = "uploads/guias/";
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $nombre = time() . "_" . uniqid() . "." . $ext;
    $ruta = $dir . $nombre;

    if (!move_uploaded_file($_FILES['archivo']['tmp_name'], $ruta)) {
        echo json_encode([
            "success" => false,
            "error" => "Error al guardar archivo"
        ]);
        exit();
    }

    $guia_url = $ruta;
}

$conn->begin_transaction();

try {

    $stmtGrupo = $conn->prepare("
        INSERT INTO grupos_tesoreria (guia_url, incluye_igv)
        VALUES (?, ?)
    ");
    $incluye_igv = isset($_POST['incluye_igv']) ? (int)$_POST['incluye_igv'] : 0;
    $stmtGrupo->bind_param("si", $guia_url, $incluye_igv);
    $stmtGrupo->execute();

    $grupo_id = $stmtGrupo->insert_id;

    // ✅ CORREGIDO: 4 parámetros (iiii) para 4 placeholders
    $stmt = $conn->prepare("
        UPDATE items 
        SET grupo_id = ?, 
            proveedor_id = ?,
            incluye_igv = ?,
            flujo_estado = 'ADMINISTRACION',
            estado_logistica = 'ENVIADO',
            estado_administracion = 'PENDIENTE'
        WHERE id = ?
    ");

    foreach ($items as $it) {
        $incluye_igv_item = isset($it['incluye_igv']) ? (int)$it['incluye_igv'] : $incluye_igv;
        // 🔥 CORREGIDO: "iiii" en lugar de "iiiii"
        $stmt->bind_param("iiii", $grupo_id, $it['proveedor_id'], $incluye_igv_item, $it['id']);
        $stmt->execute();
    }

    $req_ids = array_unique(array_column($items, 'requerimiento_id'));

    if (count($req_ids) > 0) {

        foreach ($req_ids as $req_id) {

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
?>