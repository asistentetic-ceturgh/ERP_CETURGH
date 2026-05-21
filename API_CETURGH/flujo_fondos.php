<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/* =========================================
   INPUT
========================================= */

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {

    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);

    exit;
}

$accion = strtoupper(trim($data["accion"] ?? ""));
$solicitud_id = intval($data["solicitud_id"] ?? 0);
$usuario_id = intval($data["usuario_id"] ?? 0);
$observacion = trim($data["observacion"] ?? "");

/* =========================================
   VALIDAR INPUT
========================================= */

if ($solicitud_id <= 0 || $usuario_id <= 0) {

    echo json_encode([
        "success" => false,
        "message" => "Datos inválidos"
    ]);

    exit;
}

/* =========================================
   USUARIO
========================================= */

$sqlUsuario = "
SELECT
    u.id,
    u.nombre,
    u.tipo
FROM usuarios u
WHERE u.id = ?
LIMIT 1
";

$stmt = $conn->prepare($sqlUsuario);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$stmt->bind_param("i", $usuario_id);
$stmt->execute();

$res = $stmt->get_result();

if ($res->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Usuario no existe"
    ]);

    exit;
}

$usuario = $res->fetch_assoc();

$tipo_usuario = strtolower(
    trim($usuario["tipo"] ?? "")
);

/* =========================================
   DEPARTAMENTOS
========================================= */

$sqlDeps = "
SELECT d.nombre
FROM usuarios_departamentos ud
INNER JOIN departamentos d
    ON d.id = ud.departamento_id
WHERE ud.usuario_id = ?
";

$stmt = $conn->prepare($sqlDeps);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$stmt->bind_param("i", $usuario_id);
$stmt->execute();

$res = $stmt->get_result();

$departamentos = [];

while ($row = $res->fetch_assoc()) {

    $departamentos[] = strtoupper(
        trim($row["nombre"])
    );
}

/* =========================================
   FLAGS
========================================= */

$esTIC = in_array("TIC", $departamentos);

$esTesoreria =
    in_array("TESORERIA", $departamentos)
    ||
    in_array("TESORERÍA", $departamentos);

$esAdmin =
    in_array("ADMINISTRACION", $departamentos)
    ||
    in_array("ADMINISTRACIÓN", $departamentos)
    ||
    in_array("ADMIN", $departamentos);

$esJefe = ($tipo_usuario === "jefe");

/* =========================================
   SOLICITUD
========================================= */

$sqlSolicitud = "
SELECT *
FROM solicitudes_fondo
WHERE id = ?
LIMIT 1
";

$stmt = $conn->prepare($sqlSolicitud);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);

    exit;
}

$stmt->bind_param("i", $solicitud_id);
$stmt->execute();

$res = $stmt->get_result();

if ($res->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "Solicitud no existe"
    ]);

    exit;
}

$solicitud = $res->fetch_assoc();

$estado_actual = strtoupper(
    trim($solicitud["estado"] ?? "")
);

$tipoSolicitud = strtoupper(
    trim($solicitud["tipo"] ?? "")
);

$esSolicitante =
    intval($solicitud["solicitante_id"])
    ===
    $usuario_id;

/* =========================================
   FLUJO
========================================= */

switch ($accion) {

    /* =====================================
       FIRMAR
    ===================================== */

    case "FIRMAR":

        if (!($esTIC || ($esJefe && $esSolicitante))) {

            echo json_encode([
                "success" => false,
                "message" => "No autorizado para firmar"
            ]);

            exit;
        }

        if ($estado_actual !== "SIN_FIRMAR") {

            echo json_encode([
                "success" => false,
                "message" => "La solicitud ya fue firmada"
            ]);

            exit;
        }

        $nuevoEstado = "PENDIENTE";

        $sql = "
        UPDATE solicitudes_fondo
        SET
            estado=?,
            firmado_por=?,
            fecha_firma=NOW()
        WHERE id=?
        ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {

            echo json_encode([
                "success" => false,
                "message" => $conn->error
            ]);

            exit;
        }

        $stmt->bind_param(
            "sii",
            $nuevoEstado,
            $usuario_id,
            $solicitud_id
        );

        $descripcion = "Solicitud firmada";

    break;

    /* =====================================
       APROBAR
    ===================================== */

    case "APROBAR":

        if (!($esTIC || ($esAdmin && $esJefe))) {

            echo json_encode([
                "success" => false,
                "message" => "No autorizado para aprobar"
            ]);

            exit;
        }

        if ($estado_actual !== "PENDIENTE") {

            echo json_encode([
                "success" => false,
                "message" => "La solicitud debe estar PENDIENTE"
            ]);

            exit;
        }

        $nuevoEstado = "APROBADO";

        $sql = "
        UPDATE solicitudes_fondo
        SET
            estado=?,
            aprobado_por=?,
            fecha_aprobacion=NOW()
        WHERE id=?
        ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {

            echo json_encode([
                "success" => false,
                "message" => $conn->error
            ]);

            exit;
        }

        $stmt->bind_param(
            "sii",
            $nuevoEstado,
            $usuario_id,
            $solicitud_id
        );

        $descripcion = "Solicitud aprobada";

    break;

    /* =====================================
       RECHAZAR
    ===================================== */

    case "RECHAZAR":

        if (!($esTIC || $esAdmin || $esJefe)) {

            echo json_encode([
                "success" => false,
                "message" => "No autorizado"
            ]);

            exit;
        }

        $nuevoEstado = "RECHAZADO";

        $sql = "
        UPDATE solicitudes_fondo
        SET
            estado=?,
            observaciones=?
        WHERE id=?
        ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {

            echo json_encode([
                "success" => false,
                "message" => $conn->error
            ]);

            exit;
        }

        $stmt->bind_param(
            "ssi",
            $nuevoEstado,
            $observacion,
            $solicitud_id
        );

        $descripcion = "Solicitud rechazada";

    break;

    /* =====================================
       PAGAR
    ===================================== */

    case "PAGAR":

        if (!($esTIC || $esTesoreria)) {

            echo json_encode([
                "success" => false,
                "message" => "No autorizado para pagar"
            ]);

            exit;
        }

        /* =================================
           ADELANTO
        ================================= */

        if ($tipoSolicitud === "ADELANTO") {

            if ($estado_actual !== "APROBADO") {

                echo json_encode([
                    "success" => false,
                    "message" => "El adelanto debe estar APROBADO"
                ]);

                exit;
            }

            $nuevoEstado = "PAGADO";
        }

        /* =================================
           REEMBOLSO
        ================================= */

        else if ($tipoSolicitud === "REEMBOLSO") {

            /*
                FLUJO REAL:

                APROBADO
                -> usuario sube sustento
                -> EN_RENDICION
                -> tesoreria paga
                -> PAGADO
            */

            if (
                $estado_actual !== "EN_RENDICION"
                &&
                $estado_actual !== "POR_REEMBOLSAR"
            ) {

                echo json_encode([
                    "success" => false,
                    "message" => "El reembolso debe tener sustento"
                ]);

                exit;
            }

            $nuevoEstado = "PAGADO";
        }

        else {

            echo json_encode([
                "success" => false,
                "message" => "Tipo de solicitud inválido"
            ]);

            exit;
        }

        $sql = "
        UPDATE solicitudes_fondo
        SET
            estado=?,
            pagado_por=?,
            fecha_pago=NOW()
        WHERE id=?
        ";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {

            echo json_encode([
                "success" => false,
                "message" => $conn->error
            ]);

            exit;
        }

        $stmt->bind_param(
            "sii",
            $nuevoEstado,
            $usuario_id,
            $solicitud_id
        );

        $descripcion = "Pago registrado por tesorería";

    break;

    default:

        echo json_encode([
            "success" => false,
            "message" => "Acción inválida"
        ]);

    exit;
}

/* =========================================
   EJECUTAR
========================================= */

if ($stmt->execute()) {

    $historial = "
    INSERT INTO solicitud_historial
    (
        solicitud_id,
        usuario_id,
        accion,
        descripcion
    )
    VALUES
    (
        ?,
        ?,
        ?,
        ?
    )
    ";

    $hist = $conn->prepare($historial);

    if ($hist) {

        $hist->bind_param(
            "iiss",
            $solicitud_id,
            $usuario_id,
            $accion,
            $descripcion
        );

        $hist->execute();
    }

    echo json_encode([
        "success" => true,
        "message" => "Proceso Correcto",
        "estado" => $nuevoEstado
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$conn->close();
?>