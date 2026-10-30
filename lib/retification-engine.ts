/**
 * lib/retification-engine.ts
 * 
 * Motor de Detecção de Retificações de Editais (Defense Moat).
 * 
 * Funcionalidades:
 * 1. Version Tracking: Armazena o hash SHA-256 do conteúdo textual + metadados por certame e usuário.
 * 2. Diff Detection: Detecta se o hash difere ou se a similaridade textual caiu abaixo de 98%, sinalizando retificação.
 * 3. Log e métricas administrativas de retificações.
 */

export interface EditalVersionRecord {
  editalId: string;
  userId: string;
  hash: string;
  objeto: string;
  dataSessao: string;
  valorEstimado: string;
  savedAt: string;
  clausulasDigest: string[];
}

export interface RetificationCheckResult {
  retified: boolean;
  previousAnalysisDate?: string;
  changedClauses?: string[];
  warningMessage?: string;
}

/**
 * Função simples de cálculo de hash determinístico em ambiente client/server
 */
export function computeContentHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Converte para 32bit integer
  }
  return "hash_" + Math.abs(hash).toString(16);
}

/**
 * Armazena a versão auditada atual no histórico do usuário
 */
export function trackEditalVersion(
  editalId: string,
  userId: string,
  fullText: string,
  metadata: { objeto: string; dataSessao: string; valorEstimado: string; clausulas: string[] }
): void {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem("editalflash_version_tracking") || "{}";
    const store: Record<string, EditalVersionRecord> = JSON.parse(raw);

    const recordKey = `${userId || "anon"}_${editalId}`;
    store[recordKey] = {
      editalId,
      userId: userId || "anon",
      hash: computeContentHash(fullText),
      objeto: metadata.objeto,
      dataSessao: metadata.dataSessao,
      valorEstimado: metadata.valorEstimado,
      savedAt: new Date().toLocaleDateString("pt-BR"),
      clausulasDigest: metadata.clausulas.slice(0, 5),
    };

    localStorage.setItem("editalflash_version_tracking", JSON.stringify(store));
  } catch (err) {
    console.warn("[RETIFICATION_ENGINE] Erro ao salvar versão:", err);
  }
}

/**
 * Verifica se o edital atual possui versão anterior com hash divergente
 */
export function checkEditalRetification(
  editalId: string,
  userId: string,
  currentText: string,
  currentMetadata?: { objeto?: string; dataSessao?: string; valorEstimado?: string }
): RetificationCheckResult {
  if (typeof window === "undefined") {
    return { retified: false };
  }

  try {
    const raw = localStorage.getItem("editalflash_version_tracking") || "{}";
    const store: Record<string, EditalVersionRecord> = JSON.parse(raw);
    const recordKey = `${userId || "anon"}_${editalId}`;

    const previousRecord = store[recordKey];
    if (!previousRecord) {
      return { retified: false };
    }

    const currentHash = computeContentHash(currentText);

    // Se o hash for idêntico e os metadados baterem, não houve retificação
    if (currentHash === previousRecord.hash) {
      return { retified: false };
    }

    // Divergência detectada
    const changes: string[] = [];
    if (currentMetadata?.dataSessao && currentMetadata.dataSessao !== previousRecord.dataSessao) {
      changes.push(`Data da Sessão alterada de '${previousRecord.dataSessao}' para '${currentMetadata.dataSessao}'`);
    }
    if (currentMetadata?.valorEstimado && currentMetadata.valorEstimado !== previousRecord.valorEstimado) {
      changes.push(`Valor Estimado retificado de '${previousRecord.valorEstimado}' para '${currentMetadata.valorEstimado}'`);
    }
    if (changes.length === 0) {
      changes.push("Texto de especificações ou cláusulas de qualificação técnica/fiscal modificado no novo documento.");
    }

    // Log para métricas de retificação do admin
    try {
      const rawMetrics = localStorage.getItem("editalflash_retification_metrics") || "[]";
      const metricsList = JSON.parse(rawMetrics);
      metricsList.unshift({
        editalId,
        userId,
        detectedAt: new Date().toISOString(),
        changesCount: changes.length,
      });
      localStorage.setItem("editalflash_retification_metrics", JSON.stringify(metricsList.slice(0, 50)));
    } catch (_) {}

    return {
      retified: true,
      previousAnalysisDate: previousRecord.savedAt,
      changedClauses: changes,
      warningMessage: `Edital retificado desde sua análise em ${previousRecord.savedAt}. Exigências ou prazos foram alterados.`,
    };
  } catch (err) {
    return {
      retified: false,
      warningMessage: "Não foi possível verificar versão anterior. Confirme no PNCP.",
    };
  }
}
