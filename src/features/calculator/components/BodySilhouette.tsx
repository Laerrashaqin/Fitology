import React from "react";
import { type Measurements, type Gender } from "../../../types";

interface BodySilhouetteProps {
  measurements: Measurements;
  gender: Gender;
  unit: "CM" | "IN";
  activeField: string | null;
}

export default function BodySilhouette({
  measurements,
  gender,
  unit,
  activeField,
}: BodySilhouetteProps) {
  // Parsing inputs with intelligent defaults based on gender
  const isInch = unit === "IN";
  const scaleFactor = isInch ? 2.54 : 1.0;

  const hVal = parseFloat(measurements.height || "") || 165;
  const wVal = parseFloat(measurements.weight || "") || (gender === "women" ? 55 : 70);
  const sVal = parseFloat(measurements.shoulder || "") || 40;
  const bVal = parseFloat(measurements.bust || "") || 85;
  const waVal = parseFloat(measurements.waist || "") || 70;
  const hiVal = parseFloat(measurements.hips || "") || 85;

  const heightCm = hVal * scaleFactor;
  const shoulderCm = sVal * scaleFactor;
  const bustCm = bVal * scaleFactor;
  const waistCm = waVal * scaleFactor;
  const hipsCm = hiVal * scaleFactor;

  // Reference baselines for proportional scaling
  const baseShoulder = gender === "women" ? 38 : 44;
  const baseBust = gender === "women" ? 88 : 96;
  const baseWaist = gender === "women" ? 72 : 82;
  const baseHips = gender === "women" ? 92 : 94;

  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  // Compute scale ratios
  const sRatio = clamp(shoulderCm / baseShoulder, 0.6, 1.8);
  const bRatio = clamp(bustCm / baseBust, 0.6, 1.8);
  const wRatio = clamp(waistCm / baseWaist, 0.6, 1.8);
  const hRatio = clamp(hipsCm / baseHips, 0.6, 1.8);

  // Average half-widths in SVG coordinate space (center line = 50)
  const defaultSWidth = gender === "women" ? 15 : 20;
  const defaultBWidth = gender === "women" ? 13 : 16;
  const defaultWWidth = gender === "women" ? 9 : 13;
  const defaultHWidth = gender === "women" ? 15 : 15;

  // Apply individual ratios
  const sW = defaultSWidth * sRatio;
  const bW = defaultBWidth * bRatio;
  const wW = defaultWWidth * wRatio;
  const hW = defaultHWidth * hRatio;

  // Weight-to-height modifier (BMI simulation) to scale overall thickness
  const weightKg = wVal * (isInch ? 0.453592 : 1.0);
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 22;
  const bmiMultiplier = clamp(1.0 + (bmi - 22) * 0.02, 0.8, 1.45);

  // Final scaled half-widths
  const finalSW = sW * bmiMultiplier;
  const finalBW = bW * bmiMultiplier;
  const finalWW = wW * bmiMultiplier;
  const finalHW = hW * bmiMultiplier;

  const lengthUnit = unit === "CM" ? "CM" : "IN";
  const weightUnit = unit === "CM" ? "KG" : "LBS";

  // Centerline is at X = 50
  const cx = 50;

  // Define key coordinates for torso outline
  // Shoulder (Y = 45)
  const lShoulderX = cx - finalSW;
  const rShoulderX = cx + finalSW;
  // Bust (Y = 80)
  const lBustX = cx - finalBW;
  const rBustX = cx + finalBW;
  // Waist (Y = 115)
  const lWaistX = cx - finalWW;
  const rWaistX = cx + finalWW;
  // Hips (Y = 150)
  const lHipsX = cx - finalHW;
  const rHipsX = cx + finalHW;
  // Crotch (Y = 170)
  const crotchY = 170;

  // Construct SVG paths using smooth cubic bezier curves
  // 1. Torso & Arms Mannequin outline
  const torsoPath = `
    M ${cx - 5} 35 
    C ${cx - 6} 40, ${lShoulderX + 2} 42, ${lShoulderX} 45 
    C ${lShoulderX - 2} 48, ${lBustX - 1} 65, ${lBustX} 80
    C ${lBustX + 1} 95, ${lWaistX - 1} 105, ${lWaistX} 115
    C ${lWaistX + 1} 125, ${lHipsX - 1} 138, ${lHipsX} 150
    C ${lHipsX + 1} 160, ${cx - finalHW * 0.4} 168, ${cx} ${crotchY}
    C ${cx + finalHW * 0.4} 168, ${rHipsX - 1} 160, ${rHipsX} 150
    C ${rHipsX + 1} 138, ${rWaistX + 1} 125, ${rWaistX} 115
    C ${rWaistX - 1} 105, ${rBustX - 1} 95, ${rBustX} 80
    C ${rBustX + 1} 65, ${rShoulderX + 2} 48, ${rShoulderX} 45
    C ${rShoulderX - 2} 42, ${cx + 6} 40, ${cx + 5} 35
    Z
  `;

  // 2. Head & Neck
  const headPath = `
    M ${cx} 10 
    C ${cx + 7} 10, ${cx + 10} 16, ${cx + 10} 24 
    C ${cx + 10} 32, ${cx + 6} 36, ${cx} 36 
    C ${cx - 6} 36, ${cx - 10} 32, ${cx - 10} 24 
    C ${cx - 10} 16, ${cx - 7} 10, ${cx} 10 
    Z
  `;

  const neckPath = `
    M ${cx - 4} 32 
    L ${cx - 5} 36 
    L ${cx + 5} 36 
    L ${cx + 4} 32 
    Z
  `;

  // 3. Legs
  const leftLegPath = `
    M ${lHipsX} 150
    C ${lHipsX - 1} 165, ${cx - 14} 190, ${cx - 10} 210
    C ${cx - 8} 225, ${cx - 7} 235, ${cx - 6} 245
    L ${cx - 2} 245
    C ${cx - 3} 235, ${cx - 4} 215, ${cx - 4} 195
    C ${cx - 4} 185, ${cx - 2} 175, ${cx} ${crotchY}
    C ${cx - finalHW * 0.4} 168, ${lHipsX + 1} 160, ${lHipsX} 150
    Z
  `;

  const rightLegPath = `
    M ${rHipsX} 150
    C ${rHipsX + 1} 165, ${cx + 14} 190, ${cx + 10} 210
    C ${cx + 8} 225, ${cx + 7} 235, ${cx + 6} 245
    L ${cx + 2} 245
    C ${cx + 3} 235, ${cx + 4} 215, ${cx + 4} 195
    C ${cx + 4} 185, ${cx + 2} 175, ${cx} ${crotchY}
    C ${cx + finalHW * 0.4} 168, ${rHipsX - 1} 160, ${rHipsX} 150
    Z
  `;

  // Measurement lines definition
  const lines = [
    { id: "shoulder", y: 45, x1: lShoulderX, x2: rShoulderX, label: "Shoulder" },
    { id: "bust", y: 80, x1: lBustX, x2: rBustX, label: "Bust" },
    { id: "waist", y: 115, x1: lWaistX, x2: rWaistX, label: "Waist" },
    { id: "hips", y: 150, x1: lHipsX, x2: rHipsX, label: "Hips" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-2xl border border-black/5 overflow-hidden">
      {/* Background visual details to make it premium */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Dynamic Silhouette SVG */}
      <div className="relative w-[180px] h-[380px] drop-shadow-[0_10px_25px_rgba(0,0,0,0.04)]">
        <svg
          viewBox="0 0 100 255"
          className="w-full h-full select-none"
        >
          {/* Subtle grid background */}
          <g className="opacity-10 stroke-slate-400 stroke-[0.2]" strokeDasharray="1,1">
            <line x1="10" y1="0" x2="10" y2="255" />
            <line x1="30" y1="0" x2="30" y2="255" />
            <line x1="50" y1="0" x2="50" y2="255" />
            <line x1="70" y1="0" x2="70" y2="255" />
            <line x1="90" y1="0" x2="90" y2="255" />
          </g>

          {/* Body Silhouette Path */}
          <g className="transition-all duration-300">
            {/* Mannequin Shadow / Under-glow */}
            <path
              d={`${headPath} ${neckPath} ${torsoPath} ${leftLegPath} ${rightLegPath}`}
              fill="rgba(16, 185, 129, 0.04)"
              className="blur-[2px]"
            />
            {/* Main Mannequin Body */}
            <path
              d={`${headPath} ${neckPath} ${torsoPath} ${leftLegPath} ${rightLegPath}`}
              fill="#FFFFFF"
              stroke="#E2E8F0"
              strokeWidth="0.75"
              className="transition-all duration-300"
            />
            {/* Highlight overlay for active field state */}
            {activeField === "shoulder" && (
              <path
                d={torsoPath}
                fill="rgba(16, 185, 129, 0.05)"
                stroke="#10B981"
                strokeWidth="1.2"
                className="transition-all duration-300"
              />
            )}
            {activeField === "bust" && (
              <path
                d={torsoPath}
                fill="rgba(16, 185, 129, 0.05)"
                stroke="#10B981"
                strokeWidth="1.2"
                className="transition-all duration-300"
              />
            )}
            {activeField === "waist" && (
              <path
                d={torsoPath}
                fill="rgba(16, 185, 129, 0.05)"
                stroke="#10B981"
                strokeWidth="1.2"
                className="transition-all duration-300"
              />
            )}
            {activeField === "hips" && (
              <path
                d={`${torsoPath} ${leftLegPath} ${rightLegPath}`}
                fill="rgba(16, 185, 129, 0.05)"
                stroke="#10B981"
                strokeWidth="1.2"
                className="transition-all duration-300"
              />
            )}
          </g>

          {/* Dynamic Measurement Tape Indicator Lines */}
          {lines.map((line) => {
            const isActive = activeField === line.id;
            const hasValue = !!measurements[line.id as keyof Measurements];
            
            return (
              <g key={line.id} className="transition-all duration-300">
                {/* Horizontal projection line */}
                <line
                  x1={line.x1 - 10}
                  y1={line.y}
                  x2={line.x2 + 10}
                  y2={line.y}
                  stroke={isActive ? "#10B981" : hasValue ? "#000000" : "#CBD5E1"}
                  strokeWidth={isActive ? "1.5" : "0.75"}
                  strokeDasharray={isActive ? "none" : "2,2"}
                  className="transition-all duration-300"
                />

                {/* Left/Right Anchor Dots */}
                <rect
                  x={line.x1 - 10.5}
                  y={line.y - 1.5}
                  width="3"
                  height="3"
                  fill={isActive ? "#10B981" : hasValue ? "#000000" : "#94A3B8"}
                  className="transition-all duration-300"
                />
                <rect
                  x={line.x2 + 7.5}
                  y={line.y - 1.5}
                  width="3"
                  height="3"
                  fill={isActive ? "#10B981" : hasValue ? "#000000" : "#94A3B8"}
                  className="transition-all duration-300"
                />

                {/* Interactive labels on the outer edges */}
                {isActive && (
                  <g className="animate-pulse">
                    <text
                      x={line.x1 - 12}
                      y={line.y + 2}
                      textAnchor="end"
                      fill="#10B981"
                      fontSize="5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {measurements[line.id as keyof Measurements] || "0"}
                    </text>
                    <text
                      x={line.x2 + 12}
                      y={line.y + 2}
                      textAnchor="start"
                      fill="#10B981"
                      fontSize="5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {unit}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Real-time floating overlay text for active field */}
        {activeField && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-black tracking-widest uppercase py-1 px-3 shadow-md border border-emerald-500 rounded-full animate-bounce">
            {activeField}
          </div>
        )}
      </div>

      {/* Metric details summary */}
      <div className="mt-4 flex gap-6 text-[10px] text-slate-500 font-mono">
        <div className="flex flex-col items-center">
          <span className="text-slate-400 font-sans font-bold uppercase tracking-widest text-[8px]">Height</span>
          <span className="text-slate-800 font-bold">{hVal} {lengthUnit}</span>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex flex-col items-center">
          <span className="text-slate-400 font-sans font-bold uppercase tracking-widest text-[8px]">Weight</span>
          <span className="text-slate-800 font-bold">{wVal} {weightUnit}</span>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex flex-col items-center">
          <span className="text-slate-400 font-sans font-bold uppercase tracking-widest text-[8px]">BMI</span>
          <span className="text-slate-800 font-bold">{bmi.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}
