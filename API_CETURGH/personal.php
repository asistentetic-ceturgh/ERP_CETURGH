<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db.php";

function responder($success, $message = '', $data = null){
    echo json_encode([
        "success"=>$success,
        "message"=>$message,
        "data"=>$data
    ]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {

switch($method){

// ============================
// GET
// ============================
case 'GET':

    $tipo = $_GET['tipo'] ?? '';

    if($tipo === 'empresas'){
        $res = $conn->query("SELECT * FROM empresas");
        responder(true,'',$res->fetch_all(MYSQLI_ASSOC));
    }

    if($tipo === 'sedes'){
        $res = $conn->query("SELECT * FROM sedes");
        responder(true,'',$res->fetch_all(MYSQLI_ASSOC));
    }

    if($tipo === 'programas'){
        $res = $conn->query("SELECT * FROM programas");
        responder(true,'',$res->fetch_all(MYSQLI_ASSOC));
    }

    if($tipo === 'trabajadores'){
        $res = $conn->query("
            SELECT t.*, e.nombre as empresa, s.nombre as sede
            FROM trabajadores t
            LEFT JOIN empresas e ON t.empresa_id = e.id
            LEFT JOIN sedes s ON t.sede_id = s.id
            WHERE t.estado='Activo'
            ORDER BY t.id DESC
        ");
        responder(true,'',$res->fetch_all(MYSQLI_ASSOC));
    }

    if($tipo === 'docentes'){

        $where = "";

        if(!empty($_GET['programa_id'])){
            $programa_id = intval($_GET['programa_id']);
            $where = "WHERE pd.programa_id = $programa_id";
        }

        $sql = "
            SELECT 
                pd.*,
                t.nombre AS docente,
                e.nombre AS empresa,
                s.nombre AS sede,
                pr.nombre AS programa
            FROM planilla_docente pd
            LEFT JOIN trabajadores t ON pd.trabajador_id = t.id
            LEFT JOIN empresas e ON pd.empresa_id = e.id
            LEFT JOIN sedes s ON pd.sede_id = s.id
            LEFT JOIN programas pr ON pd.programa_id = pr.id
            $where
            ORDER BY pd.id DESC
        ";

        $res = $conn->query($sql);
        responder(true,'',$res->fetch_all(MYSQLI_ASSOC));
    }

    // PAGOS (default GET)
    $res = $conn->query("
        SELECT 
            p.*, 
            t.nombre as trabajador,
            t.cargo,
            t.tipoContrato,
            e.nombre as empresa
        FROM pagos p
        JOIN trabajadores t ON p.trabajador_id = t.id
        LEFT JOIN empresas e ON t.empresa_id = e.id
        ORDER BY p.id DESC
    ");

    responder(true,'',$res->fetch_all(MYSQLI_ASSOC));

break;


// ============================
// POST
// ============================
case 'POST':

$data = json_decode(file_get_contents("php://input"), true);
if(!$data) responder(false,"Datos inválidos");

$tipo = $_GET['tipo'] ?? '';

// =====================
// DOCENTE
// =====================
if ($tipo === 'docente') {

    if(
        empty($data['trabajador_id']) ||
        empty($data['empresa_id']) ||
        empty($data['sede_id']) ||
        empty($data['programa_id'])
    ){
        responder(false,"Faltan campos obligatorios");
    }

    $descuento = floatval($data['desc'] ?? 0);
    $horas = floatval($data['horas']);
    $costo = floatval($data['costo']);
    $total = ($horas * $costo) - $descuento;

    $sql = "INSERT INTO planilla_docente (
        trabajador_id, empresa_id, sede_id, programa_id,
        unidad, curso, grupo, semestre,
        horas, costo, descuento, observacion, total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "iiiissssdddss",
        $data['trabajador_id'],
        $data['empresa_id'],
        $data['sede_id'],
        $data['programa_id'],
        $data['unidad'],
        $data['curso'],
        $data['grupo'],
        $data['semestre'],
        $horas,
        $costo,
        $descuento,
        $data['observacion'],
        $total
    );

    if(!$stmt->execute()){
        responder(false,$stmt->error);
    }

    responder(true,"Docente registrado");
}


// =====================
// TRABAJADORES
// =====================
if(isset($data['accion'])){

    if($data['accion'] === 'create'){
        $stmt = $conn->prepare("
INSERT INTO trabajadores 
(nombre,cargo,tipoContrato,empresa_id,sede_id,tipo_personal,numero_cuenta,cci,tipo_documento,numero_documento,estado)
VALUES (?,?,?,?,?,?,?,?,?,?, 'Activo')
");

$stmt->bind_param(
    "sssissssss",
    $data['nombre'],
    $data['cargo'],
    $data['tipoContrato'],
    $data['empresa_id'],
    $data['sede_id'],
    $data['tipo_personal'],
    $data['numero_cuenta'],
    $data['cci'],
    $data['tipo_documento'],
    $data['numero_documento']
);

        if(!$stmt->execute()) responder(false,$stmt->error);
        responder(true,"Trabajador creado");
    }

    if($data['accion'] === 'update'){
        $stmt = $conn->prepare("
UPDATE trabajadores SET 
nombre=?,cargo=?,tipoContrato=?,empresa_id=?,sede_id=?,tipo_personal=?,numero_cuenta=?,cci=?,tipo_documento=?,numero_documento=?
WHERE id=?
");

$stmt->bind_param(
    "sssissssssi",
    $data['nombre'],
    $data['cargo'],
    $data['tipoContrato'],
    $data['empresa_id'],
    $data['sede_id'],
    $data['tipo_personal'],
    $data['numero_cuenta'],
    $data['cci'],
    $data['tipo_documento'],
    $data['numero_documento'],
    $data['id']
);

        if(!$stmt->execute()) responder(false,$stmt->error);
        responder(true,"Actualizado");
    }
}


// =====================
// PAGOS
// =====================
if ($tipo === 'pago') {

    if(empty($data['trabajador_id'])){
        responder(false,"Falta trabajador_id");
    }

    $stmtTipo = $conn->prepare("SELECT tipoContrato FROM trabajadores WHERE id=?");
    $stmtTipo->bind_param("i",$data['trabajador_id']);
    $stmtTipo->execute();
    $tipoContrato = $stmtTipo->get_result()->fetch_assoc()['tipoContrato'];

    $sueldo = floatval($data['sueldoBase']);
    $bonos  = floatval($data['bonos']);
    $otros  = floatval($data['otrosDescuentos']);

    $descLey = $tipoContrato === 'Planilla' ? $sueldo * 0.13 : 0;
    $neto = ($sueldo + $bonos) - ($descLey + $otros);

    $stmt = $conn->prepare("
        INSERT INTO pagos 
        (trabajador_id,sueldoBase,bonos,descuentosLey,otrosDescuentos,neto,estado,fecha,metodo)
        VALUES (?,?,?,?,?,?,?,NOW(),?)
    ");

    $estado = "Pagado";

    $stmt->bind_param(
        "idddddss",
        $data['trabajador_id'],
        $sueldo,
        $bonos,
        $descLey,
        $otros,
        $neto,
        $estado,
        $data['metodo']
    );

    if(!$stmt->execute()) responder(false,$stmt->error);

    responder(true,"Pago registrado");
}

responder(false,"Tipo no válido");

break;


// ============================
// DELETE
// ============================
case 'DELETE':

$data = json_decode(file_get_contents("php://input"), true);
$tipo = $_GET['tipo'] ?? '';

if($tipo === 'docente'){
    $stmt=$conn->prepare("DELETE FROM planilla_docente WHERE id=?");
    $stmt->bind_param("i",$data['id']);
    $stmt->execute();
    responder(true,"Docente eliminado");
}

if($tipo === 'trabajadores'){
    $stmt=$conn->prepare("UPDATE trabajadores SET estado='Inactivo' WHERE id=?");
    $stmt->bind_param("i",$data['id']);
    $stmt->execute();
    responder(true,"Trabajador desactivado");
}

// pagos
$stmt=$conn->prepare("DELETE FROM pagos WHERE id=?");
$stmt->bind_param("i",$data['id']);
$stmt->execute();

responder(true,"Pago eliminado");

break;

default:
    responder(false,"Método no soportado");

}

} catch(Exception $e){
    responder(false,$e->getMessage());
}