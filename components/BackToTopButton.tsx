"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Aparece após rolar 280px para baixo
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Voltar para o topo"
      aria-label="Voltar para o topo"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0E1626] hover:bg-[#2740F0] text-white border border-[#26324A] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer text-xs font-mono group"
    >
      <ArrowUp className="w-4 h-4 text-[#8F9CFF] group-hover:text-white transition-colors" />
      <span className="font-semibold hidden sm:inline">Topo</span>
    </button>
  );
}
