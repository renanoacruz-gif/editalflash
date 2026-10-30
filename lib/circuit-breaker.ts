/**
 * lib/circuit-breaker.ts
 * 
 * Circuit Breaker Leve Nativo para Cloudflare Edge Runtime / Workers.
 * - Protege o sistema contra cascatas de falhas em APIs externas (Pagou.ai, PNCP, Provedores IA).
 * - Estados: CLOSED (normal), OPEN (bloqueado por falhas), HALF_OPEN (testando recuperação).
 * - Zero dependências Node.js nativas.
 */

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Qtd de falhas consecutivas para abrir (padrão 5)
  recoveryTimeoutMs?: number; // Tempo com circuito aberto antes de tentar half-open (padrão 30s)
  requestTimeoutMs?: number; // Timeout da requisição individual (padrão 5s)
}

interface CircuitState {
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
  failureCount: number;
  lastFailureTime: number;
}

const circuitRegistry = new Map<string, CircuitState>();

export class CircuitBreaker {
  /**
   * Executa uma chamada com proteção de circuito e timeout controlado
   */
  static async execute<T>(
    serviceName: string,
    action: (signal: AbortSignal) => Promise<T>,
    fallbackAction?: () => Promise<T>,
    options: CircuitBreakerOptions = {}
  ): Promise<T> {
    const failureThreshold = options.failureThreshold || 5;
    const recoveryTimeoutMs = options.recoveryTimeoutMs || 30000;
    const requestTimeoutMs = options.requestTimeoutMs || 5000;

    let circuit = circuitRegistry.get(serviceName);
    if (!circuit) {
      circuit = { state: "CLOSED", failureCount: 0, lastFailureTime: 0 };
      circuitRegistry.set(serviceName, circuit);
    }

    const now = Date.now();

    // 1. Checa se o circuito deve transicionar de OPEN para HALF_OPEN
    if (circuit.state === "OPEN") {
      if (now - circuit.lastFailureTime > recoveryTimeoutMs) {
        circuit.state = "HALF_OPEN";
      } else {
        // Circuito ainda aberto: dispara fallback imediato ou erro
        if (fallbackAction) {
          return await fallbackAction();
        }
        throw new Error(`[CIRCUIT_BREAKER_OPEN] O serviço '${serviceName}' está temporariamente indisponível.`);
      }
    }

    // 2. Executa a ação protegida com AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

    try {
      const result = await action(controller.signal);
      clearTimeout(timeoutId);

      // Sucesso: fecha circuito se estiver half-open e reseta contagem
      if (circuit.state === "HALF_OPEN" || circuit.failureCount > 0) {
        circuit.state = "CLOSED";
        circuit.failureCount = 0;
      }
      return result;
    } catch (err: any) {
      clearTimeout(timeoutId);

      circuit.failureCount += 1;
      circuit.lastFailureTime = Date.now();

      if (circuit.failureCount >= failureThreshold || circuit.state === "HALF_OPEN") {
        circuit.state = "OPEN";
      }

      if (fallbackAction) {
        return await fallbackAction();
      }
      throw err;
    }
  }

  static getStatus(serviceName: string) {
    const circuit = circuitRegistry.get(serviceName);
    return circuit ? circuit.state : "CLOSED";
  }

  static reset(serviceName: string) {
    circuitRegistry.delete(serviceName);
  }
}
