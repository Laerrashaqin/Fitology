import React, { useState, useEffect } from "react";
import { type Language } from "../../../types";
import { marketplaceProducts as defaultProducts } from "../data/products";
import { Search, Heart, Users, Filter } from "lucide-react";
import { collection, getDocs, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "../../../lib/firebase";
import * as XLSX from "xlsx";
import { ImageAutoSlider } from "../../../components/ui/image-auto-slider";

interface Props {
  lang: Language;
}

export default function Marketplace({ lang }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedShape, setSelectedShape] = useState("All");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showLiked, setShowLiked] = useState(false);

  const BODY_SHAPES_WOMEN = ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"];
  const BODY_SHAPES_MEN = ["Trapezoid", "Triangle", "Oval", "Rectangle", "Inverted Triangle"];
  
  const SHAPE_TRANSLATIONS: Record<string, string> = {
    "Hourglass": "Jam Pasir",
    "Pear": "Pir",
    "Apple": "Apel",
    "Rectangle": "Persegi Panjang",
    "Inverted Triangle": "Segitiga Terbalik",
    "Trapezoid": "Trapesium",
    "Triangle": "Segitiga",
    "Oval": "Oval"
  };

  const currentShapes = selectedGender === "women" 
    ? BODY_SHAPES_WOMEN 
    : selectedGender === "men" 
      ? BODY_SHAPES_MEN 
      : Array.from(new Set([...BODY_SHAPES_WOMEN, ...BODY_SHAPES_MEN]));

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
      }
    } catch (err) {
      console.error("Gagal mengambil data dari Firebase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists() && userDoc.data().wishlist) {
            setWishlist(userDoc.data().wishlist);
          }
        } catch (err) {
          console.error("Error fetching wishlist", err);
        }
      } else {
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const t = {
    id: {
      title: "Marketplace",
      subtitle: "Katalog Fashion",
      desc: "Temukan pilihan pakaian terbaik sesuai bentuk tubuh Anda.",
      buy: "Lihat Produk Asli",
      searchPlaceholder: "Cari produk...",
      filterAll: "Semua Bentuk",
    },
  };

  const toggleWishlist = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert(lang === "id" ? "Silakan login terlebih dahulu untuk menyimpan wishlist." : "Please login to save your wishlist.");
      return;
    }

    const newWishlist = wishlist.includes(id) 
      ? wishlist.filter((item) => item !== id) 
      : [...wishlist, id];
    
    setWishlist(newWishlist);

    try {
      await setDoc(doc(db, "users", user.uid), {
        wishlist: newWishlist
      }, { merge: true });
    } catch (error) {
      console.error("Gagal menyimpan wishlist", error);
      // Revert if failed
      setWishlist(wishlist);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        name: "Contoh Kemeja Basic",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&fit=crop",
        link: "https://tokopedia.com/...",
        price: "Rp 150.000",
        brand: "Local Brand",
        bodyShapes: "Jam Pasir, Pir, Segitiga Terbalik"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Produk");
    XLSX.writeFile(workbook, "Template_Marketplace_Fitology.xlsx");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = selectedGender === "All" || product.gender === selectedGender || !product.gender; // Some might not have gender
    // For body shape, make case-insensitive match just in case
    const matchesShape = selectedShape === "All" || (product.bodyShapes && product.bodyShapes.some((s: string) => s.toLowerCase() === selectedShape.toLowerCase()));
    const matchesLiked = !showLiked || wishlist.includes(product.id);
    return matchesSearch && matchesGender && matchesShape && matchesLiked;
  });

  return (
    <section id="marketplace" className="bg-white py-24 mb-10 border-t border-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12 pb-10 border-b border-black/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {t[lang].subtitle}
              </h2>
              <h3 className="text-5xl lg:text-7xl font-bold tracking-tighter uppercase text-slate-900 leading-[0.9]">
                {t[lang].title}
              </h3>
              <p className="mt-8 max-w-2xl text-xl text-slate-600 font-serif leading-relaxed">
                {t[lang].desc}
              </p>
            </div>
            
            <div className="w-full lg:w-auto flex flex-col md:flex-row gap-3 items-stretch md:items-center">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t[lang].searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:flex-none min-w-[160px]">
                  <select
                    value={selectedGender}
                    onChange={(e) => {
                      setSelectedGender(e.target.value);
                      setSelectedShape("All"); // Reset shape filter when gender changes
                    }}
                    className="w-full appearance-none pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white cursor-pointer shadow-sm text-slate-700"
                  >
                    <option value="All">{lang === 'id' ? 'Semua Kategori' : 'All Categories'}</option>
                    <option value="women">{lang === 'id' ? 'Wanita' : 'Women'}</option>
                    <option value="men">{lang === 'id' ? 'Pria/Laki-laki' : 'Men'}</option>
                  </select>
                  <Users className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400" />
                </div>

                <div className="relative flex-1 sm:flex-none min-w-[180px]">
                  <select
                    value={selectedShape}
                    onChange={(e) => setSelectedShape(e.target.value)}
                    className="w-full appearance-none pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white cursor-pointer shadow-sm text-slate-700"
                  >
                    <option value="All">{t[lang].filterAll}</option>
                    {currentShapes.map((shape) => (
                      <option key={shape} value={shape}>
                        {lang === 'id' ? (SHAPE_TRANSLATIONS[shape] || shape) : shape}
                      </option>
                    ))}
                  </select>
                  <Filter className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 px-4 border-l-4 border-emerald-500">
            {lang === 'id' ? 'Rekomendasi Unggulan' : 'Featured Recommendations'}
          </h4>
          <ImageAutoSlider images={products.filter(p => p.imageUrl).slice(0, 10).map(p => p.imageUrl)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer flex flex-col">
              <div className="aspect-[3/4] overflow-hidden bg-slate-100 mb-6 relative">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                  {product.brand}
                </div>
                <button
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform z-10"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                  />
                </button>
              </div>
              <div className="flex flex-col flex-grow">
                <h5 className="font-bold text-lg tracking-tight uppercase text-slate-900 mb-2">
                  {product.name}
                </h5>
                <p className="text-sm text-emerald-700 font-medium mb-6">
                  {product.price}
                </p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest py-3 px-4 text-center rounded transition-all shadow-sm active:scale-95"
                  >
                    {t[lang].buy}
                  </a>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-slate-500 font-serif text-lg">
                {lang === "id" ? "Produk tidak ditemukan." : "No products found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
