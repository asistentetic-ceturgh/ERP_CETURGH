<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$sql = "
SELECT
    sf.id,
    sf.codigo,

    sf.solicitante_id,
    u.nombre AS solicitante_nombre,
    u.tipo AS solicitante_tipo,

    d.nombre AS departamento_solicitante,

    sf.empresa,
    sf.sede,
    sf.tipo,
    sf.categoria,
    sf.concepto,

    sf.monto_solicitado,
    sf.monto_rendido,
    sf.diferencia,

    sf.estado,

    sf.firma_digital,
    sf.firmado_por,
    sf.fecha_firma,

    sf.aprobado_por,
    sf.fecha_aprobacion,

    sf.pagado_por,
    sf.fecha_pago,

    sf.observaciones,
    sf.created_at

FROM solicitudes_fondo sf

LEFT JOIN usuarios u
    ON u.id = sf.solicitante_id

LEFT JOIN departamentos d
    ON d.id = u.departamento_id

ORDER BY sf.id DESC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => $conn->error
    ]);
    exit;
}

function limpiarTexto($texto)
{
    $texto = trim($texto ?? "");

    $buscar = ['Á','É','Í','Ó','Ú','á','é','í','ó','ú'];
    $reemplazar = ['A','E','I','O','U','A','E','I','O','U'];

    return strtoupper(str_replace($buscar, $reemplazar, $texto));
}

$datos = [];

while ($row = $result->fetch_assoc()) {

    $estado = strtoupper(trim($row["estado"]));

    $estaFirmado = !empty($row["firmado_por"]);

    $datos[] = [

        "id" => intval($row["id"]),
        "codigo" => $row["codigo"],

        "solicitante_id" => intval($row["solicitante_id"]),
        "solicitante" => $row["solicitante_nombre"],

        "solicitante_tipo" => limpiarTexto($row["solicitante_tipo"]),
        "departamento_solicitante" => limpiarTexto($row["departamento_solicitante"]),

        "empresa" => limpiarTexto($row["empresa"]),
        "sede" => limpiarTexto($row["sede"]),
        "tipo" => limpiarTexto($row["tipo"]),
        "categoria" => limpiarTexto($row["categoria"]),

        "concepto" => $row["concepto"],

        "monto_solicitado" => floatval($row["monto_solicitado"]),
        "monto_rendido" => floatval($row["monto_rendido"]),
        "diferencia" => floatval($row["diferencia"]),

        "estado" => $estado,

        "firmado_por" => $row["firmado_por"] ? intval($row["firmado_por"]) : null,
        "fecha_firma" => $row["fecha_firma"],

        "aprobado_por" => $row["aprobado_por"] ? intval($row["aprobado_por"]) : null,
        "fecha_aprobacion" => $row["fecha_aprobacion"],

        "pagado_por" => $row["pagado_por"] ? intval($row["pagado_por"]) : null,
        "fecha_pago" => $row["fecha_pago"],

        "observaciones" => $row["observaciones"],

        "puede_editar" => ($estado === "SIN_FIRMAR"),

        "created_at" => $row["created_at"]
    ];
}

echo json_encode($datos);

$conn->close();