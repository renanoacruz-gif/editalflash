/**
 * lib/citation-sanitizer.ts
 * 
 * Motor de Validação e Sanitização Estrita de Citações Probatórias.
 * FIX #3: Elimina citações fictícias em fallback/demo.
 * Se o regex determinístico não puder comprovar o número da página no documento real,
 * o veredito é compulsoriamente rebaixado para "REVISÃO HUMANA NECESSÁRIA".
 */

import { HabilitacaoItem } from "./types";

export interface CitationVerificationResult {
  verified: boolean;
  page?: number | string;
  line?: number | string;
  item?: string;
  flagReason?: string;
}

/**
 * Busca determinística da localização real de um trecho no texto bruto do PDF
 */
export function verifyAndLocateCitation(
  fullDocumentText: string,
  clauseSnippet: string
): CitationVerificationResult {
  if (!fullDocumentText || !clauseSnippet) {
    return {
      verified: false,
      flagReason: "Texto do documento ausente ou cláusula vazia.",
    };
  }

  // Normalização de whitespace e pontuação para busca resiliente
  const cleanDoc = fullDocumentText.toLowerCase().replace(/\s+/g, " ");
  const cleanSnippet = clauseSnippet.toLowerCase().replace(/\s+/g, " ").slice(0, 45);

  const foundIndex = cleanDoc.indexOf(cleanSnippet);
  if (foundIndex === -1) {
    return {
      verified: false,
      flagReason: "Cláusula detectada semanticamente, mas localização exata não confirmada no texto extraído.",
    };
  }

  // Estimativa baseada em marcadores explícitos de página no texto (ex: "Página X de Y", "Pág. X", "--- X ---")
  const textBefore = fullDocumentText.slice(0, foundIndex);
  const pageMatches = textBefore.match(/(?:página|pág\.?|fls?\.?)\s*(\d+)/gi);
  
  if (pageMatches && pageMatches.length > 0) {
    const lastPageMatch = pageMatches[pageMatches.length - 1];
    const pageNum = lastPageMatch.replace(/\D/g, "");
    if (pageNum) {
      return {
        verified: true,
        page: pageNum,
      };
    }
  }

  // Se não houver marcador de página explícito no corpo do texto, NUNCA chutar uma página fixa
  return {
    verified: false,
    flagReason: "Localização de página ausente no fluxo do texto extraído. Conferir no documento original.",
  };
}

/**
 * Sanitiza todos os requisitos da auditoria para garantir zero citações falsas
 */
export function sanitizeAnalysisCitations(
  items: HabilitacaoItem[],
  fullDocumentText: string
): { sanitizedItems: HabilitacaoItem[]; unverifiedCount: number } {
  let unverifiedCount = 0;

  const sanitizedItems = items.map((item) => {
    // Se o item já tiver citação com padrão fixo fictício em fallback, verifica contra o texto
    const verification = verifyAndLocateCitation(fullDocumentText, item.trechoEdital || item.documento);

    if (!verification.verified) {
      unverifiedCount++;
      return {
        ...item,
        status: "REVISAO_HUMANA_NECESSARIA" as const,
        lacunaTipo: "ELIMINATORIA" as const,
        localEdital: "Localização exata não confirmada. Conferir no documento original.",
        diagnostico: `${item.diagnostico} (Aviso de Auditoria: Localização exata não comprovada por leitura direta do PDF. Requer conferência humana da numeração de página no edital convocatório).`,
        revisaoHumana: true,
      };
    }

    return {
      ...item,
      localEdital: verification.page ? `Pág. ${verification.page} (Confirmada)` : item.localEdital,
    };
  });

  return { sanitizedItems, unverifiedCount };
}
