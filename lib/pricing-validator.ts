/**
 * lib/pricing-validator.ts
 * 
 * Validador Preditivo de Precificação e Economia Unitária (Unit Economics).
 * Impede que a plataforma venda planos ou créditos abaixo dos custos reais.
 * Realiza cálculos estritamente em centavos inteiros (integer cents).
 */

import { getInternalCostStructure, InternalCostStructure } from "./cost-structure";

export interface PlanValidationResult {
  allowed: boolean;
  proposedPriceCents: number;
  floorPriceCents: number;
  grossMarginPercent: number;
  requiresAdminApproval: boolean;
  violationReason?: string;
  unitEconomics: {
    gatewayFeeCents: number;
    estimatedVariableCostCents: number;
    netRevenueCents: number;
    contributionMarginCents: number;
  };
}

export interface BreakEvenMetrics {
  totalFixedCostsYear1Cents: number;
  totalFixedCostsYear5Cents: number;
  currentMrrCents: number;
  costCoveragePercent: number; // Ex: 125 (%)
  activeProUsersCount: number;
  breakEvenProUsersYear1: number;
  breakEvenProUsersYear5: number;
  avgProContributionPerUserCents: number;
  isStaleData: boolean;
  daysSinceLastSync: number;
  antigravityMonthsRemaining: number; // Meses até Outubro de 2030 (salto de R$ 41,00)
  extraUsersNeededYear5: number;
}

/**
 * Calcula a taxa de gateway do Asaas (3,5% + R$ 0,70) em centavos
 */
export function calculateGatewayFeeCents(priceCents: number, costs: InternalCostStructure): number {
  return Math.round(priceCents * costs.paymentGatewayPercentage) + costs.paymentGatewayFixedCents;
}

/**
 * Valida se um preço proposto para o plano Pro atende à margem e ao piso
 */
export function validateProPlanPrice(
  proposedPriceCents: number,
  discountPercent: number = 0,
  estimatedMonthlyAnalyses: number = 10
): PlanValidationResult {
  const costs = getInternalCostStructure();
  const floor = costs.floors.proPlanFloorCents;
  
  const gatewayFeeCents = calculateGatewayFeeCents(proposedPriceCents, costs);
  const estimatedVariableCostCents = estimatedMonthlyAnalyses * costs.variableCostPerAnalysisCents;
  const netRevenueCents = proposedPriceCents - gatewayFeeCents;
  const contributionMarginCents = netRevenueCents - estimatedVariableCostCents;
  const grossMarginPercent = proposedPriceCents > 0 
    ? Math.round((contributionMarginCents / proposedPriceCents) * 100)
    : 0;

  const requiresApproval = discountPercent > costs.floors.maxDiscountWithoutApprovalPercent;

  if (proposedPriceCents < floor) {
    return {
      allowed: false,
      proposedPriceCents,
      floorPriceCents: floor,
      grossMarginPercent,
      requiresAdminApproval: true,
      violationReason: `Preço proposto (R$ ${(proposedPriceCents / 100).toFixed(2)}) está abaixo do piso sustentável de R$ ${(floor / 100).toFixed(2)}.`,
      unitEconomics: {
        gatewayFeeCents,
        estimatedVariableCostCents,
        netRevenueCents,
        contributionMarginCents,
      },
    };
  }

  return {
    allowed: true,
    proposedPriceCents,
    floorPriceCents: floor,
    grossMarginPercent,
    requiresAdminApproval: requiresApproval,
    unitEconomics: {
      gatewayFeeCents,
      estimatedVariableCostCents,
      netRevenueCents,
      contributionMarginCents,
    },
  };
}

/**
 * Calcula as métricas preditivas de Break-Even baseadas na Calculadora de Viabilidade
 */
export function calculateBreakEvenMetrics(
  currentMrrCents: number,
  activeProUsersCount: number,
  referenceDate?: Date
): BreakEvenMetrics {
  const costs = getInternalCostStructure();
  const fixedY1 = costs.fixedMonthlyOverheadYear1Cents;
  const fixedY5 = costs.fixedMonthlyOverheadYear5Cents;

  // Preço base do plano Pro: R$ 297,00 (29700 centavos)
  const proPriceCents = 29700;
  const gatewayFeeCents = calculateGatewayFeeCents(proPriceCents, costs); // R$ 11,10
  const variablePerUserCents = 10 * costs.variableCostPerAnalysisCents; // 10 análises = R$ 18,00
  // Margem de contribuição líquida por cliente Pro ativo: ~R$ 267,90
  const avgContributionPerUserCents = Math.max(1, proPriceCents - gatewayFeeCents - variablePerUserCents);

  // Clientes Pro necessários para zerar as contas fixas
  const breakEvenProUsersYear1 = Math.ceil(fixedY1 / avgContributionPerUserCents); // 78832 / 26790 = ~3 clientes Pro
  const breakEvenProUsersYear5 = Math.ceil(fixedY5 / avgContributionPerUserCents); // 82932 / 26790 = ~4 clientes Pro
  const extraUsersNeededYear5 = Math.max(0, breakEvenProUsersYear5 - breakEvenProUsersYear1);

  // Cobertura de Custo Fixo
  const costCoveragePercent = fixedY1 > 0 ? Math.round((currentMrrCents / fixedY1) * 100) : 0;

  // Verificação de desatualização de dados (se > 30 dias)
  const syncDate = new Date(costs.syncMetadata.lastSyncTimestamp);
  // Usa fallback determinístico durante prerender se timestamp não for fornecido
  const now = referenceDate || new Date("2026-10-28T00:00:00Z");
  const diffDays = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 3600 * 24));
  const isStaleData = diffDays > 30 || costs.syncMetadata.isStale;

  // Meses restantes até Outubro de 2030 (Salto do Antigravity)
  const targetOct2030 = new Date("2030-10-01T00:00:00Z");
  const antigravityMonthsRemaining = Math.max(
    0,
    (targetOct2030.getFullYear() - now.getFullYear()) * 12 +
      (targetOct2030.getMonth() - now.getMonth())
  );

  return {
    totalFixedCostsYear1Cents: fixedY1,
    totalFixedCostsYear5Cents: fixedY5,
    currentMrrCents,
    costCoveragePercent,
    activeProUsersCount,
    breakEvenProUsersYear1,
    breakEvenProUsersYear5,
    avgProContributionPerUserCents: avgContributionPerUserCents,
    isStaleData,
    daysSinceLastSync: diffDays,
    antigravityMonthsRemaining,
    extraUsersNeededYear5,
  };
}
