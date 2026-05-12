# DOKUMEN DESAIN BASIS DATA
## I.R.O.N L.U.N.G

| Item | Detail |
|------|--------|
| **Versi** | 1.0.0 |
| **Tanggal** | 06 Mei 2026 |
| **DBMS** | PostgreSQL 15+ |
| **Referensi** | SRS v1.0.0, USE_CASE v1.0.0 |
| **Konvensi** | snake_case, tabel jamak, PK: `id BIGSERIAL` |

---

## 1.0 ERD — ENTITY RELATIONSHIP DIAGRAM (Tekstual)

### ENTITAS: users
```
users
  +-- id              : BIGSERIAL        PRIMARY KEY
  +-- email           : VARCHAR(255)     NOT NULL UNIQUE
  +-- password_hash   : VARCHAR(255)     NOT NULL
  +-- role            : VARCHAR(20)      NOT NULL  -- 'mahasiswa'|'mitra'|'admin'
  +-- is_active       : BOOLEAN          NOT NULL DEFAULT TRUE
  +-- email_verified_at : TIMESTAMP      NULL
  +-- created_at      : TIMESTAMP        NOT NULL DEFAULT NOW()
  +-- updated_at      : TIMESTAMP        NOT NULL DEFAULT NOW()
```

### ENTITAS: mahasiswa_profiles
```
mahasiswa_profiles
  +-- id              : BIGSERIAL        PRIMARY KEY
  +-- user_id         : BIGINT           NOT NULL UNIQUE
  +-- nama_lengkap    : VARCHAR(150)     NOT NULL
  +-- nim             : VARCHAR(20)      NOT NULL
  +-- universitas     : VARCHAR(150)     NOT NULL
  +-- jurusan         : VARCHAR(100)     NOT NULL
  +-- semester        : SMALLINT         NULL
  +-- bio             : TEXT             NULL
  +-- avatar_url      : VARCHAR(500)     NULL
  +-- cv_url          : VARCHAR(500)     NULL
  +-- created_at      : TIMESTAMP        NOT NULL DEFAULT NOW()
  +-- updated_at      : TIMESTAMP        NOT NULL DEFAULT NOW()
  +-- FK: user_id → users.id (ON DELETE CASCADE)
```

### ENTITAS: mitra_profiles
```
mitra_profiles
  +-- id                    : BIGSERIAL    PRIMARY KEY
  +-- user_id               : BIGINT       NOT NULL UNIQUE
  +-- nama_perusahaan        : VARCHAR(200) NOT NULL
  +-- bidang_industri        : VARCHAR(100) NOT NULL
  +-- website               : VARCHAR(500) NULL
  +-- deskripsi             : TEXT         NULL
  +-- logo_url              : VARCHAR(500) NULL
  +-- verification_status   : VARCHAR(20)  NOT NULL DEFAULT 'pending'
                                           -- 'pending'|'approved'|'rejected'
  +-- rejection_reason      : TEXT         NULL
  +-- created_at            : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- updated_at            : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- FK: user_id → users.id (ON DELETE CASCADE)
```

### ENTITAS: interests
```
interests
  +-- id          : BIGSERIAL      PRIMARY KEY
  +-- name        : VARCHAR(100)   NOT NULL UNIQUE
  +-- category    : VARCHAR(100)   NOT NULL
  +-- is_active   : BOOLEAN        NOT NULL DEFAULT TRUE
  +-- created_at  : TIMESTAMP      NOT NULL DEFAULT NOW()
```

### ENTITAS: mahasiswa_interests (Pivot)
```
mahasiswa_interests
  +-- mahasiswa_id  : BIGINT    NOT NULL
  +-- interest_id   : BIGINT    NOT NULL
  +-- PRIMARY KEY (mahasiswa_id, interest_id)
  +-- FK: mahasiswa_id → mahasiswa_profiles.id (ON DELETE CASCADE)
  +-- FK: interest_id  → interests.id (ON DELETE CASCADE)
```

### ENTITAS: opportunities
```
opportunities
  +-- id               : BIGSERIAL      PRIMARY KEY
  +-- mitra_id         : BIGINT         NOT NULL
  +-- title            : VARCHAR(255)   NOT NULL
  +-- type             : VARCHAR(20)    NOT NULL  -- 'magang'|'kompetisi'|'pelatihan'
  +-- description      : TEXT           NOT NULL
  +-- requirements     : TEXT           NULL
  +-- deadline         : DATE           NOT NULL
  +-- kuota            : SMALLINT       NULL
  +-- apply_type       : VARCHAR(10)    NOT NULL  -- 'internal'|'external'
  +-- external_url     : VARCHAR(500)   NULL
  +-- status           : VARCHAR(20)    NOT NULL DEFAULT 'pending'
                                        -- 'pending'|'approved'|'rejected'|'closed'
  +-- rejection_reason : TEXT           NULL
  +-- created_at       : TIMESTAMP      NOT NULL DEFAULT NOW()
  +-- updated_at       : TIMESTAMP      NOT NULL DEFAULT NOW()
  +-- FK: mitra_id → mitra_profiles.id (ON DELETE CASCADE)
```

### ENTITAS: opportunity_tags (Pivot)
```
opportunity_tags
  +-- opportunity_id  : BIGINT    NOT NULL
  +-- interest_id     : BIGINT    NOT NULL
  +-- PRIMARY KEY (opportunity_id, interest_id)
  +-- FK: opportunity_id → opportunities.id (ON DELETE CASCADE)
  +-- FK: interest_id    → interests.id (ON DELETE CASCADE)
```

### ENTITAS: projects
```
projects
  +-- id                      : BIGSERIAL    PRIMARY KEY
  +-- mitra_id                : BIGINT       NOT NULL
  +-- title                   : VARCHAR(255) NOT NULL
  +-- description             : TEXT         NOT NULL
  +-- member_count            : SMALLINT     NULL
  +-- registration_deadline   : DATE         NOT NULL
  +-- status                  : VARCHAR(20)  NOT NULL DEFAULT 'pending'
                                             -- 'pending'|'approved'|'closed'|'rejected'
  +-- rejection_reason        : TEXT         NULL
  +-- created_at              : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- updated_at              : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- FK: mitra_id → mitra_profiles.id (ON DELETE CASCADE)
```

### ENTITAS: project_tags (Pivot)
```
project_tags
  +-- project_id   : BIGINT    NOT NULL
  +-- interest_id  : BIGINT    NOT NULL
  +-- PRIMARY KEY (project_id, interest_id)
  +-- FK: project_id  → projects.id (ON DELETE CASCADE)
  +-- FK: interest_id → interests.id (ON DELETE CASCADE)
```

### ENTITAS: applications
```
applications
  +-- id            : BIGSERIAL    PRIMARY KEY
  +-- mahasiswa_id  : BIGINT       NOT NULL
  +-- opportunity_id: BIGINT       NOT NULL
  +-- cover_letter  : TEXT         NOT NULL
  +-- cv_url        : VARCHAR(500) NOT NULL
  +-- status        : VARCHAR(20)  NOT NULL DEFAULT 'pending'
                                   -- 'pending'|'reviewed'|'accepted'|'rejected'
  +-- notes         : TEXT         NULL
  +-- applied_at    : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- updated_at    : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- UNIQUE (mahasiswa_id, opportunity_id)
  +-- FK: mahasiswa_id   → mahasiswa_profiles.id (ON DELETE CASCADE)
  +-- FK: opportunity_id → opportunities.id (ON DELETE CASCADE)
```

### ENTITAS: project_applications
```
project_applications
  +-- id            : BIGSERIAL    PRIMARY KEY
  +-- mahasiswa_id  : BIGINT       NOT NULL
  +-- project_id    : BIGINT       NOT NULL
  +-- message       : TEXT         NOT NULL
  +-- status        : VARCHAR(20)  NOT NULL DEFAULT 'pending'
                                   -- 'pending'|'reviewed'|'accepted'|'rejected'
  +-- applied_at    : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- updated_at    : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- UNIQUE (mahasiswa_id, project_id)
  +-- FK: mahasiswa_id → mahasiswa_profiles.id (ON DELETE CASCADE)
  +-- FK: project_id   → projects.id (ON DELETE CASCADE)
```

### ENTITAS: portfolios
```
portfolios
  +-- id            : BIGSERIAL    PRIMARY KEY
  +-- mahasiswa_id  : BIGINT       NOT NULL
  +-- title         : VARCHAR(255) NOT NULL
  +-- description   : TEXT         NULL
  +-- project_url   : VARCHAR(500) NULL
  +-- file_url      : VARCHAR(500) NULL
  +-- created_at    : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- updated_at    : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- FK: mahasiswa_id → mahasiswa_profiles.id (ON DELETE CASCADE)
```

### ENTITAS: notifications
```
notifications
  +-- id          : BIGSERIAL    PRIMARY KEY
  +-- user_id     : BIGINT       NOT NULL
  +-- type        : VARCHAR(20)  NOT NULL  -- 'info'|'success'|'warning'
  +-- title       : VARCHAR(255) NOT NULL
  +-- message     : TEXT         NOT NULL
  +-- is_read     : BOOLEAN      NOT NULL DEFAULT FALSE
  +-- created_at  : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- FK: user_id → users.id (ON DELETE CASCADE)
```

### ENTITAS: refresh_tokens
```
refresh_tokens
  +-- id          : BIGSERIAL    PRIMARY KEY
  +-- user_id     : BIGINT       NOT NULL
  +-- token_hash  : VARCHAR(255) NOT NULL UNIQUE
  +-- expires_at  : TIMESTAMP    NOT NULL
  +-- created_at  : TIMESTAMP    NOT NULL DEFAULT NOW()
  +-- FK: user_id → users.id (ON DELETE CASCADE)
```

### Diagram Relasi Antar Entitas
```
users ─────────────────┬─── mahasiswa_profiles ───┬─── mahasiswa_interests ─── interests
                       │                           ├─── applications
                       │                           ├─── project_applications
                       │                           └─── portfolios
                       │
                       ├─── mitra_profiles ────────┬─── opportunities ──── opportunity_tags ─── interests
                       │                           └─── projects      ──── project_tags      ─── interests
                       │
                       ├─── notifications
                       └─── refresh_tokens
```

---

## 2.0 KAMUS DATA (Data Dictionary)

### Tabel: users

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key, auto-increment |
| email | VARCHAR | 255 | NO | - | Alamat email unik, digunakan untuk login |
| password_hash | VARCHAR | 255 | NO | - | Hash bcrypt, cost factor ≥ 12 |
| role | VARCHAR | 20 | NO | - | Enum: `mahasiswa`, `mitra`, `admin` |
| is_active | BOOLEAN | - | NO | TRUE | Status akun; FALSE = dinonaktifkan oleh admin |
| email_verified_at | TIMESTAMP | - | YES | NULL | Waktu verifikasi email; NULL = belum terverifikasi |
| created_at | TIMESTAMP | - | NO | NOW() | Waktu pembuatan record |
| updated_at | TIMESTAMP | - | NO | NOW() | Waktu pembaruan terakhir |

### Tabel: mahasiswa_profiles

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key |
| user_id | BIGINT | - | NO | - | FK → users.id, UNIQUE (1:1) |
| nama_lengkap | VARCHAR | 150 | NO | - | Nama lengkap sesuai KTM |
| nim | VARCHAR | 20 | NO | - | Nomor Induk Mahasiswa |
| universitas | VARCHAR | 150 | NO | - | Nama institusi perguruan tinggi |
| jurusan | VARCHAR | 100 | NO | - | Program studi / jurusan |
| semester | SMALLINT | - | YES | NULL | Semester aktif saat ini (1–14) |
| bio | TEXT | - | YES | NULL | Deskripsi diri singkat |
| avatar_url | VARCHAR | 500 | YES | NULL | URL foto profil di Cloudinary |
| cv_url | VARCHAR | 500 | YES | NULL | URL CV utama di Cloudinary (PDF) |
| created_at | TIMESTAMP | - | NO | NOW() | Waktu pembuatan profil |
| updated_at | TIMESTAMP | - | NO | NOW() | Waktu pembaruan terakhir |

### Tabel: mitra_profiles

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key |
| user_id | BIGINT | - | NO | - | FK → users.id, UNIQUE (1:1) |
| nama_perusahaan | VARCHAR | 200 | NO | - | Nama resmi perusahaan/lembaga |
| bidang_industri | VARCHAR | 100 | NO | - | Bidang industri (contoh: Fintech, EdTech) |
| website | VARCHAR | 500 | YES | NULL | URL website resmi perusahaan |
| deskripsi | TEXT | - | YES | NULL | Deskripsi singkat perusahaan |
| logo_url | VARCHAR | 500 | YES | NULL | URL logo perusahaan di Cloudinary |
| verification_status | VARCHAR | 20 | NO | 'pending' | Enum: `pending`, `approved`, `rejected` |
| rejection_reason | TEXT | - | YES | NULL | Alasan penolakan dari Admin (jika rejected) |
| created_at | TIMESTAMP | - | NO | NOW() | Waktu pembuatan profil |
| updated_at | TIMESTAMP | - | NO | NOW() | Waktu pembaruan terakhir |

### Tabel: interests

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key |
| name | VARCHAR | 100 | NO | - | Nama tag minat, UNIQUE (contoh: "Web Development") |
| category | VARCHAR | 100 | NO | - | Kategori pengelompokan tag |
| is_active | BOOLEAN | - | NO | TRUE | FALSE = tag disembunyikan dari pilihan |
| created_at | TIMESTAMP | - | NO | NOW() | Waktu pembuatan |

### Tabel: opportunities

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key |
| mitra_id | BIGINT | - | NO | - | FK → mitra_profiles.id |
| title | VARCHAR | 255 | NO | - | Judul peluang |
| type | VARCHAR | 20 | NO | - | Enum: `magang`, `kompetisi`, `pelatihan` |
| description | TEXT | - | NO | - | Deskripsi lengkap peluang |
| requirements | TEXT | - | YES | NULL | Persyaratan peserta |
| deadline | DATE | - | NO | - | Batas waktu pendaftaran |
| kuota | SMALLINT | - | YES | NULL | Jumlah peserta yang diterima; NULL = tidak terbatas |
| apply_type | VARCHAR | 10 | NO | - | Enum: `internal`, `external` |
| external_url | VARCHAR | 500 | YES | NULL | URL eksternal; wajib jika apply_type = external |
| status | VARCHAR | 20 | NO | 'pending' | Enum: `pending`, `approved`, `rejected`, `closed` |
| rejection_reason | TEXT | - | YES | NULL | Alasan penolakan dari Admin |
| created_at | TIMESTAMP | - | NO | NOW() | Waktu pembuatan posting |
| updated_at | TIMESTAMP | - | NO | NOW() | Waktu pembaruan terakhir |

### Tabel: applications

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key |
| mahasiswa_id | BIGINT | - | NO | - | FK → mahasiswa_profiles.id |
| opportunity_id | BIGINT | - | NO | - | FK → opportunities.id |
| cover_letter | TEXT | - | NO | - | Surat lamaran (maks. 2000 karakter, enforced di app) |
| cv_url | VARCHAR | 500 | NO | - | URL CV yang dilampirkan saat melamar |
| status | VARCHAR | 20 | NO | 'pending' | Enum: `pending`, `reviewed`, `accepted`, `rejected` |
| notes | TEXT | - | YES | NULL | Catatan feedback dari Mitra Industri |
| applied_at | TIMESTAMP | - | NO | NOW() | Waktu melamar |
| updated_at | TIMESTAMP | - | NO | NOW() | Waktu pembaruan status terakhir |

### Tabel: notifications

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key |
| user_id | BIGINT | - | NO | - | FK → users.id (penerima notifikasi) |
| type | VARCHAR | 20 | NO | - | Enum: `info`, `success`, `warning` |
| title | VARCHAR | 255 | NO | - | Judul singkat notifikasi |
| message | TEXT | - | NO | - | Isi pesan notifikasi lengkap |
| is_read | BOOLEAN | - | NO | FALSE | FALSE = belum dibaca |
| created_at | TIMESTAMP | - | NO | NOW() | Waktu notifikasi dibuat |

### Tabel: refresh_tokens

| Nama Field | Tipe Data | Panjang | Null | Default | Keterangan |
|------------|-----------|:-------:|:----:|---------|------------|
| id | BIGSERIAL | - | NO | auto | Primary key |
| user_id | BIGINT | - | NO | - | FK → users.id |
| token_hash | VARCHAR | 255 | NO | - | Hash SHA-256 dari refresh token asli, UNIQUE |
| expires_at | TIMESTAMP | - | NO | - | Waktu kadaluarsa token (TTL: 7 hari dari issued) |
| created_at | TIMESTAMP | - | NO | NOW() | Waktu token diterbitkan |

---

## 3.0 NORMALISASI

### 3.1 First Normal Form (1NF)

**Definisi:** Setiap kolom berisi nilai atomik; tidak ada repeating group.

**Contoh Masalah (Sebelum 1NF):**
```
opportunities_raw:
  id | title          | tags
  1  | Magang GoTo    | "Web Dev, Cloud, Backend"   ← TIDAK ATOMIK
```

**Solusi (Setelah 1NF):**
```
opportunities: id=1, title="Magang GoTo"
opportunity_tags: (opportunity_id=1, interest_id=3)
opportunity_tags: (opportunity_id=1, interest_id=7)
opportunity_tags: (opportunity_id=1, interest_id=9)
```
Tabel pivot `opportunity_tags` memisahkan relasi many-to-many sehingga setiap sel berisi satu nilai atomik. ✅

**Contoh lain — mahasiswa_interests:**
```
Sebelum: mahasiswa_profiles.interests = "Web Dev, UI/UX, Data Science"
Sesudah: mahasiswa_interests (mahasiswa_id, interest_id) — satu baris per minat
```

### 3.2 Second Normal Form (2NF)

**Definisi:** Memenuhi 1NF; setiap atribut non-key bergantung penuh pada seluruh primary key (tidak ada partial dependency).

**Berlaku untuk tabel dengan composite PK**, yaitu tabel pivot.

**Contoh Masalah (Sebelum 2NF):**
```
applications_raw (composite PK: mahasiswa_id, opportunity_id):
  mahasiswa_id | opportunity_id | cover_letter | nama_mahasiswa
  1            | 5              | "Saya..."    | "Anders"
                                                ↑ PARTIAL DEPENDENCY
                                               (hanya bergantung pada mahasiswa_id)
```

**Solusi (Setelah 2NF):**
```
applications:
  id | mahasiswa_id | opportunity_id | cover_letter | status
  1  | 1            | 5              | "Saya..."    | pending

mahasiswa_profiles:
  id | nama_lengkap  (nama ada di tabel sendiri, bukan di applications)
  1  | Anders Emmanuel Tan
```
Nama mahasiswa diambil via JOIN, bukan disimpan redundan di `applications`. ✅

### 3.3 Third Normal Form (3NF)

**Definisi:** Memenuhi 2NF; tidak ada transitive dependency (atribut non-key bergantung pada atribut non-key lain).

**Contoh Masalah (Sebelum 3NF):**
```
mahasiswa_profiles_raw:
  id | user_id | universitas          | kota_universitas
  1  | 3       | Universitas Gadjah Mada | Yogyakarta
                                        ↑ TRANSITIVE DEPENDENCY
                              (kota_universitas bergantung pada universitas,
                               bukan langsung pada id)
```

**Solusi (Setelah 3NF):**
```
mahasiswa_profiles:
  id | user_id | universitas
  1  | 3       | Universitas Gadjah Mada
```
Kolom `kota_universitas` dihapus. Jika diperlukan, dibuat tabel `universities` terpisah
(dipertimbangkan untuk v2.0; tidak termasuk MVP v1.0 untuk menjaga kesederhanaan). ✅

**Contoh lain — opportunities:**
```
Sebelum: opportunities.nama_perusahaan (bergantung pada mitra_id → mitra_profiles)
Sesudah: nama_perusahaan diambil via JOIN ke mitra_profiles
         opportunities hanya menyimpan mitra_id sebagai FK
```

### Kesimpulan Normalisasi

| Tabel | 1NF | 2NF | 3NF | Catatan |
|-------|:---:|:---:|:---:|---------|
| users | ✅ | ✅ | ✅ | Tidak ada dependency masalah |
| mahasiswa_profiles | ✅ | ✅ | ✅ | kota_universitas sengaja dihapus |
| mitra_profiles | ✅ | ✅ | ✅ | - |
| interests | ✅ | ✅ | ✅ | - |
| mahasiswa_interests | ✅ | ✅ | ✅ | Composite PK, tidak ada atribut lain |
| opportunities | ✅ | ✅ | ✅ | nama_perusahaan diambil via JOIN |
| opportunity_tags | ✅ | ✅ | ✅ | Composite PK, pivot murni |
| projects | ✅ | ✅ | ✅ | - |
| project_tags | ✅ | ✅ | ✅ | Pivot murni |
| applications | ✅ | ✅ | ✅ | UNIQUE(mahasiswa_id, opportunity_id) |
| project_applications | ✅ | ✅ | ✅ | - |
| portfolios | ✅ | ✅ | ✅ | - |
| notifications | ✅ | ✅ | ✅ | - |
| refresh_tokens | ✅ | ✅ | ✅ | - |

**Seluruh 14 tabel memenuhi 3NF.** ✅

---

## 4.0 INDEKS & OPTIMASI

### 4.1 Rekomendasi Indeks

| Nama Indeks | Tabel | Kolom | Tipe | Alasan |
|-------------|-------|-------|------|--------|
| idx_users_email | users | email | UNIQUE B-Tree | Query login dan cek duplikasi email |
| idx_mahasiswa_user_id | mahasiswa_profiles | user_id | UNIQUE B-Tree | Lookup profil berdasarkan user yang login |
| idx_mitra_user_id | mitra_profiles | user_id | UNIQUE B-Tree | Lookup profil mitra berdasarkan user |
| idx_opportunities_status | opportunities | status | B-Tree | Filter peluang approved/pending (query paling sering) |
| idx_opportunities_mitra_id | opportunities | mitra_id | B-Tree | Mitra lihat peluang milik sendiri |
| idx_opportunities_deadline | opportunities | deadline | B-Tree | Filter & sort berdasarkan deadline |
| idx_opportunities_type | opportunities | type | B-Tree | Filter berdasarkan tipe peluang |
| idx_projects_status | projects | status | B-Tree | Filter proyek approved/pending |
| idx_projects_mitra_id | projects | mitra_id | B-Tree | Mitra lihat proyek milik sendiri |
| idx_applications_mahasiswa_id | applications | mahasiswa_id | B-Tree | Riwayat lamaran mahasiswa |
| idx_applications_opportunity_id | applications | opportunity_id | B-Tree | Daftar pelamar per peluang |
| idx_applications_status | applications | status | B-Tree | Filter status lamaran |
| idx_notifications_user_id | notifications | user_id | B-Tree | Ambil notifikasi milik user |
| idx_notifications_is_read | notifications | (user_id, is_read) | B-Tree Komposit | Query notifikasi belum dibaca |
| idx_refresh_tokens_token_hash | refresh_tokens | token_hash | UNIQUE B-Tree | Validasi refresh token saat /auth/refresh |
| idx_refresh_tokens_user_id | refresh_tokens | user_id | B-Tree | Hapus semua token saat logout |
| idx_opp_tags_interest_id | opportunity_tags | interest_id | B-Tree | Query rekomendasi: join opportunities via interest |
| idx_mhs_interests_interest_id | mahasiswa_interests | interest_id | B-Tree | Query rekomendasi: ambil minat mahasiswa |

### 4.2 Optimasi Query Rekomendasi

Query rekomendasi adalah operasi paling kompleks. Optimasi:
```sql
-- Query dasar rekomendasi (dijalankan setiap dashboard load)
SELECT o.*, COUNT(ot.interest_id) AS match_count
FROM opportunities o
JOIN opportunity_tags ot ON o.id = ot.opportunity_id
WHERE o.status = 'approved'
  AND o.deadline >= CURRENT_DATE
  AND ot.interest_id IN (
      SELECT interest_id FROM mahasiswa_interests WHERE mahasiswa_id = $1
  )
GROUP BY o.id
ORDER BY match_count DESC, o.created_at DESC
LIMIT 10;

-- Indeks yang digunakan: idx_opportunities_status, idx_opportunities_deadline,
--   idx_opp_tags_interest_id, idx_mhs_interests_interest_id
```

### 4.3 Strategi Tambahan

- **Partial Index:** `CREATE INDEX idx_opp_approved ON opportunities(created_at) WHERE status = 'approved';` — mempercepat browse peluang aktif
- **Timestamps:** Semua tabel menggunakan `created_at` untuk sorting; pastikan diindeks jika sering dipakai untuk ORDER BY
- **Connection Pooling:** Gunakan PgBouncer atau Laravel's built-in pool untuk menghindari connection exhaustion
- **EXPLAIN ANALYZE:** Jalankan pada setiap query kompleks sebelum production untuk memverifikasi index digunakan

---

*Dokumen ini merupakan bagian dari dokumentasi sistem I.R.O.N L.U.N.G v1.0.0*
**Versi:** 1.0.0 | **Tanggal:** 06 Mei 2026 | **Klasifikasi:** Internal — Kelompok 6
