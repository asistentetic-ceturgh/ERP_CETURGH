<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

/* =========================
   PRE-FLIGHT CORS
========================= */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);
    exit();

}

/* =========================
   OCULTAR ERRORES HTML
========================= */

ini_set('display_errors', 0);
error_reporting(E_ALL);

/* =========================
   DB
========================= */

require_once "db.php";

/* =========================
   LEER JSON
========================= */

$raw = file_get_contents("php://input");

$data = json_decode($raw, true);

if (!$data) {

    echo json_encode([
        "success" => false,
        "error" => "JSON inválido",
        "raw" => $raw
    ]);

    exit();

}

/* =========================
   VALIDAR
========================= */

if (
    !isset($data['id']) ||
    !isset($data['items'])
) {

    echo json_encode([
        "success" => false,
        "error" => "Datos incompletos"
    ]);

    exit();

}

$orden_id = intval($data['id']);

$numero = trim($data['numero'] ?? '');

$fecha = $data['fecha'] ?? date("Y-m-d");

$condiciones = trim($data['condiciones'] ?? '');

$observaciones = trim($data['observaciones'] ?? '');

$modo_igv = $data['modo_igv'] ?? 'incluido';

$subtotal = floatval(
    $data['subtotal'] ?? 0
);

$igv = floatval(
    $data['igv'] ?? 0
);

$total = floatval(
    $data['total'] ?? 0
);

$items = $data['items'];

if (count($items) <= 0) {

    echo json_encode([
        "success" => false,
        "error" => "La orden no tiene items"
    ]);

    exit();

}

/* =========================
   TRANSACCIÓN
========================= */

$conn->begin_transaction();

try {

    /* =========================
       UPDATE ORDEN
    ========================= */

    $stmt = $conn->prepare("

        UPDATE ordenes_compra
SET
    numero = ?,
    fecha = ?,
    subtotal = ?,
    igv = ?,
    total = ?,
    modo_igv = ?,
    condiciones = ?,
    observaciones = ?
WHERE id = ?

    ");

    if (!$stmt) {

        throw new Exception(
            "Error prepare update: " . $conn->error
        );

    }

   $stmt->bind_param(
    "ssdddsssi",
    $numero,
    $fecha,
    $subtotal,
    $igv,
    $total,
    $modo_igv,
    $condiciones,
    $observaciones,
    $orden_id
);

    if (!$stmt->execute()) {

        throw new Exception(
            "Error execute update: " . $stmt->error
        );

    }

    $stmt->close();

    /* =========================
       ELIMINAR ITEMS ANTIGUOS
    ========================= */

    $stmtDelete = $conn->prepare("

        DELETE FROM orden_compra_items
        WHERE orden_id = ?

    ");

    if (!$stmtDelete) {

        throw new Exception(
            "Error prepare delete: " . $conn->error
        );

    }

    $stmtDelete->bind_param(
        "i",
        $orden_id
    );

    if (!$stmtDelete->execute()) {

        throw new Exception(
            "Error execute delete: " . $stmtDelete->error
        );

    }

    $stmtDelete->close();

    /* =========================
       INSERTAR ITEMS NUEVOS
    ========================= */

    $stmtInsert = $conn->prepare("

        INSERT INTO orden_compra_items
        (
            orden_id,
            item_id,
            descripcion,
            cantidad,
            precio,
            total
        )
        VALUES
        (?, ?, ?, ?, ?, ?)

    ");

    if (!$stmtInsert) {

        throw new Exception(
            "Error prepare insert: " . $conn->error
        );

    }

    foreach ($items as $i) {

        $item_id = intval($i['id'] ?? 0);

        $descripcion = trim(
            $i['descripcion'] ?? ''
        );

        $cantidad = floatval(
            $i['cantidad'] ?? 0
        );

        $precio = floatval(
            $i['precio'] ??
            $i['precio_unitario'] ??
            0
        );

        $item_total = $cantidad * $precio;

        $stmtInsert->bind_param(
            "iisddd",
            $orden_id,
            $item_id,
            $descripcion,
            $cantidad,
            $precio,
            $item_total
        );

        if (!$stmtInsert->execute()) {

            throw new Exception(
                "Error insert item: " . $stmtInsert->error
            );

        }

    }

    $stmtInsert->close();

    /* =========================
       COMMIT
    ========================= */

    $conn->commit();

    echo json_encode([

        "success" => true,

        "message" => "Orden actualizada correctamente",

        "orden_id" => $orden_id,

        "total" => $total

    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([

        "success" => false,

        "error" => $e->getMessage()

    ]);

}

$conn->close();