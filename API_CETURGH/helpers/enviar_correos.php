<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

require_once "../db.php";
require_once "correo.php";

$stmt = $conn->prepare("
    SELECT 
        c.id,
        c.usuario_id,
        c.destinatario,
        c.nombre,
        c.asunto,
        c.mensaje
    FROM cola_correos c
    WHERE c.enviado = 0
    ORDER BY c.id ASC
    LIMIT 20
");

$stmt->execute();

$res = $stmt->get_result();

$resultados = [];

while ($row = $res->fetch_assoc()) {

    $correo = trim($row['destinatario']);

    $log = [
        "id" => $row['id'],
        "correo" => $correo,
        "estado" => null
    ];

    // VALIDAR VACÍO

    if (empty($correo)) {

        $up = $conn->prepare("
            UPDATE cola_correos
            SET error_envio = 'Correo vacío'
            WHERE id = ?
        ");

        $up->bind_param("i", $row['id']);
        $up->execute();

        $log['estado'] = 'SIN_CORREO';

        $resultados[] = $log;

        continue;
    }

    // VALIDAR EMAIL

    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {

        $up = $conn->prepare("
            UPDATE cola_correos
            SET error_envio = 'Correo inválido'
            WHERE id = ?
        ");

        $up->bind_param("i", $row['id']);
        $up->execute();

        $log['estado'] = 'CORREO_INVALIDO';

        $resultados[] = $log;

        continue;
    }

    // ENVIAR

    $respuesta = enviarCorreo(
        $correo,
        $row['nombre'],
        $row['asunto'],
        $row['mensaje']
    );

    // ÉXITO

    if ($respuesta['success']) {

        $up = $conn->prepare("
            UPDATE cola_correos
            SET 
                enviado = 1,
                enviado_at = NOW(),
                error_envio = NULL
            WHERE id = ?
        ");

        $up->bind_param("i", $row['id']);
        $up->execute();

        $log['estado'] = 'ENVIADO';

    } else {

        $up = $conn->prepare("
            UPDATE cola_correos
            SET 
                error_envio = ?
            WHERE id = ?
        ");

        $error = $respuesta['error'];

        $up->bind_param("si", $error, $row['id']);
        $up->execute();

        $log['estado'] = 'ERROR_ENVIO';
        $log['error'] = $error;
    }

    $resultados[] = $log;
}

echo json_encode([
    "success" => true,
    "procesados" => $resultados
], JSON_PRETTY_PRINT);