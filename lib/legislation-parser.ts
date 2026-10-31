/**
 * lib/legislation-parser.ts
 * 
 * Parser especializado para o cabeçalho YAML e artigos das leis brasileiras.
 * Funciona de forma pura (sem dependências externas) para máxima performance e compatibilidade Edge.
 */

export interface LegislationMetadata {
  titulo: string;
  tipo: string;
  numero: string;
  ano: number;
  data_promulgacao?: string;
  ementa: string;
  revogada: boolean;
  versao_texto: string; // "compilado", "original", "republicação/retificação"
  urn?: string;
  fonte: string;
  baixado_em?: string;
}

export interface ParsedArticle {
  artigo_numero: string; // ex: "62", "67", "69"
  rotulo: string;        // ex: "Art. 62"
  topico?: string;
  conteudo_markdown: string;
  fonte_oficial_ancora_url: string;
  palavras_chave: string[];
}

export interface ParsedLegislation {
  metadata: LegislationMetadata;
  artigos: ParsedArticle[];
}

/**
 * Faz o parse do cabeçalho YAML de um arquivo Markdown do repositório ctresb/leis
 */
export function parseLegislationYamlHeader(markdown: string): { metadata: LegislationMetadata; body: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Arquivo Markdown não contém cabeçalho YAML delimitado por ---");
  }

  const yamlBlock = match[1];
  const body = match[2];

  const metadata: any = {
    revogada: false,
    versao_texto: "desconhecido",
  };

  const lines = yamlBlock.split(/\r?\n/);
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    // Remove aspas
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    if (key === "revogada") {
      metadata.revogada = val.toLowerCase() === "true";
    } else if (key === "data") {
      metadata.data_promulgacao = val;
      const yearMatch = val.match(/^(\d{4})/);
      if (yearMatch) metadata.ano = parseInt(yearMatch[1], 10);
    } else {
      metadata[key] = val;
    }
  }

  if (!metadata.ano && metadata.data_promulgacao) {
    const yearMatch = String(metadata.data_promulgacao).match(/^(\d{4})/);
    if (yearMatch) metadata.ano = parseInt(yearMatch[1], 10);
  }

  return { metadata: metadata as LegislationMetadata, body };
}

/**
 * Mapeia palavras-chave relevantes para licitações e contratações
 */
function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const lower = text.toLowerCase();

  const dict: Record<string, string[]> = {
    "habilitação": ["habilitação", "inabilitação", "art. 62", "documentação"],
    "qualificação técnica": ["qualificação técnica", "atestado", "certidão de acervo", "cat", "art"],
    "econômico-financeira": ["patrimônio líquido", "índice de liquidez", "balanço patrimonial", "art. 69"],
    "regularidade fiscal": ["cnd", "cndt", "fgts", "seguridade social", "art. 68"],
    "impugnação": ["impugnação", "esclarecimento", "art. 164", "edital"],
    "me_epp": ["microempresa", "empresa de pequeno porte", "lc 123", "empate ficto", "tratamento diferenciado"],
    "restritiva": ["vedada", "restrição", "direcionamento", "vedação"],
  };

  for (const [key, terms] of Object.entries(dict)) {
    if (terms.some(t => lower.includes(t))) {
      keywords.push(key);
    }
  }

  return keywords;
}

/**
 * Divide o corpo da lei em artigos estruturados com link oficial em âncora
 */
export function splitLawIntoArticles(body: string, baseUrl: string): ParsedArticle[] {
  const articles: ParsedArticle[] = [];

  // Regex para identificar Art. 1º, Art. 62, **Art. 62**, Art. \n 62, etc.
  const articleRegex = /(?:^|\n|\r)\s*(?:#{1,4}\s*)?(?:\*\*)?(?:Art\.|Artigo)\s*(\d+[ºo\uFFFD]?\-?[A-Za-z]?)(?:\*\*)?\.?\s*/gi;

  const matches: { index: number; num: string; fullMatch: string }[] = [];
  let m: RegExpExecArray | null;

  while ((m = articleRegex.exec(body)) !== null) {
    const rawNum = m[1].replace(/[ºo\uFFFD]/g, "").trim();
    if (rawNum && !isNaN(parseInt(rawNum, 10))) {
      matches.push({
        index: m.index,
        num: rawNum,
        fullMatch: m[0],
      });
    }
  }

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const startIndex = current.index;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : body.length;

    const rawSection = body.slice(startIndex, endIndex).trim();
    const cleanNum = current.num;

    // Constrói a URL oficial com âncora padrão
    // Planalto: #art{num} | Normas Leg: #art{num}
    let anchorUrl = baseUrl;
    if (baseUrl.includes("planalto.gov.br")) {
      anchorUrl = `${baseUrl.split("#")[0]}#art${cleanNum}`;
    } else if (baseUrl.includes("normas.leg.br")) {
      anchorUrl = `${baseUrl.split("#")[0]}#art${cleanNum}`;
    }

    articles.push({
      artigo_numero: cleanNum,
      rotulo: `Art. ${cleanNum}º`,
      conteudo_markdown: rawSection,
      fonte_oficial_ancora_url: anchorUrl,
      palavras_chave: extractKeywords(rawSection),
    });
  }

  return articles;
}
