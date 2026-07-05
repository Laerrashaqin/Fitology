"use client" 

import * as React from "react"
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { useRef } from "react";
 
export interface MagicTextProps {
  text: string;
}
 
interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: number[];
}
 
const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const isOotd = children === "OOTD";
 
  return (
    <span className="relative inline-block text-2xl md:text-4xl lg:text-[40px] leading-snug md:leading-snug lg:leading-snug font-medium tracking-tight group">
      <span className={`absolute opacity-10 ${isOotd ? "text-emerald-600" : "text-slate-900"}`}>{children}</span>
      <motion.span style={{ opacity: opacity }} className={isOotd ? "text-emerald-600 cursor-help" : "text-slate-900"}>
        {children}
        {isOotd && (
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 md:w-48 rounded-xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none scale-95 group-hover:scale-100 origin-bottom z-50">
            <img src="/images/Log_img6.jpg" alt="OOTD Inspiration" className="w-full aspect-[4/5] object-cover bg-slate-100" />
            <div className="bg-emerald-900 text-white text-[10px] p-2 text-center font-bold tracking-widest uppercase shadow-inner">
              Inspirasi Gaya
            </div>
          </span>
        )}
      </motion.span>
    </span>
  );
};
 
export const MagicText: React.FC<MagicTextProps> = ({ text }) => {
  const container = useRef(null);
 
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "start 0.35"],
  });
  
  const words = text.split(" ");
 
  return (
    <div ref={container} className="flex flex-wrap w-full gap-x-2 md:gap-x-3 lg:gap-x-4 gap-y-2">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
 
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </div>
  );
};
