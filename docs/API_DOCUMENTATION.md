# API DOCUMENTATION (RESTful API)
## I.R.O.N L.U.N.G v1.0.0

Dokumen ini menjelaskan spesifikasi antarmuka pemrograman aplikasi (API) untuk sistem I.R.O.N L.U.N.G berbasis standar arsitektur RESTful.

---

## 1. STRATEGI VERSI (Versioning Strategy)
Sistem menggunakan **URI Versioning**.
- **Base URL:** `https://api.ironlung.ac.id/api/v1`
- **Tujuan:** Memastikan kompatibilitas backward ketika terjadi *breaking changes* di masa depan (misal: `/api/v2/`).

## 2. MEKANISME AUTENTIKASI (JWT)
Seluruh endpoint terproteksi mengamankan akses menggunakan JSON Web Token (JWT).
- **Header:** `Authorization: Bearer <access_token>`
- **Payload:** Berisi `user_id`, `email`, dan `role` (mahasiswa, mitra, admin).
- **Expiry (TTL):**
  - **Access Token:** 15 Menit. Disimpan di memory/state frontend.
  - **Refresh Token:** 7 Hari. Disimpan sebagai `httpOnly`, `Secure`, `SameSite=Strict` cookie untuk mencegah serangan XSS.

## 3. KEBIJAKAN RATE LIMITING (Rate Limiting Policy)
Untuk mencegah serangan *brute force* dan DDoS, endpoint API dibatasi menggunakan *sliding window*:
- **Global API:** 60 requests per menit per IP.
- **Endpoint Auth (`/auth/login`, `/auth/register`):** 10 requests per 15 menit per IP.
- **Response Error jika melebihi batas:** `429 Too Many Requests`

---

## 4. ENDPOINT DOCUMENTATION

### 4.1. Autentikasi (Authentication)

#### 4.1.1. Login Pengguna
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/login`
- **Auth:** None
- **Request Body:**
  ```json
  {
    "email": "anders@student.ac.id",
    "password": "Password123!"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "message": "Login berhasil.",
    "data": {
      "access_token": "eyJhbGci...",
      "user": {
        "id": 1,
        "email": "anders@student.ac.id",
        "role": "mahasiswa"
      }
    }
  }
  ```
  *(Header: Set-Cookie: refresh_token=abc123xyz; HttpOnly; Secure)*
- **Response Error:**
  - `400 Bad Request` (Validasi gagal)
  - `401 Unauthorized` (Email/Password salah)
  - `403 Forbidden` (Akun dinonaktifkan/belum diverifikasi)
  - `429 Too Many Requests`
- **Contoh cURL:**
  ```bash
  curl -X POST https://api.ironlung.ac.id/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"anders@student.ac.id", "password":"Password123!"}'
  ```

#### 4.1.2. Refresh Token
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/refresh-token`
- **Auth:** None (Menggunakan HttpOnly Cookie)
- **Request Body:** Kosong
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "message": "Token berhasil diperbarui.",
    "data": {
      "access_token": "eyJhbGci...new_token"
    }
  }
  ```
- **Response Error:**
  - `401 Unauthorized` (Refresh token tidak valid / expired)

#### 4.1.3. Logout
- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/logout`
- **Auth:** Bearer Token
- **Request Body:** Kosong
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "message": "Logout berhasil.",
    "data": null
  }
  ```

---

### 4.2. Peluang (Opportunities)

#### 4.2.1. Dapatkan Daftar Rekomendasi Peluang
- **Method:** `GET`
- **Endpoint:** `/api/v1/opportunities/recommendations`
- **Auth:** Bearer Token (Role: Mahasiswa)
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "message": "Rekomendasi peluang berhasil diambil.",
    "data": {
      "opportunities": [
        {
          "id": 5,
          "title": "Backend Engineer Intern",
          "type": "magang",
          "company_name": "PT GoTo",
          "deadline": "2026-05-30",
          "match_count": 3
        }
      ]
    }
  }
  ```
- **Response Error:** `401 Unauthorized`
- **Contoh cURL:**
  ```bash
  curl -X GET https://api.ironlung.ac.id/api/v1/opportunities/recommendations \
  -H "Authorization: Bearer eyJhbGci..."
  ```

#### 4.2.2. Buat Peluang Baru (Mitra)
- **Method:** `POST`
- **Endpoint:** `/api/v1/opportunities`
- **Auth:** Bearer Token (Role: Mitra Industri)
- **Request Body:**
  ```json
  {
    "title": "UI/UX Designer Intern",
    "type": "magang",
    "description": "Dibutuhkan intern untuk merancang antarmuka aplikasi web.",
    "deadline": "2026-06-15",
    "apply_type": "internal",
    "tags": [2, 5, 8]
  }
  ```
- **Response 201 Created:**
  ```json
  {
    "status": "success",
    "message": "Peluang berhasil diajukan dan menunggu review.",
    "data": {
      "id": 10,
      "status": "pending"
    }
  }
  ```
- **Response Error:** `401 Unauthorized`, `403 Forbidden`, `422 Unprocessable Entity`

#### 4.2.3. Moderasi Peluang (Admin)
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/opportunities/{id}/status`
- **Auth:** Bearer Token (Role: Admin)
- **Request Body:**
  ```json
  {
    "status": "approved",
    "rejection_reason": ""
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "message": "Status peluang berhasil diperbarui.",
    "data": null
  }
  ```

---

### 4.3. Lamaran (Applications)

#### 4.3.1. Lamar Peluang Internal (Mahasiswa)
- **Method:** `POST`
- **Endpoint:** `/api/v1/applications`
- **Auth:** Bearer Token (Role: Mahasiswa)
- **Request Body:**
  ```json
  {
    "opportunity_id": 5,
    "cv_url": "https://res.cloudinary.com/.../cv_anders.pdf",
    "cover_letter": "Saya tertarik bergabung karena..."
  }
  ```
- **Response 201 Created:**
  ```json
  {
    "status": "success",
    "message": "Lamaran Anda berhasil dikirim.",
    "data": {
      "application_id": 42,
      "status": "pending"
    }
  }
  ```
- **Response Error:** `400 Bad Request` (Pernah melamar), `422 Unprocessable Entity`

#### 4.3.2. Update Status Lamaran (Mitra)
- **Method:** `PATCH`
- **Endpoint:** `/api/v1/applications/{id}/status`
- **Auth:** Bearer Token (Role: Mitra Industri)
- **Request Body:**
  ```json
  {
    "status": "accepted",
    "notes": "Selamat! Anda diterima, HR kami akan menghubungi via email."
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "message": "Status lamaran berhasil diperbarui.",
    "data": null
  }
  ```
- **Contoh cURL:**
  ```bash
  curl -X PATCH https://api.ironlung.ac.id/api/v1/applications/42/status \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{"status":"accepted"}'
  ```

---

### 4.4. Laporan & Export (Reports)

#### 4.4.1. Dapatkan Statistik Platform
- **Method:** `GET`
- **Endpoint:** `/api/v1/reports/statistics`
- **Auth:** Bearer Token (Role: Admin, Mitra)
- **Response 200 OK:**
  ```json
  {
    "status": "success",
    "message": "Statistik berhasil diambil.",
    "data": {
      "total_opportunities": 145,
      "total_applications": 890,
      "active_users": 520
    }
  }
  ```

#### 4.4.2. Export Data Lamaran
- **Method:** `GET`
- **Endpoint:** `/api/v1/reports/export-applications?opportunity_id=5&format=csv`
- **Auth:** Bearer Token (Role: Mitra Industri, Admin)
- **Response 200 OK:**
  - `Content-Type: text/csv` atau `application/pdf`
  - Berisi file biner/CSV yang didownload langsung.
- **Response Error:**
  - `400 Bad Request` (Format tidak valid)
  - `403 Forbidden` (Bukan pemilik peluang)
  - `404 Not Found` (Peluang tidak ditemukan)
- **Contoh cURL:**
  ```bash
  curl -X GET "https://api.ironlung.ac.id/api/v1/reports/export-applications?opportunity_id=5&format=csv" \
  -H "Authorization: Bearer eyJhbGci..." \
  -o pelamar_backend_intern.csv
  ```

---

*Dokumen ini merupakan spesifikasi API (API Contract) untuk I.R.O.N L.U.N.G. Setiap implementasi kode pada backend wajib merujuk pada format Request dan Response di atas untuk menjamin sinkronisasi Frontend dan Backend.*
