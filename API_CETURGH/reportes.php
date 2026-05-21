<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once "db.php";

$tipo = $_GET['tipo'] ?? '';

$fecha_inicio = $_GET['fecha_inicio'] ?? null;
$fecha_fin = $_GET['fecha_fin'] ?? null;
$sede_id = $_GET['sede_id'] ?? null;

$response = [];

switch ($tipo) {

    // ===============================
    // CAJA CHICA
    // ===============================
    case 'caja_movimientos':

        $sql = "SELECT 
                    ce.id,
                    ce.persona,
                    ce.monto,
                    ce.fecha,
                    ce.estado,
                    cc.nombre as centro_costo
                FROM caja_entregas ce
                LEFT JOIN centros_costos cc ON ce.centro_costo_id = cc.id
                WHERE 1=1";

        if ($fecha_inicio && $fecha_fin) {
            $sql .= " AND ce.fecha BETWEEN '$fecha_inicio' AND '$fecha_fin'";
        }

        $result = $conn->query($sql);
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
    break;

    case 'caja_pendientes':

        $sql = "SELECT * FROM caja_entregas 
                WHERE estado = 'PENDIENTE'";

        $result = $conn->query($sql);

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
    break;

    // ===============================
    // PLANILLA DOCENTE
    // ===============================
    case 'planilla_docente':

        $sql = "SELECT 
                    nombre,
                    curso,
                    horas,
                    total,
                    sede_id
                FROM planilla_docente
                WHERE 1=1";

        if ($sede_id) {
            $sql .= " AND sede_id = $sede_id";
        }

        $result = $conn->query($sql);

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
    break;

    // ===============================
    // ORDENES DE COMPRA
    // ===============================
    case 'ordenes_compra':

        $sql = "SELECT 
                    oc.numero,
                    oc.fecha,
                    oc.total,
                    p.nombre as proveedor
                FROM ordenes_compra oc
                LEFT JOIN proveedores p ON oc.proveedor_id = p.id";

        $result = $conn->query($sql);

        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
    break;

    default:
        echo json_encode([
            "error" => "Tipo de reporte no válido"
        ]);
}