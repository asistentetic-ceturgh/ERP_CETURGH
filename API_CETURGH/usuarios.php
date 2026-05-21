<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// =========================
// PREFLIGHT
// =========================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

if ($conn->connect_error) {

    die(json_encode([
        "success" => false,
        "error" => "Conexión fallida"
    ]));
}

// =====================================================
// GET
// =====================================================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT 
            u.id,
            u.usuario,
            u.nombre,
            u.documento,
            u.tipo_documento,
            u.telefono,
            u.firma,
            u.tipo,
            u.departamento_id,
            d.nombre AS departamento
        FROM usuarios u
        LEFT JOIN departamentos d
            ON u.departamento_id = d.id
        ORDER BY u.id DESC
    ";

    $result = $conn->query($sql);

    $usuarios = [];

    while ($row = $result->fetch_assoc()) {

        // =========================================
        // OBTENER TODOS LOS DEPARTAMENTOS
        // =========================================
        $stmtDeptos = $conn->prepare("
            SELECT 
                d.id,
                d.nombre
            FROM usuarios_departamentos ud
            INNER JOIN departamentos d
                ON ud.departamento_id = d.id
            WHERE ud.usuario_id = ?
            ORDER BY d.nombre ASC
        ");

        $stmtDeptos->bind_param("i", $row['id']);
        $stmtDeptos->execute();

        $resDeptos = $stmtDeptos->get_result();

        $departamentos = [];
        $departamentos_ids = [];

        while ($dep = $resDeptos->fetch_assoc()) {

            $departamentos[] = [
                "id" => (int)$dep['id'],
                "nombre" => $dep['nombre']
            ];

            $departamentos_ids[] = (int)$dep['id'];
        }

        $stmtDeptos->close();

        $row['departamentos'] = $departamentos;
        $row['departamentos_ids'] = $departamentos_ids;

        $usuarios[] = $row;
    }

    echo json_encode($usuarios);
    exit();
}

// =====================================================
// POST (CREAR / EDITAR)
// =====================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = $_POST;

    if (!$data) {

        echo json_encode([
            "success" => false,
            "error" => "Datos inválidos"
        ]);

        exit();
    }

    // =========================================
    // CAMPOS
    // =========================================
    $id = isset($data['id'])
        ? (int)$data['id']
        : null;

    $usuario = trim($data['usuario'] ?? '');
    $nombre = trim($data['nombre'] ?? '');
    $documento = trim($data['documento'] ?? '');
    $tipo_documento = trim($data['tipo_documento'] ?? 'DNI');
    $telefono = trim($data['telefono'] ?? '');
    $tipo = trim($data['tipo'] ?? 'asistente');

    // =========================================
    // DEPARTAMENTOS
    // =========================================
    $departamentos_ids = [];

    if (isset($data['departamentos_ids'])) {

        $decoded = json_decode(
            $data['departamentos_ids'],
            true
        );

        if (is_array($decoded)) {

            foreach ($decoded as $depId) {

                $depId = (int)$depId;

                if ($depId > 0) {
                    $departamentos_ids[] = $depId;
                }
            }
        }
    }

    // eliminar duplicados
    $departamentos_ids = array_values(
        array_unique($departamentos_ids)
    );

    // =========================================
    // DEPARTAMENTO PRINCIPAL
    // =========================================
    $departamento_id = null;

    if (count($departamentos_ids) > 0) {
        $departamento_id = (int)$departamentos_ids[0];
    }

    // =========================================
    // VALIDACIONES
    // =========================================
    if (
        empty($usuario) ||
        empty($nombre)
    ) {

        echo json_encode([
            "success" => false,
            "error" => "Complete los campos obligatorios"
        ]);

        exit();
    }

    // =========================================
    // VALIDAR DEPARTAMENTOS
    // =========================================
    if (empty($departamentos_ids)) {

        echo json_encode([
            "success" => false,
            "error" => "Debe seleccionar al menos un departamento"
        ]);

        exit();
    }

    // =========================================
    // VALIDAR USUARIO DUPLICADO
    // =========================================
    if ($id) {

        $stmtExiste = $conn->prepare("
            SELECT id
            FROM usuarios
            WHERE usuario = ?
            AND id != ?
        ");

        $stmtExiste->bind_param(
            "si",
            $usuario,
            $id
        );

    } else {

        $stmtExiste = $conn->prepare("
            SELECT id
            FROM usuarios
            WHERE usuario = ?
        ");

        $stmtExiste->bind_param(
            "s",
            $usuario
        );
    }

    $stmtExiste->execute();

    $resExiste = $stmtExiste->get_result();

    if ($resExiste->num_rows > 0) {

        echo json_encode([
            "success" => false,
            "error" => "El usuario ya existe"
        ]);

        $stmtExiste->close();
        exit();
    }

    $stmtExiste->close();

    // =========================================
    // FIRMA
    // =========================================
    $firma = null;

    if (
        isset($_FILES['firma']) &&
        $_FILES['firma']['error'] === 0
    ) {

        $permitidos = [
            'image/png',
            'image/jpeg',
            'image/jpg'
        ];

        if (!in_array($_FILES['firma']['type'], $permitidos)) {

            echo json_encode([
                "success" => false,
                "error" => "Formato de firma no permitido"
            ]);

            exit();
        }

        // máximo 2MB
        if ($_FILES['firma']['size'] > 2 * 1024 * 1024) {

            echo json_encode([
                "success" => false,
                "error" => "La firma excede 2MB"
            ]);

            exit();
        }

        $directorio = "firmas/";

        if (!file_exists($directorio)) {
            mkdir($directorio, 0777, true);
        }

        $extension = pathinfo(
            $_FILES['firma']['name'],
            PATHINFO_EXTENSION
        );

        $nombreArchivo = uniqid("firma_") . "." . $extension;

        $ruta = $directorio . $nombreArchivo;

        if (
            move_uploaded_file(
                $_FILES['firma']['tmp_name'],
                $ruta
            )
        ) {

            $firma = $ruta;
        }
    }

    // =====================================================
    // CREAR USUARIO
    // =====================================================
    if (!$id) {

        if (empty($data['password'])) {

            echo json_encode([
                "success" => false,
                "error" => "La contraseña es obligatoria"
            ]);

            exit();
        }

        $password = password_hash(
            $data['password'],
            PASSWORD_DEFAULT
        );

        $stmt = $conn->prepare("
            INSERT INTO usuarios
            (
                usuario,
                nombre,
                documento,
                telefono,
                tipo_documento,
                password,
                tipo,
                departamento_id,
                firma
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        if (!$stmt) {

            echo json_encode([
                "success" => false,
                "error" => $conn->error
            ]);

            exit();
        }

        $stmt->bind_param(
            "sssssssis",
            $usuario,
            $nombre,
            $documento,
            $telefono,
            $tipo_documento,
            $password,
            $tipo,
            $departamento_id,
            $firma
        );

        if ($stmt->execute()) {

            $usuario_id = $stmt->insert_id;

            // =========================================
            // INSERTAR DEPARTAMENTOS
            // =========================================
            $stmtDepto = $conn->prepare("
                INSERT INTO usuarios_departamentos
                (
                    usuario_id,
                    departamento_id
                )
                VALUES (?, ?)
            ");

            foreach ($departamentos_ids as $depId) {

                $stmtDepto->bind_param(
                    "ii",
                    $usuario_id,
                    $depId
                );

                $stmtDepto->execute();
            }

            $stmtDepto->close();

            echo json_encode([
                "success" => true,
                "message" => "Usuario creado",
                "id" => $usuario_id
            ]);

        } else {

            echo json_encode([
                "success" => false,
                "error" => $stmt->error
            ]);
        }

        $stmt->close();
        exit();
    }

    // =====================================================
    // EDITAR USUARIO
    // =====================================================

    // =========================================
    // OBTENER FIRMA ACTUAL
    // =========================================
    $firma_actual = null;

    $consultaFirma = $conn->prepare("
        SELECT firma
        FROM usuarios
        WHERE id = ?
    ");

    $consultaFirma->bind_param("i", $id);
    $consultaFirma->execute();

    $resultadoFirma = $consultaFirma->get_result();

    if ($resultadoFirma->num_rows > 0) {

        $filaFirma = $resultadoFirma->fetch_assoc();

        $firma_actual = $filaFirma['firma'];
    }

    $consultaFirma->close();

    // mantener firma actual
    if (!$firma) {
        $firma = $firma_actual;
    }

    // =========================================
    // UPDATE CON PASSWORD
    // =========================================
    if (!empty($data['password'])) {

        $password = password_hash(
            $data['password'],
            PASSWORD_DEFAULT
        );

        $stmt = $conn->prepare("
            UPDATE usuarios
            SET
                usuario = ?,
                nombre = ?,
                documento = ?,
                telefono = ?,
                tipo_documento = ?,
                password = ?,
                tipo = ?,
                departamento_id = ?,
                firma = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "sssssssisi",
            $usuario,
            $nombre,
            $documento,
            $telefono,
            $tipo_documento,
            $password,
            $tipo,
            $departamento_id,
            $firma,
            $id
        );

    } else {

        // =========================================
        // UPDATE SIN PASSWORD
        // =========================================
        $stmt = $conn->prepare("
            UPDATE usuarios
            SET
                usuario = ?,
                nombre = ?,
                documento = ?,
                telefono = ?,
                tipo_documento = ?,
                tipo = ?,
                departamento_id = ?,
                firma = ?
            WHERE id = ?
        ");

        $stmt->bind_param(
            "ssssssisi",
            $usuario,
            $nombre,
            $documento,
            $telefono,
            $tipo_documento,
            $tipo,
            $departamento_id,
            $firma,
            $id
        );
    }

    if ($stmt->execute()) {

        // =========================================
        // ELIMINAR DEPARTAMENTOS ACTUALES
        // =========================================
        $deleteDeptos = $conn->prepare("
            DELETE FROM usuarios_departamentos
            WHERE usuario_id = ?
        ");

        $deleteDeptos->bind_param(
            "i",
            $id
        );

        $deleteDeptos->execute();
        $deleteDeptos->close();

        // =========================================
        // INSERTAR NUEVOS DEPARTAMENTOS
        // =========================================
        $stmtDepto = $conn->prepare("
            INSERT INTO usuarios_departamentos
            (
                usuario_id,
                departamento_id
            )
            VALUES (?, ?)
        ");

        foreach ($departamentos_ids as $depId) {

            $stmtDepto->bind_param(
                "ii",
                $id,
                $depId
            );

            $stmtDepto->execute();
        }

        $stmtDepto->close();

        echo json_encode([
            "success" => true,
            "message" => "Usuario actualizado"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    $stmt->close();
    exit();
}

// =====================================================
// DELETE
// =====================================================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    if (!isset($_GET['id'])) {

        echo json_encode([
            "success" => false,
            "error" => "ID requerido"
        ]);

        exit();
    }

    $id = (int)$_GET['id'];

    // =========================================
    // OBTENER FIRMA
    // =========================================
    $consulta = $conn->prepare("
        SELECT firma
        FROM usuarios
        WHERE id = ?
    ");

    $consulta->bind_param("i", $id);
    $consulta->execute();

    $resultado = $consulta->get_result();

    if ($resultado->num_rows > 0) {

        $usuario = $resultado->fetch_assoc();

        if (
            !empty($usuario['firma']) &&
            file_exists($usuario['firma'])
        ) {

            unlink($usuario['firma']);
        }
    }

    $consulta->close();

    // =========================================
    // ELIMINAR RELACIONES
    // =========================================
    $deleteDeptos = $conn->prepare("
        DELETE FROM usuarios_departamentos
        WHERE usuario_id = ?
    ");

    $deleteDeptos->bind_param(
        "i",
        $id
    );

    $deleteDeptos->execute();
    $deleteDeptos->close();

    // =========================================
    // ELIMINAR USUARIO
    // =========================================
    $stmt = $conn->prepare("
        DELETE FROM usuarios
        WHERE id = ?
    ");

    $stmt->bind_param(
        "i",
        $id
    );

    if ($stmt->execute()) {

        echo json_encode([
            "success" => true,
            "message" => "Usuario eliminado"
        ]);

    } else {

        echo json_encode([
            "success" => false,
            "error" => $stmt->error
        ]);
    }

    $stmt->close();
}

$conn->close();
?>