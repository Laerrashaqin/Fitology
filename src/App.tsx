import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./features/home/components/Hero";
import Greeting from "./features/home/components/Greeting";
import HowItWorks from "./features/home/components/HowItWorks";
import VisionTeaser from "./features/home/components/VisionTeaser";
import Calculator from "./features/calculator/components/Calculator";
import Recommendations from "./features/recommendations/components/Recommendations";
import Marketplace from "./features/marketplace/components/Marketplace";
import Wishlist from "./features/marketplace/components/Wishlist";
import AuthPage from "./features/auth/components/AuthPage";
import AdminDashboard from "./features/admin/components/AdminDashboard";
import AccountPage from "./features/account/components/AccountPage";
import { MinimalFooter } from "./components/ui/minimal-footer";
import { recommendationsData } from "./features/recommendations/data/recommendations";
import { type Measurements, type Gender, type Language } from "./types";
import { AnimatePresence } from "motion/react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const App = () => {
  const [lang, setLang] = useState<Language>("id");
  const [authView, setAuthView] = useState<{ isOpen: boolean; type: "login" | "register" | "forgot_password" }>({
    isOpen: false,
    type: "login",
  });

  const [gender, setGender] = useState<Gender>("women");
  const [measurements, setMeasurements] = useState<Measurements>({
    height: "",
    weight: "",
    shoulder: "",
    bust: "",
    waist: "",
    hips: "",
    highHip: "",
  });

  const [unit, setUnit] = useState<"CM" | "IN">("CM");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");
  
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  useEffect(() => {
    if (user && pendingRoute) {
      window.location.hash = pendingRoute;
      setPendingRoute(null);
    }
  }, [user, pendingRoute]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#";
      setCurrentHash(hash);
      
      if (hash === "#" || hash === "#marketplace" || hash === "#wishlist" || hash === "#account") {
        window.scrollTo(0, 0);
      } else {
        setTimeout(() => {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        if (currentUser.email === "rozinromdhoni281116@gmail.com") {
          setIsAdmin(true);
        } else {
          try {
            const adminDoc = await getDocs(query(collection(db, "admin_users"), where("email", "==", currentUser.email)));
            setIsAdmin(!adminDoc.empty);
          } catch (e) {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      unsubscribeAuth();
    };
  }, []);

  const recommendationsRef = useRef<HTMLElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBodyShape = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (
      !measurements.height ||
      !measurements.weight ||
      !measurements.shoulder ||
      !measurements.bust ||
      !measurements.waist ||
      !measurements.hips
    ) {
      setError(
        lang === "id"
          ? "Lengkapi semua dimensi numerik untuk analisis presisi."
          : "Complete all metric dimensions for a precision analysis.",
      );
      return;
    }

    setError("");
    setIsCalculating(true);
    setResult(null);

    try {
      let availableProducts: any[] = [];
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (!querySnapshot.empty) {
          availableProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Filter by gender if the product specifies it
          availableProducts = availableProducts.filter(p => !p.gender || p.gender === 'All' || p.gender === gender);
        }
      } catch (e) {
        console.error("Gagal load products:", e);
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',     
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...measurements, gender, availableProducts })
      });
      
      if (response.status === 429) {
        setError(lang === "id" ? "Waduh, server AI lagi antre nih. Tunggu beberapa detik terus coba klik lagi ya!" : "AI server is busy. Please wait a few seconds and try again!");
        setIsCalculating(false);
        return;
      }
      
      if (response.status === 503) {
        setError(lang === "id" ? "Model AI sedang sibuk karena lonjakan permintaan. Silakan coba sebentar lagi ya." : "AI model is currently experiencing high demand. Please try again in a moment.");
        setIsCalculating(false);
        return;
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Gagal memproses analisis AI");
        }
        
        let mappedFits = [];
        if (Array.isArray(data.fits) && data.fits.length > 0) {
          mappedFits = data.fits.map((fit: any) => ({
            name: fit.name || "Rekomendasi",
            cat: fit.cat || "Pakaian",
            reasonTag: "Fit",
            reasonDesc: fit.reasonDesc || "Saran pakaian yang cocok",
            img: fit.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&fit=crop"
          }));
        } else {
          // Fallback if AI didn't return fits
          mappedFits = Array.isArray(data.tipsList) ? data.tipsList.slice(0, 3).map((item: any, idx: number) => {
            const tipText = typeof item === 'string' ? item : (item.tip || "Saran pakaian yang cocok");
            return {
              name: `Rekomendasi ${idx + 1}`,
              cat: "Pakaian",
              reasonTag: "Fit",
              reasonDesc: tipText,
              img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&fit=crop"
            };
          }) : [];
        }

        const mappedAiData = {
          title: data.shape || "Analisis AI",
          introText: data.introText || "Berdasarkan ukuran yang Anda berikan.",
          desc: data.desc || "Berikut rekomendasi gaya terbaik.",
          tipsList: Array.isArray(data.tipsList) ? data.tipsList.map((t: any) => typeof t === 'string' ? t : (t.tip || "")) : [],
          fits: mappedFits
        };
        
        setResult(mappedAiData); 

        // Update Firestore if user is logged in
        if (user) {
          try {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, { 
              bodyShape: data.shape || "Unknown",
              bodyShapeDesc: data.desc || "Berikut rekomendasi gaya terbaik.",
              gender: gender
            });
          } catch (e) {
            console.error("Gagal menyimpan profil body shape ke Firestore:", e);
          }
        }
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format from server: ${text.substring(0, 20)}...`);
      }
      
      setIsCalculating(false);
      scrollToRecommendations();
    } catch (err: any) {
      setError(err.message || (lang === "id" ? "Koneksi ke AI terputus, coba lagi nanti." : "Failed to connect to AI server. Please try again later."));
      setIsCalculating(false);
    }
  };

  const scrollToRecommendations = () => {
    if (recommendationsRef.current) {
      recommendationsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      document
        .getElementById("results-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentShapeData = result && typeof result === "object" ? result : null;

  if (isAdmin) {
    return <AdminDashboard lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-black selection:text-white">
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        onOpenAuth={(type) => setAuthView({ isOpen: true, type })} 
        setPendingRoute={setPendingRoute}
      />
      
      <AnimatePresence>
        {authView.isOpen && (
          <AuthPage 
            lang={lang} 
            type={authView.type} 
            setType={(type) => setAuthView((prev) => ({ ...prev, type }))} 
            onClose={() => setAuthView((prev) => ({ ...prev, isOpen: false }))} 
          />
        )}
      </AnimatePresence>

      {currentHash === "#wishlist" ? (
        <Wishlist lang={lang} />
      ) : currentHash === "#marketplace" ? (
        <Marketplace lang={lang} />
      ) : currentHash === "#account" ? (
        <AccountPage lang={lang} />
      ) : (
        <>
          <Hero lang={lang} />
          <Greeting />

          <HowItWorks />

          <Calculator
            lang={lang}
            gender={gender}
            setGender={setGender}
            measurements={measurements}
            setMeasurements={setMeasurements}
            handleInputChange={handleInputChange}
            unit={unit}
            setUnit={setUnit}
            calculateBodyShape={calculateBodyShape}
            isCalculating={isCalculating}
            result={result}
            error={error}
            currentShapeData={currentShapeData}
            scrollToRecommendations={scrollToRecommendations}
          />

          <div ref={recommendationsRef as any}>
            {result && !isCalculating && currentShapeData && (
              <>
                <Recommendations
                  shapeData={currentShapeData}
                  gender={gender}
                  lang={lang}
                />
                
                {/* Bagian link ke Marketplace di bawah rekomendasi */}
                <section className="bg-[#FAFAFA] border-t border-b border-black/10 py-16 text-center">
                  <div className="max-w-2xl mx-auto px-6">
                    <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter text-slate-900">
                      Cari Pakaian Sesuai Rekomendasi?
                    </h3>
                    <p className="text-slate-600 font-serif mb-8">
                       Kunjungi Marketplace kami untuk melihat berbagai koleksi kurasi yang cocok dengan profil OOTD Anda.
                    </p>
                    <button 
                      onClick={() => {
                        if (user) {
                          window.location.hash = "#marketplace";
                        } else {
                          setPendingRoute("#marketplace");
                          setAuthView({ isOpen: true, type: "login" });
                        }
                      }}
                      className="inline-block bg-emerald-600 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300"
                    >
                      Buka Marketplace
                    </button>
                  </div>
                </section>
              </>
            )}
          </div>

          <VisionTeaser lang={lang} />
        </>
      )}

      <MinimalFooter lang={lang} />
    </div>
  );
};

export default App;
