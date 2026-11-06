<?php

require 'vendor/autoload.php';

use App\Config\Env;
use App\Database\Connection;
use App\Repositories\MySQLBookRepository;
use App\Services\BookService;

// Load file konfigurasi .env
Env::load(__DIR__ . '/.env');

// Inisialisasi koneksi dan dependency injection
$pdo = Connection::get();
$service = new BookService(new MySQLBookRepository($pdo));

// Test 1: Mengambil daftar buku
echo "Daftar buku: " . count($service->list()) . PHP_EOL;

// Test 2: Pengujian validasi (harus melemparkan error karena judul kosong)
try {
    $service->create(['judul' => '']);
} catch (Exception $e) {
    echo "✅ Validasi berjalan: " . $e->getMessage() . PHP_EOL;
}

// Test 3: Menambah buku baru yang valid
$new = $service->create([
    'judul'   => 'Pulang',
    'penulis' => 'Leila S. Chudori',
    'tahun'   => 2012,
    'stok'    => 4,
]);

echo "✅ Buku dibuat: {$new['judul']} (ID: {$new['id']})" . PHP_EOL;