# SYSTEM ARCHITECTURE DOCUMENT (SAD)
## I.R.O.N L.U.N.G

| Item | Detail |
|------|--------|
| **Versi** | 1.0.0 |
| **Tanggal** | 06 Mei 2026 |
| **Standar** | IEEE Std 1016-2009 |
| **Tim** | Kelompok 6 |
| **Referensi** | SRS v1.0.0, DATABASE_DESIGN v1.0.0 |

---

## 1.0 PENDAHULUAN

### 1.1 Tujuan & Audiens Dokumen

Dokumen ini mendeskripsikan arsitektur sistem **I.R.O.N L.U.N.G** secara komprehensif sesuai standar IEEE 1016-2009. Tujuannya adalah memberikan panduan teknis yang cukup bagi seluruh anggota tim untuk membangun, mengintegrasikan, dan memelihara sistem.

**Audiens dokumen:**

| Audiens | Kepentingan |
|---------|-------------|
| Tim Backend (Laravel) | Desain API, lapisan bisnis, keamanan |
| Tim Frontend (Next.js) | Integrasi API, state management, rendering |
| DevOps / QA | Deployment, infrastruktur, pengujian |
| Dosen Pembimbing | Review arsitektur dan keputusan desain |

### 1.2 Ruang Lingkup Arsitektur

Arsitektur ini mencakup seluruh komponen teknis sistem I.R.O.N L.U.N.G v1.0:
- Frontend web application (Next.js)
- Backend RESTful API (Laravel)
- Database (PostgreSQL)
- File storage (Cloudinary)
- Email service (Gmail SMTP)
- Deployment environment (VPS Ubuntu)

**Tidak termasuk:** Arsitektur mobile native, arsitektur microservice lanjutan, dan integrasi SIAKAD.

---

## 2.0 GAMBARAN ARSITEKTUR

### 2.1 Pola Arsitektur

Sistem I.R.O.N L.U.N.G mengadopsi **Layered Architecture (N-Tier)** dengan pemisahan yang jelas antara:

1. **Presentation Layer** — Next.js SPA/SSR
2. **API Layer** — Laravel RESTful API (stateless)
3. **Business Logic Layer** — Laravel Services & Repositories
4. **Data Access Layer** — Eloquent ORM
5. **Database Layer** — PostgreSQL

Pola ini dikombinasikan dengan **Client-Server Architecture** di mana frontend dan backend adalah aplikasi terpisah yang berkomunikasi via HTTPS REST API.

Backend mengikuti pola **Repository Pattern** untuk memisahkan logika akses data dari logika bisnis.

### 2.2 Alasan Pemilihan Pola

| Pertimbangan | Alasan |
|-------------|--------|
| **Layered Architecture** | Memisahkan concern antar lapisan → mudah diuji dan dirawat |
| **Decoupled Frontend-Backend** | Tim dapat bekerja paralel; frontend dapat diganti tanpa mengubah API |
| **RESTful API** | Stateless → mudah di-scale; standar industri; mudah di-test |
| **Repository Pattern** | Abstraksi akses data → mudah mengganti ORM atau mock saat testing |
| **Bukan Microservice** | Skala MVP satu universitas tidak membutuhkan kompleksitas microservice |

### 2.3 Diagram Komponen (Tekstual)

```
═══════════════════════════════════════════════════════════════
                    CLIENT (Browser / Mobile Browser)
═══════════════════════════════════════════════════════════════
                              │
                         HTTPS / TLS
                              │
═══════════════════════════════════════════════════════════════
              PRESENTATION LAYER — Next.js 14 (SSR/CSR)
  ┌─────────────┬─────────────┬─────────────┬───────────────┐
  │  Pages      │  Components │  Hooks      │  API Client   │
  │  (App Dir)  │  (UI/UX)    │  (State)    │  (Axios/Fetch)│
  └─────────────┴─────────────┴─────────────┴───────────────┘
                              │
                    HTTPS REST (JSON) + JWT
                              │
═══════════════════════════════════════════════════════════════
               API GATEWAY LAYER — Nginx (Reverse Proxy)
═══════════════════════════════════════════════════════════════
                              │
═══════════════════════════════════════════════════════════════
            BUSINESS LOGIC LAYER — Laravel 11 (PHP 8.2)
  ┌────────────┬─────────────┬────────────┬─────────────────┐
  │  Routes    │  Controllers│  Services  │  Middleware     │
  │  (API)     │  (Resource) │  (Business │  (Auth/RBAC/    │
  │            │             │   Logic)   │   RateLimit)    │
  └────────────┴─────────────┴────────────┴─────────────────┘
  ┌────────────────────────┬────────────────────────────────┐
  │  Repositories          │  Events & Listeners            │
  │  (Data Abstraction)    │  (Notification, Email Trigger) │
  └────────────────────────┴────────────────────────────────┘
                              │
═══════════════════════════════════════════════════════════════
           DATA ACCESS LAYER — Eloquent ORM / Query Builder
═══════════════════════════════════════════════════════════════
                              │
═══════════════════════════════════════════════════════════════
                  DATABASE LAYER — PostgreSQL 15+
═══════════════════════════════════════════════════════════════
                              │
         ┌────────────────────┴────────────────────┐
         │                                         │
  ┌──────────────┐                        ┌────────────────┐
  │  Cloudinary  │                        │  Gmail SMTP    │
  │  (File CDN)  │                        │  (Email Notif) │
  └──────────────┘                        └────────────────┘
```

---

## 3.0 LAPISAN ARSITEKTUR

### 3.1 Presentation Layer (Frontend — Next.js)

**Teknologi:** Next.js 14 (App Router), Tailwind CSS, Axios

**Tanggung Jawab:**
- Merender antarmuka pengguna yang responsif dan interaktif
- Mengelola state autentikasi (JWT access token di memory; refresh token di httpOnly cookie)
- Mengonsumsi REST API backend dan menampilkan data
- Menerapkan client-side route protection berdasarkan role

**Struktur Direktori:**
```
frontend/
├── app/
│   ├── (auth)/          # login, register, onboarding
│   ├── (mahasiswa)/     # dashboard, browse, apply, profile
│   ├── (mitra)/         # dashboard, post-opportunity, applicants
│   └── (admin)/         # dashboard, moderation, user-management
├── components/          # Shared UI components
├── hooks/               # Custom React hooks (useAuth, useApi)
├── lib/                 # Axios instance, helpers
└── types/               # TypeScript type definitions
```

**Pola State Management:**
- Server Components untuk data statis/SSR (SEO-friendly)
- Client Components + React hooks untuk data dinamis
- Token refresh: silent refresh via interceptor Axios sebelum setiap request

### 3.2 Business Logic Layer (Backend — Laravel)

**Teknologi:** Laravel 11, PHP 8.2

**Tanggung Jawab:**
- Menerima dan memvalidasi request API
- Menerapkan RBAC (middleware) sebelum business logic
- Menjalankan logika bisnis (rekomendasi, validasi status, notifikasi)
- Mengorkestrasikan akses ke data dan layanan eksternal

**Pola yang Digunakan:**

| Pola | Implementasi | Tujuan |
|------|-------------|--------|
| Repository Pattern | `App\Repositories\*Repository` | Abstraksi akses data dari Service |
| Service Layer | `App\Services\*Service` | Logika bisnis terisolasi, mudah diuji |
| Resource Controller | `App\Http\Controllers\Api\*` | RESTful endpoint standar |
| Form Request | `App\Http\Requests\*` | Validasi input terpusat |
| API Resource | `App\Http\Resources\*` | Transformasi response JSON konsisten |
| Event-Listener | `App\Events\*`, `App\Listeners\*` | Trigger notifikasi secara async |
| Middleware | `Authenticate`, `CheckRole`, `ThrottleRequests` | Auth, RBAC, Rate Limiting |

**Struktur Direktori Backend:**
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/   # Resource controllers
│   │   ├── Middleware/        # Auth, Role, RateLimit
│   │   ├── Requests/          # Form validation
│   │   └── Resources/         # API response transformation
│   ├── Services/              # Business logic
│   ├── Repositories/          # Data access abstraction
│   ├── Models/                # Eloquent models
│   ├── Events/                # Domain events
│   └── Listeners/             # Event handlers (email, notif)
├── routes/
│   └── api.php                # Semua API routes
├── database/
│   ├── migrations/            # Schema migrations
│   └── seeders/               # Seed data
└── config/                    # App, auth, mail, cors
```

### 3.3 Data Access Layer

**Teknologi:** Laravel Eloquent ORM, Query Builder

**Tanggung Jawab:**
- Abstraksi operasi CRUD ke database melalui Repository
- Mencegah N+1 query menggunakan Eager Loading (`with()`)
- Menggunakan Query Builder untuk query kompleks (rekomendasi)

**Konvensi:**
- Semua query melalui Repository; Controller tidak boleh query langsung
- Eager loading wajib jika ada relasi yang diakses
- Gunakan `select()` untuk memilih kolom yang diperlukan saja
- Transaksi database (`DB::transaction`) untuk operasi multi-tabel

### 3.4 Database Layer

**Teknologi:** PostgreSQL 15+

**Tanggung Jawab:**
- Penyimpanan data persisten dengan integritas ACID
- Penerapan constraint (FK, UNIQUE, CHECK) di level database
- Eksekusi query yang dioptimasi dengan indeks

**Detail:** Lihat `DATABASE_DESIGN.md` dan `schema.sql` untuk skema lengkap, normalisasi, dan strategi indeks.

---

## 4.0 TEKNOLOGI STACK

| Layer | Teknologi | Versi | Alasan Pemilihan |
|-------|-----------|:-----:|-----------------|
| **Frontend Framework** | Next.js | 14+ | SSR/SSG untuk SEO, App Router, file-based routing |
| **Frontend UI** | Tailwind CSS | 3+ | Utility-first, design system konsisten, produktivitas tinggi |
| **Frontend Language** | TypeScript | 5+ | Type safety, mencegah runtime error, DX lebih baik |
| **HTTP Client** | Axios | 1.6+ | Interceptor untuk token refresh, error handling terpusat |
| **Backend Framework** | Laravel | 11+ | Ekosistem PHP matang, Eloquent ORM, built-in auth scaffolding |
| **Backend Language** | PHP | 8.2+ | Typed properties, enums, fibers untuk concurrency |
| **Database** | PostgreSQL | 15+ | ACID, partial index, JSON support, open source |
| **File Storage** | Cloudinary | REST API | CDN global, transformasi gambar otomatis, free tier cukup |
| **Email Service** | Laravel Mail + Gmail SMTP | - | Zero cost, cukup untuk skala satu universitas |
| **Web Server** | Nginx | 1.24+ | Reverse proxy, high performance, SSL termination |
| **Runtime (Backend)** | PHP-FPM | 8.2+ | Process manager efisien untuk Laravel |
| **Process Manager** | Supervisor | 4+ | Menjalankan Laravel queue worker (notifikasi async) |
| **OS** | Ubuntu | 22.04 LTS | Stabil, support panjang, ekosistem server luas |
| **Version Control** | Git + GitHub | - | Kolaborasi tim, CI/CD integration |
| **API Documentation** | Swagger/OpenAPI | 3.0 | Dokumentasi API interaktif untuk tim frontend |

---

## 5.0 KEAMANAN ARSITEKTUR

### 5.1 Autentikasi & Otorisasi

**Alur Autentikasi JWT:**
```
Client                    Backend API                  Database
  │                           │                            │
  │── POST /auth/login ───────►│                            │
  │   {email, password}        │── Cek rate limit ─────────►│
  │                           │── Verifikasi kredensial ───►│
  │                           │◄─ User data ───────────────│
  │                           │── Buat JWT access (15min)  │
  │                           │── Buat refresh token (7hr) │
  │                           │── Simpan token_hash ───────►│
  │◄── 200 OK ────────────────│                            │
  │   {access_token}           │                            │
  │   Set-Cookie: refresh_token (httpOnly, Secure)          │
  │                           │                            │
  │── GET /api/resource ──────►│                            │
  │   Authorization: Bearer {access_token}                 │
  │                           │── Validasi JWT signature   │
  │                           │── Cek role (RBAC) ─────────►│
  │◄── 200 OK + data ─────────│                            │
```

**Lapisan Keamanan Backend:**

| Lapisan | Implementasi | Tujuan |
|---------|-------------|--------|
| Rate Limiting | Laravel Throttle Middleware | Cegah brute force; 10 req/15min untuk /auth |
| Autentikasi | JWT via `tymon/jwt-auth` | Verifikasi identitas setiap request |
| Otorisasi | Custom Role Middleware + Policy | Pastikan user hanya akses resource miliknya |
| Input Validation | Laravel Form Request | Sanitasi & validasi server-side semua input |
| SQL Injection | Eloquent ORM + Query Builder | Parameterized query otomatis |
| XSS Prevention | Laravel response encoding | Output di-escape secara otomatis |
| CORS | Laravel CORS package | Hanya origin frontend terdaftar |
| File Upload | MIME type whitelist + size limit | Cegah upload file berbahaya |
| Secret Management | `.env` + tidak di-commit ke Git | Tidak ada hardcoded credentials |

### 5.2 Enkripsi Data & Audit Trail

**Enkripsi:**
| Data | Metode Enkripsi |
|------|----------------|
| Password | bcrypt, cost factor 12 |
| Refresh token (DB) | SHA-256 hash |
| Data in transit | TLS 1.2+ (Let's Encrypt) |
| File uploads | HTTPS Cloudinary CDN |

**Audit Trail (Minimal MVP):**
- `created_at` dan `updated_at` pada semua tabel utama
- Status transitions dicatat via `updated_at` + field status
- Notifikasi yang terkirim tercatat di tabel `notifications`

**Rencana v2.0:** Tabel `activity_logs` untuk audit trail lengkap setiap perubahan data kritis.

---

## 6.0 DEPLOYMENT ARCHITECTURE

### 6.1 Topologi Deployment

```
                        ┌─────────────────────────────────┐
                        │         INTERNET                │
                        └──────────────┬──────────────────┘
                                       │ HTTPS :443
                        ┌─────────────▼──────────────────┐
                        │      DOMAIN: ironlung.id        │
                        │   (DNS → VPS IP / Vercel)       │
                        └──────────────┬──────────────────┘
                                       │
              ┌────────────────────────┼──────────────────────────┐
              │                        │                          │
   ┌──────────▼──────────┐  ┌──────────▼──────────┐   ┌─────────▼────────┐
   │  VERCEL (Optional)  │  │  VPS UBUNTU 22.04   │   │  CLOUDINARY CDN  │
   │  Next.js Frontend   │  │                     │   │  (File Storage)  │
   │  (CDN-based SSR)    │  │  ┌───────────────┐  │   └──────────────────┘
   └─────────────────────┘  │  │     Nginx     │  │
                             │  │ (Reverse Proxy│  │   ┌──────────────────┐
   ATAU:                     │  │  SSL Termination│ │   │  GMAIL SMTP      │
   ┌─────────────────────┐  │  └──────┬────────┘  │   │  (Email Service) │
   │  VPS — Next.js      │  │         │            │   └──────────────────┘
   │  (PM2 + Nginx)      │  │  ┌──────▼────────┐  │
   └─────────────────────┘  │  │  PHP-FPM 8.2  │  │
                             │  │  Laravel API  │  │
                             │  └──────┬────────┘  │
                             │         │            │
                             │  ┌──────▼────────┐  │
                             │  │  PostgreSQL   │  │
                             │  │  15+          │  │
                             │  └───────────────┘  │
                             │                     │
                             │  ┌───────────────┐  │
                             │  │  Supervisor   │  │
                             │  │  (Queue Worker│  │
                             │  │   untuk email)│  │
                             │  └───────────────┘  │
                             └─────────────────────┘
```

### 6.2 Kebutuhan Infrastruktur

**VPS Minimum (MVP):**

| Spesifikasi | Nilai |
|-------------|-------|
| CPU | 2 vCPU |
| RAM | 4 GB |
| Storage | 50 GB SSD |
| OS | Ubuntu 22.04 LTS |
| Bandwidth | 1 TB/bulan |
| SSL | Let's Encrypt (gratis, auto-renew) |

**Software yang Di-install di VPS:**

| Software | Versi | Fungsi |
|---------|-------|--------|
| Nginx | 1.24+ | Web server + Reverse proxy |
| PHP | 8.2+ | Runtime Laravel |
| PHP-FPM | 8.2+ | FastCGI Process Manager |
| Composer | 2+ | PHP dependency manager |
| PostgreSQL | 15+ | Database |
| Node.js | 20 LTS | Build Next.js (jika di VPS) |
| PM2 | Latest | Process manager untuk Next.js |
| Supervisor | 4+ | Daemon untuk Laravel queue |
| Certbot | Latest | Manajemen SSL Let's Encrypt |
| Git | 2.40+ | Version control & deployment |

### 6.3 Strategi Backup & Recovery

**Backup Database:**
```bash
# Cron job harian — backup PostgreSQL
0 2 * * * pg_dump -U ironlung_user ironlung_db | \
  gzip > /backups/db_$(date +%Y%m%d).sql.gz

# Retensi: simpan 7 backup terakhir
find /backups -name "db_*.sql.gz" -mtime +7 -delete
```

**Strategi Backup:**

| Tipe | Frekuensi | Retensi | Lokasi |
|------|-----------|---------|--------|
| Database (pg_dump) | Harian (02:00 WIB) | 7 hari | VPS /backups + offsite |
| Environment config (.env) | Manual saat perubahan | Selamanya | Password manager tim |
| Source code | Setiap push | Git history | GitHub repository |

**Recovery Plan:**
1. **Database corrupt:** Restore dari backup pg_dump terbaru (`psql < backup.sql`)
2. **VPS down:** Spin up VPS baru → install software → restore DB → deploy dari Git
3. **RTO (Recovery Time Objective):** ≤ 4 jam untuk restore penuh dari backup
4. **RPO (Recovery Point Objective):** ≤ 24 jam (kehilangan data maksimal 1 hari)

---

## 7.0 KEPUTUSAN ARSITEKTUR (ADR)

---

### ADR-001: Decoupled Frontend-Backend Architecture

```
Status    : Accepted

Konteks   : Tim perlu memutuskan apakah menggunakan full-stack framework
            monolitik (Next.js full-stack / Laravel Blade) atau memisahkan
            frontend dan backend menjadi aplikasi independen.

Keputusan : Menggunakan arsitektur decoupled — Next.js sebagai frontend
            SPA/SSR dan Laravel sebagai pure REST API backend.

Alasan    :
  - Tim dapat bekerja secara paralel (frontend & backend independen)
  - API dapat digunakan kembali jika ada mobile app di masa depan
  - Separation of concerns lebih jelas
  - Next.js memberikan SSR untuk SEO yang lebih baik

Konsekuensi:
  [+] Fleksibilitas tinggi; frontend dapat diganti tanpa ubah backend
  [+] Tim frontend dan backend tidak saling blocking
  [-] Perlu mengelola CORS dan autentikasi berbasis token (lebih kompleks
      dari session-based auth monoliti)
  [-] Deployment lebih kompleks (dua aplikasi terpisah)
```

---

### ADR-002: JWT dengan Refresh Token (httpOnly Cookie)

```
Status    : Accepted

Konteks   : Sistem memerlukan mekanisme autentikasi yang aman untuk
            API stateless. Opsi yang dipertimbangkan:
            (a) JWT disimpan di localStorage
            (b) JWT disimpan di memory + refresh token di httpOnly cookie
            (c) Session-based authentication

Keputusan : JWT access token disimpan di memory frontend (React state/
            variable), refresh token disimpan di httpOnly cookie.
            Access token TTL: 15 menit. Refresh token TTL: 7 hari.

Alasan    :
  - localStorage rentan terhadap XSS attack
  - httpOnly cookie tidak dapat diakses JavaScript → aman dari XSS
  - Stateless API tetap terjaga (tidak ada session di server)
  - Silent refresh transparan untuk pengguna

Konsekuensi:
  [+] Keamanan tinggi terhadap XSS
  [+] API tetap stateless dan scalable
  [-] Implementasi lebih kompleks (perlu Axios interceptor untuk refresh)
  [-] Rentan terhadap CSRF jika SameSite tidak dikonfigurasi dengan benar
      → Mitigasi: SameSite=Strict pada cookie refresh token
```

---

### ADR-003: Cloudinary untuk File Storage

```
Status    : Accepted

Konteks   : Platform memerlukan penyimpanan file untuk CV, portofolio,
            avatar, dan logo perusahaan. Opsi:
            (a) Local disk storage di VPS
            (b) AWS S3
            (c) Cloudinary

Keputusan : Menggunakan Cloudinary sebagai penyedia file storage dan CDN.

Alasan    :
  - Free tier cukup untuk MVP (25GB storage, 25GB bandwidth/bulan)
  - URL CDN global dengan latency rendah
  - Otomatis transformasi gambar (resize avatar, compress)
  - URL berbasis token mencegah enumeration
  - Tidak perlu konfigurasi infrastruktur tambahan

Konsekuensi:
  [+] Zero infrastructure overhead untuk tim
  [+] CDN delivery cepat
  [-] Ketergantungan pada layanan pihak ketiga
  [-] Free tier memiliki batas; jika melewati batas perlu upgrade (biaya)
  [-] Upload melalui backend (bukan direct upload dari browser) untuk
      keamanan → ada overhead pada backend
```

---

### ADR-004: PostgreSQL sebagai RDBMS

```
Status    : Accepted

Konteks   : Pemilihan database untuk sistem. Opsi yang dipertimbangkan:
            (a) MySQL/MariaDB
            (b) PostgreSQL
            (c) SQLite (development only)

Keputusan : Menggunakan PostgreSQL 15+ sebagai database utama.

Alasan    :
  - Dukungan partial index yang dibutuhkan untuk optimasi query rekomendasi
  - CHECK constraint lebih ketat dan reliable dibanding MySQL
  - ACID compliance penuh untuk data integrity
  - Dukungan JSONB jika diperlukan di masa depan
  - Ekosistem Laravel (Eloquent) mendukung PostgreSQL dengan sangat baik

Konsekuensi:
  [+] Integritas data lebih kuat dengan constraint ketat
  [+] Partial index mengurangi ukuran index untuk query peluang aktif
  [-] Sedikit lebih berat dari MySQL untuk instalasi di VPS kecil
  [-] Sintaks beberapa fungsi berbeda dari MySQL (perlu diperhatikan tim)
```

---

### ADR-005: Rule-Based Recommendation (Bukan ML)

```
Status    : Accepted

Konteks   : Sistem rekomendasi perlu diputuskan apakah menggunakan
            machine learning (collaborative/content-based filtering)
            atau rule-based approach (tag matching).

Keputusan : Menggunakan rule-based filtering berbasis tag matching
            untuk v1.0. Query SQL dijalankan real-time setiap dashboard load.

Algoritma : Kembalikan peluang approved di mana
            (opportunity.tags ∩ user.interests) ≥ 1,
            diurutkan descending berdasarkan jumlah tag cocok,
            lalu berdasarkan recency. Limit 10 hasil.

Alasan    :
  - Kompleksitas rendah; sesuai scope akademik satu semester
  - Tidak memerlukan training data historis
  - Mudah dipahami dan diaudit (transparent logic)
  - Performa cukup dengan indeks yang tepat pada skala MVP

Konsekuensi:
  [+] Implementasi cepat dan transparan
  [+] Tidak perlu infrastruktur ML (model training, serving)
  [-] Kualitas rekomendasi lebih rendah dari ML (tidak belajar dari behavior)
  [-] Jika user tidak update minat, rekomendasi stagnan
  → Direncanakan upgrade ke ML di v2.0 jika ada data perilaku pengguna
```

---

### ADR-006: Monorepo vs Separate Repository

```
Status    : Accepted

Konteks   : Tim perlu memutuskan apakah frontend (Next.js) dan backend
            (Laravel) berada dalam satu repository atau terpisah.

Keputusan : Menggunakan dua repository terpisah:
            - github.com/kelompok6/ironlung-frontend
            - github.com/kelompok6/ironlung-backend

Alasan    :
  - Deployment pipeline lebih sederhana (masing-masing deploy mandiri)
  - Tidak ada dependency build antar tim
  - Lebih mudah dikelola untuk tim dengan 4 anggota

Konsekuensi:
  [+] Deployment independen per komponen
  [-] Perlu koordinasi API contract (OpenAPI spec) sebagai "kontrak" antara
      dua repository agar tidak terjadi mismatch
  → Wajib membuat dan merawat API_CONTRACT.yaml (OpenAPI 3.0)
```

---

*Dokumen ini merupakan bagian dari dokumentasi sistem I.R.O.N L.U.N.G v1.0.0*
*Standar: IEEE Std 1016-2009 | Referensi: SRS.md, DATABASE_DESIGN.md*

**Versi:** 1.0.0 | **Tanggal:** 06 Mei 2026 | **Klasifikasi:** Internal — Kelompok 6
