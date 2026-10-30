"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { ShieldAlert, Zap, Scale, Check, ArrowUpRight } from "lucide-react";

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      id: "zero-surpresas",
      icon: ShieldAlert,
      tag: "Blindagem Financeira",
      title: "Zero Surpresas",
      description:
        "Mapeamento preditivo de cláusulas punitivas, multas rescisórias abusivas e retenções de pagamento antes do envio da proposta comercial.",
      metrics: "Economia média de R$ 180k em litígios evitados",
      color: "from-rose-500/20 to-orange-500/10",
      iconColor: "text-rose-400",
      borderColor: "hover:border-rose-500/40",
    },
    {
      id: "velocidade-estrategica",
      icon: Zap,
      tag: "Produtividade 10x",
      title: "Velocidade Estratégica",
      description:
        "Análise exaustiva de editais com centenas de páginas em menos de 120 segundos. Sua equipe tria 5x mais oportunidades e foca no lance vencedor.",
      metrics: "< 2 minutos por edital completo",
      color: "from-emerald-500/20 to-teal-500/10",
      iconColor: "text-emerald-400",
      borderColor: "hover:border-emerald-500/40",
    },
    {
      id: "seguranca-juridica",
      icon: Scale,
      tag: "Lei 14.133/21",
      title: "Segurança Jurídica",
      description:
        "Tradução de juridiquês complexo para linguagem de negócios, com indicação precisa de fundamentos legais e jurisprudência do TCU para impugnações imediatas.",
      metrics: "Fundamentação com jurisprudência do TCU",
      color: "from-blue-500/20 to-indigo-500/10",
      iconColor: "text-blue-400",
      borderColor: "hover:border-blue-500/40",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="beneficios" className="py-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">
            Vantagem Competitiva em Licitações
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Por que empresas líderes de mercado utilizam o{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              EditalFlash
            </span>
            ?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Elimine a sobrecarga do setor jurídico e garanta que sua empresa dispute apenas editais
            seguros e rentáveis.
          </p>
        </div>

        {/* Staggered Grid of 3 Columns */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.id}
                variants={itemVariants}
                className={`glass-card rounded-2xl p-8 border border-slate-800 transition-all duration-300 ${b.borderColor} flex flex-col justify-between group relative overflow-hidden`}
              >
                {/* Glow subtle hover */}
                <div
                  className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${b.color} rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`}
                />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${b.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                      {b.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {b.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-400 leading-relaxed font-normal">
                    {b.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {b.metrics}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
