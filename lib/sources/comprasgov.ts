/**
 * lib/sources/comprasgov.ts
 * 
 * Conector Compras.gov.br (Sistema Federal - Dados Abertos).
 * Prioridade: 2nd.
 * Rate limit: 5 requisições / minuto.
 */

import { ITenderSource, RawTenderItem, SourceType } from "./types";
import { CircuitBreakerManager } from "./circuit-breaker";

export class ComprasGovSource implements ITenderSource {
  sourceName: SourceType = "ComprasGov";
  priority = 2;
  rateLimitPerMinute = 5;
  private baseUrl = "https://compras.dados.gov.br/licitacoes/v1/licitacoes.json";

  async isHealthy(): Promise<boolean> {
    return !CircuitBreakerManager.isCircuitOpen(this.sourceName);
  }

  async search(uf?: string, termo?: string): Promise<RawTenderItem[]> {
    if (CircuitBreakerManager.isCircuitOpen(this.sourceName)) {
      return [];
    }

    const cacheKey = `comprasgov_${uf || "all"}_${termo || "all"}`;
    const cached = CircuitBreakerManager.getCached<RawTenderItem[]>(this.sourceName, cacheKey);
    if (cached) return cached;

    if (!CircuitBreakerManager.checkRateLimit(this.sourceName, this.rateLimitPerMinute)) {
      return [];
    }

    const startTime = Date.now();
    const params = new URLSearchParams();
    if (uf) params.append("uf", uf.toUpperCase());
    if (termo) params.append("objeto", termo);

    try {
      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        throw new Error(`Compras.gov.br Status ${response.status}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      CircuitBreakerManager.recordSuccess(this.sourceName, latency);

      const items = data._embedded?.licitacoes || [];
      const results: RawTenderItem[] = items.map((item: any) => ({
        id: `comprasgov_${item.numero_aviso || item.uasg || Math.random().toString(36).substring(2, 9)}`,
        source: "ComprasGov",
        sourcePriority: 2,
        orgao: item.orgao_nome || item.uasg_nome || "Ministério / Autarquia Federal",
        cnpjOrgao: item.cnpj_orgao,
        uf: uf || item.uf || "DF",
        municipio: item.municipio_nome || "Brasília",
        objeto: item.objeto || "Fornecimento de bens ou prestação de serviços federais.",
        valorEstimado: typeof item.valor_estimado === "number" ? item.valor_estimado : null,
        dataAbertura: item.data_abertura_proposta || new Date().toISOString(),
        linkOrigem: `https://www.gov.br/compras/pt-br/acesso-a-informacao/licitacoes`,
        linkPdf: item.link_edital || `https://compras.gov.br/edital/${item.numero_aviso}.pdf`,
        modalidade: item.modalidade_nome || "Pregão Federal (Lei 14.133)",
        sourceMetadata: item,
      }));

      CircuitBreakerManager.setCached(this.sourceName, cacheKey, results);
      return results;
    } catch (err: any) {
      CircuitBreakerManager.recordFailure(this.sourceName);
      return [];
    }
  }
}
