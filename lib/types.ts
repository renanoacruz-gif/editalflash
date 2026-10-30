export type RiskLevel = "Baixo" | "Médio" | "Alto";
export type ImpactLevel = "Alto" | "Médio" | "Baixo";
export type ProbabilityLevel = "Baixa" | "Média" | "Alta";
export type SemaforoStatus = "PASSA" | "RESSALVA" | "ELIMINATORIA" | "REVISAO_HUMANA_NECESSARIA";

export type LacunaTipo = "CORRIGIVEL" | "ELIMINATORIA" | "CONFORME";

export type PrimaryVertical =
  | "Obras Públicas e Engenharia"
  | "Compras e Fornecimentos"
  | "Serviços Contínuos (Limpeza, Segurança, Manutenção)"
  | "Saúde e Medicamentos"
  | "Tecnologia da Informação"
  | "Todos / Não tenho preferência definida";

export interface DadosGerais {
  objeto: string;
  valor_estimado: string;
  data_sessao: string;
  prazo_impugnacao: string;
  numero_edital?: string;
  orgao?: string;
  uf?: string;
  modalidade?: string;
  vertical?: PrimaryVertical;
  detected_vertical?: PrimaryVertical;
  vertical_mismatch_warning?: string;
  pncpPdfConflictWarning?: string;
  retificationAlert?: {
    retified: boolean;
    previousDate?: string;
    changes?: string[];
  };
}

export interface HabilitacaoItem {
  id: string;
  categoria:
    | "Habilitação Jurídica (Art. 66)"
    | "Qualificação Técnica (Art. 67)"
    | "Habilitação Fiscal/Trabalhista (Art. 68)"
    | "Qualificação Econômico-Financeira (Art. 69)";
  documento: string;
  status: SemaforoStatus;
  lacunaTipo?: LacunaTipo; // Classificação de Lacuna: Corrigível vs Eliminatória
  localEdital: string; // Ex: "Pág. 14, Linha 28 - Item 8.2.1"
  trechoEdital: string; // Citação literal da exigência
  diagnostico: string;
  mitigacao?: string;
  linkRenovacao?: string;
  revisaoHumana?: boolean;
}

export interface CalculoPatrimonioLiquido {
  valorEstimadoEdital: number;
  percentualExigido: number; // Ex: 10%
  plMinimoExigido: number;
  plEmpresaCadastrado: number;
  status: "SUFICIENTE" | "INSUFICIENTE";
  localEdital: string;
  indicesLiquidez?: {
    liquidezGeral: number; // LG >= 1.0
    liquidezCorrente: number; // LC >= 1.0
    solvenciaGeral: number; // SG >= 1.0
    exigenciaEdital: number; // Típico: 1.0
    status: "ATENDE" | "INSUFICIENTE";
  };
}

export interface CalculoAtestadoQuantitativo {
  itemDescricao: string;
  quantidadeTotalEdital: number;
  unidade: string;
  regraCinquentaPorcentoExigida: number; // 50% conforme Lei 14.133
  quantidadeComprovadaEmpresa: number; // Maior atestado individual
  status: "ATENDE" | "BORDERLINE" | "INSUFICIENTE";
  localEdital: string;
  // Súmula 263 TCU - Regra do Somatório
  vedaSomatorio?: boolean;
  atestadoIndividualPercentual?: number;
  somatorioAtestadosAcervo?: number;
  somatorioPercentual?: number;
  statusSomatorio?: "ATENDE" | "INSUFICIENTE";
  justificativaSumula263?: string;
}

export interface CompanyDocumentVaultItem {
  id: string;
  tipo: string;
  nome: string;
  emissor: string;
  dataEmissao: string;
  dataValidade: string;
  diasParaVencer: number;
  status: "VALIDO" | "EXPIRANDO" | "VENCIDO";
  arquivoUrl?: string;
}

export interface AuditoriaTrilha {
  versaoAnalise: string;
  timestamp: string;
  revisorId: string;
  revisorNome: string;
  notasManuais: { id: string; autor: string; data: string; texto: string }[];
}

export interface CalendarioVencimentoItem {
  id: string;
  tipo: "documento" | "edital";
  titulo: string;
  orgaoOuEmissor: string;
  data: string;
  diasRestantes: number;
  alertaRisco: boolean;
  mensagemRisco?: string;
}

export interface Armadilha {
  id?: string;
  titulo: string;
  descricao: string;
  texto_original: string;
  local_edital?: string;
  impacto: ImpactLevel;
  probabilidade?: ProbabilityLevel;
  sugestao_mitigacao?: string;
  fundamento_legal?: string;
  jurisprudencia?: string;
}

export interface ChecklistItemArt62 {
  id: string;
  categoria:
    | "Habilitação Jurídica (Art. 66)"
    | "Qualificação Técnico-Profissional e Operacional (Art. 67)"
    | "Habilitação Fiscal, Social e Trabalhista (Art. 68)"
    | "Qualificação Econômico-Financeira (Art. 69)";
  documento: string;
  descricao: string;
  obrigatorio: boolean;
  linkOficial?: string;
  status?: "pendente" | "conferido";
}

export interface ChecklistHabilitacaoItem {
  item: string;
  obrigatorio: boolean;
}

export interface EditalAnalysisResponse {
  analysis_id?: string;
  nivel_risco: RiskLevel;
  justificativa_risco: string;
  veredito_habilitacao?: SemaforoStatus;
  justificativa_veredito?: string;
  vertical?: PrimaryVertical;
  detected_vertical?: PrimaryVertical;
  detected_category_code?: "OBRAS" | "COMPRAS" | "SERVICOS_CONTINUOS" | "SAUDE" | "TI" | "GERAL";
  classification_confidence?: number;
  is_classification_ambiguous?: boolean;
  user_primary_vertical?: PrimaryVertical;
  vertical_mismatch?: boolean;
  vertical_mismatch_warning?: string;
  dados_gerais: DadosGerais;
  semaforo_habilitacao?: HabilitacaoItem[];
  calculo_patrimonio_liquido?: CalculoPatrimonioLiquido;
  calculo_atestados?: CalculoAtestadoQuantitativo[];
  auditoria?: AuditoriaTrilha;
  armadilhas: Armadilha[];
  checklist_habilitacao: ChecklistHabilitacaoItem[];
}

export type DesfechoLicitacao = "EM_ANDAMENTO" | "GANHA" | "PERDIDA" | "REVOGADA_ANULADA" | "NAO_DISPUTADA";

export interface AuditedTenderHistoryItem {
  id: string;
  dataAuditoria: string; // ISO String
  numeroEdital: string;
  orgao: string;
  objeto: string;
  valorEstimado: string;
  vereditoGeral: SemaforoStatus;
  passaCount: number;
  ressalvaCount: number;
  eliminatoriaCount: number;
  revisaoCount: number;
  armadilhasCount: number;
  fileName?: string;
  payload: EditalAnalysisResponse;
  // Campos de Desfecho & Performance Operacional
  desfecho?: DesfechoLicitacao;
  valorHomologadoGanha?: number; // Valor final em caso de vitória
  motivoPerda?: string; // Ex: Preço inferior de concorrente, Recurso, etc.
  segmento?: PrimaryVertical;
}

export interface PNCPEditalResult {
  numeroControlePNCP: string;
  anoCompra: number;
  sequencialCompra: number;
  orgaoEntidade: {
    razaoSocial: string;
    cnpj: string;
  };
  unidadeOrgao?: {
    ufSigla: string;
    municipioNome: string;
  };
  modalidadeNome: string;
  objetoCompra: string;
  dataAberturaProposta: string;
  linkProcessoEletronico?: string | null;
  linkPdf?: string | null;
  valorTotalEstimado?: number;
}
