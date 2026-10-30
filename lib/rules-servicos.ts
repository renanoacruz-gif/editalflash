import { HabilitacaoItem, CalculoAtestadoQuantitativo, CalculoPatrimonioLiquido } from "./types";
import { gerarCalculoPLComLiquidez } from "./liquidez-calculator";

export const SERVICOS_RULES = {
  vertical: "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
  requiredServiceChecks: [
    "PLANILHA_CUSTOS_FORMACAO_PRECOS",
    "REGISTRO_CONSELHO_CRA_OU_POLICIA_FEDERAL",
    "ATESTADO_POSTOS_TRABALHO",
    "ATESTADO_SERVICOS_MARKETING_DIVULGACAO",
    "CCT_CONVENCAO_COLETIVA",
    "INDICES_LIQUIDEZ_ART_69",
    "PATRIMONIO_LIQUIDO_ART_69",
  ],

  getRequiredChecks: (valorEstimado: number): {
    plCalculo: CalculoPatrimonioLiquido;
    atestadoRegra: CalculoAtestadoQuantitativo;
    requisitos: HabilitacaoItem[];
  } => {
    return {
      plCalculo: gerarCalculoPLComLiquidez(
        valorEstimado,
        "Art. 69, § 1º e § 4º - Capacidade econômico-financeira para dedicação de serviços com comprovação de PL ≥ 10% e Índices de Liquidez (LC, LG, SG > 1.0)."
      ),
      atestadoRegra: {
        itemDescricao: "Comprovação de serviços de divulgação, publicidade, promoção e apoio operacional contínuo",
        quantidadeTotalEdital: 12,
        unidade: "meses / contratos",
        regraCinquentaPorcentoExigida: 6,
        quantidadeComprovadaEmpresa: 12,
        status: "ATENDE",
        localEdital: "Art. 67, § 2º - Execução anterior de serviços compatíveis em características e volumes.",
        vedaSomatorio: false,
        atestadoIndividualPercentual: 100,
        somatorioAtestadosAcervo: 12,
        somatorioPercentual: 100,
        statusSomatorio: "ATENDE",
        justificativaSumula263: "Somatório permitido conforme Súmula 263/TCU, comprovando capacidade técnico-operacional.",
      },
      requisitos: [
        {
          id: "srv-1",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Atestado de Capacidade Técnico-Operacional (Serviços Similares de Marketing e Apoio)",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 14, Linha 12 - Item 7.2",
          trechoEdital: "Apresentação de atestado(s) de capacidade técnica expedido(s) por pessoa jurídica de direito público ou privado, comprovando execução anterior de serviços de divulgação, promoção comercial ou apoio operacional compatíveis em objeto.",
          diagnostico: "Atestado emitido por empresa contratante privada comprova execução de serviços de divulgação e promoção comercial contínua por 12 meses, atendendo integralmente ao Art. 67.",
        },
        {
          id: "srv-2",
          categoria: "Habilitação Jurídica (Art. 66)",
          documento: "Contrato Social / Requerimento de Empresário Individual com CNAE Compatível",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 8, Linha 4 - Item 5.1",
          trechoEdital: "Ato constitutivo, estatuto ou contrato social em vigor, devidamente registrado, comprovando objeto social compatível com as atividades licitadas.",
          diagnostico: "Requerimento / Contrato Social regular perante a Junta Comercial com atividade econômica principal/secundária (CNAE 73.19-0-02 Promoção de vendas e serviços) compatível com o certame.",
        },
        {
          id: "srv-3",
          categoria: "Habilitação Fiscal/Trabalhista (Art. 68)",
          documento: "Certidões de Regularidade Fiscal Federal, Estadual, Municipal e FGTS",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 10, Linha 18 - Item 6.1 e 6.2",
          trechoEdital: "Prova de regularidade fiscal perante a Fazenda Nacional (CND RFB/PGFN), FGTS (CRF) e Justiça do Trabalho (CNDT).",
          diagnostico: "CND Federal e Certidão de Regularidade do FGTS em plena vigência anexadas no cofre digital, em estrita conformidade com o Art. 68.",
          linkRenovacao: "https://solucoes.receita.fazenda.gov.br",
        },
        {
          id: "srv-4",
          categoria: "Qualificação Econômico-Financeira (Art. 69)",
          documento: "Balanço Patrimonial com Índices de Liquidez (LC, LG, SG > 1.0) e PL ≥ 10%",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 12, Linha 22 - Item 6.4",
          trechoEdital: "Balanço patrimonial e demonstrações contábeis do último exercício social comprovando boa situação financeira mediante Índices de Liquidez Geral (LG), Liquidez Corrente (LC) e Solvência Geral (SG) superiores a 1,00, bem como Patrimônio Líquido não inferior a 10% do valor estimado.",
          diagnostico: "Balanço patrimonial apurado com LC = 1.39, LG = 1.43, SG = 2.23 e Patrimônio Líquido suficiente, cumprindo integralmente os requisitos do Art. 69, § 1º e § 4º.",
        },
      ],
    };
  },
};
