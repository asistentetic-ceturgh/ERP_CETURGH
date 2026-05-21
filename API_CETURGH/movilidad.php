<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// NO romper JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('upload_max_filesize', '20M');
ini_set('post_max_size', '20M');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) $data = [];

/* =====================================================
   GET (CON USUARIO + DETALLES)
===================================================== */
if ($method === 'GET') {

    $sql = "SELECT 
        pm.*,
        e.nombre AS empresa,
        s.nombre AS sede,
        d.nombre AS departamento_nombre,
        u.nombre AS usuario_nombre,
        u.documento AS usuario_dni,
        u.telefono AS usuario_telefono,
        u.firma AS firma_creador,

        ua.nombre AS aprobador_nombre,
        ua.firma AS firma_aprobador

    FROM planilla_movilidad pm
    LEFT JOIN empresas e ON pm.empresa_id = e.id
    LEFT JOIN sedes s ON pm.sede_id = s.id
    LEFT JOIN departamentos d ON pm.departamento_id = d.id
    LEFT JOIN usuarios u ON pm.creador_id = u.id
    LEFT JOIN usuarios ua ON pm.aprobado_por = ua.id
    ORDER BY pm.id DESC";

    $res = $conn->query($sql);
    $rows = [];

    while ($r = $res->fetch_assoc()) {

        // ===== DETALLES =====
        $det = [];

        $resDet = $conn->query("
            SELECT fecha, monto 
            FROM planilla_movilidad_detalle 
            WHERE planilla_id = " . intval($r['id'])
        );

        if ($resDet) {
            while ($d = $resDet->fetch_assoc()) {
                $det[] = $d;
            }
        }

        // ===== FORMATEAR USUARIO =====
        $r['usuario'] = $r['usuario_nombre'] ?? "Trabajador";
        $r['dni'] = $r['usuario_dni'] ?? "-";

        $r['detalles'] = $det;

        $rows[] = $r;
    }

    echo json_encode($rows);
    exit;
}

/* =====================================================
   POST FORM-DATA (PAGAR + COMPROBANTE)
===================================================== */
if (
    $method === 'POST'
    && isset($_FILES['comprobante'])
) {

    try {

        $id = intval($_POST['id'] ?? 0);
        $pagado_por = intval($_POST['pagado_por'] ?? 0);

        if (!$id) {
            throw new Exception("ID inválido");
        }

        $file = $_FILES['comprobante'];

        if ($file['error'] !== 0) {
            throw new Exception("Error subiendo archivo");
        }

        $permitidos = [
            'image/png',
            'image/jpeg',
            'application/pdf'
        ];

        if (!in_array($file['type'], $permitidos)) {
            throw new Exception("Formato no permitido");
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);

        $nombre = 'movilidad_' . time() . '_' . rand(1000,9999) . '.' . $ext;

        $carpeta = 'uploads/comprobantes_movilidad/';

        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0777, true);
        }

        $ruta = $carpeta . $nombre;

        if (!move_uploaded_file($file['tmp_name'], $ruta)) {
            throw new Exception("No se pudo guardar archivo");
        }

        $tipo = $file['type'] === 'application/pdf'
            ? 'pdf'
            : 'imagen';

        $stmt = $conn->prepare("
            UPDATE planilla_movilidad
            SET
                estado='Pagado',
                comprobante_pago=?,
                comprobante_tipo=?,
                pagado_por=?,
                fecha_pago=NOW()
            WHERE id=?
        ");

        $stmt->bind_param(
            "ssii",
            $ruta,
            $tipo,
            $pagado_por,
            $id
        );

        $stmt->execute();

        echo json_encode([
            "ok" => true,
            "archivo" => $ruta
        ]);

    } catch (Exception $e) {

        echo json_encode([
            "ok" => false,
            "msg" => $e->getMessage()
        ]);
    }

    exit;
}

/* =====================================================
   POST (CREAR)
===================================================== */
if ($method === 'POST') {

    try {

        if (!isset($data['detalles']) || !is_array($data['detalles'])) {
            throw new Exception("Detalles inválidos");
        }

        if (empty($data['creador_id'])) {
            throw new Exception("Falta creador_id");
        }

        $conn->begin_transaction();

        // ===== TOTAL =====
        $total = 0;
        foreach ($data['detalles'] as $d) {
            $total += floatval($d['monto'] ?? 0);
        }

        // ===== INSERT CABECERA =====
        $stmt = $conn->prepare("
            INSERT INTO planilla_movilidad 
            (fecha, empresa_id, sede_id, departamento_id, motivo, origen, destino, monto_total, estado, creador_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Sin firmar', ?)
        ");

        if (!$stmt) throw new Exception($conn->error);

        $stmt->bind_param("siiisssdi",
            $data['fecha'],
            $data['empresa_id'],
            $data['sede_id'],
            $data['departamento_id'],
            $data['motivo'],
            $data['origen'],
            $data['destino'],
            $total,
            $data['creador_id']
        );

        if (!$stmt->execute()) throw new Exception($stmt->error);

        $planilla_id = $stmt->insert_id;

        // ===== INSERT DETALLES =====
        $stmtDet = $conn->prepare("
            INSERT INTO planilla_movilidad_detalle 
            (planilla_id, fecha, monto)
            VALUES (?, ?, ?)
        ");

        if (!$stmtDet) throw new Exception($conn->error);

        foreach ($data['detalles'] as $d) {

            $fecha = $d['fecha'] ?? null;
            $monto = floatval($d['monto'] ?? 0);

            $stmtDet->bind_param("isd", $planilla_id, $fecha, $monto);

            if (!$stmtDet->execute()) throw new Exception($stmtDet->error);
        }

        $conn->commit();

        echo json_encode([
            "ok" => true,
            "id" => $planilla_id
        ]);

    } catch (Exception $e) {

        $conn->rollback();

        echo json_encode([
            "ok" => false,
            "error" => $e->getMessage()
        ]);
    }

    exit;
}

/* =====================================================
   PUT (ACCIONES)
===================================================== */
if ($method === 'PUT') {

    $id = intval($data['id'] ?? 0);
    $action = $data['action'] ?? '';

    /* =====================
       EDITAR
    ===================== */
    if ($action === "editar") {

        try {

            if (!isset($data['detalles']) || !is_array($data['detalles'])) {
                throw new Exception("Detalles inválidos");
            }

            $conn->begin_transaction();

            $total = 0;
            foreach ($data['detalles'] as $d) {
                $total += floatval($d['monto'] ?? 0);
            }

            $stmt = $conn->prepare("
                UPDATE planilla_movilidad 
                SET motivo=?, origen=?, destino=?, monto_total=?
                WHERE id=? AND estado='Sin firmar'
            ");

            if (!$stmt) throw new Exception($conn->error);

            $stmt->bind_param("sssdi",
                $data['motivo'],
                $data['origen'],
                $data['destino'],
                $total,
                $id
            );

            if (!$stmt->execute()) throw new Exception($stmt->error);

            // borrar detalles
            $conn->query("DELETE FROM planilla_movilidad_detalle WHERE planilla_id=$id");

            // reinsertar
            $stmtDet = $conn->prepare("
                INSERT INTO planilla_movilidad_detalle 
                (planilla_id, fecha, monto)
                VALUES (?, ?, ?)
            ");

            foreach ($data['detalles'] as $d) {

                $fecha = $d['fecha'] ?? null;
                $monto = floatval($d['monto'] ?? 0);

                $stmtDet->bind_param("isd", $id, $fecha, $monto);

                if (!$stmtDet->execute()) throw new Exception($stmtDet->error);
            }

            $conn->commit();

        } catch (Exception $e) {

            $conn->rollback();

            echo json_encode([
                "ok" => false,
                "error" => $e->getMessage()
            ]);
            exit;
        }
    }

    /* =====================
       FIRMAR
    ===================== */
    if ($action === "firmar") {

        $stmt = $conn->prepare("
            UPDATE planilla_movilidad 
            SET estado='Pendiente', firmado_por=?, fecha_firma=NOW()
            WHERE id=?
        ");

        $stmt->bind_param("si", $data['firmado_por'], $id);
        $stmt->execute();
    }

    /* =====================
       APROBAR
    ===================== */
    if ($action === "aprobar") {

    $aprobado_por = intval($data['aprobado_por'] ?? 0);

    $stmt = $conn->prepare("
        UPDATE planilla_movilidad 
        SET 
            estado='Aprobado',
            aprobado_por=?,
            fecha_aprobacion=NOW()
        WHERE id=?
    ");

    $stmt->bind_param("ii", $aprobado_por, $id);
    $stmt->execute();
}

    /* =====================
       DENEGAR
    ===================== */
    if ($action === "denegar") {

        $estado = empty($data['comentario']) ? "Denegado" : "Observado";

        $stmt = $conn->prepare("
            UPDATE planilla_movilidad 
            SET estado=? 
            WHERE id=?
        ");

        $stmt->bind_param("si", $estado, $id);
        $stmt->execute();
    }

    /* =====================
       PAGAR
    ===================== */
    if ($action === "pagar") {

        $conn->query("UPDATE planilla_movilidad SET estado='Pagado' WHERE id=$id");

        $conn->query("
            INSERT INTO movimientos (tipo, referencia_id, monto, departamento_id)
            SELECT 'movilidad', id, monto_total, departamento_id
            FROM planilla_movilidad WHERE id=$id
        ");
    }

    echo json_encode(["ok" => true]);
    exit;
}

$conn->close();