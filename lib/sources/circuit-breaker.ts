/**
 * lib/sources/circuit-breaker.ts
 * 
 * Circuit Breaker e Rate Limiter adaptativo em memória por fonte externa.
 * - Cache de resultados por 15 minutos (900.000 ms).
 * - Rate Limiter (ex: 10 req/min no PNCP, 5 req/min nos demais).
 * - Circuit Breaker: 3 falhas consecutivas desativam a fonte por 1 hora (3.600.000 ms).
 * - Registro de métricas e chamadas de auditoria.
 */

import { SourceType } from "./types";

interface SourceState {
  failures: number;
  disabledUntil: number | null;
  requestTimestamps: number[];
  cache: Map<string, { data: any; expiresAt: number }>;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  latencyHistory: number[]; // últimas 20 chamadas em ms
}

const sourceStates = new Map<SourceType, SourceState>();

function getOrCreateState(source: SourceType): SourceState {
  let state = sourceStates.get(source);
  if (!state) {
    state = {
      failures: 0,
      disabledUntil: null,
      requestTimestamps: [],
      cache: new Map(),
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      latencyHistory: [],
    };
    sourceStates.set(source, state);
  }
  return state;
}

export class CircuitBreakerManager {
  private static readonly CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos
  private static readonly CIRCUIT_TIMEOUT_MS = 60 * 60 * 1000; // 1 hora de desativação após 3 falhas
  private static readonly MAX_FAILURES = 3;

  /**
   * Verifica se o circuito está aberto (bloqueado por falhas)
   */
  static isCircuitOpen(source: SourceType): boolean {
    const state = getOrCreateState(source);
    if (!state.disabledUntil) return false;

    if (Date.now() > state.disabledUntil) {
      // Período de desativação expirou, volta a aceitar requisições de teste (Half-Open)
      state.disabledUntil = null;
      state.failures = 0;
      return false;
    }
    return true;
  }

  /**
   * Verifica e aplica o rate limit (janela deslizante de 60 segundos)
   */
  static checkRateLimit(source: SourceType, limitPerMinute: number): boolean {
    const state = getOrCreateState(source);
    const now = Date.now();
    // Limpa requisições com mais de 60 segundos
    state.requestTimestamps = state.requestTimestamps.filter((t) => now - t < 60000);

    if (state.requestTimestamps.length >= limitPerMinute) {
      return false; // Excedeu rate limit
    }

    state.requestTimestamps.push(now);
    return true;
  }

  /**
   * Busca resposta em cache (chave: UF + Termo)
   */
  static getCached<T>(source: SourceType, key: string): T | null {
    const state = getOrCreateState(source);
    const cached = state.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      state.cache.delete(key);
      return null;
    }
    return cached.data as T;
  }

  /**
   * Armazena resposta em cache
   */
  static setCached<T>(source: SourceType, key: string, data: T): void {
    const state = getOrCreateState(source);
    state.cache.set(key, {
      data,
      expiresAt: Date.now() + this.CACHE_TTL_MS,
    });
  }

  /**
   * Registra chamada bem-sucedida
   */
  static recordSuccess(source: SourceType, latencyMs: number): void {
    const state = getOrCreateState(source);
    state.failures = 0;
    state.disabledUntil = null;
    state.totalCalls++;
    state.successfulCalls++;
    state.latencyHistory.push(latencyMs);
    if (state.latencyHistory.length > 20) state.latencyHistory.shift();
  }

  /**
   * Registra falha de requisição e abre circuito se atingir 3 falhas
   */
  static recordFailure(source: SourceType): void {
    const state = getOrCreateState(source);
    state.failures++;
    state.totalCalls++;
    state.failedCalls++;

    if (state.failures >= this.MAX_FAILURES) {
      state.disabledUntil = Date.now() + this.CIRCUIT_TIMEOUT_MS;
      console.warn(`[CIRCUIT-BREAKER] Fonte ${source} desativada por 1 hora após ${this.MAX_FAILURES} falhas.`);
    }
  }

  /**
   * Obtém métricas consolidada de saúde de todas as fontes
   */
  static getHealthSummary() {
    const sources: SourceType[] = [
      "PNCP",
      "ComprasGov",
      "BECSP",
      "LicitacoesE",
      "PortalTransparencia",
      "DOU",
    ];

    return sources.map((source) => {
      const state = getOrCreateState(source);
      const isDown = Boolean(state.disabledUntil && Date.now() < state.disabledUntil);
      const avgLatency =
        state.latencyHistory.length > 0
          ? Math.round(
              state.latencyHistory.reduce((acc, curr) => acc + curr, 0) /
                state.latencyHistory.length
            )
          : 0;

      let status: "green" | "yellow" | "red" = "green";
      if (isDown) {
        status = "red";
      } else if (state.failures > 0) {
        status = "yellow";
      }

      return {
        source,
        status,
        failures: state.failures,
        isCircuitOpen: isDown,
        disabledUntil: state.disabledUntil,
        totalCalls: state.totalCalls,
        successfulCalls: state.successfulCalls,
        failedCalls: state.failedCalls,
        avgLatencyMs: avgLatency,
      };
    });
  }
}
