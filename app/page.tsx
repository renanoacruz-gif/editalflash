"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icons";
import { useAuth } from "@/lib/auth-context";
import { InteractiveHeroScanner } from "@/components/InteractiveHeroScanner";
import { InteractiveParecerPreview } from "@/components/InteractiveParecerPreview";
import { BackToTopButton } from "@/components/BackToTopButton";
import {
  ShieldCheck,
  Award,
  Clock,
  Download,
  Scale,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Eye,
  ArrowRight,
  Lock,
  Layers,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"eliminatoria" | "ressalva" | "passa" | "sumula263">("sumula263");

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const faqs = [
    {
      q: "Já temos equipe e advogados especialistas. Por que precisamos do EditalFlash?",
      a: "O EditalFlash não ensina você a licitar; ele atua como o piloto automático e sensor anticolisão da sua equipe. Após ler 8 editais de 180 páginas em uma semana, a fadiga humana faz detalhes críticos passarem despercebidos (como índices de liquidez atípicos ou vedações ilegais). Além disso, geramos sua minuta de impugnação do Art. 164 em 3 segundos, poupando 15 horas semanais de digitação mecânica.",
    },
    {
      q: "O que o EditalFlash faz na prática com a Súmula 263 do TCU e atestados técnicos?",
      a: "Avaliamos o objeto e calculamos automaticamente o somatório das Certidões de Acervo Técnico (CATs) registradas no seu cofre contra o limiar de 50% de relevância técnica. Se o edital vedar expressamente o somatório de forma ilegal, entregamos a minuta de impugnação fundamentada com precedentes do TCU pronta para protocolo.",
    },
    {
      q: "Como o Parecer Executivo em PDF ajuda na relação com a Diretoria e Sócios?",
      a: "Em vez de justificar uma decisão verbalmente em reuniões de diretoria, você entrega um Parecer Técnico formal em formato A4 institucional, com carimbo de emissão, tabela de conformidade do Art. 62, grid de 4 colunas de veredito e citação exata de página e linha. O documento confere peso pericial e blindagem profissional à tomada de decisão.",
    },
    {
      q: "Como funciona o monitoramento de retificações e erratas de edital?",
      a: "Nosso motor de retificação (Diff Engine) compara os hashes e o texto do edital que sua empresa analisou com as novas publicações no PNCP. Se o órgão convocante alterar exigências documentais, prazos ou índices a poucos dias da sessão, o EditalFlash alerta a discrepância imediatamente.",
    },
  ];

  return (
    <div
      
      className="min-h-screen bg-white text-[#09090B] flex flex-col font-sans selection:bg-[var(--brand-tint)] selection:text-[var(--brand)]"
    >
      {/* HEADER INSTITUCIONAL COM BARRA DE PROGRESSO DE SCROLL */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrollProgress > 2
            ? "backdrop-blur-md bg-white/85 border-b border-[var(--line)] shadow-xs"
            : "backdrop-blur-md bg-white/70 border-b border-transparent"
        } py-3.5 px-4 sm:px-8`}
      >
        {/* Barra de Progresso no Topo do Cabeçalho */}
        <div
          className="absolute bottom-0 left-0 h-[2.5px] bg-[var(--brand)] transition-colors duration-150 ease-out z-50"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group shrink-0">
            <BrandIcon name="mark" size="s24" color="brand" />
            <div className="font-display tracking-tight text-[19px] text-[#09090B] flex items-baseline">
              <span className="font-medium text-[#09090B]">Edital</span>
              <span className="font-extrabold text-[#09090B]">Flash</span>
              <span className="ml-2.5 text-xs tracking-widest uppercase font-mono px-2 py-0.5 rounded bg-[var(--brand-tint)] text-[var(--brand)] border border-[var(--brand)]/20 font-semibold hidden sm:inline-block">
                Lei 14.133/2021
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52525B]">
            <a href="#diferencial" className="hover:text-[#09090B] transition-colors">
              Como funciona
            </a>
            <a href="#moats" className="hover:text-[#09090B] transition-colors">
              Recursos
            </a>
            <a href="#parecer" className="hover:text-[#09090B] transition-colors">
              Exemplo de parecer
            </a>
            <a href="#planos" className="hover:text-[#09090B] transition-colors">
              Planos
            </a>
            <a href="#faq" className="hover:text-[#09090B] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* CTA sempre visível (inclusive no mobile) */}
            <Link
              href="/signup?welcome=true"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-[var(--flash)] hover:brightness-110 active:scale-98 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <BrandIcon name="edital" size="s16" accentCobalt={false} />
              <span>Auditar meu edital grátis</span>
            </Link>

            {/* Botão de Menu Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#09090B] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Hambúrguer Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 px-2 border-t border-[var(--line)] mt-3 space-y-2 bg-white/95 backdrop-blur-xl rounded-b-xl shadow-lg">
            <a
              href="#diferencial"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]"
            >
              Como funciona
            </a>
            <a
              href="#moats"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]"
            >
              Recursos
            </a>
            <a
              href="#parecer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]"
            >
              Exemplo de parecer
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]"
            >
              Planos
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-[#E4E4E7]">
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 rounded-lg text-sm font-bold bg-[var(--flash)] text-white hover:brightness-110"
              >
                Criar conta
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION — POSICIONAMENTO PARA GESTORES SÊNIORES */}
      <section className="relative pt-12 pb-16 lg:py-20 px-4 sm:px-8 border-b border-[var(--ink)] bg-[var(--ink)] text-white overflow-hidden">
        {/* Brilho radial flash em baixo à esquerda (opacidade ≤ 0.35) */}
        <div
          className="absolute -bottom-24 -left-24 w-[500px] h-[500px] pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(circle, var(--flash) 0%, transparent 70%)",
            opacity: 0.3,
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Coluna Esquerda: Conteúdo & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--flash)]/15 border border-[var(--flash-lt)]/30 text-xs font-mono font-semibold text-[var(--flash-lt)] tracking-wide shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[var(--flash-lt)]" />
              <span>Lei 14.133/2021 · Habilitação</span>
            </div>

            <h1 className="font-display font-bold text-[clamp(34px,4.5vw,56px)] text-white tracking-tight leading-[1.12]">
              Descubra antes da sessão se sua empresa pode ser <em className="italic text-[var(--flash-lt)] not-italic font-bold">inabilitada</em>.
            </h1>

            <p className="text-[16px] sm:text-[18px] text-[var(--mist)] leading-[1.6] font-sans max-w-2xl">
              Auditoria preventiva do edital, com prova de página e linha para cada exigência e parecer pronto em PDF.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href="/signup?welcome=true"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[var(--flash)] hover:brightness-110 active:scale-98 text-white font-semibold text-[15px] shadow-lg shadow-[var(--flash)]/25 transition-all focus-visible:ring-2 focus-visible:ring-[var(--flash-lt)]"
              >
                <BrandIcon name="edital" size="s20" accentCobalt={false} />
                <span>Auditar meu edital grátis</span>
              </Link>
              <a
                href="/assets/exemplo-parecer-editalflash.pdf"
                download="exemplo-parecer-editalflash.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 active:scale-98 text-white font-medium text-[15px] border border-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Ver exemplo de parecer</span>
              </a>
            </div>
          </div>

          {/* Coluna Direita: Cartão Branco "Parecer preliminar" */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-2xl p-6 sm:p-7 text-[var(--ink)] shadow-2xl border border-[var(--line)] space-y-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
                <div>
                  <span className="text-xs uppercase font-mono font-bold tracking-wider text-[var(--text-muted)] block">
                    Simulação em Tempo Real
                  </span>
                  <h3 className="font-display font-bold text-lg text-[var(--ink)]">
                    Parecer preliminar
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>4 verificados</span>
                </span>
              </div>

              <div className="space-y-3 font-sans">
                {/* Requisito 1: PL */}
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--flash)]">Art. 69, § 4º</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Pág. 14, Linhas 8-12</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] leading-snug">
                      Patrimônio Líquido ≥ 10% (R$ 425.000)
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                      Comprovado: R$ 560.000 (+32% folga)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    PASSA
                  </span>
                </div>

                {/* Requisito 2: Atestados / Súmula 263 */}
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--flash)]">Art. 67, § 2º</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Pág. 19, Linhas 2-6</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] leading-snug">
                      Atestado Operacional (5.000 m²)
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                      Soma de 2 CATs: 7.200 m² (Súmula 263 TCU)
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    PASSA
                  </span>
                </div>

                {/* Requisito 3: CND Federal / Ressalva */}
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-700">Art. 68, III</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Pág. 11, Linha 18</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] leading-snug">
                      Certidão Federal (RFB/PGFN)
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                      Válida, porém expira em 4 dias úteis
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                    RESSALVA
                  </span>
                </div>

                {/* Requisito 4: CNDT */}
                <div className="p-3 rounded-xl bg-[var(--paper)] border border-[var(--line)] flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[var(--flash)]">Art. 68, V</span>
                      <span className="text-xs text-[var(--text-muted)] font-mono">Pág. 12, Linhas 4-7</span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] leading-snug">
                      Certidão Trabalhista (CNDT)
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                      Negativa regular emitida perante o TST
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    PASSA
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                <span>Edital: Concorrência 042/2026</span>
                <span>Hash: sha256:8b4e...</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAIXA DE 3 ÍCONES / BENEFÍCIOS LOGO ABAIXO DO HERO */}
      <section className="bg-[var(--paper)] border-b border-[var(--line)] py-6 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-[var(--ink)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[var(--ink)]">Auditoria em 40 segundos</h4>
              <p className="text-xs text-[var(--text-secondary)]">Conferência completa de balanço e certidões sem risco de erro humano.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[var(--flash)] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[var(--ink)]">Impugnação em 1 clique</h4>
              <p className="text-xs text-[var(--text-secondary)]">Minuta jurídica automática pronta para envio antes do prazo fatal.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-[var(--ink)] flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-[var(--ink)]">Soma de atestados segura</h4>
              <p className="text-xs text-[var(--text-secondary)]">Validação automática do seu acervo contra exigências restritivas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: POR QUE OS PROFISSIONAIS EXPERIENTES UTILIZAM (O CONTRAPONTO) */}
      <section id="diferencial" className="py-24 px-4 sm:px-8 border-b border-[#E4E4E7] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--brand)] px-3 py-1 rounded-full bg-[var(--brand-tint)] border border-[var(--brand)]/20">
              Eficiência e Segurança Corporativa
            </span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,40px)] text-[#09090B] mt-4">
              Você não precisa de quem te ensine a lei. Precisa de quem zere o erro humano.
            </h2>
            <p className="text-[17px] text-[#52525B] mt-3 max-w-2xl mx-auto leading-relaxed">
              Veja a diferença entre a conferência manual estressante e a blindagem pericial do EditalFlash:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* O Método Manual Antigo */}
            <div className="bg-white p-7 sm:p-9 rounded-2xl border border-[#E4E4E7] space-y-6 shadow-xs">
              <div className="flex items-center gap-2.5 pb-4 border-b border-rose-500/20 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-display font-bold text-xl">O Risco da Rotina Manual</h3>
              </div>

              <ul className="space-y-4 text-[15px] sm:text-[16px] font-sans text-[#52525B] leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-rose-600 font-bold text-base">✕</span>
                  <span><strong>Fadiga Visual:</strong> Após ler 100 páginas, uma linha oculta exigindo um índice ou certidão atípica passa despercebida e derruba a empresa na sessão.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-rose-600 font-bold text-base">✕</span>
                  <span><strong>Corrida contra o Art. 164:</strong> Redigir uma impugnação de 4 páginas consome de 2 a 4 horas ou exige honorários caros de advogados externos.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-rose-600 font-bold text-base">✕</span>
                  <span><strong>Desistência Falsa por Atestado:</strong> Dúvida manual se os atestados dispersos podem ser somados ou se a exigência é ilegal perante o TCU.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-rose-600 font-bold text-base">✕</span>
                  <span><strong>Culpa Solitária:</strong> Se a empresa for inabilitada, a responsabilidade recai inteiramente sobre a equipe de licitações perante os sócios.</span>
                </li>
              </ul>
            </div>

            {/* O Método com EditalFlash */}
            <div className="bg-white p-7 sm:p-9 rounded-2xl border-2 border-[#09090B] space-y-6 shadow-md">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--brand)]/20 text-[var(--brand)]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-display font-bold text-xl">Com o EditalFlash v1.2</h3>
              </div>

              <ul className="space-y-4 text-[15px] sm:text-[16px] font-sans text-[#09090B] leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Varredura Pericial Exaustiva:</strong> 100% das páginas auditadas em 40 segundos, confrontando PL maior ou igual a 10%, LC maior ou igual a 1.0 e certidões com prova literal de página e linha.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Minuta Pronta em 3 Segundos:</strong> Detectou cláusula restritiva? O sistema gera a petição formal com Razão Social, CNPJ e acórdãos do TCU pronta para protocolo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Soma de Acervo Automática:</strong> Aplica a Súmula 263 do TCU no cofre de documentos e avisa se a empresa é competitiva para disputar o lote.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Parecer Executivo em PDF:</strong> Relatório em formato A4 institucional que blinda sua decisão e comprova a conformidade perante a diretoria.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: OS 4 MOATS DE DEFENSABILIDADE & SÚMULA 263 TCU */}
      <section id="moats" className="py-24 px-4 sm:px-8 border-b border-[#E4E4E7] bg-white">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--brand)] px-3 py-1 rounded-full bg-[var(--brand-tint)] border border-[var(--brand)]/20">
              Recursos Construídos para Grandes Licitantes
            </span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,40px)] text-[#09090B] mt-4">
              Tecnologia Calibrada para o Mundo Real das Licitações
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Súmula 263 TCU */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E4E7] space-y-3.5 shadow-xs hover:border-[#CBD5E1] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-emerald-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display text-[#09090B]">Regra do Somatório (Súmula 263)</h3>
              <p className="text-[14px] sm:text-[15px] text-[#52525B] leading-relaxed">
                Calcula o somatório de atestados do seu cofre para cobrir os 50% de relevância técnica. Alerta na hora se o edital vedar o somatório ilegalmente.
              </p>
            </div>

            {/* Card 2: Tríade de Liquidez */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E4E7] space-y-3.5 shadow-xs hover:border-[#CBD5E1] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display text-[#09090B]">Tríade de Liquidez &amp; PL 10%</h3>
              <p className="text-[14px] sm:text-[15px] text-[#52525B] leading-relaxed">
                Checagem matemática estrita de Liquidez Corrente (LC), Geral (LG) e Solvência (SG). Se LC &lt; 1.0, o veredito é ELIMINATÓRIA automático.
              </p>
            </div>

            {/* Card 3: Janela Útil do Art. 164 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E4E7] space-y-3.5 shadow-xs hover:border-[#CBD5E1] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display text-[#09090B]">Contagem Regressiva Útil</h3>
              <p className="text-[14px] sm:text-[15px] text-[#52525B] leading-relaxed">
                Calcula exatamente quantos dias úteis restam para protocolar sua impugnação (excluindo fins de semana e feriados nacionais brasileiros).
              </p>
            </div>

            {/* Card 4: Radar de Retificações */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E4E4E7] space-y-3.5 shadow-xs hover:border-[#CBD5E1] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#09090B] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display text-[#09090B]">Diff Engine de Retificações</h3>
              <p className="text-[14px] sm:text-[15px] text-[#52525B] leading-relaxed">
                Monitora o PNCP e avisa se o órgão lançou retificação ou errata que alterou prazos ou exigências após a sua primeira auditoria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: DEMONSTRAÇÃO DO PARECER EXECUTIVO EM PDF (INTERATIVO COM SCROLL) */}
      <section id="parecer" className="py-24 px-4 sm:px-8 border-b border-[#E4E4E7] bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--brand)] px-3 py-1 rounded-full bg-[var(--brand-tint)] border border-[var(--brand)]/20">
              Entregável de Nível Diretoria
            </span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,40px)] text-[#09090B] mt-4">
              Parecer Técnico Preliminar de Habilitação
            </h2>
            <p className="text-[16px] sm:text-[17px] text-[#52525B] mt-3 max-w-xl mx-auto leading-relaxed">
              Chega de capturas de tela desorganizadas. O EditalFlash gera na hora um documento formal em PDF nativo para anexar em atas ou enviar no WhatsApp de sócios.
            </p>
          </div>

          {/* SIMULADOR INTERATIVO COM ROLAGEM A4 REAL */}
          <InteractiveParecerPreview />
        </div>
      </section>

      {/* SEÇÃO 5: PLANOS CORPORATIVOS */}
      <section id="planos" className="py-24 px-4 sm:px-8 border-b border-[#E4E4E7] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--brand)] px-3 py-1 rounded-full bg-[var(--brand-tint)] border border-[var(--brand)]/20">
              Retorno Imediato Sobre o Investimento
            </span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,40px)] text-[#09090B] mt-4">
              Planos Dimensionados para a Sua Operação
            </h2>
            <p className="text-[17px] text-[#52525B] mt-3 leading-relaxed">
              Um único edital vencido ou inabilitação evitada paga múltiplos anos de assinatura.
            </p>

            {/* Toggle Anual/Mensal */}
            <div className="flex items-center justify-center gap-3.5 mt-8">
              <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-[#09090B] font-bold" : "text-[#52525B]"}`}>
                Cobrança Mensal
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-[var(--brand)]"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow motion-safe:transition motion-safe:duration-200 ease-in-out ${
                    billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${billingCycle === "annual" ? "text-[#09090B] font-bold" : "text-[#52525B]"}`}>
                  Cobrança Anual
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok)]/30">
                  -20% de desconto
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* PLANO STARTER */}
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-sm font-semibold text-[#52525B] mb-1.5">
                  Plano Starter
                </div>
                <p className="text-[15px] text-[#52525B] mb-5 leading-relaxed">
                  Para licitantes que disputam até 5 certames por mês.
                </p>
                <div className="mb-6 font-mono">
                  <span className="text-4xl font-extrabold text-[#09090B]">
                    R$ {billingCycle === "monthly" ? "97" : "78"}
                  </span>
                  <span className="text-sm text-[#52525B]">/mês</span>
                </div>

                <ul className="space-y-3.5 text-[15px] text-[#52525B]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>5 auditorias completas de editais/mês</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Semáforo de Vereditos do Art. 62</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Parecer Executivo em PDF nativo</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?plan=Starter"
                className="mt-8 w-full py-3.5 rounded-lg text-sm font-bold bg-white hover:bg-[var(--line)] text-[#09090B] border border-[#E4E4E7] text-center transition-colors shadow-xs"
              >
                Assinar Starter
              </Link>
            </div>

            {/* PLANO PRO — MAIS POPULAR */}
            <div className="bg-white border-2 border-[var(--brand)] rounded-2xl p-7 sm:p-8 flex flex-col justify-between relative shadow-lg">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--brand)] text-white text-xs font-semibold tracking-wide whitespace-nowrap shadow-sm">
                Mais escolhido
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-950 mb-1.5">
                  Plano Profissional
                </div>
                <p className="text-[15px] text-[#52525B] mb-5 leading-relaxed">
                  Para equipes que necessitam de agilidade e minutas do Art. 164.
                </p>
                <div className="mb-6 font-mono">
                  <span className="text-4xl font-extrabold text-[#09090B]">
                    R$ {billingCycle === "monthly" ? "297" : "237"}
                  </span>
                  <span className="text-sm text-[#52525B]">/mês</span>
                </div>

                <ul className="space-y-3.5 text-[15px] text-[#09090B]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand)] shrink-0" />
                    <span><strong>15 auditorias de editais/mês</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand)] shrink-0" />
                    <span><strong>Minutas Automáticas de Impugnação (Art. 164)</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand)] shrink-0" />
                    <span>Portfólio de Acervo &amp; Súmula 263 TCU</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand)] shrink-0" />
                    <span>Radar de Retificações (Diff Engine)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand)] shrink-0" />
                    <span>Exportação de Histórico em CSV/Excel</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?plan=Pro"
                className="mt-8 w-full py-3.5 rounded-lg text-sm font-bold bg-[var(--brand-solid)] hover:brightness-110 text-white text-center shadow-md transition-colors"
              >
                Assinar Plano Profissional
              </Link>
            </div>

            {/* PLANO ENTERPRISE */}
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="text-sm font-semibold text-[#52525B] mb-1.5">
                  Plano Enterprise
                </div>
                <p className="text-[15px] text-[#52525B] mb-5 leading-relaxed">
                  Multi-CNPJ para construtoras e grandes distribuidoras.
                </p>
                <div className="mb-6 font-mono">
                  <span className="text-4xl font-extrabold text-[#09090B]">
                    R$ {billingCycle === "monthly" ? "890" : "712"}
                  </span>
                  <span className="text-sm text-[#52525B]">/mês</span>
                </div>

                <ul className="space-y-3.5 text-[15px] text-[#52525B]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Auditorias Ilimitadas de Editais</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Múltiplos CNPJs e Usuários simultâneos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Dashboard de ROI &amp; Cockpit de Performance</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Suporte Jurídico Prioritário via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?plan=Enterprise"
                className="mt-8 w-full py-3.5 rounded-lg text-sm font-bold bg-white hover:bg-[var(--line)] text-[#09090B] border border-[#E4E4E7] text-center transition-colors shadow-xs"
              >
                Contratar Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: FAQ TÉCNICO */}
      <section id="faq" className="py-24 px-4 sm:px-8 border-b border-[#E4E4E7] bg-white">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--brand)] px-3 py-1 rounded-full bg-[var(--brand-tint)] border border-[var(--brand)]/20">
              Perguntas e Respostas
            </span>
            <h2 className="font-display font-bold text-[clamp(28px,4vw,40px)] text-[#09090B] mt-4">
              Dúvidas Frequentes de Licitantes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#E4E4E7] rounded-xl overflow-hidden bg-white transition-colors shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 font-semibold text-[15px] sm:text-base text-[#09090B] flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="font-mono text-base text-[#52525B] font-bold">
                    {activeFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-[15px] sm:text-[16px] text-[#52525B] leading-relaxed border-t border-[#E4E4E7]/60 bg-white/40 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="py-16 px-4 sm:px-8 bg-white border-t border-[#E4E4E7] text-sm text-[#52525B]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <BrandIcon name="mark" size="s24" color="brand" />
              <span className="font-display font-bold text-base text-[#09090B]">EditalFlash</span>
              <span className="text-xs font-mono text-[#52525B]">· Auditoria Preventiva de Habilitação (Lei 14.133/2021)</span>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs sm:text-sm">
              <Link href="/termos" className="hover:text-[#09090B] transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-[#09090B] transition-colors">Privacidade &amp; LGPD</Link>
              <Link href="/seguranca" className="hover:text-[#09090B] transition-colors">Segurança da Informação</Link>
            </div>
          </div>

          {/* Dados Legais e Fiscais Obrigatórios (Decreto 7.962/2013 - E-Commerce) */}
          <div className="pt-6 border-t border-[#E4E4E7] flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono text-[#52525B] text-center md:text-left leading-relaxed">
            <div>
              <span>EditalFlash, 51.926.034 RENAN OSCAR ARAUJO CRUZ, CNPJ: 51.926.034/0001-42, AV SANTA BERNADETHE, 310, LINDOIA, CURITIBA - PR, CEP 81.010-200</span>
            </div>
            <div>
              <span>Contato Oficial: <a href="mailto:contatoeditalflash@gmail.com" className="text-[#09090B] hover:underline">contatoeditalflash@gmail.com</a></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Script JSON-LD de Dados Estruturados (SoftwareApplication & Organization) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "EditalFlash",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "197.00",
                  "priceCurrency": "BRL",
                  "priceValidUntil": "2027-12-31"
                },
                "description": "Plataforma de auditoria preventiva de habilitação jurídica, fiscal e econômico-financeira para licitantes sob a Lei 14.133/2021."
              },
              {
                "@type": "Organization",
                "name": "EditalFlash",
                "legalName": "51.926.034 RENAN OSCAR ARAUJO CRUZ",
                "taxID": "51.926.034/0001-42",
                "email": "contatoeditalflash@gmail.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "AV SANTA BERNADETHE, 310",
                  "addressLocality": "Curitiba",
                  "addressRegion": "PR",
                  "postalCode": "81010-200",
                  "addressCountry": "BR"
                }
              }
            ]
          }),
        }}
      />

      {/* Botão Global de Voltar ao Topo */}
      <BackToTopButton />
    </div>
  );
}
