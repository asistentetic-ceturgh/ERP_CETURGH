<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "db.php";

$conn->begin_transaction();

try {

    /*
    =====================================================
    INPUTS
    =====================================================
    */

    $solicitud_id = $_POST["solicitud_id"] ?? null;
    $pagado_por = $_POST["pagado_por"] ?? null;

    if (!$solicitud_id) {
        throw new Exception("Solicitud requerida");
    }

    /*
    =====================================================
    BUSCAR SOLICITUD
    =====================================================
    */

    $stmt = $conn->prepare("
    SELECT *
    FROM solicitudes_caja
    WHERE id = ?
    ");

    $stmt->bind_param("i", $solicitud_id);
    $stmt->execute();

    $solicitud = $stmt
        ->get_result()
        ->fetch_assoc();

    if (!$solicitud) {
        throw new Exception("Solicitud no encontrada");
    }

    if (
        $solicitud["estado"] === "PAGADO"
    ) {
        throw new Exception("La solicitud ya fue pagada");
    }

    /*
    =====================================================
    VARIABLES
    =====================================================
    */

    $tipo = $solicitud["tipo"];

    $monto = (float)$solicitud["monto"];

    $empresa_id = $solicitud["empresa_id"];
    $sede_id = $solicitud["sede_id"];
    $centro_costo_id = $solicitud["centro_costo_id"];

    $caja_id = $solicitud["caja_id"];

    /*
    =====================================================
    SUBIR VOUCHER
    =====================================================
    */

    $voucherPath = null;

    if (isset($_FILES["voucher"])) {

        $uploadDir = "uploads/vouchers/";

        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $nombre = time() . "_" .
            basename($_FILES["voucher"]["name"]);

        $destino = $uploadDir . $nombre;

        move_uploaded_file(
            $_FILES["voucher"]["tmp_name"],
            $destino
        );

        $voucherPath = $destino;
    }

    /*
    =====================================================
    APERTURA
    =====================================================
    */

    if ($tipo === "APERTURA") {

        /*
        =============================================
        GENERAR CODIGO
        =============================================
        */

        $resCodigo = $conn->query("
        SELECT COUNT(*) total
        FROM cajas_chicas
        ");

        $correlativo = $resCodigo
            ->fetch_assoc()["total"] + 1;

        $codigo = "CC-" .
            str_pad($correlativo, 4, "0", STR_PAD_LEFT);

        /*
        =============================================
        CREAR CAJA
        =============================================
        */

        $stmtCaja = $conn->prepare("
        INSERT INTO cajas_chicas (
            empresa_id,
            sede_id,
            centro_costo_id,
            codigo,
            monto_base,
            saldo_actual,
            estado
        )
        VALUES (?, ?, ?, ?, ?, ?, 'ACTIVA')
        ");

        $stmtCaja->bind_param(
            "iiisdd",
            $empresa_id,
            $sede_id,
            $centro_costo_id,
            $codigo,
            $monto,
            $monto
        );

        $stmtCaja->execute();

        $nuevoCajaId = $stmtCaja->insert_id;

        /*
        =============================================
        MOVIMIENTO APERTURA
        =============================================
        */

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
        VALUES (
            ?,
            'APERTURA',
            ?,
            ?,
            ?,
            0,
            ?
        )
        ");

        $descripcionMov =
            "Apertura inicial de caja chica";

        $stmtMov->bind_param(
            "iisdd",
            $nuevoCajaId,
            $solicitud_id,
            $descripcionMov,
            $monto,
            $monto
        );

        $stmtMov->execute();

        /*
        =============================================
        ACTUALIZAR SOLICITUD
        =============================================
        */

        $stmtUpdate = $conn->prepare("
        UPDATE solicitudes_caja
        SET
            estado = 'PAGADO',
            caja_id = ?,
            pagado_por = ?,
            fecha_pago = NOW(),
            voucher_pago = ?
        WHERE id = ?
        ");

        $stmtUpdate->bind_param(
            "iisi",
            $nuevoCajaId,
            $pagado_por,
            $voucherPath,
            $solicitud_id
        );

        $stmtUpdate->execute();
    }

    /*
    =====================================================
    RECARGA
    =====================================================
    */

    if ($tipo === "RECARGA") {

        /*
        =============================================
        BUSCAR CAJA
        =============================================
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

        $nuevoSaldo =
            (float)$caja["saldo_actual"] + $monto;

        /*
        =============================================
        ACTUALIZAR CAJA
        =============================================
        */

        $stmtUpdateCaja = $conn->prepare("
        UPDATE cajas_chicas
        SET saldo_actual = ?
        WHERE id = ?
        ");

        $stmtUpdateCaja->bind_param(
            "di",
            $nuevoSaldo,
            $caja_id
        );

        $stmtUpdateCaja->execute();

        /*
        =============================================
        MOVIMIENTO RECARGA
        =============================================
        */

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
        VALUES (
            ?,
            'RECARGA',
            ?,
            ?,
            ?,
            0,
            ?
        )
        ");

        $descripcionMov =
            "Recarga de caja chica";

        $stmtMov->bind_param(
            "iisdd",
            $caja_id,
            $solicitud_id,
            $descripcionMov,
            $monto,
            $nuevoSaldo
        );

        $stmtMov->execute();

        /*
        =============================================
        ACTUALIZAR SOLICITUD
        =============================================
        */

        $stmtUpdate = $conn->prepare("
        UPDATE solicitudes_caja
        SET
            estado = 'PAGADO',
            pagado_por = ?,
            fecha_pago = NOW(),
            voucher_pago = ?
        WHERE id = ?
        ");

        $stmtUpdate->bind_param(
            "isi",
            $pagado_por,
            $voucherPath,
            $solicitud_id
        );

        $stmtUpdate->execute();
    }

    /*
    =====================================================
    DESCONTAR PRESUPUESTO
    =====================================================
    */

    $stmtPresupuesto = $conn->prepare("
    UPDATE centros_costos
    SET presupuesto = presupuesto - ?
    WHERE id = ?
    ");

    $stmtPresupuesto->bind_param(
        "di",
        $monto,
        $centro_costo_id
    );

    $stmtPresupuesto->execute();

    /*
    =====================================================
    COMMIT
    =====================================================
    */

    $conn->commit();

    echo json_encode([
        "ok" => true
    ]);

} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}