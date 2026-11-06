<?php

// =========================================================================
// CORS HEADER (TAMBAHAN LANGKAH 16)
// =========================================================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config\Env;
use App\Database\Connection;
use App\Core\Container;
use App\Core\Router;
use App\Core\Request;

use App\Contracts\BookRepositoryInterface;
use App\Repositories\MySQLBookRepository;
use App\Services\BookService;
use App\Controllers\BookController;

use App\Contracts\CategoryRepositoryInterface;
use App\Repositories\MySQLCategoryRepository;
use App\Services\CategoryService;
use App\Controllers\CategoryController;

// 1. Load environment variables (.env)
Env::load(__DIR__ . '/../.env');

// 2. Koneksi ke Database (PDO)
$pdo = Connection::get();

// 3. Inisialisasi Container untuk Dependency Injection
$container = new Container();

// =========================================================================
// BINDING DEPENDENCY - BOOK
// =========================================================================
$container->bind(BookRepositoryInterface::class, function() use ($pdo) {
    return new MySQLBookRepository($pdo);
});

$container->bind(BookService::class, function($c) {
    return new BookService($c->make(BookRepositoryInterface::class));
});

$container->bind(BookController::class, function($c) {
    return new BookController($c->make(BookService::class));
});

// =========================================================================
// BINDING DEPENDENCY - CATEGORY
// =========================================================================
$container->bind(CategoryRepositoryInterface::class, function() use ($pdo) {
    return new MySQLCategoryRepository($pdo);
});

$container->bind(CategoryService::class, function($c) {
    return new CategoryService($c->make(CategoryRepositoryInterface::class));
});

$container->bind(CategoryController::class, function($c) {
    return new CategoryController($c->make(CategoryService::class));
});

// 4. Inisialisasi Router
$router = new Router();

// =========================================================================
// ROUTES - BOOK
// =========================================================================
$router->get('/api/books', [$container->make(BookController::class), 'index']);
$router->get('/api/books/{id}', [$container->make(BookController::class), 'show']);
$router->post('/api/books', [$container->make(BookController::class), 'store']);
$router->put('/api/books/{id}', [$container->make(BookController::class), 'update']);
$router->delete('/api/books/{id}', [$container->make(BookController::class), 'destroy']);

// =========================================================================
// ROUTES - CATEGORY
// =========================================================================
$router->get('/api/categories', [$container->make(CategoryController::class), 'index']);
$router->get('/api/categories/{id}', [$container->make(CategoryController::class), 'show']);
$router->post('/api/categories', [$container->make(CategoryController::class), 'store']);
$router->put('/api/categories/{id}', [$container->make(CategoryController::class), 'update']);
$router->delete('/api/categories/{id}', [$container->make(CategoryController::class), 'destroy']);

// 5. Jalankan Request
$router->dispatch(new Request());