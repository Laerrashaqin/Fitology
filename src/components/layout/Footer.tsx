import { type Language } from "../../types";

interface Props {
  lang: Language;
}

export default function Footer({ lang }: Props) {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-black tracking-tighter uppercase">
          FITOLOGY.
        </div>
        <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
          &copy; 2026 Fitology •{" "}
          {lang === "id"
            ? "Matriks Gaya Sistematis."
            : "Systematic Style Matrix."}
        </div>
      </div>
    </footer>
  );
}
