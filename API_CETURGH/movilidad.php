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

// =====================================================
// FUNCIÓN AUXILIAR: Obtiene el departamento raíz (padre final)
// =====================================================
function getRootDepartment($conn, $dept_id) {
    $current = $dept_id;
    while (true) {
        $sql = "SELECT parent_id FROM departamentos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $current);
        $stmt->execute();
        $res = $stmt->get_result();
        $row = $res->fetch_assoc();
        if (!$row || $row['parent_id'] === null) {
            return $current;
        }
        $current = $row['parent_id'];
    }
}

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

        // ===== DETALLES CON ORIGEN Y DESTINO =====
        $det = [];
        $resDet = $conn->query("
            SELECT fecha, monto, origen, destino 
            FROM planilla_movilidad_detalle 
            WHERE planilla_id = " . intval($r['id'])
        );

        if ($resDet) {
            while ($d = $resDet->fetch_assoc()) {
                $det[] = [
                    'fecha' => $d['fecha'],
                    'monto' => $d['monto'],
                    'origen' => $d['origen'] ?? '',
                    'destino' => $d['destino'] ?? ''
                ];
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

// =====================================================
// POST FORM-DATA (PAGAR + COMPROBANTE + DESCONTAR PRESUPUESTO)
// =====================================================
if ($method === 'POST' && isset($_FILES['comprobante'])) {

    try {
        $id = intval($_POST['id'] ?? 0);
        $pagado_por = intval($_POST['pagado_por'] ?? 0);

        if (!$id) throw new Exception("ID inválido");

        // Obtener datos de la movilidad
        $queryMov = $conn->prepare("
            SELECT departamento_id, monto_total 
            FROM planilla_movilidad 
            WHERE id = ?
        ");
        $queryMov->bind_param("i", $id);
        $queryMov->execute();
        $movData = $queryMov->get_result()->fetch_assoc();

        if (!$movData) throw new Exception("Movilidad no encontrada");

        $departamento_id = $movData['departamento_id'];
        $monto_total = floatval($movData['monto_total']);

        // Obtener el departamento raíz
        $rootDept = getRootDepartment($conn, $departamento_id);

        // Subir comprobante
        $file = $_FILES['comprobante'];
        if ($file['error'] !== 0) throw new Exception("Error subiendo archivo");

        $permitidos = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!in_array($file['type'], $permitidos)) throw new Exception("Formato no permitido");

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $nombre = 'movilidad_' . time() . '_' . rand(1000,9999) . '.' . $ext;
        $carpeta = 'uploads/comprobantes_movilidad/';
        if (!file_exists($carpeta)) mkdir($carpeta, 0777, true);
        $ruta = $carpeta . $nombre;

        if (!move_uploaded_file($file['tmp_name'], $ruta)) throw new Exception("No se pudo guardar archivo");

        $tipo = $file['type'] === 'application/pdf' ? 'pdf' : 'imagen';

        // INICIAR TRANSACCIÓN
        $conn->begin_transaction();

        // 1. Actualizar estado de movilidad a Pagado
        $stmt = $conn->prepare("
            UPDATE planilla_movilidad
            SET estado='Pagado', comprobante_pago=?, comprobante_tipo=?, pagado_por=?, fecha_pago=NOW()
            WHERE id=?
        ");
        $stmt->bind_param("ssii", $ruta, $tipo, $pagado_por, $id);
        if (!$stmt->execute()) throw new Exception("Error al actualizar movilidad: " . $stmt->error);

        // 2. Descontar del presupuesto
        $updateBudget = $conn->prepare("
            UPDATE departamentos 
            SET presupuesto = presupuesto - ? 
            WHERE id = ? AND presupuesto >= ?
        ");
        $updateBudget->bind_param("did", $monto_total, $rootDept, $monto_total);
        $updateBudget->execute();

        if ($updateBudget->affected_rows === 0) {
            $checkBudget = $conn->prepare("SELECT presupuesto FROM departamentos WHERE id = ?");
            $checkBudget->bind_param("i", $rootDept);
            $checkBudget->execute();
            $budgetResult = $checkBudget->get_result()->fetch_assoc();

            if ($budgetResult) {
                throw new Exception("Presupuesto insuficiente en el departamento principal. Disponible: S/ " . number_format($budgetResult['presupuesto'], 2) . ", Necesario: S/ " . number_format($monto_total, 2));
            } else {
                throw new Exception("Departamento principal no encontrado");
            }
        }

        // 3. Registrar en tabla de movimientos
        $conn->query("
            INSERT INTO movimientos (tipo, referencia_id, monto, departamento_id, fecha)
            VALUES ('movilidad', $id, $monto_total, $rootDept, NOW())
        ");

        $conn->commit();

        echo json_encode([
            "ok" => true,
            "archivo" => $ruta,
            "presupuesto_descontado" => $monto_total,
            "departamento_id" => $rootDept
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["ok" => false, "msg" => $e->getMessage()]);
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

        // Calcular total
        $total = 0;
        foreach ($data['detalles'] as $d) {
            $total += floatval($d['monto'] ?? 0);
        }

        // Insertar cabecera
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

        // Insertar detalles con origen y destino
        $stmtDet = $conn->prepare("
            INSERT INTO planilla_movilidad_detalle 
            (planilla_id, fecha, monto, origen, destino)
            VALUES (?, ?, ?, ?, ?)
        ");

        if (!$stmtDet) throw new Exception($conn->error);

        foreach ($data['detalles'] as $d) {
            $fecha = $d['fecha'] ?? null;
            $monto = floatval($d['monto'] ?? 0);
            $origen = $d['origen'] ?? '';
            $destino = $d['destino'] ?? '';
            
            $stmtDet->bind_param("isdss", $planilla_id, $fecha, $monto, $origen, $destino);
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

            // Borrar detalles existentes
            $conn->query("DELETE FROM planilla_movilidad_detalle WHERE planilla_id=$id");

            // Reinsertar detalles con origen y destino
            $stmtDet = $conn->prepare("
                INSERT INTO planilla_movilidad_detalle 
                (planilla_id, fecha, monto, origen, destino)
                VALUES (?, ?, ?, ?, ?)
            ");

            if (!$stmtDet) throw new Exception($conn->error);

            foreach ($data['detalles'] as $d) {
                $fecha = $d['fecha'] ?? null;
                $monto = floatval($d['monto'] ?? 0);
                $origen = $d['origen'] ?? '';
                $destino = $d['destino'] ?? '';
                
                $stmtDet->bind_param("isdss", $id, $fecha, $monto, $origen, $destino);
                if (!$stmtDet->execute()) throw new Exception($stmtDet->error);
            }

            $conn->commit();
            echo json_encode(["ok" => true]);

        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode([
                "ok" => false,
                "error" => $e->getMessage()
            ]);
        }
        exit;
    }

    /* =====================
       FIRMAR
    ===================== */
    if ($action === "firmar") {
        $firmado_por = intval($data['firmado_por'] ?? 0);

        $stmt = $conn->prepare("
            UPDATE planilla_movilidad 
            SET estado='Pendiente', firmado_por=?, fecha_firma=NOW()
            WHERE id=?
        ");

        $stmt->bind_param("ii", $firmado_por, $id);
        
        if ($stmt->execute()) {
            echo json_encode(["ok" => true]);
        } else {
            echo json_encode(["ok" => false, "error" => $stmt->error]);
        }
        exit;
    }

    /* =====================
       APROBAR
    ===================== */
    if ($action === "aprobar") {
        $aprobado_por = intval($data['aprobado_por'] ?? 0);

        $stmt = $conn->prepare("
            UPDATE planilla_movilidad 
            SET estado='Aprobado', aprobado_por=?, fecha_aprobacion=NOW()
            WHERE id=?
        ");

        $stmt->bind_param("ii", $aprobado_por, $id);
        
        if ($stmt->execute()) {
            echo json_encode(["ok" => true]);
        } else {
            echo json_encode(["ok" => false, "error" => $stmt->error]);
        }
        exit;
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
        
        if ($stmt->execute()) {
            echo json_encode(["ok" => true]);
        } else {
            echo json_encode(["ok" => false, "error" => $stmt->error]);
        }
        exit;
    }

    echo json_encode(["ok" => false, "error" => "Acción no válida"]);
    exit;
}

$conn->close();
?>