-- =============================================================================
-- SCHEMA DDL — I.R.O.N L.U.N.G
-- DBMS    : PostgreSQL 15+
-- Versi   : 1.0.0
-- Tanggal : 06 Mei 2026
-- Konvensi: snake_case, tabel jamak, PK BIGSERIAL
-- =============================================================================

-- Aktifkan ekstensi UUID (opsional, untuk UUID generation jika diperlukan)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- DROP TABLES (urutan: child → parent untuk menghindari FK violation)
-- =============================================================================
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS project_applications CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS project_tags CASCADE;
DROP TABLE IF EXISTS opportunity_tags CASCADE;
DROP TABLE IF EXISTS mahasiswa_interests CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS interests CASCADE;
DROP TABLE IF EXISTS mitra_profiles CASCADE;
DROP TABLE IF EXISTS mahasiswa_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =============================================================================
-- TABEL: users
-- Menyimpan kredensial autentikasi dasar untuk semua role.
-- =============================================================================
CREATE TABLE users (
    id                  BIGSERIAL       PRIMARY KEY,
    email               VARCHAR(255)    NOT NULL,
    password_hash       VARCHAR(255)    NOT NULL,
    role                VARCHAR(20)     NOT NULL
                            CHECK (role IN ('mahasiswa', 'mitra', 'admin')),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    email_verified_at   TIMESTAMP WITH TIME ZONE NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_users_email UNIQUE (email)
);

COMMENT ON TABLE  users IS 'Akun autentikasi dasar untuk semua role pengguna.';
COMMENT ON COLUMN users.role IS 'Enum: mahasiswa | mitra | admin';
COMMENT ON COLUMN users.is_active IS 'FALSE = akun dinonaktifkan oleh admin';

-- =============================================================================
-- TABEL: mahasiswa_profiles
-- Informasi profil khusus mahasiswa (relasi 1:1 dengan users).
-- =============================================================================
CREATE TABLE mahasiswa_profiles (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    nama_lengkap    VARCHAR(150)    NOT NULL,
    nim             VARCHAR(20)     NOT NULL,
    universitas     VARCHAR(150)    NOT NULL,
    jurusan         VARCHAR(100)    NOT NULL,
    semester        SMALLINT        NULL CHECK (semester BETWEEN 1 AND 14),
    bio             TEXT            NULL,
    avatar_url      VARCHAR(500)    NULL,
    cv_url          VARCHAR(500)    NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_mahasiswa_profiles_user_id UNIQUE (user_id),
    CONSTRAINT fk_mahasiswa_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

COMMENT ON TABLE  mahasiswa_profiles IS 'Profil lengkap mahasiswa; relasi 1:1 dengan users.';
COMMENT ON COLUMN mahasiswa_profiles.cv_url IS 'URL CV utama di Cloudinary (PDF, maks 5MB)';

-- =============================================================================
-- TABEL: mitra_profiles
-- Informasi profil khusus mitra industri (relasi 1:1 dengan users).
-- =============================================================================
CREATE TABLE mitra_profiles (
    id                    BIGSERIAL       PRIMARY KEY,
    user_id               BIGINT          NOT NULL,
    nama_perusahaan       VARCHAR(200)    NOT NULL,
    bidang_industri       VARCHAR(100)    NOT NULL,
    website               VARCHAR(500)    NULL,
    deskripsi             TEXT            NULL,
    logo_url              VARCHAR(500)    NULL,
    verification_status   VARCHAR(20)     NOT NULL DEFAULT 'pending'
                              CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    rejection_reason      TEXT            NULL,
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_mitra_profiles_user_id UNIQUE (user_id),
    CONSTRAINT fk_mitra_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

COMMENT ON TABLE  mitra_profiles IS 'Profil perusahaan/lembaga mitra industri; relasi 1:1 dengan users.';
COMMENT ON COLUMN mitra_profiles.verification_status IS 'Enum: pending | approved | rejected';

-- =============================================================================
-- TABEL: interests
-- Master data tag minat/keahlian yang dikelola oleh Admin.
-- =============================================================================
CREATE TABLE interests (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    category    VARCHAR(100)    NOT NULL,
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_interests_name UNIQUE (name)
);

COMMENT ON TABLE  interests IS 'Master list tag minat/keahlian untuk sistem rekomendasi.';
COMMENT ON COLUMN interests.is_active IS 'FALSE = tag tidak ditampilkan di pilihan onboarding';

-- =============================================================================
-- TABEL: mahasiswa_interests (Pivot)
-- Relasi many-to-many antara mahasiswa dan minat mereka.
-- =============================================================================
CREATE TABLE mahasiswa_interests (
    mahasiswa_id    BIGINT  NOT NULL,
    interest_id     BIGINT  NOT NULL,
    CONSTRAINT pk_mahasiswa_interests PRIMARY KEY (mahasiswa_id, interest_id),
    CONSTRAINT fk_mhs_interests_mahasiswa
        FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_mhs_interests_interest
        FOREIGN KEY (interest_id) REFERENCES interests (id) ON DELETE CASCADE
);

COMMENT ON TABLE mahasiswa_interests IS 'Pivot: tag minat yang dipilih oleh mahasiswa.';

-- =============================================================================
-- TABEL: opportunities
-- Peluang (magang/kompetisi/pelatihan) yang diposting oleh mitra industri.
-- =============================================================================
CREATE TABLE opportunities (
    id                BIGSERIAL       PRIMARY KEY,
    mitra_id          BIGINT          NOT NULL,
    title             VARCHAR(255)    NOT NULL,
    type              VARCHAR(20)     NOT NULL
                          CHECK (type IN ('magang', 'kompetisi', 'pelatihan')),
    description       TEXT            NOT NULL,
    requirements      TEXT            NULL,
    deadline          DATE            NOT NULL,
    kuota             SMALLINT        NULL CHECK (kuota > 0),
    apply_type        VARCHAR(10)     NOT NULL
                          CHECK (apply_type IN ('internal', 'external')),
    external_url      VARCHAR(500)    NULL,
    status            VARCHAR(20)     NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'approved', 'rejected', 'closed')),
    rejection_reason  TEXT            NULL,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_opportunities_mitra
        FOREIGN KEY (mitra_id) REFERENCES mitra_profiles (id) ON DELETE CASCADE,
    CONSTRAINT chk_external_url
        CHECK (apply_type != 'external' OR external_url IS NOT NULL)
);

COMMENT ON TABLE  opportunities IS 'Posting peluang magang, kompetisi, dan pelatihan oleh mitra industri.';
COMMENT ON COLUMN opportunities.status IS 'Enum: pending | approved | rejected | closed';
COMMENT ON COLUMN opportunities.external_url IS 'Wajib diisi jika apply_type = external';

-- =============================================================================
-- TABEL: opportunity_tags (Pivot)
-- Relasi many-to-many antara peluang dan tag minat.
-- =============================================================================
CREATE TABLE opportunity_tags (
    opportunity_id  BIGINT  NOT NULL,
    interest_id     BIGINT  NOT NULL,
    CONSTRAINT pk_opportunity_tags PRIMARY KEY (opportunity_id, interest_id),
    CONSTRAINT fk_opp_tags_opportunity
        FOREIGN KEY (opportunity_id) REFERENCES opportunities (id) ON DELETE CASCADE,
    CONSTRAINT fk_opp_tags_interest
        FOREIGN KEY (interest_id) REFERENCES interests (id) ON DELETE CASCADE
);

COMMENT ON TABLE opportunity_tags IS 'Pivot: tag minat yang melekat pada setiap peluang.';

-- =============================================================================
-- TABEL: projects
-- Listing proyek kolaborasi yang membuka rekrutmen anggota.
-- =============================================================================
CREATE TABLE projects (
    id                      BIGSERIAL       PRIMARY KEY,
    mitra_id                BIGINT          NOT NULL,
    title                   VARCHAR(255)    NOT NULL,
    description             TEXT            NOT NULL,
    member_count            SMALLINT        NULL CHECK (member_count > 0),
    registration_deadline   DATE            NOT NULL,
    status                  VARCHAR(20)     NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'approved', 'closed', 'rejected')),
    rejection_reason        TEXT            NULL,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_projects_mitra
        FOREIGN KEY (mitra_id) REFERENCES mitra_profiles (id) ON DELETE CASCADE
);

COMMENT ON TABLE projects IS 'Listing proyek kolaborasi terbuka untuk rekrutmen mahasiswa.';

-- =============================================================================
-- TABEL: project_tags (Pivot)
-- =============================================================================
CREATE TABLE project_tags (
    project_id      BIGINT  NOT NULL,
    interest_id     BIGINT  NOT NULL,
    CONSTRAINT pk_project_tags PRIMARY KEY (project_id, interest_id),
    CONSTRAINT fk_proj_tags_project
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT fk_proj_tags_interest
        FOREIGN KEY (interest_id) REFERENCES interests (id) ON DELETE CASCADE
);

COMMENT ON TABLE project_tags IS 'Pivot: tag minat yang melekat pada setiap proyek.';

-- =============================================================================
-- TABEL: applications
-- Lamaran mahasiswa ke peluang internal.
-- =============================================================================
CREATE TABLE applications (
    id              BIGSERIAL       PRIMARY KEY,
    mahasiswa_id    BIGINT          NOT NULL,
    opportunity_id  BIGINT          NOT NULL,
    cover_letter    TEXT            NOT NULL,
    cv_url          VARCHAR(500)    NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    notes           TEXT            NULL,
    applied_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_applications_unique
        UNIQUE (mahasiswa_id, opportunity_id),
    CONSTRAINT fk_applications_mahasiswa
        FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_opportunity
        FOREIGN KEY (opportunity_id) REFERENCES opportunities (id) ON DELETE CASCADE
);

COMMENT ON TABLE  applications IS 'Lamaran mahasiswa ke peluang internal. UNIQUE per (mahasiswa, peluang).';
COMMENT ON COLUMN applications.notes IS 'Catatan/feedback dari Mitra Industri untuk pelamar';

-- =============================================================================
-- TABEL: project_applications
-- Lamaran mahasiswa untuk bergabung ke proyek kolaborasi.
-- =============================================================================
CREATE TABLE project_applications (
    id              BIGSERIAL       PRIMARY KEY,
    mahasiswa_id    BIGINT          NOT NULL,
    project_id      BIGINT          NOT NULL,
    message         TEXT            NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
    applied_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_applications_unique
        UNIQUE (mahasiswa_id, project_id),
    CONSTRAINT fk_proj_apps_mahasiswa
        FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_proj_apps_project
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

COMMENT ON TABLE project_applications IS 'Lamaran mahasiswa untuk bergabung ke proyek kolaborasi.';

-- =============================================================================
-- TABEL: portfolios
-- Item portofolio milik mahasiswa (proyek, karya, dll).
-- =============================================================================
CREATE TABLE portfolios (
    id              BIGSERIAL       PRIMARY KEY,
    mahasiswa_id    BIGINT          NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    description     TEXT            NULL,
    project_url     VARCHAR(500)    NULL,
    file_url        VARCHAR(500)    NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_portfolios_mahasiswa
        FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa_profiles (id) ON DELETE CASCADE,
    CONSTRAINT chk_portfolio_has_content
        CHECK (project_url IS NOT NULL OR file_url IS NOT NULL)
);

COMMENT ON TABLE  portfolios IS 'Item portofolio mahasiswa; minimal project_url atau file_url harus ada.';
COMMENT ON COLUMN portfolios.file_url IS 'URL file di Cloudinary (PDF/ZIP, maks 10MB)';

-- =============================================================================
-- TABEL: notifications
-- Notifikasi in-app untuk semua pengguna.
-- =============================================================================
CREATE TABLE notifications (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     BIGINT          NOT NULL,
    type        VARCHAR(20)     NOT NULL
                    CHECK (type IN ('info', 'success', 'warning')),
    title       VARCHAR(255)    NOT NULL,
    message     TEXT            NOT NULL,
    is_read     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

COMMENT ON TABLE  notifications IS 'Notifikasi in-app; tampil di ikon lonceng navbar.';
COMMENT ON COLUMN notifications.is_read IS 'FALSE = belum dibaca; di-update saat pengguna membuka notifikasi';

-- =============================================================================
-- TABEL: refresh_tokens
-- Penyimpanan refresh token untuk mekanisme silent token refresh.
-- =============================================================================
CREATE TABLE refresh_tokens (
    id          BIGSERIAL       PRIMARY KEY,
    user_id     BIGINT          NOT NULL,
    token_hash  VARCHAR(255)    NOT NULL,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_refresh_tokens_hash UNIQUE (token_hash),
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

COMMENT ON TABLE  refresh_tokens IS 'Penyimpanan hash refresh token JWT; TTL 7 hari.';
COMMENT ON COLUMN refresh_tokens.token_hash IS 'SHA-256 hash dari refresh token asli di cookie';

-- =============================================================================
-- INDEKS
-- =============================================================================

-- users
CREATE UNIQUE INDEX idx_users_email ON users (email);

-- mahasiswa_profiles
CREATE UNIQUE INDEX idx_mahasiswa_user_id        ON mahasiswa_profiles (user_id);

-- mitra_profiles
CREATE UNIQUE INDEX idx_mitra_user_id            ON mitra_profiles (user_id);
CREATE        INDEX idx_mitra_verification       ON mitra_profiles (verification_status);

-- opportunities
CREATE INDEX idx_opportunities_status      ON opportunities (status);
CREATE INDEX idx_opportunities_mitra_id    ON opportunities (mitra_id);
CREATE INDEX idx_opportunities_deadline    ON opportunities (deadline);
CREATE INDEX idx_opportunities_type        ON opportunities (type);
-- Partial index: hanya peluang aktif (query paling sering)
CREATE INDEX idx_opportunities_approved    ON opportunities (created_at DESC)
    WHERE status = 'approved';

-- opportunity_tags
CREATE INDEX idx_opp_tags_interest_id      ON opportunity_tags (interest_id);

-- projects
CREATE INDEX idx_projects_status           ON projects (status);
CREATE INDEX idx_projects_mitra_id         ON projects (mitra_id);
-- Partial index: hanya proyek aktif
CREATE INDEX idx_projects_approved         ON projects (created_at DESC)
    WHERE status = 'approved';

-- project_tags
CREATE INDEX idx_project_tags_interest_id  ON project_tags (interest_id);

-- applications
CREATE INDEX idx_applications_mahasiswa_id   ON applications (mahasiswa_id);
CREATE INDEX idx_applications_opportunity_id ON applications (opportunity_id);
CREATE INDEX idx_applications_status         ON applications (status);

-- project_applications
CREATE INDEX idx_proj_apps_mahasiswa_id    ON project_applications (mahasiswa_id);
CREATE INDEX idx_proj_apps_project_id      ON project_applications (project_id);

-- portfolios
CREATE INDEX idx_portfolios_mahasiswa_id   ON portfolios (mahasiswa_id);

-- notifications
CREATE INDEX idx_notifications_user_id     ON notifications (user_id);
CREATE INDEX idx_notifications_unread      ON notifications (user_id, is_read)
    WHERE is_read = FALSE;  -- Partial index: notifikasi belum dibaca

-- refresh_tokens
CREATE UNIQUE INDEX idx_refresh_tokens_hash    ON refresh_tokens (token_hash);
CREATE        INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE        INDEX idx_refresh_tokens_expiry  ON refresh_tokens (expires_at);

-- mahasiswa_interests
CREATE INDEX idx_mhs_interests_interest_id ON mahasiswa_interests (interest_id);

-- =============================================================================
-- SEED DATA: interests (Master Tag Minat)
-- =============================================================================
INSERT INTO interests (name, category) VALUES
    ('Web Development',      'Software Engineering'),
    ('Mobile Development',   'Software Engineering'),
    ('Backend Development',  'Software Engineering'),
    ('Frontend Development', 'Software Engineering'),
    ('DevOps & Cloud',       'Infrastructure'),
    ('Cybersecurity',        'Security'),
    ('Data Science',         'Data & AI'),
    ('Machine Learning',     'Data & AI'),
    ('Data Engineering',     'Data & AI'),
    ('UI/UX Design',         'Design'),
    ('Product Management',   'Business & Product'),
    ('Business & Entrepreneurship', 'Business & Product'),
    ('Game Development',     'Software Engineering'),
    ('Embedded Systems',     'Hardware & IoT'),
    ('Internet of Things',   'Hardware & IoT'),
    ('Blockchain',           'Emerging Technology'),
    ('Augmented Reality',    'Emerging Technology'),
    ('Open Source',          'Community'),
    ('Research & Academia',  'Academic'),
    ('Technical Writing',    'Communication');

-- =============================================================================
-- SEED DATA: Admin default (password harus diganti setelah setup)
-- Password: 'AdminIRONLUNG2026!' → harus di-hash via bcrypt di aplikasi
-- CATATAN: Jangan gunakan seed ini di production. Gunakan Laravel seeder.
-- =============================================================================
-- INSERT INTO users (email, password_hash, role)
-- VALUES ('admin@ironlung.id', '[BCRYPT_HASH_DARI_APP]', 'admin');

-- =============================================================================
-- END OF SCHEMA
-- I.R.O.N L.U.N.G v1.0.0 | 06 Mei 2026 | Kelompok 6
-- =============================================================================
