import { type ShapeData, type Gender, type Language } from "../../../types";

interface Props {
  shapeData: ShapeData;
  gender: Gender;
  lang: Language;
}

export default function Recommendations({ shapeData, gender, lang }: Props) {
  if (!shapeData) return null;

  const t = {
    id: {
      dossier: "Berkas Gaya",
      core: "Prinsip Utama",
      curated: "Siluet Terkurasi",
    },
  };

  return (
    <section id="results-section" className="bg-[#FAFAFA] py-24 mb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20 pb-10 border-b border-black/10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            {t[lang].dossier}: {gender.toUpperCase()}
          </h2>
          <h3 className="text-5xl lg:text-7xl font-bold tracking-tighter uppercase text-slate-900 leading-[0.9]">
            {shapeData.title}
          </h3>
          <p className="mt-8 max-w-2xl text-xl text-slate-600 font-serif leading-relaxed">
            {shapeData.introText}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-16 items-start">
          {/* Guidelines / Principles */}
          <div className="space-y-8 sticky top-32">
            <h4 className="text-xs font-bold tracking-widest uppercase border-b border-black/10 pb-4 text-slate-900">
              {t[lang].core}
            </h4>
            <ul className="space-y-8">
              {shapeData.tipsList.map((tip, idx) => (
                <li key={idx} className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400">
                    0{idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-slate-700 font-medium">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Lookbook / Curated Fits */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase border-b border-black/10 pb-4 mb-10 text-slate-900">
              {t[lang].curated}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
              {shapeData.fits.map((fit, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden bg-slate-100 mb-6 relative">
                    <img
                      src={fit.img}
                      alt={fit.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-black uppercase tracking-widest">
                      {fit.cat}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pr-4 h-full">
                    <h5 className="font-bold text-lg tracking-tight uppercase text-slate-900">
                      {fit.name}
                    </h5>
                    <p className="text-sm text-slate-600 leading-relaxed font-sans mb-4">
                      <span className="font-semibold text-emerald-700">
                        {lang === "id" ? "Kenapa cocok:" : "Why it works:"}
                      </span>{" "}
                      {fit.reasonDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
