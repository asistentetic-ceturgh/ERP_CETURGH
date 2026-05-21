<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

if ($conn->connect_error) {
    die(json_encode(["error" => "Error de conexión"]));
}

$method = $_SERVER['REQUEST_METHOD'];

// ==========================================
// GET → LISTAR DEPARTAMENTOS (CON GASTOS)
// ==========================================
if ($method === 'GET') {

    $sql = "SELECT id, nombre, presupuesto 
            FROM departamentos 
            WHERE parent_id IS NULL";

    $result = $conn->query($sql);
    $departamentos = [];

    while ($row = $result->fetch_assoc()) {

        $id = (int)$row["id"];

        // ==========================
        // 🔥 GASTO EN ITEMS
        // ==========================
        $itemsSql = "
            SELECT COALESCE(SUM(i.total), 0) as total
            FROM items i
            JOIN requerimientos r ON r.id = i.requerimiento_id
            WHERE r.departamento_id = $id
            AND i.estado_pago = 'Pagado'
        ";

        $itemsRes = $conn->query($itemsSql);
        $gastado_items = (float)$itemsRes->fetch_assoc()["total"];

        // ==========================
        // 🔥 GASTO EN MOVILIDAD
        // ==========================
        $movSql = "
            SELECT COALESCE(SUM(monto_total), 0) as total
            FROM planilla_movilidad
            WHERE departamento_id = $id
            AND estado = 'Pagado'
        ";

        $movRes = $conn->query($movSql);
        $gastado_movilidad = (float)$movRes->fetch_assoc()["total"];

        // ==========================
        // 🔥 TOTAL
        // ==========================
        $gastado_total = $gastado_items + $gastado_movilidad;

        // ==========================================
        // 🔹 SUBDEPARTAMENTOS (CON GASTO REAL)
        // ==========================================
        $subSql = "
            SELECT id, nombre
            FROM departamentos
            WHERE parent_id = $id
        ";

        $subRes = $conn->query($subSql);
        $subdepartamentos = [];

        while ($s = $subRes->fetch_assoc()) {

            $subId = (int)$s["id"];

            // ITEMS
            $subItemsSql = "
                SELECT COALESCE(SUM(i.total), 0) as total
                FROM items i
                WHERE i.area_costo_id = $subId
                AND i.estado_pago = 'Pagado'
            ";

            $subItemsRes = $conn->query($subItemsSql);
            $sub_items = (float)$subItemsRes->fetch_assoc()["total"];

            // MOVILIDAD
            $subMovSql = "
                SELECT COALESCE(SUM(monto_total), 0) as total
                FROM planilla_movilidad
                WHERE departamento_id = $subId
                AND estado = 'Pagado'
            ";

            $subMovRes = $conn->query($subMovSql);
            $sub_mov = (float)$subMovRes->fetch_assoc()["total"];

            $subdepartamentos[] = [
                "id" => $subId,
                "nombre" => $s["nombre"],
                "gastado" => $sub_items + $sub_mov,
                "gastado_items" => $sub_items,
                "gastado_movilidad" => $sub_mov
            ];
        }

        // ==========================================
        // 🔹 HISTORIAL (ITEMS)
        // ==========================================
        $comprasSql = "
            SELECT 
                i.descripcion,
                i.total as monto,
                i.estado_pago as estado,
                r.fecha,
                sd.nombre as subdepartamento
            FROM items i
            JOIN requerimientos r ON r.id = i.requerimiento_id
            LEFT JOIN departamentos sd ON sd.id = i.area_costo_id
            WHERE r.departamento_id = $id
            AND i.estado_pago = 'Pagado'
            ORDER BY r.fecha DESC
        ";

        $comprasRes = $conn->query($comprasSql);
        $compras = [];

        while ($c = $comprasRes->fetch_assoc()) {
            $compras[] = [
                "descripcion" => $c["descripcion"],
                "monto" => (float)$c["monto"],
                "estado" => $c["estado"],
                "fecha" => $c["fecha"],
                "subdepartamento" => $c["subdepartamento"]
            ];
        }

        // ==========================================
        // RESPUESTA FINAL
        // ==========================================
        $departamentos[] = [
            "id" => $id,
            "nombre" => $row["nombre"],
            "presupuestoTotal" => (float)$row["presupuesto"],

            // 🔥 CLAVE
            "gastado" => $gastado_total,
            "gastado_items" => $gastado_items,
            "gastado_movilidad" => $gastado_movilidad,

            "saldo" => (float)$row["presupuesto"] - $gastado_total,

            "subdepartamentos" => $subdepartamentos,
            "compras" => $compras
        ];
    }

    echo json_encode($departamentos);
}


// ==========================================
// POST → CREAR
// ==========================================
if ($method === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["error" => "Datos inválidos"]);
        exit();
    }

    $nombre = $data["nombre"] ?? '';
    $presupuesto = $data["presupuesto"] ?? 0;
    $empresa_id = $data["empresa_id"] ?? 1;
    $sede_id = $data["sede_id"] ?? 1;
    $parent_id = $data["parent_id"] ?? null;

    $stmt = $conn->prepare("
        INSERT INTO departamentos (nombre, presupuesto, empresa_id, sede_id, parent_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->bind_param("sdiii", $nombre, $presupuesto, $empresa_id, $sede_id, $parent_id);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "insert_id" => $stmt->insert_id
        ]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }

    $stmt->close();
}


// ==========================================
// PUT → EDITAR
// ==========================================
if ($method === 'PUT') {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["id"])) {
        echo json_encode(["error" => "ID requerido"]);
        exit();
    }

    $id = (int)$data["id"];
    $nombre = $data["nombre"] ?? null;
    $presupuesto = $data["presupuesto"] ?? null;

    $fields = [];
    $params = [];
    $types = "";

    if ($nombre !== null) {
        $fields[] = "nombre = ?";
        $params[] = $nombre;
        $types .= "s";
    }

    if ($presupuesto !== null) {
        $fields[] = "presupuesto = ?";
        $params[] = (float)$presupuesto;
        $types .= "d";
    }

    if (empty($fields)) {
        echo json_encode(["error" => "Nada para actualizar"]);
        exit();
    }

    $params[] = $id;
    $types .= "i";

    $sql = "UPDATE departamentos SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }

    $stmt->close();
}


// ==========================================
// DELETE
// ==========================================
if ($method === 'DELETE') {

    $id = $_GET["id"] ?? null;

    if (!$id) {
        echo json_encode(["error" => "ID requerido"]);
        exit();
    }

    $id = (int)$id;

    $res = $conn->query("SELECT COUNT(*) as total FROM area_departamento WHERE departamento_id = $id");
    $row = $res->fetch_assoc();

    if ($row["total"] > 0) {
        echo json_encode([
            "error" => "No puedes eliminar este departamento porque está en uso"
        ]);
        exit();
    }

    $conn->query("DELETE FROM departamentos WHERE parent_id = $id");

    $stmt = $conn->prepare("DELETE FROM departamentos WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>