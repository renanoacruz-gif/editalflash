/**
 * app/api/team/accept-invite/route.ts
 * 
 * Validação de token e aceitação de convite de organização.
 * Vincula o usuário autenticado à organization_id do titular com role 'MEMBER'.
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

    const rateResult = checkRateLimit(`rate:team:accept:${clientIp}`, 10, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde um instante." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { token, userId } = body;

    if (!token || !userId) {
      return NextResponse.json(
        { error: "Token e userId são obrigatórios para ingressar na equipe." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json({
        success: true,
        isMock: true,
        message: "Convite aceito com sucesso em ambiente de simulação.",
      });
    }

    // 1. Localizar convite válido
    const { data: invite, error: inviteErr } = await supabaseAdmin
      .from("organization_invitations")
      .select("id, org_admin_id, invited_email, role, status, expires_at")
      .eq("token", token.trim())
      .single();

    if (inviteErr || !invite) {
      return NextResponse.json(
        { error: "Convite não encontrado ou inválido." },
        { status: 404 }
      );
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: `Este convite já foi ${invite.status.toLowerCase()}.` },
        { status: 400 }
      );
    }

    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Este convite expirou. Peça ao administrador para emitir um novo." },
        { status: 410 }
      );
    }

    // 2. Verificar se a organização ainda tem capacidade de assentos
    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, max_seats")
      .eq("id", invite.org_admin_id)
      .single();

    const maxAllowed = Math.min(5, adminProfile?.max_seats || 0);

    const { data: existingMembers } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("organization_id", invite.org_admin_id);

    if ((existingMembers?.length || 0) >= maxAllowed) {
      return NextResponse.json(
        { error: "A organização atingiu o limite de assentos disponíveis no momento." },
        { status: 403 }
      );
    }

    // 3. Vincular usuário logado à organização
    const { error: profileUpdateErr } = await supabaseAdmin
      .from("profiles")
      .update({
        organization_id: invite.org_admin_id,
        role: "MEMBER",
      })
      .eq("id", userId);

    if (profileUpdateErr) {
      return NextResponse.json(
        { error: "Erro ao vincular membro ao perfil: " + profileUpdateErr.message },
        { status: 500 }
      );
    }

    // 4. Marcar convite como ACCEPTED
    await supabaseAdmin
      .from("organization_invitations")
      .update({ status: "ACCEPTED" })
      .eq("id", invite.id);

    return NextResponse.json({
      success: true,
      orgAdminId: invite.org_admin_id,
      role: "MEMBER",
      message: "Bem-vindo à equipe! Você agora compartilha o cofre e créditos da organização.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Falha interna ao aceitar convite: " + err.message },
      { status: 500 }
    );
  }
}
