"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icons";
import { useAuth } from "@/lib/auth-context";
import { InteractiveHeroScanner } from "@/components/InteractiveHeroScanner";
import { InteractiveParecerPreview } from "@/components/InteractiveParecerPreview";
import InteractiveRoiCalculator from "@/components/InteractiveRoiCalculator";
import SplitDiffViewer from "@/components/SplitDiffViewer";
import LegalTimelineScrubber from "@/components/LegalTimelineScrubber";
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
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"eliminatoria" | "ressalva" | "passa" | "sumula263">("sumula263");

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      data-theme="dark"
      className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col font-sans selection:bg-[var(--brand-tint)] selection:text-[var(--brand)]"
    >
      {/* HEADER INSTITUCIONAL COM BARRA DE PROGRESSO DE SCROLL */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--surface)]/90 border-b border-[var(--line)] py-3.5 px-4 sm:px-8 transition-all relative">
        {/* Barra de Progresso no Topo do Cabeçalho */}
        <div
          className="absolute bottom-0 left-0 h-[2.5px] bg-[var(--brand)] transition-all duration-150 ease-out z-50"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <BrandIcon name="mark" size="s24" color="brand" />
            <div className="font-display tracking-tight text-[19px] text-[var(--ink)] flex items-baseline">
              <span className="font-medium text-[var(--ink)]">Edital</span>
              <span className="font-extrabold text-[var(--ink)]">Flash</span>
              <span className="ml-2.5 text-[10px] tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--brand-tint)] text-[var(--brand)] border border-[var(--brand)]/20 font-semibold">
                Lei 14.133/2021
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[var(--ink-2)]">
            <a href="#diferencial" className="hover:text-[var(--ink)] transition-colors">
              O Segundo Par de Olhos
            </a>
            <a href="#moats" className="hover:text-[var(--ink)] transition-colors">
              Defesa &amp; Acervos
            </a>
            <a href="#parecer" className="hover:text-[var(--ink)] transition-colors">
              Parecer Executivo
            </a>
            <a href="#planos" className="hover:text-[var(--ink)] transition-colors">
              Planos Corporativos
            </a>
            <a href="#faq" className="hover:text-[var(--ink)] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="text-[13px] font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] px-3 py-1.5 rounded transition-colors font-mono"
            >
              Criar Conta Gratuita
            </Link>
            <Link
              href="/signup?welcome=true"
              className="inline-flex items-center gap-2 text-[13px] font-bold bg-[var(--brand-solid)] hover:brightness-110 text-white px-4 py-2 rounded-md shadow-xs transition-all active:scale-98"
            >
              <BrandIcon name="auditoria" size="s16" accentCobalt={false} />
              <span>Auditar Edital Grátis</span>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION — POSICIONAMENTO PARA GESTORES SÊNIORES */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
        className="relative pt-16 pb-20 px-4 sm:px-8 border-b border-[var(--line)] bg-[var(--surface)] overflow-hidden"
      >
        {/* Grid de Precisão Arquitetural */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.16]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--line) 1px, transparent 1px),
              linear-gradient(to bottom, var(--line) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Spotlight Dinâmico Restrito */}
        {isHoveringHero && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: "550px",
              height: "550px",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, var(--brand-tint) 0%, transparent 70%)",
              opacity: 0.3,
            }}
          />
        )}

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[12px] font-mono text-[var(--ink)] mb-6 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[var(--brand)]" />
            <span className="font-semibold">O Exoesqueleto de Habilitação para Licitantes de Alto Desempenho</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[var(--ink)] tracking-tight leading-[1.12] max-w-4xl mx-auto mb-6">
            O segundo par de olhos da sua equipe contra inabilitações surpresa.
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[var(--ink-2)] max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
            Você já domina as leis de licitações. Nós eliminamos o cansaço de ler 150 páginas na quinta-feira à noite, somamos seus acervos técnicos (Súmula 263/TCU) e entregamos minutas de impugnação prontas antes que o prazo do Art. 164 expire.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/signup?welcome=true"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[var(--brand-solid)] hover:brightness-110 active:scale-98 text-white font-bold text-[15px] shadow-sm transition-all"
            >
              <BrandIcon name="edital" size="s20" accentCobalt={false} />
              <span>Auditar um Edital em 60 Segundos (Grátis)</span>
            </Link>
            <a
              href="/assets/exemplo-parecer-editalflash.pdf"
              download="exemplo-parecer-editalflash.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--bg)] hover:bg-[var(--line)]/50 active:scale-98 text-[var(--ink)] font-semibold text-[15px] border border-[var(--line)] transition-all font-mono"
            >
              <Download className="w-4 h-4 text-[var(--brand)]" />
              <span>Baixar Modelo de Parecer A4 (PDF)</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-[12px] text-[var(--ink-2)] font-mono flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Redução Drástica do Risco de Inabilitação por Falhas Documentais
            </span>
            <span className="hidden sm:inline text-[var(--line)]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--brand)]" />
              Petição Art. 164 Pronta com 1 Clique
            </span>
            <span className="hidden sm:inline text-[var(--line)]">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-500" />
              Súmula 263 TCU &amp; Tríade de Liquidez
            </span>
          </div>

          {/* SIMULADOR PERICIAL INTERATIVO ESTILO LINEAR / STRIPE */}
          <InteractiveHeroScanner />
        </div>
      </section>

      {/* SEÇÃO 2: POR QUE OS PROFISSIONAIS EXPERIENTES UTILIZAM (O CONTRAPONTO) */}
      <section id="diferencial" className="py-20 px-4 sm:px-8 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--brand)]">
              Eficiência e Segurança Corporativa
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--ink)] mt-2">
              Você não precisa de quem te ensine a lei. Precisa de quem zere o erro humano.
            </h2>
            <p className="text-[15px] text-[var(--ink-2)] mt-2 max-w-2xl mx-auto">
              Veja a diferença entre a conferência manual estressante e a blindagem pericial do EditalFlash:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* O Método Manual Antigo */}
            <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-xl border border-rose-500/30 space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-rose-500/20 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg">O Risco da Rotina Manual</h3>
              </div>

              <ul className="space-y-4 text-xs font-sans text-[var(--ink-2)] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-rose-500 font-bold">✕</span>
                  <span><strong>Fadiga Visual:</strong> Após ler 100 páginas, uma linha oculta exigindo um índice ou certidão atípica passa despercebida e derruba a empresa na sessão.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-rose-500 font-bold">✕</span>
                  <span><strong>Corrida contra o Art. 164:</strong> Redigir uma impugnação de 4 páginas consome de 2 a 4 horas ou exige honorários caros de advogados externos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-rose-500 font-bold">✕</span>
                  <span><strong>Desistência Falsa por Atestado:</strong> Dúvida manual se os atestados dispersos podem ser somados ou se a exigência é ilegal perante o TCU.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-rose-500 font-bold">✕</span>
                  <span><strong>Culpa Solitária:</strong> Se a empresa for inabilitada, a responsabilidade recai inteiramente sobre a equipe de licitações perante os sócios.</span>
                </li>
              </ul>
            </div>

            {/* O Método com EditalFlash */}
            <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-xl border-2 border-[var(--brand)] space-y-5 shadow-sm">
              <div className="flex items-center gap-2.5 pb-4 border-b border-[var(--brand)]/20 text-[var(--brand)]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg">Com o EditalFlash v1.2</h3>
              </div>

              <ul className="space-y-4 text-xs font-sans text-[var(--ink)] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-emerald-500 font-bold">✓</span>
                  <span><strong>Varredura Pericial Exaustiva:</strong> 100% das páginas auditadas em 40 segundos, confrontando PL $\ge$ 10%, LC $\ge$ 1.0 e certidões com prova literal de página e linha.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-emerald-500 font-bold">✓</span>
                  <span><strong>Minuta Pronta em 3 Segundos:</strong> Detectou cláusula restritiva? O sistema gera a petição formal com Razão Social, CNPJ e acórdãos do TCU pronta para protocolo.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-emerald-500 font-bold">✓</span>
                  <span><strong>Soma de Acervo Automática:</strong> Aplica a Súmula 263 do TCU no cofre de documentos e avisa se a empresa é competitiva para disputar o lote.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-mono text-emerald-500 font-bold">✓</span>
                  <span><strong>Parecer Executivo em PDF:</strong> Relatório em formato A4 institucional que blinda sua decisão e comprova a conformidade perante a diretoria.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: OS 4 MOATS DE DEFENSABILIDADE & SÚMULA 263 TCU */}
      <section id="moats" className="py-20 px-4 sm:px-8 border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--brand)]">
              Recursos Construídos para Grandes Licitantes
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--ink)] mt-2">
              Tecnologia Calibrada para o Mundo Real das Licitações
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Súmula 263 TCU */}
            <div className="p-5 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-3">
              <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm font-display text-[var(--ink)]">Regra do Somatório (Súmula 263)</h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                Calcula o somatório de atestados do seu cofre para cobrir os 50% de relevância técnica. Alerta na hora se o edital vedar o somatório ilegalmente.
              </p>
            </div>

            {/* Card 2: Tríade de Liquidez */}
            <div className="p-5 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-3">
              <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm font-display text-[var(--ink)]">Tríade de Liquidez &amp; PL 10%</h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                Checagem matemática estrita de Liquidez Corrente (LC), Geral (LG) e Solvência (SG). Se LC &lt; 1.0, o veredito é ELIMINATÓRIA automático.
              </p>
            </div>

            {/* Card 3: Janela Útil do Art. 164 */}
            <div className="p-5 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-3">
              <div className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm font-display text-[var(--ink)]">Contagem Regressiva Útil</h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                Calcula exatamente quantos dias úteis restam para protocolar sua impugnação (excluindo fins de semana e feriados nacionais brasileiros).
              </p>
            </div>

            {/* Card 4: Radar de Retificações */}
            <div className="p-5 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-3">
              <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm font-display text-[var(--ink)]">Diff Engine de Retificações</h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                Monitora o PNCP e avisa se o órgão lançou retificação ou errata que alterou prazos ou exigências após a sua primeira auditoria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: DEMONSTRAÇÃO DO PARECER EXECUTIVO EM PDF (INTERATIVO COM SCROLL) */}
      <section id="parecer" className="py-20 px-4 sm:px-8 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--brand)]">
              Entregável de Nível Diretoria
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--ink)] mt-2">
              Parecer Técnico Preliminar de Habilitação
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-2 max-w-xl mx-auto">
              Chega de capturas de tela desorganizadas. O EditalFlash gera na hora um documento formal em PDF nativo para anexar em atas ou enviar no WhatsApp de sócios.
            </p>
          </div>

          {/* SIMULADOR INTERATIVO COM ROLAGEM A4 REAL */}
          <InteractiveParecerPreview />
        </div>
      </section>

      {/* COMPONENTES DE DESIGN MUNDIAL (SPLIT DIFF & TIMELINE & CALCULADORA ROI) */}
      <SplitDiffViewer />
      <LegalTimelineScrubber />
      <InteractiveRoiCalculator />

      {/* SEÇÃO 5: PLANOS CORPORATIVOS */}
      <section id="planos" className="py-20 px-4 sm:px-8 border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--brand)]">
              Retorno Imediato Sobre o Investimento
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--ink)] mt-2">
              Planos Dimensionados para a Sua Operação
            </h2>
            <p className="text-[15px] text-[var(--ink-2)] mt-2">
              Um único edital vencido ou inabilitação evitada paga múltiplos anos de assinatura.
            </p>

            {/* Toggle Anual/Mensal */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-[13px] font-medium ${billingCycle === "monthly" ? "text-[var(--ink)] font-bold" : "text-[var(--ink-2)]"}`}>
                Cobrança Mensal
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-[var(--brand)]"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-[13px] font-medium ${billingCycle === "annual" ? "text-[var(--ink)] font-bold" : "text-[var(--ink-2)]"}`}>
                  Cobrança Anual
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok)]/30">
                  -20% de desconto
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* PLANO STARTER */}
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-[12px] font-mono uppercase text-[var(--ink-2)] font-bold mb-1">
                  Plano Starter
                </div>
                <p className="text-xs text-[var(--ink-2)] mb-4">
                  Para licitantes que disputam até 5 certames por mês.
                </p>
                <div className="mb-6 font-mono">
                  <span className="text-3xl font-extrabold text-[var(--ink)]">
                    R$ {billingCycle === "monthly" ? "97" : "78"}
                  </span>
                  <span className="text-xs text-[var(--ink-2)]">/mês</span>
                </div>

                <ul className="space-y-3 text-xs text-[var(--ink-2)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>5 auditorias completas de editais/mês</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Semáforo de Vereditos do Art. 62</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Parecer Executivo em PDF nativo</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?plan=Starter"
                className="mt-8 w-full py-2.5 rounded-lg text-xs font-bold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] text-center transition-all"
              >
                Assinar Starter
              </Link>
            </div>

            {/* PLANO PRO — MAIS POPULAR */}
            <div className="bg-[var(--surface)] border-2 border-[var(--brand)] rounded-xl p-6 flex flex-col justify-between relative shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--brand)] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                Mais Escolhido por Empresas
              </div>
              <div>
                <div className="text-[12px] font-mono uppercase text-[var(--brand)] font-bold mb-1">
                  Plano Profissional
                </div>
                <p className="text-xs text-[var(--ink-2)] mb-4">
                  Para equipes que necessitam de agilidade e minutas do Art. 164.
                </p>
                <div className="mb-6 font-mono">
                  <span className="text-3xl font-extrabold text-[var(--ink)]">
                    R$ {billingCycle === "monthly" ? "297" : "237"}
                  </span>
                  <span className="text-xs text-[var(--ink-2)]">/mês</span>
                </div>

                <ul className="space-y-3 text-xs text-[var(--ink)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span><strong>15 auditorias de editais/mês</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span><strong>Minutas Automáticas de Impugnação (Art. 164)</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span>Portfólio de Acervo &amp; Súmula 263 TCU</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span>Radar de Retificações (Diff Engine)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                    <span>Exportação de Histórico em CSV/Excel</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?plan=Pro"
                className="mt-8 w-full py-2.5 rounded-lg text-xs font-bold bg-[var(--brand-solid)] hover:brightness-110 text-white text-center shadow-xs transition-all"
              >
                Assinar Plano Profissional
              </Link>
            </div>

            {/* PLANO ENTERPRISE */}
            <div className="bg-[var(--bg)] border border-[var(--line)] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-[12px] font-mono uppercase text-[var(--ink-2)] font-bold mb-1">
                  Plano Enterprise
                </div>
                <p className="text-xs text-[var(--ink-2)] mb-4">
                  Multi-CNPJ para construtoras e grandes distribuidoras.
                </p>
                <div className="mb-6 font-mono">
                  <span className="text-3xl font-extrabold text-[var(--ink)]">
                    R$ {billingCycle === "monthly" ? "890" : "712"}
                  </span>
                  <span className="text-xs text-[var(--ink-2)]">/mês</span>
                </div>

                <ul className="space-y-3 text-xs text-[var(--ink-2)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Auditorias Ilimitadas de Editais</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Múltiplos CNPJs e Usuários simultâneos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dashboard de ROI &amp; Cockpit de Performance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Suporte Jurídico Prioritário via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup?plan=Enterprise"
                className="mt-8 w-full py-2.5 rounded-lg text-xs font-bold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] text-center transition-all"
              >
                Contratar Enterprise
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6: FAQ TÉCNICO */}
      <section id="faq" className="py-20 px-4 sm:px-8 border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[var(--brand)]">
              Perguntas e Respostas
            </span>
            <h2 className="font-display font-bold text-3xl text-[var(--ink)] mt-2">
              Dúvidas Frequentes de Licitantes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--surface)] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 font-semibold text-xs sm:text-sm text-[var(--ink)] flex items-center justify-between hover:bg-[var(--bg)]/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="font-mono text-xs text-[var(--ink-2)] font-bold">
                    {activeFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[var(--ink-2)] leading-relaxed border-t border-[var(--line)]/50 bg-[var(--bg)]/40 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="py-12 px-4 sm:px-8 bg-[var(--surface)] border-t border-[var(--line)] text-xs text-[var(--ink-2)]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <BrandIcon name="mark" size="s20" color="brand" />
              <span className="font-display font-bold text-sm text-[var(--ink)]">EditalFlash</span>
              <span className="text-[11px] font-mono text-[var(--ink-2)]">· Auditoria Preventiva de Habilitação (Lei 14.133/2021)</span>
            </div>

            <div className="flex items-center gap-6 font-mono text-[11px]">
              <Link href="/termos" className="hover:text-[var(--ink)] transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-[var(--ink)] transition-colors">Privacidade &amp; LGPD</Link>
              <Link href="/seguranca" className="hover:text-[var(--ink)] transition-colors">Segurança da Informação</Link>
            </div>
          </div>

          {/* Dados Legais e Fiscais Obrigatórios (Decreto 7.962/2013 - E-Commerce) */}
          <div className="pt-6 border-t border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[var(--ink-2)] text-center md:text-left">
            <div>
              <span>EditalFlash · 51.926.034 RENAN OSCAR ARAUJO CRUZ · CNPJ: 51.926.034/0001-42 · AV SANTA BERNADETHE, 310, LINDOIA, CURITIBA - PR, CEP 81.010-200</span>
            </div>
            <div>
              <span>Contato Oficial: <a href="mailto:contatoeditalflash@gmail.com" className="text-[var(--brand)] hover:underline">contatoeditalflash@gmail.com</a></span>
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
