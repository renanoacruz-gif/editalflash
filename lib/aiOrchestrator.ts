/**
 * EDITALFLASH MULTI-AI ORCHESTRATOR
 * 
 * Este módulo orquestra chamadas com fallback inteligente entre provedores de IA:
 * 1. Google Gemini (via @google/genai ou REST) - Ideal para documentos de até 1.000.000 de tokens.
 * 2. Anthropic Claude (via @anthropic-ai/sdk) - Especialista em precisão jurídica.
 * 3. OpenAI GPT-4o (via openai) - Fallback de alta disponibilidade.
 */

import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { EditalAnalysisResponse } from "@/lib/types";

export const SYSTEM_PROMPT = `
Você é um especialista sênior em Licitações Públicas Brasileiras e Direito Administrativo. 
Analise o texto do edital fornecido e retorne ESTRITAMENTE um objeto JSON válido, sem qualquer comentário ou markdown em volta, com a seguinte estrutura:

{
  "nivel_risco": "Baixo" | "Médio" | "Alto",
  "justificativa_risco": "Uma frase curta e clara explicando o motivo do risco (ex: 'Exigência de atestado incompatível com o porte da empresa')",
  "dados_gerais": {
    "objeto": "Resumo objetivo do que está sendo contratado ou comprado",
    "valor_estimado": "Valor total estimado ou unitário com cifrão (ex: R$ 150.000,00)",
    "data_sessao": "DD/MM/AAAA às HH:mm",
    "prazo_impugnacao": "DD/MM/AAAA",
    "orgao": "Nome do órgão ou entidade pública licitante"
  },
  "armadilhas": [
    {
      "titulo": "Nome da cláusula restritiva",
      "descricao": "Explicação simples do problema",
      "texto_original": "O trecho exato do edital para copiar",
      "impacto": "Alto" | "Médio" | "Baixo"
    }
  ],
  "checklist_habilitacao": [
    { "item": "Certidão Negativa Federal", "obrigatorio": true },
    { "item": "Atestado de Capacidade Técnica", "obrigatorio": true },
    { "item": "Balanço Patrimonial", "obrigatorio": true }
  ]
}
`;

function extractJSON(rawText: string): EditalAnalysisResponse | null {
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Falha ao parsear JSON:", e);
    return null;
  }
}

/**
 * 1. Análise com Google Gemini (Grande janela de contexto)
 */
export async function analyzeWithGemini(text: string): Promise<EditalAnalysisResponse | null> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return null;

  try {
    console.log("Tentando análise via Google Gemini...");
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: `${SYSTEM_PROMPT}\n\nAnalise o seguinte texto de edital:\n\n${text.slice(0, 150000)}` },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    if (response && response.text) {
      const parsed = extractJSON(response.text);
      if (parsed) return parsed;
    }
  } catch (error) {
    console.error("Erro na chamada do Google Gemini:", error);
  }
  return null;
}

/**
 * 2. Análise com Anthropic Claude
 */
export async function analyzeWithClaude(text: string): Promise<EditalAnalysisResponse | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    console.log("Tentando análise via Anthropic Claude...");
    const anthropic = new Anthropic({ apiKey });
    const msg = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analise o edital a seguir:\n\n${text.slice(0, 80000)}`,
        },
      ],
    });

    const firstBlock = msg.content[0];
    if (firstBlock && firstBlock.type === "text") {
      const parsed = extractJSON(firstBlock.text);
      if (parsed) return parsed;
    }
  } catch (error) {
    console.error("Erro na chamada do Anthropic Claude:", error);
  }
  return null;
}

/**
 * 3. Análise com OpenAI (GPT-4o)
 */
export async function analyzeWithOpenAI(text: string): Promise<EditalAnalysisResponse | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    console.log("Tentando análise via OpenAI...");
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analise o edital a seguir:\n\n${text.slice(0, 80000)}` },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = extractJSON(content);
      if (parsed) return parsed;
    }
  } catch (error) {
    console.error("Erro na chamada da OpenAI:", error);
  }
  return null;
}

/**
 * Orquestrador Multi-AI com Failover automático
 */
export async function processEditalWithMultiAI(text: string): Promise<EditalAnalysisResponse> {
  // Tentativa 1: Google Gemini (mais rápido e suporta documentos longos)
  const geminiResult = await analyzeWithGemini(text);
  if (geminiResult) return geminiResult;

  // Tentativa 2: Anthropic Claude (alta precisão analítica)
  const claudeResult = await analyzeWithClaude(text);
  if (claudeResult) return claudeResult;

  // Tentativa 3: OpenAI GPT-4o
  const openAiResult = await analyzeWithOpenAI(text);
  if (openAiResult) return openAiResult;

  throw new Error(
    "Nenhum dos provedores de IA (Gemini, Claude, OpenAI) retornou uma resposta válida. Verifique as credenciais no .env.local."
  );
}
