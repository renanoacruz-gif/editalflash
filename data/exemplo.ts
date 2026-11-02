export interface AuditoriaExemploItem {
  artigo: string;
  categoria: string;
  exigencia: string;
  localEdital: string;
  diagnostico: string;
  status: "PASSA" | "RESSALVA" | "ELIMINATORIA" | "REVISAO";
  statusLabel: string;
  badgeBg: string;
  highlightLine: string;
}

export interface CenarioExemplo {
  isExemploIlustrativo: boolean;
  licitante: {
    razaoSocial: string;
    cnpj: string;
  };
  edital: {
    numero: string;
    modalidade: string;
    orgao: string;
    objeto: string;
    arquivoNome: string;
    dataEmissao: string;
    hashDocumento: string;
    valorEstimado: number;
    valorEstimadoFormatado: string;
  };
  metricas: {
    plMinimoPercentual: number;
    plMinimoValor: number;
    plMinimoValorFormatado: string;
    plApuradoValor: number;
    plApuradoValorFormatado: string;
    plApuradoPercentual: number;
    plFolgaValor: number;
    plFolgaValorFormatado: string;
    atestadoExigido: string;
    atestadoComprovado: string;
    cndFederalDiasRestantes: number;
  };
  requisitos: AuditoriaExemploItem[];
}

export const cenarioExemplo: CenarioExemplo = {
  isExemploIlustrativo: true,
  licitante: {
    razaoSocial: "Construtora Exemplo Ltda",
    cnpj: "00.000.000/0001-00",
  },
  edital: {
    numero: "Concorrência nº 042/2026",
    modalidade: "CONCORRÊNCIA ELETRÔNICA",
    orgao: "Prefeitura Municipal de Exemplo",
    objeto: "Pavimentação asfáltica em Concreto Betuminoso Usinado a Quente (CBUQ)",
    arquivoNome: "Edital_Concorrencia_042_2026.pdf",
    dataEmissao: "29/10/2026 às 06:45 BRT",
    hashDocumento: "sha256:8b4e...9f21",
    valorEstimado: 4250000,
    valorEstimadoFormatado: "R$ 4.250.000,00",
  },
  metricas: {
    plMinimoPercentual: 10,
    plMinimoValor: 425000,
    plMinimoValorFormatado: "R$ 425.000,00",
    plApuradoValor: 560000,
    plApuradoValorFormatado: "R$ 560.000,00",
    plApuradoPercentual: 13.2,
    plFolgaValor: 135000,
    plFolgaValorFormatado: "R$ 135.000,00",
    atestadoExigido: "5.000 m² de CBUQ",
    atestadoComprovado: "7.200 m² (soma de 2 CATs)",
    cndFederalDiasRestantes: 4,
  },
  requisitos: [
    {
      artigo: "Art. 69, § 4º",
      categoria: "Qualificação Econômica",
      exigencia: "Patrimônio Líquido Mínimo de 10% (R$ 425.000,00)",
      localEdital: "Pág. 14, Item 8.2.1",
      diagnostico:
        "Balanço Patrimonial apura PL de R$ 560.000,00 (13,2% do estimado). Folga positiva de +R$ 135.000,00.",
      status: "PASSA",
      statusLabel: "PASSA (+32% folga)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      highlightLine:
        "Cláusula 8.2.1: Comprovação de Patrimônio Líquido igual ou superior a 10% do valor estimado (R$ 425.000,00).",
    },
    {
      artigo: "Art. 67, § 2º",
      categoria: "Capacidade Técnica",
      exigencia: "Atestado de Pavimentação CBUQ em volume de 5.000 m²",
      localEdital: "Pág. 19, Item 9.3",
      diagnostico:
        "Soma de 2 CATs registradas atinge 7.200 m². Aplicável a regra de somatório (Súmula 263 TCU).",
      status: "PASSA",
      statusLabel: "PASSA (Súmula 263)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      highlightLine:
        "Cláusula 9.3: Comprovação de execução prévia de 5.000 m² de pavimentação asfáltica CBUQ. Vedado somatório.",
    },
    {
      artigo: "Art. 68, III",
      categoria: "Regularidade Fiscal",
      exigencia: "Certidão Conjunta Federal (RFB/PGFN) em plena validade",
      localEdital: "Pág. 11, Item 7.1.3",
      diagnostico:
        "Certidão cadastrada é válida, porém expira em 4 dias úteis. Requer emissão preventiva perante a RFB.",
      status: "RESSALVA",
      statusLabel: "RESSALVA (4 dias)",
      badgeBg: "bg-amber-50 text-amber-900 border-amber-300",
      highlightLine:
        "Cláusula 7.1.3: Apresentação de Certidão Negativa de Débitos Federais (RFB/PGFN) válida no dia da abertura.",
    },
    {
      artigo: "Art. 68, V",
      categoria: "Trabalhista",
      exigencia: "Certidão Negativa de Débitos Trabalhistas (CNDT)",
      localEdital: "Pág. 12, Item 7.2",
      diagnostico:
        "CNDT expedida pelo TST com validade assegurada por mais 120 dias. Conforme Art. 68.",
      status: "PASSA",
      statusLabel: "PASSA (Conforme)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      highlightLine:
        "Cláusula 7.2: Apresentação de Certidão Negativa de Débitos Trabalhistas (CNDT) emitida perante a Justiça do Trabalho.",
    },
    {
      artigo: "Art. 69, § 1º",
      categoria: "Índices Contábeis",
      exigencia: "Liquidez Geral (LG) ≥ 1,00 e Liquidez Corrente (LC) ≥ 1,00",
      localEdital: "Pág. 16, Item 8.3",
      diagnostico:
        "Índices apurados: LG = 1,42 e LC = 1,38. Dispensada prestação de garantia adicional de proposta.",
      status: "PASSA",
      statusLabel: "PASSA (LG/LC > 1)",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      highlightLine:
        "Cláusula 8.3: Demonstração de índices de Liquidez Geral (LG) e Liquidez Corrente (LC) iguais ou superiores a 1,00.",
    },
  ],
};

export const getEstatisticasExemplo = (requisitos = cenarioExemplo.requisitos) => {
  const conformes = requisitos.filter((r) => r.status === "PASSA").length;
  const ressalvas = requisitos.filter((r) => r.status === "RESSALVA").length;
  const eliminatorias = requisitos.filter((r) => r.status === "ELIMINATORIA").length;
  const revisões = requisitos.filter((r) => r.status === "REVISAO").length;
  const total = requisitos.length;

  return {
    conformes,
    ressalvas,
    eliminatorias,
    revisões,
    total,
  };
};
