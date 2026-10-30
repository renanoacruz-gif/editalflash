import { z } from "zod";

/**
 * lib/validations.ts
 * 
 * Esquemas de validação estrita com Zod para proteção de payloads e sanitização contra Prompt Injection.
 */

// Limpeza de caracteres potencialmente perigosos para injeção de prompt
function sanitizeString(val: string): string {
  return val
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "") // Remove caracteres de controle
    .trim();
}

export const PrimaryVerticalEnum = z.enum([
  "Obras Públicas e Engenharia",
  "Compras e Fornecimentos",
  "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
  "Saúde e Medicamentos",
  "Tecnologia da Informação",
  "Todos / Não tenho preferência definida",
]);

export const AnalyzeRequestSchema = z.object({
  text: z
    .string()
    .min(10, { message: "Texto do edital muito curto para análise." })
    .max(100000, { message: "Texto excede o limite máximo permitido de 100.000 caracteres." })
    .transform(sanitizeString),
  vertical: PrimaryVerticalEnum.optional().default("Obras Públicas e Engenharia"),
  companyName: z
    .string()
    .max(120, { message: "Nome da empresa excede 120 caracteres." })
    .optional()
    .transform((val) => (val ? sanitizeString(val) : undefined)),
});

export const PNCPSearchSchema = z.object({
  termo: z
    .string()
    .max(100, { message: "Termo de busca excede 100 caracteres." })
    .optional()
    .default("")
    .transform(sanitizeString),
  uf: z
    .string()
    .max(2, { message: "UF deve conter até 2 letras." })
    .toUpperCase()
    .optional()
    .default(""),
  modalidade: z.string().max(30).optional().default(""),
});

export const AdminAuthSchema = z.object({
  email: z.string().email({ message: "Formato de e-mail inválido." }).max(120),
  password: z.string().min(1, { message: "Senha obrigatória." }).max(100),
});

/**
 * Sanitiza nomes de arquivos para prevenir ataques de Path Traversal
 */
export function sanitizeFilename(filename: string): string {
  // Remove caminhos relativos e caracteres perigosos
  return filename
    .replace(/^.*[\\/]/, "") // Pega apenas o basename
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Substitui espaços ou caracteres especiais por _
    .replace(/\.+/g, "."); // Previne múltiplos pontos consecutivos (ex: ..)
}

/**
 * Validação rigorosa de arquivo PDF
 * Verifica: extensão, tamanho máximo (15MB) e assinatura mágica (%PDF)
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
}

export function validateUploadedPdf(
  buffer: Buffer | ArrayBuffer,
  filename: string,
  declaredMimeType?: string
): FileValidationResult {
  const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
  const sanitizedName = sanitizeFilename(filename);

  // 1. Verificação de extensão
  if (!sanitizedName.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Arquivo rejeitado: Apenas arquivos com extensão .pdf são aceitos." };
  }

  // 2. Verificação de tamanho
  const byteLength = buffer instanceof ArrayBuffer ? buffer.byteLength : buffer.length;
  if (byteLength === 0) {
    return { valid: false, error: "Arquivo vazio. Envie um PDF válido com conteúdo." };
  }
  if (byteLength > MAX_SIZE_BYTES) {
    return { valid: false, error: "Arquivo excede o limite estrito de 15MB para auditoria." };
  }

  // 3. Verificação de MIME type declarado
  if (declaredMimeType && declaredMimeType !== "application/pdf" && declaredMimeType !== "application/x-pdf") {
    return { valid: false, error: "MIME type inválido. O arquivo não é um documento PDF autêntico." };
  }

  // 4. Verificação de Magic Number (Assinatura Binária %PDF = 0x25 0x50 0x44 0x46)
  const bytes = new Uint8Array(buffer instanceof ArrayBuffer ? buffer : buffer.buffer);
  if (bytes.length < 4) {
    return { valid: false, error: "Arquivo corrompido ou incompleto." };
  }

  const isPdfMagic =
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46;   // F

  if (!isPdfMagic) {
    return { valid: false, error: "Assinatura mágica inválida. O arquivo não é um binário PDF autêntico." };
  }

  return { valid: true, sanitizedName };
}
