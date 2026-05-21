<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

/* =========================
   PRE-FLIGHT CORS
========================= */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    /* =========================
       LEER JSON
    ========================= */
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    if (!$data) {
        throw new Exception("JSON inválido");
    }

    /* =========================
       DATOS OBLIGATORIOS
    ========================= */
    $proveedor_id = intval($data["proveedor_id"] ?? 0);
    $empresa_id   = intval($data["empresa_id"] ?? 0);
    $sede_id      = intval($data["sede_id"] ?? 0);
    $grupo_id     = intval($data["grupo_id"] ?? 0);
    $modo_igv     = $data["modo_igv"] ?? "incluido";   // recibido desde Tesorería
    $items        = $data["items"] ?? [];

    if (!$proveedor_id || !$empresa_id || !$grupo_id || empty($items)) {
        throw new Exception("Datos incompletos");
    }

    /* =========================
       INICIAR TRANSACCIÓN
    ========================= */
    $conn->begin_transaction();

    /* =========================
       VERIFICAR SI YA EXISTE ORDEN PARA ESTE GRUPO
    ========================= */
    $stmtExiste = $conn->prepare("
        SELECT id, numero, total, subtotal, igv, modo_igv
        FROM ordenes_compra
        WHERE grupo_id = ?
        LIMIT 1
    ");
    if (!$stmtExiste) {
        throw new Exception("Error verificando orden existente: " . $conn->error);
    }
    $stmtExiste->bind_param("i", $grupo_id);
    $stmtExiste->execute();
    $resExiste = $stmtExiste->get_result();

    if ($resExiste->num_rows > 0) {
        $ordenExistente = $resExiste->fetch_assoc();
        $conn->commit();
        echo json_encode([
            "success"  => true,
            "existing" => true,
            "orden"    => [
                "id"        => $ordenExistente["id"],
                "numero"    => $ordenExistente["numero"],
                "total"     => $ordenExistente["total"],
                "subtotal"  => $ordenExistente["subtotal"],
                "igv"       => $ordenExistente["igv"],
                "modo_igv"  => $ordenExistente["modo_igv"]
            ]
        ]);
        exit();
    }

    /* =========================
       DETERMINAR TIPO (OC / OS)
    ========================= */
    $tipo_req = "producto";
    $stmtTipo = $conn->prepare("
        SELECT r.tipo
        FROM items i
        INNER JOIN requerimientos r ON i.requerimiento_id = r.id
        WHERE i.grupo_id = ?
        LIMIT 1
    ");
    if (!$stmtTipo) {
        throw new Exception("Error tipo requerimiento: " . $conn->error);
    }
    $stmtTipo->bind_param("i", $grupo_id);
    $stmtTipo->execute();
    $resTipo = $stmtTipo->get_result();
    if ($resTipo->num_rows > 0) {
        $rowTipo = $resTipo->fetch_assoc();
        $tipo_req = strtolower(trim($rowTipo["tipo"] ?? "producto"));
    }
    $prefijo = ($tipo_req === "servicio") ? "OS" : "OC";
    $anio = date("Y");

    /* =========================
       CORRELATIVO
    ========================= */
    $stmtCorr = $conn->prepare("
        SELECT numero_actual
        FROM correlativos
        WHERE tipo = ? AND anio = ?
        FOR UPDATE
    ");
    if (!$stmtCorr) {
        throw new Exception("Error correlativo: " . $conn->error);
    }
    $stmtCorr->bind_param("si", $prefijo, $anio);
    $stmtCorr->execute();
    $resCorr = $stmtCorr->get_result();

    if ($resCorr->num_rows <= 0) {
        $numero_actual = 1;
        $stmtInsertCorr = $conn->prepare("
            INSERT INTO correlativos (tipo, anio, numero_actual)
            VALUES (?, ?, ?)
        ");
        $stmtInsertCorr->bind_param("sii", $prefijo, $anio, $numero_actual);
        $stmtInsertCorr->execute();
    } else {
        $rowCorr = $resCorr->fetch_assoc();
        $numero_actual = intval($rowCorr["numero_actual"]) + 1;
        $stmtUpdateCorr = $conn->prepare("
            UPDATE correlativos
            SET numero_actual = ?
            WHERE tipo = ? AND anio = ?
        ");
        $stmtUpdateCorr->bind_param("isi", $numero_actual, $prefijo, $anio);
        $stmtUpdateCorr->execute();
    }

    $numero_formateado = str_pad($numero_actual, 6, "0", STR_PAD_LEFT);
    $numero = $prefijo . "-" . $anio . "-" . $numero_formateado;

    /* =========================
       CÁLCULO DE SUBTOTAL, IGV Y TOTAL SEGÚN MODO_IGV
    ========================= */
    $base = 0; // suma de los totales de cada ítem (ya sea con IGV incluido o sin IGV)
    foreach ($items as $i) {
        $base += floatval($i["total"] ?? 0);
    }

    $igv_rate = 0.18; // 18%
    if ($modo_igv === "incluido") {
        // El monto base YA incluye IGV
        $total    = $base;
        $subtotal = $total / (1 + $igv_rate);
        $igv      = $total - $subtotal;
    } else { // "agregado"
        // El monto base es SUBTOTAL, se agrega IGV
        $subtotal = $base;
        $igv      = $subtotal * $igv_rate;
        $total    = $subtotal + $igv;
    }

    /* =========================
       INSERTAR ORDEN (sin firma_solicitante)
    ========================= */
    $stmtOrden = $conn->prepare("
        INSERT INTO ordenes_compra
        (
            grupo_id,
            numero,
            proveedor_id,
            empresa_id,
            sede_id,
            fecha,
            subtotal,
            igv,
            total,
            modo_igv
        )
        VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)
    ");
    if (!$stmtOrden) {
        throw new Exception("Error prepare orden: " . $conn->error);
    }
    $stmtOrden->bind_param(
        "isiiiddds",
        $grupo_id,
        $numero,
        $proveedor_id,
        $empresa_id,
        $sede_id,
        $subtotal,
        $igv,
        $total,
        $modo_igv
    );
    if (!$stmtOrden->execute()) {
        throw new Exception("Error execute orden: " . $stmtOrden->error);
    }
    $orden_id = $stmtOrden->insert_id;

    /* =========================
       INSERTAR ÍTEMS DE LA ORDEN
    ========================= */
    $stmtItem = $conn->prepare("
        INSERT INTO orden_compra_items
        (
            orden_id,
            item_id,
            descripcion,
            cantidad,
            precio,
            total,
            centro_costo_nombre,
            area_costo_nombre,
            departamento_nombre
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    if (!$stmtItem) {
        throw new Exception("Error prepare items: " . $conn->error);
    }

    foreach ($items as $i) {
        $item_id      = intval($i["id"] ?? 0);
        $descripcion  = $i["descripcion"] ?? '';
        $cantidad     = floatval($i["cantidad"] ?? 1);
        $precio       = floatval($i["precio_unitario"] ?? 0);
        $item_total   = floatval($i["total"] ?? 0);
        $centro       = $i["centro_costo"] ?? null;
        $area         = $i["area_costo"] ?? null;
        $departamento = $i["departamento"] ?? null;

        $stmtItem->bind_param(
            "iisdddsss",
            $orden_id,
            $item_id,
            $descripcion,
            $cantidad,
            $precio,
            $item_total,
            $centro,
            $area,
            $departamento
        );
        if (!$stmtItem->execute()) {
            throw new Exception("Error insertando item: " . $stmtItem->error);
        }
    }

    /* =========================
       CONFIRMAR TRANSACCIÓN
    ========================= */
    $conn->commit();

    echo json_encode([
        "success"  => true,
        "existing" => false,
        "orden"    => [
            "id"        => $orden_id,
            "grupo_id"  => $grupo_id,
            "numero"    => $numero,
            "subtotal"  => $subtotal,
            "igv"       => $igv,
            "total"     => $total,
            "modo_igv"  => $modo_igv,
            "tipo"      => $prefijo
        ]
    ]);

} catch (Exception $e) {
    // Solo hacer rollback si la transacción sigue activa
    if ($conn && $conn->errno === 0) {
        $conn->rollback();
    }
    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
}

$conn->close();
?>