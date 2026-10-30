"use client";

/**
 * components/ImpugnationModal.tsx
 * 
 * Pilar 3: Minutas de Impugnação Inteligentes.
 * Modal que renderiza uma petição jurídica formal fundamentada na Nova Lei de Licitações (Lei 14.133/21)
 * e jurisprudência consolidada do TCU/STJ com placeholders customizáveis:
 * - [NOME DA EMPRESA]
 * - [CNPJ]
 * - [DATA]
 * - Botão "Copiar Minuta Formatada" para a área de transferência.
 */

import React, { useState } from "react";
import { X, Copy, Check, Scale, FileText, Download } from "lucide-react";
import { Armadilha } from "@/lib/types";

interface ImpugnationModalProps {
  isOpen: boolean;
  onClose: () => void;
  armadilha: Armadilha | null;
  orgaoLicitante?: string;
}

export const ImpugnationModal: React.FC<ImpugnationModalProps> = ({
  isOpen,
  onClose,
  armadilha,
  orgaoLicitante = "ILUSTRÍSSIMO SENHOR PREGOEIRO E COMISSÃO DE CONTRATAÇÃO",
}) => {
  const [empresa, setEmpresa] = useState("[NOME DA EMPRESA]");
  const [cnpj, setCnpj] = useState("[CNPJ: 00.000.000/0001-00]");
  const [copied, setCopied] = useState(false);

  if (!isOpen || !armadilha) return null;

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Texto formal jurídico da minuta
  const minutaText = `AO ${orgaoLicitante.toUpperCase()}

PROCESSO LICITATÓRIO EM EPÍGRAFE
REF.: IMPUGNAÇÃO AO EDITAL DE LICITAÇÃO
ASSUNTO: CLÁUSULA RESTRITIVA À COMPETITIVIDADE E EXIGÊNCIA DESPROPORCIONAL

${empresa}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${cnpj}, com sede em endereço comercial regular, vem, tempestivamente, perante Vossa Senhoria, com fundamento no Artigo 164 da Lei Federal nº 14.133/2021, apresentar:

IMPUGNAÇÃO AOS TERMOS DO INSTRUMENTO CONVOCATÓRIO

pelos fatos e fundamentos jurídicos a seguir aduzidos:

I. DA TEMPESTIVIDADE
A presente impugnação é protocolada dentro do prazo legal de até 3 (três) dias úteis anteriores à data de abertura do certame, restando cumprido o requisito do Art. 164, caput, da Lei nº 14.133/2021.

II. DA CLÁUSULA OBJETO DA IMPUGNAÇÃO
O instrumento convocatório estipula a seguinte redação no tópico "${armadilha.titulo}":
“${armadilha.texto_original}”

III. DO DIREITO E DA JURISPRUDÊNCIA APLICÁVEL
A exigência retro transcrita impõe barreira indevida à livre concorrência, ofendendo expressamente os princípios basilares da legalidade, proporcionalidade e ampla competitividade estatuídos no Art. 5º e Art. 9º da Lei Geral de Licitações.

Fundamento Legal:
${armadilha.fundamento_legal || "Art. 41, I c/c Art. 67 da Lei nº 14.133/2021, que veda exigências desnecessárias e preferências injustificadas."}

Jurisprudência Consolidada:
${armadilha.jurisprudencia || "Acórdão TCU nº 1.443/2021 - Plenário e Súmula TCU nº 263, que repelem cláusulas que onerem desproporcionalmente as propostas sem fundamentação em Estudo Técnico Preliminar (ETP)."}

Conforme cediço na jurisprudência administrativa dos Tribunais de Contas e do Superior Tribunal de Justiça (STJ), a Administração deve buscar a proposta mais vantajosa sem erigir exigências meramente formais ou que restrinjam o universo de licitantes qualificados.

IV. DOS PEDIDOS
Ante o exposto, requer-se:
a) O recebimento e processamento da presente impugnação em seu efeito regular;
b) O provimento integral para determinar a RETIFICAÇÃO da referida cláusula, adequando-a aos preceitos da Lei nº 14.133/2021;
c) A consequente reabertura do prazo de apresentação de propostas, caso a alteração afete a formulação dos lances, nos termos do Art. 55, §1º da Lei de Licitações.

Nestes termos,
Pede deferimento.

Localidade, ${dataAtual}.

________________________________________________
${empresa}
Representante Legal / Departamento Jurídico`;

  const handleCopy = () => {
    navigator.clipboard.writeText(minutaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-[#0c1322] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Minuta de Impugnação Inteligente</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Fundamento Lei 14.133/21
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Petição pré-estruturada para o tópico: <strong>{armadilha.titulo}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs de Placeholders */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Razão Social / Nome da sua Empresa
            </label>
            <input
              type="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              CNPJ da Empresa
            </label>
            <input
              type="text"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Corpo do Documento Jurídico */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/80">
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
            {minutaText}
          </pre>
        </div>

        {/* Footer com Botão Copiar */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Minuta revisada segundo a jurisprudência recente do TCU</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Minuta Copiada</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Minuta Formatada</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
