import React, { useState, useEffect } from "react";
import { type Language } from "../../../types";
import { auth, db } from "../../../lib/firebase";
import { LogOut } from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import AccountSidebar from "./AccountSidebar";
import PersonalInfo from "./PersonalInfo";
import BodyShapeInfo from "./BodyShapeInfo";
import BodyDataInfo from "./BodyDataInfo";

interface Props {
  lang: Language;
}

export default function AccountPage({ lang }: Props) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    window.location.hash = "#";
  };

  const t = {
    id: {
      account: "Akun Saya",
      profileDesc: "Kelola informasi profil dan preferensi gaya Anda.",
      personalInfo: "Informasi Pribadi",
      name: "Nama Lengkap",
      email: "Alamat Email",
      bodyShapeProfile: "Profil Body Shape",
      noBodyShape: "Belum ada data body shape. Lakukan kalkulasi di halaman utama.",
      wishlist: "Wishlist Saya",
      logout: "Keluar dari Akun",
    },
    en: {
      account: "My Account",
      profileDesc: "Manage your profile information and style preferences.",
      personalInfo: "Personal Information",
      name: "Full Name",
      email: "Email Address",
      bodyShapeProfile: "Body Shape Profile",
      noBodyShape: "No body shape data yet. Perform a calculation on the home page.",
      wishlist: "My Wishlist",
      logout: "Sign Out",
    }
  };

  const user = auth.currentUser;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
        <p className="text-slate-500 font-serif">Silakan login untuk melihat akun Anda.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter mb-4">
              {t[lang].account}
            </h1>
            <p className="text-slate-500 font-serif text-lg">
              {t[lang].profileDesc}
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
            {t[lang].logout}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <AccountSidebar user={user} userData={userData} setUserData={setUserData} lang={lang} t={t} />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
            <PersonalInfo user={user} userData={userData} setUserData={setUserData} lang={lang} t={t} />
            <BodyShapeInfo userData={userData} loading={loading} lang={lang} t={t} />
            <BodyDataInfo userData={userData} setUserData={setUserData} />
          </div>
        </div>
      </div>
    </div>
  );
}