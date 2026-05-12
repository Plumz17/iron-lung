# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## I.R.O.N L.U.N.G
### Intelligent Resource Organizer for Networking, Learning, Unified iNternships, and Group collaboration

| Item | Detail |
|------|--------|
| **Versi** | 1.0.0 |
| **Tanggal** | 06 Mei 2026 |
| **Standar** | IEEE Std 830-1998 |
| **Tim** | Kelompok 6 (Anders Emmanuel Tan, Dhimas Early Oceandy, Azhar Maulana, Evan Razzan Adytaputra) |
| **Status** | Draft |

---

## 1.0 PENDAHULUAN

### 1.1 Tujuan Dokumen

Dokumen SRS ini mendefinisikan seluruh kebutuhan fungsional dan non-fungsional sistem **I.R.O.N L.U.N.G** secara lengkap dan tidak ambigu. Dokumen ini menjadi kontrak teknis antara tim pengembang, stakeholder, dan dosen pembimbing, serta menjadi acuan utama dalam proses desain, implementasi, dan pengujian sistem.

### 1.2 Ruang Lingkup Produk

**I.R.O.N L.U.N.G** adalah platform web akademik dan career development terpusat yang memungkinkan:

- **Mahasiswa** menemukan dan melamar peluang magang, kompetisi, pelatihan, serta proyek kolaborasi yang direkomendasikan berdasarkan minat mereka.
- **Mitra Industri** memposting peluang dan mengelola pipeline pelamar secara mandiri.
- **Administrator** memoderasi seluruh konten dan mengelola akun pengguna.

**Tidak termasuk dalam v1.0:** Machine learning, integrasi SIAKAD, chat/task management, OAuth, WebSocket, dan aplikasi mobile native.

### 1.3 Definisi, Akronim, dan Singkatan

| Istilah | Definisi |
|---------|----------|
| SRS | Software Requirements Specification |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| API | Application Programming Interface |
| NIM | Nomor Induk Mahasiswa |
| UU PDP | Undang-Undang Perlindungan Data Pribadi Indonesia |
| MVP | Minimum Viable Product |
| OWASP | Open Web Application Security Project |
| VPS | Virtual Private Server |
| SMTP | Simple Mail Transfer Protocol |
| CRUD | Create, Read, Update, Delete |
| TTL | Time To Live |

### 1.4 Referensi

| # | Dokumen |
|---|---------|
| 1 | IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications |
| 2 | ISO/IEC 25010:2011: Systems and Software Quality Requirements and Evaluation |
| 3 | OWASP Top 10: 2021 Web Application Security Risks |
| 4 | UU No. 27 Tahun 2022: Undang-Undang Perlindungan Data Pribadi Indonesia |
| 5 | RFC 7519: JSON Web Token (JWT) Specification |
| 6 | PROJECT_CHARTER.md — I.R.O.N L.U.N.G v1.0.0 |

---

## 2.0 DESKRIPSI KESELURUHAN

### 2.1 Perspektif Produk

I.R.O.N L.U.N.G adalah sistem standalone baru dengan arsitektur **decoupled (client-server)**:

```
┌─────────────────────┐     HTTPS/REST     ┌──────────────────────┐
│   Frontend           │ ◄────────────────► │   Backend API         │
│   Next.js 14+        │    JSON + JWT       │   Laravel 11+ (PHP)  │
│   Tailwind CSS       │                    │   PostgreSQL 15+      │
└─────────────────────┘                    └──────────────────────┘
         │                                           │
         │                                  ┌────────┴────────┐
    Vercel / Nginx                    Cloudinary       Gmail SMTP
    (Static + SSR)                  (File Storage)    (Email Notif)
```

**Komponen Utama:**
- **Frontend:** Next.js dengan Tailwind CSS, di-deploy di Vercel atau VPS via Nginx
- **Backend:** Laravel RESTful API, stateless, JWT-authenticated
- **Database:** PostgreSQL 15+, ACID-compliant
- **File Storage:** Cloudinary CDN (CV, portofolio, logo)
- **Email:** Laravel Mail via Gmail SMTP

### 2.2 Fungsi Produk (Ringkasan)

| Kode | Fungsi | Role |
|------|--------|------|
| F-01 | Registrasi & Autentikasi Pengguna | Semua |
| F-02 | Manajemen Profil & Portofolio | Mahasiswa |
| F-03 | Onboarding Minat Berbasis Tag | Mahasiswa |
| F-04 | Posting & Manajemen Peluang | Mitra Industri |
| F-05 | Listing Proyek & Rekrutmen Anggota | Mitra Industri |
| F-06 | Browse, Pencarian & Filter Peluang | Mahasiswa, Publik |
| F-07 | Sistem Rekomendasi Berbasis Rule | Mahasiswa |
| F-08 | Manajemen Lamaran (Internal & Eksternal) | Mahasiswa, Mitra |
| F-09 | Moderasi Konten & Persetujuan | Admin |
| F-10 | Manajemen Akun Pengguna | Admin |
| F-11 | Notifikasi In-App & Email | Semua |
| F-12 | Upload File Aman (CV, Portofolio) | Mahasiswa |

### 2.3 Karakteristik Pengguna

**Mahasiswa (Student)**
- Mahasiswa Ilmu Komputer, melek teknologi
- Tujuan: menemukan peluang relevan, membangun portofolio, melamar magang/kompetisi
- Akses: browse, apply, kelola profil & portofolio

**Mitra Industri (Industry Partner)**
- HR perusahaan, founder startup, penyelenggara kompetisi
- Tujuan: rekrutmen talenta, promosi program
- Akses: posting peluang/proyek, review pelamar

**Administrator**
- Staf internal platform, level kepercayaan tertinggi
- Tujuan: menjaga kualitas dan keamanan konten platform
- Akses: full CRUD semua resource, moderasi, dashboard statistik

### 2.4 Batasan & Asumsi

**Batasan Sistem:**
- Tidak ada integrasi SIAKAD; data mahasiswa diinput manual saat registrasi
- File upload hanya melalui Cloudinary (tidak ada local disk storage di produksi)
- JWT access token TTL: 15 menit; refresh token TTL: 7 hari (httpOnly cookie)
- Semua secrets hanya dari `.env`; tidak ada hardcoded credentials
- CORS hanya mengizinkan origin frontend yang terdaftar

**Asumsi:**
- VPS minimal: 2 vCPU, 4GB RAM, 50GB SSD (Ubuntu 22.04 LTS)
- Cloudinary free tier cukup untuk skala MVP
- Gmail SMTP cukup untuk volume notifikasi skala satu universitas

---

## 3.0 KEBUTUHAN FUNGSIONAL

> Format: `FR-XXX | Deskripsi | Prioritas (Must/Should/Could)`

---

### FR-001 — Registrasi Pengguna

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-001.1 | Sistem menyediakan form registrasi dengan field: email, password, pilihan role (Mahasiswa / Mitra Industri) | Must |
| FR-001.2 | Registrasi Mahasiswa memerlukan tambahan: Nama Lengkap, NIM, Universitas, Jurusan | Must |
| FR-001.3 | Registrasi Mitra Industri memerlukan tambahan: Nama Perusahaan, Bidang Industri | Must |
| FR-001.4 | Email harus unik di seluruh akun pengguna | Must |
| FR-001.5 | Password minimal 8 karakter, mengandung minimal 1 huruf besar dan 1 angka | Must |
| FR-001.6 | Password di-hash menggunakan bcrypt (cost factor ≥ 12) sebelum disimpan | Must |
| FR-001.7 | Sistem mengirimkan email selamat datang setelah registrasi berhasil | Should |
| FR-001.8 | Akun Mitra Industri berstatus `pending_verification` hingga disetujui Admin | Must |

---

### FR-002 — Autentikasi & Manajemen Sesi

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-002.1 | Sistem mengautentikasi pengguna via email/password dan menerbitkan JWT access token (TTL: 15 menit) dan refresh token (TTL: 7 hari) | Must |
| FR-002.2 | Refresh token disimpan dalam httpOnly, Secure, SameSite=Strict cookie | Must |
| FR-002.3 | Sistem menyediakan endpoint `/auth/refresh` untuk memperbarui access token menggunakan refresh token yang valid | Must |
| FR-002.4 | Sistem menyediakan endpoint `/auth/logout` yang menginvalidasi refresh token | Must |
| FR-002.5 | Endpoint login memberlakukan rate limiting: maksimal 10 percobaan per IP per 15 menit | Must |
| FR-002.6 | Seluruh endpoint terproteksi memvalidasi JWT pada setiap request | Must |

---

### FR-003 — Role-Based Access Control (RBAC)

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-003.1 | Sistem menegakkan RBAC di layer backend API untuk semua endpoint terproteksi | Must |
| FR-003.2 | Role Mahasiswa: dapat READ peluang/proyek, apply, kelola profil/portofolio milik sendiri | Must |
| FR-003.3 | Role Mitra Industri: dapat CREATE/UPDATE/DELETE peluang dan proyek milik sendiri, READ daftar pelamar milik sendiri | Must |
| FR-003.4 | Role Admin: memiliki akses penuh (full CRUD) pada semua resource termasuk akun pengguna | Must |
| FR-003.5 | Aksi di luar scope role mengembalikan HTTP 403 Forbidden | Must |

---

### FR-004 — Profil & Portofolio Mahasiswa

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-004.1 | Mahasiswa dapat membuat dan memperbarui profil: bio, foto profil, semester, skills | Must |
| FR-004.2 | Mahasiswa dapat mengunggah CV (PDF, maks. 5MB) ke Cloudinary | Must |
| FR-004.3 | Mahasiswa dapat menambahkan item portofolio: judul, deskripsi, URL proyek, atau upload file (PDF/ZIP, maks. 10MB) | Must |
| FR-004.4 | Semua file yang diunggah disimpan di Cloudinary dengan nama file berbasis UUID | Must |
| FR-004.5 | Mahasiswa dapat melihat riwayat lamaran dan statusnya | Must |

---

### FR-005 — Onboarding Minat Berbasis Tag

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-005.1 | Saat onboarding, Mahasiswa memilih minimal 3 tag minat dari daftar yang telah ditentukan | Must |
| FR-005.2 | Kategori minat mencakup: Web Dev, Mobile Dev, Data Science, UI/UX, Cybersecurity, Cloud Computing, Game Dev, Machine Learning, Embedded Systems, Business/Entrepreneurship, dan lainnya | Must |
| FR-005.3 | Mahasiswa dapat memperbarui tag minat kapan saja dari pengaturan profil | Must |
| FR-005.4 | Admin dapat mengelola daftar master tag minat (CRUD) | Should |

---

### FR-006 — Posting Peluang (Mitra Industri)

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-006.1 | Mitra Industri dapat memposting peluang dengan tipe: Magang, Kompetisi, Pelatihan | Must |
| FR-006.2 | Field peluang: judul, tipe, deskripsi, persyaratan, deadline, kuota (opsional), tags minat, tipe apply (internal/eksternal), URL eksternal (jika eksternal) | Must |
| FR-006.3 | Peluang yang baru diposting berstatus `pending` dan tidak terlihat oleh Mahasiswa hingga Admin menyetujuinya | Must |
| FR-006.4 | Sistem mengirimkan notifikasi (in-app + email) ke Admin saat peluang baru diajukan | Should |
| FR-006.5 | Mitra Industri dapat mengedit/menghapus peluang berstatus `pending`; tidak dapat mengedit peluang `approved` | Must |
| FR-006.6 | Mitra Industri dapat melihat daftar peluang yang telah diposting beserta statusnya | Must |

---

### FR-007 — Listing Proyek & Rekrutmen (Mitra Industri)

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-007.1 | Mitra Industri dapat memposting listing proyek kolaborasi: judul, deskripsi, skills dibutuhkan, jumlah anggota, deadline pendaftaran, tags minat | Must |
| FR-007.2 | Listing proyek memerlukan persetujuan Admin sebelum terlihat oleh Mahasiswa | Must |
| FR-007.3 | Mitra Industri dapat menutup listing proyek secara manual (status: `closed`) | Must |
| FR-007.4 | Sistem menampilkan jumlah pelamar pada setiap listing (hanya terlihat oleh pemilik dan Admin) | Should |

---

### FR-008 — Browse, Pencarian & Filter

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-008.1 | Mahasiswa dapat menjelajahi semua peluang dan proyek berstatus `approved` | Must |
| FR-008.2 | Pencarian full-text berdasarkan: judul, deskripsi, nama perusahaan | Must |
| FR-008.3 | Filter berdasarkan: tipe (Magang/Kompetisi/Pelatihan/Proyek), tags minat, deadline | Must |
| FR-008.4 | Hasil ditampilkan secara paginasi (default: 10 item per halaman) | Must |
| FR-008.5 | Pengguna yang belum login dapat menjelajahi peluang dalam mode read-only (tanpa apply) | Should |

---

### FR-009 — Sistem Rekomendasi Berbasis Rule

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-009.1 | Dashboard Mahasiswa menampilkan seksi "Direkomendasikan untuk Anda" | Must |
| FR-009.2 | Rekomendasi dihitung secara real-time setiap kali dashboard dimuat | Must |
| FR-009.3 | Algoritma: kembalikan peluang/proyek `approved` di mana (opportunity.tags ∩ mahasiswa.interests) ≥ 1, diurutkan berdasarkan jumlah tag yang cocok (descending), lalu berdasarkan tanggal posting terbaru | Must |
| FR-009.4 | Maksimal 10 item ditampilkan di seksi rekomendasi | Must |
| FR-009.5 | Jika tidak ada kecocokan, fallback ke peluang yang paling baru diposting | Must |

---

### FR-010 — Manajemen Lamaran

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-010.1 | Mahasiswa dapat melamar peluang `apply_type = internal`: mengirimkan cover letter (teks) dan memilih CV dari CV yang telah diunggah | Must |
| FR-010.2 | Mahasiswa diarahkan ke URL eksternal (tab baru) untuk peluang `apply_type = external` | Must |
| FR-010.3 | Mahasiswa tidak dapat melamar peluang internal yang sama lebih dari sekali | Must |
| FR-010.4 | Mitra Industri dapat melihat semua pelamar: nama, NIM, universitas, cover letter, link CV | Must |
| FR-010.5 | Mitra Industri dapat memperbarui status lamaran: `pending` → `reviewed` → `accepted` / `rejected` | Must |
| FR-010.6 | Mahasiswa menerima notifikasi in-app + email saat status lamarannya berubah | Must |
| FR-010.7 | Mahasiswa dapat melamar proyek dengan mengirimkan pesan/cover letter | Must |

---

### FR-011 — Moderasi Konten (Admin)

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-011.1 | Dashboard Admin menampilkan semua peluang dan proyek berstatus `pending` yang memerlukan review | Must |
| FR-011.2 | Admin dapat menyetujui atau menolak peluang/proyek dengan alasan penolakan opsional | Must |
| FR-011.3 | Mitra Industri menerima notifikasi in-app + email saat peluang/proyeknya disetujui atau ditolak | Must |
| FR-011.4 | Admin dapat menonaktifkan atau menghapus akun pengguna mana pun | Must |
| FR-011.5 | Admin dapat melihat dashboard ringkasan: total pengguna, total peluang, total lamaran | Must |

---

### FR-012 — Sistem Notifikasi

| ID | Kebutuhan | Prioritas |
|----|-----------|:---------:|
| FR-012.1 | Notifikasi in-app disimpan di database dan ditampilkan di ikon lonceng/dropdown | Must |
| FR-012.2 | Notifikasi ditandai sebagai telah dibaca saat dilihat | Must |
| FR-012.3 | Notifikasi email via Laravel Mail (Gmail SMTP) dikirim untuk: selamat datang saat registrasi, persetujuan/penolakan peluang, perubahan status lamaran | Must |
| FR-012.4 | Tipe notifikasi: INFO, SUCCESS, WARNING | Should |

---

## 4.0 KEBUTUHAN NON-FUNGSIONAL

### 4.1 Kebutuhan Performa

| ID | Kebutuhan | Target |
|----|-----------|--------|
| NFR-001.1 | Waktu respons API (95th percentile) di bawah beban normal | ≤ 300ms |
| NFR-001.2 | Waktu muat dashboard (termasuk rekomendasi) | ≤ 2 detik |
| NFR-001.3 | Jumlah concurrent users tanpa degradasi performa | ≥ 200 users |
| NFR-001.4 | Query database harus menggunakan indexing yang tepat; pola N+1 query dilarang | Wajib |

### 4.2 Kebutuhan Keamanan

| ID | Kebutuhan | Target |
|----|-----------|--------|
| NFR-002.1 | Seluruh transmisi data menggunakan HTTPS/TLS 1.2+ | Wajib |
| NFR-002.2 | Password di-hash menggunakan bcrypt, cost factor ≥ 12 | Wajib |
| NFR-002.3 | JWT access token TTL 15 menit; refresh token TTL 7 hari | Wajib |
| NFR-002.4 | Refresh token disimpan di httpOnly, Secure, SameSite=Strict cookie | Wajib |
| NFR-002.5 | Seluruh input pengguna divalidasi dan di-sanitize di sisi server (Laravel Validation) | Wajib |
| NFR-002.6 | SQL Injection dicegah melalui Laravel Eloquent ORM / Query Builder | Wajib |
| NFR-002.7 | Rate limiting: endpoint login/register maks. 10 request/IP/15 menit | Wajib |
| NFR-002.8 | Validasi file upload: whitelist MIME type, maks. ukuran file ditegakkan di server | Wajib |
| NFR-002.9 | Kebijakan CORS: hanya mengizinkan origin frontend yang terdaftar | Wajib |
| NFR-002.10 | Tidak ada credentials, token, atau secret yang di-hardcode di source code | Wajib |
| NFR-002.11 | Platform mengikuti prinsip dasar UU PDP: minimasi data, hak hapus akun, kebijakan privasi tersedia | Wajib |

### 4.3 Kebutuhan Keandalan & Portabilitas

| ID | Kebutuhan | Target |
|----|-----------|--------|
| NFR-003.1 | Target uptime sistem selama semester aktif | ≥ 99% |
| NFR-003.2 | Pemeliharaan terencana dikomunikasikan minimal 24 jam sebelumnya | Wajib |
| NFR-003.3 | Arsitektur API bersifat stateless untuk mendukung horizontal scaling | Wajib |
| NFR-003.4 | Skema database dirancang untuk mendukung pertumbuhan data tanpa breaking change | Wajib |
| NFR-003.5 | UI responsif dan dapat digunakan pada layar mobile (≥ 375px) dan desktop | Wajib |
| NFR-003.6 | Perjalanan pengguna inti (browse, apply, post) dapat diselesaikan dalam ≤ 5 klik dari dashboard | Should |
| NFR-003.7 | Sistem menampilkan pesan error yang bermakna untuk setiap kegagalan validasi | Wajib |

---

## 5.0 KEBUTUHAN ANTARMUKA EKSTERNAL

### 5.1 Antarmuka Pengguna (UI)

- Berbasis web, responsif, dibangun dengan **Next.js + Tailwind CSS**
- Menggunakan Google Font **Inter** sebagai tipografi utama
- Design system konsisten: color palette, komponen, spacing, dan iconografi terpadu
- Target aksesibilitas: WCAG 2.1 Level AA

### 5.2 Antarmuka Perangkat Keras

Tidak ada antarmuka perangkat keras langsung. Sistem diakses melalui browser web standar di desktop maupun mobile.

### 5.3 Antarmuka Perangkat Lunak

| Layanan | Tujuan | Protokol/Metode |
|---------|--------|----------------|
| PostgreSQL 15+ | Penyimpanan data utama | TCP via Laravel Eloquent ORM |
| Cloudinary API | Upload & CDN delivery file | HTTPS REST API |
| Gmail SMTP | Notifikasi email transaksional | SMTP/TLS via Laravel Mail |
| Next.js ↔ Laravel | Komunikasi frontend–backend | HTTPS REST (JSON) |

### 5.4 Antarmuka Komunikasi

| Aspek | Spesifikasi |
|-------|-------------|
| Protokol API | HTTPS REST, response format JSON |
| Autentikasi API | Bearer JWT di Authorization header (access token) |
| Manajemen Sesi | httpOnly cookie (refresh token) |
| Kebijakan CORS | Hanya origin frontend yang terdaftar di `.env` |
| Format Tanggal/Waktu | ISO 8601 (UTC), konversi ke WIB di sisi frontend |
| Enkoding | UTF-8 untuk semua request dan response |

---

### Tabel Traceability: FR → NFR

| Kebutuhan Fungsional | NFR Terkait |
|----------------------|-------------|
| FR-001 (Registrasi) | NFR-002.2 (bcrypt), NFR-002.5 (validasi input) |
| FR-002 (Autentikasi) | NFR-002.3, NFR-002.4 (JWT + cookie), NFR-002.7 (rate limit) |
| FR-003 (RBAC) | NFR-002.1 (HTTPS), NFR-002.9 (CORS) |
| FR-004 (Profil & CV) | NFR-002.8 (file validation), NFR-002.11 (UU PDP) |
| FR-008 (Browse/Search) | NFR-001.1, NFR-001.4 (performa & indexing) |
| FR-009 (Rekomendasi) | NFR-001.2 (load time ≤ 2 detik) |
| FR-012 (Notifikasi) | NFR-003.1 (uptime ≥ 99%) |

---

*Dokumen ini dibuat sesuai standar IEEE Std 830-1998 dan merupakan dokumen hidup. Perubahan apapun harus melalui proses change request formal.*

**Versi:** 1.0.0 | **Tanggal:** 06 Mei 2026 | **Klasifikasi:** Internal — Kelompok 6
