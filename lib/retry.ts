/**
 * lib/retry.ts
 * 
 * Algoritmo de Retry com Backoff Exponencial e Jitter Aleatório para Edge Runtime.
 * Delays padrão: 1s, 2s, 4s, 8s, 16s (max 5 tentativas).
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  maxDelayMs?: number;
}

export async function withExponentialBackoff<T>(
  action: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts || 5;
  const initialDelay = options.initialDelayMs || 1000;
  const factor = options.backoffFactor || 2;
  const maxDelay = options.maxDelayMs || 16000;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action(attempt);
    } catch (err: any) {
      lastError = err;
      if (attempt === maxAttempts) break;

      // Cálculo exponencial: delay = min(maxDelay, initialDelay * (factor ^ (attempt - 1))) + jitter
      const exponential = initialDelay * Math.pow(factor, attempt - 1);
      const jitter = Math.random() * 200; // Jitter de 0 a 200ms para evitar thundering herd
      const sleepTime = Math.min(maxDelay, exponential) + jitter;

      await new Promise((resolve) => setTimeout(resolve, sleepTime));
    }
  }

  throw lastError;
}
