/**
 * app/api/analyze/route.ts
 * 
 * Rota de API Next.js App Router para Processamento de Editais em PDF.
 * - Rate Limiting Estrito: Máximo 3 req/minuto por identificador (IP / Token) com HTTP 429 e Retry-After
 * - Validação Rigorosa: Validação de MIME type, magic bytes (%PDF-) e limite de 15MB
 * - Proteção de Path Traversal e Sanitização
 * - Encaminhamento ao motor de conformidade Art. 62
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeEdital } from "@/lib/ai-manager";
import { PrimaryVertical } from "@/lib/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateUploadedPdf, PrimaryVerticalEnum } from "@/lib/validations";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Identificação do cliente e Rate Limiting (Máx 3 req/min para proteger margem LLM + OCR)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    
    const authHeader = req.headers.get("authorization") || req.cookies.get("editalflash_admin_session")?.value;
    const rateLimitKey = `rate:analyze:${authHeader ? authHeader.slice(-16) : clientIp}`;

    const rateResult = checkRateLimit(rateLimitKey, 3, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        {
          error: "Limite de auditorias excedido (máximo 3 requisições por minuto). Aguarde para preservar a cota pericial.",
          retryAfter: rateResult.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateResult.resetSeconds),
            "X-RateLimit-Limit": String(rateResult.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type inválido. A requisição deve ser multipart/form-data." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado no campo 'file'. Por favor, anexe um arquivo PDF." },
        { status: 400 }
      );
    }

    // 2. Validação Backend de Cota de Créditos do Usuário (Se autenticado com Supabase)
    const userId = req.headers.get("x-user-id");
    const isAdminUser =
      authHeader?.includes("renan.oacruz@gmail.com") ||
      authHeader?.includes("renanoacruz@gmail.com") ||
      req.cookies.get("editalflash_admin_session")?.value?.includes("renan.oacruz@gmail.com");

    if (isSupabaseConfigured && userId && !isAdminUser) {
      try {
        const { data: tenantData } = await supabaseAdmin
          .from("tenants")
          .select("analyses_limit, analyses_used, plan")
          .eq("user_id", userId)
          .single();

        if (tenantData) {
          const limit = tenantData.analyses_limit || 5;
          const used = tenantData.analyses_used || 0;
          if (used >= limit) {
            return NextResponse.json(
              {
                error: "Você atingiu o limite de auditorias do seu plano atual. Adquira créditos adicionais ou faça upgrade para continuar.",
                code: "CREDITS_EXHAUSTED",
                limit,
                used,
              },
              { status: 402 } // Payment Required
            );
          }

          // Debita 1 crédito no banco de dados
          await supabaseAdmin
            .from("tenants")
            .update({
              analyses_used: used + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
      } catch (errCredit: any) {
        console.warn("[API/ANALYZE] Aviso na checagem de cota Supabase:", errCredit?.message);
      }
    }

    // 3. Validação Rigorosa de Upload (MIME, Magic Number, 15MB e Sanitização)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validateUploadedPdf(buffer, file.name, file.type);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let extractedText = "";

    try {
      // Import dinâmico do pdf-parse compatível com runtime Node.js
      const pdfModule: any = await import("pdf-parse");
      const parseFunction = pdfModule?.default || pdfModule;
      const pdfData = await parseFunction(buffer);
      extractedText = pdfData?.text || "";
    } catch (parseError: any) {
      console.warn("[API/ANALYZE] Aviso na extração estruturada do PDF:", parseError?.message);
      // Fallback seguro de extração textual
      const rawString = buffer.toString("latin1");
      const matches = rawString.match(/[A-Za-z0-9À-ÿ\s.,;:/\-–—]{15,}/g);
      if (matches && matches.length > 0) {
        extractedText = matches.join(" ");
      }
    }

    // 3. Verificação de conteúdo textual legível
    if (!extractedText || extractedText.trim().length < 25) {
      return NextResponse.json(
        {
          error:
            "Não foi possível extrair texto legível deste documento. Se o PDF for uma digitalização (imagem escaneada), processe-o com OCR antes do envio.",
        },
        { status: 422 }
      );
    }

    // 4. Validação e sanitização da vertical informada
    const userVerticalHeader = req.headers.get("x-user-vertical");
    const formVertical = formData.get("vertical") as string | null;
    const requestedVertical = formVertical || userVerticalHeader;

    let vertical: PrimaryVertical = "Obras Públicas e Engenharia";
    if (requestedVertical) {
      const parsedVertical = PrimaryVerticalEnum.safeParse(requestedVertical);
      if (parsedVertical.success) {
        vertical = parsedVertical.data;
      }
    }

    // 5. Execução do fluxo em 2 etapas: Classificação do Edital + Injeção de Regras
    const analysisResult = await analyzeEdital(extractedText, vertical);

    // 6. Persistência Cloud na tabela audited_tenders (Step 2 do Plano de Migração)
    let analysisId = "anls_" + randomUUID();
    const userIdHeader = req.headers.get("x-user-id");
    const editalTitle = analysisResult.dados_gerais?.numero_edital || file.name || "Edital de Licitação";
    const editalPncpId = analysisResult.dados_gerais?.numero_edital || null;
    const verdict = analysisResult.veredito_habilitacao || "PASSA";

    if (isSupabaseConfigured && userIdHeader) {
      try {
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from("audited_tenders")
          .insert({
            user_id: userIdHeader,
            edital_pncp_id: editalPncpId,
            edital_title: editalTitle,
            verdict: verdict,
            report_data: analysisResult,
            segmento: vertical,
          })
          .select("id")
          .single();

        if (insertError) {
          console.warn("[API/ANALYZE] Supabase insert warning:", insertError.message);
        } else if (inserted?.id) {
          analysisId = inserted.id;
        }
      } catch (dbErr: any) {
        console.warn("[API/ANALYZE] Falha na gravação do histórico em nuvem:", dbErr?.message);
      }
    }

    const responsePayload = {
      ...analysisResult,
      analysis_id: analysisId,
    };

    return NextResponse.json(responsePayload, {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(rateResult.limit),
        "X-RateLimit-Remaining": String(rateResult.remaining),
      },
    });
  } catch (error: any) {
    console.error("[API/ANALYZE] Erro crítico no processamento:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Ocorreu um erro interno ao processar e analisar o edital.",
      },
      { status: 500 }
    );
  }
}
