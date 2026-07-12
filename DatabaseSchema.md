# Database Schema - Fitology (Firebase Firestore)

Dokumentasi skema database NoSQL **Google Cloud Firestore** yang digunakan dalam aplikasi Fitology. Firestore dirancang secara denormalisasi untuk memberikan performa baca yang optimal dan struktur dokumen yang fleksibel.

---

## 1. Ringkasan Koleksi (Collections Overview)

Fitology memiliki tiga koleksi utama tingkat atas (top-level collections):

| Nama Koleksi | Deskripsi | Aturan Akses (Security) |
| :--- | :--- | :--- |
| `products` | Daftar katalog produk pakaian/fesyen untuk rekomendasi belanja. | Publik (Baca), Admin (Tulis/Hapus) |
| `users` | Profil fisik pengguna, histori kalkulasi, preferensi gender, dan wishlist. | Pemilik Akun (Baca/Tulis), Admin (Baca) |
| `admin_users` | Daftar email pengguna yang memiliki hak akses administrator. | Admin (Baca/Tulis) |

---

## 2. Struktur Koleksi Detail (Detailed Schemas)

### A. Koleksi `products`
Koleksi ini menyimpan item-item katalog yang dikurasi oleh admin (baik via input manual maupun impor massal Excel).

* **Path Dokumen**: `/products/{productId}`
* **Struktur Dokumen**:

```json
{
  "name": "Kemeja Flanel Klasik",
  "brand": "Uniqlo",
  "price": "Rp 299.000",
  "imageUrl": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80",
  "link": "https://shopee.co.id/product-link-placeholder",
  "gender": "men",
  "bodyShapes": [
    "Trapesium",
    "Persegi Panjang"
  ]
}
```

* **Definisi Field**:
  - `name` (String): Nama lengkap produk fesyen.
  - `brand` (String): Merek atau produsen produk.
  - `price` (String): Harga produk terformat (mis. "Rp 150.000").
  - `imageUrl` (String): URL gambar produk (menggunakan Unsplash atau Shopee Image CDN).
  - `link` (String): URL eksternal yang mengarah ke toko online untuk memfasilitasi transaksi belanja.
  - `gender` (String): Kategori target gender. Bernilai `"men"` atau `"women"`.
  - `bodyShapes` (Array of Strings): Daftar bentuk tubuh yang cocok untuk mengenakan item ini. 
    - *Opsi Wanita*: `"Jam Pasir"`, `"Pir"`, `"Apel"`, `"Persegi Panjang"`, `"Segitiga Terbalik"`.
    - *Opsi Pria*: `"Trapesium"`, `"Segitiga"`, `"Oval"`, `"Persegi Panjang"`, `"Segitiga Terbalik"`.

---

### B. Koleksi `users`
Koleksi ini merepresentasikan profil pengguna terdaftar dan menyimpan preferensi serta ukuran dimensi tubuh mereka untuk kalkulasi bentuk tubuh.

* **Path Dokumen**: `/users/{uid}` (di mana `{uid}` adalah User ID unik dari Firebase Authentication)
* **Struktur Dokumen**:

```json
{
  "uid": "aB81CdfHk992JsKla91",
  "username": "rozinromdhoni",
  "email": "rozinromdhoni281116@gmail.com",
  "gender": "men",
  "height": 175,
  "weight": 68,
  "shoulder": 42,
  "bust": 96,
  "waist": 80,
  "hips": 94,
  "bodyShape": "Trapesium",
  "bodyShapeDesc": "Bentuk tubuh Trapesium memiliki proporsi bahu lebar dengan pinggang yang proporsional, sangat ideal untuk berbagai gaya pakaian.",
  "wishlist": [
    "prod_id_001",
    "prod_id_002"
  ],
  "createdAt": "2026-07-02T04:20:00Z"
}
```

* **Definisi Field**:
  - `uid` (String): ID autentikasi pengguna.
  - `username` (String): Nama tampilan atau username unik.
  - `email` (String): Alamat email terdaftar.
  - `gender` (String): Jenis kelamin pengguna (`"men"` atau `"women"`).
  - `height` (Number): Tinggi badan dalam satuan CM.
  - `weight` (Number): Berat badan dalam satuan KG.
  - `shoulder` (Number): Lebar bahu dalam satuan CM.
  - `bust` (Number): Lingkar dada dalam satuan CM.
  - `waist` (Number): Lingkar pinggang dalam satuan CM.
  - `hips` (Number): Lingkar pinggul dalam satuan CM.
  - `bodyShape` (String): Hasil klasifikasi bentuk tubuh berdasarkan rumus kalkulator geometris atau saran analisis AI.
  - `bodyShapeDesc` (String): Deskripsi atau tips mode ringkas yang disesuaikan dengan bentuk tubuh pengguna.
  - `wishlist` (Array of Strings): Kumpulan ID produk (`productId`) yang disimpan oleh pengguna sebagai daftar favorit.
  - `createdAt` (Timestamp / ISO String): Waktu pembuatan profil akun.

---

### C. Koleksi `admin_users`
Koleksi kontrol akses sederhana untuk membedakan pengguna biasa dengan administrator yang berhak mengelola katalog dan hak akses lainnya.

* **Path Dokumen**: `/admin_users/{docId}`
* **Struktur Dokumen**:

```json
{
  "email": "rozinromdhoni281116@gmail.com"
}
```

* **Definisi Field**:
  - `email` (String): Alamat email yang terdaftar sebagai administrator di sistem Firebase Auth. Pengguna dengan email ini akan secara otomatis melihat tab "Panel Admin" saat masuk ke aplikasi.
