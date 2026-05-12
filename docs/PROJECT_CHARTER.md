# PROJECT CHARTER
## I.R.O.N L.U.N.G — Intelligent Resource Organizer for Networking, Learning, Unified iNternships, and Group collaboration

---

## 1.0 INFORMASI PROYEK

| Item                  | Detail                                                                 |
|-----------------------|------------------------------------------------------------------------|
| **Nama Proyek**       | I.R.O.N L.U.N.G                                                       |
| **Nama Sistem**       | Intelligent Resource Organizer for Networking, Learning, Unified iNternships, and Group collaboration |
| **Klien / Lembaga**   | Kelompok 6 — Platform Digital Akademik & Career Development            |
| **Anggota Tim**       | Anders Emmanuel Tan, Dhimas Early Oceandy, Azhar Maulana, Evan Razzan Adytaputra |
| **Tanggal Mulai**     | 06 Mei 2026                                                            |
| **Estimasi Selesai**  | Akhir Semester (± Desember 2026)                                       |
| **Versi Dokumen**     | 1.0.0                                                                  |
| **Status**            | Draft — Menunggu Persetujuan                                           |
| **Standar Referensi** | IEEE 830, ISO/IEC 12207, ISO/IEC 25010                                 |

---

## 2.0 LATAR BELAKANG & PERMASALAHAN

### 2.1 Latar Belakang

Mahasiswa Ilmu Komputer menghadapi tantangan signifikan dalam menemukan peluang magang, kompetisi teknologi, pelatihan industri, dan kolaborasi proyek yang relevan dengan minat dan kompetensi mereka. Informasi tersebar di berbagai platform (LinkedIn, Instagram, grup WhatsApp, website kampus) tanpa agregasi terpusat, menyebabkan mahasiswa sering melewatkan peluang berharga.

Di sisi lain, pihak industri dan penyelenggara kompetisi kesulitan menjangkau talenta mahasiswa yang sesuai dengan kebutuhan mereka secara efisien.

### 2.2 Permasalahan Utama

| # | Permasalahan | Dampak |
|---|-------------|--------|
| P-01 | Informasi peluang tersebar di banyak platform tidak terpusat | Mahasiswa melewatkan peluang relevan |
| P-02 | Tidak ada mekanisme pencocokan minat mahasiswa dengan peluang | Rekomendasi bersifat manual dan tidak akurat |
| P-03 | Mitra industri tidak memiliki kanal resmi untuk menjangkau mahasiswa kampus | Kesulitan rekrutmen talenta muda |
| P-04 | Tidak ada sistem portofolio terintegrasi untuk mahasiswa | Mahasiswa sulit menampilkan karya saat melamar |
| P-05 | Proses pendaftaran peluang masih manual dan tidak terstruktur | Inefisiensi administrasi dan kehilangan data pelamar |

---

## 3.0 TUJUAN & MANFAAT SISTEM

### 3.1 Tujuan Sistem

1. Membangun platform terpusat yang mengagregasi peluang magang, kompetisi, pelatihan, dan proyek kolaborasi.
2. Mengimplementasikan sistem rekomendasi berbasis tag minat untuk menghubungkan mahasiswa dengan peluang yang relevan.
3. Menyediakan portal mandiri bagi mitra industri untuk memposting dan mengelola peluang secara langsung.
4. Menyediakan ruang digital bagi mahasiswa untuk membangun dan menampilkan portofolio.
5. Membangun pipeline moderasi konten oleh Admin untuk menjaga kualitas dan keamanan platform.

### 3.2 Manfaat

| Pemangku Kepentingan | Manfaat |
|----------------------|---------|
| **Mahasiswa** | Akses terpusat ke peluang relevan, portofolio digital, riwayat lamaran terstruktur |
| **Mitra Industri** | Kanal rekrutmen langsung ke komunitas mahasiswa, manajemen pelamar terintegrasi |
| **Administrator** | Kontrol penuh atas konten platform, visibilitas aktivitas pengguna |
| **Institusi Akademik** | Meningkatkan ekosistem career development mahasiswa |

---

## 4.0 RUANG LINGKUP (SCOPE)

### 4.1 Dalam Ruang Lingkup (In Scope) — MVP v1.0

- Registrasi & autentikasi pengguna (3 role: Mahasiswa, Mitra Industri, Admin)
- Manajemen profil & portofolio Mahasiswa
- Onboarding minat berbasis tag
- Posting & manajemen peluang oleh Mitra Industri (Magang, Kompetisi, Pelatihan)
- Listing proyek kolaborasi & rekrutmen anggota
- Browse, pencarian, dan filter peluang
- Sistem rekomendasi real-time berbasis rule (tag matching)
- Sistem lamaran internal (cover letter + CV) dan redirect eksternal
- Moderasi konten & approval oleh Admin
- Notifikasi in-app dan email (Gmail SMTP)
- Upload file aman (CV, portofolio) via Cloudinary
- Dashboard Admin (ringkasan statistik)

### 4.2 Di Luar Ruang Lingkup (Out of Scope) — v1.0

- Machine learning / AI recommendation engine
- Integrasi dengan SIAKAD atau sistem akademik eksternal
- Fitur task management, chat internal, atau progress tracking proyek
- OAuth Google / Social Login
- WebSocket / real-time push notification
- Upload KTM untuk verifikasi identitas mahasiswa
- Aplikasi mobile native (iOS/Android)
- Multi-bahasa (internationalization)

---

## 5.0 STAKEHOLDER & PERAN

| Stakeholder | Peran dalam Proyek | Tanggung Jawab Utama |
|-------------|-------------------|----------------------|
| **Anders Emmanuel Tan** | Project Manager / Full-Stack Lead | Koordinasi tim, arsitektur sistem, review kode |
| **Dhimas Early Oceandy** | Backend Developer | Laravel API, database, autentikasi JWT |
| **Azhar Maulana** | Frontend Developer | Next.js UI, integrasi API, Tailwind CSS |
| **Evan Razzan Adytaputra** | QA / DevOps | Testing, deployment VPS, CI/CD pipeline |
| **Mahasiswa (End User)** | Pengguna Utama | Browse & apply peluang, kelola portofolio |
| **Mitra Industri** | Pengguna Mitra | Post peluang, review pelamar |
| **Administrator** | Pengelola Platform | Moderasi konten, manajemen akun |
| **Dosen Pembimbing** | Sponsor Akademik | Review dokumen, validasi scope |

---

## 6.0 ASUMSI & KENDALA

### 6.1 Asumsi

| # | Asumsi |
|---|--------|
| A-01 | Mahasiswa mendaftar menggunakan NIM dan email valid; tidak ada verifikasi eksternal dengan SIAKAD |
| A-02 | Mitra Industri self-register; Admin bertanggung jawab memverifikasi legitimasi perusahaan secara manual |
| A-03 | Cloudinary free tier mencukupi untuk volume upload MVP (25GB storage, 25GB bandwidth/bulan) |
| A-04 | Gmail SMTP mencukupi untuk volume email notifikasi skala satu universitas |
| A-05 | VPS dengan spesifikasi 2 vCPU / 4GB RAM / 50GB SSD mencukupi untuk 200 concurrent users |
| A-06 | Tim memiliki akses ke VPS Linux (Ubuntu 22.04 LTS) untuk deployment |
| A-07 | Proyek dikerjakan dalam satu semester akademik (± 6 bulan) |

### 6.2 Kendala

| # | Kendala | Kategori |
|---|---------|----------|
| K-01 | Tim terdiri dari 4 anggota dengan beban kuliah paralel | Sumber Daya |
| K-02 | Tidak ada anggaran komersial; semua tools menggunakan tier gratis | Anggaran |
| K-03 | Deadline proyek mengikuti kalender akademik | Waktu |
| K-04 | Tidak ada integrasi SIAKAD; verifikasi data mahasiswa bersifat manual | Teknis |
| K-05 | Gmail SMTP memiliki batas pengiriman 500 email/hari | Teknis |

---

## 7.0 RISIKO AWAL

| ID | Risiko | Probabilitas | Dampak | Level | Mitigasi |
|----|--------|:---:|:---:|:---:|----------|
| R-01 | Scope creep akibat penambahan fitur di luar MVP selama development | Tinggi | Tinggi | 🔴 Kritis | Gunakan product backlog ketat; semua perubahan scope melalui change request formal |
| R-02 | Keamanan data mahasiswa (CV, portofolio) bocor akibat misconfiguration | Sedang | Tinggi | 🔴 Kritis | Cloudinary URL non-enumerable, HTTPS TLS, RBAC ketat, penetration testing sebelum launch |
| R-03 | Performa degradasi saat concurrent users tinggi (≥ 200) | Sedang | Tinggi | 🟠 Tinggi | Implementasi database indexing, query optimization, dan load testing sebelum launch |
| R-04 | Keterlambatan integrasi frontend–backend akibat API contract tidak jelas | Tinggi | Sedang | 🟠 Tinggi | Buat API documentation (OpenAPI/Swagger) sebelum mulai coding; gunakan mock API |
| R-05 | Mitra Industri tidak mau self-register; platform sepi konten saat launch | Sedang | Tinggi | 🟠 Tinggi | Seed data demo saat launch; Admin dapat input konten awal secara manual |
| R-06 | Anggota tim tidak dapat berkontribusi penuh akibat beban akademik | Tinggi | Sedang | 🟠 Tinggi | Distribusi task merata; buffer waktu di setiap milestone |
| R-07 | Gmail SMTP mencapai limit harian saat peak usage | Rendah | Sedang | 🟡 Sedang | Implementasi email queue; monitor penggunaan; siapkan fallback (Mailtrap/SendGrid) |

---

## 8.0 MILESTONE UTAMA (ESTIMASI)

| Milestone | Deliverable | Target Tanggal | Status |
|-----------|------------|:--------------:|:------:|
| **M-01** | Project Charter & SRS Draft disetujui | Mei 2026, Minggu 2 | 🔄 In Progress |
| **M-02** | System Architecture Document + ERD + API Contract (OpenAPI) | Mei 2026, Minggu 4 | ⏳ Pending |
| **M-03** | Setup environment: repo, CI/CD, database schema migration | Juni 2026, Minggu 1 | ⏳ Pending |
| **M-04** | Backend API MVP selesai (Auth, Profile, Opportunity, Application) | Juli 2026, Minggu 2 | ⏳ Pending |
| **M-05** | Frontend MVP selesai & terintegrasi dengan Backend | Agustus 2026, Minggu 2 | ⏳ Pending |
| **M-06** | Internal Testing & Bug Fix (SQA) | September 2026, Minggu 2 | ⏳ Pending |
| **M-07** | User Acceptance Testing (UAT) dengan demo stakeholder | Oktober 2026, Minggu 1 | ⏳ Pending |
| **M-08** | Deployment ke VPS Production & Go-Live | Oktober 2026, Minggu 3 | ⏳ Pending |
| **M-09** | Dokumentasi final & presentasi akademik | November 2026, Minggu 2 | ⏳ Pending |

---

## 9.0 PERSETUJUAN

Dengan menandatangani dokumen ini, para pihak menyatakan telah membaca, memahami, dan menyetujui ruang lingkup, tujuan, dan rencana proyek I.R.O.N L.U.N.G sebagaimana tercantum di atas.

| Peran | Nama | Tanda Tangan | Tanggal |
|-------|------|:---:|:---:|
| Project Manager / Full-Stack Lead | Anders Emmanuel Tan | _________________ | _____ / _____ / 2026 |
| Backend Developer | Dhimas Early Oceandy | _________________ | _____ / _____ / 2026 |
| Frontend Developer | Azhar Maulana | _________________ | _____ / _____ / 2026 |
| QA / DevOps | Evan Razzan Adytaputra | _________________ | _____ / _____ / 2026 |
| Dosen Pembimbing | _______________________ | _________________ | _____ / _____ / 2026 |

---

*Dokumen ini dibuat mengikuti standar ISO/IEC 12207 dan merupakan dokumen hidup yang dapat diperbarui melalui proses change request formal.*

**Versi:** 1.0.0 | **Tanggal:** 06 Mei 2026 | **Klasifikasi:** Internal — Kelompok 6
