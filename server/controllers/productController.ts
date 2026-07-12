import { Request, Response } from "express";
import { generateContentWithRotation } from "../ai";

export const addProduct = async (req: Request, res: Response) => {
  const { shopeeLink, gender, price } = req.body;

  try {
    // LANGKAH 1: Ekstrak Nama Produk & Gambar dari URL Shopee
    let extractedTitle = "Produk Fashion Pilihan";
    let extractedImageUrl = "";
    try {
      const urlObj = new URL(shopeeLink);
      const pathParts = urlObj.pathname.split('/');
      
      for (const part of pathParts) {
        if (part.includes('-i.')) {
          extractedTitle = part.split('-i.')[0].replace(/-/g, ' ');
          extractedTitle = decodeURIComponent(extractedTitle);
          break;
        } else if (part.length > 15 && part.includes('-')) {
          extractedTitle = part.replace(/-/g, ' ');
          extractedTitle = decodeURIComponent(extractedTitle);
        }
      }

      try {
        const fetchRes = await fetch(shopeeLink, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });
        const html = await fetchRes.text();
        const ogImageMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i);
        if (ogImageMatch && ogImageMatch[1]) {
          extractedImageUrl = ogImageMatch[1];
        }
      } catch (fetchErr) {
        console.error("Gagal fetch Shopee HTML:", fetchErr);
      }
    } catch (e) {
      console.log("Invalid URL format");
    }

    // LANGKAH 2: Biarkan Gemini AI Memprediksi Detail Berdasarkan Judul
    const isMen = gender === 'men';
    const prompt = `
      Kamu adalah AI Fashion Curator untuk Fitology.
      Tugasmu menganalisis pakaian dari judul URL e-commerce berikut: "${extractedTitle}"
      Kategori Pakaian: ${isMen ? 'Pria' : 'Wanita'}
      
      Tugasmu:
      1. Rapikan judul produk menjadi lebih enak dibaca (Capitalize tiap kata, hilangkan kata yang tidak perlu).
      2. Tentukan tipe body shape yang COCOK mengenakan pakaian ini untuk kategori ${isMen ? 'Pria' : 'Wanita'}.
          Pilihan body shape ${isMen ? 'Pria' : 'Wanita'}: ${isMen ? '[Trapezoid, Triangle, Oval, Rectangle, Inverted Triangle]' : '[Hourglass, Pear, Apple, Rectangle, Inverted Triangle]'}
      3. Perkirakan harga yang realistis dalam Rupiah (contoh: "Rp 129.000").

      Berikan output dalam format JSON mentah tanpa markdown:
      {
        "title": "Judul yang sudah rapi",
        "price": "Perkiraan Harga",
        "bodyShapes": ["Shape 1", "Shape 2"]
      }
    `;

    let aiResponse;
    try {
      aiResponse = await generateContentWithRotation({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
    } catch (err: any) {
      console.warn("Primary model with rotation failed in add-product, attempting fallback to flash-lite with rotation", err?.message);
      aiResponse = await generateContentWithRotation({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
    }

    const aiAnalysis = JSON.parse(aiResponse.text?.trim() || '{}');

    // Fallback data if Gemini fails to provide some fields
    const finalTitle = aiAnalysis.title || extractedTitle;
    const finalPrice = price || aiAnalysis.price || ("Rp " + (Math.floor(Math.random() * 150) + 50) + ".000");
    const finalImageUrl = extractedImageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60";
    const finalBodyShapes = aiAnalysis.bodyShapes || ["Hourglass"];

    // LANGKAH 3: Gabungkan Semua Data Sesuai firebase-blueprint.json
    const finalProductData = {
      name: finalTitle,
      price: finalPrice,
      imageUrl: finalImageUrl,
      link: shopeeLink,
      brand: "Shopee Vendor",
      bodyShapes: finalBodyShapes, // Hasil klasifikasi otomatis dari Gemini!
      gender: isMen ? 'men' : 'women'
    };

    res.json({ success: true, data: finalProductData });

  } catch (error: any) {
    console.error("Scrape error:", error);
    res.status(500).json({ error: error?.message || "Gagal memproses link Shopee" });
  }
};
