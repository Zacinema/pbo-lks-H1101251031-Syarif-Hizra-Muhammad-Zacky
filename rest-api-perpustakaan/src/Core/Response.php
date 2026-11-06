<?php

namespace App\Core;

class Response
{
    public static function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(
            $data,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
        );
        exit;
    }

    public static function success(mixed $data, string $message = 'OK', int $status = 200): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public static function error(string $message, int $status = 400): void
    {
        self::json([
            'success' => false,
            'message' => $message,
        ], $status);
    }

    /**
     * Error 500: pesan asli hanya ditampilkan saat APP_DEBUG=true,
     * selain itu pesan generik (agar detail SQL/internal tidak bocor).
     */
    public static function serverError(\Throwable $e): void
    {
        $debug = filter_var(\App\Config\Env::get('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOLEAN);
        error_log($e->getMessage());
        self::error($debug ? $e->getMessage() : 'Terjadi kesalahan pada server', 500);
    }
}
