<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// Middleware untuk memvalidasi tipe konten
function checkJsonMiddleware(): void {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'POST') {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'application/json') === false) {
            http_response_code(415); 
            echo json_encode(['error' => 'Header Content-Type harus application/json']);
            exit;
        }
    }
}

checkJsonMiddleware();

$method = $_SERVER['REQUEST_METHOD'];

// Skenario 1: Method GET (Data Array Sementara)
if ($method === 'GET') {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            ['id' => 'K001', 'nama' => 'Suar', 'musisi' => 'Moeremans'],
            ['id' => 'K002', 'nama' => 'Vas Bunga', 'musisi' => 'Lomba Sihir']
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Skenario 2: Method POST (Input JSON)
if ($method === 'POST') {
    try {
        $payload = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $e) {
        http_response_code(400); // Skenario JSON Rusak
        echo json_encode(['error' => 'Format JSON tidak valid']);
        exit;
    }

    if (!is_array($payload)) {
        http_response_code(400);
        echo json_encode(['error' => 'Body JSON harus berupa object']);
        exit;
    }

    $nama = trim((string) ($payload['nama'] ?? ''));
    $musisi = trim((string) ($payload['musisi'] ?? ''));

    // Latihan E.2: Validasi panjang karakter dan kelengkapan data (Aturan Bisnis)
    if ($nama === '' || $musisi === '' || strlen($nama) > 100) {
        http_response_code(422); 
        echo json_encode(['error' => 'Data tidak valid. Nama wajib diisi dan maksimal 100 karakter.']);
        exit;
    }

    // Skenario JSON Valid
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Data diterima',
        'data' => compact('nama', 'musisi')
    ]);
    exit;
}

// Latihan E.3: Fallback untuk metode lain (DELETE, PUT, dll)
header('Allow: GET, POST');
http_response_code(405);
echo json_encode(['error' => "Method $method tidak diizinkan di endpoint ini"]);
exit;