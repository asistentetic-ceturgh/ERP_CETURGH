<?php

require_once "helpers/correo.php";

$ok = enviarCorreo(
    'TU_CORREO@gmail.com',
    'Pablo',
    'Prueba Sistema CETURGH',
    '<h1>Correo funcionando correctamente</h1>'
);

var_dump($ok);
