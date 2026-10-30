import { HabilitacaoItem, CalculoPatrimonioLiquido, CalculoAtestadoQuantitativo } from "./types";
import { gerarCalculoPLComLiquidez } from "./liquidez-calculator";

export const OBRAS_RULES = {
  vertical: "Obras Públicas e Engenharia",
  requiredNumericChecks: ["PL_MINIMO_10", "INDICES_LIQUIDEZ_ART_69", "ATESTADO_50_PORCENTO", "CRONOGRAMA_FISICO_FINANCEIRO"],
  
  getRequiredChecks: (valorEstimado: number): {
    plCalculo: CalculoPatrimonioLiquido;
    atestadoRegra: CalculoAtestadoQuantitativo;
    requisitos: HabilitacaoItem[];
  } => {
    return {
      plCalculo: gerarCalculoPLComLiquidez(
        valorEstimado,
        "Art. 69, § 1º e § 4º - Comprovação de PL não inferior a 10% e Índices de Liquidez (LG, LC, SG) > 1,00."
      ),
      atestadoRegra: {
        itemDescricao: "Execução de Pavimentação Asfáltica CBUQ",
        quantidadeTotalEdital: 10000,
        unidade: "m²",
        regraCinquentaPorcentoExigida: 5000,
        quantidadeComprovadaEmpresa: 3500, // Atestado individual: 35% do total
        status: "ATENDE",
        localEdital: "Art. 67, § 2º - Capacidade técnico-operacional em parcelas de maior relevância técnica.",
        vedaSomatorio: false,
        atestadoIndividualPercentual: 35,
        somatorioAtestadosAcervo: 6000, // 3.500m² + 2.500m² = 60%
        somatorioPercentual: 60,
        statusSomatorio: "ATENDE",
        justificativaSumula263: "Somatório permitido conforme Súmula 263/TCU, salvo vedação expressa no edital.",
      },
      requisitos: [
        {
          id: "obr-1",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Certidão de Acervo Técnico (CAT) com Atestado e ART de Registro",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 18, Linha 4 - Item 9.1.2",
          trechoEdital: "Comprovação de registro ou inscrição da empresa licitante e do responsável técnico no CREA/CAU.",
          diagnostico: "Empresa possui CAT nº 2024-SP-8941 ativa com ART devidamente baixada.",
        },
        {
          id: "obr-2",
          categoria: "Qualificação Econômico-Financeira (Art. 69)",
          documento: "Balanço Patrimonial e Demonstrações Contábeis com PL ≥ 10%",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 14, Linha 28 - Item 8.4.1",
          trechoEdital: "Patrimônio líquido não inferior a 10% do valor estimado da contratação.",
          diagnostico: "Patrimônio Líquido de R$ 3,2M registrado na Junta Comercial atende a exigência de 10%.",
        },
        {
          id: "obr-3",
          categoria: "Habilitação Fiscal/Trabalhista (Art. 68)",
          documento: "CND Conjunta Federal, CNDT e FGTS",
          status: "RESSALVA",
          lacunaTipo: "CORRIGIVEL",
          localEdital: "Pág. 12, Linha 10 - Item 7.3",
          trechoEdital: "Apresentação de prova de regularidade fiscal perante a Fazenda Nacional.",
          diagnostico: "CND Federal no cofre vence em 6 dias (antes da sessão de abertura). Renovação imediata recomendada.",
          linkRenovacao: "https://solucoes.receita.fazenda.gov.br",
        },
      ],
    };
  },
};
