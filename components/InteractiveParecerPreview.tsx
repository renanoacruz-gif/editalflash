"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Printer,
  Sparkles,
  Award,
} from "lucide-react";

export const InteractiveParecerPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"todos" | "conformes" | "ressalvas">("todos");

  const auditoriaItems = [
    {
      artigo: "Art. 69, § 4º",
      categoria: "Qualificação Econômica",
      exigencia: "Patrimônio Líquido Mínimo de 10% (R$ 425.000,00)",
      localEdital: "Pág. 14, Item 8.2.1",
      diagnostico: "Balanço Patrimonial apura PL de R$ 560.000,00 (13,1%). Margem positiva de +R$ 135.000,00.",
      status: "PASSA",
      statusLabel: "PASSA (+32% folga)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
    },
    {
      artigo: "Art. 67, § 2º",
      categoria: "Capacidade Técnica",
      exigencia: "Atestado de Pavimentação CBUQ em volume de 5.000 m²",
      localEdital: "Pág. 19, Item 9.3",
      diagnostico: "Soma de 2 CATs registradas no CREA atinge 7.200 m². Aplicável a regra da Súmula 263 do TCU.",
      status: "PASSA",
      statusLabel: "PASSA (Súmula 263)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
    },
    {
      artigo: "Art. 68, III",
      categoria: "Regularidade Fiscal",
      exigencia: "Certidão Conjunta Federal (RFB/PGFN) em plena validade",
      localEdital: "Pág. 11, Item 7.1.3",
      diagnostico: "Certidão cadastrada é válida, porém vence em 4 dias corridos. Requer renovação preventiva no e-CAC.",
      status: "RESSALVA",
      statusLabel: "RESSALVA (4 dias)",
      badgeBg: "bg-amber-50 text-amber-900 border-amber-300",
    },
    {
      artigo: "Art. 68, V",
      categoria: "Trabalhista",
      exigencia: "Certidão Negativa de Débitos Trabalhistas (CNDT)",
      localEdital: "Pág. 12, Item 7.2",
      diagnostico: "CNDT expedida pelo TST com validade assegurada por mais 120 dias.",
      status: "PASSA",
      statusLabel: "PASSA (Conforme)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
    },
    {
      artigo: "Art. 69, § 1º",
      categoria: "Índices Contábeis",
      exigencia: "Liquidez Geral (LG) ≥ 1,00 e Liquidez Corrente (LC) ≥ 1,00",
      localEdital: "Pág. 16, Item 8.3",
      diagnostico: "Índices apurados: LG = 1,42 e LC = 1,38. Dispensada garantia adicional de proposta.",
      status: "PASSA",
      statusLabel: "PASSA (LG/LC > 1)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
    },
  ];

  const filtered = auditoriaItems.filter((item) => {
    if (activeTab === "conformes") return item.status === "PASSA";
    if (activeTab === "ressalvas") return item.status === "RESSALVA";
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Moldura de Visualizador de Documento Interativo (PDF Scroll Viewport) */}
      <div className="bg-[#11212D] border border-[#253745] rounded-2xl shadow-2xl overflow-hidden text-left">
        {/* Barra Superior do Visualizador */}
        <div className="px-5 py-3 border-b border-[#253745] bg-[#06141B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#9BA8AB]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[#CCD0CF] font-semibold text-xs ml-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#9BA8AB]" />
              <span>Parecer_Preliminar_Concorrencia_042_2026.pdf</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-[#11212D] px-2.5 py-0.5 rounded border border-[#253745] text-[#CCD0CF]">
              Visualização Interativa A4 • Pág. 1 de 2
            </span>
            <a
              href="/assets/exemplo-parecer-editalflash.pdf"
              download="exemplo-parecer-editalflash.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#253745] hover:bg-[#324859] text-white font-bold text-xs transition-colors shadow-xs border border-[#9BA8AB]/30"
            >
              <Download className="w-3 h-3" />
              <span>Baixar Parecer em PDF</span>
            </a>
          </div>
        </div>

        {/* Viewport com Rolagem Interna com Efeito de Folha A4 Real */}
        <div className="p-4 sm:p-8 bg-[#06141B] max-h-[580px] overflow-y-auto space-y-6">
          {/* Folha A4 Simulação Visual com Papel Branco e Tipografia Solene */}
          <div className="bg-white text-[#06141B] p-6 sm:p-10 rounded-xl shadow-2xl border border-gray-200 max-w-3xl mx-auto space-y-6 font-sans">
            {/* Cabeçalho Oficial do Parecer */}
            <div className="border-b-2 border-[#06141B] pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#253745]">
                  PARECER TÉCNICO DE HABILITAÇÃO PRELIMINAR (LEI 14.133/2021)
                </span>
                <span className="text-[10px] font-mono text-gray-500">
                  Emissão: 29/10/2026 às 06:45 BRT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#06141B] mt-1">
                PARECER TÉCNICO PRELIMINAR DE HABILITAÇÃO
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 mt-2 font-mono">
                <div>Licitante: <strong className="text-black">51.926.034 RENAN OSCAR ARAUJO CRUZ</strong></div>
                <div>CNPJ: <strong className="text-black">51.926.034/0001-42</strong></div>
                <div>Edital: <strong className="text-black">Concorrência nº 042/2026</strong></div>
                <div>Órgão: <strong className="text-black">SEDUC - Secretaria de Educação</strong></div>
              </div>
            </div>

            {/* Quadro de Síntese Executiva em 4 Colunas + Veredito Geral */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="grid grid-cols-4 gap-3 w-full sm:w-auto text-center font-mono">
                <div className="border-r border-gray-200 pr-2">
                  <div className="text-[9px] uppercase text-gray-500 font-bold">Conformes</div>
                  <div className="text-xl font-bold text-emerald-700">11</div>
                </div>
                <div className="border-r border-gray-200 pr-2">
                  <div className="text-[9px] uppercase text-gray-500 font-bold">Ressalvas</div>
                  <div className="text-xl font-bold text-amber-700">1</div>
                </div>
                <div className="border-r border-gray-200 pr-2">
                  <div className="text-[9px] uppercase text-gray-500 font-bold">Eliminatórias</div>
                  <div className="text-xl font-bold text-rose-700">0</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase text-gray-500 font-bold">Revisões</div>
                  <div className="text-xl font-bold text-gray-700">0</div>
                </div>
              </div>

              <div className="sm:border-l sm:border-gray-200 sm:pl-4 w-full sm:w-auto text-center sm:text-right">
                <span className="inline-block px-3.5 py-1.5 rounded bg-emerald-600 text-white font-mono text-xs font-bold uppercase shadow-xs">
                  HABILITAÇÃO PROVÁVEL (PASSA)
                </span>
                <span className="block text-[10px] text-gray-500 font-mono mt-1">
                  Sem riscos impeditivos de inabilitação
                </span>
              </div>
            </div>

            {/* Abas de Filtro Interativo Dentro do Próprio Documento */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("todos")}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === "todos"
                      ? "bg-[#0E1626] text-white font-bold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Todos ({auditoriaItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("conformes")}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === "conformes"
                      ? "bg-emerald-700 text-white font-bold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Conformes (4)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("ressalvas")}
                  className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    activeTab === "ressalvas"
                      ? "bg-amber-700 text-white font-bold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Ressalvas (1)
                </button>
              </div>

              <span className="text-[11px] font-mono text-gray-500">
                Interativo: role para ver mais
              </span>
            </div>

            {/* Tabela Pericial de Verificação Art. 62 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-gray-100 text-gray-700 p-2.5 font-bold font-mono text-[10px] grid grid-cols-12 gap-2 border-b border-gray-200 uppercase">
                <span className="col-span-3">Requisito &amp; Artigo</span>
                <span className="col-span-3">Local no Edital</span>
                <span className="col-span-4">Diagnóstico Pericial</span>
                <span className="col-span-2 text-right">Veredito</span>
              </div>

              <div className="divide-y divide-gray-200">
                {filtered.map((item, idx) => (
                  <div key={idx} className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50/80 transition-colors">
                    <div className="col-span-3">
                      <span className="text-[10px] font-mono text-[#253745] font-bold block">
                        {item.artigo}
                      </span>
                      <strong className="text-xs text-black block leading-snug">{item.exigencia}</strong>
                    </div>

                    <div className="col-span-3 font-mono text-[11px] text-gray-600">
                      {item.localEdital}
                    </div>

                    <div className="col-span-4 text-[11px] text-gray-700 leading-relaxed font-sans">
                      {item.diagnostico}
                    </div>

                    <div className="col-span-2 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${item.badgeBg}`}>
                        {item.statusLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusão e Rodapé Institucional */}
            <div className="pt-4 border-t border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-500 font-mono">
              <p>
                Documento de suporte técnico à decisão emitido pelo EditalFlash. Responsabilidade jurídica com a licitante.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <span>Hash: sha256:8b4e...9f21</span>
                <span>•</span>
                <span>Página 1 de 2</span>
              </div>
            </div>
            <div className="bg-[#11212D] border border-[#253745] rounded-lg p-3 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[#9BA8AB] font-mono">
                Gostou do rigor pericial deste parecer? Gere o relatório oficial da sua própria empresa.
              </span>
              <a
                href="/signup"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#253745] hover:bg-[#324859] text-white font-bold text-xs transition-colors shadow-xs whitespace-nowrap border border-[#9BA8AB]/30"
              >
                <span>Gere o da sua empresa → /signup</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
