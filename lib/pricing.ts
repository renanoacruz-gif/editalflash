/**
 * lib/pricing.ts
 * 
 * Definições Oficiais de Preços e Limites Comerciais - EditalFlash v1.2
 * Alinhado com a Calculadora de Viabilidade e Margem de Contribuição do CFO.
 */

export const PRICING_CONFIG = {
  // Plano Starter (Análise Avulsa Pré-Paga)
  STARTER_PRICE_CENTS: 2900, // R$ 29,00
  STARTER_CREDITS: 1,
  STARTER_MAX_SEATS: 0, // Plano 100% individual

  // Plano Pro (Assinatura Recorrente Base)
  PRO_PRICE_CENTS: 19700, // R$ 197,00/mês
  PRO_CREDITS: 15, // 15 auditorias inclusas
  PRO_MAX_INCLUDED_SEATS: 1, // 1 usuário titular (Admin)

  // Seats Adicionais (Add-on para Plano Pro)
  ADDITIONAL_SEAT_PRICE_CENTS: 2900, // R$ 29,00/mês por assento extra
  CREDITS_PER_ADDITIONAL_SEAT: 5, // Cada assento extra adiciona +5 auditorias ao pool
  MAX_ADDITIONAL_SEATS: 5, // Trava de segurança: máximo 5 assentos extras por organização

  // Taxa de Setup / Implantação Assistida (Opcional)
  SETUP_FEE_CENTS: 49700, // R$ 497,00 (pagamento único)
} as const;
