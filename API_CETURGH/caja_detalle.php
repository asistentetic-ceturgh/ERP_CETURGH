<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once "db.php";

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$id) {
    echo json_encode(["ok" => false, "error" => "ID requerido"]);
    exit();
}

// Obtener caja
$sqlCaja = "SELECT c.*, e.nombre as empresa_nombre, e.ruc, s.nombre as sede_nombre, cc.nombre as centro_costo_nombre
            FROM cajas_chicas c
            LEFT JOIN empresas e ON c.empresa_id = e.id
            LEFT JOIN sedes s ON c.sede_id = s.id
            LEFT JOIN centros_costos cc ON c.centro_costo_id = cc.id
            WHERE c.id = ?";
$stmt = $conn->prepare($sqlCaja);
$stmt->bind_param("i", $id);
$stmt->execute();
$caja = $stmt->get_result()->fetch_assoc();
if (!$caja) {
    echo json_encode(["ok" => false, "error" => "Caja no encontrada"]);
    exit();
}

// Últimos 5 movimientos
$sqlMov = "SELECT * FROM movimientos_caja WHERE caja_id = ? ORDER BY created_at DESC LIMIT 5";
$stmtMov = $conn->prepare($sqlMov);
$stmtMov->bind_param("i", $id);
$stmtMov->execute();
$movimientos = $stmtMov->get_result()->fetch_all(MYSQLI_ASSOC);
$caja['ultimos_movimientos'] = $movimientos;

echo json_encode(["ok" => true, "data" => $caja]);
?>