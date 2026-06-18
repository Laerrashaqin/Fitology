import { type ChangeEvent, type FormEvent } from "react";
import { Loader2, ArrowDown } from "lucide-react";
import {
  type Measurements,
  type Gender,
  type ShapeData,
  type Language,
} from "../../../types";

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
  result: string | null;
  error: string;
  currentShapeData: ShapeData | null;
  scrollToRecommendations: () => void;
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
}: CalculatorProps) {
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
      unitRhs: "IM",
    },
    en: {
      phase: "Phase 01",
      title: "The Metrics",
      desc: "Input your precise bodily dimensions. We architect your ideal silhouette based on strict geometric principles.",
      womens: "Women",
      mens: "Men",
      dim: "Dimensions",
      calc: "Calculate Profile",
      proc: "Processing...",
      pending: "Pending Analysis",
      pDesc:
        "Provide your structural data to unlock curated styling principles.",
      status: "Status: Complete",
      diag: "Diagnostic",
      insp: "Inspect Dossier",
      comp: "Computing optimal items...",
      unitLhs: "CM",
      unitRhs: "IN",
    },
  };

  const f = {
    id: {
      h: { l: "Tinggi", d: "Vertikal keseluruhan" },
      w: { l: "Berat", d: "Massa tubuh total" },
      s: { l: "Bahu", d: "Lebar ujung ke ujung" },
      b1: { l: "Dada", d: "Diukur melingkar / muter" },
      b2: { l: "Dada", d: "Diukur melingkar / muter" },
      wa: { l: "Pinggang", d: "Diukur melingkar / muter" },
      hi: { l: "Pinggul", d: "Diukur melingkar / muter" },
    },
    en: {
      h: { l: "Height", d: "Total vertical height" },
      w: { l: "Weight", d: "Total body mass" },
      s: { l: "Shoulder", d: "Width from edge to edge" },
      b1: { l: "Bust", d: "Full circumference circle" },
      b2: { l: "Chest", d: "Full circumference circle" },
      wa: { l: "Waist", d: "Full circumference circle" },
      hi: { l: "Hips", d: "Full circumference circle" },
    },
  };

  const formFields = [
    { id: "height", label: f[lang].h.l, desc: f[lang].h.d, type: "length", ph: "165" },
    { id: "weight", label: f[lang].w.l, desc: f[lang].w.d, type: "weight", ph: "60" },
    { id: "shoulder", label: f[lang].s.l, desc: f[lang].s.d, type: "length", ph: "40" },
    {
      id: "bust",
      label: gender === "women" ? f[lang].b1.l : f[lang].b2.l,
      desc: f[lang].b1.d,
      type: "length",
      ph: "90"
    },
    { id: "waist", label: f[lang].wa.l, desc: f[lang].wa.d, type: "length", ph: "70" },
    { id: "hips", label: f[lang].hi.l, desc: f[lang].hi.d, type: "length", ph: "95" },
  ];

  const lengthUnit = unit === "CM" ? "CM" : "IN";
  const weightUnit = unit === "CM" ? "KG" : "LBS";

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

              <div className="flex justify-between items-center mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                  {texts[lang].dim}
                </h4>
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

          <div className="hidden lg:flex w-full justify-center items-center py-10 bg-white border border-black/10 shadow-sm">
            <div className="relative h-[400px] w-[160px]">
              <svg
                viewBox="0 0 100 250"
                className={`w-full h-full text-slate-50 stroke-slate-200 transition-all duration-500 ${gender === "men" ? "scale-x-110" : ""}`}
              >
                <path
                  fill="currentColor"
                  strokeWidth="1"
                  d="M50 10 C 60 10, 65 20, 65 30 C 65 40, 58 45, 50 45 C 42 45, 35 40, 35 30 C 35 20, 40 10, 50 10 Z"
                />
                <path
                  fill="currentColor"
                  strokeWidth="1"
                  d="M35 45 C 20 50, 15 60, 20 80 C 25 100, 30 110, 35 120 C 38 120, 38 100, 40 100 C 45 100, 55 100, 60 100 C 62 100, 62 120, 65 120 C 70 110, 75 100, 80 80 C 85 60, 80 50, 65 45 Z"
                />
                <path
                  fill="currentColor"
                  strokeWidth="1"
                  d="M35 120 C 25 140, 20 180, 25 240 L 45 240 C 45 200, 45 150, 50 150 C 55 150, 55 200, 55 240 L 75 240 C 80 180, 75 140, 65 120 Z"
                />
              </svg>

              {[
                { id: "shoulder", top: "18%", label: "S" },
                { id: "bust", top: "32%", label: "B" },
                { id: "waist", top: "45%", label: "W" },
                { id: "hips", top: "58%", label: "H" },
              ].map((line) => (
                <div
                  key={line.id}
                  className={`absolute left-0 right-0 border-t border-dashed ${measurements[line.id as keyof Measurements] ? "border-black text-black" : "border-slate-300 text-slate-300"} flex justify-between items-center transition-colors`}
                  style={{ top: line.top }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest -ml-8 bg-white px-1 z-10">
                    {line.label}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-none bg-current absolute -left-0.5 -top-[3px]"></div>
                  <div className="w-1.5 h-1.5 rounded-none bg-current absolute -right-0.5 -top-[3px]"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full flex justify-center items-stretch bg-white border border-black/10 shadow-sm">
            {!result && !isCalculating ? (
              <div className="w-full p-8 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 flex items-center justify-center mb-6 border border-black/10 bg-slate-50">
                  <div className="w-2 h-2 bg-emerald-600"></div>
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-4">
                  {texts[lang].pending}
                </h4>
                <p className="text-slate-500 text-sm font-serif leading-relaxed px-4">
                  {texts[lang].pDesc}
                </p>
              </div>
            ) : (
              <div
                className={`w-full bg-emerald-700 p-8 md:p-10 text-white flex flex-col justify-center transition-opacity duration-500 ${isCalculating ? "opacity-50" : "opacity-100"}`}
              >
                <div className="flex flex-col h-full">
                  <div className="text-[10px] font-black mb-8 w-max uppercase tracking-widest text-slate-400 border-b border-white/20 pb-2">
                    {texts[lang].status}
                  </div>
                  <p className="text-slate-400 mb-2 font-bold text-[10px] tracking-widest uppercase">
                    {texts[lang].diag}
                  </p>
                  <h3 className="text-4xl md:text-5xl font-black mb-6 leading-none tracking-tighter uppercase">
                    {isCalculating
                      ? "..."
                      : currentShapeData?.title.split(" (")[0]}
                    <br />
                    {!isCalculating && (
                      <span className="text-xs opacity-60 tracking-widest block mt-4 text-slate-300">
                        ({currentShapeData?.title.split(" (")[1]}
                      </span>
                    )}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-auto font-serif italic">
                    "{isCalculating ? texts[lang].comp : currentShapeData?.desc}
                    "
                  </p>
                  <button
                    onClick={scrollToRecommendations}
                    className="bg-white text-emerald-800 py-4 px-6 font-bold flex items-center justify-center gap-3 hover:bg-emerald-50 transition-colors mt-12 w-full uppercase tracking-widest text-[10px] shadow-lg shadow-black/10"
                  >
                    {texts[lang].insp} <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
