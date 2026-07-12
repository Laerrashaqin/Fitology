import React, { useRef } from "react";
import { User, Camera, Heart, Edit3, ShoppingBag } from "lucide-react";
import { auth, db } from "../../../lib/firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { type Language } from "../../../types";

interface Props {
  user: any;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  lang: Language;
  t: any;
}

export default function AccountSidebar({ user, userData, setUserData, lang, t }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        
        const base64String = canvas.toDataURL('image/jpeg', 0.7);
        
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            await updateProfile(currentUser, { photoURL: base64String });
            const docRef = doc(db, "users", currentUser.uid);
            await setDoc(docRef, { photoURL: base64String }, { merge: true });
            setUserData((prev: any) => ({ ...prev, photoURL: base64String }));
            
            alert(lang === 'id' ? 'Foto profil berhasil diperbarui!' : 'Profile photo updated!');
            window.location.reload();
          } catch (error) {
             console.error("Gagal mengupload foto:", error);
             alert(lang === 'id' ? 'Gagal mengupload foto' : 'Failed to upload photo');
          }
        }
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-100 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="w-32 h-32 mx-auto rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden mb-6 relative group">
          {(userData?.photoURL || user.photoURL) ? (
            <img src={userData?.photoURL || user.photoURL} alt={user.displayName || "Profile"} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-slate-400" />
          )}
          
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-8 h-8 text-white" />
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
          </label>
        </div>
        
        <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight mb-1">
          {user.displayName || userData?.username || "Pengguna"}
        </h2>
        <p className="text-slate-500 text-sm mb-6 truncate">{user.email}</p>
        
        <div className="flex flex-col gap-2">
          <a href="#wishlist" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors">
            <Heart className="w-4 h-4" />
            {t[lang].wishlist}
          </a>
          <a href="#body-data" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors">
            <Edit3 className="w-4 h-4" />
            Data Tubuh
          </a>
          <a href="#marketplace" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition-colors">
            <ShoppingBag className="w-4 h-4" />
            Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}
