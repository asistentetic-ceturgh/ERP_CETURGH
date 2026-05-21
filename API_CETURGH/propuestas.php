<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

$op = $_GET['op'] ?? '';

switch ($op) {

    // ==========================================
    // LISTAR REQUERIMIENTOS PARA COTIZAR
    // ==========================================
    case "listar":

        $sql = "
            SELECT 
                r.id as req_id, 
                r.codigo,

                i.id as item_id, 
                i.descripcion, 
                i.requiere_cotizacion,
                i.precio_unitario,
                i.proveedor,
                i.proveedor_id,

                p.id as prop_id, 
                p.proveedor as prop_proveedor,
                p.monto,
                p.dias_credito,
                p.costo_delivery,
                p.tiempo_entrega,
                p.seleccionada, 
                p.pdf_url

            FROM requerimientos r
            JOIN items i ON i.requerimiento_id = r.id
            LEFT JOIN propuestas p ON p.item_id = i.id
            WHERE i.requiere_cotizacion = 1
            ORDER BY r.id DESC, i.id ASC, p.monto ASC
        ";

        $result = $conn->query($sql);
        $data = [];

        while ($row = $result->fetch_assoc()) {

            $reqId = $row['req_id'];
            $itemId = $row['item_id'];

            if (!isset($data[$reqId])) {
                $data[$reqId] = [
                    "id" => $reqId,
                    "codigo" => $row['codigo'],
                    "items" => []
                ];
            }

            if (!isset($data[$reqId]["items"][$itemId])) {
                $data[$reqId]["items"][$itemId] = [
                    "id" => $itemId,
                    "descripcion" => $row['descripcion'],
                    "requiereCotizacion" => (int)$row['requiere_cotizacion'],
                    "precio" => (float)$row['precio_unitario'],
                    "proveedor" => $row['proveedor'],
                    "proveedor_id" => $row['proveedor_id'],
                    "propuestas" => []
                ];
            }

            // Evitar duplicados
            if ($row['prop_id'] && !isset($data[$reqId]["items"][$itemId]["seen_props"][$row['prop_id']])) {
                $data[$reqId]["items"][$itemId]["propuestas"][] = [
                    "id" => $row['prop_id'],
                    "proveedor" => $row['prop_proveedor'],
                    "monto" => (float)$row['monto'],
                    "dias_credito" => (int)$row['dias_credito'],
                    "costo_delivery" => (float)$row['costo_delivery'],
                    "tiempo_entrega" => $row['tiempo_entrega'],
                    "seleccionada" => (int)$row['seleccionada'],
                    "pdfUrl" => $row['pdf_url']
                ];

                $data[$reqId]["items"][$itemId]["seen_props"][$row['prop_id']] = true;
            }
        }

        // Limpiar índices
        foreach ($data as &$req) {
            foreach ($req["items"] as &$item) {
                unset($item["seen_props"]);
            }
            $req["items"] = array_values($req["items"]);
        }

        echo json_encode(array_values($data));
        break;


    // ==========================================
    // ACTIVAR ITEMS
    // ==========================================
    case "activar_items":

        $input = json_decode(file_get_contents("php://input"), true);
        $items = $input['items'] ?? [];

        if (count($items) === 0) {
            echo json_encode(["error" => "No hay items"]);
            exit();
        }

        $stmt = $conn->prepare("UPDATE items SET requiere_cotizacion = 1 WHERE id = ?");

        foreach ($items as $it) {
            $id = intval($it['id']);
            $stmt->bind_param("i", $id);
            $stmt->execute();
        }

        echo json_encode(["success" => true]);
        break;


    // ==========================================
    // CREAR PROPUESTA
    // ==========================================
    case "crear":

        $item_id = $_POST['item_id'] ?? null;
        $proveedor_id = $_POST['proveedor_id'] ?? null;
        $proveedor = $_POST['proveedor'] ?? '';
        $monto = $_POST['monto'] ?? 0;
        $dias_credito = $_POST['dias_credito'] ?? 0;
        $costo_delivery = $_POST['costo_delivery'] ?? 0;
        $tiempo_entrega = $_POST['tiempo_entrega'] ?? '';

        if (!$item_id || !$proveedor || !$monto) {
            echo json_encode(["error" => "Datos incompletos"]);
            exit();
        }

        $pdf_url = null;

        if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === 0) {

            $uploadDir = "../uploads/";

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $fileName = time() . "_" . basename($_FILES["archivo"]["name"]);
            $targetFile = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES["archivo"]["tmp_name"], $targetFile)) {
                $pdf_url = "http://localhost/uploads/" . $fileName;
            }
        }

        $stmt = $conn->prepare("
            INSERT INTO propuestas 
            (item_id, proveedor, monto, dias_credito, costo_delivery, tiempo_entrega, pdf_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->bind_param(
            "isdidss",
            $item_id,
            $proveedor,
            $monto,
            $dias_credito,
            $costo_delivery,
            $tiempo_entrega,
            $pdf_url
        );

        $stmt->execute();

        echo json_encode(["success" => true]);
        break;


    // ==========================================
    // BUSCAR PROVEEDORES
    // ==========================================
    case "buscar_proveedores":

        $q = $_GET['q'] ?? '';

        if (!$q) {
            echo json_encode([]);
            exit();
        }

        $q = "%" . $q . "%";

        $stmt = $conn->prepare("
            SELECT id, nombre, ruc 
            FROM proveedores 
            WHERE nombre LIKE ? OR ruc LIKE ?
            LIMIT 10
        ");

        $stmt->bind_param("ss", $q, $q);
        $stmt->execute();

        $result = $stmt->get_result();
        $data = [];

        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data);
        break;


    // ==========================================
    // CREAR PROVEEDOR
    // ==========================================
    case "crear_proveedor":

        $input = json_decode(file_get_contents("php://input"), true);

        $nombre = $input['nombre'] ?? '';
        $ruc = $input['ruc'] ?? '';

        if (!$nombre) {
            echo json_encode(["error" => "Nombre requerido"]);
            exit();
        }

        $stmt = $conn->prepare("
            INSERT INTO proveedores (nombre, ruc) 
            VALUES (?, ?)
        ");

        $stmt->bind_param("ss", $nombre, $ruc);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "id" => $stmt->insert_id
        ]);
        break;


    // ==========================================
    // SELECCIONAR PROPUESTA GANADORA
    // ==========================================
    case "seleccionar":

        $input = json_decode(file_get_contents("php://input"), true);

        $propuesta_id = intval($input['propuesta_id'] ?? 0);
        $item_id = intval($input['item_id'] ?? 0);

        if (!$propuesta_id || !$item_id) {
            echo json_encode(["error" => "Datos incompletos"]);
            exit();
        }

        // Resetear
        $stmt1 = $conn->prepare("UPDATE propuestas SET seleccionada = 0 WHERE item_id = ?");
        $stmt1->bind_param("i", $item_id);
        $stmt1->execute();

        // Ganadora
        $stmt2 = $conn->prepare("UPDATE propuestas SET seleccionada = 1 WHERE id = ?");
        $stmt2->bind_param("i", $propuesta_id);
        $stmt2->execute();

        // Obtener datos
        $stmt3 = $conn->prepare("
            SELECT p.monto, p.proveedor, pr.id as proveedor_id
            FROM propuestas p
            LEFT JOIN proveedores pr ON pr.nombre = p.proveedor
            WHERE p.id = ?
        ");

        $stmt3->bind_param("i", $propuesta_id);
        $stmt3->execute();

        $prop = $stmt3->get_result()->fetch_assoc();

        // Actualizar item
        $stmt4 = $conn->prepare("
            UPDATE items 
            SET precio_unitario = ?, proveedor = ?, proveedor_id = ?
            WHERE id = ?
        ");

        $stmt4->bind_param(
            "dsii",
            $prop['monto'],
            $prop['proveedor'],
            $prop['proveedor_id'],
            $item_id
        );

        $stmt4->execute();

        echo json_encode([
            "success" => true,
            "precio" => (float)$prop['monto'],
            "proveedor" => $prop['proveedor'],
            "proveedor_id" => $prop['proveedor_id']
        ]);
        break;


    default:
        echo json_encode(["error" => "Operación no válida"]);
}