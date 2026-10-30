import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, userEmail, banReason } = body;

    if (!action) {
      return NextResponse.json({ error: "Ação não informada." }, { status: 400 });
    }

    const nowIso = new Date().toISOString();

    // 1. APROVAR CONTA PENDING -> ACTIVE (SLA 5min)
    if (action === "approve") {
      if (isSupabaseConfigured) {
        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              account_status: "ACTIVE",
            })
            .eq("id", userId);
        } else if (userEmail) {
          await supabaseAdmin
            .from("profiles")
            .update({
              account_status: "ACTIVE",
            })
            .eq("email", userEmail.trim().toLowerCase());
        }
      }

      return NextResponse.json({
        success: true,
        message: "Conta aprovada com sucesso. Acesso ativado.",
        account_status: "ACTIVE",
      });
    }

    // 2. BANIR CONTA: Motivo obrigatório e revogação imediata de acesso
    if (action === "ban") {
      if (!banReason || banReason.trim().length === 0) {
        return NextResponse.json(
          { error: "É obrigatório fornecer o motivo para o banimento da conta." },
          { status: 400 }
        );
      }

      if (isSupabaseConfigured) {
        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              account_status: "BANNED",
              ban_reason: banReason.trim(),
              banned_at: nowIso,
            })
            .eq("id", userId);
        } else if (userEmail) {
          await supabaseAdmin
            .from("profiles")
            .update({
              account_status: "BANNED",
              ban_reason: banReason.trim(),
              banned_at: nowIso,
            })
            .eq("email", userEmail.trim().toLowerCase());
        }
      }

      return NextResponse.json({
        success: true,
        message: "Conta banida e acesso revogado imediatamente.",
        account_status: "BANNED",
        ban_reason: banReason.trim(),
      });
    }

    return NextResponse.json({ error: "Ação não reconhecida." }, { status: 400 });
  } catch (error: any) {
    console.error("[API/ADMIN/USER-ACTION] Erro:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao processar ação de administração." },
      { status: 500 }
    );
  }
}
