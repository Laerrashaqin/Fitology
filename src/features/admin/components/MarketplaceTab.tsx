import React, { useState, useEffect } from "react";
import { collection, getDocs, writeBatch, doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Search, Edit, Trash2, Plus, Upload, Download, Package } from "lucide-react";
import * as XLSX from "xlsx";

interface BodyShapeSelectProps {
  gender: string;
  value: string;
  onChange: (val: string) => void;
}

function BodyShapeSelect({ gender, value, onChange }: BodyShapeSelectProps) {
  // options depending on gender
  const options = gender === "men" 
    ? ["Trapesium", "Segitiga", "Oval", "Persegi Panjang", "Segitiga Terbalik"]
    : ["Jam Pasir", "Pir", "Apel", "Persegi Panjang", "Segitiga Terbalik"];

  // current selected items
  const selected = value 
    ? value.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (opt: string) => {
    let next: string[];
    if (selected.includes(opt)) {
      next = selected.filter(s => s !== opt);
    } else {
      next = [...selected, opt];
    }
    onChange(next.join(", "));
  };

  return (
    <div className="relative">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-2 py-1 border border-slate-200 rounded text-xs bg-white flex justify-between items-center min-w-[130px] shadow-sm hover:border-slate-300 transition-colors cursor-pointer"
      >
        <span className="truncate text-slate-700 font-medium">
          {selected.length > 0 ? selected.join(", ") : "Pilih Shape"}
        </span>
        <span className="text-[10px] text-slate-400 ml-1">▼</span>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1 w-full min-w-[160px] bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40 max-h-48 overflow-y-auto">
            {options.map(opt => {
              const isChecked = selected.includes(opt);
              return (
                <label 
                  key={opt}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer select-none"
                >
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => toggleOption(opt)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function MarketplaceTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [message, setMessage] = useState<{type: "error" | "success", text: string} | null>(null);
  const [shopeeLink, setShopeeLink] = useState("");
  const [shopeePrice, setShopeePrice] = useState("");
  const [shopeeGender, setShopeeGender] = useState("women");
  const [scraping, setScraping] = useState(false);

  const showMessage = (type: "error" | "success", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "products"));
      if (!querySnapshot.empty) {
        const dbProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        setProducts(dbProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data dari Firebase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const batch = writeBatch(db);
      const productsRef = collection(db, "products");

      const SHAPE_MAP: Record<string, string> = {
        "jam pasir": "Hourglass",
        "pir": "Pear",
        "apel": "Apple",
        "persegi panjang": "Rectangle",
        "segitiga terbalik": "Inverted Triangle",
        "trapesium": "Trapezoid",
        "segitiga": "Triangle",
        "oval": "Oval",
        "hourglass": "Hourglass",
        "pear": "Pear",
        "apple": "Apple",
        "rectangle": "Rectangle",
        "inverted triangle": "Inverted Triangle",
        "trapezoid": "Trapezoid",
        "triangle": "Triangle"
      };

      jsonData.forEach((row: any) => {
        const nameVal = row.name || row.Name || "";
        const linkVal = row.link || row.Link || "#";
        const brandVal = row.brand || row.Brand || "Local Brand";
        const priceVal = row.price || row.Price || "Rp 0";
        const imageUrlVal = row.imageUrl || row.ImageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&fit=crop";
        const genderVal = row.gender || row.Gender || "women";

        // Cari apakah produk dengan link atau nama + brand yang sama sudah ada di database (products array)
        const existing = products.find(p => 
          (p.link && p.link !== "#" && p.link === linkVal) || 
          (p.name.toLowerCase() === nameVal.toLowerCase() && p.brand.toLowerCase() === brandVal.toLowerCase())
        );

        const newDocRef = existing ? doc(db, "products", existing.id) : doc(productsRef);
        let shapes: string[] = [];
        if (row.bodyShapes) {
          shapes = String(row.bodyShapes).split(",").map(s => {
            const mapped = SHAPE_MAP[s.trim().toLowerCase()];
            return mapped ? mapped : s.trim();
          });
        }

        batch.set(newDocRef, {
          name: nameVal,
          imageUrl: imageUrlVal,
          link: linkVal,
          price: priceVal,
          brand: brandVal,
          bodyShapes: shapes,
          gender: genderVal
        });
      });

      await batch.commit();
      await fetchProducts();
      showMessage("success", "Upload berhasil!");
    } catch (error) {
      console.error("Error uploading file:", error);
      showMessage("error", "Gagal upload file");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const downloadTemplate = () => {
    // Data sheet
    const wsData = [
      {
        name: "Sabrina Dress",
        brand: "ZARA",
        price: "Rp 599.000",
        imageUrl: "https://example.com/image.jpg",
        link: "https://shopee.co.id/...",
        bodyShapes: "Jam Pasir, Pir",
        gender: "women"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(wsData);

    // Petunjuk sheet (Option 4: Template dengan panduan)
    const wsInstructionsData = [
      ["Kolom", "Penjelasan", "Pilihan yang Diizinkan (Wajib persis)"],
      ["name", "Nama produk pakaian", "Bebas"],
      ["brand", "Merek produk", "Bebas"],
      ["price", "Harga produk", "Bebas (contoh: Rp 150.000)"],
      ["imageUrl", "Link gambar produk", "Link berawalan http/https"],
      ["link", "Link toko/pembelian", "Link berawalan http/https"],
      ["gender", "Kategori pakaian", "women, men, unisex"],
      ["bodyShapes", "Bentuk tubuh yang cocok", "Wanita: Jam Pasir, Pir, Apel, Persegi Panjang, Segitiga Terbalik\nPria: Trapesium, Segitiga, Oval, Persegi Panjang, Segitiga Terbalik\n(Bisa lebih dari satu, pisahkan dengan koma)"]
    ];
    const wsInstructions = XLSX.utils.aoa_to_sheet(wsInstructionsData);
    
    // Auto-size columns for better readability in Petunjuk
    wsInstructions['!cols'] = [{ wch: 15 }, { wch: 30 }, { wch: 70 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Produk");
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Petunjuk (PENTING)");
    XLSX.writeFile(wb, "Template_Upload_Fitology.xlsx");
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      showMessage("success", "Sedang menghapus...");
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
      showMessage("success", "Berhasil menghapus produk");
    } catch (error) {
      showMessage("error", "Gagal menghapus produk");
    }
  };

  const saveEdit = async () => {
    if (!editForm.name || !editingId) return;
    try {
      const SHAPE_MAP: Record<string, string> = {
        "jam pasir": "Hourglass",
        "pir": "Pear",
        "apel": "Apple",
        "persegi panjang": "Rectangle",
        "segitiga terbalik": "Inverted Triangle",
        "trapesium": "Trapezoid",
        "segitiga": "Triangle",
        "oval": "Oval",
        "hourglass": "Hourglass",
        "pear": "Pear",
        "apple": "Apple",
        "rectangle": "Rectangle",
        "inverted triangle": "Inverted Triangle",
        "trapezoid": "Trapezoid",
        "triangle": "Triangle"
      };

      let shapes: string[] = [];
      if (typeof editForm.bodyShapes === "string") {
        shapes = editForm.bodyShapes.split(",").map((s: string) => {
          const mapped = SHAPE_MAP[s.trim().toLowerCase()];
          return mapped ? mapped : s.trim();
        }).filter(Boolean);
      } else if (Array.isArray(editForm.bodyShapes)) {
        shapes = editForm.bodyShapes;
      }
      
      const toSave = {
        name: editForm.name,
        brand: editForm.brand,
        price: editForm.price,
        imageUrl: editForm.imageUrl,
        link: editForm.link,
        bodyShapes: shapes
      };

      if (editingId === "new") {
        const newRef = doc(collection(db, "products"));
        await setDoc(newRef, toSave);
      } else {
        await setDoc(doc(db, "products", editingId), toSave, { merge: true });
      }

      setEditingId(null);
      fetchProducts();
      showMessage("success", "Berhasil menyimpan data");
    } catch (error) {
      console.error("Save Edit Error:", error);
      showMessage("error", "Gagal menyimpan data");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleScrapeShopee = async () => {
    if (!shopeeLink) {
      showMessage("error", "Link Shopee tidak boleh kosong!");
      return;
    }

    try {
      setScraping(true);
      showMessage("success", "Sedang menganalisis produk via AI...");
      
      const response = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopeeLink, gender: shopeeGender, price: shopeePrice })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memproses link Shopee");
      }

      // Save to Firestore
      const newRef = doc(collection(db, "products"));
      await setDoc(newRef, data.data);

      await fetchProducts();
      setShopeeLink("");
      showMessage("success", "Berhasil menambahkan produk via AI!");
    } catch (error: any) {
      console.error("Scraping error:", error);
      showMessage("error", error.message || "Gagal mengekstrak data dari Shopee");
    } finally {
      setScraping(false);
    }
  };

  const filtered = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg font-bold text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
          {message.text}
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tighter">Marketplace Data</h1>
          <p className="text-slate-500 font-serif">Kelola semua produk untuk katalog Marketplace</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
            <select
              value={shopeeGender}
              onChange={(e) => setShopeeGender(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-emerald-500 focus:border-emerald-500 transition-colors w-full md:w-auto"
              disabled={scraping}
            >
              <option value="women">Wanita</option>
              <option value="men">Pria</option>
            </select>
            <input
              type="text"
              placeholder="Paste Link Shopee..."
              value={shopeeLink}
              onChange={(e) => setShopeeLink(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              disabled={scraping}
            />
            <input
              type="text"
              placeholder="Harga (opsional)..."
              value={shopeePrice}
              onChange={(e) => setShopeePrice(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-40 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              disabled={scraping}
            />
            <button 
              onClick={handleScrapeShopee} 
              disabled={scraping || !shopeeLink}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm w-full md:w-auto ${scraping || !shopeeLink ? 'bg-slate-200 text-slate-500' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
            >
              {scraping ? "Loading AI..." : "Tarik Data AI"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-all shadow-sm">
            <Download className="w-4 h-4" /> Template
          </button>
          <div className="relative">
            <input type="file" accept=".xlsx, .xls" id="excel-btn" className="hidden" onChange={handleFileUpload} disabled={uploading}/>
            <label htmlFor="excel-btn" className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all ${uploading ? 'bg-slate-200 text-slate-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              <Upload className="w-4 h-4" /> {uploading ? "Proses..." : "Upload Excel"}
            </label>
          </div>
          <button onClick={() => { setEditingId("new"); setEditForm({ name: "", price: "", brand: "", imageUrl: "", link: "", bodyShapes: "" }); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>

        {/* Right side catalog counter */}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50/60 border border-emerald-100 rounded-xl text-emerald-800 font-bold text-sm shadow-sm">
          <Package className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Total Katalog: <span className="text-emerald-700 font-black text-base">{products.length}</span> Produk</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
              <tr>
                <th className="p-4">Produk</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Target Shape</th>
                <th className="p-4">Harga</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {editingId === "new" && (
                 <tr className="bg-emerald-50">
                  <td className="p-4 flex gap-3">
                     <input value={editForm.imageUrl} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} placeholder="Image URL" className="w-20 px-2 py-1 border rounded text-xs select-text" />
                     <div className="flex flex-col gap-1 w-full relative">
                       <input value={editForm.name} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Nama produk" className="px-2 py-1 border rounded text-xs w-full select-text" />
                       <div className="flex gap-2">
                         <select value={editForm.gender || 'women'} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="px-2 py-1 border rounded text-xs bg-white">
                           <option value="women">Wanita</option>
                           <option value="men">Pria</option>
                         </select>
                         <input value={editForm.link} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, link: e.target.value})} placeholder="Link Toko" className="px-2 py-1 border rounded text-xs w-full select-text" />
                       </div>
                     </div>
                  </td>
                  <td className="p-4"><input value={editForm.brand} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, brand: e.target.value})} placeholder="Brand" className="w-full px-2 py-1 border rounded text-xs select-text" /></td>
                  <td className="p-4">
                    <BodyShapeSelect 
                      gender={editForm.gender || 'women'} 
                      value={editForm.bodyShapes} 
                      onChange={val => setEditForm({...editForm, bodyShapes: val})} 
                    />
                  </td>
                  <td className="p-4"><input value={editForm.price} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, price: e.target.value})} placeholder="Rp 0" className="w-24 px-2 py-1 border rounded text-xs select-text" /></td>
                  <td className="p-4 text-right space-x-2">
                     <button onClick={saveEdit} className="text-emerald-600 font-bold hover:underline cursor-pointer">Simpan</button>
                     <button onClick={cancelEdit} className="text-slate-500 font-bold hover:underline cursor-pointer">Batal</button>
                  </td>
                 </tr>
              )}
              {filtered.map(p => {
                if (editingId === p.id) {
                   return (
                     <tr key={p.id} className="bg-slate-50">
                      <td className="p-4 flex gap-3">
                         <input value={editForm.imageUrl} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} placeholder="Image URL" className="w-20 px-2 py-1 border rounded text-xs select-text" />
                         <div className="flex flex-col gap-1 relative w-full">
                           <input value={editForm.name} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Nama produk" className="w-full px-2 py-1 border rounded text-xs select-text" />
                           <div className="flex gap-2">
                             <select value={editForm.gender || 'women'} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="px-2 py-1 border rounded text-xs bg-white">
                               <option value="women">Wanita</option>
                               <option value="men">Pria</option>
                             </select>
                             <input value={editForm.link} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, link: e.target.value})} placeholder="Link Toko" className="w-full px-2 py-1 border rounded text-xs select-text" />
                           </div>
                         </div>
                      </td>
                      <td className="p-4"><input value={editForm.brand} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, brand: e.target.value})} placeholder="Brand" className="w-full px-2 py-1 border rounded text-xs select-text" /></td>
                      <td className="p-4">
                        <BodyShapeSelect 
                          gender={editForm.gender || 'women'} 
                          value={editForm.bodyShapes} 
                          onChange={val => setEditForm({...editForm, bodyShapes: val})} 
                        />
                      </td>
                      <td className="p-4"><input value={editForm.price} onCopy={e => e.stopPropagation()} onPaste={e => e.stopPropagation()} onCut={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()} onChange={e => setEditForm({...editForm, price: e.target.value})} placeholder="Rp 0" className="w-24 px-2 py-1 border rounded text-xs select-text" /></td>
                      <td className="p-4 text-right space-x-2">
                         <button onClick={saveEdit} className="text-emerald-600 font-bold hover:underline cursor-pointer">Simpan</button>
                         <button onClick={cancelEdit} className="text-slate-500 font-bold hover:underline cursor-pointer">Batal</button>
                      </td>
                     </tr>
                  )
                }

                return (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 flex gap-3 items-center">
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-16 object-cover rounded shadow-sm border border-slate-200 bg-white" />
                    <div>
                      <div className="font-bold text-slate-800">{p.name || "-"}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${p.gender === 'men' ? 'bg-blue-100 text-blue-700' : p.gender === 'women' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-500'}`}>
                          {p.gender === 'men' ? 'Pria' : p.gender === 'women' ? 'Wanita' : 'Umum'}
                        </span>
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Link Toko</a>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{p.brand}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {(p.bodyShapes || []).map((s: string) => {
                        const translate: Record<string, string> = {
                          "Hourglass": "Jam Pasir",
                          "Pear": "Pir",
                          "Apple": "Apel",
                          "Rectangle": "Persegi Panjang",
                          "Inverted Triangle": "Segitiga Terbalik",
                          "Trapezoid": "Trapesium",
                          "Triangle": "Segitiga",
                          "Oval": "Oval"
                        };
                        return (
                          <span key={s} className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {translate[s] || s}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-emerald-600">{p.price}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => {
                      const translate: Record<string, string> = {
                        "Hourglass": "Jam Pasir",
                        "Pear": "Pir",
                        "Apple": "Apel",
                        "Rectangle": "Persegi Panjang",
                        "Inverted Triangle": "Segitiga Terbalik",
                        "Trapezoid": "Trapesium",
                        "Triangle": "Segitiga",
                        "Oval": "Oval"
                      };
                      const indonesianShapes = (p.bodyShapes || []).map((s: string) => translate[s] || s);
                      setEditingId(p.id); setEditForm({ ...p, bodyShapes: indonesianShapes.join(", ") }); 
                    }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              )})}
              {products.length === 0 && !loading && !editingId && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    Belum ada produk dari Excel. Upload sekarang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
