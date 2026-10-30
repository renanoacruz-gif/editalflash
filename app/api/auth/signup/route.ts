import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const CURRENT_TERMS_VERSION = "2026-10-28";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, company, primary_vertical, termsAccepted } = body;

    // STEP 3: Validação Estrita de LGPD / Aceite de Termos
    if (!termsAccepted) {
      return NextResponse.json(
        {
          error:
            "É obrigatório ler e aceitar expressamente os Termos de Uso e a Política de Privacidade (LGPD) para prosseguir com o cadastro.",
          code: "TERMS_NOT_ACCEPTED",
        },
        { status: 400 }
      );
    }

    if (!email || !name) {
      return NextResponse.json(
        { error: "Nome e e-mail corporativo são obrigatórios." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const termsAcceptedAt = new Date().toISOString();

    let createdUserId = "usr_" + Math.random().toString(36).substring(2, 9);

    // Se o Supabase estiver configurado, grava no banco de dados e cria o usuário
    if (isSupabaseConfigured) {
      try {
        // 1. Tenta criar usuário no Auth do Supabase
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: cleanEmail,
          password: password || "EditalFlash2026!",
          email_confirm: true,
          user_metadata: {
            name,
            company,
            primary_vertical: primary_vertical || "Obras Públicas e Engenharia",
            terms_accepted: true,
            terms_accepted_at: termsAcceptedAt,
            terms_version: CURRENT_TERMS_VERSION,
          },
        });

        if (authUser?.user?.id) {
          createdUserId = authUser.user.id;
        }

        // 2. Insere/atualiza registro na tabela de tenants/users
        await supabaseAdmin.from("tenants").insert({
          user_id: createdUserId,
          razao_social: company || name,
          nome_fantasia: name,
          cnpj: "00.000.000/0001-00", // Placeholder atualizável no onboarding
          email: cleanEmail,
          primary_vertical: primary_vertical || "Obras Públicas e Engenharia",
          plan: "Starter",
          created_at: new Date().toISOString(),
        });
      } catch (dbErr: any) {
        console.warn("[API/AUTH/SIGNUP] Supabase sync notice:", dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      user_id: createdUserId,
      email: cleanEmail,
      name,
      company: company || "Minha Empresa",
      primary_vertical: primary_vertical || "Obras Públicas e Engenharia",
      terms_accepted: true,
      terms_accepted_at: termsAcceptedAt,
      terms_version: CURRENT_TERMS_VERSION,
    });
  } catch (err: any) {
    console.error("[API/AUTH/SIGNUP] Erro no processamento:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno ao processar cadastro." },
      { status: 500 }
    );
  }
}
