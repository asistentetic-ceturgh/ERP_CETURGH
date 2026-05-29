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

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $tipo = $input['tipo'] ?? '';
    $anio = intval($input['anio'] ?? date('Y'));
    
    if (!$tipo) {
        echo json_encode(["ok" => false, "error" => "Tipo requerido"]);
        exit();
    }
    
    // Obtener y actualizar número correlativo
    $conn->begin_transaction();
    try {
        // Verificar si existe registro para el año
        $check = $conn->prepare("SELECT numero_actual FROM correlativos WHERE tipo = ? AND anio = ? FOR UPDATE");
        $check->bind_param("si", $tipo, $anio);
        $check->execute();
        $res = $check->get_result();
        
        if ($res->num_rows == 0) {
            // Crear nuevo registro para el año
            $insert = $conn->prepare("INSERT INTO correlativos (tipo, anio, numero_actual) VALUES (?, ?, 1)");
            $insert->bind_param("si", $tipo, $anio);
            $insert->execute();
            $numero = 1;
        } else {
            $row = $res->fetch_assoc();
            $numero = $row['numero_actual'] + 1;
            $update = $conn->prepare("UPDATE correlativos SET numero_actual = ? WHERE tipo = ? AND anio = ?");
            $update->bind_param("isi", $numero, $tipo, $anio);
            $update->execute();
        }
        
        $conn->commit();
        $numero_formateado = str_pad($numero, 5, "0", STR_PAD_LEFT);
        $correlativo = "{$tipo}-{$anio}-{$numero_formateado}";
        
        echo json_encode(["ok" => true, "correlativo" => $correlativo, "numero" => $numero]);
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["ok" => false, "error" => $e->getMessage()]);
    }
    exit();
}

http_response_code(405);
echo json_encode(["ok" => false, "error" => "Método no permitido"]);
?>