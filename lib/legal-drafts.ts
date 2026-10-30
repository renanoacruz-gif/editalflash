// lib/legal-drafts.ts
// Explicação: Template dinâmico que insere a cláusula problemática e fundamenta legalmente sob o Art. 164

export function generateImpugnation(
  clauseText: string,
  reason: string,
  companyName: string = "EMPRESA LICITANTE LTDA",
  cnpj: string = "00.000.000/0001-00",
  gestorName: string = "Gestor Responsável de Licitações"
) {
  return `
EXCELENTÍSSIMO SENHOR AGENTE DE CONTRATAÇÃO / PREGOEIRO DA [ÓRGÃO CONVOCANTE]

Ref.: Impugnação ao Instrumento Convocatório (Edital de Licitação)
Fundamentação: Art. 164 da Lei Federal nº 14.133/2021

${companyName.toUpperCase()}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${cnpj}, por intermédio de seu representante legal infra-assinado, ${gestorName}, vem respeitosamente à presença de Vossa Senhoria apresentar:

IMPUGNAÇÃO ADMINISTRATIVA AO EDITAL

pelos fatos, fundamentos jurídicos e precedentes do Tribunal de Contas da União a seguir expostos:

1. DA TEMPESTIVIDADE (ART. 164 DA LEI 14.133/2021)
A presente manifestação é tempestiva, protocolada dentro do prazo legal de até 3 (três) dias úteis anteriores à data fixada para abertura do certame, conforme prescreve o caput do Art. 164 da Nova Lei de Licitações.

2. DA CLÁUSULA EDITALÍCIA RESTRITIVA:
"${clauseText}"

3. DA ILEGALIDADE E DO PREJUÍZO À COMPETITIVIDADE:
A exigência impugnada ultrapassa o limite da razoabilidade e da proporcionalidade garantidos pelo Art. 5º e Art. 62 da Lei 14.133/2021, configurando cláusula restritiva que frustra o caráter concorrencial da contratação pública.
${reason ? `Apontamento Pericial: ${reason}` : ""}

A jurisprudência pacífica do TCU veda exigências formais ou documentais que desbordem da garantia mínima indispensável à execução do objeto:
"Em procedimentos licitatórios, é vedada a inclusão de exigências de qualificação técnica ou econômica que não sejam estritamente indispensáveis à garantia do cumprimento da obrigação." (Súmula 263/TCU e Acórdãos correlatos).

4. DOS PEDIDOS:
Diante do exposto, requer-se:
a) O recebimento e processamento da presente impugnação com efeito suspensivo formal;
b) O julgamento procedente para RETIFICAR a cláusula editalícia apontada, adequando-a aos ditames da Lei 14.133/2021 e reabrindo-se o prazo legal caso a alteração afete a formulação das propostas;
c) Subsidiariamente, caso não seja reformada a exigência, a devida remessa da matéria à autoridade superior com a motivação expressa.

Termos em que pede deferimento.

Local e Data: ${new Date().toLocaleDateString("pt-BR")}
${companyName}
CNPJ: ${cnpj}
Representante: ${gestorName}
`;
}
