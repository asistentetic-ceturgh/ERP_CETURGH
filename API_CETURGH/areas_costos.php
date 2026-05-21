<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? ($input['action'] ?? '');

try {

    switch ($action) {

        // =========================
        // LISTAR ÁREAS DE COSTO
        // =========================
    case 'listar':

    $sql = "
        SELECT 
            ac.id,
            ac.nombre,
            ac.empresa_id,
            e.nombre AS empresa,
            ac.presupuesto
        FROM areas_costos ac
        INNER JOIN empresas e ON ac.empresa_id = e.id
        ORDER BY ac.nombre ASC
    ";

    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception($conn->error);
    }

    $data = [];

    while ($row = $result->fetch_assoc()) {

        $area_id = (int)$row['id'];
        $empresa_id = (int)$row['empresa_id'];

        // =========================
        // 🔥 EJECUTADO REAL (CORRECTO)
        // =========================
        $ejecutadoSql = "
            SELECT (

                COALESCE((
                    SELECT SUM(i.total)
                    FROM items i
                    INNER JOIN requerimientos r ON r.id = i.requerimiento_id
                    INNER JOIN area_departamento ad ON ad.departamento_id = r.departamento_id
                    WHERE ad.area_id = $area_id
                    AND r.empresa_id = $empresa_id
                    AND i.estado_pago = 'Pagado'
                ), 0)

                +

                COALESCE((
                    SELECT SUM(m.monto_total)
                    FROM planilla_movilidad m
                    INNER JOIN area_departamento ad ON ad.departamento_id = m.departamento_id
                    WHERE ad.area_id = $area_id
                    AND m.empresa_id = $empresa_id
                    AND m.estado = 'Pagado'
                ), 0)

            ) AS ejecutado
        ";

        $resEjecutado = $conn->query($ejecutadoSql);

        if (!$resEjecutado) {
            throw new Exception($conn->error);
        }

        $ejecutado = (float)$resEjecutado->fetch_assoc()['ejecutado'];

        // =========================
        // DEPARTAMENTOS ASOCIADOS
        // =========================
        $areas = [];

        $stmtAreas = $conn->prepare("
            SELECT d.id, d.nombre
            FROM area_departamento ad
            INNER JOIN departamentos d ON ad.departamento_id = d.id
            WHERE ad.area_id = ?
        ");

        $stmtAreas->bind_param("i", $area_id);
        $stmtAreas->execute();
        $resAreas = $stmtAreas->get_result();

        while ($a = $resAreas->fetch_assoc()) {
            $areas[] = $a;
        }

        // =========================
        // RESPUESTA
        // =========================
        $row['areas'] = $areas;
        $row['presupuesto'] = (float)$row['presupuesto'];
        $row['ejecutado'] = $ejecutado;

        $data[] = $row;
    }

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);
break;
        // =========================
        // LISTAR DEPARTAMENTOS
        // =========================
        case 'listar_departamentos':

            $sql = "SELECT id, nombre FROM departamentos ORDER BY nombre ASC";
            $result = $conn->query($sql);

            if (!$result) {
                throw new Exception($conn->error);
            }

            $data = [];

            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            echo json_encode([
                "success" => true,
                "data" => $data
            ]);
        break;

        // =========================
        // CREAR ÁREA DE COSTO
        // =========================
        case 'crear':

            if (!$input) throw new Exception("Datos inválidos");

            $nombre = trim($input['nombre'] ?? '');
            $empresa = trim($input['empresa'] ?? '');
            $presupuesto = floatval($input['presupuesto'] ?? 0);

            if (!$nombre || !$empresa) {
                throw new Exception("Campos obligatorios faltantes");
            }

            $stmtEmp = $conn->prepare("SELECT id FROM empresas WHERE nombre = ?");
            $stmtEmp->bind_param("s", $empresa);
            $stmtEmp->execute();
            $resEmp = $stmtEmp->get_result();

            if ($resEmp->num_rows === 0) {
                throw new Exception("Empresa no válida");
            }

            $empresa_id = $resEmp->fetch_assoc()['id'];

            $stmt = $conn->prepare("
                INSERT INTO areas_costos (nombre, empresa_id, presupuesto, ejecutado)
                VALUES (?, ?, ?, 0)
            ");

            $stmt->bind_param("sid", $nombre, $empresa_id, $presupuesto);

            if (!$stmt->execute()) {
                throw new Exception($stmt->error);
            }

            echo json_encode([
                "success" => true,
                "id" => $stmt->insert_id
            ]);
        break;

        // =========================
        // ASOCIAR ÁREA
        // =========================
        case 'asignar_area':

            if (!$input) throw new Exception("Datos inválidos");

            $area_costo_id = intval($input['area_costo_id'] ?? 0);
            $departamento_id = intval($input['area_id'] ?? 0);

            if (!$area_costo_id || !$departamento_id) {
                throw new Exception("Datos incompletos");
            }

            $stmtCheck = $conn->prepare("
                SELECT id FROM area_departamento 
                WHERE area_id = ? AND departamento_id = ?
            ");
            $stmtCheck->bind_param("ii", $area_costo_id, $departamento_id);
            $stmtCheck->execute();
            $resCheck = $stmtCheck->get_result();

            if ($resCheck->num_rows > 0) {
                echo json_encode(["success" => true]);
                exit;
            }

            $stmt = $conn->prepare("
                INSERT INTO area_departamento (area_id, departamento_id)
                VALUES (?, ?)
            ");
            $stmt->bind_param("ii", $area_costo_id, $departamento_id);

            if (!$stmt->execute()) {
                throw new Exception($stmt->error);
            }

            echo json_encode(["success" => true]);
        break;

        // =========================
// DESASOCIAR ÁREA
// =========================
case 'desasignar_area':

    if (!$input) throw new Exception("Datos inválidos");

    $area_costo_id = intval($input['area_costo_id'] ?? 0);
    $departamento_id = intval($input['area_id'] ?? 0);

    if (!$area_costo_id || !$departamento_id) {
        throw new Exception("Datos incompletos");
    }

    $stmt = $conn->prepare("
        DELETE FROM area_departamento 
        WHERE area_id = ? AND departamento_id = ?
    ");
    $stmt->bind_param("ii", $area_costo_id, $departamento_id);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode(["success" => true]);
break;

// =========================
// EDITAR ÁREA DE COSTO
// =========================
case 'editar':

    if (!$input) throw new Exception("Datos inválidos");

    $id = intval($input['id'] ?? 0);
    $nombre = trim($input['nombre'] ?? '');
    $presupuesto = floatval($input['presupuesto'] ?? 0);

    if (!$id || !$nombre) {
        throw new Exception("Datos incompletos");
    }

    $stmt = $conn->prepare("
        UPDATE areas_costos 
        SET nombre = ?, presupuesto = ?
        WHERE id = ?
    ");

    $stmt->bind_param("sdi", $nombre, $presupuesto, $id);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode(["success" => true]);
break;

        default:
            echo json_encode([
                "success" => false,
                "error" => "Acción no válida"
            ]);
        break;
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}