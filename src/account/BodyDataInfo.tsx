import React, { useState } from "react";
import { Edit3, Check, X } from "lucide-react";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface Props {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

export default function BodyDataInfo({ userData, setUserData }: Props) {
  const [isEditingBodyData, setIsEditingBodyData] = useState(false);
  const [savingBodyData, setSavingBodyData] = useState(false);
  const [bodyDataForm, setBodyDataForm] = useState({
    gender: userData?.gender || 'women',
    height: userData?.measurements?.height || '',
    weight: userData?.measurements?.weight || '',
    shoulder: userData?.measurements?.shoulder || '',
    bust: userData?.measurements?.bust || '',
    waist: userData?.measurements?.waist || '',
    hips: userData?.measurements?.hips || ''
  });

  // Re-sync form when userData changes
  React.useEffect(() => {
    if (userData && !isEditingBodyData) {
      setBodyDataForm({
        gender: userData.gender || 'women',
        height: userData.measurements?.height || '',
        weight: userData.measurements?.weight || '',
        shoulder: userData.measurements?.shoulder || '',
        bust: userData.measurements?.bust || '',
        waist: userData.measurements?.waist || '',
        hips: userData.measurements?.hips || ''
      });
    }
  }, [userData, isEditingBodyData]);

  const handleSaveBodyData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    setSavingBodyData(true);
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        gender: bodyDataForm.gender,
        measurements: {
          height: bodyDataForm.height,
          weight: bodyDataForm.weight,
          shoulder: bodyDataForm.shoulder,
          bust: bodyDataForm.bust,
          waist: bodyDataForm.waist,
          hips: bodyDataForm.hips
        }
      }, { merge: true });
      setUserData((prev: any) => ({
        ...prev,
        gender: bodyDataForm.gender,
        measurements: {
          height: bodyDataForm.height,
          weight: bodyDataForm.weight,
          shoulder: bodyDataForm.shoulder,
          bust: bodyDataForm.bust,
          waist: bodyDataForm.waist,
          hips: bodyDataForm.hips
        }
      }));
      setIsEditingBodyData(false);
    } catch (error) {
      console.error("Failed to update body data:", error);
    } finally {
      setSavingBodyData(false);
    }
  };

  return (
    <div id="body-data" className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">
          Data Tubuh
        </h3>
        {isEditingBodyData ? (
          <div className="flex items-center gap-2">
            <button onClick={handleSaveBodyData} disabled={savingBodyData} className="text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 p-2 rounded-lg">
              <Check className="w-5 h-5" />
            </button>
            <button onClick={() => setIsEditingBodyData(false)} disabled={savingBodyData} className="text-slate-400 hover:text-red-600 transition-colors bg-slate-50 p-2 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditingBodyData(true)} className="text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 p-2 rounded-lg">
            <Edit3 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
          {isEditingBodyData ? (
            <select
              value={bodyDataForm.gender}
              onChange={(e) => setBodyDataForm({...bodyDataForm, gender: e.target.value})}
              className="w-full px-4 py-3 border border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="women">Wanita</option>
              <option value="men">Pria</option>
            </select>
          ) : (
            <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">
              {userData?.gender === 'men' ? 'Pria' : 'Wanita'}
            </div>
          )}
        </div>
        
        {[
          { id: 'height', label: 'Tinggi (CM)' },
          { id: 'weight', label: 'Berat (KG)' },
          { id: 'shoulder', label: 'Bahu (CM)' },
          { id: 'bust', label: 'Dada (CM)' },
          { id: 'waist', label: 'Pinggang (CM)' },
          { id: 'hips', label: 'Pinggul (CM)' }
        ].map((field) => (
          <div key={field.id}>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{field.label}</label>
            {isEditingBodyData ? (
              <input
                type="number"
                value={(bodyDataForm as any)[field.id]}
                onChange={(e) => setBodyDataForm({...bodyDataForm, [field.id]: e.target.value})}
                className="w-full px-4 py-3 border border-emerald-500 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            ) : (
              <div className="px-4 py-3 bg-slate-50 rounded-xl text-slate-800 font-medium">
                {(userData?.measurements && userData.measurements[field.id]) || "-"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
