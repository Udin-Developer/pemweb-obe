<?php
// File: api/katalog.php
declare(strict_types=1);
require_once dirname(__DIR__) . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');

$kategori_id = filter_input(INPUT_GET, 'kategori_id', FILTER_VALIDATE_INT);
$pdo = db();

if ($kategori_id) {
    $stmt = $pdo->prepare('SELECT id, judul, nama_musisi FROM karya WHERE kategori_id = :kategori_id ORDER BY id DESC');
    $stmt->execute(['kategori_id' => $kategori_id]);
} else {
    $stmt = $pdo->query('SELECT id, judul, nama_musisi FROM karya ORDER BY id DESC');
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'data' => $stmt->fetchAll()
]);
exit;