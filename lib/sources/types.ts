/**
 * lib/sources/types.ts
 * 
 * Contrato de tipos para o Agregador Multi-Fontes de Editais Públicos.
 * Padrão Adapter para portais oficiais brasileiros com feeds de dados abertos.
 */

export type SourceType =
  | "PNCP"
  | "ComprasGov"
  | "BECSP"
  | "LicitacoesE"
  | "PortalTransparencia"
  | "DOU"
  | "BLLCompras"
  | "PortalComprasPublicas"
  | "BBMNet"
  | "ComprasRS"
  | "ComprasRJ"
  | "ComprasMG"
  | "Petronect";

export type ValidationStatus = "validado" | "pendente" | "inconsistente" | "indisponivel";

export interface RawTenderItem {
  id: string;
  source: SourceType;
  sourcePriority: number; // 1 (PNCP) a 6 (DOU)
  orgao: string;
  cnpjOrgao?: string;
  uf: string;
  municipio?: string;
  objeto: string;
  valorEstimado?: number | null;
  dataAbertura: string; // ISO format or YYYY-MM-DD
  linkOrigem: string;
  linkPdf?: string | null;
  modalidade?: string;
  sourceMetadata?: Record<string, any>;
}

export interface ValidatedTenderItem extends RawTenderItem {
  hash: string;
  validationStatus: ValidationStatus;
  validationFlags: string[];
  pdfAvailable: boolean;
  pdfPageCount?: number;
  duplicateOf?: string | null; // ID de fonte de maior prioridade se for duplicata
  availableAlsoInPNCP?: boolean;
  divergenceWarning?: string | null;
}

export interface ITenderSource {
  sourceName: SourceType;
  priority: number;
  rateLimitPerMinute: number;
  search(uf?: string, termo?: string): Promise<RawTenderItem[]>;
  isHealthy(): Promise<boolean>;
}
