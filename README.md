# PBO LKS — Portofolio Praktikum

-	Nama :	Syarif Hizra Muhammad Zacky
-	NIM :	H1101251031
-	Kelas:	A

## Daftar Pertemuan
-	[ ] Pertemuan 1 — Setup & Database
-	[ ] Pertemuan 2 — Core OOP
-	[ ] Pertemuan 3 — Framework & Routing
-	[ ] Pertemuan 4 — Testing Backend
-	[ ] Pertemuan 5 — CRUD Kategori
-	[ ] Pertemuan 6 — Frontend
-	[ ] Pertemuan 7 — Integrasi & Finalisasi

## Menjalankan
```
cd rest-api-perpustakaan
cp .env.example .env      # sesuaikan DB_*
composer install
mysql -u root -p perpustakaan < database/schema.sql
php -S localhost:8000 -t public
```
Frontend: buka `frontend-perpustakaan/index.html` (atau `php -S localhost:5500` di foldernya).
