"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/brand/Logo";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0E1626]/95 backdrop-blur-xl border-b border-[#26324A] shadow-lg shadow-black/30 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo Oficial */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Logo variant="fundo-escuro" size="md" href="" />
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium tracking-wide bg-[#2740F0]/15 text-[#8F9CFF] border border-[#2740F0]/30 ml-1">
            Lei 14.133/2021
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollToSection("demo")}
            className="hover:text-emerald-400 transition-colors"
          >
            Demonstração Interativa
          </button>
          <button
            onClick={() => scrollToSection("beneficios")}
            className="hover:text-emerald-400 transition-colors"
          >
            Benefícios
          </button>
          <button
            onClick={() => scrollToSection("relatorio")}
            className="hover:text-emerald-400 transition-colors"
          >
            Relatório Executivo
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="hover:text-emerald-400 transition-colors"
          >
            Planos & Preços
          </button>
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#8F9CFF]" />
            <span>Auditoria 100% Segura</span>
          </div>
          <button
            onClick={() => scrollToSection("demo")}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold rounded-xl text-white bg-[#2740F0] hover:bg-blue-600 transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 cursor-pointer"
          >
            <span>Testar Edital</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0c1220]/95 backdrop-blur-2xl border-b border-slate-800 px-6 py-5 flex flex-col gap-4 text-sm font-medium"
          >
            <button
              onClick={() => scrollToSection("demo")}
              className="text-left text-slate-300 hover:text-emerald-400 py-1"
            >
              Demonstração Interativa
            </button>
            <button
              onClick={() => scrollToSection("beneficios")}
              className="text-left text-slate-300 hover:text-emerald-400 py-1"
            >
              Benefícios Estratégicos
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-left text-slate-300 hover:text-emerald-400 py-1"
            >
              Preços & Setup
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
            >
              Testar Agora Gratuitamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
