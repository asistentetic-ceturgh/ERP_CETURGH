<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// =========================
// PREFLIGHT
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

// =========================
// VALIDAR CONEXIÓN
// =========================
if ($conn->connect_error) {

    echo json_encode([
        "success" => false,
        "error" => "Error de conexión"
    ]);

    exit();
}

// =========================
// LEER JSON
// =========================
$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (
    !$data ||
    !isset($data['usuario']) ||
    !isset($data['password'])
) {

    echo json_encode([
        "success" => false,
        "error" => "Datos incompletos"
    ]);

    exit();
}

$usuario = trim($data['usuario']);
$password = $data['password'];

// =========================
// BUSCAR USUARIO
// =========================
$stmt = $conn->prepare("
    SELECT
        u.id,
        u.usuario,
        u.nombre,
        u.password,
        u.tipo,
        u.departamento_id,
        d.nombre AS departamento_principal
    FROM usuarios u
    LEFT JOIN departamentos d
        ON d.id = u.departamento_id
    WHERE u.usuario = ?
    LIMIT 1
");

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);

    exit();
}

$stmt->bind_param("s", $usuario);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "error" => "Usuario no encontrado"
    ]);

    exit();
}

$user = $result->fetch_assoc();

$stmt->close();

// =========================
// VALIDAR PASSWORD
// =========================
if (!password_verify($password, $user['password'])) {

    echo json_encode([
        "success" => false,
        "error" => "Contraseña incorrecta"
    ]);

    exit();
}

// =========================
// OBTENER TODOS LOS DEPARTAMENTOS
// =========================
$stmtDeptos = $conn->prepare("
    SELECT
        d.id,
        d.nombre
    FROM usuarios_departamentos ud
    INNER JOIN departamentos d
        ON d.id = ud.departamento_id
    WHERE ud.usuario_id = ?
    ORDER BY d.nombre ASC
");

$stmtDeptos->bind_param("i", $user['id']);
$stmtDeptos->execute();

$resultDeptos = $stmtDeptos->get_result();

$departamentos = [];

while ($row = $resultDeptos->fetch_assoc()) {

    $departamentos[] = [
        "id" => (int)$row['id'],
        "nombre" => $row['nombre']
    ];
}

$stmtDeptos->close();

// =========================
// SI NO TIENE RELACIONES
// USAR EL PRINCIPAL
// =========================
if (
    empty($departamentos) &&
    !empty($user['departamento_id'])
) {

    $departamentos[] = [
        "id" => (int)$user['departamento_id'],
        "nombre" => $user['departamento_principal']
    ];
}

// =========================
// DEPARTAMENTO ACTIVO
// =========================
$departamentoActivo = null;

foreach ($departamentos as $dep) {

    if ((int)$dep['id'] === (int)$user['departamento_id']) {

        $departamentoActivo = $dep;
        break;
    }
}

// fallback
if (!$departamentoActivo && count($departamentos) > 0) {
    $departamentoActivo = $departamentos[0];
}

// =========================
// RESPUESTA
// =========================
echo json_encode([
    "success" => true,

    "id" => (int)$user['id'],
    "usuario" => $user['usuario'],
    "nombre" => $user['nombre'],
    "tipo" => $user['tipo'],

    // departamento activo
    "departamento" => $departamentoActivo
        ? $departamentoActivo['nombre']
        : null,

    "departamento_id" => $departamentoActivo
        ? (int)$departamentoActivo['id']
        : null,

    // todos los departamentos
    "departamentos" => $departamentos
]);

$conn->close();
?>