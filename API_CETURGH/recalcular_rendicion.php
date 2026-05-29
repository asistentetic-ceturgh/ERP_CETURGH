<?php
// Función auxiliar para recalcular monto_rendido y diferencia de una solicitud
function recalcularRendicion($solicitud_id, $conn) {
    // Sumar todos los gastos
    $suma = 0;
    $stmt = $conn->prepare("SELECT SUM(monto) as total FROM solicitud_gastos WHERE solicitud_id = ?");
    $stmt->bind_param("i", $solicitud_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $total_rendido = floatval($row["total"] ?? 0);

    // Obtener monto_solicitado
    $stmt2 = $conn->prepare("SELECT monto_solicitado, tipo, estado FROM solicitudes_fondo WHERE id = ?");
    $stmt2->bind_param("i", $solicitud_id);
    $stmt2->execute();
    $res2 = $stmt2->get_result();
    $sol = $res2->fetch_assoc();
    if (!$sol) return;

    $monto_solicitado = floatval($sol["monto_solicitado"]);
    $diferencia = $monto_solicitado - $total_rendido;

    // Actualizar campos en la tabla principal
    $update = $conn->prepare("UPDATE solicitudes_fondo SET monto_rendido = ?, diferencia = ? WHERE id = ?");
    $update->bind_param("ddi", $total_rendido, $diferencia, $solicitud_id);
    $update->execute();
}
?>