<?php

require 'vendor/autoload.php';

use App\Config\Env;
use App\Database\Connection;

Env::load(__DIR__ . '/.env'); // <-- Perhatikan penggunaan __DIR__ (dua underscore)
$pdo = Connection::get();
echo "✅ Koneksi database berhasil!" . PHP_EOL;
echo "Versi MySQL: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);