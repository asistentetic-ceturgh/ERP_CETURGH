<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $sql = "
        SELECT 
            c.*,
            e.nombre as empresa_nombre,
            e.ruc,
            s.nombre as sede_nombre,
            cc.nombre as centro_costo_nombre,
            cc.codigo as centro_costo_codigo
        FROM cajas_chicas c
        LEFT JOIN empresas e ON c.empresa_id = e.id
        LEFT JOIN sedes s ON c.sede_id = s.id
        LEFT JOIN centros_costos cc ON c.centro_costo_id = cc.id
        ORDER BY c.created_at DESC
    ";
    $result = $conn->query($sql);
    $cajas = [];
    while ($row = $result->fetch_assoc()) {
        $cajas[] = $row;
    }
    echo json_encode(["ok" => true, "data" => $cajas]);
    exit();
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $empresa_id = intval($input['empresa_id']);
    $sede_id = intval($input['sede_id']);
    $centro_costo_id = intval($input['centro_costo_id']);
    $codigo = trim($input['codigo']);
    $monto_base = floatval($input['monto_base']);
    $saldo_actual = $monto_base;
    $estado = 'ACTIVA';
    
    if (empty($codigo) || $monto_base <= 0) {
        echo json_encode(["ok" => false, "error" => "Código y monto base son obligatorios"]);
        exit();
    }
    
    // ✅ Eliminamos la validación de unicidad del código
    $stmt = $conn->prepare("
        INSERT INTO cajas_chicas 
        (empresa_id, sede_id, centro_costo_id, codigo, monto_base, saldo_actual, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("iiisdds", $empresa_id, $sede_id, $centro_costo_id, $codigo, $monto_base, $saldo_actual, $estado);
    
    if ($stmt->execute()) {
        $caja_id = $stmt->insert_id;
        $movimiento = $conn->prepare("
            INSERT INTO movimientos_caja (caja_id, tipo, ingreso, saldo_resultante, descripcion)
            VALUES (?, 'APERTURA', ?, ?, 'Apertura de caja chica')
        ");
        $movimiento->bind_param("idd", $caja_id, $monto_base, $saldo_actual);
        $movimiento->execute();
        echo json_encode(["ok" => true, "id" => $caja_id, "message" => "Caja creada correctamente"]);
    } else {
        echo json_encode(["ok" => false, "error" => "Error al crear: " . $stmt->error]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["ok" => false, "error" => "Método no permitido"]);
?>