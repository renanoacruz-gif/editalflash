/**
 * app/api/team/remove/route.ts
 * 
 * Revogação/Desvinculação de membro de equipe.
 * Exclusivo para administradores da organização.
 * Compatível com Cloudflare Pages / Edge Runtime.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateResult = checkRateLimit(`rate:team:remove:${clientIp}`, 15, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Muitas operações de equipe. Aguarde um momento." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { adminId, memberId } = body;

    if (!adminId || !memberId) {
      return NextResponse.json(
        { error: "adminId e memberId são obrigatórios." },
        { status: 400 }
      );
    }

    if (adminId === memberId) {
      return NextResponse.json(
        { error: "O administrador titular não pode remover a si mesmo da organização." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({
        success: true,
        isMock: true,
        message: "Membro removido com sucesso em ambiente de simulação.",
      });
    }

    // 1. Confirmar que quem está solicitando é ADMIN
    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, role")
      .eq("id", adminId)
      .single();

    if (!adminProfile || adminProfile.role === "MEMBER") {
      return NextResponse.json(
        { error: "Apenas o titular (ADMIN) pode remover assentos da equipe." },
        { status: 403 }
      );
    }

    // 2. Desvincular membro da organização
    const { data: memberProfile, error: memberErr } = await supabaseAdmin
      .from("profiles")
      .select("id, organization_id")
      .eq("id", memberId)
      .single();

    if (memberErr || !memberProfile) {
      return NextResponse.json(
        { error: "Membro não encontrado." },
        { status: 404 }
      );
    }

    if (memberProfile.organization_id !== adminId) {
      return NextResponse.json(
        { error: "Este usuário não pertence à sua organização." },
        { status: 403 }
      );
    }

    // Atualizar membro para voltar a ser conta avulsa independente
    const { error: updateErr } = await supabaseAdmin
      .from("profiles")
      .update({
        organization_id: null,
        role: "ADMIN", // Volta a ser dono do seu próprio perfil independente
      })
      .eq("id", memberId);

    if (updateErr) {
      return NextResponse.json(
        { error: "Erro ao desvincular membro: " + updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Membro desvinculado com sucesso. O assento agora está disponível para novo convite.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Falha interna ao remover membro: " + err.message },
      { status: 500 }
    );
  }
}
