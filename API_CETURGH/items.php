<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function nullableInt($val) {
    return (isset($val) && $val !== "" && $val !== null) ? intval($val) : null;
}

# =========================
# 🔹 GET - LISTAR ITEMS (incluye incluye_igv)
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $sql = "
        SELECT 
            i.*,
            r.empresa_id,
            r.sede_id,
            s.nombre AS sede_nombre,
            cc.codigo AS centro_codigo,
            cc.nombre AS centro_nombre
        FROM items i
        INNER JOIN requerimientos r 
            ON i.requerimiento_id = r.id
        LEFT JOIN sedes s 
            ON r.sede_id = s.id
        LEFT JOIN centros_costos cc 
            ON i.centro_costo_id = cc.id
        WHERE 
            i.flujo_estado IN (
                'LOGISTICA',
                'ADMINISTRACION',
                'TESORERIA'
            )
        ORDER BY i.id DESC
    ";

    $res = $conn->query($sql);

    if (!$res) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }

    $data = [];

    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(["data" => $data]);
    exit();
}

# =========================
# 🔹 POST - ACTUALIZAR EN LOTE (con soporte para archivos)
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Verificar si es multipart/form-data (subida de archivos) o JSON
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
        
        // Procesar datos multipart
        $dataJson = $_POST['data'] ?? null;
        if (!$dataJson) {
            echo json_encode(["success" => false, "error" => "Sin datos"]);
            exit();
        }
        
        $items = json_decode($dataJson, true);
        
        if (!$items || !isset($items['items'])) {
            echo json_encode(["success" => false, "error" => "Datos inválidos"]);
            exit();
        }
        
        $itemsList = $items['items'];
        
        // Directorio para subir archivos
        $upload_dir = '../uploads/items/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        // 🔥 CORREGIDO: incluir incluye_igv en la actualización
        $stmt = $conn->prepare("
            UPDATE items SET 
                precio_unitario = ?, 
                total = ?, 
                proveedor_id = ?, 
                centro_costo_id = ?, 
                requiere_cotizacion = ?, 
                es_insumo = ?, 
                estado_insumo = ?,
                comentario_solicitante = ?,
                archivo_adjunto = ?,
                incluye_igv = ?
            WHERE id = ?
        ");
        
        if (!$stmt) {
            echo json_encode(["error" => $conn->error]);
            exit();
        }
        
        foreach ($itemsList as $idx => $it) {
            $id = intval($it['id']);
            $precio = floatval($it['precio_unitario'] ?? 0);
            $cantidad = floatval($it['cantidad'] ?? 0);
            $total = $precio * $cantidad;
            
            $proveedor_id = nullableInt($it['proveedor_id'] ?? null);
            $centro = nullableInt($it['centro_costo_id'] ?? null);
            $requiere = intval($it['requiere_cotizacion'] ?? 0);
            $insumo = intval($it['es_insumo'] ?? 0);
            $estado_insumo = $it['estado_insumo'] ?? 'Pendiente';
            $comentario_solicitante = $it['comentario_solicitante'] ?? null;
            $incluye_igv = isset($it['incluye_igv']) ? intval($it['incluye_igv']) : 0;
            
            // Procesar archivo subido para este item
            $archivo_ruta = null;
            if (isset($_FILES["archivo_$idx"]) && $_FILES["archivo_$idx"]['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES["archivo_$idx"];
                $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
                
                if (in_array($extension, $extensiones_permitidas)) {
                    $nombre_archivo = uniqid() . '_' . $id . '_' . time() . '.' . $extension;
                    $ruta_completa = $upload_dir . $nombre_archivo;
                    
                    if (move_uploaded_file($file['tmp_name'], $ruta_completa)) {
                        $archivo_ruta = 'uploads/items/' . $nombre_archivo;
                    }
                }
            } elseif (isset($it['archivo_adjunto']) && !empty($it['archivo_adjunto'])) {
                // Mantener archivo existente si no se subió uno nuevo
                $archivo_ruta = $it['archivo_adjunto'];
            }
            
            // 🔥 CORREGIDO: 11 parámetros (10 valores + 1 id)
            $stmt->bind_param(
                "ddiiississii",
                $precio,
                $total,
                $proveedor_id,
                $centro,
                $requiere,
                $insumo,
                $estado_insumo,
                $comentario_solicitante,
                $archivo_ruta,
                $incluye_igv,
                $id
            );
            
            if (!$stmt->execute()) {
                echo json_encode(["error" => $stmt->error]);
                exit();
            }
        }
        
        echo json_encode(["success" => true]);
        exit();
        
    } else {
        // Procesar JSON normal (sin archivos)
        $items = json_decode(file_get_contents("php://input"), true);
        
        if (!$items || !isset($items['items'])) {
            echo json_encode(["success" => false, "error" => "Sin datos"]);
            exit();
        }
        
        $itemsList = $items['items'];
        
        // 🔥 CORREGIDO: incluir incluye_igv
        $stmt = $conn->prepare("
            UPDATE items SET 
                precio_unitario = ?, 
                total = ?, 
                proveedor_id = ?, 
                centro_costo_id = ?, 
                requiere_cotizacion = ?, 
                es_insumo = ?, 
                estado_insumo = ?,
                comentario_solicitante = ?,
                archivo_adjunto = ?,
                incluye_igv = ?
            WHERE id = ?
        ");
        
        if (!$stmt) {
            echo json_encode(["error" => $conn->error]);
            exit();
        }
        
        foreach ($itemsList as $it) {
            $id = intval($it['id']);
            $precio = floatval($it['precio_unitario'] ?? 0);
            $cantidad = floatval($it['cantidad'] ?? 0);
            $total = $precio * $cantidad;
            
            $proveedor_id = nullableInt($it['proveedor_id'] ?? null);
            $centro = nullableInt($it['centro_costo_id'] ?? null);
            $requiere = intval($it['requiere_cotizacion'] ?? 0);
            $insumo = intval($it['es_insumo'] ?? 0);
            $estado_insumo = $it['estado_insumo'] ?? 'Pendiente';
            $comentario_solicitante = $it['comentario_solicitante'] ?? null;
            $archivo_adjunto = $it['archivo_adjunto'] ?? null;
            $incluye_igv = isset($it['incluye_igv']) ? intval($it['incluye_igv']) : 0;
            
            // 🔥 CORREGIDO: 11 parámetros
            $stmt->bind_param(
                "ddiiississii",
                $precio,
                $total,
                $proveedor_id,
                $centro,
                $requiere,
                $insumo,
                $estado_insumo,
                $comentario_solicitante,
                $archivo_adjunto,
                $incluye_igv,
                $id
            );
            
            if (!$stmt->execute()) {
                echo json_encode(["error" => $stmt->error]);
                exit();
            }
        }
        
        echo json_encode(["success" => true]);
        exit();
    }
}

# =========================
# 🔹 PUT - ACTUALIZAR 1 ITEM COMPLETO (con soporte para archivos)
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    
    // Verificar si es multipart/form-data
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
        
        $dataJson = $_POST['data'] ?? null;
        if (!$dataJson) {
            echo json_encode(["success" => false, "error" => "Sin datos"]);
            exit();
        }
        
        $it = json_decode($dataJson, true);
        
        if (!$it || !isset($it['id'])) {
            echo json_encode(["success" => false, "error" => "Datos inválidos"]);
            exit();
        }
        
        $id = intval($it['id']);
        $precio = floatval($it['precio_unitario'] ?? 0);
        $cantidad = floatval($it['cantidad'] ?? 0);
        $total = $precio * $cantidad;
        
        $proveedor = $it['proveedor'] ?? "";
        $proveedor_id = nullableInt($it['proveedor_id'] ?? null);
        $centro = nullableInt($it['centro_costo_id'] ?? null);
        
        $requiere = intval($it['requiere_cotizacion'] ?? 0);
        $insumo = intval($it['es_insumo'] ?? 0);
        $estado_insumo = $it['estado_insumo'] ?? 'Pendiente';
        $estado_pago = $it['estado_pago'] ?? 'Pendiente';
        $comentario_solicitante = $it['comentario_solicitante'] ?? null;
        $incluye_igv = isset($it['incluye_igv']) ? intval($it['incluye_igv']) : 0;
        
        // Procesar archivo subido
        $archivo_ruta = null;
        if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../uploads/items/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            
            $file = $_FILES['archivo'];
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
            
            if (in_array($extension, $extensiones_permitidas)) {
                $nombre_archivo = uniqid() . '_' . $id . '_' . time() . '.' . $extension;
                $ruta_completa = $upload_dir . $nombre_archivo;
                
                if (move_uploaded_file($file['tmp_name'], $ruta_completa)) {
                    $archivo_ruta = 'uploads/items/' . $nombre_archivo;
                    
                    // Eliminar archivo anterior si existe
                    if (!empty($it['archivo_adjunto_old']) && file_exists('../' . $it['archivo_adjunto_old'])) {
                        unlink('../' . $it['archivo_adjunto_old']);
                    }
                }
            }
        } elseif (isset($it['archivo_adjunto']) && !empty($it['archivo_adjunto'])) {
            $archivo_ruta = $it['archivo_adjunto'];
        }
        
        // 🔥 CORREGIDO: incluir incluye_igv
        $stmt = $conn->prepare("
            UPDATE items SET 
                precio_unitario = ?, 
                total = ?, 
                proveedor = ?, 
                proveedor_id = ?, 
                centro_costo_id = ?, 
                requiere_cotizacion = ?, 
                es_insumo = ?, 
                estado_insumo = ?,
                estado_pago = ?,
                comentario_solicitante = ?,
                archivo_adjunto = ?,
                incluye_igv = ?
            WHERE id = ?
        ");
        
        if (!$stmt) {
            echo json_encode(["error" => $conn->error]);
            exit();
        }
        
        // 🔥 CORREGIDO: 13 parámetros (12 valores + 1 id)
        $stmt->bind_param(
            "ddsiiissssssii",
            $precio,
            $total,
            $proveedor,
            $proveedor_id,
            $centro,
            $requiere,
            $insumo,
            $estado_insumo,
            $estado_pago,
            $comentario_solicitante,
            $archivo_ruta,
            $incluye_igv,
            $id
        );
        
        if (!$stmt->execute()) {
            echo json_encode(["error" => $stmt->error]);
            exit();
        }
        
        echo json_encode(["success" => true]);
        exit();
        
    } else {
    // Procesar JSON normal
    $it = json_decode(file_get_contents("php://input"), true);
    
    if (!$it || !isset($it['id'])) {
        echo json_encode(["success" => false, "error" => "Datos inválidos"]);
        exit();
    }
    
    $id = intval($it['id']);
    $precio = floatval($it['precio_unitario'] ?? 0);
    $cantidad = floatval($it['cantidad'] ?? 0);
    $total = $precio * $cantidad;
    
    $proveedor = $it['proveedor'] ?? "";
    $proveedor_id = nullableInt($it['proveedor_id'] ?? null);
    $centro = nullableInt($it['centro_costo_id'] ?? null);
    
    $requiere = intval($it['requiere_cotizacion'] ?? 0);
    $insumo = intval($it['es_insumo'] ?? 0);
    $estado_insumo = $it['estado_insumo'] ?? 'Pendiente';
    $estado_pago = $it['estado_pago'] ?? 'Pendiente';
    $comentario_solicitante = $it['comentario_solicitante'] ?? null;
    $archivo_adjunto = $it['archivo_adjunto'] ?? null;
    $incluye_igv = isset($it['incluye_igv']) ? intval($it['incluye_igv']) : 0;
    
    $stmt = $conn->prepare("
        UPDATE items SET 
            precio_unitario = ?, 
            total = ?, 
            proveedor = ?, 
            proveedor_id = ?, 
            centro_costo_id = ?, 
            requiere_cotizacion = ?, 
            es_insumo = ?, 
            estado_insumo = ?,
            estado_pago = ?,
            comentario_solicitante = ?,
            archivo_adjunto = ?,
            incluye_igv = ?
        WHERE id = ?
    ");
    
    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }
    
    // 🔥 CORREGIDO: 13 caracteres (d,d,s,i,i,i,i,s,s,s,s,i,i)
    $stmt->bind_param(
        "ddsiiiissssii",
        $precio,
        $total,
        $proveedor,
        $proveedor_id,
        $centro,
        $requiere,
        $insumo,
        $estado_insumo,
        $estado_pago,
        $comentario_solicitante,
        $archivo_adjunto,
        $incluye_igv,
        $id
    );
    
    if (!$stmt->execute()) {
        echo json_encode(["error" => $stmt->error]);
        exit();
    }
    
    echo json_encode(["success" => true]);
    exit();
}
}

# =========================
# 🔹 PATCH - CAMBIAR ESTADO DEL ITEM (administración)
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id']) || !isset($data['estado'])) {
        echo json_encode(["success" => false, "error" => "Datos incompletos"]);
        exit();
    }
    
    $id = intval($data['id']);
    $estado = $data['estado'];
    $motivo = $data['motivo'] ?? null;
    
    $stmt = $conn->prepare("
        UPDATE items 
        SET estado_administracion = ?, comentario_estado = ?
        WHERE id = ?
    ");
    
    if (!$stmt) {
        echo json_encode(["error" => $conn->error]);
        exit();
    }
    
    $stmt->bind_param("ssi", $estado, $motivo, $id);
    
    if (!$stmt->execute()) {
        echo json_encode(["error" => $stmt->error]);
        exit();
    }
    
    echo json_encode(["success" => true]);
    exit();
}

# =========================
# 🔹 DELETE - ELIMINAR ARCHIVO ADJUNTO DE UN ITEM
# =========================
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        echo json_encode(["success" => false, "error" => "ID no proporcionado"]);
        exit();
    }
    
    $id = intval($data['id']);
    
    // Obtener la ruta del archivo actual
    $stmt = $conn->prepare("SELECT archivo_adjunto FROM items WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $item = $result->fetch_assoc();
    
    if ($item && !empty($item['archivo_adjunto'])) {
        // Eliminar archivo físico
        $ruta_archivo = '../' . $item['archivo_adjunto'];
        if (file_exists($ruta_archivo)) {
            unlink($ruta_archivo);
        }
    }
    
    // Limpiar la columna archivo_adjunto en la BD
    $stmt = $conn->prepare("UPDATE items SET archivo_adjunto = NULL WHERE id = ?");
    $stmt->bind_param("i", $id);
    
    if (!$stmt->execute()) {
        echo json_encode(["error" => $stmt->error]);
        exit();
    }
    
    echo json_encode(["success" => true]);
    exit();
}

echo json_encode(["success" => false, "error" => "Método no permitido"]);
?>