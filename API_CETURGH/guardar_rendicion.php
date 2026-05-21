<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$conn->begin_transaction();

try {

    $caja_id = $_POST["caja_id"] ?? null;
    $fecha_rendicion = $_POST["fecha_rendicion"] ?? date("Y-m-d");

    $items = json_decode($_POST["items"], true);

    if (!$caja_id) {
        throw new Exception("Caja requerida");
    }

    if (!$items || count($items) <= 0) {
        throw new Exception("Sin items");
    }

    /*
    =====================================================
    OBTENER CAJA
    =====================================================
    */

    $stmtCaja = $conn->prepare("
    SELECT *
    FROM cajas_chicas
    WHERE id = ?
    ");

    $stmtCaja->bind_param("i", $caja_id);
    $stmtCaja->execute();

    $caja = $stmtCaja
        ->get_result()
        ->fetch_assoc();

    if (!$caja) {
        throw new Exception("Caja no encontrada");
    }

    $saldo_inicial = (float)$caja["saldo_actual"];

    /*
    =====================================================
    TOTAL
    =====================================================
    */

    $total = 0;

    foreach ($items as $it) {
        $total += (float)$it["monto"];
    }

    $saldo_final = $saldo_inicial - $total;

    if ($saldo_final < 0) {
        throw new Exception("Saldo insuficiente");
    }

    /*
    =====================================================
    CORRELATIVO
    =====================================================
    */

    $resCorrelativo = $conn->query("
    SELECT COUNT(*) total
    FROM rendiciones_caja
    ");

    $correlativo = $resCorrelativo
        ->fetch_assoc()["total"] + 1;

    $numero = "RCC-" . str_pad($correlativo, 4, "0", STR_PAD_LEFT);

    /*
    =====================================================
    INSERT RENDICION
    =====================================================
    */

    $stmt = $conn->prepare("
    INSERT INTO rendiciones_caja (
        caja_id,
        numero,
        fecha_rendicion,
        saldo_inicial,
        total_rendido,
        saldo_final,
        estado
    )
    VALUES (?, ?, ?, ?, ?, ?, 'ENVIADO')
    ");

    $stmt->bind_param(
        "issddd",
        $caja_id,
        $numero,
        $fecha_rendicion,
        $saldo_inicial,
        $total,
        $saldo_final
    );

    $stmt->execute();

    $rendicion_id = $stmt->insert_id;

    /*
    =====================================================
    UPLOAD DIR
    =====================================================
    */

    $uploadDir = "uploads/rendiciones/";

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    /*
    =====================================================
    ITEMS
    =====================================================
    */

    foreach ($items as $index => $item) {

        $archivoPath = null;

        if (isset($_FILES["archivo_$index"])) {

            $tmp = $_FILES["archivo_$index"]["tmp_name"];

            $nombre = time() . "_" . basename(
                $_FILES["archivo_$index"]["name"]
            );

            $destino = $uploadDir . $nombre;

            move_uploaded_file($tmp, $destino);

            $archivoPath = $destino;
        }

        $stmtItem = $conn->prepare("
        INSERT INTO rendicion_items (
            rendicion_id,
            fecha,
            proveedor,
            ruc_dni,
            tipo_documento,
            numero_documento,
            descripcion,
            monto,
            archivo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmtItem->bind_param(
            "issssssds",
            $rendicion_id,
            $item["fecha"],
            $item["proveedor"],
            $item["ruc_dni"],
            $item["tipo_documento"],
            $item["numero_documento"],
            $item["descripcion"],
            $item["monto"],
            $archivoPath
        );

        $stmtItem->execute();

        /*
        ============================================
        MOVIMIENTO
        ============================================
        */

        $nuevoSaldo = $saldo_inicial - (float)$item["monto"];

        $stmtMov = $conn->prepare("
        INSERT INTO movimientos_caja (
            caja_id,
            tipo,
            referencia_id,
            descripcion,
            ingreso,
            salida,
            saldo_resultante
        )
        VALUES (?, 'GASTO', ?, ?, 0, ?, ?)
        ");

        $descMov = $item["descripcion"];

        $stmtMov->bind_param(
            "iisdd",
            $caja_id,
            $rendicion_id,
            $descMov,
            $item["monto"],
            $nuevoSaldo
        );

        $stmtMov->execute();

        $saldo_inicial = $nuevoSaldo;
    }

    /*
    =====================================================
    ACTUALIZAR CAJA
    =====================================================
    */

    $stmtCajaUpdate = $conn->prepare("
    UPDATE cajas_chicas
    SET saldo_actual = ?
    WHERE id = ?
    ");

    $stmtCajaUpdate->bind_param(
        "di",
        $saldo_final,
        $caja_id
    );

    $stmtCajaUpdate->execute();

    /*
    =====================================================
    COMMIT
    =====================================================
    */

    $conn->commit();

    echo json_encode([
        "ok" => true,
        "numero" => $numero
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}