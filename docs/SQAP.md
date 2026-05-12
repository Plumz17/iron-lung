# SOFTWARE QUALITY ASSURANCE PLAN (SQAP)
## I.R.O.N L.U.N.G

| Item | Detail |
|------|--------|
| **Standar** | IEEE Std 730-2014 |
| **Versi** | 1.0.0 |
| **Tanggal** | 06 Mei 2026 |
| **Penulis** | Evan Razzan Adytaputra (QA Lead) |
| **Referensi** | SRS v1.0.0, MTP v1.0.0, SAD v1.0.0 |

---

## 1.0 TUJUAN & RUANG LINGKUP SQA

### 1.1 Tujuan

Dokumen SQAP ini mendefinisikan rencana, prosedur, dan standar yang akan diterapkan untuk memastikan kualitas sistem **I.R.O.N L.U.N.G** memenuhi persyaratan yang ditetapkan dalam SRS v1.0.0. SQAP ini menjadi panduan wajib bagi seluruh anggota tim dalam setiap fase SDLC.

**Tujuan spesifik:**
1. Menetapkan Quality Gates yang harus dilalui sebelum setiap fase berikutnya dimulai
2. Mendefinisikan standar pengkodean, pengujian, dan dokumentasi
3. Mengatur proses manajemen defect secara terstruktur
4. Menetapkan metrik kualitas yang terukur dan target pencapaiannya

### 1.2 Ruang Lingkup

SQAP ini berlaku untuk:
- Seluruh source code Backend (Laravel/PHP) dan Frontend (Next.js/TypeScript)
- Seluruh proses pengujian (unit, integration, system, security, performance, UAT)
- Seluruh dokumen teknis proyek
- Proses review dan audit kode
- Manajemen defect dari penemuan hingga penutupan

**Tidak termasuk:** Library/framework pihak ketiga, infrastruktur Cloudinary dan Gmail SMTP.

---

## 2.0 MANAJEMEN SQA

### 2.1 Organisasi & Tanggung Jawab

| Peran | Anggota | Tanggung Jawab SQA |
|-------|---------|-------------------|
| **QA Lead** | Evan Razzan Adytaputra | Mengelola seluruh proses QA; menulis & memelihara SQAP; meng-gate setiap fase; melaporkan metrik kualitas |
| **Project Manager** | Anders Emmanuel Tan | Memastikan Gate dipenuhi sebelum lanjut; eskalasi risk; final sign-off |
| **Backend Developer** | Dhimas Early Oceandy | Menulis unit & integration test backend; mematuhi coding standard; memperbaiki defect S1/S2 backend |
| **Frontend Developer** | Azhar Maulana | Menulis unit test frontend; mematuhi coding standard; memperbaiki defect S1/S2 frontend |
| **Dosen Pembimbing** | TBD | Review dokumen SRS & SQAP; UAT sign-off akademik |

### 2.2 Quality Gates dalam SDLC

Quality Gate adalah **checkpoint wajib** yang harus dipenuhi sebelum tim boleh melanjutkan ke fase berikutnya. Jika gate tidak lulus, tim HARUS menyelesaikan remediation sebelum melanjutkan.

---

#### GATE 1 — Requirements Review
**Posisi:** Sebelum fase Desain Arsitektur dimulai

| Kriteria | Target | Verifikasi |
|----------|:------:|-----------|
| SRS telah direview dan ditandatangani oleh semua anggota tim | ✓ | Signature di PROJECT_CHARTER.md |
| Semua FR memiliki prioritas (Must/Should/Could) yang terdefinisi | ✓ | Cek SRS Seksi 3 |
| Tidak ada ambiguitas pada FR Must yang belum diselesaikan | 0 open issue | GitHub Issues label `requirements` |
| Use Case Document mencakup semua FR | 100% traceability | Cek USE_CASE.md Traceability Matrix |
| Dosen pembimbing telah me-review SRS | ✓ | Email/dokumentasi review |

**Gatekeeper:** Anders Emmanuel Tan (PM)
**Output:** SRS v1.0.0 — Status: Approved

---

#### GATE 2 — Design Review
**Posisi:** Sebelum fase Coding/Implementasi dimulai

| Kriteria | Target | Verifikasi |
|----------|:------:|-----------|
| SAD (System Architecture Document) selesai dan disetujui | ✓ | SAD.md ditandatangani |
| ERD final disetujui; schema.sql dibuat | ✓ | DATABASE_DESIGN.md + schema.sql |
| API Contract (OpenAPI 3.0) tersedia minimal untuk semua endpoint MVP | ✓ | File api_contract.yaml |
| Tidak ada keputusan arsitektur mayor yang masih open | 0 open ADR | SAD.md Seksi 7 |
| Semua dependency/library yang digunakan sudah diidentifikasi versinya | ✓ | package.json + composer.json |
| Database migration scripts siap dijalankan | ✓ | Test `php artisan migrate` di local |

**Gatekeeper:** Evan Razzan Adytaputra (QA Lead)
**Output:** SAD v1.0.0 + schema.sql + api_contract.yaml — Status: Approved

---

#### GATE 3 — Code Review + Unit Test (per Modul)
**Posisi:** Setelah setiap modul/fitur selesai dikoding, sebelum di-merge ke branch `develop`

| Kriteria | Target | Verifikasi |
|----------|:------:|-----------|
| Code review dilakukan oleh minimal 1 anggota tim selain penulis | ✓ | GitHub Pull Request approval |
| Tidak ada issue Critical/High dari static analysis (PHPStan, ESLint) | 0 | CI pipeline green |
| Cyclomatic complexity per fungsi | ≤ 10 | PHPStan + ESLint report |
| Panjang fungsi | ≤ 50 baris | Code review checklist |
| Unit test coverage modul Backend (Service/Repository) | ≥ 80% | PHPUnit coverage report |
| Unit test coverage modul Frontend (hooks/utils) | ≥ 70% | Jest coverage report |
| Semua unit test passing (0 failing) | 100% pass | CI pipeline |
| Tidak ada hardcoded credential di code | 0 | Automated secret scanner |
| Naming convention dipatuhi | ✓ | Code review checklist |

**Gatekeeper:** Evan Razzan Adytaputra (QA Lead) melalui GitHub PR review
**Output:** PR merged ke `develop` branch

---

#### GATE 4 — Integration Test
**Posisi:** Sebelum fase UAT dimulai

| Kriteria | Target | Verifikasi |
|----------|:------:|-----------|
| Semua API endpoint happy path test passing | 100% | PHPUnit HTTP Tests |
| Alur auth end-to-end (register→login→refresh→logout) berfungsi | ✓ | TC-001 s.d. TC-009 pass |
| Alur utama (posting peluang → moderasi → browse → apply) berfungsi | ✓ | E2E test pass |
| Tidak ada defect Severity S1 yang masih open | 0 | GitHub Issues |
| Defect S2 yang masih open | ≤ 2 dengan workaround | GitHub Issues |
| Security test dasar selesai: SQL injection, XSS, rate limiting | ✓ | TC-027, TC-028, TC-007 pass |
| Staging environment identik production sudah berjalan | ✓ | Deployment checklist |
| Seed data untuk UAT sudah disiapkan | ✓ | Seeder script berjalan |

**Gatekeeper:** Evan Razzan Adytaputra (QA Lead) + Anders Emmanuel Tan (PM)
**Output:** Integration Test Report — Status: Go for UAT

---

#### GATE 5 — UAT Sign-off
**Posisi:** Sebelum deployment ke production (Go-Live)

| Kriteria | Target | Verifikasi |
|----------|:------:|-----------|
| ≥ 90% skenario UAT diselesaikan tanpa bantuan | ≥ 90% | UAT Report |
| User satisfaction score | ≥ 4.0 / 5.0 | Kuesioner UAT |
| Tidak ada defect S1 yang ditemukan saat UAT | 0 | UAT defect log |
| Semua defect S2 dari UAT sudah diperbaiki dan diverifikasi | 0 open S2 | Regression test |
| Performance test lulus (P95 ≤ 300ms, 200 concurrent) | ✓ | k6 report |
| SSL/TLS aktif di production domain | ✓ | SSL checker |
| Backup database otomatis aktif | ✓ | Cron job terverifikasi |
| Dosen pembimbing memberikan sign-off akademik | ✓ | Dokumen sign-off |

**Gatekeeper:** Anders Emmanuel Tan (PM) + Dosen Pembimbing
**Output:** UAT Sign-off Document → **GO-LIVE**

---

## 3.0 DOKUMENTASI SQA

| Kode | Nama Dokumen | Dibuat Oleh | Direview | Target Selesai | Status |
|------|-------------|-------------|----------|:--------------:|:------:|
| DOC-001 | Project Charter | Anders Emmanuel | Semua Tim + Dosen | Mei 2026, M2 | ✅ |
| DOC-002 | SRS (IEEE 830) | Anders Emmanuel | Semua Tim + Dosen | Mei 2026, M2 | ✅ |
| DOC-003 | Use Case Document | Anders Emmanuel | Evan + Dosen | Mei 2026, M2 | ✅ |
| DOC-004 | Database Design + schema.sql | Dhimas Early | Evan + Anders | Mei 2026, M2 | ✅ |
| DOC-005 | SAD (IEEE 1016) | Anders Emmanuel | Semua Tim | Mei 2026, M2 | ✅ |
| DOC-006 | API Contract (OpenAPI 3.0) | Dhimas Early | Azhar + Evan | Juni 2026, M1 | ⏳ |
| DOC-007 | Master Test Plan (IEEE 829) | Evan Razzan | Anders | Mei 2026, M2 | ✅ |
| DOC-008 | Test Cases Detail | Evan Razzan | Anders | Mei 2026, M2 | ✅ |
| DOC-009 | SQAP (IEEE 730) — ini | Evan Razzan | Anders + Dosen | Mei 2026, M2 | ✅ |
| DOC-010 | Unit Test Report (Backend) | Dhimas Early | Evan | Juli 2026, M3 | ⏳ |
| DOC-011 | Unit Test Report (Frontend) | Azhar Maulana | Evan | Juli 2026, M3 | ⏳ |
| DOC-012 | Integration Test Report | Evan Razzan | Anders | Agustus 2026, M1 | ⏳ |
| DOC-013 | Security Test Report | Evan Razzan | Anders | September 2026, M1 | ⏳ |
| DOC-014 | Performance Test Report (k6) | Evan Razzan | Anders | September 2026, M1 | ⏳ |
| DOC-015 | UAT Report + Sign-off | Anders Emmanuel | Dosen Pembimbing | Oktober 2026, M1 | ⏳ |
| DOC-016 | Release Notes v1.0.0 | Anders Emmanuel | Semua Tim | Oktober 2026, M3 | ⏳ |

---

## 4.0 STANDAR, PRAKTIK & KONVENSI

### 4.1 Naming Convention

#### Backend (Laravel/PHP)

| Elemen | Konvensi | Contoh |
|--------|----------|--------|
| Class | PascalCase | `OpportunityService`, `MahasiswaRepository` |
| Method | camelCase | `getRecommendations()`, `updateStatus()` |
| Variable | camelCase | `$mahasiswaId`, `$accessToken` |
| Database Table | snake_case, plural | `mahasiswa_profiles`, `opportunity_tags` |
| Database Column | snake_case | `created_at`, `cover_letter` |
| Migration File | snake_case timestamp prefix | `2026_06_01_create_users_table.php` |
| API Route | kebab-case, plural noun | `/api/opportunities`, `/api/mahasiswa-profiles` |
| Env Variable | UPPER_SNAKE_CASE | `JWT_SECRET`, `CLOUDINARY_API_KEY` |

#### Frontend (Next.js/TypeScript)

| Elemen | Konvensi | Contoh |
|--------|----------|--------|
| Component | PascalCase | `OpportunityCard`, `DashboardLayout` |
| Hook | camelCase, prefix `use` | `useAuth()`, `useRecommendations()` |
| Utility Function | camelCase | `formatDeadline()`, `truncateText()` |
| CSS Class (Tailwind) | kebab-case | `opportunity-card`, `navbar-link` |
| File (Component) | PascalCase | `OpportunityCard.tsx` |
| File (Page) | kebab-case (App Router) | `page.tsx` dalam `/app/browse/` |
| Constant | UPPER_SNAKE_CASE | `MAX_FILE_SIZE`, `API_BASE_URL` |
| Type/Interface | PascalCase, prefix `I` untuk interface | `IUser`, `OpportunityType` |

### 4.2 Coding Standards

| Aturan | Nilai | Alasan |
|--------|:-----:|--------|
| Cyclomatic Complexity maksimum per fungsi | ≤ 10 | Fungsi dengan CC > 10 sulit diuji dan dipahami |
| Panjang fungsi maksimum | ≤ 50 baris | Mendorong SRP (Single Responsibility Principle) |
| Panjang baris maksimum | ≤ 120 karakter | Keterbacaan di layar standar |
| Kedalaman nesting maksimum | ≤ 4 level | Mencegah "arrow anti-pattern" |
| Parameter fungsi maksimum | ≤ 5 parameter | Lebih dari 5 → gunakan object/DTO |
| Duplikasi kode (DRY) | 0 blok duplikat > 10 baris | Gunakan extract method / helper |
| Comment wajib | Setiap fungsi publik | PHPDoc / JSDoc dengan @param, @return, @throws |
| Tidak ada `console.log` di production code | 0 | Gunakan structured logger |
| Tidak ada `dd()` / `var_dump()` di production code | 0 | Debug code tidak boleh di-commit |

### 4.3 Git & Branch Convention

| Branch | Tujuan | Merge Target |
|--------|--------|-------------|
| `main` | Production-ready code | - |
| `develop` | Integration branch | `main` (via release) |
| `feature/[nama-fitur]` | Pengembangan fitur baru | `develop` |
| `bugfix/[nama-bug]` | Perbaikan bug non-kritis | `develop` |
| `hotfix/[nama-fix]` | Perbaikan bug kritis production | `main` + `develop` |
| `release/[versi]` | Persiapan release | `main` |

**Commit Message Format:** `[type]: [deskripsi singkat]`
- type: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`
- Contoh: `feat: add recommendation endpoint with tag matching`

**PR Rules:**
- Minimal 1 approval sebelum merge
- CI pipeline harus hijau (lint + test pass)
- Tidak ada merge conflict

### 4.4 Wajib Tools

| Kategori | Tool | Versi | Tujuan |
|----------|------|:-----:|--------|
| **Unit Testing Backend** | PHPUnit | 10+ | Pengujian unit & integration Laravel |
| **Unit Testing Frontend** | Jest | 29+ | Pengujian unit komponen & hooks |
| **E2E Testing** | Playwright | 1.40+ | Pengujian end-to-end browser |
| **API Testing** | Postman + Newman | Latest | Pengujian & otomasi API endpoint |
| **Code Coverage Backend** | Xdebug + PHPUnit Coverage | - | Laporan coverage PHP |
| **Code Coverage Frontend** | Istanbul/nyc | - | Laporan coverage TypeScript |
| **Linting Backend** | PHP-CS-Fixer | 3+ | Konsistensi coding style PHP (PSR-12) |
| **Linting Frontend** | ESLint + Prettier | 8+ / 3+ | Konsistensi coding style TypeScript |
| **Static Analysis Backend** | PHPStan | Level 6+ | Deteksi bug statik PHP tanpa eksekusi |
| **Static Analysis Frontend** | TypeScript strict mode | 5+ | Type checking ketat |
| **Security Scanner** | OWASP ZAP | 2.14+ | Automated vulnerability scanning |
| **Secret Detection** | GitLeaks / GitHub Secret Scanning | - | Cegah credential di-commit |
| **Performance Testing** | k6 | 0.49+ | Load & stress testing |
| **CI/CD** | GitHub Actions | - | Otomasi lint, test, coverage, deploy |

---

## 5.0 TINJAUAN & AUDIT

### 5.1 Code Review Process

**Setiap Pull Request harus melalui:**

```
Developer selesai coding
        │
        ▼
Buat Pull Request ke branch develop
        │
        ▼
CI Pipeline Otomatis:
  ├── Lint check (PHP-CS-Fixer / ESLint)
  ├── Static analysis (PHPStan / TS strict)
  ├── Unit test (PHPUnit / Jest)
  ├── Coverage check (≥ 80% backend, ≥ 70% frontend)
  └── Secret detection (GitLeaks)
        │
   Pipeline Green?
   ┌────┴────┐
   NO       YES
   │         │
Fix &     Peer Review
Repush    (1 reviewer)
           │
      Approved?
      ┌────┴────┐
      NO       YES
      │         │
  Request    Merge ke
  Changes    develop
```

### 5.2 Code Review Checklist

**Fungsionalitas:**
- [ ] Kode melakukan apa yang dimaksudkan (sesuai FR)
- [ ] Edge case ditangani (null, empty, boundary)
- [ ] Error handling eksplisit (tidak ada silent fail)

**Keamanan:**
- [ ] Tidak ada hardcoded credential/secret
- [ ] Input divalidasi sebelum diproses
- [ ] Query menggunakan ORM/parameterized (tidak raw SQL dinamis)
- [ ] File upload divalidasi tipe dan ukurannya

**Kualitas Kode:**
- [ ] Nama variabel/fungsi deskriptif
- [ ] Fungsi ≤ 50 baris; CC ≤ 10
- [ ] Tidak ada kode duplikat > 10 baris
- [ ] Semua fungsi publik memiliki PHPDoc/JSDoc
- [ ] Tidak ada `console.log`, `dd()`, `var_dump()`

**Testing:**
- [ ] Unit test ada untuk semua path baru
- [ ] Coverage tidak turun dari threshold

### 5.3 Jadwal Tinjauan Formal

| Jenis Tinjauan | Frekuensi | Peserta | Output |
|----------------|-----------|---------|--------|
| **Sprint Review** | 2 minggu sekali | Seluruh tim | Progress report, backlog update |
| **SQA Weekly Review** | Mingguan | Evan + Anders | Defect status, metrik update |
| **Architecture Review** | Awal setiap fase besar | Seluruh tim | ADR update jika perlu |
| **Milestone Review** | Per gate (G1–G5) | Seluruh tim + Dosen | Gate approval / remediation plan |

---

## 6.0 MANAJEMEN DEFECT

### 6.1 Siklus Hidup Defect

```
[Ditemukan] → NEW
                │
                ▼ QA Lead triage & assign
            ASSIGNED
                │
                ▼ Developer mulai fix
           IN PROGRESS
                │
                ▼ Developer selesai fix, buat PR
              FIXED
                │
                ▼ QA Lead verifikasi fix di test env
            VERIFIED
                │
              Pass?
          ┌────┴────┐
          NO        YES
          │          │
       REOPENED    CLOSED
```

### 6.2 Klasifikasi Severity & Priority

| Severity | Definisi | SLA Fix | Contoh |
|----------|---------|:-------:|--------|
| **S1 — Critical** | Sistem crash, data loss, security breach, fitur utama tidak bisa digunakan sama sekali | **24 jam** | Login tidak berfungsi, data user bocor, password tidak di-hash |
| **S2 — High** | Fitur utama tidak berfungsi sesuai SRS; tidak ada workaround yang wajar | **48 jam** | Lamaran tidak bisa disubmit, moderasi admin error |
| **S3 — Medium** | Fitur berfungsi sebagian; ada workaround yang bisa diterima | **1 minggu** | Filter tidak akurat, notifikasi terlambat |
| **S4 — Low** | Masalah kosmetik, typo, minor UX; tidak mengganggu fungsionalitas | **Sebelum release** | Typo label, warna button tidak sesuai design |
| **S5 — Enhancement** | Permintaan fitur baru di luar scope MVP | **Backlog v2.0** | Tambah fitur dark mode, export PDF |

### 6.3 Defect Report Template (GitHub Issue)

```markdown
## Bug Report — [Judul Singkat]

**Severity:** S1 / S2 / S3 / S4
**Modul:** [Nama modul, contoh: Authentication, Rekomendasi]
**FR Terkait:** FR-XXX
**Ditemukan oleh:** [Nama]
**Tanggal ditemukan:** YYYY-MM-DD
**Environment:** Local / Staging / Production

### Langkah Reproduksi
1. ...
2. ...

### Expected Behavior
[Apa yang seharusnya terjadi]

### Actual Behavior
[Apa yang terjadi]

### Screenshot / Log
[Lampirkan jika ada]

### Assignee
@[nama_developer]
```

### 6.4 Eskalasi Defect

| Kondisi | Tindakan |
|---------|---------|
| S1 ditemukan di Staging | Immediate fix; seluruh tim diberitahu; Gate tidak lulus |
| S1 ditemukan di Production | Hotfix branch; rollback jika perlu; incident report |
| S2 tidak selesai dalam 48 jam | Eskalasi ke PM (Anders) |
| > 5 S2 terbuka bersamaan | Sprint dihold; fokus bug fixing |

---

## 7.0 RISIKO KUALITAS

| ID | Risiko | Probabilitas | Dampak | Level | Mitigasi |
|----|--------|:---:|:---:|:---:|----------|
| RQ-01 | Code coverage tidak mencapai 80% akibat tekanan waktu akademik | Tinggi | Tinggi | 🔴 | Integrasi coverage check di CI pipeline; PR ditolak otomatis jika coverage turun |
| RQ-02 | Defect security (SQL injection, XSS) lolos ke production | Sedang | Kritis | 🔴 | OWASP ZAP scan wajib di Gate 4; PHPStan level 6; validasi input wajib di semua endpoint |
| RQ-03 | API contract tidak sinkron antara frontend dan backend menyebabkan integrasi gagal | Tinggi | Tinggi | 🔴 | Buat dan maintain OpenAPI spec sebelum coding; gunakan contract testing |
| RQ-04 | Performa rekomendasi degradasi saat data bertambah (tidak ada ML, hanya SQL) | Sedang | Sedang | 🟠 | EXPLAIN ANALYZE query rekomendasi; partial index wajib; k6 test di Gate 4 |
| RQ-05 | Anggota tim tidak konsisten mengikuti coding standard akibat kurang familiar | Tinggi | Sedang | 🟠 | Linting otomatis di CI; PHP-CS-Fixer + ESLint wajib pass sebelum PR merge |
| RQ-06 | Konfigurasi CORS/JWT yang salah membuka celah keamanan | Sedang | Tinggi | 🟠 | Security review wajib di Gate 3; test CORS dari origin tidak terdaftar |
| RQ-07 | Kurangnya test data yang representatif menyebabkan bug tersembunyi sampai UAT | Sedang | Sedang | 🟡 | Buat seed data yang komprehensif; cover semua variasi status dan role |

---

## 8.0 METRIK YANG DIUKUR

### 8.1 Definisi & Target Metrik

| Metrik | Definisi | Formula | Target |
|--------|----------|---------|:------:|
| **Code Coverage (%)** | Persentase baris kode yang dieksekusi saat test | (Lines Executed / Total Lines) × 100 | Backend ≥ 80%, Frontend ≥ 70% |
| **Defect Density** | Jumlah bug per 1000 baris kode | (Total Defects / KLOC) | ≤ 5 bug/KLOC |
| **Defect Removal Efficiency (DRE)** | Persentase defect yang ditemukan sebelum production | (Pre-release Defects / Total Defects) × 100 | ≥ 95% |
| **Mean Time To Repair (MTTR)** | Rata-rata waktu dari defect ditemukan hingga fixed & verified | Σ(Fix Time) / Total Fixed Defects | S1: ≤ 24 jam, S2: ≤ 48 jam |
| **Test Pass Rate (%)** | Persentase test case yang lulus | (Passed TC / Total TC) × 100 | ≥ 95% saat Gate 4 |
| **API Response Time P95** | 95th percentile response time API | Diukur via k6 | ≤ 300ms |
| **Build Success Rate** | Persentase CI build yang berhasil | (Green Builds / Total Builds) × 100 | ≥ 90% |

### 8.2 Pelaporan Metrik

| Frekuensi | Laporan | Penerima |
|-----------|---------|---------|
| **Per PR** | Coverage report, lint status, test pass/fail | Developer + QA Lead |
| **Mingguan** | Defect log, open issues per severity, MTTR | QA Lead → PM |
| **Per Gate** | Semua metrik di atas lengkap | Seluruh tim + Dosen |
| **Pre-Release** | Final quality report: DRE, total defects, coverage, performance | Dosen Pembimbing |

### 8.3 Dashboard Metrik (GitHub Actions + Reports)

Metrik dikumpulkan dan dilaporkan melalui:
- **PHPUnit Coverage XML** → diparse di CI untuk threshold check
- **Jest Coverage** → Istanbul HTML report di-artifact ke GitHub Actions
- **GitHub Issues** → defect tracking dengan label severity
- **k6 JSON output** → disimpan sebagai CI artifact per run
- **Weekly Markdown Report** → dibuat manual oleh QA Lead di GitHub Discussions/Wiki

---

## LAMPIRAN: CI/CD Pipeline Overview

```yaml
# .github/workflows/ci.yml (Overview)

on: [push, pull_request]

jobs:
  backend:
    - PHP 8.2 setup
    - composer install
    - PHP-CS-Fixer check (lint)
    - PHPStan level 6 (static analysis)
    - php artisan migrate --env=testing
    - phpunit --coverage-text (threshold 80%)
    - GitLeaks secret scan

  frontend:
    - Node.js 20 setup
    - npm ci
    - ESLint + Prettier check
    - TypeScript strict compile check
    - Jest --coverage (threshold 70%)

  security:  # hanya di branch develop & main
    - OWASP ZAP baseline scan (staging URL)

  deploy-staging:  # hanya di branch develop
    - Deploy ke VPS staging via SSH
    - Run database migrations
    - Smoke test (Postman Newman)
```

---

*Dokumen ini merupakan bagian dari dokumentasi sistem I.R.O.N L.U.N.G v1.0.0*
*Standar: IEEE Std 730-2014*

**Versi:** 1.0.0 | **Tanggal:** 06 Mei 2026 | **Klasifikasi:** Internal — Kelompok 6
