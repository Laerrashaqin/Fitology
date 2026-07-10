# Frontend & Core Architecture Guide - Fitology

Panduan struktur direktori dan standar pengembangan untuk proyek Fitology. Dokumentasi ini dirancang agar mudah dipahami, diskalakan, dan dirawat oleh seluruh tim pengembang.

---

## 📁 Struktur Folder Proyek (Folder Structure)

Aplikasi ini menggunakan perpaduan **Feature-Sliced Design (FSD)** yang disederhanakan untuk memisahkan fitur-fitur utama menjadi modul independen, dikombinasikan dengan backend **Express (TypeScript)** yang dideploy secara aman.

```text
/
├── .env.example              # Template variabel lingkungan & API Keys
├── SKILL.md                  # Panduan Arsitektur & Aturan Kode (File Ini)
├── UI_UX_Flow.md             # Panduan Alur Perjalanan Pengguna & UI/UX
├── Architecture.md           # Diagram Alur & Desain Sistem Fullstack
├── DatabaseSchema.md         # Struktur Koleksi Firebase Firestore
├── TechStack.md              # Daftar Lengkap Teknologi & Pustaka yang Digunakan
├── package.json              # Manajemen dependensi dan script npm
├── server.ts                 # Server Entrypoint (Express + Vite Integration)
├── server/                   # Backend Server Module
│   ├── ai.ts                 # Klien Google Gen AI & Kumpulan Key dengan Rotasi Otomatis
│   ├── routes.ts             # Definisi Rute API Express (/api/*)
│   └── controllers/          # Logika Kontroler API
│       ├── analyzeController.ts # Analisis Bentuk Tubuh dengan Gemini Flash/Lite Fallback
│       └── productController.ts # Kurasi & Scraping Shopee Link otomatis via AI
└── src/                      # Frontend Client Module (React + Vite)
    ├── App.tsx               # Entrypoint & Router Aplikasi Utama
    ├── main.tsx              # Bootstrap aplikasi React
    ├── index.css             # Entrypoint CSS Global (Tailwind CSS)
    ├── components/           # Komponen UI global (reusable across features)
    │   ├── layout/           # Komponen kerangka (Navbar, Footer, Sidebar)
    │   └── ui/               # Komponen primitif (Button, Input, Card)
    ├── features/             # Modul spesifik per-fitur
    │   ├── home/             # Halaman utama / Landing Page Hero
    │   ├── calculator/       # Fitur Kalkulator Bentuk Tubuh (Live Siluet Wireframe)
    │   ├── account/          # Panel Akun, Histori Rekomendasi, & Profile
    │   ├── admin/            # Panel Admin (Kelola Katalog & Upload Excel)
    │   │   └── components/
    │   │       └── MarketplaceTab.tsx # Pengelola Katalog (Kunci Fitur: De-duplikasi & Dropdowns)
    │   └── marketplace/      # Fitur Rekomendasi Katalog Produk & Filter OOTD
    │       ├── components/
    │       └── data/         # Data fallback katalog produk lokal
    ├── hooks/                # Custom hooks global (useAuth, dll)
    ├── lib/                  # Konfigurasi library eksternal (firebase.ts, dll)
    └── types/                # Definisi tipe TypeScript global
```

---

## 📐 Prinsip Utama Pengembangan (Core Principles)

### 1. Feature-Sliced & Modularitas
- Kelompokkan kode berdasarkan fitur bisnis (seperti `calculator`, `marketplace`, `admin`) daripada hanya tipe teknis. Ini mempermudah pelacakan kode dan pemeliharaan jangka panjang.
- Letakkan komponen yang dipakai di lebih dari 1 fitur ke dalam `src/components/ui/` atau `src/components/layout/`.

### 2. Keterpisahan Logika & Tampilan (Separation of Concerns)
- Jaga agar file komponen UI tetap berfokus pada visual rendering.
- Pindahkan logika yang rumit ke dalam custom React hooks atau utilitas eksternal.
- Untuk interaksi API yang melibatkan API Key rahasia (seperti Gemini API), logika **wajib** diletakkan di backend (`/server/*`) dan dipanggil via proxy `/api/*` dari client-side React untuk mencegah kebocoran API Key.

### 3. Keamanan API Key & Rotasi Otomatis (Anti-Rate-Limit Pool)
- Proyek ini mendukung **Rotasi Otomatis 3 API Key Gemini (Free Tier)** untuk menghindari kendala limitasi kuota (rate limit).
- Klien AI di `/server/ai.ts` akan secara otomatis mendeteksi error `429` (Rate Limit) atau `ResourceExhausted` dan beralih ke kunci cadangan berikutnya (`CUSTOM_GEMINI_API_KEY_2`, `CUSTOM_GEMINI_API_KEY_3`) tanpa merusak pengalaman pengguna di frontend.

### 4. Pencegahan Data Duplikat & Integritas Katalog (Smart Upsert)
- Sistem impor katalog via Excel (`xlsx`) memiliki fitur **Smart Upsert**.
- Sebelum produk baru disimpan ke Firestore, sistem akan memvalidasi apakah link produk atau kombinasi nama produk + nama brand sudah terdaftar di database.
- Jika ditemukan data yang sama, data lama akan diperbarui (**update**), bukan ditumpuk baru (**insert**), sehingga terhindar dari katalog ganda.

### 5. Antarmuka Dinamis Tanpa Kesalahan Input (Admin Friendly Dropdowns)
- Pada pembuatan dan pengeditan template katalog di tab Marketplace Admin:
  - Input **Gender** menggunakan dropdown `<select>` (Wanita/Pria).
  - Input **Body Shape** menggunakan komponen interaktif `BodyShapeSelect` yang secara dinamis memuat daftar opsi bentuk tubuh berdasarkan gender yang dipilih. Opsi tersebut dapat dipilih melalui checkbox dalam bentuk multi-select dropdown. Ini mengeliminasi kesalahan pengetikan manual (typo) yang dapat merusak kecocokan visual di tab rekomendasi pengguna.
