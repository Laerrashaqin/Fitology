import React from "react";
import { User } from "lucide-react";
import { type Language } from "../../../types";

interface Props {
  userData: any;
  loading: boolean;
  lang: Language;
  t: any;
}

export default function BodyShapeInfo({ userData, loading, lang, t }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight">
          {t[lang].bodyShapeProfile}
        </h3>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : userData?.bodyShape ? (
        <div className="flex items-start gap-6">
          {(() => {
            const getShapeImageUrl = (shape: string, gender: string) => {
              if (!shape) return null;
              const s = shape.toLowerCase();
              const isMenShape = s.includes('trapezoid') || s.includes('oval') || (s.includes('triangle') && !s.includes('inverted'));
              if (gender === 'men' || isMenShape) {
                if (s.includes('trapezoid')) return '/images/men01.jpg';
                if (s.includes('triangle') && !s.includes('inverted')) return '/images/men03.jpg';
                if (s.includes('oval')) return '/images/men02.jpg';
                if (s.includes('rectangle')) return '/images/men04.jpg';
                if (s.includes('inverted')) return '/images/men05.jpg';
              } else {
                if (s.includes('hourglass')) return '/images/women01.jpg';
                if (s.includes('pear')) return '/images/women03.jpg';
                if (s.includes('apple')) return '/images/women02.jpg';
                if (s.includes('rectangle')) return '/images/women04.jpg';
                if (s.includes('inverted')) return '/images/women05.jpg';
              }
              return null;
            };
            const shapeImg = getShapeImageUrl(userData.bodyShape, userData.gender);
            return shapeImg ? (
              <div className="w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={shapeImg} alt={userData.bodyShape} className="w-full h-full object-contain p-2 mix-blend-multiply" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center shrink-0">
                <span className="text-3xl font-black text-emerald-600 mb-1">
                  {userData.bodyShape.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Shape</span>
              </div>
            );
          })()}
          <div>
            <h4 className="text-lg font-black text-slate-900 mb-2 capitalize">{userData.bodyShape}</h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              {userData.bodyShapeDesc || "Sistem kami telah menyimpan preferensi profil bentuk tubuh Anda untuk memberikan rekomendasi yang lebih baik."}
            </p>
            <a href="#calculator-section" className="text-emerald-600 hover:text-emerald-700 text-sm font-bold underline underline-offset-4">
              Hitung Ulang
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 font-serif mb-4">
            {t[lang].noBodyShape}
          </p>
          <a href="#calculator-section" className="inline-block px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-colors text-sm">
            Mulai Kalkulator
          </a>
        </div>
      )}
    </div>
  );
}
