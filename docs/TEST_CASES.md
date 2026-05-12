# TEST CASES DETAIL
## I.R.O.N L.U.N.G — Seksi 9 dari Master Test Plan (MTP)

| Item | Detail |
|------|--------|
| **Versi** | 1.0.0 |
| **Tanggal** | 06 Mei 2026 |
| **Referensi** | MTP.md v1.0.0, SRS.md v1.0.0 |
| **Format** | TC-[nnn] \| FR/UC \| Tipe \| Input \| Langkah \| Expected Output \| Aktual \| Status |

> **Keterangan Status:** ⬜ Belum Dieksekusi | ✅ Pass | ❌ Fail | ⏭️ Skipped

---

## MODUL 1: REGISTRASI PENGGUNA (FR-001)

### TC-001 — Registrasi Mahasiswa Berhasil
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-001.1, FR-001.2 / UC-001 |
| **Tipe** | System / Positive |
| **Precondition** | Email belum terdaftar; halaman registrasi terbuka |
| **Input** | email: `test.mahasiswa@email.com`, password: `Test@1234`, role: `mahasiswa`, nama: `Budi Santoso`, nim: `21/123456/TK`, universitas: `UGM`, jurusan: `Ilmu Komputer` |
| **Langkah** | 1. Buka `/register` → 2. Pilih role Mahasiswa → 3. Isi semua field → 4. Klik Daftar |
| **Expected Output** | HTTP 201; akun tersimpan; redirect ke halaman onboarding minat; email selamat datang terkirim |
| **Status** | ⬜ |

---

### TC-002 — Registrasi dengan Email Duplikat
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-001.4 / UC-001 |
| **Tipe** | System / Negative |
| **Precondition** | Email `test.mahasiswa@email.com` sudah terdaftar |
| **Input** | email: `test.mahasiswa@email.com` (duplikat), field lain valid |
| **Langkah** | 1. Buka `/register` → 2. Isi form dengan email duplikat → 3. Klik Daftar |
| **Expected Output** | HTTP 422; pesan error: "Email sudah terdaftar"; form tidak di-submit |
| **Status** | ⬜ |

---

### TC-003 — Registrasi dengan Password Lemah
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-001.5 / UC-001 |
| **Tipe** | System / Negative |
| **Precondition** | Halaman registrasi terbuka |
| **Input** | password: `12345678` (tidak ada huruf besar & karakter khusus) |
| **Langkah** | 1. Isi form → 2. Masukkan password lemah → 3. Klik Daftar |
| **Expected Output** | HTTP 422; pesan validasi: "Password minimal 8 karakter dengan 1 huruf besar dan 1 angka" |
| **Status** | ⬜ |

---

### TC-004 — Registrasi Mitra Industri — Status Pending
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-001.8 / UC-001 |
| **Tipe** | System / Positive |
| **Precondition** | Email belum terdaftar |
| **Input** | role: `mitra`, email: `mitra@company.com`, password: `Mitra@1234`, nama_perusahaan: `PT Maju Bersama`, bidang_industri: `Teknologi` |
| **Langkah** | 1. Register sebagai mitra → 2. Isi data perusahaan → 3. Submit |
| **Expected Output** | Akun tersimpan dengan verification_status = `pending`; tampil pesan "Akun menunggu verifikasi Admin" |
| **Status** | ⬜ |

---

## MODUL 2: AUTENTIKASI & SESI (FR-002)

### TC-005 — Login Berhasil sebagai Mahasiswa
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-002.1, FR-002.2 / UC-002 |
| **Tipe** | Integration / Positive |
| **Precondition** | Akun mahasiswa aktif terdaftar |
| **Input** | email: `test.mahasiswa@email.com`, password: `Test@1234` |
| **Langkah** | 1. POST `/api/auth/login` dengan kredensial valid |
| **Expected Output** | HTTP 200; response body berisi `access_token`; Set-Cookie header berisi `refresh_token` (httpOnly, Secure) |
| **Status** | ⬜ |

---

### TC-006 — Login dengan Kredensial Salah
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-002.1 / UC-002 |
| **Tipe** | Integration / Negative |
| **Input** | email: `test.mahasiswa@email.com`, password: `SalahPassword` |
| **Langkah** | 1. POST `/api/auth/login` dengan password salah |
| **Expected Output** | HTTP 401; pesan generik: "Email atau password tidak valid" (tidak menyebut field mana yang salah) |
| **Status** | ⬜ |

---

### TC-007 — Rate Limiting Login (Brute Force)
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-002.5 / NFR-002.7 |
| **Tipe** | Security / Negative |
| **Input** | 11 request POST `/api/auth/login` berturut-turut dari IP yang sama dalam 15 menit |
| **Langkah** | 1. Kirim 10 request login gagal → 2. Kirim request ke-11 |
| **Expected Output** | Request ke-11 mengembalikan HTTP 429 Too Many Requests; header `Retry-After` tersedia |
| **Status** | ⬜ |

---

### TC-008 — Silent Token Refresh
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-002.3 / UC-002 |
| **Tipe** | Integration / Positive |
| **Precondition** | Pengguna sudah login; access token expired (simulasi TTL) |
| **Langkah** | 1. POST `/api/auth/refresh` dengan valid refresh token di cookie |
| **Expected Output** | HTTP 200; access_token baru diterbitkan; refresh token lama diinvalidasi; refresh token baru di-set di cookie |
| **Status** | ⬜ |

---

### TC-009 — Logout
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-002.4 / UC-003 |
| **Tipe** | Integration / Positive |
| **Precondition** | Pengguna sudah login; refresh token aktif di DB |
| **Langkah** | 1. POST `/api/auth/logout` dengan valid access token |
| **Expected Output** | HTTP 200; refresh_token terhapus dari database; cookie dihapus; akses dengan token lama mengembalikan HTTP 401 |
| **Status** | ⬜ |

---

## MODUL 3: ROLE-BASED ACCESS CONTROL (FR-003)

### TC-010 — Mahasiswa Akses Endpoint Admin (Unauthorized)
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-003.5 / UC-002 |
| **Tipe** | Security / Negative |
| **Input** | GET `/api/admin/users` dengan JWT token milik mahasiswa |
| **Langkah** | 1. Login sebagai mahasiswa → 2. Request endpoint admin |
| **Expected Output** | HTTP 403 Forbidden; pesan: "Akses ditolak" |
| **Status** | ⬜ |

---

### TC-011 — Akses Endpoint Tanpa Token
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-003.1 |
| **Tipe** | Security / Negative |
| **Input** | GET `/api/mahasiswa/profile` tanpa Authorization header |
| **Langkah** | 1. Request endpoint terproteksi tanpa token |
| **Expected Output** | HTTP 401 Unauthorized |
| **Status** | ⬜ |

---

### TC-012 — Mitra Tidak Bisa Edit Peluang Mitra Lain
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-003.3 / FR-006.5 |
| **Tipe** | Security / Negative |
| **Input** | PUT `/api/opportunities/{id_milik_mitra_lain}` dengan token milik Mitra B |
| **Langkah** | 1. Login sebagai Mitra B → 2. Coba edit peluang milik Mitra A |
| **Expected Output** | HTTP 403 Forbidden |
| **Status** | ⬜ |

---

## MODUL 4: POSTING PELUANG (FR-006)

### TC-013 — Mitra Posting Peluang Berhasil
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-006.1, FR-006.2, FR-006.3 / UC-019 |
| **Tipe** | System / Positive |
| **Precondition** | Akun mitra dengan verification_status = approved |
| **Input** | title: `Magang Backend Dev`, type: `magang`, description: `[valid]`, deadline: `2026-12-01`, apply_type: `internal`, tags: [1, 3] |
| **Langkah** | 1. POST `/api/opportunities` → 2. Cek response → 3. Cek DB |
| **Expected Output** | HTTP 201; status = `pending`; tidak muncul di halaman browse publik; Admin menerima notifikasi |
| **Status** | ⬜ |

---

### TC-014 — Posting Peluang dengan Deadline Lampau
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-006.2 |
| **Tipe** | Unit / Negative |
| **Input** | deadline: `2020-01-01` (masa lampau) |
| **Langkah** | 1. POST `/api/opportunities` dengan deadline lampau |
| **Expected Output** | HTTP 422; pesan validasi: "Deadline harus di masa depan" |
| **Status** | ⬜ |

---

### TC-015 — Posting Peluang External Tanpa URL
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-006.2 (constraint external_url) |
| **Tipe** | Unit / Negative |
| **Input** | apply_type: `external`, external_url: null |
| **Langkah** | 1. POST `/api/opportunities` tanpa external_url saat type=external |
| **Expected Output** | HTTP 422; pesan: "URL eksternal wajib diisi untuk tipe apply eksternal" |
| **Status** | ⬜ |

---

## MODUL 5: SISTEM REKOMENDASI (FR-009)

### TC-016 — Rekomendasi Berdasarkan Tag Minat
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-009.1 – 009.4 / UC-009 |
| **Tipe** | System / Positive |
| **Precondition** | Mahasiswa punya tag minat [Web Dev, Backend]; Ada 3 peluang approved: P1 (tags: Web Dev), P2 (tags: Web Dev, Backend), P3 (tags: Game Dev) |
| **Langkah** | 1. Login sebagai mahasiswa → 2. GET `/api/recommendations` |
| **Expected Output** | Response berisi P2 (2 match) di urutan pertama, P1 (1 match) kedua, P3 tidak muncul; maksimal 10 item |
| **Status** | ⬜ |

---

### TC-017 — Rekomendasi Fallback (Tidak Ada Match)
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-009.5 / UC-009 |
| **Tipe** | System / Positive |
| **Precondition** | Mahasiswa punya tag minat [Blockchain]; Tidak ada peluang dengan tag Blockchain |
| **Langkah** | 1. Login → 2. GET `/api/recommendations` |
| **Expected Output** | Response berisi 10 peluang approved terbaru (fallback); tidak kosong |
| **Status** | ⬜ |

---

## MODUL 6: LAMARAN INTERNAL (FR-010)

### TC-018 — Mahasiswa Melamar Peluang Internal Berhasil
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-010.1 / UC-011 |
| **Tipe** | System / Positive |
| **Precondition** | Mahasiswa login; peluang approved, apply_type=internal; mahasiswa punya CV; belum pernah melamar |
| **Input** | opportunity_id: `5`, cv_url: `[url_cv_valid]`, cover_letter: `Saya tertarik karena...` |
| **Langkah** | 1. POST `/api/applications` → 2. Cek DB applications → 3. Cek notifikasi Mitra |
| **Expected Output** | HTTP 201; application status = `pending`; Mitra menerima notifikasi in-app; email konfirmasi terkirim ke Mahasiswa |
| **Status** | ⬜ |

---

### TC-019 — Mahasiswa Melamar Dua Kali (Duplikat)
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-010.3 / UC-011 |
| **Tipe** | System / Negative |
| **Precondition** | Mahasiswa sudah melamar peluang ID=5 |
| **Input** | POST `/api/applications` dengan opportunity_id=5 lagi |
| **Langkah** | 1. Submit lamaran kedua ke peluang yang sama |
| **Expected Output** | HTTP 422; pesan: "Anda sudah pernah melamar peluang ini" |
| **Status** | ⬜ |

---

### TC-020 — Mitra Update Status Lamaran
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-010.5, FR-010.6 / UC-023 |
| **Tipe** | System / Positive |
| **Precondition** | Ada lamaran status=pending milik mahasiswa ke peluang Mitra ini |
| **Input** | PATCH `/api/applications/{id}` dengan status: `accepted` |
| **Langkah** | 1. Login sebagai Mitra → 2. Update status lamaran → 3. Cek notifikasi mahasiswa |
| **Expected Output** | HTTP 200; status lamaran berubah jadi `accepted`; Mahasiswa menerima notifikasi in-app + email |
| **Status** | ⬜ |

---

## MODUL 7: MODERASI ADMIN (FR-011)

### TC-021 — Admin Approve Peluang
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-011.1, FR-011.2 / UC-025 |
| **Tipe** | System / Positive |
| **Precondition** | Admin login; ada peluang status=pending |
| **Langkah** | 1. GET `/api/admin/opportunities?status=pending` → 2. PATCH `/api/admin/opportunities/{id}/approve` |
| **Expected Output** | HTTP 200; status = `approved`; peluang muncul di browse publik; Mitra menerima notifikasi approval |
| **Status** | ⬜ |

---

### TC-022 — Admin Reject Peluang dengan Alasan
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-011.2, FR-011.3 / UC-025 |
| **Tipe** | System / Positive |
| **Input** | PATCH `/api/admin/opportunities/{id}/reject` dengan rejection_reason: `Konten tidak sesuai kebijakan` |
| **Langkah** | 1. Login Admin → 2. Reject peluang dengan alasan |
| **Expected Output** | HTTP 200; status = `rejected`; peluang tidak di browse; Mitra menerima notifikasi + alasan penolakan via email |
| **Status** | ⬜ |

---

## MODUL 8: UPLOAD FILE (FR-004, NFR-002.8)

### TC-023 — Upload CV Valid
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-004.2, FR-004.4 |
| **Tipe** | Integration / Positive |
| **Precondition** | Mahasiswa login; file PDF berukuran 3MB tersedia |
| **Input** | POST `/api/mahasiswa/cv` multipart/form-data dengan file PDF 3MB |
| **Langkah** | 1. Upload file → 2. Cek response URL → 3. Verifikasi URL dapat diakses di browser |
| **Expected Output** | HTTP 200; `cv_url` berisi Cloudinary URL valid; file dapat diakses |
| **Status** | ⬜ |

---

### TC-024 — Upload File Berbahaya (Eksekutable)
| Field | Detail |
|-------|--------|
| **FR/UC** | NFR-002.8 |
| **Tipe** | Security / Negative |
| **Input** | POST `/api/mahasiswa/cv` dengan file `.exe` |
| **Langkah** | 1. Upload file .exe ke endpoint upload CV |
| **Expected Output** | HTTP 422; pesan: "Tipe file tidak diizinkan. Hanya PDF yang diterima" |
| **Status** | ⬜ |

---

### TC-025 — Upload File Melebihi Batas Ukuran
| Field | Detail |
|-------|--------|
| **FR/UC** | NFR-002.8 |
| **Tipe** | Security / Negative |
| **Input** | POST `/api/mahasiswa/cv` dengan file PDF berukuran 6MB (limit: 5MB) |
| **Langkah** | 1. Upload file oversized |
| **Expected Output** | HTTP 422; pesan: "Ukuran file melebihi batas maksimal 5MB" |
| **Status** | ⬜ |

---

## MODUL 9: NOTIFIKASI (FR-012)

### TC-026 — Notifikasi In-App Terbaca
| Field | Detail |
|-------|--------|
| **FR/UC** | FR-012.1, FR-012.2 / UC-016 |
| **Tipe** | System / Positive |
| **Precondition** | Mahasiswa punya 1 notifikasi belum dibaca (is_read=false) |
| **Langkah** | 1. GET `/api/notifications` → 2. PATCH `/api/notifications/{id}/read` |
| **Expected Output** | GET: notifikasi muncul dengan is_read=false; PATCH: HTTP 200; is_read berubah jadi true |
| **Status** | ⬜ |

---

## MODUL 10: PERFORMANCE & KEAMANAN

### TC-027 — SQL Injection pada Endpoint Search
| Field | Detail |
|-------|--------|
| **FR/UC** | NFR-002.6 |
| **Tipe** | Security / Negative |
| **Input** | GET `/api/opportunities?search=' OR '1'='1` |
| **Langkah** | 1. Kirim request dengan SQL injection payload di parameter search |
| **Expected Output** | HTTP 200 dengan hasil pencarian normal (string diperlakukan sebagai literal); tidak ada data leak; tidak ada error SQL |
| **Status** | ⬜ |

---

### TC-028 — XSS pada Field Deskripsi
| Field | Detail |
|-------|--------|
| **FR/UC** | NFR-002.5 |
| **Tipe** | Security / Negative |
| **Input** | description: `<script>alert('XSS')</script>Deskripsi valid` |
| **Langkah** | 1. Submit peluang dengan payload XSS di deskripsi → 2. Buka halaman detail peluang di browser |
| **Expected Output** | Script tidak dieksekusi di browser; output di-escape menjadi teks literal; tidak ada alert popup |
| **Status** | ⬜ |

---

### TC-029 — Load Test: 200 Concurrent Users (Browse)
| Field | Detail |
|-------|--------|
| **FR/UC** | NFR-001.1, NFR-001.3 |
| **Tipe** | Performance |
| **Tool** | k6 |
| **Skenario** | 200 virtual users, durasi 10 menit, semua melakukan GET `/api/opportunities` |
| **Expected Output** | P95 response time ≤ 300ms; error rate < 1%; tidak ada server crash |
| **Status** | ⬜ |

---

### TC-030 — Load Test: Endpoint Rekomendasi
| Field | Detail |
|-------|--------|
| **FR/UC** | NFR-001.2 / FR-009 |
| **Tipe** | Performance |
| **Tool** | k6 |
| **Skenario** | 100 virtual users authenticated, durasi 5 menit, GET `/api/recommendations` |
| **Expected Output** | P95 response time ≤ 500ms (toleransi lebih karena kalkulasi DB); error rate < 1% |
| **Status** | ⬜ |

---

## RINGKASAN TEST CASES

| Modul | Jumlah TC | Positive | Negative | Security | Performance |
|-------|:---------:|:--------:|:--------:|:--------:|:-----------:|
| Registrasi | 4 | 2 | 2 | - | - |
| Autentikasi & Sesi | 5 | 3 | 1 | 1 | - |
| RBAC | 3 | - | - | 3 | - |
| Posting Peluang | 3 | 1 | 2 | - | - |
| Rekomendasi | 2 | 2 | - | - | - |
| Lamaran | 3 | 2 | 1 | - | - |
| Moderasi Admin | 2 | 2 | - | - | - |
| Upload File | 3 | 1 | 1 | 1 | - |
| Notifikasi | 1 | 1 | - | - | - |
| Security & Performance | 4 | - | 1 | 2 | 2 |
| **TOTAL** | **30** | **14** | **8** | **7** | **2** |

---

*Dokumen ini adalah Seksi 9 dari MTP.md*
*I.R.O.N L.U.N.G v1.0.0 | 06 Mei 2026 | Kelompok 6*
