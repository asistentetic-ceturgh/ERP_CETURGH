<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$upload_dir = __DIR__ . '/uploads/items/';

if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'Error al subir archivo']);
        exit;
    }
    
    $item_id = $_POST['item_id'] ?? null;
    $file = $_FILES['archivo'];
    
    if (!$item_id) {
        echo json_encode(['error' => 'No se especificó item_id']);
        exit;
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $nombre_archivo = uniqid() . '_' . $item_id . '_' . time() . '.' . $extension;
    $ruta_completa = $upload_dir . $nombre_archivo;
    
    if (move_uploaded_file($file['tmp_name'], $ruta_completa)) {
        $ruta_db = 'uploads/items/' . $nombre_archivo;
        
        $conn = getDBConnection();
        
        $stmt = $conn->prepare("UPDATE items SET archivo_adjunto = ? WHERE id = ?");
        $stmt->bind_param("si", $ruta_db, $item_id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'ruta' => $ruta_db]);
        } else {
            echo json_encode(['error' => 'Error al actualizar BD: ' . $stmt->error]);
        }
        
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error al guardar archivo']);
    }
} else {
    echo json_encode(['error' => 'Método no permitido']);
}
?>