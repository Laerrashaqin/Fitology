# Tech Stack - Fitology

Daftar teknologi, pustaka (libraries), dan infrastruktur penunjang yang digunakan untuk membangun aplikasi full-stack Fitology.

---

## 💻 1. Core Runtime & Languages
- **Runtime Environment**: Node.js v18+ (atau versi LTS terbaru).
- **Programming Language**: **TypeScript (TS)** untuk tipe data yang ketat (strongly typed) guna meminimalkan bug di tingkat kompilasi.
- **Transpiler & Runner**: `tsx` (TypeScript Execute) untuk mengeksekusi backend dalam mode pengembangan, dan `esbuild` untuk mem-bundle backend server secara cepat ke format CommonJS (`.cjs`) untuk produksi.

---

## 🎨 2. Frontend Stack (Client Module)
- **UI Library**: **React 18** (Functional Components & React Hooks).
- **Build Tool / Bundler**: **Vite** untuk build dan HMR (Hot Module Replacement) super cepat saat development.
- **CSS Framework**: **Tailwind CSS** untuk gaya visual modern berbasis utility classes secara konsisten dan responsif.
- **Icons**: **lucide-react** untuk kumpulan ikon vektor yang bersih dan ringan.
- **Animations**: **motion** (diimpor dari `motion/react`) untuk transisi visual halus, efek masuk bertahap (stagger), dan hover interaktif yang elegan.
- **Excel Processor**: **xlsx** (SheetJS) untuk memproses impor data massal dari file Excel dan mengekspor template input di panel admin.

---

## ⚙️ 3. Backend Stack (Server Module)
- **Server Framework**: **Express.js** untuk menangani endpoint API kustom (`/api/*`) dan sebagai file static server di produksi.
- **AI Integrator**: **@google/genai SDK** untuk berinteraksi langsung dengan model kecerdasan buatan Google Gemini.
- **Environment Manager**: `dotenv` untuk mengelola konfigurasi variabel lingkungan lokal (`.env`).

---

## ☁️ 4. Cloud Infrastructure & Services
- **Hosting / Deployment Platform**: **Google Cloud Run** untuk kontainerisasi aplikasi (Docker/Nginx reverse proxy) yang berskala otomatis dengan cold-start cepat.
- **Database**: **Google Cloud Firestore** (NoSQL Database) sebagai media penyimpanan profil pengguna, riwayat kalkulasi tubuh, dan katalog produk.
- **Authentication**: **Firebase Authentication** untuk mengelola keamanan login, pendaftaran pengguna baru, dan enkripsi kata sandi secara aman.
- **Large Language Model (LLM)**:
  - **Gemini 2.5 Flash**: Digunakan sebagai model utama untuk kurasi otomatis link produk Shopee dan prediksi bentuk tubuh yang mendalam.
  - **Gemini 2.5 Flash Lite**: Digunakan sebagai fallback model yang efisien saat model utama mengalami beban puncak atau antrean padat.

---

## 📦 5. Dependensi Utama (package.json Highlight)

```json
{
  "dependencies": {
    "@google/genai": "^0.1.1",
    "express": "^4.21.2",
    "firebase": "^10.12.2",
    "lucide-react": "^0.395.0",
    "motion": "^11.11.17",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "esbuild": "^0.21.5",
    "typescript": "^5.2.2",
    "vite": "^5.3.1"
  }
}
```
- **Keterangan Tambahan**: Semua dependensi di atas dirawat menggunakan `npm` dan diverifikasi bebas dari error fatal (`tsc --noEmit`) melalui sistem pengujian linter internal.
