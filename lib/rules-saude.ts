import { HabilitacaoItem, CalculoPatrimonioLiquido } from "./types";
import { gerarCalculoPLComLiquidez } from "./liquidez-calculator";

export const SAUDE_RULES = {
  vertical: "Saúde e Medicamentos",
  requiredRegulatoryChecks: [
    "REGISTRO_ANVISA",
    "ALVARA_SANITARIO_VIGENTE",
    "CRF_RESPONSAVEL_TECNICO",
    "CONTROLE_VALIDADE_MEDICAMENTOS",
    "INDICES_LIQUIDEZ_ART_69",
  ],

  getRequiredChecks: (valorEstimado: number): {
    plCalculo: CalculoPatrimonioLiquido;
    requisitos: HabilitacaoItem[];
  } => {
    return {
      plCalculo: gerarCalculoPLComLiquidez(
        valorEstimado,
        "Art. 69, § 1º e § 4º - Capacidade financeira para fornecimento contínuo de fármacos e insumos."
      ),
      requisitos: [
        {
          id: "sau-1",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Registro na ANVISA do Medicamento / Correlato",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 16, Linha 8 - Item 6.1",
          trechoEdital: "Registro vigente emitido pela Agência Nacional de Vigilância Sanitária (ANVISA) ou publicação no DOU.",
          diagnostico: "Medicamento com registro ativo no banco de dados ANVISA sob nº 1.0298.0123.001-9.",
        },
        {
          id: "sau-2",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Licença Sanitária (Alvará Sanitário Estadual/Municipal)",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 17, Linha 22 - Item 6.3",
          trechoEdital: "Alvará Sanitário da distribuidora ou indústria expedido pelo órgão de vigilância sanitária competente.",
          diagnostico: "Alvará Sanitário nº 2026/SP-4412 em plena vigência com capacidade para medicamentos controlados.",
        },
        {
          id: "sau-3",
          categoria: "Habilitação Jurídica (Art. 66)",
          documento: "Certidão de Regularidade Técnica do CRF (Farmacêutico)",
          status: "RESSALVA",
          lacunaTipo: "CORRIGIVEL",
          localEdital: "Pág. 18, Linha 14 - Item 7.1",
          trechoEdital: "Certidão de Regularidade perante o Conselho Regional de Farmácia (CRF) do responsável técnico.",
          diagnostico: "CRF do farmacêutico responsável com revalidação anual agendada para os próximos 10 dias.",
          linkRenovacao: "https://www.crfsp.org.br",
        },
        {
          id: "sau-4",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Termo de Garantia de Validade (Mínimo 75% da vida útil)",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 21, Linha 5 - Item 9.5",
          trechoEdital: "Os lotes entregues deverão possuir prazo de validade não inferior a 75% do total estipulado na fabricação.",
          diagnostico: "Termo de compromisso de troca em 48h em conformidade com o Anexo III do Edital.",
        },
      ],
    };
  },
};
