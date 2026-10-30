import { HabilitacaoItem, CalculoPatrimonioLiquido } from "./types";
import { gerarCalculoPLComLiquidez } from "./liquidez-calculator";

export const TI_RULES = {
  vertical: "Tecnologia da Informação",
  requiredSecurityChecks: [
    "CERTIFICACAO_ISO_27001",
    "COMPLIANCE_LGPD",
    "SLA_ATENDIMENTO_SUPORTE",
    "PARCERIA_FABRICANTE_TI",
    "INDICES_LIQUIDEZ_ART_69",
  ],

  getRequiredChecks: (valorEstimado: number): {
    plCalculo: CalculoPatrimonioLiquido;
    requisitos: HabilitacaoItem[];
  } => {
    return {
      plCalculo: gerarCalculoPLComLiquidez(
        valorEstimado,
        "Art. 69, § 1º e § 4º - Índices de Liquidez e Patrimônio Líquido para execução de contratos de TI."
      ),
      requisitos: [
        {
          id: "ti-1",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Certificação ISO/IEC 27001 ou Declaração de Conformidade LGPD",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 22, Linha 17 - Item 10.2",
          trechoEdital: "Apresentação de certificado de conformidade do Sistema de Gestão de Segurança da Informação (ISO 27001).",
          diagnostico: "Empresa possui certificação ISO 27001 auditada em vigor até 2027.",
        },
        {
          id: "ti-2",
          categoria: "Qualificação Técnica (Art. 67)",
          documento: "Atestado com SLA de Atendimento 24x7 e Tempo de Resposta < 2h",
          status: "PASSA",
          lacunaTipo: "CONFORME",
          localEdital: "Pág. 24, Linha 30 - Item 10.5",
          trechoEdital: "Atestado de capacidade técnica com prestação de serviço de suporte em regime 24x7 com SLA restrito.",
          diagnostico: "Atestado emitido por órgão público atesta cumprimento de SLA com 99,8% de disponibilidade.",
        },
        {
          id: "ti-3",
          categoria: "Habilitação Jurídica (Art. 66)",
          documento: "Carta de Parceria ou Autorização do Fabricante (Tier / Gold)",
          status: "RESSALVA",
          lacunaTipo: "CORRIGIVEL",
          localEdital: "Pág. 26, Linha 12 - Item 11.1",
          trechoEdital: "Declaração expressa do fabricante autorizando a comercialização e prestação de garantia.",
          diagnostico: "Carta de autorização de canal emitida pela matriz internacional aguarda validação consularizada.",
        },
      ],
    };
  },
};
