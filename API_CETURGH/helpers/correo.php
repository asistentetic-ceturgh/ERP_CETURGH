<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

function enviarCorreo($destino, $nombre, $asunto, $mensaje)
{
    try {

        $mail = new PHPMailer(true);

        $mail->isSMTP();

        $mail->Host = 'smtp.gmail.com';

        $mail->SMTPAuth = true;

        $mail->Username = 'sistemas.ceturgh@ceturghperu.edu.pe';

        // APP PASSWORD
        $mail->Password = 'aobb ngbu rvys coaw';

        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';

        // DEBUG OPCIONAL
        // $mail->SMTPDebug = 2;

        $mail->setFrom(
            'sistemas.ceturgh@ceturghperu.edu.pe',
            'Sistema CETURGH'
        );

        $mail->addAddress($destino, $nombre);

        $mail->isHTML(true);

        $mail->Subject = $asunto;

        $mail->Body = $mensaje;

        $mail->send();

        return [
            "success" => true
        ];

    } catch (Exception $e) {

        return [
            "success" => false,
            "error" => $mail->ErrorInfo . ' | ' . $e->getMessage()
        ];
    }
}