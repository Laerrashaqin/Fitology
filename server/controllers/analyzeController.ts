import { Request, Response } from "express";
import { generateContentWithRotation } from "../ai";

export const analyzeBodyShape = async (req: Request, res: Response) => {
  const { height, weight, shoulder, bust, waist, hips, gender, availableProducts } = req.body;

  // SETTING ATURAN SHAPE BERDASARKAN GENDER
  let allowedShapes = "";
  let genderLabel = "";

  if (gender === 'women') {
    genderLabel = "Wanita/Perempuan";
    // Penamaan buat cewek
    allowedShapes = "Hourglass / Pear / Apple / Rectangle / Inverted Triangle";
  } else {
    genderLabel = "Pria/Laki-laki";
    // Penamaan buat cowok
    allowedShapes = "Trapezoid / Triangle / Oval / Rectangle / Inverted Triangle";
  }

  // Format produk agar gampang dibaca AI
  let productsData = "Tidak ada data produk dari database.";
  if (Array.isArray(availableProducts) && availableProducts.length > 0) {
    productsData = availableProducts.map(p => 
      `- ID: ${p.id}\n  Nama: ${p.name}\n  Kategori/Brand: ${p.brand}\n  Body Shapes yang cocok: ${p.bodyShapes ? p.bodyShapes.join(', ') : 'Semua'}\n  Gambar: ${p.imageUrl}`
    ).join("\n\n");
  }

  // MASUKIN VARIABLE KE DALAM PROMPT
  const prompt = `
  Kamu adalah seorang Fashion Stylist AI dan Personal Color Analyst yang super hits, gaul, dan paham banget body shape wanita dan pria berdasarkan ukuran tubuh serta paham tren OOTD Gen Z di Indonesia. 
  Tugas kamu adalah:
  1. Menganalisis data ukuran tubuh pengguna.
  2. Memberikan rekomendasi fashion (tips) yang jujur tapi tetap bikin pede.
  3. Memilihkan 3 pakaian dari DATABASE PRODUK TERSEDIA yang paling cocok dengan bentuk tubuh pengguna.

  DATA TUBUH PENGGUNA:
  - Gender: ${genderLabel}
  - Tinggi: ${height} cm
  - Berat: ${weight} kg
  - Lebar Bahu: ${shoulder} cm
  - Lingkar Dada: ${bust} cm
  - Lingkar Pinggang: ${waist} cm
  - Lingkar Pinggul: ${hips} cm

  DATABASE PRODUK TERSEDIA:
  ${productsData}

  PERATURAN GAYA BAHASA (CRITICAL):
  1. JANGAN gunain bahasa kaku, formal, atau kamus besar (seperti "Anda", "oleh karena itu", "berikut adalah").
  2. Gunakan gaya bahasa santai anak muda, asisten fashion pribadi yang seru, boleh pake kata "kamu", "OOTD", "mix & match", "glowing", "spill", "hacks".
  3. Penyampaiannya harus suportif, ramah, bikin pede, dan kesannya kayak lagi chat bareng bestie yang paham fashion.

  FORMAT OUTPUT (WAJIB JSON MENTAH):
  Kamu harus merespons HANYA dalam format JSON mentah tanpa teks pembuka, tanpa penutup, dan TANPA bungkus markdown seperti \`\`\`json. 
  Struktur JSON-nya harus persis seperti ini:

  {
    "shape": "Pilih SATU dari list berikut: ${allowedShapes}",
    "introText": "Tulis 1 kalimat tebakan atau sapaan pembuka yang relate, santai dan gaul banget khas Gen Z",
    "desc": "Penjelasan SUPER SINGKAT (maksimal 2 kalimat) kenapa tubuh mereka masuk kategori itu. Jelasin pakai bahasa santai dan to-the-point aja.",
    "tipsList": [
      "Tulis tips gaya/style hacks 1 (SUPER SINGKAT, bahasa santai, gaul gen-z dan to-the-point)",
      "Tulis tips gaya/style hacks 2 (SUPER SINGKAT, bahasa santai, gaul gen-z dan to-the-point)",
      "Tulis tips gaya/style hacks 3 (SUPER SINGKAT, bahasa santai, gaul gen-z dan to-the-point)"
    ],
    "fits": [
      {
        "name": "Nama Produk (harus persis dari database yang cocok dengan body shape)",
        "cat": "Atasan / Bawahan / Dress / Outer (Kategori baju tersebut)",
        "reasonDesc": "Alasan singkat kenapa baju ini cocok banget buat body shape-nya (bahasa santai Gen-Z)",
        "imageUrl": "URL gambar produk dari database (harus persis sama)"
      },
      ... pilih maksimal 3 produk
    ]
  }
`;

  try {
    let response;
    try {
      response = await generateContentWithRotation({
        model: "gemini-2.5-flash", 
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
    } catch (err: any) {
      console.warn("Primary model with rotation failed, attempting fallback to flash-lite with rotation", err?.message);
      response = await generateContentWithRotation({
        model: "gemini-2.5-flash-lite", 
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
    }

    let text = response.text || "";
    // Clean up markdown wrapping if Gemini ignores instructions
    text = text.replace(/```json\n?/, '').replace(/```\n?/, '');

    const resultData = JSON.parse(text.trim());
    res.json(resultData);
  } catch (error: any) {
    console.error(error);
    if (error?.status === 429) {
      return res.status(429).json({ error: "Terlalu banyak permintaan" });
    }
    if (error?.status === 503) {
      return res.status(503).json({ error: "Model AI sedang sibuk karena lonjakan permintaan. Silakan coba lagi nanti." });
    }
    res.status(500).json({ error: error?.message || "Gagal memproses analisis AI" });
  }
};
