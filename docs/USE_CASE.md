# USE CASE DOCUMENT
## I.R.O.N L.U.N.G — Intelligent Resource Organizer for Networking, Learning, Unified iNternships, and Group collaboration

| Item | Detail |
|------|--------|
| **Versi** | 1.0.0 |
| **Tanggal** | 06 Mei 2026 |
| **Referensi** | SRS v1.0.0 (IEEE 830) |
| **Tim** | Kelompok 6 |

---

## 1.0 DAFTAR AKTOR

| ID | Aktor | Tipe | Deskripsi |
|----|-------|------|-----------|
| A-01 | **Mahasiswa** | Primary | Mahasiswa ilmu komputer yang menggunakan platform untuk mencari dan melamar peluang magang, kompetisi, pelatihan, dan proyek kolaborasi sesuai minatnya. |
| A-02 | **Mitra Industri** | Primary | Perwakilan perusahaan, startup, atau penyelenggara kompetisi yang memposting peluang dan mengelola pelamar. Akun harus diverifikasi Admin terlebih dahulu. |
| A-03 | **Administrator** | Primary | Staf internal platform dengan otoritas tertinggi. Bertanggung jawab atas moderasi konten, manajemen akun, dan pemeliharaan platform. |
| A-04 | **Pengunjung (Guest)** | Secondary | Pengguna yang belum login. Dapat menjelajahi peluang dalam mode read-only tanpa kemampuan melamar. |
| A-05 | **Sistem (Automated)** | Secondary | Aktor internal yang menjalankan proses otomatis: kalkulasi rekomendasi, pengiriman notifikasi email, dan validasi token. |

---

## 2.0 USE CASE DIAGRAM — DESKRIPSI TEKSTUAL

### 2.1 Aktor: Mahasiswa (A-01)

```
Mahasiswa ──── [UC-001] Register Akun
Mahasiswa ──── [UC-002] Login
Mahasiswa ──── [UC-003] Logout
Mahasiswa ──── [UC-004] Lengkapi Profil
                  └── <<include>> [UC-012] Unggah CV
Mahasiswa ──── [UC-005] Onboarding Minat (Pilih Tag)
Mahasiswa ──── [UC-006] Kelola Portofolio
Mahasiswa ──── [UC-007] Browse Peluang & Proyek
                  └── <<extend>> [UC-008] Cari & Filter Peluang
Mahasiswa ──── [UC-009] Lihat Rekomendasi
                  └── <<include>> [UC-031] Hitung Rekomendasi (Sistem)
Mahasiswa ──── [UC-010] Lihat Detail Peluang
Mahasiswa ──── [UC-011] Lamar Peluang Internal
                  └── <<include>> [UC-012] Unggah / Pilih CV
                  └── <<include>> [UC-033] Kirim Notifikasi (Sistem)
Mahasiswa ──── [UC-013] Lamar Peluang Eksternal (Redirect)
Mahasiswa ──── [UC-014] Lamar Proyek Kolaborasi
Mahasiswa ──── [UC-015] Lihat Riwayat Lamaran
Mahasiswa ──── [UC-016] Lihat & Baca Notifikasi
Mahasiswa ──── [UC-017] Hapus Akun (UU PDP)
```

### 2.2 Aktor: Mitra Industri (A-02)

```
Mitra Industri ──── [UC-001] Register Akun
Mitra Industri ──── [UC-002] Login
Mitra Industri ──── [UC-003] Logout
Mitra Industri ──── [UC-018] Lengkapi Profil Perusahaan
Mitra Industri ──── [UC-019] Posting Peluang Baru
                       └── <<include>> [UC-033] Kirim Notifikasi ke Admin (Sistem)
Mitra Industri ──── [UC-020] Kelola Peluang Sendiri (Edit/Hapus)
Mitra Industri ──── [UC-021] Posting Proyek Kolaborasi
Mitra Industri ──── [UC-022] Lihat Daftar Pelamar
Mitra Industri ──── [UC-023] Update Status Lamaran
                       └── <<include>> [UC-033] Kirim Notifikasi ke Mahasiswa (Sistem)
Mitra Industri ──── [UC-016] Lihat & Baca Notifikasi
```

### 2.3 Aktor: Administrator (A-03)

```
Admin ──── [UC-002] Login
Admin ──── [UC-003] Logout
Admin ──── [UC-024] Lihat Dashboard Admin (Statistik)
Admin ──── [UC-025] Review & Approve/Reject Peluang
              └── <<include>> [UC-033] Kirim Notifikasi ke Mitra (Sistem)
Admin ──── [UC-026] Review & Approve/Reject Proyek
              └── <<include>> [UC-033] Kirim Notifikasi ke Mitra (Sistem)
Admin ──── [UC-027] Kelola Akun Pengguna (Nonaktifkan/Hapus)
Admin ──── [UC-028] Kelola Master Tag Minat (CRUD)
Admin ──── [UC-016] Lihat & Baca Notifikasi
```

### 2.4 Aktor: Pengunjung / Guest (A-04)

```
Pengunjung ──── [UC-007] Browse Peluang & Proyek (Read-Only)
                   └── <<extend>> [UC-008] Cari & Filter Peluang
Pengunjung ──── [UC-010] Lihat Detail Peluang (Read-Only)
Pengunjung ──── [UC-001] Register Akun
Pengunjung ──── [UC-002] Login
```

### 2.5 Relasi Use Case

| Use Case | Relasi | Keterangan |
|----------|--------|------------|
| UC-007 <<extend>> UC-008 | Extend | Search & filter adalah ekstensi opsional dari browse |
| UC-004 <<include>> UC-012 | Include | Lengkapi profil selalu menyertakan opsi upload CV |
| UC-011 <<include>> UC-012 | Include | Lamar internal memerlukan pemilihan CV |
| UC-009 <<include>> UC-031 | Include | Lihat rekomendasi selalu memicu kalkulasi sistem |
| UC-019 <<include>> UC-033 | Include | Posting peluang selalu memicu notifikasi ke Admin |
| UC-023 <<include>> UC-033 | Include | Update status lamaran selalu memicu notifikasi ke Mahasiswa |
| UC-025 <<include>> UC-033 | Include | Approve/Reject selalu memicu notifikasi ke Mitra |

---

## 3.0 SPESIFIKASI USE CASE DETAIL

---

### UC-001: Register Akun

```
+-- Aktor        : Mahasiswa (A-01), Mitra Industri (A-02), Pengunjung (A-04)
+-- Deskripsi    : Pengguna baru membuat akun di platform I.R.O.N L.U.N.G
                   dengan role Mahasiswa atau Mitra Industri.
+-- Precondition :
    1. Pengguna belum memiliki akun di sistem.
    2. Pengguna mengakses halaman registrasi.
+-- Basic Flow   :
    1. Pengguna memilih role: Mahasiswa atau Mitra Industri.
    2. Sistem menampilkan form registrasi sesuai role yang dipilih.
    3. [Role: Mahasiswa] Pengguna mengisi: email, password, nama lengkap,
       NIM, universitas, jurusan.
       [Role: Mitra Industri] Pengguna mengisi: email, password, nama
       perusahaan, bidang industri.
    4. Pengguna menekan tombol "Daftar".
    5. Sistem memvalidasi seluruh input (format email, keunikan email,
       kekuatan password, field wajib).
    6. Sistem meng-hash password dengan bcrypt (cost factor ≥ 12).
    7. Sistem menyimpan akun ke database.
       - Role Mahasiswa: status akun langsung aktif.
       - Role Mitra Industri: status akun = pending_verification.
    8. Sistem mengirimkan email selamat datang ke alamat email pengguna.
    9. [Role: Mahasiswa] Sistem mengarahkan pengguna ke halaman Onboarding
       Minat (UC-005).
       [Role: Mitra Industri] Sistem menampilkan pesan bahwa akun sedang
       menunggu verifikasi Admin.
+-- Alternative  :
    A1 (Email sudah terdaftar):
        5a. Sistem mendeteksi email sudah digunakan.
        5b. Sistem menampilkan pesan error: "Email sudah terdaftar.
            Gunakan email lain atau login."
        5c. Use case kembali ke langkah 3.
+-- Exception    :
    E1 (Validasi gagal):
        5e. Sistem menampilkan pesan error spesifik per field yang tidak valid.
        5f. Use case kembali ke langkah 3.
    E2 (Server error):
        7e. Sistem menampilkan pesan: "Terjadi kesalahan. Coba lagi nanti."
        7f. Data tidak tersimpan. Use case berakhir.
+-- Postcondition:
    1. Akun pengguna baru tersimpan di database.
    2. Email selamat datang terkirim.
    3. [Mahasiswa] Pengguna diarahkan ke onboarding.
    4. [Mitra] Akun berstatus pending_verification.
```

---

### UC-002: Login

```
+-- Aktor        : Mahasiswa (A-01), Mitra Industri (A-02), Admin (A-03)
+-- Deskripsi    : Pengguna terdaftar masuk ke platform menggunakan
                   kredensial email dan password.
+-- Precondition :
    1. Pengguna memiliki akun aktif di sistem.
    2. Pengguna mengakses halaman login.
+-- Basic Flow   :
    1. Pengguna mengisi email dan password.
    2. Pengguna menekan tombol "Masuk".
    3. Sistem memeriksa rate limit: jika IP telah gagal ≥ 10 kali dalam
       15 menit terakhir, sistem menolak request (HTTP 429).
    4. Sistem memverifikasi email di database.
    5. Sistem memverifikasi password menggunakan bcrypt compare.
    6. Sistem memeriksa status akun:
       - Mitra Industri dengan status pending_verification: tolak login.
       - Akun dinonaktifkan: tolak login.
    7. Sistem menerbitkan JWT access token (TTL: 15 menit).
    8. Sistem menerbitkan refresh token (TTL: 7 hari), disimpan di
       database (hashed) dan dikirim sebagai httpOnly cookie.
    9. Sistem mengarahkan pengguna ke dashboard sesuai role.
+-- Alternative  :
    A1 (Akun Mitra belum diverifikasi):
        6a. Sistem menampilkan pesan: "Akun Anda sedang menunggu
            verifikasi Administrator."
        6b. Use case berakhir.
+-- Exception    :
    E1 (Email tidak ditemukan atau password salah):
        4e-5e. Sistem menampilkan pesan generik: "Email atau password
               tidak valid." (tidak spesifik untuk mencegah user enumeration).
        Sistem mencatat percobaan gagal untuk rate limiting.
    E2 (Akun dinonaktifkan):
        6e. Sistem menampilkan: "Akun Anda telah dinonaktifkan.
            Hubungi administrator."
+-- Postcondition:
    1. Pengguna terautentikasi dan mendapatkan access token (JWT).
    2. Refresh token tersimpan di database dan di httpOnly cookie.
    3. Pengguna berada di halaman dashboard sesuai rolenya.
```

---

### UC-011: Lamar Peluang Internal

```
+-- Aktor        : Mahasiswa (A-01), Sistem (A-05)
+-- Deskripsi    : Mahasiswa mengajukan lamaran untuk peluang yang
                   menggunakan sistem apply internal platform.
+-- Precondition :
    1. Mahasiswa sudah login (access token valid).
    2. Peluang yang dituju berstatus approved dan apply_type = internal.
    3. Mahasiswa belum pernah melamar peluang yang sama.
    4. Mahasiswa sudah mengunggah minimal 1 CV ke profil.
+-- Basic Flow   :
    1. Mahasiswa membuka halaman detail peluang.
    2. Sistem menampilkan tombol "Lamar Sekarang".
    3. Mahasiswa menekan tombol "Lamar Sekarang".
    4. Sistem menampilkan form lamaran:
       - Dropdown pilih CV (dari CV yang sudah diunggah).
       - Textarea cover letter (wajib, maks. 2000 karakter).
    5. Mahasiswa memilih CV dan mengisi cover letter.
    6. Mahasiswa menekan tombol "Kirim Lamaran".
    7. Sistem memvalidasi input (CV dipilih, cover letter tidak kosong).
    8. Sistem menyimpan data lamaran ke database dengan status pending.
    9. Sistem membuat notifikasi in-app untuk Mitra Industri terkait.
    10. Sistem mengirimkan konfirmasi email ke Mahasiswa.
    11. Sistem menampilkan pesan sukses: "Lamaran Anda berhasil dikirim."
+-- Alternative  :
    A1 (Belum ada CV yang diunggah):
        4a. Sistem menampilkan pesan: "Anda belum mengunggah CV. Upload
            CV terlebih dahulu." dengan link ke halaman profil.
        4b. Use case berakhir atau diarahkan ke UC-012.
    A2 (Deadline sudah lewat):
        2a. Sistem menampilkan status "Pendaftaran Ditutup" dan
            menonaktifkan tombol lamar.
+-- Exception    :
    E1 (Sudah pernah melamar):
        8e. Sistem mendeteksi duplikasi lamaran.
        8f. Sistem menampilkan: "Anda sudah pernah melamar peluang ini."
        Use case berakhir.
    E2 (Token expired saat submit):
        7e. Sistem mengembalikan HTTP 401.
        7f. Frontend melakukan silent refresh token, lalu mengulang
            request. Jika refresh gagal, pengguna diarahkan ke login.
+-- Postcondition:
    1. Lamaran tersimpan di database dengan status pending.
    2. Notifikasi in-app terkirim ke Mitra Industri.
    3. Email konfirmasi terkirim ke Mahasiswa.
    4. Riwayat lamaran Mahasiswa diperbarui.
```

---

### UC-019: Posting Peluang Baru

```
+-- Aktor        : Mitra Industri (A-02), Sistem (A-05)
+-- Deskripsi    : Mitra Industri membuat dan mengirimkan posting
                   peluang baru (magang/kompetisi/pelatihan) untuk
                   ditinjau oleh Admin sebelum dipublikasikan.
+-- Precondition :
    1. Mitra Industri sudah login (status akun: approved).
    2. Mitra Industri mengakses menu "Posting Peluang".
+-- Basic Flow   :
    1. Mitra Industri mengisi form posting peluang:
       - Judul (wajib)
       - Tipe: Magang / Kompetisi / Pelatihan (wajib)
       - Deskripsi (wajib, maks. 5000 karakter)
       - Persyaratan (opsional)
       - Deadline pendaftaran (wajib, harus di masa depan)
       - Kuota peserta (opsional)
       - Tags minat: pilih dari master list (min. 1, maks. 10)
       - Tipe apply: Internal / Eksternal (wajib)
       - URL Eksternal (wajib jika tipe apply = eksternal)
    2. Mitra Industri menekan tombol "Submit untuk Review".
    3. Sistem memvalidasi seluruh input.
    4. Sistem menyimpan peluang ke database dengan status pending.
    5. Sistem membuat notifikasi in-app untuk semua Admin aktif.
    6. Sistem mengirimkan email notifikasi ke Admin.
    7. Sistem menampilkan pesan: "Peluang berhasil diajukan dan sedang
       menunggu review Admin."
+-- Alternative  :
    A1 (Simpan sebagai Draft):
        2a. Mitra memilih "Simpan Draft" alih-alih "Submit".
        4a. Sistem menyimpan peluang dengan status draft (tidak dikirim
            ke Admin untuk review).
+-- Exception    :
    E1 (Deadline di masa lampau):
        3e. Sistem menampilkan error: "Deadline harus di masa depan."
    E2 (URL eksternal tidak valid):
        3e. Sistem menampilkan error: "URL tidak valid. Masukkan URL
            yang benar (contoh: https://example.com)."
+-- Postcondition:
    1. Peluang tersimpan dengan status pending.
    2. Peluang tidak terlihat oleh Mahasiswa.
    3. Admin menerima notifikasi in-app dan email.
    4. Mitra dapat melihat peluang di daftar "Peluang Saya" dengan
       badge status "Menunggu Review".
```

---

### UC-025: Review & Approve/Reject Peluang

```
+-- Aktor        : Admin (A-03), Sistem (A-05)
+-- Deskripsi    : Administrator meninjau peluang yang diajukan oleh
                   Mitra Industri dan memutuskan untuk menyetujui atau
                   menolaknya sebelum dipublikasikan ke Mahasiswa.
+-- Precondition :
    1. Admin sudah login.
    2. Terdapat minimal 1 peluang dengan status pending di sistem.
+-- Basic Flow   :
    1. Admin membuka halaman "Moderasi Konten" di dashboard Admin.
    2. Sistem menampilkan daftar semua peluang berstatus pending,
       diurutkan dari yang paling lama menunggu (FIFO).
    3. Admin memilih satu peluang dan menekan "Lihat Detail".
    4. Sistem menampilkan seluruh informasi peluang: judul, tipe,
       deskripsi, persyaratan, deadline, tags, informasi perusahaan.
    5. Admin menilai kelayakan konten.
    6. [Approve] Admin menekan tombol "Setujui".
        6a. Sistem memperbarui status peluang menjadi approved.
        6b. Sistem membuat notifikasi in-app untuk Mitra Industri.
        6c. Sistem mengirimkan email ke Mitra: "Peluang Anda telah
            disetujui dan sekarang aktif."
        6d. Peluang muncul di halaman browse publik dan rekomendasi.
    7. [Reject] Admin menekan tombol "Tolak".
        7a. Sistem menampilkan field "Alasan Penolakan" (opsional tapi
            sangat dianjurkan).
        7b. Admin mengisi alasan dan menekan "Konfirmasi Tolak".
        7c. Sistem memperbarui status peluang menjadi rejected.
        7d. Sistem membuat notifikasi in-app untuk Mitra Industri.
        7e. Sistem mengirimkan email ke Mitra: "Peluang Anda ditolak"
            beserta alasan penolakan.
+-- Alternative  :
    A1 (Tidak ada peluang pending):
        2a. Sistem menampilkan pesan: "Tidak ada konten yang perlu
            direview saat ini."
+-- Exception    :
    E1 (Peluang dihapus Mitra saat Admin sedang review):
        4e. Sistem menampilkan: "Peluang ini tidak lagi tersedia."
        4f. Admin diarahkan kembali ke daftar moderasi.
+-- Postcondition:
    [Approve]:
    1. Status peluang = approved; terlihat oleh Mahasiswa.
    2. Mitra menerima notifikasi approval.
    [Reject]:
    1. Status peluang = rejected; tidak terlihat oleh Mahasiswa.
    2. Mitra menerima notifikasi rejection beserta alasan.
```

---

### UC-009: Lihat Rekomendasi Peluang

```
+-- Aktor        : Mahasiswa (A-01), Sistem (A-05)
+-- Deskripsi    : Sistem secara otomatis menghitung dan menampilkan
                   peluang yang paling relevan dengan minat Mahasiswa
                   setiap kali dashboard dimuat.
+-- Precondition :
    1. Mahasiswa sudah login.
    2. Mahasiswa sudah menyelesaikan onboarding minat (≥ 3 tag dipilih).
+-- Basic Flow   :
    1. Mahasiswa membuka atau me-refresh halaman dashboard.
    2. Frontend mengirimkan request GET /api/recommendations.
    3. Sistem mengambil daftar tag minat Mahasiswa dari database.
    4. Sistem menjalankan algoritma rule-based:
       - Query semua peluang & proyek berstatus approved yang belum
         melewati deadline.
       - Hitung jumlah irisan tag: (opportunity.tags ∩ user.interests).
       - Filter: hanya peluang dengan irisan ≥ 1 tag.
       - Urutkan: descending berdasarkan jumlah tag cocok, lalu
         berdasarkan tanggal posting terbaru.
       - Batasi: ambil maksimal 10 item teratas.
    5. [Ada hasil] Sistem mengembalikan daftar rekomendasi.
       Frontend menampilkan seksi "Direkomendasikan untuk Anda" dengan
       card peluang.
    6. [Tidak ada hasil / fallback] Sistem mengembalikan 10 peluang
       terbaru yang approved.
       Frontend menampilkan seksi "Peluang Terbaru" sebagai fallback.
+-- Alternative  :
    A1 (Mahasiswa belum set tag minat):
        3a. Sistem mendeteksi belum ada tag terpilih.
        3b. Sistem menampilkan banner: "Lengkapi minat Anda untuk
            mendapatkan rekomendasi personal." dengan link ke UC-005.
        3c. Sistem menampilkan fallback: 10 peluang terbaru.
+-- Exception    :
    E1 (Database timeout):
        4e. Sistem mengembalikan respons error terstruktur.
        4f. Frontend menampilkan pesan: "Gagal memuat rekomendasi.
            Coba refresh halaman."
+-- Postcondition:
    1. Seksi rekomendasi di dashboard terisi dengan data terbaru.
    2. Tidak ada perubahan state pada database (operasi read-only).
```

---

### UC-023: Update Status Lamaran

```
+-- Aktor        : Mitra Industri (A-02), Sistem (A-05)
+-- Deskripsi    : Mitra Industri meninjau profil pelamar dan memperbarui
                   status lamaran dari pending menjadi reviewed, accepted,
                   atau rejected.
+-- Precondition :
    1. Mitra Industri sudah login (status akun: approved).
    2. Terdapat lamaran masuk pada peluang milik Mitra tersebut.
+-- Basic Flow   :
    1. Mitra membuka menu "Lamaran Masuk" dan memilih peluang.
    2. Sistem menampilkan daftar pelamar: nama, NIM, universitas,
       tanggal melamar, status saat ini.
    3. Mitra memilih satu pelamar dan membuka detail lamaran.
    4. Sistem menampilkan: cover letter, link CV (Cloudinary), profil
       ringkas Mahasiswa.
    5. Mitra memilih status baru dari dropdown:
       pending → reviewed → accepted / rejected.
    6. Mitra menekan "Simpan Status".
    7. Sistem memvalidasi transisi status (tidak bisa mundur ke pending).
    8. Sistem memperbarui status lamaran di database.
    9. Sistem membuat notifikasi in-app untuk Mahasiswa.
    10. Sistem mengirimkan email notifikasi ke Mahasiswa dengan status
        terbaru.
+-- Alternative  :
    A1 (Mitra ingin menambah catatan/feedback):
        6a. Mitra mengisi field "Catatan" (opsional) sebelum menyimpan.
        8a. Catatan tersimpan bersama perubahan status.
+-- Exception    :
    E1 (Transisi status tidak valid):
        7e. Sistem menampilkan: "Perubahan status tidak valid."
        Use case kembali ke langkah 5.
    E2 (Lamaran sudah dihapus pelamar):
        8e. Sistem menampilkan pesan error. Daftar pelamar di-refresh.
+-- Postcondition:
    1. Status lamaran diperbarui di database.
    2. Mahasiswa menerima notifikasi in-app dan email.
    3. Riwayat lamaran Mahasiswa menampilkan status terbaru.
```

---

## 4.0 TRACEABILITY MATRIX — FR (SRS) → UC

| FR (SRS) | Deskripsi FR | Use Case Terkait |
|----------|-------------|-----------------|
| FR-001.1–001.8 | Registrasi Pengguna | UC-001 |
| FR-002.1–002.6 | Autentikasi & Manajemen Sesi | UC-002, UC-003 |
| FR-003.1–003.5 | Role-Based Access Control | UC-002, UC-011, UC-019, UC-025 |
| FR-004.1 | Update profil Mahasiswa | UC-004 |
| FR-004.2–004.4 | Upload & kelola CV | UC-012 |
| FR-004.5 | Riwayat lamaran | UC-015 |
| FR-005.1–005.3 | Onboarding & update tag minat | UC-005 |
| FR-005.4 | Admin kelola master tag | UC-028 |
| FR-006.1–006.6 | Posting & kelola peluang | UC-019, UC-020 |
| FR-007.1–007.4 | Posting & kelola proyek | UC-021 |
| FR-008.1–008.5 | Browse, cari & filter peluang | UC-007, UC-008 |
| FR-009.1–009.5 | Sistem rekomendasi berbasis rule | UC-009, UC-031 |
| FR-010.1–010.3 | Lamar peluang internal | UC-011 |
| FR-010.2 | Lamar peluang eksternal | UC-013 |
| FR-010.4–010.5 | Lihat & update status pelamar | UC-022, UC-023 |
| FR-010.6 | Notifikasi perubahan status lamaran | UC-023, UC-033 |
| FR-010.7 | Lamar proyek kolaborasi | UC-014 |
| FR-011.1–011.2 | Moderasi & approve/reject peluang | UC-025 |
| FR-011.2 | Moderasi & approve/reject proyek | UC-026 |
| FR-011.3 | Notifikasi hasil moderasi | UC-025, UC-026, UC-033 |
| FR-011.4 | Kelola akun pengguna | UC-027 |
| FR-011.5 | Dashboard statistik Admin | UC-024 |
| FR-012.1–012.4 | Sistem notifikasi in-app & email | UC-016, UC-033 |

### Ringkasan Coverage

| Jumlah FR | Jumlah UC Utama | UC Detail | Coverage |
|:---------:|:---------------:|:---------:|:--------:|
| 12 FR (60+ sub-req) | 33 Use Case | 6 UC Terdetail | 100% FR terpetakan |

---

*Dokumen ini merupakan bagian dari dokumentasi sistem I.R.O.N L.U.N.G v1.0.0*
*Referensi: SRS.md v1.0.0 | IEEE 830-1998*

**Versi:** 1.0.0 | **Tanggal:** 06 Mei 2026 | **Klasifikasi:** Internal — Kelompok 6
