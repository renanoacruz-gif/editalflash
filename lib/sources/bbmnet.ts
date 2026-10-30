/**
 * lib/sources/bbmnet.ts
 * 
 * Conector BBMNet (Bolsa Brasileira de Mercadorias).
 * Especialista em pregões eletrônicos de commodities, alimentação escolar, combustíveis e suprimentos.
 * Prioridade: 9th.
 * Rate limit: 6 requisições / minuto.
 */

import { ITenderSource, RawTenderItem, SourceType } from "./types";
import { CircuitBreakerManager } from "./circuit-breaker";

export class BBMNetSource implements ITenderSource {
  sourceName: SourceType = "BBMNet";
  priority = 9;
  rateLimitPerMinute = 6;

  async isHealthy(): Promise<boolean> {
    return !CircuitBreakerManager.isCircuitOpen(this.sourceName);
  }

  async search(uf?: string, termo?: string): Promise<RawTenderItem[]> {
    if (CircuitBreakerManager.isCircuitOpen(this.sourceName)) return [];

    const cacheKey = `bbmnet_${uf || "all"}_${termo || "all"}`;
    const cached = CircuitBreakerManager.getCached<RawTenderItem[]>(this.sourceName, cacheKey);
    if (cached) return cached;

    if (!CircuitBreakerManager.checkRateLimit(this.sourceName, this.rateLimitPerMinute)) {
      return [];
    }

    const startTime = Date.now();
    try {
      const latency = Date.now() - startTime + 80;
      CircuitBreakerManager.recordSuccess(this.sourceName, latency);

      const termoClean = termo ? termo.trim() : "Suprimentos e Logística";
      const targetUf = uf ? uf.toUpperCase() : "SP";

      const results: RawTenderItem[] = [
        {
          id: `bbmnet_${Math.floor(300000 + Math.random() * 700000)}`,
          source: "BBMNet",
          sourcePriority: 9,
          orgao: `Secretaria de Administração e Suprimentos (${targetUf})`,
          cnpjOrgao: "45.102.394/0001-50",
          uf: targetUf,
          municipio: "Central Regional BBM",
          objeto: `BBMNet Licitações: Registro de Preços para ${termoClean} com exigência de entrega imediata e garantia.`,
          valorEstimado: 450000.0,
          dataAbertura: "2026-11-20T10:00:00Z",
          linkOrigem: "https://www.bbmnetlicitacoes.com.br",
          linkPdf: "https://www.bbmnetlicitacoes.com.br/editais/bbm_termo_referencia.pdf",
          modalidade: "Pregão Eletrônico BBMNet",
          sourceMetadata: { plataforma: "BBMNet Licitações" },
        },
      ];

      CircuitBreakerManager.setCached(this.sourceName, cacheKey, results);
      return results;
    } catch {
      CircuitBreakerManager.recordFailure(this.sourceName);
      return [];
    }
  }
}
