<?php 
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];

function clean($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validar($data) {
    if (!preg_match('/^\d{11}$/', $data['ruc'])) return "RUC inválido";
    if (!$data['nombre']) return "Nombre requerido";

    if ($data['telefono'] && !preg_match('/^\d{9}$/', $data['telefono']))
        return "Teléfono inválido";

    if ($data['email'] && !filter_var($data['email'], FILTER_VALIDATE_EMAIL))
        return "Email inválido";

    return null;
}

try {

    // ========================= GET =========================
    if ($method === "GET") {

        $result = $conn->query("SELECT * FROM proveedores ORDER BY id DESC");

        if (!$result) {
            echo json_encode([
                "success" => false,
                "message" => $conn->error
            ]);
            exit;
        }

        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode(["success" => true, "data" => $data]);
        exit;
    }

    // ========================= DELETE =========================
    if ($method === "DELETE") {

        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM proveedores WHERE id=?");

        if (!$stmt) {
            echo json_encode(["success" => false, "message" => $conn->error]);
            exit;
        }

        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => $stmt->error
            ]);
        }
        exit;
    }

    // ========================= BODY =========================
    if ($method === "POST" || $method === "PUT") {

        $inputRaw = file_get_contents("php://input");
        $input = json_decode($inputRaw, true);

        if (!$input) {
            echo json_encode([
                "success" => false,
                "message" => "JSON inválido o vacío",
                "raw" => $inputRaw // 🔥 útil para debug
            ]);
            exit;
        }

        $data = [
            "nombre" => clean($input['nombre'] ?? ''),
            "ruc" => clean($input['ruc'] ?? ''),
            "direccion" => clean($input['direccion'] ?? ''),
            "telefono" => clean($input['telefono'] ?? ''),
            "email" => clean($input['email'] ?? ''),
            "medio_pago" => clean($input['medio_pago'] ?? ''),
            "detalle_pago" => clean($input['detalle_pago'] ?? ''),
            "especialidad" => clean($input['especialidad'] ?? ''),
            "sede" => clean($input['sede'] ?? ''),
            "credito" => clean($input['credito'] ?? ''),
            "vigencia" => !empty($input['vigencia']) ? $input['vigencia'] : null
        ];

        $error = validar($data);
        if ($error) {
            echo json_encode(["success" => false, "message" => $error]);
            exit;
        }
    }

    // ========================= POST =========================
    if ($method === "POST") {

        $stmt = $conn->prepare("INSERT INTO proveedores 
        (nombre, ruc, direccion, telefono, email, medio_pago, detalle_pago, especialidad, sede, credito, vigencia)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        if (!$stmt) {
            echo json_encode(["success" => false, "message" => $conn->error]);
            exit;
        }

        $stmt->bind_param("sssssssssss",
            $data['nombre'],
            $data['ruc'],
            $data['direccion'],
            $data['telefono'],
            $data['email'],
            $data['medio_pago'],
            $data['detalle_pago'],
            $data['especialidad'],
            $data['sede'],
            $data['credito'],
            $data['vigencia']
        );

        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "id" => $stmt->insert_id
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => $stmt->error
            ]);
        }
        exit;
    }

    // ========================= PUT =========================
    if ($method === "PUT") {

        $id = intval($_GET['id'] ?? 0);

        if (!$id) {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
            exit;
        }

        $stmt = $conn->prepare("UPDATE proveedores SET 
            nombre=?, 
            ruc=?, 
            direccion=?, 
            telefono=?, 
            email=?, 
            medio_pago=?, 
            detalle_pago=?, 
            especialidad=?, 
            sede=?, 
            credito=?, 
            vigencia=?
            WHERE id=?");

        if (!$stmt) {
            echo json_encode(["success" => false, "message" => $conn->error]);
            exit;
        }

        $stmt->bind_param("sssssssssssi",
            $data['nombre'],
            $data['ruc'],
            $data['direccion'],
            $data['telefono'],
            $data['email'],
            $data['medio_pago'],
            $data['detalle_pago'],
            $data['especialidad'],
            $data['sede'],
            $data['credito'],
            $data['vigencia'],
            $id
        );

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => $stmt->error
            ]);
        }
        exit;
    }

    // ========================= MÉTODO NO SOPORTADO =========================
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}