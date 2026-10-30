/**
 * lib/cost-structure.ts
 * 
 * Estrutura Interna de Custos do EditalFlash (Configuração Confidencial).
 * Valores rigorosamente alinhados com a Calculadora de Viabilidade Externa.
 * NUNCA deve ser exposto a usuários finais.
 * 
 * Cálculos em centavos de Real (integer cents) para eliminar erros de ponto flutuante.
 */

export interface InternalCostStructure {
  // Custos Fixos Mensais Ano 1 (em centavos de R$): R$ 788,32 = 78832 centavos
  // - Cloudflare Max: R$ 500,00 (50000)
  // - AI Subscriptions: R$ 240,00 (24000)
  // - Antigravity Promo: R$ 23,99 (2399)
  // - Domínio: R$ 3,33 (333)
  // - Supabase: R$ 25,00 (2500)
  fixedMonthlyOverheadYear1Cents: number;

  // Custos Fixos Mensais Ano 5+ (em centavos de R$): R$ 829,32 = 82932 centavos
  // - Antigravity salta para R$ 64,99 (+R$ 41,00 / +4100 centavos)
  fixedMonthlyOverheadYear5Cents: number;

  // Custo Variável por Auditoria de Edital (tokens + OCR): R$ 1,80 = 180 centavos
  variableCostPerAnalysisCents: number;

  // Taxa de Gateway de Pagamento (Asaas/Stripe): 3,5% + R$ 0,70 fixo
  paymentGatewayPercentage: number; // 0.035
  paymentGatewayFixedCents: number; // 70

  // Margem Bruta Mínima Desejada no Plano Pro: 40% (0.40)
  minViableGrossMarginPro: number;

  // Pisos Mínimos de Precificação (Preço de Venda Mínimo Viável)
  floors: {
    // Starter (por crédito avulso): R$ 29,00
    // Cobre R$ 1,80 variável + R$ 1,72 Asaas + R$ 5,00 contribuição fixa = margem saudável
    starterCreditFloorCents: number;

    // Plano Pro Mensal: R$ 197,00
    // Cobre média de 10 auditorias (R$ 18,00) + R$ 7,60 Asaas + 15% alocação de overhead fixo + churn buffer
    proPlanFloorCents: number;

    // Taxa de Setup / Implantação Assistida (Injeção de Caixa): R$ 497,00
    setupFeeFloorCents: number;

    // Desconto máximo sem flag de aprovação do administrador: 20%
    maxDiscountWithoutApprovalPercent: number;
  };

  // Metadados de sincronização com a Calculadora de Viabilidade Cloud
  syncMetadata: {
    lastSyncTimestamp: string;
    version: string;
    source: "external-cloud-viability-calculator" | "local-fallback";
    isStale: boolean;
  };
}

export const INITIAL_COST_STRUCTURE: InternalCostStructure = {
  fixedMonthlyOverheadYear1Cents: 78832, // R$ 788,32
  fixedMonthlyOverheadYear5Cents: 82932, // R$ 829,32
  variableCostPerAnalysisCents: 180, // R$ 1,80
  paymentGatewayPercentage: 0.035, // 3,5%
  paymentGatewayFixedCents: 70, // R$ 0,70
  minViableGrossMarginPro: 0.40, // 40%
  floors: {
    starterCreditFloorCents: 2900, // R$ 29,00
    proPlanFloorCents: 19700, // R$ 197,00
    setupFeeFloorCents: 49700, // R$ 497,00
    maxDiscountWithoutApprovalPercent: 20,
  },
  syncMetadata: {
    lastSyncTimestamp: "2026-10-28T12:00:00.000Z",
    version: "2026.10.v1",
    source: "external-cloud-viability-calculator",
    isStale: false,
  },
};

const STORAGE_COST_KEY = "editalflash_internal_cost_structure";

export function getInternalCostStructure(): InternalCostStructure {
  if (typeof window === "undefined") {
    return INITIAL_COST_STRUCTURE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_COST_KEY);
    if (!raw) return INITIAL_COST_STRUCTURE;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return INITIAL_COST_STRUCTURE;
  }
}

export function saveInternalCostStructure(data: Partial<InternalCostStructure>): InternalCostStructure {
  const current = getInternalCostStructure();
  const updated: InternalCostStructure = {
    ...current,
    ...data,
    syncMetadata: {
      ...current.syncMetadata,
      ...(data.syncMetadata || {}),
      lastSyncTimestamp: new Date().toISOString(),
    },
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_COST_KEY, JSON.stringify(updated));
    } catch (_) {}
  }

  return updated;
}
