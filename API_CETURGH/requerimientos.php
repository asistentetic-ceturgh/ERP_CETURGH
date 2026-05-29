<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =====================
// ERROR RESPONSE
// =====================
function errorResponse($conn, $msg = "Error en la operación") {
    echo json_encode([
        "error" => true,
        "message" => $msg,
        "mysql" => $conn->error
    ]);
    exit();
}

// =====================
// GET EMPRESAS
// =====================
if ($method === 'GET' && isset($_GET['empresas'])) {
    $res = $conn->query("SELECT id, nombre FROM empresas");
    if (!$res) errorResponse($conn, "Error al obtener empresas");

    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    exit();
}

// =====================
// GET SEDES
// =====================
if ($method === 'GET' && isset($_GET['sedes'])) {
    $empresa_id = (int)$_GET['empresa_id'];

    $res = $conn->query("SELECT id, nombre FROM sedes WHERE empresa_id = $empresa_id");
    if (!$res) errorResponse($conn, "Error al obtener sedes");

    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    exit();
}

// =====================
// GET CARRERAS
// =====================
if ($method === 'GET' && isset($_GET['carreras'])) {

    $empresa_id = isset($_GET['empresa_id'])
        ? (int)$_GET['empresa_id']
        : 0;

    $sede_id = isset($_GET['sede_id'])
        ? (int)$_GET['sede_id']
        : 0;

    $sql = "SELECT id, nombre
            FROM carreras
            WHERE estado='ACTIVO'";

    if ($empresa_id > 0) {
        $sql .= " AND empresa_id = $empresa_id";
    }

    if ($sede_id > 0) {
        $sql .= " AND sede_id = $sede_id";
    }

    $sql .= " ORDER BY nombre ASC";

    $res = $conn->query($sql);

    if (!$res) {
        errorResponse($conn, "Error obteniendo carreras");
    }

    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    exit();
}

// =====================
// AUTOCOMPLETE PROVEEDORES
// =====================
if ($method === 'GET' && isset($_GET['proveedores'])) {
    $q = $conn->real_escape_string($_GET['q'] ?? '');

    $sql = "SELECT id, nombre, ruc 
            FROM proveedores 
            WHERE nombre LIKE '%$q%' OR ruc LIKE '%$q%' 
            LIMIT 10";

    $res = $conn->query($sql);
    if (!$res) errorResponse($conn, "Error buscando proveedores");

    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    exit();
}

// =====================
// CENTROS DE COSTO
// =====================
if ($method === 'GET' && isset($_GET['centros'])) {
    $q = $conn->real_escape_string($_GET['q'] ?? '');
    $empresa_id = (int)($_GET['empresa_id'] ?? 0);
    $sede_id = (int)($_GET['sede_id'] ?? 0);

    $sql = "SELECT id, codigo, nombre 
            FROM centros_costos 
            WHERE codigo LIKE '%$q%'";

    if ($empresa_id > 0) {
        $sql .= " AND (empresa_id = $empresa_id OR empresa_id IS NULL)";
    }

    if ($sede_id > 0) {
        $sql .= " AND (sede_id = $sede_id OR sede_id IS NULL)";
    }

    $sql .= " LIMIT 10";

    $res = $conn->query($sql);
    if (!$res) errorResponse($conn, "Error buscando centros");

    echo json_encode($res->fetch_all(MYSQLI_ASSOC));
    exit();
}

// =====================
// GET REQUERIMIENTOS
// =====================
if ($method === 'GET' && !isset($_GET['empresas']) && !isset($_GET['sedes']) && !isset($_GET['carreras']) && !isset($_GET['proveedores']) && !isset($_GET['centros'])) {

    $sql = "SELECT 
        r.*,
        d.nombre as depto,
        e.nombre as empresa,
        s.nombre as sede,
        u.nombre AS creador_nombre,
        u.documento AS creador_dni,
        u.firma AS creador_firma,
        u.telefono AS creador_telefono
    FROM requerimientos r
    LEFT JOIN departamentos d ON r.departamento_id = d.id
    LEFT JOIN empresas e ON r.empresa_id = e.id
    LEFT JOIN sedes s ON r.sede_id = s.id
    LEFT JOIN usuarios u ON r.creador_id = u.id
    ORDER BY r.id DESC";

    $res = $conn->query($sql);
    if (!$res) errorResponse($conn, "Error al obtener requerimientos");

    $data = [];

    while ($row = $res->fetch_assoc()) {

        $itemsRes = $conn->query("
            SELECT 
                i.*,
                p.nombre as proveedor_nombre,
                p.ruc,
                cc.codigo,
                i.flujo_estado,
                i.estado_logistica,
                i.estado_administracion,
                i.estado_tesoreria,
                i.comentario_estado,
                i.comentario_solicitante,
                i.archivo_adjunto
            FROM items i
            LEFT JOIN proveedores p 
                ON i.proveedor_id = p.id
            LEFT JOIN centros_costos cc 
                ON i.centro_costo_id = cc.id
            WHERE i.requerimiento_id = {$row['id']}
        ");

        if (!$itemsRes) errorResponse($conn, "Error al obtener items");

        $prioridadFlujo = [
            'LOGISTICA' => 1,
            'ADMINISTRACION' => 2,
            'TESORERIA' => 3,
            'FINALIZADO' => 4
        ];

        $maxFlujo = 'LOGISTICA';
        $row['items'] = [];

        while ($it = $itemsRes->fetch_assoc()) {

            $flujoItem = $it['flujo_estado'] ?? 'LOGISTICA';

            if ($prioridadFlujo[$flujoItem] > $prioridadFlujo[$maxFlujo]) {
                $maxFlujo = $flujoItem;
            }
            
            $row['items'][] = [
                "id" => $it['id'],
                "descripcion" => $it['descripcion'],
                "cantidad" => (float)$it['cantidad'],
                "unidad" => $it['unidad'],
                "precio" => (float)($it['precio_unitario'] ?? 0),
                "total" => (float)($it['total'] ?? 0),
                "centroCosto" => $it['centro_costo_id'],
                "centroCodigo" => $it['codigo'] ?? null,
                "areaCosto" => $it['area_costo_id'],
                "requiereCotizacion" => (bool)$it['requiere_cotizacion'],
                "esInsumo" => (int)$it['es_insumo'],
                "estadoInsumo" => $it['estado_insumo'],
                "tipo" => $it['tipo'],
                "flujo_estado" => $it['flujo_estado'],
                "estado_logistica" => $it['estado_logistica'],
                "estado_administracion" => $it['estado_administracion'],
                "estado_tesoreria" => $it['estado_tesoreria'],
                "comentario_estado" => $it['comentario_estado'],
                "comentario_solicitante" => $it['comentario_solicitante'],
                "archivo_adjunto" => $it['archivo_adjunto'],
                "proveedor" => $it['proveedor_nombre']
                    ? $it['proveedor_nombre'] . " - " . $it['ruc']
                    : $it['proveedor'],
                "proveedor_id" => $it['proveedor_id']
            ];
        }

        $row['flujo_global'] = $maxFlujo;
        $row['creador'] = $row['creador_nombre']
            ? $row['creador_nombre'] . " - " . $row['creador_dni']
            : "Sin usuario";
        $row['firma_solicitante'] = $row['creador_firma']
            ? $row['creador_firma']
            : null;
        $row['telefono_solicitante'] = $row['creador_telefono']
            ? $row['creador_telefono']
            : null;

        $data[] = $row;
    }

    echo json_encode($data);
    exit();
}

// =====================
// POST - CREAR O ACTUALIZAR REQUERIMIENTO (UNIFICADO)
// =====================
if ($method === 'POST') {
    
    // Verificar si es multipart/form-data (subida de archivos)
    if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
        
        $dataJson = $_POST['data'] ?? null;
        if (!$dataJson) {
            errorResponse($conn, "Sin datos");
        }
        
        $input = json_decode($dataJson, true);
        if (!$input) errorResponse($conn, "JSON inválido");
        
        // Verificar si es edición (viene _method=PUT)
        $isEdit = isset($_POST['_method']) && $_POST['_method'] === 'PUT';
        
    } else {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) errorResponse($conn, "JSON inválido");
        $isEdit = isset($input['_method']) && $input['_method'] === 'PUT';
    }

    $departamento_id = (int)$input['departamento_id'];
    $empresa_id = (int)$input['empresa_id'];
    $sede_id = (int)$input['sede_id'];
    $prioridad = $conn->real_escape_string($input['prioridad'] ?? 'Media');
    $creador_id = (int)$input['creador_id'];
    $tipo = $conn->real_escape_string($input['tipo'] ?? 'Producto');
    $tipo_destino = $conn->real_escape_string($input['tipo_destino'] ?? 'GENERAL');
    $carrera_req_id = !empty($input['carrera_id']) ? (int)$input['carrera_id'] : "NULL";
    $curso_corto = !empty($input['curso_corto']) ? "'" . $conn->real_escape_string($input['curso_corto']) . "'" : "NULL";

    // Directorio para subir archivos
    $upload_dir = '../uploads/items/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    // ==========================================
    // CASO EDITAR (UPDATE)
    // ==========================================
    if ($isEdit && isset($input['id']) && $input['id']) {
        $id = (int)$input['id'];
        
        // Actualizar requerimiento
        $sql = "UPDATE requerimientos 
            SET prioridad='$prioridad', 
                tipo='$tipo',
                tipo_destino='$tipo_destino',
                carrera_id=$carrera_req_id,
                curso_corto=$curso_corto
            WHERE id=$id";
        
        if (!$conn->query($sql)) {
            errorResponse($conn, "Error al actualizar requerimiento: " . $conn->error);
        }

        $idsFrontend = [];

        foreach ($input['items'] as $idx => $it) {

            $item_id = isset($it['id']) ? (int)$it['id'] : 0;

            $desc = $conn->real_escape_string($it['descripcion'] ?? '');
            $cant = (float)($it['cantidad'] ?? 0);
            $unidad = $conn->real_escape_string($it['unidad'] ?? '');
            $precio = isset($it['precio']) ? (float)$it['precio'] : 0;
            $total = $cant * $precio;

            $centroCosto = !empty($it['centroCosto']) ? (int)$it['centroCosto'] : "NULL";
            $requiereCotizacion = !empty($it['requiereCotizacion']) ? 1 : 0;
            $esInsumo = !empty($it['esInsumo']) ? 1 : 0;
            $carrera_item_id = !empty($it['carrera_id']) ? (int)$it['carrera_id'] : "NULL";
            $proveedor = !empty($it['proveedor']) ? "'" . $conn->real_escape_string($it['proveedor']) . "'" : "NULL";
            $proveedor_id = isset($it['proveedor_id']) && $it['proveedor_id'] !== '' ? (int)$it['proveedor_id'] : "NULL";
            $comentario_solicitante = isset($it['comentario_solicitante']) && !empty($it['comentario_solicitante'])
                ? "'" . $conn->real_escape_string($it['comentario_solicitante']) . "'"
                : "NULL";
            
            // Procesar archivo subido
            $archivo_ruta = null;
            $fileKey = "archivo_$idx";
            if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES[$fileKey];
                $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
                
                if (in_array($extension, $extensiones_permitidas)) {
                    $nombre_archivo = uniqid() . '_' . $id . '_' . $idx . '_' . time() . '.' . $extension;
                    $ruta_completa = $upload_dir . $nombre_archivo;
                    
                    if (move_uploaded_file($file['tmp_name'], $ruta_completa)) {
                        $archivo_ruta = "'uploads/items/" . $nombre_archivo . "'";
                        
                        // Eliminar archivo anterior si existe
                        if ($item_id > 0) {
                            $result = $conn->query("SELECT archivo_adjunto FROM items WHERE id = $item_id");
                            if ($row = $result->fetch_assoc()) {
                                if (!empty($row['archivo_adjunto']) && file_exists('../' . $row['archivo_adjunto'])) {
                                    unlink('../' . $row['archivo_adjunto']);
                                }
                            }
                        }
                    }
                }
            } elseif ($item_id > 0 && isset($it['archivo_adjunto']) && !empty($it['archivo_adjunto'])) {
                $archivo_ruta = "'" . $conn->real_escape_string($it['archivo_adjunto']) . "'";
            }

            if ($item_id > 0) {
                $idsFrontend[] = $item_id;
                
                if ($archivo_ruta) {
                    $sqlItem = "UPDATE items SET
                            descripcion='$desc',
                            cantidad=$cant,
                            unidad='$unidad',
                            precio_unitario=$precio,
                            total=$total,
                            centro_costo_id=$centroCosto,
                            carrera_id=$carrera_item_id,
                            requiere_cotizacion=$requiereCotizacion,
                            proveedor=$proveedor,
                            proveedor_id=$proveedor_id,
                            es_insumo=$esInsumo,
                            comentario_solicitante=$comentario_solicitante,
                            archivo_adjunto=$archivo_ruta
                            WHERE id=$item_id AND requerimiento_id=$id";
                } else {
                    $sqlItem = "UPDATE items SET
                            descripcion='$desc',
                            cantidad=$cant,
                            unidad='$unidad',
                            precio_unitario=$precio,
                            total=$total,
                            centro_costo_id=$centroCosto,
                            carrera_id=$carrera_item_id,
                            requiere_cotizacion=$requiereCotizacion,
                            proveedor=$proveedor,
                            proveedor_id=$proveedor_id,
                            es_insumo=$esInsumo,
                            comentario_solicitante=$comentario_solicitante
                            WHERE id=$item_id AND requerimiento_id=$id";
                }
                
                if (!$conn->query($sqlItem)) {
                    errorResponse($conn, "Error actualizando item: " . $conn->error);
                }
            } else {
                $archivo_value = $archivo_ruta ? $archivo_ruta : "NULL";
                $sqlItem = "INSERT INTO items (
                    requerimiento_id, descripcion, cantidad, unidad, precio_unitario, total,
                    centro_costo_id, area_costo_id, carrera_id, requiere_cotizacion,
                    proveedor, proveedor_id, es_insumo, comentario_solicitante, archivo_adjunto
                ) VALUES (
                    $id, '$desc', $cant, '$unidad', $precio, $total,
                    $centroCosto, NULL, $carrera_item_id, $requiereCotizacion,
                    $proveedor, $proveedor_id, $esInsumo, $comentario_solicitante, $archivo_value
                )";
                
                if ($conn->query($sqlItem)) {
                    $idsFrontend[] = $conn->insert_id;
                } else {
                    errorResponse($conn, "Error insertando item: " . $conn->error);
                }
            }
        }

        // Eliminar items que ya no están
        if (count($idsFrontend) > 0) {
            $idsStr = implode(",", $idsFrontend);
            $conn->query("DELETE FROM items WHERE requerimiento_id = $id AND id NOT IN ($idsStr)");
        } else {
            $conn->query("DELETE FROM items WHERE requerimiento_id = $id");
        }

        echo json_encode(["success" => true, "item_ids" => $idsFrontend]);
        exit();
    }
    
    // ==========================================
    // CASO CREAR NUEVO (INSERT)
    // ==========================================
    $fecha = date("Y-m-d");
    $estado = "Sin firmar";

    $anio = date("Y");
    $tipo_corr = "RQ";

    $item_ids = [];

    $conn->begin_transaction();

    try {
        $stmtCorr = $conn->prepare("SELECT numero_actual FROM correlativos WHERE tipo = ? AND anio = ? FOR UPDATE");
        $stmtCorr->bind_param("si", $tipo_corr, $anio);
        $stmtCorr->execute();
        $resCorr = $stmtCorr->get_result();

        if ($resCorr->num_rows <= 0) {
            $numero_actual = 1;
            $stmtInsert = $conn->prepare("INSERT INTO correlativos (tipo, anio, numero_actual) VALUES (?, ?, ?)");
            $stmtInsert->bind_param("sii", $tipo_corr, $anio, $numero_actual);
            $stmtInsert->execute();
        } else {
            $rowCorr = $resCorr->fetch_assoc();
            $numero_actual = (int)$rowCorr['numero_actual'] + 1;
            $stmtUpdate = $conn->prepare("UPDATE correlativos SET numero_actual = ? WHERE tipo = ? AND anio = ?");
            $stmtUpdate->bind_param("isi", $numero_actual, $tipo_corr, $anio);
            $stmtUpdate->execute();
        }

        $codigo = "RQ-" . $anio . "-" . str_pad($numero_actual, 4, '0', STR_PAD_LEFT);

        $sql = "INSERT INTO requerimientos 
        (codigo, departamento_id, empresa_id, sede_id, prioridad, estado, fecha, creador_id, tipo, tipo_destino, carrera_id, curso_corto)
        VALUES ('$codigo', $departamento_id, $empresa_id, $sede_id, '$prioridad', '$estado', '$fecha', $creador_id, '$tipo', '$tipo_destino', $carrera_req_id, $curso_corto)";

        if (!$conn->query($sql)) {
            throw new Exception("Error al crear requerimiento: " . $conn->error);
        }

        $req_id = $conn->insert_id;

        foreach ($input['items'] as $idx => $it) {
            $desc = $conn->real_escape_string($it['descripcion']);
            $cant = (float)$it['cantidad'];
            $unidad = $conn->real_escape_string($it['unidad']);
            $precio = isset($it['precio']) ? (float)$it['precio'] : 0;
            $total = $cant * $precio;
            $centroCosto = !empty($it['centroCosto']) ? (int)$it['centroCosto'] : "NULL";
            $carrera_id = !empty($it['carrera_id']) ? (int)$it['carrera_id'] : "NULL";
            $requiereCotizacion = !empty($it['requiereCotizacion']) ? 1 : 0;
            $esInsumo = !empty($it['esInsumo']) ? 1 : 0;
            $proveedor = isset($it['proveedor']) ? "'" . $conn->real_escape_string($it['proveedor']) . "'" : "NULL";
            $proveedor_id = !empty($it['proveedor_id']) ? (int)$it['proveedor_id'] : "NULL";
            $comentario_solicitante = isset($it['comentario_solicitante']) && !empty($it['comentario_solicitante']) 
                ? "'" . $conn->real_escape_string($it['comentario_solicitante']) . "'" : "NULL";
            
            $sqlItem = "INSERT INTO items 
            (requerimiento_id, descripcion, cantidad, unidad, precio_unitario, total, 
             centro_costo_id, area_costo_id, carrera_id, requiere_cotizacion, 
             proveedor, proveedor_id, es_insumo, comentario_solicitante, archivo_adjunto)
            VALUES ($req_id, '$desc', $cant, '$unidad', $precio, $total, 
                    $centroCosto, NULL, $carrera_id, $requiereCotizacion, 
                    $proveedor, $proveedor_id, $esInsumo, $comentario_solicitante, NULL)";

            if ($conn->query($sqlItem)) {
                $item_ids[] = $conn->insert_id;
            } else {
                throw new Exception("Error al insertar item: " . $conn->error);
            }
        }

        $conn->commit();
        
        echo json_encode([
            "success" => true, 
            "id" => $req_id, 
            "codigo" => $codigo,
            "item_ids" => $item_ids
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        error_log("Error en POST requerimientos: " . $e->getMessage());
        errorResponse($conn, $e->getMessage());
    }
    exit();
}

// =====================
// PATCH (ACTUALIZAR ESTADO)
// =====================
if ($method === 'PATCH') {

    $input = json_decode(file_get_contents("php://input"), true);

    // ACTUALIZAR ITEM (insumo o estado administrativo)
    if (isset($input['item_id'])) {

        $item_id = (int)$input['item_id'];
        
        if (isset($input['estado_insumo'])) {
            $estado_insumo = $conn->real_escape_string($input['estado_insumo']);
            $motivo = isset($input['motivo'])
                ? "'" . $conn->real_escape_string($input['motivo']) . "'"
                : "NULL";

            $sql = "UPDATE items 
                    SET estado_insumo='$estado_insumo',
                        motivo_insumo=$motivo
                    WHERE id=$item_id";
        } elseif (isset($input['estado_administracion'])) {
            $estado_admin = $conn->real_escape_string($input['estado_administracion']);
            $comentario = isset($input['comentario_estado'])
                ? "'" . $conn->real_escape_string($input['comentario_estado']) . "'"
                : "NULL";

            $sql = "UPDATE items 
                    SET estado_administracion='$estado_admin',
                        comentario_estado=$comentario
                    WHERE id=$item_id";
        } else {
            errorResponse($conn, "Estado no especificado");
        }

        if (!$conn->query($sql)) {
            errorResponse($conn, "Error actualizando item");
        }

        echo json_encode(["success" => true]);
        exit();
    }

    // ACTUALIZAR REQUERIMIENTO
    $id = (int)$input['id'];
    $estado = $conn->real_escape_string($input['estado']);

    $observaciones = isset($input['comentarios'])
        ? "'" . $conn->real_escape_string($input['comentarios']) . "'"
        : "NULL";

    $sql = "UPDATE requerimientos SET estado='$estado'";

    if ($observaciones !== "NULL") {
        $sql .= ", comentarios=$observaciones";
    }

    $sql .= " WHERE id=$id";

    if (!$conn->query($sql)) {
        errorResponse($conn, "Error al actualizar estado");
    }

    echo json_encode(["success" => true]);
    exit();
}

echo json_encode(["success" => false, "error" => "Método no permitido"]);
?>