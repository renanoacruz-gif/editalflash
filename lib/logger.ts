/**
 * lib/logger.ts
 * 
 * Logging Estruturado em JSON para Edge Runtime e Cloudflare Logpush.
 * Mascara PII sensível (CNPJs, CPFs, E-mails) em conformidade com LGPD Art. 6º.
 */

export interface LogContext {
  userId?: string;
  route?: string;
  durationMs?: number;
  errorCode?: string;
  [key: string]: any;
}

export class Logger {
  private static maskPII(text: string): string {
    if (!text || typeof text !== "string") return text;
    // Mascara CNPJ / CPF
    let masked = text.replace(/(\d{2,3})\d{3,6}(\d{2})/, "$1.***.***-$2");
    // Mascara E-mail
    masked = masked.replace(/(.{2})(.*)(@.*)/, "$1***$3");
    return masked;
  }

  private static formatEntry(level: "INFO" | "WARN" | "ERROR", message: string, ctx: LogContext = {}) {
    const requestId = ctx.requestId || crypto.randomUUID();
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      requestId,
      message: this.maskPII(message),
      route: ctx.route || "edge_handler",
      durationMs: ctx.durationMs,
      errorCode: ctx.errorCode,
      userId: ctx.userId ? this.maskPII(ctx.userId) : undefined,
    };
    return JSON.stringify(entry);
  }

  static info(message: string, ctx?: LogContext) {
    console.log(this.formatEntry("INFO", message, ctx));
  }

  static warn(message: string, ctx?: LogContext) {
    console.warn(this.formatEntry("WARN", message, ctx));
  }

  static error(message: string, ctx?: LogContext) {
    console.error(this.formatEntry("ERROR", message, ctx));
  }
}
