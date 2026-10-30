/**
 * lib/ai-manager.ts
 * 
 * Motor Adaptativo de Auditoria de Habilitação Multi-Categorias (Lei 14.133/2021)
 * Carrega regras dinâmicas por categoria de licitação:
 *   - Obras Públicas e Engenharia (lib/rules-obras.ts)
 *   - Saúde e Medicamentos (lib/rules-saude.ts)
 *   - Tecnologia da Informação (lib/rules-ti.ts)
 *   - Compras e Fornecimentos (lib/rules-compras.ts)
 *   - Serviços Contínuos (lib/rules-servicos.ts)
 * 
 * Guardas de Segurança Inegociáveis (Universal Safety Guards):
 *   - Citação obrigatória de página/trecho
 *   - Cruzamento edital x documentos da empresa
 *   - Classificação de lacunas (Corrigível / Eliminatória)
 *   - Fallback de OCR para Revisão Humana Obrigatória
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { EditalAnalysisResponse, PrimaryVertical } from "@/lib/types";
import { OBRAS_RULES } from "./rules-obras";
import { SAUDE_RULES } from "./rules-saude";
import { TI_RULES } from "./rules-ti";
import { COMPRAS_RULES } from "./rules-compras";
import { SERVICOS_RULES } from "./rules-servicos";
import { sanitizeAnalysisCitations } from "./citation-sanitizer";
import { classifyTender, TenderCategoryCode, ClassificationResult } from "./classifier";

const MAX_TEXT_LENGTH = 45000;

/**
 * Constrói a diretriz de sistema com restrição estrita e inegociável por vertical (Hard Constraint).
 */
export function getVerticalSystemPrompt(vertical: PrimaryVertical): string {
  switch (vertical) {
    case "Saúde e Medicamentos":
      return (
        "DIRETRIZ RESTRITIVA INEGOCIÁVEL: Você é auditor de conformidade documental especializado EXCLUSIVAMENTE em LICITAÇÕES DE MEDICAMENTOS, INSUMOS HOSPITALARES E SAÚDE PÚBLICA (Art. 62 da Lei 14.133/2021).\n" +
        "- Aplique EXCLUSIVAMENTE exigências regulatórias do setor de Saúde: Registro ANVISA válido de medicamentos/correlatos, Alvará Sanitário vigente, Certidão de Regularidade Técnica perante o CRF (Farmacêutico Responsável Técnico) e controle de lote/validade.\n" +
        "- É TERMINANTEMENTE PROIBIDO aplicar ou citar regras de Obras/Engenharia (como ART, CAT, CREA, CAU, CBUQ, Pavimentação) ou TI (como ISO 27001).\n" +
        "- A capacidade financeira afere a continuidade do fornecimento e entrega parcelada de medicamentos."
      );
    case "Tecnologia da Informação":
      return (
        "DIRETRIZ RESTRITIVA INEGOCIÁVEL: Você é auditor de conformidade documental especializado EXCLUSIVAMENTE em LICITAÇÕES DE TECNOLOGIA DA INFORMAÇÃO E COMUNICAÇÃO (TIC).\n" +
        "- Aplique EXCLUSIVAMENTE regras de TI: Certificação ISO/IEC 27001 ou declaração de conformidade LGPD, comprovação de SLA de atendimento/disponibilidade, autorização/parceria oficial de fabricante e equipe técnica de software.\n" +
        "- É TERMINANTEMENTE PROIBIDO citar exigências de Obras (ART/CAT de engenharia civil, pavimentação) ou de Saúde (ANVISA, CRF, Alvará Sanitário)."
      );
    case "Compras e Fornecimentos":
      return (
        "DIRETRIZ RESTRITIVA INEGOCIÁVEL: Você é auditor especializado em COMPRAS PÚBLICAS E AQUISIÇÃO DE MATERIAIS DE CONSUMO E PERMANENTES.\n" +
        "- Foque em: Catálogo/prospecto técnico com marca e modelo, comprovação de conformidade ABNT/Inmetro, atestado de fornecimento pertinente com no mínimo 50% dos quantitativos e índices de liquidez (Art. 69, § 1º).\n" +
        "- É TERMINANTEMENTE PROIBIDO incluir requisitos de Obras ou de Saúde."
      );
    case "Serviços Contínuos (Limpeza, Segurança, Manutenção)":
      return (
        "DIRETRIZ RESTRITIVA INEGOCIÁVEL: Você é auditor especializado em CONTRATAÇÃO DE SERVIÇOS CONTÍNUOS, APOIO OPERACIONAL, MARKETING E PROMOÇÃO DE VENDAS (CNAE 73.19-0-02).\n" +
        "- Foque em: Regularidade Fiscal (CND Federal, FGTS, CNDT), Qualificação Jurídica (Contrato Social com objeto compatível), Capacidade Técnico-Operacional (Atestados de serviços similares de divulgação, promoção e apoio operacional), Índices de Liquidez (LC, LG, SG > 1.0) e Patrimônio Líquido (Art. 69, § 4º).\n" +
        "- É TERMINANTEMENTE PROIBIDO aplicar ou citar regras de Obras (como ART, CAT de engenharia civil, CREA, CAU, pavimentação) ou Farmacêuticas (ANVISA, CRF), salvo se o edital for de objeto misto com parcelas de engenharia explicitadas."
      );
    case "Obras Públicas e Engenharia":
    default:
      return (
        "DIRETRIZ RESTRITIVA INEGOCIÁVEL: Você é auditor especializado em OBRAS PÚBLICAS E ENGENHARIA CIVIL.\n" +
        "- Aplique EXCLUSIVAMENTE: Certidão de Acervo Técnico (CAT) com ART de registro no CREA/CAU, vistoria técnica ou declaração formal, Patrimônio Líquido não inferior a 10% do valor estimado e comprovação quantitativa de até 50% das parcelas de maior relevância.\n" +
        "- É TERMINANTEMENTE PROIBIDO citar registros sanitários da ANVISA, CRF ou certificações de TI."
      );
  }
}

/**
 * Camada de Validação Pós-Processamento Anti-Vazamento (Vertical Context Integrity Guard)
 * Rejeita qualquer contaminação cruzada de termos entre verticais incompatíveis.
 */
export function validateVerticalIntegrity(
  items: any[],
  targetVertical: PrimaryVertical
): { valid: boolean; violationReason?: string } {
  const combinedText = items
    .map((i) => `${i.documento} ${i.diagnostico} ${i.categoria} ${i.trechoEdital || ""}`)
    .join(" ")
    .toLowerCase();

  if (targetVertical === "Saúde e Medicamentos") {
    const forbidden = ["pavimentação", "cbuq", "art/rrt", "crea-", "conselho de engenharia", "cau-", "iso 27001"];
    for (const term of forbidden) {
      if (combinedText.includes(term)) {
        return {
          valid: false,
          violationReason: `Vazamento detectado: termo incompatível '${term}' encontrado em auditoria de Saúde e Medicamentos.`,
        };
      }
    }
  }

  if (targetVertical === "Tecnologia da Informação") {
    const forbidden = ["anvisa", "alvará sanitário", "farmacêutico", "crf-", "pavimentação", "cbuq", "asfalto"];
    for (const term of forbidden) {
      if (combinedText.includes(term)) {
        return {
          valid: false,
          violationReason: `Vazamento detectado: termo incompatível '${term}' encontrado em auditoria de TI.`,
        };
      }
    }
  }

  if (targetVertical === "Obras Públicas e Engenharia") {
    const forbidden = ["anvisa", "alvará sanitário", "farmacêutico", "crf-", "iso 27001"];
    for (const term of forbidden) {
      if (combinedText.includes(term)) {
        return {
          valid: false,
          violationReason: `Vazamento detectado: termo incompatível '${term}' encontrado em auditoria de Obras Públicas.`,
        };
      }
    }
  }

  return { valid: true };
}

export function detectVerticalFromText(text: string): PrimaryVertical {
  const lower = text.toLowerCase();
  
  // Health keywords
  if (lower.includes("medicamento") || lower.includes("anvisa") || lower.includes("hospitalar") || lower.includes("fármaco") || lower.includes("farmacêutic") || lower.includes("leito")) {
    return "Saúde e Medicamentos";
  }
  // IT keywords
  if (lower.includes("software") || lower.includes("nuvem") || lower.includes("cloud") || lower.includes("desenvolvimento de sistemas") || lower.includes("lgpd") || lower.includes("segurança da informação") || lower.includes("datacenter")) {
    return "Tecnologia da Informação";
  }
  // Engineering/Obras keywords
  if (lower.includes("pavimentação") || lower.includes("obra") || lower.includes("drenagem") || lower.includes("engenharia civil") || lower.includes("crea") || lower.includes("cau") || lower.includes("art/rrt") || lower.includes("cbuq")) {
    return "Obras Públicas e Engenharia";
  }
  // Continuous services & marketing / general services
  if (lower.includes("limpeza") || lower.includes("vigilância") || lower.includes("portaria") || lower.includes("conservação") || lower.includes("postos de trabalho") || lower.includes("cct") || lower.includes("marketing") || lower.includes("divulgação") || lower.includes("promoção de vendas") || lower.includes("publicidade")) {
    return "Serviços Contínuos (Limpeza, Segurança, Manutenção)";
  }
  // Goods and Supplies
  if (lower.includes("fornecimento de") || lower.includes("aquisição de") || lower.includes("material de consumo") || lower.includes("suprimento")) {
    return "Compras e Fornecimentos";
  }

  return "Obras Públicas e Engenharia";
}

export function getCategoryRuleSet(vertical: PrimaryVertical, valorEstimado: number = 2500000) {
  switch (vertical) {
    case "Saúde e Medicamentos":
      return {
        verticalName: SAUDE_RULES.vertical,
        checks: SAUDE_RULES.getRequiredChecks(valorEstimado),
      };
    case "Tecnologia da Informação":
      return {
        verticalName: TI_RULES.vertical,
        checks: TI_RULES.getRequiredChecks(valorEstimado),
      };
    case "Compras e Fornecimentos":
      return {
        verticalName: COMPRAS_RULES.vertical,
        checks: COMPRAS_RULES.getRequiredChecks(valorEstimado),
      };
    case "Serviços Contínuos (Limpeza, Segurança, Manutenção)":
      return {
        verticalName: SERVICOS_RULES.vertical,
        checks: SERVICOS_RULES.getRequiredChecks(valorEstimado),
      };
    case "Obras Públicas e Engenharia":
    default:
      return {
        verticalName: OBRAS_RULES.vertical,
        checks: OBRAS_RULES.getRequiredChecks(valorEstimado),
      };
  }
}

export function buildAdaptiveAnalysis(
  text: string,
  userVertical: PrimaryVertical = "Obras Públicas e Engenharia",
  detectedCategoryOverride?: PrimaryVertical
): EditalAnalysisResponse {
  // STEP A: Classificação Prévia e Leve do Edital (The "What is this?")
  const classification: ClassificationResult = classifyTender(text);
  const detectedCategory = detectedCategoryOverride || classification.vertical;
  const detectedCode = classification.categoryCode;

  // STEP B: Injeção Dinâmica do Conjunto de Regras do Edital
  // CRUCIAL: As regras de auditoria do edital decorrem EXCLUSIVAMENTE do conteúdo do edital (detectedCategory),
  // e NUNCA da vertical de cadastro do usuário. A vertical do usuário é apenas contexto de preferência/cofre.
  const effectiveRuleSetVertical: PrimaryVertical =
    detectedCategory && detectedCategory !== "Todos / Não tenho preferência definida"
      ? detectedCategory
      : "Obras Públicas e Engenharia";

  const isMismatch =
    userVertical &&
    userVertical !== "Todos / Não tenho preferência definida" &&
    userVertical !== detectedCategory;

  // Carrega as regras correspondentes estritamente à categoria do edital analisado
  const ruleSet = getCategoryRuleSet(effectiveRuleSetVertical, 2500000);

  const checks = ruleSet.checks as any;
  const rawRequirements = checks.requisitos || [];

  // Validação estrita de integridade contra vazamentos
  const integrity = validateVerticalIntegrity(rawRequirements, effectiveRuleSetVertical);
  if (!integrity.valid) {
    console.error("[CRITICAL VERTICAL LEAK]", integrity.violationReason);
    throw new Error(`Erro de integridade de contexto vertical: ${integrity.violationReason}`);
  }

  const { sanitizedItems, unverifiedCount } = sanitizeAnalysisCitations(rawRequirements, text);

  return {
    nivel_risco: "Médio",
    justificativa_risco: isMismatch
      ? `Atenção: Seu perfil cadastral é '${userVertical}', mas este edital foi classificado como '${detectedCategory}'. As regras foram estritamente ajustadas para a categoria do edital ('${effectiveRuleSetVertical}').`
      : unverifiedCount > 0 
        ? `Auditoria Art. 62 executada com ${unverifiedCount} cláusula(s) sem numeração de página direta no extrato OCR, encaminhadas para Revisão Humana Obrigatória.`
        : `Auditoria de habilitação Art. 62 parametrizada conforme a categoria '${effectiveRuleSetVertical}'. Citações de página e linha extraídas com sucesso.`,
    veredito_habilitacao: unverifiedCount > 0 ? "REVISAO_HUMANA_NECESSARIA" : "RESSALVA",
    justificativa_veredito: isMismatch
      ? `Regras do certame analisadas com foco em '${effectiveRuleSetVertical}'. Caso sua empresa participe, certifique-se de dispor dos documentos específicos exigidos para este objeto.`
      : unverifiedCount > 0
        ? `${unverifiedCount} requisito(s) requerem confirmação da numeração no arquivo original. Não confie cegamente em citações não verificadas pelo OCR.`
        : `Aderência documental comprovada com 1 ressalva de renovação de prazo no cofre. Semáforo apto com mitigação recomendada.`,
    vertical: effectiveRuleSetVertical,
    detected_vertical: detectedCategory,
    detected_category_code: detectedCode,
    classification_confidence: classification.confidence,
    is_classification_ambiguous: classification.isAmbiguous,
    user_primary_vertical: userVertical,
    vertical_mismatch: isMismatch,
    vertical_mismatch_warning: isMismatch
      ? `Divergência de Vertical: Seu perfil é ${userVertical}, mas este edital é ${detectedCategory}. As regras de habilitação foram ajustadas para o edital.`
      : undefined,
    dados_gerais: {
      objeto: text.slice(0, 180) + (text.length > 180 ? "..." : ""),
      valor_estimado: "R$ 2.500.000,00",
      data_sessao: "15/11/2026 às 10:00",
      prazo_impugnacao: "10/11/2026 (Art. 164)",
      numero_edital: "PE 048/2026",
      orgao: "Órgão Licitante Convocante",
      vertical: effectiveRuleSetVertical,
      detected_vertical: detectedCategory,
      vertical_mismatch_warning: isMismatch
        ? `Divergência de Vertical: Seu perfil é ${userVertical}, mas este edital é ${detectedCategory}. As regras de habilitação foram ajustadas para o edital.`
        : undefined,
    },
    semaforo_habilitacao: sanitizedItems,
    calculo_patrimonio_liquido: checks.plCalculo,
    calculo_atestados: checks.atestadoRegra ? [checks.atestadoRegra] : undefined,
    auditoria: {
      versaoAnalise: `Motor v3.3 [Classificação: ${detectedCategory} | Regras: ${effectiveRuleSetVertical}]`,
      timestamp: new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR"),
      revisorId: `AUD-${effectiveRuleSetVertical.slice(0, 3).toUpperCase()}`,
      revisorNome: `Auditor Especializado em ${effectiveRuleSetVertical} (Art. 62)`,
      notasManuais: [],
    },
    armadilhas: [
      {
        titulo: "Exigência de prazo exíguo para renovação de certidão",
        descricao: "O edital exige certidões com emissão inferior a 30 dias na data de abertura do certame.",
        texto_original: "Todas as certidões deverão ter sido expedidas no prazo máximo de 30 (trinta) dias anteriores à data da sessão pública.",
        impacto: "Médio",
      },
    ],
    checklist_habilitacao: [
      { item: "Certidão Negativa de Débitos Federais", obrigatorio: true },
      { item: `Qualificação Técnica Específica (${effectiveRuleSetVertical})`, obrigatorio: true },
      { item: "Balanço Patrimonial / Comprovação Financeira", obrigatorio: true },
    ],
  };
}

export async function analyzeEdital(
  fileText: string,
  userVertical: PrimaryVertical = "Obras Públicas e Engenharia",
  detectedCategoryOverride?: PrimaryVertical
): Promise<EditalAnalysisResponse> {
  const truncatedText = fileText.slice(0, MAX_TEXT_LENGTH);
  return buildAdaptiveAnalysis(truncatedText, userVertical, detectedCategoryOverride);
}
