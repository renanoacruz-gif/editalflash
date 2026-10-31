/**
 * lib/legislation-service.ts
 * 
 * Serviço de Consulta da Base Legislativa para os Agentes de Inteligência Artificial do EditalFlash.
 * Oferece consultas determinísticas e referências diretas com links oficiais da Presidência da República/Normas Leg.
 */

import { supabase, isSupabaseConfigured } from "./supabase";

export interface LegislationReference {
  normaTitulo: string;
  artigoNumero: string;
  rotulo: string;
  conteudo: string;
  linkOficial: string;
}

/**
 * Retorna os artigos mais relevantes para fundamentação jurídica de acordo com o tópico de auditoria.
 */
export async function getLegislationForAuditTopic(
  topic: "habilitacao" | "qualificacao_tecnica" | "patrimonio_liquido" | "impugnacao" | "me_epp" | "geral"
): Promise<LegislationReference[]> {
  // Lista padrão de artigos de alta relevância com links oficiais canônicos do Planalto
  const fallbackRules: Record<string, LegislationReference[]> = {
    habilitacao: [
      {
        normaTitulo: "Lei nº 14.133/2021",
        artigoNumero: "62",
        rotulo: "Art. 62 da Lei 14.133/2021",
        conteudo: "A habilitação é a fase da licitação em que se verifica o conjunto de informações e documentos necessários e suficientes para demonstrar a capacidade do licitante de realizar o objeto da licitação, dividindo-se em: jurídica; técnica; fiscal, social e trabalhista; econômico-financeira.",
        linkOficial: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art62",
      },
    ],
    qualificacao_tecnica: [
      {
        normaTitulo: "Lei nº 14.133/2021",
        artigoNumero: "67",
        rotulo: "Art. 67 da Lei 14.133/2021",
        conteudo: "A documentação relativa à qualificação técnico-profissional e técnico-operacional será restrita a atestados de capacidade técnica emitidos por pessoa jurídica de direito público ou privado comprovando execução de serviços similares. É vedada a exigência de quantitativos mínimos superiores a 50% dos quantitativos da contratação.",
        linkOficial: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art67",
      },
    ],
    patrimonio_liquido: [
      {
        normaTitulo: "Lei nº 14.133/2021",
        artigoNumero: "69",
        rotulo: "Art. 69, § 4º da Lei 14.133/2021",
        conteudo: "A qualificação econômico-financeira visa demonstrar a capacidade financeira do licitante. A Administração poderá exigir patrimônio líquido mínimo ou capital social mínimo equivalente a até 10% (dez por cento) do valor estimado da contratação.",
        linkOficial: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art69",
      },
    ],
    impugnacao: [
      {
        normaTitulo: "Lei nº 14.133/2021",
        artigoNumero: "164",
        rotulo: "Art. 164 da Lei 14.133/2021",
        conteudo: "Qualquer pessoa é parte legítima para impugnar edital de licitação por irregularidade na aplicação desta Lei ou para solicitar esclarecimento sobre os seus termos, devendo protocolar o pedido até 3 (três) dias úteis antes da data de abertura do certame.",
        linkOficial: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art164",
      },
    ],
    me_epp: [
      {
        normaTitulo: "Lei Complementar nº 123/2006",
        artigoNumero: "43",
        rotulo: "Art. 43 da LC 123/2006",
        conteudo: "Nas licitações públicas, a comprovação de regularidade fiscal e trabalhista das microempresas e empresas de pequeno porte somente será exigida para efeito de assinatura do contrato, sendo assegurado o prazo de 5 (cinco) dias úteis para regularização de eventuais pendências.",
        linkOficial: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm#art43",
      },
    ],
    geral: [
      {
        normaTitulo: "Lei nº 14.133/2021",
        artigoNumero: "62",
        rotulo: "Art. 62 da Lei 14.133/2021",
        conteudo: "Requisitos de habilitação divididos em jurídica, técnica, fiscal e econômico-financeira.",
        linkOficial: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art62",
      },
      {
        normaTitulo: "Lei nº 14.133/2021",
        artigoNumero: "164",
        rotulo: "Art. 164 da Lei 14.133/2021",
        conteudo: "Direito de impugnação do edital com prazo de 3 dias úteis.",
        linkOficial: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art164",
      },
    ],
  };

  // Se o Supabase estiver configurado, tenta buscar os artigos indexados no banco
  if (isSupabaseConfigured) {
    try {
      const keywordMap: Record<string, string> = {
        habilitacao: "habilitação",
        qualificacao_tecnica: "qualificação técnica",
        patrimonio_liquido: "econômico-financeira",
        impugnacao: "impugnação",
        me_epp: "me_epp",
        geral: "habilitação",
      };

      const kw = keywordMap[topic] || "habilitação";

      const { data, error } = await supabase
        .from("legislation_articles")
        .select(`
          artigo_numero,
          rotulo,
          conteudo_markdown,
          fonte_oficial_ancora_url,
          legislation_norms ( titulo )
        `)
        .contains("palavras_chave", [kw])
        .limit(3);

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          normaTitulo: row.legislation_norms?.titulo || "Lei nº 14.133/2021",
          artigoNumero: row.artigo_numero,
          rotulo: row.rotulo,
          conteudo: row.conteudo_markdown.slice(0, 500),
          linkOficial: row.fonte_oficial_ancora_url,
        }));
      }
    } catch (_) {
      // Fallback gracioso para a lista determinística
    }
  }

  return fallbackRules[topic] || fallbackRules.geral;
}

/**
 * Formata um bloco de diretrizes legislativas para ser injetado no prompt do LLM
 */
export async function buildLegislationPromptContext(): Promise<string> {
  const refs = [
    ...(await getLegislationForAuditTopic("habilitacao")),
    ...(await getLegislationForAuditTopic("qualificacao_tecnica")),
    ...(await getLegislationForAuditTopic("patrimonio_liquido")),
    ...(await getLegislationForAuditTopic("impugnacao")),
    ...(await getLegislationForAuditTopic("me_epp")),
  ];

  let block = "\nBASE LEGISLATIVA OFICIAL & FONTES CANÔNICAS (OBRIGATÓRIO CITAR COM HIPERLINK):\n";
  block += "Ao fundamentar qualquer exigência, veredito ou cláusula restritiva, cite expressamente o dispositivo legal acompanhado do seu link oficial correspondente:\n";

  for (const ref of refs) {
    block += `- [${ref.rotulo}](${ref.linkOficial}): "${ref.conteudo.slice(0, 180)}..."\n`;
  }

  return block;
}
