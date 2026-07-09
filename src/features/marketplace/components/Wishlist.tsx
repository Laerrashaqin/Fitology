import React, { useState, useEffect } from "react";
import { type Language } from "../../../types";
import { Heart, ArrowLeft } from "lucide-react";
import { collection, getDocs, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface Props {
  lang: Language;
}

export default function Wishlist({ lang }: Props) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchWishlist = async (currentUser: User) => {
      try {
        setLoading(true);
        // Get user wishlist
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userWishlist = userDoc.exists() && userDoc.data().wishlist ? userDoc.data().wishlist : [];
        setWishlist(userWishlist);

        if (userWishlist.length > 0) {
          const querySnapshot = await getDocs(collection(db, "products"));
          if (!querySnapshot.empty) {
            const dbProducts = querySnapshot.docs.map(d => ({
              id: d.id,
              ...d.data()
            })) as any[];
            setProducts(dbProducts.filter(p => userWishlist.includes(p.id)));
          }
        }
      } catch (err) {
        console.error("Gagal mengambil wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchWishlist(currentUser);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleWishlist = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    const newWishlist = wishlist.includes(id) 
      ? wishlist.filter((item) => item !== id) 
      : [...wishlist, id];
    
    setWishlist(newWishlist);
    // Optimistically update products list
    setProducts(prev => prev.filter(p => newWishlist.includes(p.id)));

    try {
      await setDoc(doc(db, "users", user.uid), {
        wishlist: newWishlist
      }, { merge: true });
    } catch (error) {
      console.error("Gagal menyimpan wishlist", error);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-24 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="bg-white py-24 min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-500">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>{lang === 'id' ? 'Silakan login untuk melihat wishlist' : 'Please login to view wishlist'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="wishlist" className="bg-white py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12 pb-6 border-b border-black/10 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              {lang === 'id' ? 'Katalog Disukai' : 'Liked Catalog'}
            </h2>
            <h3 className="text-4xl lg:text-5xl font-bold tracking-tighter uppercase text-slate-900 leading-[0.9]">
              Wishlist
            </h3>
          </div>
          <a href="#marketplace" className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'id' ? 'Kembali ke Marketplace' : 'Back to Marketplace'}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
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
                  <Heart className="w-4 h-4 transition-colors fill-red-500 text-red-500" />
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
                    {lang === 'id' ? 'Lihat Produk Asli' : 'View Original Product'}
                  </a>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-24 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-slate-200" />
              <p className="text-slate-500 font-serif text-lg">
                {lang === "id" ? "Wishlist kamu masih kosong." : "Your wishlist is empty."}
              </p>
              <a href="#marketplace" className="inline-block mt-4 px-6 py-3 bg-emerald-600 text-white font-bold rounded-full text-sm hover:bg-emerald-700 transition-colors">
                {lang === 'id' ? 'Jelajahi Produk' : 'Explore Products'}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
