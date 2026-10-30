"use client";

import React, { useState, useEffect } from "react";
import { FileSearch, Sparkles, ShieldCheck, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
          ? "bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/30 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-xl flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                Edital<span className="text-emerald-400">Flash</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" /> IA Jurídica
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Lei 14.133/21 Compliance</span>
          </div>
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
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditoria 100% Segura</span>
          </div>
          <button
            onClick={() => scrollToSection("demo")}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95"
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
