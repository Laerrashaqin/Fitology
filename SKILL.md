# Frontend Architecture Guide

Panduan struktur direktori frontend untuk proyek ini. Struktur dirancang agar mudah diskalakan, dirawat, dan di-navigasi oleh tim pengembang.

## 📁 Struktur Folder

```text
src/
├── assets/             # File statis (images, icons, fonts)
├── components/         # Komponen UI global (reusable across features)
│   ├── layout/         # Komponen kerangka (Navbar, Footer, Sidebar)
│   └── ui/             # Komponen primitif (Button, Input, Card) - ex: shadcn
├── features/           # Modul spesifik per-fitur (Feature-Sliced Design)
│   ├── calculator/     # Fitur kalkulator
│   │   ├── components/ # Komponen UI khusus kalkulator
│   │   ├── hooks/      # Custom hooks kalkulator
│   │   └── utils/      # Utilitas kalkulator
│   ├── home/           # Halaman utama / Hero
│   └── recommendations/# Fitur hasil & rekomendasi
│       ├── components/
│       └── data/       # Data statis khusus rekomendasi
├── hooks/              # Custom hooks global (mis. useAuth, useTheme)
├── lib/                # Konfigurasi library eksternal & utilitas (mis. axios, utils.ts)
├── store/              # Global state management (Zustand, Redux)
├── styles/             # Global styles (Tailwind, animations)
├── types/              # Definisi tipe TypeScript global
├── App.tsx             # Entry point komponen utama
└── main.tsx            # Entry point aplikasi React
```

## 📐 Prinsip Utama
1. **Feature-Sliced**: Kelompokkan kode berdasarkan fitur bisnis (mis. `calculator`, `recommendations`) daripada hanya tipe teknis. Ini membuat modul lebih mandiri dan mudah diubah.
2. **Keterpisahan UI & Logika (Separation of Concerns)**: Gunakan custom hooks untuk logika yang kompleks dan biarkan komponen spesifik untuk merender UI.
3. **Reusable Components**: Letakkan komponen yang dipakai di lebih dari 1 fitur ke dalam `src/components/ui`.
4. **Strong Typing**: Manfaatkan TypeScript secara maksimal. Letakkan tipe spesifik fitur di dalam foldernya, dan letakkan tipe global di `src/types/`.
