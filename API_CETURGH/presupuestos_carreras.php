<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function errorResponse($conn, $msg = "Error") {

    echo json_encode([
        "success" => false,
        "message" => $msg,
        "mysql" => $conn->error
    ]);

    exit();
}

//
// GET
//
if ($method === 'GET') {

    $sql = "
        SELECT
            c.id,
            c.nombre,

            c.empresa_id,
            c.sede_id,

            e.nombre AS empresa,
            s.nombre AS sede,

            COALESCE(pc.presupuesto, 0) AS presupuesto,

            COALESCE(
                SUM(
                    CASE
                        WHEN i.estado_pago = 'Pagado'
                        THEN i.total
                        ELSE 0
                    END
                ),
            0) AS ejecutado,

            COALESCE(pc.estado, 'ACTIVO') AS estado

        FROM carreras c

        LEFT JOIN empresas e
            ON c.empresa_id = e.id

        LEFT JOIN sedes s
            ON c.sede_id = s.id

        LEFT JOIN presupuestos_carreras pc
            ON pc.carrera_id = c.id

        LEFT JOIN items i
            ON i.carrera_id = c.id

        GROUP BY
            c.id,
            c.nombre,
            c.empresa_id,
            c.sede_id,
            e.nombre,
            s.nombre,
            pc.presupuesto,
            pc.estado

        ORDER BY c.nombre ASC
    ";

    $res = $conn->query($sql);

    if (!$res) {
        errorResponse($conn, "Error obteniendo presupuestos");
    }

    $data = [];

    while ($row = $res->fetch_assoc()) {

        $row['presupuesto'] = (float)$row['presupuesto'];
        $row['ejecutado'] = (float)$row['ejecutado'];

        $data[] = $row;
    }

    echo json_encode($data);
    exit();
}

//
// POST
//
if ($method === 'POST') {

    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        errorResponse($conn, "JSON inválido");
    }

    $carrera_id = (int)($input['carrera_id'] ?? 0);

    $empresa_id = (int)($input['empresa_id'] ?? 0);

    $sede_id = (int)($input['sede_id'] ?? 0);

    $presupuesto = (float)($input['presupuesto'] ?? 0);

    $estado = $conn->real_escape_string(
        $input['estado'] ?? 'ACTIVO'
    );

    //
    // VALIDACIONES
    //
    if ($carrera_id <= 0) {
        errorResponse($conn, "Carrera inválida");
    }

    if ($empresa_id <= 0) {
        errorResponse($conn, "Seleccione empresa");
    }

    if ($sede_id <= 0) {
        errorResponse($conn, "Seleccione sede");
    }

    //
    // ACTUALIZAR EMPRESA Y SEDE EN CARRERAS
    //
    $sqlCarrera = "
        UPDATE carreras
        SET
            empresa_id = $empresa_id,
            sede_id = $sede_id
        WHERE id = $carrera_id
    ";

    if (!$conn->query($sqlCarrera)) {
        errorResponse($conn, "Error actualizando carrera");
    }

    //
    // VERIFICAR SI EXISTE
    //
    $check = $conn->query("
        SELECT id
        FROM presupuestos_carreras
        WHERE carrera_id = $carrera_id
    ");

    if (!$check) {
        errorResponse($conn, "Error verificando presupuesto");
    }

    //
    // UPDATE
    //
    if ($check->num_rows > 0) {

        $sql = "
            UPDATE presupuestos_carreras
            SET
                empresa_id = $empresa_id,
                sede_id = $sede_id,
                presupuesto = $presupuesto,
                estado = '$estado'
            WHERE carrera_id = $carrera_id
        ";

    } else {

        //
        // INSERT
        //
        $sql = "
            INSERT INTO presupuestos_carreras
            (
                carrera_id,
                empresa_id,
                sede_id,
                presupuesto,
                estado
            )
            VALUES
            (
                $carrera_id,
                $empresa_id,
                $sede_id,
                $presupuesto,
                '$estado'
            )
        ";
    }

    if (!$conn->query($sql)) {
        errorResponse($conn, "Error guardando presupuesto");
    }

    echo json_encode([
        "success" => true
    ]);

    exit();
}
?>