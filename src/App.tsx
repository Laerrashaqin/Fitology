import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import Navbar from "./components/layout/Navbar";
import Hero from "./features/home/components/Hero";
import HowItWorks from "./features/home/components/HowItWorks";
import VisionTeaser from "./features/home/components/VisionTeaser";
import Calculator from "./features/calculator/components/Calculator";
import Recommendations from "./features/recommendations/components/Recommendations";
import Footer from "./components/layout/Footer";
import { recommendationsData } from "./features/recommendations/data/recommendations";
import { type Measurements, type Gender, type Language } from "./types";

const App = () => {
  const [lang, setLang] = useState<Language>("id");
  const [gender, setGender] = useState<Gender>("women");
  const [measurements, setMeasurements] = useState<Measurements>({
    height: "",
    weight: "",
    shoulder: "",
    bust: "",
    waist: "",
    hips: "",
    highHip: "",
  });

  const [unit, setUnit] = useState<"CM" | "IN">("CM");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const recommendationsRef = useRef<HTMLElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const calculateBodyShape = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (
      !measurements.height ||
      !measurements.weight ||
      !measurements.shoulder ||
      !measurements.bust ||
      !measurements.waist ||
      !measurements.hips
    ) {
      setError(
        lang === "id"
          ? "Lengkapi semua dimensi numerik untuk analisis presisi."
          : "Complete all metric dimensions for a precision analysis.",
      );
      return;
    }

    setError("");
    setIsCalculating(true);
    setResult(null);

    setTimeout(() => {
      const s = parseFloat(measurements.shoulder);
      const b = parseFloat(measurements.bust);
      const w = parseFloat(measurements.waist);
      const h = parseFloat(measurements.hips);

      let shape = "Rectangle";

      if (gender === "women") {
        const isWaistDefined = b - w >= 15 && h - w >= 15;
        const isBustHipsEqual = Math.abs(b - h) <= 5;

        if (s > h + 5 || b > h + 5) {
          shape = "Inverted Triangle";
        } else if (h > s + 5 || h > b + 5) {
          shape = "Pear";
        } else if (isBustHipsEqual && isWaistDefined) {
          shape = "Hourglass";
        } else {
          shape = "Rectangle";
        }
      } else {
        if (w > b + 3 || h > b + 3) {
          shape = "Triangle";
        } else if (s > w + 12 || b > w + 10) {
          shape = "Inverted Triangle";
        } else if (s > w + 5 || b > w + 5) {
          shape = "Trapezoid";
        } else {
          shape = "Rectangle";
        }
      }

      setResult(shape);
      setIsCalculating(false);
    }, 1500);
  };

  const scrollToRecommendations = () => {
    if (recommendationsRef.current) {
      recommendationsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      document
        .getElementById("results-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentShapeData =
    result &&
    recommendationsData[lang] &&
    recommendationsData[lang][gender] &&
    recommendationsData[lang][gender][result]
      ? recommendationsData[lang][gender][result]
      : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-black selection:text-white">
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />

      <HowItWorks lang={lang} />

      <Calculator
        lang={lang}
        gender={gender}
        setGender={setGender}
        measurements={measurements}
        handleInputChange={handleInputChange}
        unit={unit}
        setUnit={setUnit}
        calculateBodyShape={calculateBodyShape}
        isCalculating={isCalculating}
        result={result}
        error={error}
        currentShapeData={currentShapeData}
        scrollToRecommendations={scrollToRecommendations}
      />

      <div ref={recommendationsRef as any}>
        {result && !isCalculating && currentShapeData && (
          <Recommendations
            shapeData={currentShapeData}
            gender={gender}
            lang={lang}
          />
        )}
      </div>

      <VisionTeaser lang={lang} />

      <Footer lang={lang} />
    </div>
  );
};

export default App;
