import { HabilitacaoItem, CalculoAtestadoQuantitativo, CalculoPatrimonioLiquido } from "./types";
import { gerarCalculoPLComLiquidez } from "./liquidez-calculator";

export const COMPRAS_RULES = {
  vertical: "Compras e Fornecimentos",
  requiredSupplyChecks: [
    "PROVA_MARCA_MODELO",
    "CATALOGO_PROSPECTO_TECNICO",
    "ATESTADO_QUANTITATIVO_FORNECIMENTO",
    "INDICES_LIQUIDEZ_ART_69",
  ],

  getRequiredChecks: (valorEstimado: number): {
    plCalculo: CalculoPatrimonioLiquido;
    atestadoRegra: CalculoAtestadoQuantitativo;
    requisitos: HabilitacaoItem[];
  } => {
    return {
      plCalculo: gerarCalculoPLComLiquidez(
        valorEstimado,
        "Art. 69, § 1º e § 4º - Comprovação de Boa Situação Financeira (Índices LG, LC, SG > 1,00)."
      ),
      atestadoRegra: {
        itemDescricao: "Fornecimento parcelado de suprimentos de escritório e papelaria",
        quantidadeTotalEdital: 50000,
        unidade: "resmas",
        regraCinquentaPorcentoExigida: 25000,
        quantidadeComprovadaEmpresa: 18000, // 36% individual
        status: "ATENDE",
        localEdital: "Art. 67, § 2º - Fornecimento prévio de bens compatíveis com o objeto.",
        vedaSomatorio: false,
        atestadoIndividualPercentual: 36,
        somatorioAtestadosAcervo: 30000, // 60% somado
        somatorioPercentual: 60,
        statusSomatorio: "ATENDE",
        justificativaSumula263: "Somatório permitido conforme Súmula 263/TCU, salvo vedação expressa no edital.",
      },
      requisitos: [
        {
          id: "com-1",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Atestado de Fornecimento Anterior Pertinente (Mínimo 50%)",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 11, Linha 19 - Item 7.2",
          trechoEdital: "Atestado fornecido por pessoa jurídica de direito público ou privado que comprove fornecimento similar.",
          diagnostico: "Atestado fornecido pelo TJ-SP comprova entrega de 32.000 unidades (supera os 50% exigidos).",
        },
        {
          id: "com-2",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Prospecto / Ficha Técnica Oficial com Marca e Modelo",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 13, Linha 8 - Item 8.1",
          trechoEdital: "Apresentação obrigatória de catálogo ou folheto oficial do fabricante comprovando conformidade ABNT.",
          diagnostico: "Catálogo do produto anexado na proposta detalha certificação FSC e gramatura de 75g/m².",
        },
        {
          id: "com-3",
          categoria: "Habilitação Fiscal/Trabalhista (Art. 68)",
          documento: "CND Estadual e Municipal com Inscrição Estadual Ativa",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 9, Linha 14 - Item 5.4",
          trechoEdital: "Prova de regularidade fiscal perante as fazendas estadual e municipal da sede do licitante.",
          diagnostico: "CND SEFAZ SP e CND Tributos Mobiliários válidas no Cofre de Documentos.",
        },
      ],
    };
  },
};
