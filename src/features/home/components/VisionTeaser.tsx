import { type Language } from "../../../types";
import { WavePath } from "../../../components/ui/wave-path";

interface Props {
  lang: Language;
}

export default function VisionTeaser({ lang }: Props) {
  const t = {
    id: {
      headline: "Evolusi Gaya Selanjutnya",
      desc: "Menuju masa depan dengan try-on virtual secara real-time. Biarkan teknologi AI kami menentukan ukuran dan gaya outfit terbaik, memeluk setiap inci bentuk aslimu dengan sempurna.",
    },
    en: {
      headline: "The Next Style Evolution",
      desc: "Step into the future with real-time virtual try-ons. Let our AI technology determine the best fit and style, perfectly embracing every inch of your natural shape.",
    },
  };

  return (
    <section id="vision-section" className="bg-[#022c22] py-24 md:py-40 relative overflow-hidden text-emerald-50 border-t border-emerald-900/50 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550614000-4b95d4edfa20?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-[0.03] mix-blend-screen pointer-events-none"></div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full filter blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full filter blur-[150px] mix-blend-screen pointer-events-none"></div>

      <div className="relative z-10 flex w-full max-w-6xl px-6 flex-col items-end md:items-stretch">
        <div className="w-full">
            <WavePath className="mb-10 text-emerald-400/50 mx-auto w-full max-w-[90vw] md:max-w-[70vw]" />
        </div>
        <div className="flex w-full flex-col md:flex-row justify-end items-start mt-4 gap-6 md:gap-12">
            <p className="text-emerald-400/80 mt-2 text-sm font-bold tracking-widest uppercase md:whitespace-nowrap md:w-1/4 text-right md:text-right">
              {lang === "id" ? "Visi Masa Depan" : "Future Vision"}
            </p>
            <p className="text-emerald-50 w-full md:w-3/4 text-3xl md:text-5xl font-light leading-snug tracking-tight text-right md:text-left text-balance">
              {lang === "id" ? (
                <>Evolusi <span className="font-serif italic text-emerald-400">Gayamu</span> Selanjutnya.</>
              ) : (
                <>The Next <span className="font-serif italic text-emerald-400">Style</span> Evolution.</>
              )}
              <span className="text-lg md:text-2xl text-emerald-100/70 block mt-6 max-w-2xl font-normal leading-relaxed">
                {t[lang].desc}
              </span>
            </p>
        </div>
      </div>
    </section>
  );
}
