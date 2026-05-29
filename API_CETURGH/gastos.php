<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

function recalcularRendicion($solicitud_id, $conn) {
    $stmt = $conn->prepare("SELECT SUM(monto) as total FROM solicitud_gastos WHERE solicitud_id = ?");
    $stmt->bind_param("i", $solicitud_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $total_rendido = floatval($row["total"] ?? 0);
    
    $stmt2 = $conn->prepare("SELECT monto_solicitado FROM solicitudes_fondo WHERE id = ?");
    $stmt2->bind_param("i", $solicitud_id);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    $sol = $res2->fetch_assoc();
    if (!$sol) return;
    $monto_solicitado = floatval($sol["monto_solicitado"]);
    $diferencia = $monto_solicitado - $total_rendido;
    
    $update = $conn->prepare("UPDATE solicitudes_fondo SET monto_rendido = ?, diferencia = ? WHERE id = ?");
    $update->bind_param("ddi", $total_rendido, $diferencia, $solicitud_id);
    $update->execute();
}

// GET: listar gastos
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $solicitud_id = intval($_GET["solicitud_id"] ?? 0);
    if ($solicitud_id <= 0) {
        echo json_encode(["success" => false, "message" => "ID inválido"]);
        exit;
    }
    $stmt = $conn->prepare("SELECT * FROM solicitud_gastos WHERE solicitud_id = ? ORDER BY fecha ASC");
    $stmt->bind_param("i", $solicitud_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $gastos = [];
    while ($row = $result->fetch_assoc()) {
        $gastos[] = $row;
    }
    echo json_encode(["success" => true, "gastos" => $gastos]);
    exit;
}

// POST: crear gasto (con o sin archivo)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $solicitud_id = intval($_POST["solicitud_id"] ?? 0);
    $fecha = trim($_POST["fecha"] ?? "");
    $tipo_proveedor = trim($_POST["tipo_proveedor"] ?? "EMPRESA");
    $proveedor = trim($_POST["proveedor"] ?? "");
    $documento_proveedor = trim($_POST["documento_proveedor"] ?? "");
    $tipo_comprobante = trim($_POST["tipo_comprobante"] ?? "");
    $numero_comprobante = trim($_POST["numero_comprobante"] ?? "");
    $descripcion = trim($_POST["descripcion"] ?? "");
    $monto = floatval($_POST["monto"] ?? 0);
    
    if ($solicitud_id <= 0 || empty($fecha) || empty($proveedor) || empty($descripcion) || $monto <= 0) {
        echo json_encode(["success" => false, "message" => "Faltan campos obligatorios"]);
        exit;
    }
    
    // Validar documento según tipo de proveedor
    if ($tipo_proveedor !== "OTROS" && empty($documento_proveedor)) {
        echo json_encode(["success" => false, "message" => "Debe ingresar el " . ($tipo_proveedor === "EMPRESA" ? "RUC" : "DNI") . " del proveedor"]);
        exit;
    }
    
    $stmt = $conn->prepare("INSERT INTO solicitud_gastos (solicitud_id, fecha, tipo_proveedor, proveedor, documento_proveedor, tipo_comprobante, numero_comprobante, descripcion, monto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isssssssd", $solicitud_id, $fecha, $tipo_proveedor, $proveedor, $documento_proveedor, $tipo_comprobante, $numero_comprobante, $descripcion, $monto);
    
    if ($stmt->execute()) {
        $gasto_id = $stmt->insert_id;
        
        // Procesar archivo si existe
        if (isset($_FILES["archivo"]) && $_FILES["archivo"]["error"] === UPLOAD_ERR_OK) {
            $file = $_FILES["archivo"];
            $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
            $permitidos = ["pdf", "jpg", "jpeg", "png"];
            if (in_array($ext, $permitidos)) {
                $dir = "uploads/gastos/";
                if (!file_exists($dir)) mkdir($dir, 0777, true);
                $nombre = uniqid() . "_" . time() . "." . $ext;
                $ruta = $dir . $nombre;
                if (move_uploaded_file($file["tmp_name"], $ruta)) {
                    $usuario_id = intval($_POST["usuario_id"] ?? 0);
                    $stmtArch = $conn->prepare("INSERT INTO solicitud_archivos (solicitud_id, gasto_id, tipo, nombre_original, nombre_guardado, ruta, subido_por) VALUES (?, ?, 'RENDICION', ?, ?, ?, ?)");
                    $stmtArch->bind_param("iisssi", $solicitud_id, $gasto_id, $file["name"], $nombre, $ruta, $usuario_id);
                    $stmtArch->execute();
                }
            }
        }
        
        recalcularRendicion($solicitud_id, $conn);
        echo json_encode(["success" => true, "id" => $gasto_id]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

// PUT: actualizar gasto
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        echo json_encode(["success" => false, "message" => "Datos inválidos"]);
        exit;
    }
    $id = intval($input["id"] ?? 0);
    $fecha = trim($input["fecha"] ?? "");
    $tipo_proveedor = trim($input["tipo_proveedor"] ?? "EMPRESA");
    $proveedor = trim($input["proveedor"] ?? "");
    $documento_proveedor = trim($input["documento_proveedor"] ?? "");
    $tipo_comprobante = trim($input["tipo_comprobante"] ?? "");
    $numero_comprobante = trim($input["numero_comprobante"] ?? "");
    $descripcion = trim($input["descripcion"] ?? "");
    $monto = floatval($input["monto"] ?? 0);
    
    if ($id <= 0 || empty($fecha) || empty($proveedor) || empty($descripcion) || $monto <= 0) {
        echo json_encode(["success" => false, "message" => "Datos inválidos"]);
        exit;
    }
    
    // Validar documento según tipo de proveedor
    if ($tipo_proveedor !== "OTROS" && empty($documento_proveedor)) {
        echo json_encode(["success" => false, "message" => "Debe ingresar el " . ($tipo_proveedor === "EMPRESA" ? "RUC" : "DNI") . " del proveedor"]);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT solicitud_id FROM solicitud_gastos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $solicitud_id = $row ? $row["solicitud_id"] : 0;
    
    $stmt = $conn->prepare("UPDATE solicitud_gastos SET fecha=?, tipo_proveedor=?, proveedor=?, documento_proveedor=?, tipo_comprobante=?, numero_comprobante=?, descripcion=?, monto=? WHERE id=?");
    $stmt->bind_param("sssssssdi", $fecha, $tipo_proveedor, $proveedor, $documento_proveedor, $tipo_comprobante, $numero_comprobante, $descripcion, $monto, $id);
    
    if ($stmt->execute()) {
        if ($solicitud_id) recalcularRendicion($solicitud_id, $conn);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

// DELETE: eliminar gasto
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $id = intval($_GET["id"] ?? 0);
    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "ID inválido"]);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT solicitud_id FROM solicitud_gastos WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $solicitud_id = $row ? $row["solicitud_id"] : 0;
    
    $stmt = $conn->prepare("DELETE FROM solicitud_gastos WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        if ($solicitud_id) recalcularRendicion($solicitud_id, $conn);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => $stmt->error]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Método no permitido"]);
$conn->close();
?>