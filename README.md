# 🐾 Pokedex

Pokedex adalah aplikasi web interaktif yang dibuat untuk menampilkan, mencari, melihat detail, menangkap, mengelola koleksi, serta melihat riwayat aktivitas Pokémon.

Project ini dibuat sebagai project tim dalam kegiatan PKL dengan pembagian tugas **Frontend, Backend, dan UI/UX**.

Aplikasi menggunakan **Next.js** untuk frontend, **Laravel** sebagai backend REST API, dan **MySQL** sebagai database. Data Pokémon diperoleh dari **PokéAPI** melalui backend, sehingga frontend tidak mengakses PokéAPI secara langsung.

---

## 👥 Team

|             Nama              | Bagian   |
| ----------------------------- | -------- |
| **Rahma Santika Al Anshori**  | Backend  |
| **Jibril Ibni Jubair**        | Frontend |
| **Jihan Fauziah**             | UI/UX    |

---

## 🎯 Goal

Meningkatkan kemampuan peserta PKL dalam membangun aplikasi frontend interaktif melalui pembuatan Pokedex yang menggunakan API, fitur pencarian, detail data, koleksi Pokémon, fitur Catch dan Release, riwayat aktivitas, serta deployment aplikasi.

---

## 🛠️ Teknologi yang Digunakan

### Frontend

* **Next.js**
* **JavaScript**
* **Tailwind CSS**
* **ESLint**

### Backend

* **Laravel**
* **PHP**
* **REST API**

### Database

* **MySQL**

### External API

* **PokéAPI**

### Tools

* **Git**
* **GitHub**
* **Visual Studio Code**

---

## 🔗 Arsitektur Project

Project menggunakan arsitektur frontend dan backend yang terpisah.

```text
┌─────────────────────────────┐
│          FRONTEND           │
│           Next.js           │
│          JavaScript         │
│         Tailwind CSS        │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│           BACKEND           │
│           Laravel           │
│             PHP             │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│    MySQL     │  │   PokéAPI    │
│   Database   │  │ External API │
└──────────────┘  └──────────────┘
```

### Alur Data Pokémon

```text
User
 │
 ▼
Next.js Frontend
 │
 │ Request
 ▼
Laravel REST API
 │
 ├──────────────► PokéAPI
 │                    │
 │                    ▼
 │               Data Pokémon
 │
 └──────────────► MySQL
                      │
                      ▼
                 Data Koleksi
                 & Riwayat
```

Frontend **tidak mengambil data langsung dari PokéAPI**. Request data Pokémon dilakukan melalui backend Laravel.

---

## 📁 Struktur Project

```text
pokedex/
│
├── backend/              # Backend Laravel + REST API
│
├── frontend/             # Frontend Next.js
│
├── design/               # Referensi dan rancangan UI/UX
│   └── referensi design/
│
├── .gitignore
└── README.md
```

---

# ✨ Fitur Project

## 1. 📋 Daftar Pokémon

Pengguna dapat melihat daftar Pokémon yang tersedia di aplikasi.

Fitur ini meliputi:

* Menampilkan daftar Pokémon dari backend
* Minimal 20 Pokémon
* Menampilkan nama Pokémon
* Menampilkan gambar Pokémon
* Card Pokémon yang dapat dipilih
* Loading state
* Error state
* Responsive untuk desktop dan mobile

Data Pokémon diperoleh dari **PokéAPI melalui backend Laravel**.

---

## 2. 🔍 Pencarian Pokémon

Pengguna dapat mencari Pokémon berdasarkan nama.

Fitur ini meliputi:

* Input pencarian
* Pencarian berdasarkan nama Pokémon
* Tidak membedakan huruf besar dan kecil
* Hasil pencarian berubah tanpa reload halaman
* Menampilkan hasil jika Pokémon ditemukan
* Empty state jika Pokémon tidak ditemukan
* Input dapat dikosongkan
* Daftar Pokémon kembali seperti semula setelah pencarian dikosongkan
* Responsive di desktop dan mobile

---

## 3. 📖 Detail Pokémon

Pengguna dapat membuka detail Pokémon dari daftar Pokémon.

Informasi yang ditampilkan meliputi:

* Nama Pokémon
* Gambar Pokémon
* Tipe Pokémon
* Height
* Weight
* Abilities
* Stats

Data detail Pokémon diperoleh dari backend Laravel yang mengambil data dari PokéAPI.

Tersedia juga:

* Loading state
* Error state
* Tombol kembali ke daftar Pokémon
* Tampilan responsive

---

## 4. 🎯 Catch Pokémon

Pengguna dapat mencoba menangkap Pokémon dari halaman detail.

Alur fitur:

```text
User menekan Catch
        │
        ▼
Frontend mengirim request
        │
        ▼
Laravel REST API
        │
        ▼
Backend menentukan hasil Catch
        │
        ├── Gagal ──► Pokémon tidak disimpan
        │
        └── Berhasil
                │
                ▼
          Simpan ke MySQL
                │
                ▼
        Tampilkan feedback
```

Data Pokémon yang berhasil ditangkap menyimpan minimal:

* ID Pokémon
* Nama Pokémon
* Gambar
* Tipe
* Height
* Weight
* Waktu ditangkap

Proses Catch dilakukan tanpa reload halaman.

---

## 5. 🗃️ My Pokémon / Koleksi Pokémon

Pengguna dapat melihat Pokémon yang berhasil ditangkap pada halaman **My Pokémon** atau **Koleksi Pokémon**.

Setiap Pokémon menampilkan minimal:

* ID Pokémon
* Nama
* Gambar
* Tipe

Data koleksi disimpan di **MySQL**, sehingga koleksi tetap tersedia setelah halaman di-refresh.

Jika belum memiliki Pokémon, aplikasi menampilkan **empty state**.

---

## 6. 🗑️ Release Pokémon

Pengguna dapat melepaskan Pokémon dari koleksi.

Fitur ini meliputi:

* Tombol Release/Hapus
* Konfirmasi sebelum menghapus
* Membatalkan proses jika pengguna memilih batal
* Mengirim request hapus melalui REST API
* Menghapus data dari database
* Menghilangkan Pokémon dari koleksi tanpa reload halaman
* Feedback setelah berhasil dihapus
* Error state jika proses gagal
* Empty state jika seluruh koleksi sudah dihapus

---

## 7. 📜 Riwayat Pokémon

Aplikasi menyediakan halaman atau section **Riwayat Pokémon** untuk melihat aktivitas Pokémon yang pernah dilakukan.

Riwayat mencatat minimal:

* Nama Pokémon
* Jenis aktivitas
* Waktu aktivitas

Jenis aktivitas:

* **Catch**
* **Release**

Setiap aktivitas Catch dan Release akan disimpan ke database.

Contoh:

```text
┌─────────────────────────────────────────┐
│ Riwayat Pokémon                         │
├────────────┬───────────┬───────────────┤
│ Pokémon    │ Aktivitas │ Waktu         │
├────────────┼───────────┼───────────────┤
│ Pikachu    │ Catch     │ 07 Oct 2026   │
│ Bulbasaur  │ Catch     │ 07 Oct 2026   │
│ Pikachu    │ Release   │ 07 Oct 2026   │
└────────────┴───────────┴───────────────┘
```

Jika belum terdapat aktivitas, aplikasi menampilkan **empty state**.

---

# 🔌 REST API

Backend Laravel digunakan sebagai penghubung antara frontend, database, dan PokéAPI.

Secara umum alurnya:

```text
Next.js
   │
   │ HTTP Request
   ▼
Laravel REST API
   │
   ├── Pokémon API
   │
   └── MySQL
   │
   ▼
JSON Response
   │
   ▼
Next.js
```

Backend bertanggung jawab untuk:

* Mengambil data Pokémon dari PokéAPI
* Menyediakan data Pokémon kepada frontend
* Menangani proses Catch
* Menyimpan Pokémon ke database
* Mengambil data koleksi
* Menghapus Pokémon dari koleksi
* Menyimpan riwayat Catch dan Release
* Mengambil data riwayat

---

# 🗄️ Database

Database yang digunakan adalah **MySQL**.

Database digunakan untuk menyimpan data yang perlu dipertahankan oleh aplikasi, terutama:

* Koleksi Pokémon
* Data Pokémon yang berhasil ditangkap
* Riwayat Catch
* Riwayat Release

Data koleksi dan riwayat tetap tersedia setelah halaman di-refresh karena disimpan di database.

---

# 💻 Requirements

Sebelum menjalankan project, pastikan sudah terinstall:

* Node.js
* npm
* PHP
* Composer
* MySQL
* Git

---

# 🚀 Cara Menjalankan Project

## 1. Clone Repository

```bash
git clone https://github.com/Rahmasantikaanshori01/pokedex.git
```

Masuk ke folder project:

```bash
cd pokedex
```

---

## 2. Menjalankan Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Frontend dapat diakses melalui:

```text
http://localhost:3000
```

---

## 3. Menjalankan Backend

Buka terminal baru, kemudian masuk ke folder backend:

```bash
cd E:\pokedex\backend
```

Install dependency Laravel:

```bash
composer install
```

Jika file `.env` belum tersedia:

```bash
copy .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

---

## 4. Konfigurasi MySQL

Buat database MySQL dengan nama:

```text
pokedex
```

Kemudian sesuaikan konfigurasi database pada:

```text
backend/.env
```

Contoh:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pokedex
DB_USERNAME=root
DB_PASSWORD=
```

Sesuaikan username dan password MySQL dengan konfigurasi pada komputer masing-masing.

Setelah database dikonfigurasi, jalankan:

```bash
php artisan migrate
```

---

## 5. Menjalankan Laravel

Masih di folder `backend`, jalankan:

```bash
php artisan serve
```

Backend dapat diakses melalui:

```text
http://127.0.0.1:8000
```

---

# 🔄 Menjalankan Frontend dan Backend Bersamaan

Gunakan dua terminal.

### Terminal 1 — Frontend

```bash
cd E:\pokedex\frontend
npm run dev
```

Frontend:

```text
http://localhost:3000
```

### Terminal 2 — Backend

```bash
cd E:\pokedex\backend
php artisan serve
```

Backend:

```text
http://127.0.0.1:8000
```

Frontend kemudian berkomunikasi dengan backend menggunakan REST API.

---

# 🌐 Deployment

Project Pokedex menggunakan arsitektur deployment yang memisahkan frontend, backend, dan database.

### Arsitektur Deployment

```text
                    USER
                      │
                      ▼
              ┌───────────────┐
              │    Vercel     │
              │   Frontend    │
              │    Next.js    │
              └───────┬───────┘
                      │
                      │ HTTPS / REST API
                      ▼
              ┌───────────────┐
              │    Railway    │
              │    Backend    │
              │    Laravel    │
              └───────┬───────┘
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
      ┌─────────────┐   ┌─────────────┐
      │   MySQL     │   │   PokéAPI   │
      │   Railway   │   │ External API│
      └─────────────┘   └─────────────┘
---

# 🌿 Git

Project ini menggunakan **Git** untuk version control dan **GitHub** sebagai repository.

Melihat status perubahan:

```bash
git status
```

Menambahkan perubahan:

```bash
git add .
```

Membuat commit:

```bash
git commit -m "pesan commit"
```

Mengirim perubahan ke GitHub:

```bash
git push
```

---

# 📌 Project Status

Project Pokedex dikembangkan secara bertahap.

### Setup

* [x] Setup frontend Next.js
* [x] Setup backend Laravel
* [x] Setup Tailwind CSS
* [x] Setup Git
* [x] Repository GitHub
* [x] README

### Fitur

* [x] Daftar Pokémon
* [x] Pencarian Pokémon
* [x] Detail Pokémon
* [x] Catch Pokémon
* [x] My Pokémon / Koleksi
* [x] Release Pokémon
* [x] Riwayat Pokémon
* [x] Integrasi frontend dan backend
* [ ] Deployment

Status checklist akan diperbarui sesuai perkembangan project.

---

# 📅 Sprint Review

**21 October 2026**

---

## 📚 API Reference

Project menggunakan:

**PokéAPI**

https://pokeapi.co/

PokéAPI digunakan sebagai sumber data Pokémon yang kemudian diakses melalui backend Laravel.

---

## 📄 License

Project ini dibuat untuk keperluan pembelajaran dan pengembangan project selama kegiatan PKL.
