import React from "react";
import { type Language } from "../../../types";
import { MagicText } from "../../../components/ui/magic-text";

export default function Greeting() {
  const textId = "Haloo! Fitology hadir bantu kamu nemuin body shape aslimu, lengkap bareng tips gaya dan rekomendasi OOTD yang pas buat kamu.";
  
  return (
    <section className="py-16 md:py-24 lg:py-32 bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <MagicText text={textId} />
      </div>
    </section>
  );
}

