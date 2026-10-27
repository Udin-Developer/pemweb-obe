<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
http_response_code(200);

echo json_encode([
    'status' => 'ok',
    'message' => 'API SKENA berjalan dengan baik',
    'time' => date(DATE_ATOM)
]);
exit;