/**
 * lib/classifier.ts
 * 
 * Classificador Leve de Editais de Licitação Pública (Step A).
 * - Analisa o objeto, resumo e trechos iniciais do edital.
 * - Categorias: OBRAS, COMPRAS, SERVICOS_CONTINUOS, SAUDE, TI, GERAL.
 * - Retorna categoria primária tipada, score de confiança (0-100) e flag de ambiguidade.
 * - Desenhado para execução ultra-rápida (<2s) e determinística.
 */

import { PrimaryVertical } from "./types";

export type TenderCategoryCode =
  | "OBRAS"
  | "COMPRAS"
  | "SERVICOS_CONTINUOS"
  | "SAUDE"
  | "TI"
  | "GERAL";

export interface ClassificationResult {
  categoryCode: TenderCategoryCode;
  vertical: PrimaryVertical;
  confidence: number; // 0 to 100
  isAmbiguous: boolean;
  reasoning: string;
  matchedKeywords: string[];
}

export const CATEGORY_MAP: Record<TenderCategoryCode, PrimaryVertical> = {
  OBRAS: "Obras Públicas e Engenharia",
  COMPRAS: "Compras e Fornecimentos",
  SERVICOS_CONTINUOS: "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
  SAUDE: "Saúde e Medicamentos",
  TI: "Tecnologia da Informação",
  GERAL: "Todos / Não tenho preferência definida",
};

export const VERTICAL_TO_CATEGORY_CODE: Record<PrimaryVertical, TenderCategoryCode> = {
  "Obras Públicas e Engenharia": "OBRAS",
  "Compras e Fornecimentos": "COMPRAS",
  "Serviços Contínuos (Limpeza, Segurança, Manutenção)": "SERVICOS_CONTINUOS",
  "Saúde e Medicamentos": "SAUDE",
  "Tecnologia da Informação": "TI",
  "Todos / Não tenho preferência definida": "GERAL",
};

interface CategoryKeywordProfile {
  code: TenderCategoryCode;
  vertical: PrimaryVertical;
  strongKeywords: string[];
  secondaryKeywords: string[];
  forbiddenSignals: string[];
}

const PROFILES: CategoryKeywordProfile[] = [
  {
    code: "SAUDE",
    vertical: "Saúde e Medicamentos",
    strongKeywords: [
      "medicamento", "medicamentos", "anvisa", "fármaco", "farmacos", "farmacêutico",
      "hospitalar", "insumos hospitalares", "leito", "curativo", "reagente", "alvará sanitário",
      "vigilância sanitária", "crf", "comprimido", "ampola", "solução injetável", "gaze",
      "seringa", "cateter", "luva cirúrgica", "material penso"
    ],
    secondaryKeywords: [
      "saúde", "ubs", "upa", "secretaria de saúde", "paciente", "dermatológico", "clínico",
      "dosagem", "miligramas", "mg/ml", "farmácia"
    ],
    forbiddenSignals: ["pavimentação", "asfalto", "cbuq", "drenagem pluvial", "crea/cau", "construção civil"],
  },
  {
    code: "TI",
    vertical: "Tecnologia da Informação",
    strongKeywords: [
      "software", "datacenter", "cloud", "computação em nuvem", "desenvolvimento de sistemas",
      "licenciamento de software", "lgpd", "iso 27001", "iso/iec 27001", "firewall",
      "servidores", "banco de dados", "suporte de ti", "service desk", "infraestrutura de ti",
      "fibra óptica", "telefonia ip", "voip", "switch", "backup em nuvem"
    ],
    secondaryKeywords: [
      "hardware", "redes", "tecnologia", "sistema integrado", "erpm", "sla", "cibersegurança",
      "computadores", "notebooks"
    ],
    forbiddenSignals: ["pavimentação", "asfalto", "anvisa", "medicamento", "farmacêutico"],
  },
  {
    code: "OBRAS",
    vertical: "Obras Públicas e Engenharia",
    strongKeywords: [
      "obra", "obras", "reforma", "pavimentação", "drenagem", "engenharia", "engenharia civil",
      "cbuq", "asfalto", "recapeamento", "art", "cat", "crea", "cau", "bdi", "sinapi",
      "concreto armado", "alvenaria", "terraplenagem", "sinalização viária", "edificação"
    ],
    secondaryKeywords: [
      "construção", "croqui", "memorial descritivo", "plantas", "cronograma físico-financeiro",
      "visita técnica", "crea-", "cau-"
    ],
    forbiddenSignals: ["anvisa", "medicamento", "crf", "farmacêutico"],
  },
  {
    code: "SERVICOS_CONTINUOS",
    vertical: "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
    strongKeywords: [
      "limpeza", "vigilância", "portaria", "conservação", "dedicação exclusiva de mão de obra",
      "postos de trabalho", "cct", "convenção coletiva", "recolhimento fgts", "desinsetização",
      "copeiragem", "recepção predial", "manutenção predial", "serviços de marketing",
      "promoção de vendas", "divulgação", "publicidade", "propaganda", "apoio operacional",
      "marketing digital", "comunicação social", "assessoria de imprensa", "eventos e promoção"
    ],
    secondaryKeywords: [
      "serviços terceirizados", "mão de obra", "encargos sociais", "planilha de custos",
      "vales-alimentação", "auxílio-transporte", "marketing", "campanha", "mídia"
    ],
    forbiddenSignals: ["pavimentação", "cbuq", "medicamento", "anvisa"],
  },
  {
    code: "COMPRAS",
    vertical: "Compras e Fornecimentos",
    strongKeywords: [
      "aquisição de", "fornecimento de", "material de consumo", "gêneros alimentícios",
      "suprimentos", "merenda escolar", "combustível", "gasolina", "diesel", "veículos",
      "pneus", "material escolar", "papelaria", "mobiliário"
    ],
    secondaryKeywords: [
      "entrega parcelada", "catálogo", "amostra", "garantia do produto", "marca e modelo",
      "prospecto"
    ],
    forbiddenSignals: ["art/crea", "cat de obras", "engenharia civil", "pavimentação"],
  },
];

/**
 * Classifica o documento com base no objeto e conteúdo inicial
 */
export function classifyTender(text: string): ClassificationResult {
  if (!text || text.trim().length === 0) {
    return {
      categoryCode: "GERAL",
      vertical: "Todos / Não tenho preferência definida",
      confidence: 50,
      isAmbiguous: true,
      reasoning: "Documento sem texto legível ou extração vazia.",
      matchedKeywords: [],
    };
  }

  // Analisa preferencialmente os primeiros 12.000 caracteres (Preâmbulo, Objeto, Item 1 e Termo de Referência)
  const sample = text.slice(0, 12000).toLowerCase();

  const scores: {
    profile: CategoryKeywordProfile;
    score: number;
    matches: string[];
  }[] = [];

  for (const profile of PROFILES) {
    let score = 0;
    const matches: string[] = [];

    // Checa palavras fortes (peso 15 cada)
    for (const kw of profile.strongKeywords) {
      if (sample.includes(kw)) {
        score += 15;
        matches.push(kw);
      }
    }

    // Checa palavras secundárias (peso 5 cada)
    for (const kw of profile.secondaryKeywords) {
      if (sample.includes(kw)) {
        score += 5;
        matches.push(kw);
      }
    }

    // Penalidade severa se encontrar sinal proibido daquela vertical
    for (const forb of profile.forbiddenSignals) {
      if (sample.includes(forb)) {
        score -= 25;
      }
    }

    scores.push({
      profile,
      score: Math.max(0, score),
      matches,
    });
  }

  // Ordena pelo maior score
  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];
  const second = scores[1];

  // Se o score for muito baixo, categoriza como GERAL
  if (!best || best.score < 15) {
    return {
      categoryCode: "GERAL",
      vertical: "Todos / Não tenho preferência definida",
      confidence: 40,
      isAmbiguous: true,
      reasoning: "Não foram identificados termos setoriais predominantes suficientes.",
      matchedKeywords: [],
    };
  }

  // Cálculo de confiança percentual
  const diff = second ? best.score - second.score : best.score;
  let confidence = Math.min(98, Math.max(50, 60 + Math.round(diff * 1.5)));

  if (best.score >= 45 && diff >= 20) {
    confidence = Math.min(99, 85 + Math.round(best.score / 5));
  }

  const isAmbiguous = confidence < 80;

  return {
    categoryCode: best.profile.code,
    vertical: best.profile.vertical,
    confidence,
    isAmbiguous,
    reasoning: `Identificados ${best.matches.length} termos de ${best.profile.vertical}: [${best.matches.slice(0, 4).join(", ")}].`,
    matchedKeywords: best.matches,
  };
}
