<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

/* =========================================
   PRE-FLIGHT
========================================= */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

    http_response_code(200);

    exit();
}

/* =========================================
   VALIDAR MÉTODO
========================================= */

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {

    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);

    exit;
}

/* =========================================
   OBTENER ID
========================================= */

$id = intval($_GET["id"] ?? 0);

if ($id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "ID inválido"
    ]);

    exit;
}

/* =========================================
   VALIDAR EXISTENCIA
========================================= */

$check = $conn->prepare("
    SELECT id, codigo
    FROM solicitudes_fondo
    WHERE id = ?
");

$check->bind_param("i", $id);

$check->execute();

$result = $check->get_result();

if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "La solicitud no existe"
    ]);

    exit;
}

$row = $result->fetch_assoc();

/* =========================================
   ELIMINAR
========================================= */

$sql = "
DELETE FROM solicitudes_fondo
WHERE id = ?
";

$stmt = $conn->prepare($sql);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$stmt->bind_param("i", $id);

/* =========================================
   EJECUTAR
========================================= */

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Solicitud eliminada correctamente",
        "id" => $id,
        "codigo" => $row["codigo"]
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

/* =========================================
   CERRAR
========================================= */

$stmt->close();

$conn->close();