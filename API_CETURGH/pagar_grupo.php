<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$grupo_id = $data['grupo_id'] ?? null;

if (!$grupo_id) {
    echo json_encode([
        "success" => false,
        "message" => "grupo_id requerido"
    ]);
    exit();
}

try {

    // 🔥 INICIAR TRANSACCIÓN
    $conn->begin_transaction();

    // 1️⃣ OBTENER CONSUMO POR DEPARTAMENTO
    $sql = "
        SELECT 
            r.departamento_id,
            SUM(i.total) as total_consumido
        FROM items i
        JOIN requerimientos r ON r.id = i.requerimiento_id
        WHERE i.grupo_id = ?
        AND i.estado_pago = 'Pendiente'
        GROUP BY r.departamento_id
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $grupo_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception("No hay items pendientes en este grupo");
    }

    // 2️⃣ VALIDAR Y DESCONTAR PRESUPUESTO
    while ($row = $result->fetch_assoc()) {

        $departamento_id = $row['departamento_id'];
        $total = floatval($row['total_consumido']);

        // 🔍 Obtener presupuesto actual
        $pres = $conn->prepare("
            SELECT presupuesto 
            FROM departamentos 
            WHERE id = ?
            FOR UPDATE
        ");
        $pres->bind_param("i", $departamento_id);
        $pres->execute();
        $resPres = $pres->get_result()->fetch_assoc();

        if (!$resPres) {
            throw new Exception("Departamento no encontrado ID: $departamento_id");
        }

        $presupuesto_actual = floatval($resPres['presupuesto']);

        // 🚨 VALIDACIÓN
        if ($presupuesto_actual < $total) {
            throw new Exception("Presupuesto insuficiente en departamento ID $departamento_id");
        }

        // 💸 DESCONTAR
        $update = $conn->prepare("
            UPDATE departamentos
            SET presupuesto = presupuesto - ?
            WHERE id = ?
        ");
        $update->bind_param("di", $total, $departamento_id);
        $update->execute();
    }

    // 2.5️⃣ ACTUALIZAR GASTO POR CENTRO DE COSTO
$sqlCC = "
    SELECT 
        centro_costo_id,
        SUM(total) as total_gasto
    FROM items
    WHERE grupo_id = ?
    AND estado_pago = 'Pendiente'
    AND centro_costo_id IS NOT NULL
    GROUP BY centro_costo_id
";

$stmtCC = $conn->prepare($sqlCC);
$stmtCC->bind_param("i", $grupo_id);
$stmtCC->execute();
$resCC = $stmtCC->get_result();

while ($row = $resCC->fetch_assoc()) {

    $cc_id = intval($row['centro_costo_id']);
    $total = floatval($row['total_gasto']);

    // 🔒 Bloquear fila
    $lock = $conn->prepare("
        SELECT gastado FROM centros_costos 
        WHERE id = ?
        FOR UPDATE
    ");
    $lock->bind_param("i", $cc_id);
    $lock->execute();
    $lock->get_result();

    // ➕ SUMAR gasto
    $updateCC = $conn->prepare("
        UPDATE centros_costos
        SET gastado = gastado + ?
        WHERE id = ?
    ");
    $updateCC->bind_param("di", $total, $cc_id);
    $updateCC->execute();
}

    // 3️⃣ MARCAR ITEMS COMO PAGADOS
$updateItems = $conn->prepare("
    UPDATE items 
    SET 
        estado_pago = 'Pagado',
        estado_tesoreria = 'PAGADO',
        flujo_estado = 'FINALIZADO'
    WHERE grupo_id = ?
    AND estado_pago = 'Pendiente'
");
    $updateItems->bind_param("i", $grupo_id);
    $updateItems->execute();

    $filas = $updateItems->affected_rows;

    // ✅ CONFIRMAR TODO
    $conn->commit();

    echo json_encode([
        "success" => true,
        "actualizados" => $filas
    ]);

} catch (Exception $e) {

    // ❌ ROLLBACK SI ALGO FALLA
    $conn->rollback();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}