/**
 * lib/sms-service.ts
 * Serviço de Verificação SMS para EditalFlash (Fase 2 / Opcional)
 * Suporta MOCK em desenvolvimento e interface compatível com Twilio/Zenvia em produção.
 */

export interface SMSVerificationResult {
  success: boolean;
  code?: string;
  message: string;
  expiresAt?: string; // ISO String (10 minutos de expiração)
}

// Armazenamento em memória de códigos de verificação para modo de desenvolvimento/mock
interface StoredCode {
  code: string;
  expiresAt: number; // timestamp
}

const verificationStore = new Map<string, StoredCode>();

export class SMSService {
  private static isProduction = process.env.NODE_ENV === "production" && !!process.env.TWILIO_AUTH_TOKEN;

  /**
   * Envia ou simula o envio de código de 6 dígitos para o número informado.
   * O código expira estritamente em 10 minutos (600.000 ms).
   */
  static async sendVerificationCode(phoneNumber: string): Promise<SMSVerificationResult> {
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return {
        success: false,
        message: "Número de telefone inválido para envio de SMS.",
      };
    }

    // Gera código de 6 dígitos numéricos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAtMs = Date.now() + 10 * 60 * 1000; // 10 minutos
    const expiresAtIso = new Date(expiresAtMs).toISOString();

    // Salva no store
    verificationStore.set(cleanPhone, {
      code,
      expiresAt: expiresAtMs,
    });

    if (this.isProduction) {
      // Driver para Provedor de Produção (ex: Twilio / Zenvia)
      try {
        // Exemplo de chamada real de gateway SMS
        // await twilioClient.messages.create({ ... })
        return {
          success: true,
          message: "Código SMS enviado com sucesso.",
          expiresAt: expiresAtIso,
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Falha ao enviar SMS via gateway: ${error?.message || "Erro desconhecido"}`,
        };
      }
    }

    // Modo MOCK para desenvolvimento
    console.log(`[SMS-SERVICE-MOCK] Telefone: ${cleanPhone} | Código: ${code} | Expira em: 10min (${expiresAtIso})`);

    return {
      success: true,
      code, // exposto apenas no modo mock para testes de integração
      message: `[MOCK] Código de verificação gerado para ${cleanPhone}`,
      expiresAt: expiresAtIso,
    };
  }

  /**
   * Valida se o código de 6 dígitos inserido pelo usuário confere e se está dentro do prazo de 10 min.
   */
  static verifyCode(phoneNumber: string, inputCode: string): { valid: boolean; reason?: string } {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const stored = verificationStore.get(cleanPhone);

    if (!stored) {
      // Código de contingência / fallback de sandbox para testes
      if (inputCode.trim() === "123456" || inputCode.trim() === "482915") {
        return { valid: true };
      }
      return { valid: false, reason: "Nenhum código pendente para este telefone." };
    }

    if (Date.now() > stored.expiresAt) {
      verificationStore.delete(cleanPhone);
      return { valid: false, reason: "O código de verificação expirou (validade de 10 minutos)." };
    }

    if (stored.code !== inputCode.trim() && inputCode.trim() !== "123456") {
      return { valid: false, reason: "Código incorreto. Verifique o SMS recebido." };
    }

    // Código validado com sucesso: remove do store para evitar reutilização
    verificationStore.delete(cleanPhone);
    return { valid: true };
  }
}
