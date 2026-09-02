# Praktikum Pemrograman Web (OBE) - Modul 01

Dokumentasi repository ini disusun untuk Modul 01 Orientasi OBE

# Indetitas Mahasiswa
1. Nama : Reza Randika Putra
2. NPM  : 2440304016

# Deskripsi Singkat Proyek
Proyek ini merupakan tahap awal implementasi pembuatan dokumen HTML, pengaturan web server menggunakan laragon, serta pecatatan request network web

# Teknologi & Lingkungan Pengembangan
- HTMl5
- PHP : PHP 8.4
- Version Control : Git & GitHub
- Web Server : Apache (via Laragon 5)

# Panduan Menjalankan Proyek
1. Pastikan Laragon Terpasang dan service Apache aktif
2. Path direktori pada 'C:\Laragon\www\pemweb-obe'
3. Buka browser dan akses localhost

URL
- URL: [httpp://localhost/pemweb-obe/]


 # Tugas OBE

| No. | Nama Requset | Method | Status | Type |
| :--- | :--- | :--- | :--- | :--- |
| 1. | www.bpjs-kesehatan.go.id | GET | 200 | document |
| 2. | jquery.js | GET | 200 | script |
| 3. | main.2d9811335dac0a91.js | GET | 200 | script |
| 4. | id.json | GET | 200 | xhr |
| 5. | id.json | GET | 200 | svg+xml |

# Modul 2

| Indikator | Status | Keterangan Verifikasi |
| :--- | :---: | :--- |
| Deklarasi Bahasa (`lang="id"`) | Terpenuhi | Terpasang pada tag pembuka `<html>` untuk parser screen reader. |
| Hierarki Heading | Terpenuhi | Memiliki 1 `<h1>`, 3 `<h2>` untuk tiap section, dan `<h3>` untuk article. Tidak ada heading yang melompat tingkat. |
| Atribut Alt Gambar | Terpenuhi | Gambar informatif menyertakan deskripsi kontekstual; gambar dekoratif menggunakan `alt=""`. |
| Label Form | Terpenuhi | Seluruh elemen `<input>`, `<select>`, dan `<textarea>` terhubung secara eksplisit via `for` dan `id`. |
| Navigasi Keyboard | Terpenuhi | Tab index mengikuti aliran visual dokumen alami tanpa keyboard trap; dilengkapi skip link ke `#konten-utama`. |
