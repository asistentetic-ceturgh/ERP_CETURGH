<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

try {

    if (!isset($_POST['entrega_id'], $_POST['monto'])) {
        throw new Exception("Datos incompletos");
    }

    $entrega_id = (int)$_POST['entrega_id'];
    $monto = (float)$_POST['monto'];
    $tipo = trim($_POST['tipo_documento'] ?? '');
    $desc = trim($_POST['descripcion'] ?? '');

    if ($entrega_id <= 0) throw new Exception("Entrega inválida");
    if ($monto <= 0) throw new Exception("Monto inválido");

    $conn->begin_transaction();

    // 🔹 Obtener entrega + caja
    $stmt = $conn->prepare("
        SELECT monto, estado, caja_id 
        FROM caja_entregas 
        WHERE id = ?
    ");
    $stmt->bind_param("i", $entrega_id);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows === 0) {
        throw new Exception("Entrega no encontrada");
    }

    $entrega = $res->fetch_assoc();

    if ($entrega['estado'] === 'RENDIDO') {
        throw new Exception("Esta entrega ya fue rendida");
    }

    $caja_id = (int)$entrega['caja_id'];

    // 🔹 Subida de archivo
    $comprobante_url = null;

    if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {

        $file = $_FILES['file'];

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $permitidos = ['jpg', 'jpeg', 'png', 'pdf'];

        if (!in_array($ext, $permitidos)) {
            throw new Exception("Formato no permitido");
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            throw new Exception("Archivo demasiado grande");
        }

        $ruta = "uploads/comprobantes/";
        if (!is_dir($ruta)) mkdir($ruta, 0777, true);

        $nombre = time() . "_" . uniqid() . "." . $ext;
        $destino = $ruta . $nombre;

        if (!move_uploaded_file($file['tmp_name'], $destino)) {
            throw new Exception("Error al subir archivo");
        }

        $comprobante_url = $destino;
    }

    // 🔹 Insertar rendición
    $stmt = $conn->prepare("
        INSERT INTO caja_rendiciones 
        (entrega_id, fecha, monto, tipo_documento, descripcion, comprobante_url) 
        VALUES (?, NOW(), ?, ?, ?, ?)
    ");

    $stmt->bind_param("idsss", $entrega_id, $monto, $tipo, $desc, $comprobante_url);
    $stmt->execute();

    // 🔹 Total rendido
    $stmt = $conn->prepare("
        SELECT SUM(monto) as total 
        FROM caja_rendiciones 
        WHERE entrega_id = ?
    ");
    $stmt->bind_param("i", $entrega_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $total_rendido = (float)$row['total'];
    $monto_entrega = (float)$entrega['monto'];

    // 🔥 DIFERENCIA REAL
    $diferencia = $total_rendido - $monto_entrega;

    // 🔥 SI YA TERMINÓ → AJUSTAR CAJA
    if ($total_rendido >= $monto_entrega) {

        // 🔹 Actualizar estado
        $stmt = $conn->prepare("
            UPDATE caja_entregas 
            SET estado = 'RENDIDO' 
            WHERE id = ?
        ");
        $stmt->bind_param("i", $entrega_id);
        $stmt->execute();

        // 🔥 Ajuste de caja
        if ($diferencia != 0) {

            // Si gastó MÁS → sale dinero de caja
            // Si gastó MENOS → entra dinero a caja

            $stmt = $conn->prepare("
                UPDATE cajas_chicas 
                SET saldo_actual = saldo_actual - ? 
                WHERE id = ?
            ");

            // OJO:
            // diferencia positiva → resta
            // diferencia negativa → suma automáticamente

            $stmt->bind_param("di", $diferencia, $caja_id);
            $stmt->execute();
        }
    }

    $conn->commit();

    echo json_encode([
        "ok" => true,
        "message" => "Rendición registrada",
        "total_rendido" => $total_rendido,
        "diferencia" => $diferencia
    ]);

} catch (Exception $e) {

    if ($conn->errno) {
        $conn->rollback();
    }

    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}