# MASTER TEST PLAN (MTP)
## I.R.O.N L.U.N.G

| Item | Detail |
|------|--------|
| **Standar** | IEEE Std 829-2008 |
| **Versi** | 1.0.0 |
| **Tanggal** | 06 Mei 2026 |
| **Penulis** | Evan Razzan Adytaputra (QA Lead) |
| **Reviewer** | Anders Emmanuel Tan (Project Manager) |
| **Status** | Draft |

---

## 1.0 IDENTIFIKASI TEST PLAN

| Field | Detail |
|-------|--------|
| **Nama Sistem** | I.R.O.N L.U.N.G — Intelligent Resource Organizer for Networking, Learning, Unified iNternships, and Group collaboration |
| **Versi Sistem** | 1.0.0 (MVP) |
| **Lingkup** | Full-stack web platform (Next.js Frontend + Laravel Backend + PostgreSQL) |
| **Tujuan Dokumen** | Mendefinisikan strategi, lingkungan, kriteria, dan jadwal pengujian sistem secara menyeluruh |
| **Tim** | Kelompok 6 — Anders Emmanuel Tan, Dhimas Early Oceandy, Azhar Maulana, Evan Razzan Adytaputra |

---

## 2.0 REFERENSI

| # | Dokumen | Versi |
|---|---------|-------|
| 1 | SRS.md — Software Requirements Specification | 1.0.0 |
| 2 | USE_CASE.md — Use Case Document | 1.0.0 |
| 3 | SAD.md — System Architecture Document | 1.0.0 |
| 4 | DATABASE_DESIGN.md + schema.sql | 1.0.0 |
| 5 | IEEE Std 829-2008: Software and System Test Documentation | - |
| 6 | IEEE Std 730-2014: Software Quality Assurance | - |
| 7 | OWASP Testing Guide v4.2 | - |

---

## 3.0 ITEM YANG DIUJI

Seluruh item berikut diturunkan langsung dari Functional Requirements (FR) SRS v1.0.0:

| ID Item | Modul | FR Terkait | Tipe Pengujian |
|---------|-------|-----------|----------------|
| TI-001 | Registrasi Pengguna | FR-001.1 – 001.8 | Unit, Integration, System |
| TI-002 | Autentikasi & Sesi (JWT) | FR-002.1 – 002.6 | Unit, Integration, Security |
| TI-003 | Role-Based Access Control | FR-003.1 – 003.5 | Integration, Security |
| TI-004 | Profil & CV Mahasiswa | FR-004.1 – 004.5 | Unit, Integration, System |
| TI-005 | Onboarding Tag Minat | FR-005.1 – 005.3 | Unit, System |
| TI-006 | Posting Peluang (Mitra) | FR-006.1 – 006.6 | Unit, Integration, System |
| TI-007 | Listing Proyek Kolaborasi | FR-007.1 – 007.4 | Unit, Integration, System |
| TI-008 | Browse, Pencarian & Filter | FR-008.1 – 008.5 | System, Performance |
| TI-009 | Sistem Rekomendasi (Rule-Based) | FR-009.1 – 009.5 | Unit, System, Performance |
| TI-010 | Manajemen Lamaran Internal | FR-010.1 – 010.3 | Unit, Integration, System |
| TI-011 | Redirect Lamaran Eksternal | FR-010.2 | System |
| TI-012 | Review Pelamar & Update Status | FR-010.4 – 010.6 | Integration, System |
| TI-013 | Moderasi Konten Admin | FR-011.1 – 011.5 | Integration, System |
| TI-014 | Notifikasi In-App & Email | FR-012.1 – 012.4 | Integration, System |
| TI-015 | Upload File (CV, Portofolio) | FR-004.2 – 004.4 | Unit, Integration, Security |
| TI-016 | Hapus Akun (UU PDP) | NFR-006.2 | System |

---

## 4.0 FITUR YANG TIDAK DIUJI & ALASANNYA

| Fitur | Alasan Tidak Diuji |
|-------|--------------------|
| Machine Learning Recommendation | Tidak masuk scope MVP v1.0 |
| OAuth Google Login | Tidak masuk scope MVP v1.0 |
| WebSocket / Real-time Notification | Tidak masuk scope MVP v1.0 |
| Integrasi SIAKAD | Tidak ada integrasi eksternal di v1.0 |
| Upload KTM Verifikasi | Ditunda ke v2.0 |
| Mobile Native App | Tidak dikembangkan di v1.0 |
| Multi-bahasa (i18n) | Tidak masuk scope |
| Task Management Proyek | Tidak masuk scope MVP |
| Cloudinary Internal SDK | Third-party; diasumsikan reliable; hanya diuji integrasi upload/download |
| Gmail SMTP Internal | Third-party; diuji dari sisi pengiriman email oleh sistem (tidak diuji internal Gmail) |

---

## 5.0 PENDEKATAN PENGUJIAN

### 5.1 Unit Testing

**Tujuan:** Memverifikasi setiap unit kode (fungsi, method, class) bekerja dengan benar secara terisolasi.

**Cakupan:**
- Backend: Service classes, Repository methods, validation logic, helper functions
- Frontend: Custom hooks, utility functions, component rendering

**Tools:**

| Lingkungan | Framework | Target Coverage |
|-----------|-----------|:--------------:|
| Backend (PHP/Laravel) | PHPUnit 10+ | ≥ 80% line coverage pada Service & Repository |
| Frontend (Next.js) | Jest + React Testing Library | ≥ 70% pada hooks & utils |

**Konvensi:**
- Setiap Service method memiliki minimal 1 happy path + 1 edge case test
- Mock semua external dependency (DB, Cloudinary, Email) saat unit test
- Test file dinamai `*Test.php` (PHPUnit) dan `*.test.ts` (Jest)

---

### 5.2 Integration Testing

**Tujuan:** Memverifikasi interaksi antar komponen sistem (API endpoint ↔ Service ↔ Database).

**Cakupan:**
- Semua API endpoint (auth, mahasiswa, mitra, admin)
- Alur autentikasi JWT end-to-end (login → access → refresh → logout)
- Alur notifikasi (trigger event → listener → database notification)
- Upload file ke Cloudinary (menggunakan test environment Cloudinary)

**Tools:**

| Tool | Kegunaan |
|------|---------|
| PHPUnit (Laravel HTTP Tests) | Test API endpoint dengan `$this->postJson()`, `$this->getJson()` |
| Laravel Sanctum / JWT Test Helpers | Simulasi autentikasi dalam test |
| SQLite in-memory / PostgreSQL test DB | Database terisolasi untuk test |
| Postman Collection | Manual API testing & smoke test |

**Strategi:** Setiap test case integration menggunakan database testing dengan `RefreshDatabase` trait sehingga setiap test berjalan dengan data bersih.

---

### 5.3 System Testing

**Tujuan:** Memverifikasi sistem secara end-to-end sesuai dengan use case dan SRS.

**Cakupan:** Seluruh 16 item yang diuji (TI-001 s.d. TI-016) diuji secara end-to-end melalui browser.

**Tools:**

| Tool | Kegunaan |
|------|---------|
| Playwright | E2E browser automation test |
| Laravel Dusk (opsional) | Browser testing terintegrasi Laravel |
| Postman | API smoke test di staging environment |

**Lingkungan:** Staging server yang identik dengan production (VPS Ubuntu, data seed).

---

### 5.4 User Acceptance Testing (UAT)

**Tujuan:** Memvalidasi sistem memenuhi kebutuhan pengguna nyata dari perspektif bisnis.

**Peserta UAT:**

| Kelompok | Jumlah | Peran |
|----------|:------:|-------|
| Mahasiswa (pengguna aktual) | 5–10 orang | Uji alur browse, apply, portofolio |
| Mitra Industri (simulasi) | 2–3 orang | Uji alur posting peluang, review pelamar |
| Admin (internal tim) | 1 orang | Uji alur moderasi & manajemen akun |
| Dosen Pembimbing | 1 orang | Validasi kesesuaian dengan tujuan akademik |

**Skenario UAT:**
1. Mahasiswa baru mendaftar → onboarding → browse → apply → cek status
2. Mitra baru mendaftar → tunggu approval → posting peluang → lihat pelamar
3. Admin login → moderasi peluang pending → approve/reject → cek notifikasi
4. Mahasiswa melihat rekomendasi setelah update tag minat

**Kriteria Selesai UAT:** ≥ 90% peserta menyelesaikan skenario tanpa bantuan; tidak ada critical bug.

---

### 5.5 Security Testing

**Tujuan:** Memverifikasi sistem tahan terhadap ancaman keamanan umum (OWASP Top 10).

| Ancaman | Test yang Dilakukan |
|---------|-------------------|
| SQL Injection | Input malicious pada semua form dan parameter query |
| XSS (Cross-Site Scripting) | Input script pada field teks; verifikasi output di-escape |
| Broken Authentication | Test akses endpoint tanpa token; test token expired; test token palsu |
| Broken Access Control | Test akses endpoint role lain (mahasiswa akses admin endpoint) |
| Rate Limiting | Kirim > 10 request login dalam 15 menit dari satu IP |
| Sensitive Data Exposure | Verifikasi password tidak muncul di response API |
| File Upload Abuse | Upload file non-PDF/non-image ke endpoint upload; upload file oversized |
| CORS Misconfiguration | Request dari origin tidak terdaftar |

**Tools:** OWASP ZAP (automated scan), manual test via Postman/curl.

---

### 5.6 Performance Testing

**Tujuan:** Memverifikasi sistem memenuhi NFR performa (NFR-001.1 s.d. NFR-001.3).

**Target SLA:**
| Metrik | Target |
|--------|--------|
| API response time (P95) | ≤ 300ms |
| Dashboard load time | ≤ 2 detik |
| Concurrent users | ≥ 200 tanpa degradasi |

**Tools:** k6 (load testing), Laravel Telescope (profiling), PostgreSQL EXPLAIN ANALYZE.

**Skenario Load Test:**
- Baseline: 10 concurrent users, 5 menit
- Stress: 200 concurrent users, 10 menit
- Spike: Ramp dari 10 → 200 users dalam 30 detik

---

## 6.0 KRITERIA LULUS/GAGAL

### 6.1 Exit Criteria (Lulus)

| Level | Kriteria Lulus |
|-------|---------------|
| **Unit Test** | ≥ 80% code coverage Backend Service/Repo; semua test pass (0 failing) |
| **Integration Test** | 100% happy path API test pass; 0 critical bug terbuka |
| **System Test** | ≥ 95% test case pass; tidak ada bug Severity 1 (Critical) terbuka |
| **Security Test** | 0 vulnerability High/Critical terbuka; semua OWASP item lulus |
| **Performance Test** | API P95 ≤ 300ms; dashboard ≤ 2 detik; 200 concurrent users tanpa error |
| **UAT** | ≥ 90% skenario diselesaikan tanpa bantuan; user satisfaction ≥ 4/5 |

### 6.2 Entry Criteria (Siap Memulai Testing)

| Level | Kondisi |
|-------|---------|
| **Unit Test** | Kode sudah di-commit ke branch; tidak ada syntax error |
| **Integration Test** | Unit test sudah pass; staging DB sudah di-migrate dan di-seed |
| **System Test** | Integration test sudah pass; staging environment sudah berjalan |
| **UAT** | System test sudah pass; staging data seed selesai; peserta UAT dikonfirmasi |

### 6.3 Klasifikasi Bug/Defect

| Severity | Definisi | SLA Fix |
|----------|---------|:-------:|
| **S1 — Critical** | Sistem tidak bisa digunakan; data loss; keamanan bocor | 24 jam |
| **S2 — High** | Fitur utama tidak berfungsi; tidak ada workaround | 48 jam |
| **S3 — Medium** | Fitur berfungsi sebagian; ada workaround | 1 minggu |
| **S4 — Low** | Kosmetik, typo, minor UX issue | Sebelum release |

---

## 7.0 LINGKUNGAN PENGUJIAN

### 7.1 Hardware

| Lingkungan | Spesifikasi |
|-----------|-------------|
| **Staging Server** | VPS 2 vCPU, 4GB RAM, 50GB SSD (Ubuntu 22.04 LTS) — identik production |
| **Local Dev** | Laptop tim: min. 8GB RAM, Windows/macOS/Linux |
| **Load Testing** | k6 dijalankan dari local machine atau GitHub Actions runner |

### 7.2 Software

| Software | Versi | Tujuan |
|---------|-------|--------|
| Ubuntu | 22.04 LTS | OS staging server |
| PHP | 8.2+ | Runtime Laravel backend |
| PostgreSQL | 15+ | Database |
| Node.js | 20 LTS | Build & run Next.js |
| PHPUnit | 10+ | Unit & integration testing backend |
| Jest | 29+ | Unit testing frontend |
| Playwright | 1.40+ | E2E browser testing |
| k6 | 0.49+ | Load/performance testing |
| OWASP ZAP | 2.14+ | Security scanning |
| Postman | Latest | API testing & documentation |
| GitHub Actions | - | CI/CD pipeline otomatis |

### 7.3 Data Uji

| Tipe Data | Deskripsi |
|-----------|-----------|
| **Seed Data** | 20 tag minat, 3 akun dummy (1 mahasiswa, 1 mitra, 1 admin) |
| **Test Data Mahasiswa** | 5 profil mahasiswa dengan variasi tag minat |
| **Test Data Mitra** | 3 profil perusahaan dengan status berbeda (pending, approved, rejected) |
| **Test Data Peluang** | 10 peluang (campuran status, tipe, apply_type) |
| **Test Data Lamaran** | 15 lamaran dengan variasi status |
| **File Test** | CV valid (PDF 3MB), file invalid (exe, PDF > 5MB), gambar (JPG) |

### 7.4 Tools Ringkasan

| Kategori | Tool |
|----------|------|
| Unit Testing Backend | PHPUnit 10 |
| Unit Testing Frontend | Jest + React Testing Library |
| E2E Testing | Playwright |
| API Testing | Postman |
| Load Testing | k6 |
| Security Testing | OWASP ZAP + Manual |
| Bug Tracking | GitHub Issues (label: bug, severity) |
| CI/CD | GitHub Actions |
| Code Coverage | PHPUnit Coverage + Istanbul (Jest) |

---

## 8.0 MATRIKS TANGGUNG JAWAB

| Aktivitas Pengujian | Pelaksana | Reviewer | Approver |
|--------------------|-----------|----------|----------|
| Penulisan Unit Test Backend | Dhimas Early Oceandy | Evan Razzan | Anders Emmanuel |
| Penulisan Unit Test Frontend | Azhar Maulana | Evan Razzan | Anders Emmanuel |
| Penulisan Integration Test | Dhimas Early Oceandy | Evan Razzan | Anders Emmanuel |
| Penulisan E2E Test (Playwright) | Evan Razzan Adytaputra | Anders Emmanuel | - |
| Eksekusi Security Test | Evan Razzan Adytaputra | Anders Emmanuel | - |
| Eksekusi Performance Test (k6) | Evan Razzan Adytaputra | Anders Emmanuel | - |
| Koordinasi UAT | Anders Emmanuel Tan | Dosen Pembimbing | - |
| Eksekusi UAT | Peserta UAT (mahasiswa/mitra) | Evan Razzan | Dosen Pembimbing |
| Bug Triage & Severity Assignment | Evan Razzan Adytaputra | Anders Emmanuel | - |
| Fix Bug S1/S2 | Dhimas / Azhar (sesuai area) | Evan Razzan | Anders Emmanuel |
| Regresi Test setelah Bug Fix | Evan Razzan Adytaputra | - | - |
| Sign-off Final (Go/No-Go) | Evan Razzan Adytaputra | Anders Emmanuel | Dosen Pembimbing |

---

## 10.0 JADWAL PENGUJIAN

| Fase | Aktivitas | Periode | PIC |
|------|-----------|---------|-----|
| **Persiapan** | Setup test environment, seed data, Postman collection | Juni 2026, M1 | Evan |
| **Unit Test** | Backend (PHPUnit) + Frontend (Jest) | Juli 2026, M2–M3 | Dhimas + Azhar |
| **Integration Test** | API endpoint testing, alur auth, notifikasi | Agustus 2026, M1 | Dhimas + Evan |
| **System Test (E2E)** | Playwright automation, full use case flow | Agustus 2026, M2–M3 | Evan |
| **Security Test** | OWASP ZAP scan + manual penetration test | September 2026, M1 | Evan |
| **Performance Test** | k6 load test (baseline + stress + spike) | September 2026, M1 | Evan |
| **Bug Fix Cycle** | Perbaikan defect S1–S3 + regression test | September 2026, M2 | Tim |
| **UAT** | Skenario UAT dengan pengguna nyata di staging | Oktober 2026, M1 | Anders + Evan |
| **Final Regression** | Full regression test pasca UAT bug fix | Oktober 2026, M2 | Evan |
| **Go-Live Approval** | Sign-off QA + deployment production | Oktober 2026, M3 | Tim + Dosen |

> M1 = Minggu 1, M2 = Minggu 2, M3 = Minggu 3 dari bulan tersebut.

---

*Dokumen ini merupakan bagian dari dokumentasi sistem I.R.O.N L.U.N.G v1.0.0*
*Standar: IEEE Std 829-2008 | Detail Test Case: lihat TEST_CASES.md*

**Versi:** 1.0.0 | **Tanggal:** 06 Mei 2026 | **Klasifikasi:** Internal — Kelompok 6
