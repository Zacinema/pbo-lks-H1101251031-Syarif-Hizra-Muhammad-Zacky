<?php

namespace App\Services;

use App\Contracts\BookRepositoryInterface;
use App\Models\Book;
use InvalidArgumentException;

class BookService
{
    public function __construct(private BookRepositoryInterface $repo) {}

    /** @return array[] */
    public function list(): array
    {
        return array_map(
            fn(Book $b) => $b->toArray(),
            $this->repo->findAll()
        );
    }

    public function detail(int $id): array
    {
        $book = $this->repo->findById($id);
        if ($book === null) {
            throw new InvalidArgumentException("Buku dengan ID $id tidak ditemukan", 404);
        }
        return $book->toArray();
    }

    public function create(array $data): array
    {
        $this->validate($data);
        $book = new Book(
            null,
            trim($data['judul']),
            trim($data['penulis']),
            (int) $data['tahun'],
            (int) $data['stok']
        );
        $id = $this->repo->save($book);
        return $this->detail($id);
    }

    public function update(int $id, array $data): array
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException("Buku dengan ID $id tidak ditemukan", 404);
        }
        $this->validate($data);
        $book = new Book(
            $id,
            trim($data['judul']),
            trim($data['penulis']),
            (int) $data['tahun'],
            (int) $data['stok']
        );
        $this->repo->update($book);
        return $this->detail($id);
    }

    public function delete(int $id): void
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException("Buku dengan ID $id tidak ditemukan", 404);
        }
        $this->repo->delete($id);
    }

    private function validate(array $data): void
    {
        foreach (['judul' => 'Judul', 'penulis' => 'Penulis'] as $field => $label) {
            if (!isset($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === '') {
                throw new InvalidArgumentException("$label wajib diisi", 422);
            }
            if (mb_strlen(trim($data[$field])) > 255) {
                throw new InvalidArgumentException("$label maksimal 255 karakter", 422);
            }
        }
        $maxTahun = (int) date('Y') + 1;
        $tahun = filter_var($data['tahun'] ?? null, FILTER_VALIDATE_INT);
        if ($tahun === false || $tahun < 1000 || $tahun > $maxTahun) {
            throw new InvalidArgumentException("Tahun harus berupa angka antara 1000 dan $maxTahun", 422);
        }
        $stok = filter_var($data['stok'] ?? null, FILTER_VALIDATE_INT);
        if ($stok === false || $stok < 0) {
            throw new InvalidArgumentException('Stok harus berupa angka bulat >= 0', 422);
        }
    }
}
