<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {

    $input = json_decode(file_get_contents("php://input"), true);
    $action = $_GET['action'] ?? ($input['action'] ?? null);

    if (!$action) {
        throw new Exception("Acción no definida");
    }

    switch ($action) {

        // =========================================
        // ✅ LISTAR (JERÁRQUICO + GASTOS REALES)
        // =========================================
        case "listar":

    // 🔥 1. OBTENER CENTROS
    $sql = "SELECT * FROM centros_costos";
    $result = $conn->query($sql);

    $rows = [];

    while ($row = $result->fetch_assoc()) {
        $row['presupuesto'] = (float)$row['presupuesto'];
        $row['gastado'] = 0;
        $row['subAreas'] = [];
        $row['items'] = [];
        $rows[] = $row;
    }

    // 🔥 2. OBTENER GASTOS REALES DESDE ITEMS
    $gastos = [];

    $sqlGastos = "
        SELECT centro_costo_id, SUM(total) as total
        FROM items
        WHERE estado_pago = 'Pagado'
        AND centro_costo_id IS NOT NULL
        GROUP BY centro_costo_id
    ";

    $resGastos = $conn->query($sqlGastos);

    while ($g = $resGastos->fetch_assoc()) {
        $gastos[$g['centro_costo_id']] = (float)$g['total'];
    }

    // 🔥 3. ASIGNAR GASTOS
    foreach ($rows as &$row) {
        if (isset($gastos[$row['id']])) {
            $row['gastado'] = $gastos[$row['id']];
        }
    }

    // 🔥 4. MAP
    $map = [];
    foreach ($rows as $row) {
        $map[$row['id']] = $row;
    }

    // 🔥 5. TREE (JERÁRQUICO)
    $tree = [];

    foreach ($map as $id => &$node) {

        if ($node['parent_id'] == null) {
            $tree[] = &$node;
        } else {
            if (isset($map[$node['parent_id']])) {

                $parent = &$map[$node['parent_id']];

                if ($parent['parent_id'] == null) {
                    $parent['subAreas'][] = &$node;
                } else {
                    $parent['items'][] = &$node;
                }
            }
        }
    }

    echo json_encode(array_values($tree));
    break;

        // =========================================
        // CREAR CENTRO
        // =========================================
        case "crear_centro":

            $stmt = $conn->prepare("
                INSERT INTO centros_costos 
                (codigo, nombre, empresa_id, sede_id, presupuesto, parent_id)
                VALUES (?, ?, ?, ?, ?, NULL)
            ");

            $stmt->bind_param(
                "ssiid",
                $input['codigo'],
                $input['nombre'],
                $input['empresa_id'],
                $input['sede_id'],
                $input['presupuesto']
            );

            $stmt->execute();

            echo json_encode([
                "success" => true,
                "id" => $conn->insert_id
            ]);
            break;

        // =========================================
        // CREAR SUBCENTRO / ITEM
        // =========================================
        case "crear_subcentro":
        case "crear_item":

            $stmtParent = $conn->prepare("
                SELECT empresa_id, sede_id 
                FROM centros_costos 
                WHERE id = ?
            ");
            $stmtParent->bind_param("i", $input['parent_id']);
            $stmtParent->execute();

            $parent = $stmtParent->get_result()->fetch_assoc();

            if (!$parent) {
                throw new Exception("Parent no encontrado");
            }

            $stmt = $conn->prepare("
                INSERT INTO centros_costos 
                (codigo, nombre, empresa_id, sede_id, presupuesto, parent_id)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            $stmt->bind_param(
                "ssiidi",
                $input['codigo'],
                $input['nombre'],
                $parent['empresa_id'],
                $parent['sede_id'],
                $input['presupuesto'],
                $input['parent_id']
            );

            $stmt->execute();

            echo json_encode(["success" => true]);
            break;

        // =========================================
        // EDITAR
        // =========================================
        case "editar":

            $stmt = $conn->prepare("
                UPDATE centros_costos 
                SET codigo = ?, nombre = ?, presupuesto = ?
                WHERE id = ?
            ");

            $stmt->bind_param(
                "ssdi",
                $input['codigo'],
                $input['nombre'],
                $input['presupuesto'],
                $input['id']
            );

            $stmt->execute();

            echo json_encode(["success" => true]);
            break;

        // =========================================
        // ELIMINAR (RECURSIVO)
        // =========================================
        case "eliminar":

            $id = $input['id'];

            function getChildrenIds($conn, $parentId) {
                $stmt = $conn->prepare("SELECT id FROM centros_costos WHERE parent_id = ?");
                $stmt->bind_param("i", $parentId);
                $stmt->execute();

                $result = $stmt->get_result();

                $ids = [];

                while ($row = $result->fetch_assoc()) {
                    $ids[] = $row['id'];
                    $ids = array_merge($ids, getChildrenIds($conn, $row['id']));
                }

                return $ids;
            }

            $idsToDelete = getChildrenIds($conn, $id);
            $idsToDelete[] = $id;

            $placeholders = implode(',', array_fill(0, count($idsToDelete), '?'));
            $types = str_repeat("i", count($idsToDelete));

            $stmt = $conn->prepare("DELETE FROM centros_costos WHERE id IN ($placeholders)");
            $stmt->bind_param($types, ...$idsToDelete);
            $stmt->execute();

            echo json_encode([
                "success" => true,
                "eliminados" => $idsToDelete
            ]);
            break;

        default:
            throw new Exception("Acción no válida");
    }

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}