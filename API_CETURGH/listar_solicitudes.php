<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$sql = "
SELECT 
    sf.id,
    sf.codigo,
    sf.solicitante_id,
    sf.departamento_solicitante,
    sf.empresa,
    sf.sede,
    sf.tipo,
    sf.categoria,
    sf.concepto,
    sf.monto_solicitado,
    sf.monto_rendido,
    sf.diferencia,
    sf.estado,
    sf.created_at,
    sf.fecha_aprobacion,
    sf.fecha_pago,
    sf.fecha_firma,
    sf.observaciones,
    
    /* SOLICITANTE */
    u.nombre AS solicitante,
    u.documento AS solicitante_documento,
    u.firma AS solicitante_firma,
    
    /* QUIEN FIRMÓ (JEFE) */
    f.nombre AS firmador_nombre,
    f.documento AS firmador_documento,
    f.firma AS firmador_firma,
    
    /* QUIEN APROBÓ (ADMIN) */
    a.nombre AS aprobador_nombre,
    a.documento AS aprobador_documento,
    a.firma AS aprobador_firma,
    
    /* QUIEN PAGÓ (TESORERIA) */
    p.nombre AS pagador_nombre,
    p.documento AS pagador_documento,
    p.firma AS pagador_firma
    
FROM solicitudes_fondo sf

/* SOLICITANTE */
LEFT JOIN usuarios u ON u.id = sf.solicitante_id

/* QUIEN FIRMÓ LA SOLICITUD (JEFE) */
LEFT JOIN usuarios f ON f.id = sf.firmado_por

/* QUIEN APROBÓ (ADMINISTRACION) */
LEFT JOIN usuarios a ON a.id = sf.aprobado_por

/* QUIEN PAGÓ (TESORERIA) */
LEFT JOIN usuarios p ON p.id = sf.pagado_por

ORDER BY sf.created_at DESC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Error en la consulta: " . $conn->error
    ]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$conn->close();
?>