# I.R.O.N L.U.N.G 
### Intelligent Resource Organizer for Networking, Learning, Unified iNternships, and Group collaboration

Proyek ini dibangun menggunakan arsitektur *decoupled* (monorepo) dengan **Next.js (Frontend)** dan **Laravel (Backend)**, serta **PostgreSQL** sebagai basis data utama.

---

## 1. STRUKTUR FOLDER PROYEK

```text
ironlung/
├── frontend/                  # Aplikasi Frontend (Next.js 14+)
│   ├── src/
│   │   ├── components/        # Komponen UI reusable (Card, Navbar, Badge, dll)
│   │   ├── pages/             # Halaman utama (dashboard, magang, lomba, profil)
│   │   ├── services/          # Komunikasi dengan API Laravel via Axios
│   │   └── utils/             # Helper functions (format tanggal, token handler, dll)
│   ├── public/                # Aset statis (gambar, favicon)
│   └── package.json           # Dependensi Next.js
│
├── backend/                   # Aplikasi Backend API (Laravel 11+)
│   ├── app/
│   │   ├── Http/Controllers/  # Controller per fitur (Auth, Opportunity, Profile, dll)
│   │   ├── Models/            # Eloquent models (User, Opportunity, Application, dll)
│   │   ├── Middleware/        # JWT auth, role-based access control
│   │   └── Services/          # Business logic (RecommendationService, dll)
│   ├── config/                # Konfigurasi database, mail, JWT, Cloudinary
│   ├── database/
│   │   ├── migrations/        # Skema tabel PostgreSQL
│   │   └── seeders/           # Data awal (roles, kategori minat, akun admin)
│   ├── routes/
│   │   └── api.php            # Definisi route API RESTful
│   └── tests/                 # Unit & feature tests
│
└── docs/                      # Dokumentasi Proyek
    ├── API_DOCUMENTATION.md   # Kontrak API & OpenAPI Spec
    ├── DATABASE_DESIGN.md     # Desain Basis Data (ERD & Kamus Data)
    ├── PROJECT_CHARTER.md     # Piagam Proyek & Informasi Umum
    ├── SRS.md                 # Spesifikasi Kebutuhan Perangkat Lunak
    ├── UI_DESIGN_SPEC.md      # Spesifikasi UI/UX & Wireframe
    └── USE_CASE.md            # Skenario Use Case Pengguna
```

---

## 2. KONVENSI KODE (Coding Conventions)

Tim pengembang wajib mematuhi konvensi berikut untuk menjaga konsistensi kode:

### Naming Convention
- **Frontend (Next.js/React):**
  - **PascalCase**: Nama komponen React (contoh: `OpportunityCard.tsx`).
  - **camelCase**: Nama fungsi dan variabel lokal (contoh: `fetchData`, `userData`).
  - **kebab-case**: Nama file halaman/routing (contoh: `edit-profile.tsx`).
- **Backend (Laravel/PHP):**
  - **PascalCase**: Class, Controller, dan Model (contoh: `OpportunityController`, `UserProfile`).
  - **snake_case**: Nama tabel, kolom database, dan file migration (contoh: `created_at`, `create_users_table.php`).
  - **camelCase**: Variabel lokal dan method/fungsi dalam class (contoh: `calculateRecommendation()`).

### Struktur Komentar
- **Frontend:** Menggunakan standar **JSDoc** di atas fungsi/komponen kompleks.
- **Backend:** Menggunakan standar **PHPDoc** di atas class/metode utama.

### Error Handling & Response Standar
- **Frontend:** Seluruh pemanggilan API asinkron harus dibungkus dalam blok `try-catch`.
- **Backend:** Pengecualian (Exception) ditangani terpusat di `app/Exceptions/Handler.php`.
- **Format JSON Response Standar:**
  ```json
  {
    "status": "success/error",
    "message": "Pesan deskriptif",
    "data": { ... } // Null jika error
  }
  ```

### Logging Strategy
- **Backend (Laravel):** Menggunakan `Log` facade bawaan dengan level `info`, `warning`, dan `error`. Data sensitif (password, token) **DILARANG KERAS** untuk dicatat di log.
- **Frontend:** Menggunakan `console.error` saat proses *development*, dan harus dinonaktifkan/disembunyikan saat *production*.

---

## 3. INSTRUKSI INSTALASI & SETUP (Localhost)

Ikuti langkah-langkah berikut untuk menjalankan sistem secara lokal dari awal.

### 3.1. Prasyarat Sistem
- **PHP** >= 8.2 & Composer
- **Node.js** >= 20.x & npm/yarn
- **PostgreSQL** >= 15

### 3.2. Setup Basis Data
1. Buka terminal PostgreSQL/pgAdmin.
2. Buat database baru bernama `ironlung_db`.

### 3.3. Setup Backend (Laravel)
1. Buka terminal dan masuk ke folder `backend/`:
   ```bash
   cd backend
   ```
2. Instal dependensi PHP:
   ```bash
   composer install
   ```
3. Salin file `.env.example` ke `.env` di root proyek atau di dalam `backend/`. Konfigurasikan variabel database (PostgreSQL) dan kredensial lainnya.
4. Hasilkan *Application Key* dan *JWT Secret*:
   ```bash
   php artisan key:generate
   php artisan jwt:secret
   ```
5. Jalankan migrasi dan seeder awal:
   ```bash
   php artisan migrate:fresh --seed
   ```
6. Jalankan server lokal Laravel (berjalan di port 8000):
   ```bash
   php artisan serve
   ```

### 3.4. Setup Frontend (Next.js)
1. Buka terminal baru dan masuk ke folder `frontend/`:
   ```bash
   cd frontend
   ```
2. Instal dependensi Node.js:
   ```bash
   npm install
   ```
3. Salin/buat file `.env.local` di dalam folder `frontend/` (opsional jika sudah di-set global):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
4. Jalankan *development server* Next.js (berjalan di port 3000):
   ```bash
   npm run dev
   ```

### 3.5. Menjalankan Aplikasi
- **Aplikasi Web:** Buka browser dan akses `http://localhost:3000`
- **API Endpoint:** Tersedia di `http://localhost:8000/api/v1`

---
*Dokumen ini merupakan panduan utama. Perubahan arsitektur harus didiskusikan dan disetujui oleh tim.*
