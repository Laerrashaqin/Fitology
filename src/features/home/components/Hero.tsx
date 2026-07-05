import { type Language } from "../../../types";
import { motion } from "motion/react";

interface Props {
  lang: Language;
}

export default function Hero({ lang }: Props) {
  const t = {
    id: {
      title: (
        <>
          <span className="block text-slate-800 font-light tracking-tight mb-2 text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.1]">
            Temuin <span className="font-serif italic text-emerald-700 font-normal px-1">Body Shape</span> Aslimu,
          </span>
          <span className="text-slate-900 font-black tracking-tighter block text-6xl md:text-7xl lg:text-[5.5rem] leading-[0.95] mt-3">
            Level-Up Gaya <br className="hidden md:block"/>
            <span className="text-emerald-600 block sm:inline sm:mt-0 mt-1">OOTD-mu.</span>
          </span>
        </>
      ),
      desc: "Kalkulator cerdas kami memetakan proporsi tubuhmu secara akurat untuk menemukan body shape aslimu.",
      btn: "Cari Tahu Body Shape-ku",
    },
  };

  return (
    <section className="relative py-20 lg:py-32 xl:py-40 min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/ft_bg.png"
          alt="Fitology Hero Background"
          className="w-full h-full object-cover object-center md:object-[70%_center]"
          onError={(e) => {
            // Fallback if image is not uploaded yet
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80";
          }}
        />

        {/* Hologram Glow Overlays */}
        <div className="absolute hidden md:block right-[8%] lg:right-[15%] top-[25%] w-[350px] h-[450px] bg-emerald-300/20 rounded-[100%] filter blur-[80px] animate-[pulse_6s_ease-in-out_infinite] pointer-events-none mix-blend-screen"></div>
        <div className="absolute hidden md:block right-[12%] lg:right-[18%] top-[35%] w-[200px] h-[300px] bg-emerald-400/30 rounded-[100%] filter blur-[60px] animate-[pulse_4s_ease-in-out_infinite_1s] pointer-events-none mix-blend-screen"></div>
        <div className="absolute hidden md:block right-[15%] lg:right-[22%] top-[45%] w-[150px] h-[200px] bg-white/20 rounded-[100%] filter blur-[40px] animate-[pulse_3s_ease-in-out_infinite] pointer-events-none mix-blend-overlay"></div>

        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/95 md:via-[#FAFAFA]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex py-1.5 px-4 rounded-2xl border border-emerald-200/50 backdrop-blur-md bg-white/50 shadow-sm mb-6 md:mb-8"
          >
            <span 
              className="text-sm italic font-medium bg-clip-text text-transparent bg-[length:200%_auto] animate-[shine_3s_linear_infinite]"
              style={{
                backgroundImage: 'linear-gradient(120deg, #047857 0%, #047857 40%, #10b981 50%, #047857 60%, #047857 100%)',
              }}
            >
             {lang === "id" ? "Styling Assistant" : "Styling Assistant"}
            </span>
          </motion.div>

          <h1 className="leading-[1.1] mb-6 drop-shadow-sm">{t[lang].title}</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-lg leading-relaxed mb-10 font-light mix-blend-multiply">
            {t[lang].desc}
          </p>
          <button
            onClick={() =>
              document
                .getElementById("calculator-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group bg-emerald-600 text-white px-8 py-4 md:px-10 md:py-5 text-sm md:text-base font-bold tracking-wide rounded-2xl hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/40 hover:ring-4 hover:ring-emerald-500/20 transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3 overflow-hidden relative"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="relative z-10">{t[lang].btn}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 transition-all duration-300 group-hover:translate-x-1.5 group-hover:scale-110"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
