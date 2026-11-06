<?php

require 'vendor/autoload.php';

use App\Core\Router;
use App\Core\Request;

// Simulasi URI dan Method HTTP untuk pengujian
$_SERVER['REQUEST_URI'] = '/api/hello';
$_SERVER['REQUEST_METHOD'] = 'GET';

$router = new Router();

// Mendaftarkan route GET
$router->get('/api/hello', function() {
    echo "✅ Router bekerja! Endpoint /api/hello terpanggil." . PHP_EOL;
});

// Menjalankan dispatch request
$router->dispatch(new Request());