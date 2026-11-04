<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

try {
    $pdo = db();

    switch ($method) {
        case 'GET':
            if ($id) {
                // Read Detail (GET by ID) - Mengembalikan 404 jika tidak ada
                $stmt = $pdo->prepare('SELECT id, judul, nama_musisi, kategori_id FROM karya WHERE id = :id');
                $stmt->execute(['id' => $id]);
                $data = $stmt->fetch();
                if (!$data) {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'error' => 'Data karya tidak ditemukan']);
                    exit;
                }
                echo json_encode(['success' => true, 'data' => $data]);
            } else {
                // Read Collection dengan Filter Kategori
                $kategori_id = filter_input(INPUT_GET, 'kategori_id', FILTER_VALIDATE_INT);
                if ($kategori_id) {
                    $stmt = $pdo->prepare('SELECT id, judul, nama_musisi FROM karya WHERE kategori_id = :cat ORDER BY id DESC');
                    $stmt->execute(['cat' => $kategori_id]);
                } else {
                    $stmt = $pdo->query('SELECT id, judul, nama_musisi FROM karya ORDER BY id DESC');
                }
                echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            }
            break;

        case 'POST':
            // Create dengan Validasi
            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $judul = trim((string)($input['judul'] ?? ''));
            $nama_musisi = trim((string)($input['nama_musisi'] ?? ''));
            $kategori_id = filter_var($input['kategori_id'] ?? null, FILTER_VALIDATE_INT);
            $user_id = filter_var($input['user_id'] ?? null, FILTER_VALIDATE_INT);

            if ($judul === '' || $nama_musisi === '' || !$kategori_id || !$user_id) {
                http_response_code(422);
                echo json_encode(['success' => false, 'error' => 'Validasi gagal: Data tidak lengkap']);
                exit;
            }

            $stmt = $pdo->prepare('INSERT INTO karya (user_id, kategori_id, judul, nama_musisi) VALUES (:uid, :kid, :jdl, :nms)');
            $stmt->execute(['uid' => $user_id, 'kid' => $kategori_id, 'jdl' => $judul, 'nms' => $nama_musisi]);
            
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Karya berhasil ditambahkan', 'id' => $pdo->lastInsertId()]);
            break;

        case 'PUT':
        case 'PATCH':
            // Update dengan Pengecekan Eksistensi
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'ID wajib disertakan']);
                exit;
            }
            
            $cek = $pdo->prepare('SELECT id FROM karya WHERE id = :id');
            $cek->execute(['id' => $id]);
            if (!$cek->fetch()) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Data tidak ditemukan']);
                exit;
            }

            $input = json_decode(file_get_contents('php://input'), true) ?? [];
            $judul = trim((string)($input['judul'] ?? ''));
            
            if ($judul === '') {
                http_response_code(422);
                echo json_encode(['success' => false, 'error' => 'Judul tidak boleh kosong']);
                exit;
            }

            $stmt = $pdo->prepare('UPDATE karya SET judul = :jdl WHERE id = :id');
            $stmt->execute(['jdl' => $judul, 'id' => $id]);
            
            echo json_encode(['success' => true, 'message' => 'Data berhasil diperbarui']);
            break;

        case 'DELETE':
            // Delete (Hapus)
            if (!$id) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'ID wajib disertakan']);
                exit;
            }
            
            $cek = $pdo->prepare('SELECT id FROM karya WHERE id = :id');
            $cek->execute(['id' => $id]);
            if (!$cek->fetch()) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Data tidak ditemukan']);
                exit;
            }

            $stmt = $pdo->prepare('DELETE FROM karya WHERE id = :id');
            $stmt->execute(['id' => $id]);
            
            http_response_code(204); // Berhasil dihapus tanpa konten balasan
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'error' => 'Method not allowed']);
            break;
    }

} catch (Throwable $e) {
    error_log((string)$e);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Terjadi kesalahan pada server']);
}