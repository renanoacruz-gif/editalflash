/**
 * lib/sources/pncp.ts
 * 
 * Conector oficial da API do Portal Nacional de Contratações Públicas (PNCP).
 * Prioridade: 1st (Fonte Primária).
 * Rate limit: 10 requisições / minuto.
 */

import { ITenderSource, RawTenderItem, SourceType } from "./types";
import { CircuitBreakerManager } from "./circuit-breaker";

export class PNCPSource implements ITenderSource {
  sourceName: SourceType = "PNCP";
  priority = 1;
  rateLimitPerMinute = 10;
  private baseUrl = "https://pncp.gov.br/api/consulta/v1/editais";

  async isHealthy(): Promise<boolean> {
    return !CircuitBreakerManager.isCircuitOpen(this.sourceName);
  }

  async search(uf?: string, termo?: string): Promise<RawTenderItem[]> {
    if (CircuitBreakerManager.isCircuitOpen(this.sourceName)) {
      console.warn(`[PNCP] Conector temporariamente inativo por Circuit Breaker.`);
      return [];
    }

    const cacheKey = `pncp_${uf || "all"}_${termo || "all"}`;
    const cached = CircuitBreakerManager.getCached<RawTenderItem[]>(this.sourceName, cacheKey);
    if (cached) return cached;

    if (!CircuitBreakerManager.checkRateLimit(this.sourceName, this.rateLimitPerMinute)) {
      console.warn(`[PNCP] Rate limit excedido (10 req/min). Aguarde.`);
      return [];
    }

    const startTime = Date.now();
    const params = new URLSearchParams();
    if (uf) params.append("codigoUf", uf.toUpperCase());
    if (termo) params.append("objetoCompra", termo);

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(8000), // 8s timeout
      });

      if (!response.ok) {
        throw new Error(`PNCP HTTP Status ${response.status}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      CircuitBreakerManager.recordSuccess(this.sourceName, latency);

      if (!data || !Array.isArray(data.data)) {
        return [];
      }

      const results: RawTenderItem[] = data.data.map((edital: any) => ({
        id: edital.numeroControlePNCP || `pncp_${Math.random().toString(36).substring(2, 9)}`,
        source: "PNCP",
        sourcePriority: 1,
        orgao: edital.orgaoEntidade?.razaoSocial || "Órgão Licitante (PNCP)",
        cnpjOrgao: edital.orgaoEntidade?.cnpj,
        uf: uf ? uf.toUpperCase() : edital.unidadeOrgao?.ufSigla || "BR",
        municipio: edital.unidadeOrgao?.municipioNome || "Geral",
        objeto: edital.objetoCompra || "Objeto não informado",
        valorEstimado: typeof edital.valorTotalEstimado === "number" ? edital.valorTotalEstimado : null,
        dataAbertura: edital.dataAberturaProposta || new Date().toISOString(),
        linkOrigem: edital.linkSistemaOrigem || "https://pncp.gov.br",
        linkPdf: edital.linkProcessoEletronico || edital.linkSistemaOrigem || null,
        modalidade: edital.modalidadeNome || "Pregão Eletrônico",
        sourceMetadata: {
          anoCompra: edital.anoCompra,
          sequencialCompra: edital.sequencialCompra,
        },
      }));

      CircuitBreakerManager.setCached(this.sourceName, cacheKey, results);
      return results;
    } catch (err: any) {
      CircuitBreakerManager.recordFailure(this.sourceName);
      console.warn(`[PNCP] Falha na consulta: ${err?.message}`);
      return [];
    }
  }
}
