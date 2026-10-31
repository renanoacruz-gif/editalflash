/**
 * scripts/sync-legislation.ts
 * 
 * Script de Sincronização Cirúrgica da Base Legislativa para o EditalFlash.
 * 
 * Diretrizes:
 * 1. Não clona o repositório ctresb/leis (7,5 GB).
 * 2. Baixa apenas normas de licitações via GitHub Raw API.
 * 3. Faz o parse do cabeçalho YAML para metadados e divide artigos.
 * 4. Trata a completude: detecta quando a Lei 14.133 possui apenas republicação de vetos
 *    e sincroniza o texto compilado integral do Planalto.
 * 5. Garante que todo artigo possua o link oficial canônico com âncora (#artXX).
 * 6. Salva o resultado estruturado em cache local e/ou sincroniza no Supabase.
 * 
 * Execução: npx tsx scripts/sync-legislation.ts
 */

import fs from "fs";
import path from "path";
import { parseLegislationYamlHeader, splitLawIntoArticles, ParsedLegislation } from "../lib/legislation-parser";

interface TargetNorm {
  id: string;
  sourceType: "ctresb" | "planalto";
  url: string;
  officialSourceUrl: string;
}

const TARGET_NORMS: TargetNorm[] = [
  // 1. Lei Complementar 123/2006 (Estatuto da ME/EPP) - 246 KB no ctresb/leis
  {
    id: "lcp-123-2006",
    sourceType: "ctresb",
    url: "https://raw.githubusercontent.com/ctresb/leis/main/federal/leis-complementares/2006/lcp-123-2006-12-14.md",
    officialSourceUrl: "https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm",
  },
  // 2. Decreto 11.462/2023 (Regulamento SRP) - 41 KB no ctresb/leis
  {
    id: "dec-11462-2023",
    sourceType: "ctresb",
    url: "https://raw.githubusercontent.com/ctresb/leis/main/federal/decretos/2023/dec-11462-2023-03-31.md",
    officialSourceUrl: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11462.htm",
  },
  // 3. Decreto 11.430/2023 (Mulheres Vítimas de Violência) - 8 KB no ctresb/leis
  {
    id: "dec-11430-2023",
    sourceType: "ctresb",
    url: "https://raw.githubusercontent.com/ctresb/leis/main/federal/decretos/2023/dec-11430-2023-03-08.md",
    officialSourceUrl: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11430.htm",
  },
  // 4. Lei 14.133/2021 (Nova Lei de Licitações) - Fonte Planalto Compilado (Resolve a incompletude do ctresb)
  {
    id: "lei-14133-2021",
    sourceType: "planalto",
    url: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm",
    officialSourceUrl: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm",
  },
];

const CACHE_DIR = path.resolve(__dirname, "../data/legislation-cache");

async function fetchWithUserAgent(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`Falha HTTP ${res.status} ao baixar ${url}`);
  }

  // Se for do Planalto, decodifica em latin1 (ISO-8859-1)
  if (url.includes("planalto.gov.br")) {
    const arrayBuffer = await res.arrayBuffer();
    const decoder = new TextDecoder("iso-8859-1");
    return decoder.decode(arrayBuffer);
  }

  return res.text();
}

/**
 * Converte HTML da Lei 14.133 do Planalto em Markdown Estruturado com Cabeçalho YAML
 */
function convertPlanaltoHtmlToMarkdown(html: string): string {
  // Limpeza de tags desnecessárias preservando quebras de linha e estrutura de artigos
  let text = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/<strike>[\s\S]*?<\/strike>/gi, "") // Remove dispositivos revogados tachados
    .replace(/<[^>]+>/g, ""); // Remove todas as tags HTML

  // Normaliza quebras de linha que possam ter separado "Art." do número
  text = text.replace(/Art\.\s*\n+\s*(\d+)/gi, "Art. $1");
  text = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n");

  const yamlHeader = `---
titulo: "Lei nº 14.133 de 01/04/2021"
tipo: "Lei Ordinária"
numero: "14133"
data: 2021-04-01
ementa: "Lei de Licitações e Contratos Administrativos."
revogada: false
versao_texto: "compilado"
urn: "urn:lex:br:federal:lei:2021-04-01;14133"
fonte: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm"
baixado_em: ${new Date().toISOString().split("T")[0]}
---
`;

  return yamlHeader + text;
}

async function main() {
  console.log("==================================================================");
  console.log("🏛️  SINCRONIZADOR DE LEGISLAÇÃO DO EDITALFLASH");
  console.log("==================================================================");

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const results: ParsedLegislation[] = [];

  for (const target of TARGET_NORMS) {
    console.log(`\n[Processando] ${target.id} (${target.sourceType})...`);

    try {
      let rawContent = "";

      if (target.sourceType === "planalto") {
        console.log(`  → Baixando texto compilado oficial da Presidência da República...`);
        const html = await fetchWithUserAgent(target.url);
        rawContent = convertPlanaltoHtmlToMarkdown(html);
      } else {
        console.log(`  → Baixando norma via GitHub Raw (ctresb/leis)...`);
        rawContent = await fetchWithUserAgent(target.url);
      }

      // 1. Parser do Cabeçalho YAML
      const { metadata, body } = parseLegislationYamlHeader(rawContent);

      // 2. Validação Crítica de Completude
      console.log(`  → Versão do texto: "${metadata.versao_texto}" | Tamanho: ${Math.round(body.length / 1024)} KB`);

      const hasArt1 = body.includes("Art. 1") || body.includes("Art. 1º");
      if (!hasArt1) {
        console.warn(`  ⚠️ ALERTA: A norma ${target.id} NÃO contém o 'Art. 1º'. Arquivo provavelmente incompleto!`);
      }

      // 3. Particionamento de Artigos
      const artigos = splitLawIntoArticles(body, target.officialSourceUrl);
      console.log(`  ✓ ${artigos.length} artigos indexados com links oficiais.`);

      const parsed: ParsedLegislation = {
        metadata,
        artigos,
      };

      results.push(parsed);

      // Salva em cache local estruturado fora do bundle da Cloudflare
      const cacheFilePath = path.join(CACHE_DIR, `${target.id}.json`);
      fs.writeFileSync(cacheFilePath, JSON.stringify(parsed, null, 2), "utf-8");
      console.log(`  ✓ Salvo em cache: ${cacheFilePath}`);
    } catch (err: any) {
      console.error(`  ❌ Erro ao sincronizar ${target.id}:`, err.message);
    }
  }

  // Cria um arquivo resumo para verificação rápida dos agentes
  const summary = results.map(r => ({
    id: r.metadata.numero ? `lei-${r.metadata.numero}` : r.metadata.titulo,
    titulo: r.metadata.titulo,
    tipo: r.metadata.tipo,
    ementa: r.metadata.ementa,
    versao: r.metadata.versao_texto,
    totalArtigos: r.artigos.length,
    fonte: r.metadata.fonte,
  }));

  fs.writeFileSync(
    path.join(CACHE_DIR, "index_summary.json"),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );

  console.log("\n==================================================================");
  console.log(`🎉 Sincronização concluída! ${results.length} normas processadas com sucesso.`);
  console.log("==================================================================");
}

main().catch(console.error);
