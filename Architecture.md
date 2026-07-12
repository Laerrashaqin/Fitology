# System Architecture - Fitology

Dokumentasi arsitektur sistem full-stack aplikasi Fitology. Dokumen ini menjelaskan interaksi antar komponen, manajemen data, integrasi API, dan alur mitigasi kuota AI.

---

## 1. Diagram Arsitektur Tingkat Tinggi (High-Level Architecture)

Aplikasi ini menggunakan model arsitektur **Full-Stack Single Container** yang berjalan di atas Express dan Vite.

```text
  ┌─────────────────────────────────────────────────────────────┐
  │                   CLIENT-SIDE (React + Vite)                │
  │  - Form Input Dimensi Tubuh     - Akun & Histori            │
  │  - Live Wireframe/Siluet       - Marketplace & Rekomendasi  │
  └───────────────┬─────────────────────────────▲───────────────┘
                  │ HTTPS (JSON)                │ React State
                  ▼                             │
  ┌─────────────────────────────────────────────┴───────────────┐
  │                  SERVER-SIDE (Express App)                  │
  │  - Menyajikan static files (index.html, assets)             │
  │  - API Routes (/api/analyze, /api/add-product)              │
  └───────────────┬─────────────────────────────▲───────────────┘
                  │                             │
        ┌─────────┴─────────┐         ┌─────────┴─────────┐
        │   GEMINI POOL     │         │ FIREBASE SERVICES │
        │   (AI Rotation)   │         │                   │
        │ - Key 1 (Primary) │         │ - Firestore DB    │
        │ - Key 2 (Backup)  │         │ - Auth Client     │
        │ - Key 3 (Backup)  │         └───────────────────┘
        └───────────────────┘
```

---

## 2. Deskripsi Komponen Utama (Core Components)

### A. Frontend (Client Module)
- **Framework**: React 18+ dengan bundling Vite yang cepat.
- **Styling**: Tailwind CSS untuk layout responsif (mobile-first) dan Inter/JetBrains Mono untuk konsistensi tipografi.
- **Interaktivitas**: State-driven UI, di mana input ukuran tubuh di-bind ke komponen visual siluet tubuh (HTML Canvas/SVG) yang memperbarui visual tubuh secara real-time.

### B. Backend (Server Module)
- **Framework**: Express (TypeScript) yang terintegrasi langsung dengan server dev Vite di lokal dan mem-bundle dirinya menjadi Node CommonJS (`dist/server.cjs`) pada saat build produksi.
- **Static Hosting**: Pada mode produksi, Express bertindak sebagai penyaji berkas statis dari direktori `dist/` untuk performa muat halaman yang optimal.
- **API Proxy**: Semua komunikasi sensitif ke API pihak ketiga dikelola secara server-side melalui rute `/api/*` untuk mengamankan data dan mencegah kebocoran API Key ke browser.

### C. Database & Autentikasi (Firebase)
- **Google Firestore**: Database NoSQL berlatensi rendah untuk menyimpan data profil pengguna, riwayat kalkulasi bentuk tubuh, serta katalog produk marketplace.
- **Firebase Auth**: Layanan autentikasi pengguna yang aman, menangani pendaftaran, masuk, keluar, dan pengelolaan sesi pengguna di sisi klien.

### D. Multi-Key Gemini API Pool (AI Rotation & Fallback)
Untuk menjamin keandalan fitur analisis bentuk tubuh berbasis AI tanpa hambatan kuota, Fitology mengimplementasikan pola **Key Rotation & Fallback**:
1. **API Key Pool**: Server membaca 3 variabel lingkungan API Key dari `.env` (`CUSTOM_GEMINI_API_KEY`/`GEMINI_API_KEY`, `CUSTOM_GEMINI_API_KEY_2`, `CUSTOM_GEMINI_API_KEY_3`).
2. **Koleksi Klien**: API Key tersebut dimasukkan ke dalam pool klien instans `GoogleGenAI` yang dibuat secara dinamis.
3. **Mekanisme Rotasi Otomatis**:
   - Server memulai request dengan API Key Utama (Kunci 1).
   - Jika berhasil, data hasil kurasi/analisis langsung dikembalikan ke klien.
   - Jika terjadi kesalahan kuota (`ResourceExhausted` / `429 Rate Limit`), server menangkap kesalahan tersebut secara anggun (gracefully), mencatat log rotasi, lalu otomatis beralih menggunakan API Key Cadangan (Kunci 2).
   - Jika Kunci 2 juga mengalami limitasi, server beralih ke Kunci 3.
4. **Pola Fallback Model**:
   - Untuk setiap kunci, sistem pertama kali mencoba memanggil model utama (`gemini-2.5-flash`).
   - Jika model tersebut gagal atau sibuk, sistem secara otomatis menurunkan kebutuhan ke model hemat daya (`gemini-2.5-flash-lite`) sebagai cadangan sebelum akhirnya menyerah dan melempar pesan kesalahan yang bersahabat kepada pengguna.

---

## 3. Alur Komunikasi Impor Excel (Smart Import Flow)

```text
Admin Upload File Excel (.xlsx)
                │
                ▼
SheetJS (XLSX) Membaca Baris Data
                │
                ▼
Ambil Seluruh Data Produk Aktif dari Firestore
                │
                ▼
Perulangan Tiap Baris Excel:
  ├── JIKA 'link' cocok dengan dokumen Firestore yang sudah ada -> UPDATE dokumen tersebut (Upsert)
  └── JIKA 'link' kosong/#, Cocokkan 'nama produk' + 'brand' -> UPDATE dokumen tersebut (Upsert)
  └── JIKA TIDAK ADA COCOK -> BUAT dokumen baru di Firestore (Insert)
                │
                ▼
Kirim Batch Berkas ke Firestore secara Efisien (Bulk Commit)
```
- **Keuntungan**: Melindungi database dari penumpukan data sampah (garbage data) akibat unggahan berulang dengan file Excel yang sama atau serupa.
