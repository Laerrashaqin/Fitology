# Flow UI/UX - Fitology

Panduan alur antarmuka (UI) dan pengalaman pengguna (UX) untuk aplikasi Fitology, yang mencakup alur pengguna umum (pencarian bentuk tubuh) serta alur administrator dalam mengelola katalog produk.

---

## 1. Navigasi dan Tata Letak Global (Global Shell)
- **Navbar Lengket (Sticky Navbar)**: Selalu berada di bagian atas layar untuk kemudahan navigasi instan.
  - **Sisi Kiri**: Logo "FITOLOGY." yang mengarah ke Halaman Utama.
  - **Sisi Kanan/Tengah**: Dropdown pemilihan fitur, tombol alih bahasa (ID/EN), serta tombol Masuk (Login) / Daftar (Register).
- **Scroll Halus (Smooth Scrolling)**: Transisi mulus antar-section di landing page untuk pengalaman berselancar yang elegan dan premium.

---

## 2. Alur Perjalanan Pengguna Utama (Main User Journey)

### Langkah 1: Landing (Bagian Hero)
- **Visual**: Tata letak bersih, minimalis editorial modern dengan kontras tinggi yang menonjolkan nuansa mode berkelas.
- **Badge Interaktif**: Lencana bersinar "✨ Asisten Penata Gaya" untuk menarik perhatian.
- **CTA Utama**: Tombol "Mulai Analisis Sekarang" yang secara otomatis mengarahkan fokus layar secara mulus ke bagian Kalkulator Tubuh.

### Langkah 2: Edukasi (Cara Kerja)
- **Desain**: Menggunakan kontras warna lebih gelap (Deep Emerald) untuk memberikan ritme visual yang seimbang.
- **Konten**: Penjelasan alur dalam 3 langkah mudah:
  1. **Masukkan Ukuran (Input Measurements)**
  2. **Analisis AI (AI Analysis)**
  3. **Rekomendasi Gaya (Style Recommendations)**
- **Elemen UX**: Efek hover interaktif pada kartu cara kerja untuk meningkatkan rasa ingin tahu pengguna.

### Langkah 3: Interaksi (Kalkulator Bentuk Tubuh)
- **Desain Layar Terbagi (Split-Screen Layout)**: 
  - **Sisi Kiri**: Formulir interaktif untuk memasukkan dimensi tubuh (Gender, Satuan CM/IN, Tinggi, Berat, Bahu, Dada, Pinggang, Pinggul).
  - **Sisi Rapat Kanan**: Siluet/Wireframe interaktif yang merespons input dimensi tubuh secara dinamis dan real-time.
- **Aksi**: Tombol "Kalkulasi Profil" memicu animasi analisis dan secara otomatis menampilkan rekomendasi hasil analisis bentuk tubuh di bagian bawah.

### Langkah 4: Hasil & Rekomendasi Gaya (Recommendations Section)
- **Arah Otomatis**: Layar bergeser dengan halus ke area hasil setelah perhitungan selesai.
- **Visualisasi Hasil**:
  - Judul Bentuk Tubuh hasil diagnosis (mis. "Segitiga Terbalik", "Jam Pasir").
  - Panduan praktis **Do's and Don'ts** (Gaya pakaian yang disarankan dan yang harus dihindari).
  - Rekomendasi Pakaian yang dibagi dalam kategori Atasan, Bawahan, dan Luaran (Outer).
- **Integrasi Marketplace**: Menampilkan produk katalog sungguhan dari database yang cocok dengan bentuk tubuh pengguna, lengkap dengan tautan belanja instan.

### Langkah 5: Bukti Sosial (Testimoni)
- **Desain**: Karosel kartu interaktif yang memuat testimoni dari pengguna lokal dengan gaya bahasa percakapan sehari-hari yang akrab.
- **Navigasi**: Kontrol panah kiri/kanan yang mudah diklik untuk membaca ulasan lainnya.

### Langkah 6: Teaser Visi Masa Depan & Footer
- **Teaser Fitur**: Mencuplik rencana fitur masa depan seperti "Virtual Try-On" dan platform komunitas OOTD "Feed-tology" dengan elemen latar SVG interaktif.
- **Footer**: Tata letak rapi berisi informasi perusahaan, sosial media, serta kutipan branding "Matriks Gaya Sistematis".

---

## 3. Alur Pengalaman Pengelola Data (Admin UX Flow)

Untuk mempermudah manajemen katalog oleh pemilik toko/admin, Fitology menyediakan antarmuka admin yang efisien dan minim kesalahan input di tab **Marketplace**:

### A. Indikator Kapasitas (Catalog Live Counter)
- Di sebelah kanan atas halaman admin Marketplace, terdapat lencana visual **Total Katalog** (`Total Katalog: X Produk`) yang dilengkapi ikon paket dinamis. Lencana ini memberikan umpan balik langsung mengenai jumlah data yang tersimpan di database Firestore tanpa perlu mengecek log backend.

### B. Proteksi Duplikasi Otomatis (Smart Import)
- Saat Admin mengunggah katalog massal menggunakan file Excel (.xlsx), pengguna tidak perlu khawatir jika data tersebut tumpang tindih dengan data lama.
- **Alur Validasi**:
  1. Sistem membaca tautan produk (**product link**).
  2. Jika tautan sama, sistem akan melakukan **update (upsert)** pada dokumen Firestore tersebut.
  3. Jika tautan kosong atau berupa placeholder `#`, sistem mencocokkan kombinasi **Nama Produk + Nama Brand** (Case-Insensitive).
  4. Jika kecocokan ditemukan, data diperbarui. Jika tidak, data baru akan ditambahkan.
  5. Tindakan ini menjamin katalog tetap rapi, bersih, dan hemat penyimpanan Firestore.

### C. Dropdown Seleksi Dinamis (Admin-Friendly Inputs)
Untuk mengurangi kesalahan pengetikan manual (typo) saat membuat atau menyunting produk:
1. **Dropdown Gender**: Field gender diubah dari input teks manual menjadi pilihan dropdown `<select>` yang hanya menerima opsi **Wanita** (`women`) atau **Pria** (`men`).
2. **Body Shape Selector**: Input bentuk tubuh diubah dari teks dipisah koma menjadi komponen dropdown interaktif `BodyShapeSelect` dengan checkbox:
   - Jika gender **Wanita** dipilih, opsi bentuk tubuh otomatis disesuaikan (*Jam Pasir, Pir, Apel, Persegi Panjang, Segitiga Terbalik*).
   - Jika gender **Pria** dipilih, opsi bentuk tubuh otomatis disesuaikan (*Trapesium, Segitiga, Oval, Persegi Panjang, Segitiga Terbalik*).
   - Admin dapat mencentang beberapa bentuk tubuh sekaligus, dan sistem akan merangkaikannya menjadi string ramah-toko untuk disimpan di Firestore.
