<?php

namespace App\Services;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use InvalidArgumentException;
use PDOException;

class CategoryService
{
    public function __construct(private CategoryRepositoryInterface $repo) {}

    public function list(): array
    {
        return array_map(
            fn(Category $c) => $c->toArray(),
            $this->repo->findAll()
        );
    }

    public function detail(int $id): array
    {
        $category = $this->repo->findById($id);
        if ($category === null) {
            throw new InvalidArgumentException("Kategori dengan ID $id tidak ditemukan", 404);
        }
        return $category->toArray();
    }

    public function create(array $data): array
    {
        $this->validate($data);
        $category = new Category(
            null,
            trim($data['nama']),
            $data['deskripsi'] ?? ''
        );
        $id = $this->guardDuplicate(fn() => $this->repo->save($category));
        return $this->detail($id);
    }

    public function update(int $id, array $data): array
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException("Kategori dengan ID $id tidak ditemukan", 404);
        }
        $this->validate($data);
        $category = new Category(
            $id,
            trim($data['nama']),
            $data['deskripsi'] ?? ''
        );
        $this->guardDuplicate(fn() => $this->repo->update($category));
        return $this->detail($id);
    }

    public function delete(int $id): void
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException("Kategori dengan ID $id tidak ditemukan", 404);
        }
        $this->repo->delete($id);
    }

    private function validate(array $data): void
    {
        if (!isset($data['nama']) || !is_string($data['nama']) || trim($data['nama']) === '') {
            throw new InvalidArgumentException('Nama kategori wajib diisi', 422);
        }
        if (mb_strlen(trim($data['nama'])) > 100) {
            throw new InvalidArgumentException('Nama maksimal 100 karakter', 422);
        }
        if (isset($data['deskripsi']) && !is_string($data['deskripsi'])) {
            throw new InvalidArgumentException('Deskripsi harus berupa teks', 422);
        }
    }

    /** Jalankan operasi simpan; nama kategori duplikat (UNIQUE) -> 409. */
    private function guardDuplicate(callable $fn): mixed
    {
        try {
            return $fn();
        } catch (PDOException $e) {
            if ((string) $e->getCode() === '23000') {
                throw new InvalidArgumentException('Nama kategori sudah digunakan', 409);
            }
            throw $e;
        }
    }
}
