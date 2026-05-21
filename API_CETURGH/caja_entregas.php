<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

try {

    $sql = "SELECT 
                e.id,
                e.persona,
                e.monto,
                e.fecha,
                e.estado,
                e.motivo,
                e.centro_costo_id,
                c.empresa_id,
                emp.nombre AS empresa_nombre
            FROM caja_entregas e
            JOIN cajas_chicas c ON e.caja_id = c.id
            JOIN empresas emp ON c.empresa_id = emp.id
            ORDER BY e.fecha DESC";

    $res = $conn->query($sql);

    if (!$res) {
        throw new Exception("Error en la consulta: " . $conn->error);
    }

    $data = [];

    while ($row = $res->fetch_assoc()) {

        // 🔹 Formateo limpio para frontend
        $data[] = [
            "id" => (int)$row["id"],
            "persona" => $row["persona"],
            "monto" => (float)$row["monto"],
            "fecha" => $row["fecha"],
            "estado" => $row["estado"],
            "motivo" => $row["motivo"],
            "empresa" => $row["empresa_nombre"], // 🔥 listo para tu badge
            "empresa_id" => (int)$row["empresa_id"],
            "centro_costo_id" => $row["centro_costo_id"]
        ];
    }

    echo json_encode([
        "ok" => true,
        "data" => $data
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "ok" => false,
        "error" => $e->getMessage()
    ]);
}