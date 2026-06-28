import React, { useState, useEffect } from "react";
import { type Language } from "../../types";
import { MenuIcon, ChevronDownIcon, UserCircle, Heart, User as UserIcon, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "../../lib/utils";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Props {
  lang: Language;
  setLang: (l: Language) => void;
  onOpenAuth?: (type: "login" | "register") => void;
  setPendingRoute?: (route: string | null) => void;
}

export default function Navbar({ lang, setLang, onOpenAuth, setPendingRoute }: Props) {
  const [open, setOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (e) {
          console.error("Failed to fetch user data for navbar:", e);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const t = {
    id: {
      beranda: "Beranda",
      fitur: "Fitur",
      faq: "Visi",
      masuk: "Masuk",
      daftar: "Daftar",
      keluar: "Keluar",
      calc: "Kalkulator Pintar",
      calcDesc: "Temukan body shape kamu",
      style: "Rekomendasi OOTD",
      styleDesc: "Level up gaya OOTD kamu",
      marketplace: "Marketplace",
      marketplaceDesc: "Katalog pilihan fashion",
      vto: "Virtual Try-On",
      vtoDesc: "Simulasi pakaian 3D real-time",
      feed: "Feed-tology",
      feedDesc: "Komunitas OOTD & inspirasi gaya",
      soon: "SEGERA",
    },
  };

  const features = [
    {
      title: t[lang].calc,
      desc: t[lang].calcDesc,
      href: "#calculator-section",
      soon: false,
    },
    {
      title: t[lang].style,
      desc: t[lang].styleDesc,
      href: "#calculator-section",
      soon: false,
    },
    {
      title: t[lang].marketplace,
      desc: t[lang].marketplaceDesc,
      href: "#marketplace",
      soon: false,
    },
    {
      title: t[lang].vto,
      desc: t[lang].vtoDesc,
      href: "#",
      soon: true,
    },
    {
      title: t[lang].feed,
      desc: t[lang].feedDesc,
      href: "#",
      soon: true,
    },
  ];

  return (
    <header className="w-full flex justify-center sticky top-5 z-50 px-4">
      <nav
        className={cn(
          "w-full max-w-5xl rounded-2xl border border-slate-200/60 shadow-sm",
          "bg-white/90 supports-[backdrop-filter]:bg-white/70 backdrop-blur-md"
        )}
      >
        <div className="flex items-center justify-between p-2 lg:p-3">
          {/* Logo element */}
          <div className="flex items-center gap-2 pl-2">
            <a href="#" className="text-xl font-black tracking-tighter uppercase text-emerald-700 flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80">
              FITOLOGY<span className="text-orange-500">.</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {t[lang].beranda}
            </a>

            {/* Features Dropdown */}
            <div
              className="relative py-1"
              onMouseEnter={() => setIsFeaturesOpen(true)}
              onMouseLeave={() => setIsFeaturesOpen(false)}
            >
              <div
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "cursor-pointer flex items-center gap-1"
                )}
              >
                {t[lang].fitur}
                <ChevronDownIcon className="w-3 h-3 text-slate-400" />
              </div>

              {isFeaturesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-80 pt-1 z-50">
                  <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-3 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-top-2">
                    {features.map((feature, i) => (
                      <a
                        key={i}
                        href={feature.href}
                        className={cn(
                          "flex flex-col p-3 rounded-lg transition-colors border border-transparent",
                          feature.soon
                            ? "cursor-not-allowed hover:bg-slate-50 opacity-90"
                            : "hover:bg-slate-50 hover:border-slate-200"
                        )}
                        onClick={(e) => {
                          if (feature.soon) {
                            e.preventDefault();
                          } else if (feature.href === "#marketplace" && !user) {
                            e.preventDefault();
                            if (setPendingRoute) setPendingRoute("#marketplace");
                            if (onOpenAuth) onOpenAuth("login");
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-sm font-semibold",
                            feature.soon ? "text-slate-400" : "text-emerald-700"
                          )}>
                            {feature.title}
                          </span>
                          {feature.soon && (
                            <span className="text-[9px] bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                              {t[lang].soon}
                            </span>
                          )}
                        </div>
                        <span className={cn("text-xs mt-1 leading-snug", feature.soon ? "text-slate-400" : "text-slate-500")}>
                          {feature.desc}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#vision-section"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {t[lang].faq}
            </a>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div 
                className="relative py-1 hidden lg:block"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                  <div className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full cursor-pointer relative")}>
                   {(userData?.photoURL || user.photoURL) ? (
                     <img src={userData?.photoURL || user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                   ) : (
                     <UserCircle className="w-6 h-6 text-slate-600" />
                   )}
                </div>
                {isProfileOpen && (
                  <div className="absolute top-full right-0 pt-1 z-50 min-w-[200px]">
                    <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{userData?.username || user.displayName || "User"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <a href="#account" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors">
                        <UserIcon className="w-4 h-4" />
                        Akun Saya
                      </a>
                      <a href="#wishlist" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                        <Heart className="w-4 h-4" />
                        Wishlist
                      </a>
                      <button onClick={handleLogout} className="flex items-center w-full gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-left">
                        <LogOut className="w-4 h-4" />
                        {t[lang].keluar}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex text-slate-600"
                  onClick={() => onOpenAuth?.("login")}
                >
                  {t[lang].masuk}
                </Button>
                <Button 
                  size="sm" 
                  className="hidden lg:flex px-6 rounded-full font-bold shadow-sm"
                  onClick={() => onOpenAuth?.("register")}
                >
                  {t[lang].daftar}
                </Button>
              </>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setOpen(!open)}
                className="md:hidden text-slate-600"
              >
                <MenuIcon className="size-5" />
              </Button>
              <SheetContent
                side="right"
                className="bg-white/95 supports-[backdrop-filter]:bg-white/90 backdrop-blur-xl w-[300px] border-l border-slate-200/50"
              >
                <SheetHeader className="text-left bg-transparent border-none">
                  <SheetTitle className="text-xl font-black tracking-tighter uppercase text-emerald-700">
                    <a href="#" className="cursor-pointer transition-opacity hover:opacity-80" onClick={() => setOpen(false)}>
                      FITOLOGY<span className="text-orange-500">.</span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-8 p-4">
                  <div className="flex flex-col gap-3">
                    <a href="#" className="text-lg font-medium text-slate-800 hover:text-emerald-600">
                      {t[lang].beranda}
                    </a>
                    
                    <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t[lang].fitur}</span>
                      {features.map((feature, i) => (
                        <a key={i} href={feature.href} className="flex flex-col" onClick={(e) => {
                          if (feature.soon) {
                            e.preventDefault();
                          } else if (feature.href === "#marketplace" && !user) {
                            e.preventDefault();
                            setOpen(false);
                            if (setPendingRoute) setPendingRoute("#marketplace");
                            if (onOpenAuth) onOpenAuth("login");
                          } else {
                            setOpen(false);
                          }
                        }}>
                          <div className="flex justify-between items-center">
                            <span className={cn(
                              "text-md font-medium",
                              feature.soon ? "text-slate-400" : "text-emerald-600"
                            )}>
                              {feature.title}
                            </span>
                            {feature.soon && (
                              <span className="text-[9px] bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                                {t[lang].soon}
                              </span>
                            )}
                          </div>
                          <span className={cn("text-xs", feature.soon ? "text-slate-400" : "text-slate-500")}>{feature.desc}</span>
                        </a>
                      ))}
                    </div>

                    <a href="#vision-section" onClick={() => setOpen(false)} className="text-lg font-medium text-slate-800 hover:text-emerald-600 pt-4 border-t border-slate-100">
                      {t[lang].faq}
                    </a>
                  </div>

                  <div className="border-t border-slate-100 pt-6 mt-auto">
                    {user ? (
                      <>
                        <a 
                          href="#wishlist"
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-center w-full py-2 px-4 mb-3 rounded-full text-rose-600 border border-rose-200 hover:bg-rose-50 gap-2 font-medium"
                        >
                          <Heart className="w-5 h-5" />
                          Wishlist
                        </a>
                        <Button 
                          variant="outline" 
                          className="w-full mb-3 rounded-full justify-center text-red-600 border-red-200 hover:bg-red-50 gap-2"
                          onClick={handleLogout}
                        >
                          <UserCircle className="w-5 h-5" />
                          {t[lang].keluar}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          className="w-full mb-3 rounded-full justify-center text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => { setOpen(false); onOpenAuth?.("login"); }}
                        >
                          {t[lang].masuk}
                        </Button>
                        <Button 
                          className="w-full rounded-full justify-center"
                          onClick={() => { setOpen(false); onOpenAuth?.("register"); }}
                        >
                          {t[lang].daftar}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
