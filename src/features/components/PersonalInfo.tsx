import React, { useState } from "react";
import { Edit3, Check, X } from "lucide-react";
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

export default function PersonalInfo({ user, userData, setUserData, lang, t }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setEditName(user?.displayName || userData?.username || "");
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      await updateProfile(user, { displayName: editName });
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { username: editName }, { merge: true });
      setUserData((prev: any) => ({ ...prev, username: editName }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">
          {t[lang].personalInfo}
        </h3>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button onClick={handleSaveProfile} disabled={saving} className="text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 p-2 rounded-lg">
              <Check className="w-5 h-5" />
            </button>
            <button onClick={() => setIsEditing(false)} disabled={saving} className="text-slate-400 hover:text-red-600 transition-colors bg-slate-50 p-2 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button onClick={startEdit} className="text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 p-2 rounded-lg">
            <Edit3 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t[lang].name}
          </label>
          {isEditing ? (
            <input 
              type="text" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 border border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
              disabled={saving}
            />
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">
              {user.displayName || userData?.username || "-"}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t[lang].email}
          </label>
          <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium truncate">
            {user.email}
          </div>
        </div>
      </div>
    </div>
  );
}
