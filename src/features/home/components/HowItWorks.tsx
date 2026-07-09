import React, { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "motion/react";
import { Ruler, Sparkles, Shirt } from "lucide-react";

const GridPattern = ({ offsetX, offsetY, id, className }: { offsetX: any, offsetY: any, id: string, className?: string }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className={className || "text-emerald-900/10"} 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + 0.5) % 40);
    gridOffsetY.set((currentY + 0.5) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  const steps = [
    {
      id: "01",
      title: "Ukur Tubuhmu",
      desc: "Masukkan beberapa ukuran simpel. Biar sistem yang kerjain perhitungannya buat nemuin proporsi yang tepat.",
      icon: Ruler
    },
    {
      id: "02",
      title: "Ketahui Hasilnya",
      desc: "Berdasarkan ukuranmu, sistem bakal ngasih tau apa sih body shape aslimu. Ngga ada lagi deh tebak-tebakan.",
      icon: Sparkles
    },
    {
      id: "03",
      title: "Temukan Rekomendasi",
      desc: "Dapetin tips dan kurasi ide outfit yang bakal bikin penampilanmu makin stand out dan nyaman seharian.",
      icon: Shirt
    }
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="bg-white py-24 md:py-32 relative overflow-hidden border-y border-emerald-100/50"
    >
      
      {/* Infinite Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.2]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} id="grid-bg" className="text-emerald-900/5" />
      </div>
      <motion.div 
        className="absolute inset-0 z-0 opacity-100"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} id="grid-hover" className="text-emerald-600/30" />
      </motion.div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/60 rounded-full filter blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pointer-events-none">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex py-1.5 px-4 rounded-2xl border border-emerald-200/50 backdrop-blur-md bg-white/50 shadow-sm mb-6 md:mb-8"
          >
            <span 
              className="text-sm italic font-medium bg-clip-text text-transparent bg-[length:200%_auto] animate-[shine_3s_linear_infinite]"
              style={{
                backgroundImage: 'linear-gradient(120deg, #047857 0%, #047857 40%, #10b981 50%, #047857 60%, #047857 100%)',
              }}
            >
              Alur Kerja
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight mb-6">
            Gimana Sih <span className="font-serif italic font-normal text-emerald-600">Cara Kerjanya?</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg md:text-xl">
            Tiga langkah gampang buat nemuin body shape dan level-up gaya OOTD kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative pointer-events-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
              className="flex flex-col bg-white/80 backdrop-blur-sm border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-10 rounded-[2rem] hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Highlight gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-12 relative z-10 overflow-hidden group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative z-10"
                >
                  <step.icon className="w-8 h-8" strokeWidth={2} />
                </motion.div>
              </div>
              <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 group-hover:text-emerald-50 transition-colors duration-500 pointer-events-none select-none">
                {step.id}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 tracking-tight relative z-10 group-hover:text-emerald-900 transition-colors duration-300">{step.title}</h3>
              <p className="text-slate-600 font-medium leading-relaxed relative z-10">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
