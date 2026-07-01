import React, { type ChangeEvent, type FormEvent, useState } from "react";
import { Loader2, ArrowDown, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { auth, db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  type Measurements,
  type Gender,
  type ShapeData,
  type Language,
} from "../../../types";
import BodySilhouette from "./BodySilhouette";

interface CalculatorProps {
  lang: Language;
  gender: Gender;
  setGender: (g: Gender) => void;
  measurements: Measurements;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  unit: "CM" | "IN";
  setUnit: (u: "CM" | "IN") => void;
  calculateBodyShape: (e?: FormEvent) => void;
  isCalculating: boolean;
  result: any | null;
  error: string;
  currentShapeData: ShapeData | null;
  scrollToRecommendations: () => void;
  setMeasurements: React.Dispatch<React.SetStateAction<Measurements>>;
}

export default function Calculator({
  lang,
  gender,
  setGender,
  measurements,
  handleInputChange,
  unit,
  setUnit,
  calculateBodyShape,
  isCalculating,
  result,
  error,
  currentShapeData,
  scrollToRecommendations,
  setMeasurements
}: CalculatorProps) {
  const [activeField, setActiveField] = useState<string | null>(null);
  const texts = {
    id: {
      phase: "Fase 01",
      title: "Metrik Tubuh",
      desc: "Masukkan dimensi presisi tubuh Anda. Kami merancang pakaian ideal Anda berdasarkan prinsip geometris.",
      womens: "Wanita",
      mens: "Pria",
      dim: "Dimensi",
      calc: "Kalkulasi Profil",
      proc: "Memproses...",
      pending: "Menunggu Analisis",
      pDesc:
        "Inputkan data struktural Anda untuk membuka prinsip gaya terkurasi.",
      status: "Status: Selesai",
      diag: "Hasil",
      insp: "Inspeksi Berkas",
      comp: "Menghitung fashion item optimal..",
      unitLhs: "CM",
      unitRhs: "IN",
    },
  };

  const f = {
    id: {
      h: { l: "Tinggi", d: "Vertikal keseluruhan" },
      w: { l: "Berat", d: "Massa tubuh total" },
      s: { l: "Bahu", d: "Lebar ujung ke ujung" },
      b1: { l: "Dada", d: "Melingkar / muter" },
      b2: { l: "Dada", d: "Melingkar / muter" },
      wa: { l: "Pinggang", d: "Melingkar / muter" },
      hi: { l: "Pinggul", d: "Melingkar / muter" },
    },
  };

  const formFields = [
    { id: "height", label: f[lang].h.l, desc: f[lang].h.d, type: "length", ph: "165" },
    { id: "weight", label: f[lang].w.l, desc: f[lang].w.d, type: "weight", ph: "55" },
    { id: "shoulder", label: f[lang].s.l, desc: f[lang].s.d, type: "length", ph: "40" },
    {
      id: "bust",
      label: gender === "women" ? f[lang].b1.l : f[lang].b2.l,
      desc: f[lang].b1.d,
      type: "length",
      ph: "85"
    },
    { id: "waist", label: f[lang].wa.l, desc: f[lang].wa.d, type: "length", ph: "70" },
    { id: "hips", label: f[lang].hi.l, desc: f[lang].hi.d, type: "length", ph: "85" },
  ];

  const getShapeImageUrl = () => {
    if (!currentShapeData || !currentShapeData.title) return null;
    const shape = currentShapeData.title.toLowerCase();
    if (gender === 'women') {
      if (shape.includes('hourglass')) return '/images/women01.jpg';
      if (shape.includes('pear')) return '/images/women03.jpg';
      if (shape.includes('apple')) return '/images/women02.jpg';
      if (shape.includes('rectangle')) return '/images/women04.jpg';
      if (shape.includes('inverted')) return '/images/women05.jpg';
    } else {
      if (shape.includes('trapezoid')) return '/images/men01.jpg';
      if (shape.includes('triangle') && !shape.includes('inverted')) return '/images/men03.jpg';
      if (shape.includes('oval')) return '/images/men02.jpg';
      if (shape.includes('rectangle')) return '/images/men04.jpg';
      if (shape.includes('inverted')) return '/images/men05.jpg';
    }
    return null;
  };

  const lengthUnit = unit === "CM" ? "CM" : "IN";
  const weightUnit = unit === "CM" ? "KG" : "LBS";

  const loadFromProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert(lang === "id" ? "Silakan login terlebih dahulu untuk menggunakan fitur ini." : "Please login first to use this feature.");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.gender) {
          setGender(data.gender);
        }
        if (data.measurements) {
          setMeasurements({
            height: data.measurements.height || "",
            weight: data.measurements.weight || "",
            shoulder: data.measurements.shoulder || "",
            bust: data.measurements.bust || "",
            waist: data.measurements.waist || "",
            hips: data.measurements.hips || "",
            highHip: data.measurements.highHip || "",
          });
          alert(lang === "id" ? "Data berhasil dimuat dari profil Anda!" : "Data successfully loaded from your profile!");
        } else {
          alert(lang === "id" ? "Data tubuh belum disetel di profil Anda. Buka menu Akun Saya > Data Tubuh untuk mengatur." : "Body data is not set in your profile yet. Go to My Account > Body Data to set it.");
        }
      }
    } catch (error) {
      console.error("Failed to load body data:", error);
      alert(lang === "id" ? "Gagal memuat data tubuh." : "Failed to load body data.");
    }
  };

  return (
    <section
      id="calculator-section"
      className="py-24 bg-[#FAFAFA] border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 pb-10 border-b border-black/10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              {texts[lang].phase}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              {texts[lang].title}
            </h3>
          </div>
          <p className="text-slate-500 max-w-md font-serif text-lg leading-relaxed">
            {texts[lang].desc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1.5fr] gap-8 items-stretch">
          <div className="w-full flex flex-col justify-between bg-white border border-black/10 p-8 md:p-10 shadow-sm">
            <div>
              <div className="mb-10 flex border-b border-black/10">
                <button
                  onClick={() => setGender("women")}
                  className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-colors ${gender === "women" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-slate-400 hover:text-emerald-600"}`}
                >
                  {texts[lang].womens}
                </button>
                <button
                  onClick={() => setGender("men")}
                  className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-colors ${gender === "men" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-slate-400 hover:text-emerald-600"}`}
                >
                  {texts[lang].mens}
                </button>
              </div>

              <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    {texts[lang].dim}
                  </h4>
                  <button
                    onClick={loadFromProfile}
                    className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <UserCheck className="w-3 h-3" />
                    {lang === 'id' ? 'Gunakan Data Profil' : 'Use Profile Data'}
                  </button>
                </div>
                <div className="flex border border-black/20">
                  <button
                    onClick={() => setUnit("CM")}
                    className={`px-4 py-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-colors ${unit === "CM" ? "bg-emerald-600 text-white" : "bg-transparent text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}
                  >
                    {texts[lang].unitLhs}
                  </button>
                  <button
                    onClick={() => setUnit("IN")}
                    className={`px-4 py-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-colors ${unit === "IN" ? "bg-emerald-600 text-white" : "bg-transparent text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"}`}
                  >
                    {texts[lang].unitRhs}
                  </button>
                </div>
              </div>

              <form
                onSubmit={calculateBodyShape}
                className="grid grid-cols-2 gap-x-6 gap-y-8"
              >
                {formFields.map((field) => (
                  <div key={field.id} className="relative group col-span-1">
                    <div className="flex justify-between items-end mb-2">
                      <label
                        htmlFor={field.id}
                        className="block text-xs font-bold uppercase tracking-widest text-slate-900 truncate pr-2"
                      >
                        {field.label}
                      </label>
                      <span className="text-[9px] text-slate-400 font-serif italic hidden xl:block truncate max-w-[50%]">
                        {field.desc}
                      </span>
                    </div>
                    <div className="relative border-b border-black/10 focus-within:border-emerald-600 transition-colors">
                      <input
                        type="number"
                        id={field.id}
                        name={field.id}
                        value={measurements[field.id as keyof Measurements] || ""}
                        onChange={handleInputChange}
                        onFocus={() => setActiveField(field.id)}
                        onBlur={() => setActiveField(null)}
                        placeholder={field.ph}
                        className="w-full bg-transparent py-2 border-none focus:outline-none focus:ring-0 text-slate-900 text-lg font-black appearance-none placeholder-slate-300"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        {field.type === "length" ? lengthUnit : weightUnit}
                      </div>
                    </div>
                  </div>
                ))}
              </form>
              {error && (
                <p className="text-white text-[10px] font-bold uppercase tracking-widest p-4 bg-red-600 shadow-sm mt-8">
                  {error}
                </p>
              )}

            </div>

            <button
              onClick={calculateBodyShape}
              disabled={isCalculating}
              className="w-full mt-12 bg-emerald-600 hover:bg-emerald-700 text-white py-5 text-sm font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                  {texts[lang].proc}
                </>
              ) : (
                texts[lang].calc
              )}
            </button>
          </div>

          <div className="hidden lg:flex w-full justify-center items-center bg-white border border-black/10 shadow-sm overflow-hidden">
            <BodySilhouette
              measurements={measurements}
              gender={gender}
              unit={unit}
              activeField={activeField}
            />
          </div>

          <div className="w-full flex justify-center items-stretch bg-white border border-black/10 shadow-sm">
            {!result && !isCalculating ? (
              <div className="w-full p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-50/50 via-white to-white opacity-50"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border border-slate-200 border-dashed rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 border border-slate-100 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-2 h-2 bg-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                  </div>

                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-4">
                    {texts[lang].pending}
                  </h4>
                  <p className="text-slate-500 text-sm font-serif leading-relaxed px-4 max-w-[250px]">
                    {texts[lang].pDesc}
                  </p>
                </div>
              </div>
            ) : isCalculating ? (
              <div className="w-full p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px] bg-emerald-700 relative overflow-hidden">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-[300px] h-[300px] bg-emerald-600 rounded-full blur-3xl"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-8 flex justify-center items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-emerald-500 border-t-emerald-300 rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 border-2 border-emerald-400 border-b-emerald-100 rounded-full opacity-60"
                    />
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>

                  <motion.h4
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-[10px] font-black uppercase tracking-widest text-white mb-4"
                  >
                    {texts[lang].proc}
                  </motion.h4>
                  <p className="text-emerald-100/70 text-sm font-serif leading-relaxed px-4 max-w-[250px]">
                    {lang === 'id' ? 'Mencocokkan metrik Anda dengan database...' : 'Matching your metrics with our database...'}
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`w-full bg-emerald-700 text-white flex flex-col justify-between overflow-hidden`}
              >
                <div className={`flex flex-col h-full p-8 md:p-10 justify-center`}>
                  <div className="text-[10px] font-black mb-8 w-max uppercase tracking-widest text-slate-400 border-b border-white/20 pb-2">
                    {texts[lang].status}
                  </div>
                  <p className="text-slate-400 mb-2 font-bold text-[10px] tracking-widest uppercase">
                    {texts[lang].diag}
                  </p>
                  <h3 className="text-4xl md:text-5xl font-black mb-6 leading-none tracking-tighter uppercase">
                    {currentShapeData?.title?.split(" (")[0]}
                    <br />
                    {currentShapeData?.title?.includes(" (") && (
                      <span className="text-xs opacity-60 tracking-widest block mt-4 text-slate-300">
                        ({currentShapeData?.title?.split(" (")[1]}
                      </span>
                    )}
                  </h3>
                  <p className="text-emerald-100/90 text-sm leading-relaxed font-medium mb-8">
                    {currentShapeData?.desc}
                  </p>

                  {getShapeImageUrl() && (
                    <div className="bg-emerald-800/20 border border-emerald-600/30 p-6 rounded-2xl mb-auto flex justify-center items-center backdrop-blur-sm">
                      <img
                        src={getShapeImageUrl()!}
                        alt={currentShapeData?.title}
                        className="h-48 md:h-64 object-contain drop-shadow-2xl mix-blend-screen opacity-90 transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={scrollToRecommendations}
                    className="bg-white text-emerald-800 py-4 px-6 font-bold flex items-center justify-center gap-3 hover:bg-emerald-50 transition-colors mt-12 w-full uppercase tracking-widest text-[10px] shadow-lg shadow-black/10"
                  >
                    {texts[lang].insp} <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
