/**
 * app/api/team/invite/route.ts
 * 
 * Criação de convite para membro da equipe (Seat Adicional).
 * Valida permissão ADMIN, limite de max_seats e gera token com Web Crypto.
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

    const rateResult = checkRateLimit(`rate:team:invite:${clientIp}`, 10, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Limite de convites por minuto excedido. Aguarde." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { adminId, invitedEmail, role = "MEMBER" } = body;

    if (!adminId || !invitedEmail) {
      return NextResponse.json(
        { error: "adminId e invitedEmail são obrigatórios." },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(invitedEmail.trim())) {
      return NextResponse.json(
        { error: "Endereço de e-mail inválido." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      // Fallback para desenvolvimento local
      const mockToken = "inv_" + Math.random().toString(36).substring(2, 12);
      return NextResponse.json({
        success: true,
        isMock: true,
        inviteUrl: `/signup?invite=${mockToken}`,
        token: mockToken,
        message: "Convite gerado em ambiente de desenvolvimento local.",
      });
    }

    // 1. Verificar se o solicitante é ADMIN da conta
    const { data: adminProfile, error: adminErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, role, max_seats, active_seats, plan_tier")
      .eq("id", adminId)
      .single();

    if (adminErr || !adminProfile) {
      return NextResponse.json(
        { error: "Perfil de administrador não encontrado." },
        { status: 404 }
      );
    }

    if (adminProfile.role === "MEMBER") {
      return NextResponse.json(
        { error: "Apenas o titular (ADMIN) pode convidar novos membros." },
        { status: 403 }
      );
    }

    const maxAllowedSeats = Math.min(5, adminProfile.max_seats || 0);

    // 2. Verificar quantos membros ativos já existem
    const { data: currentMembers } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("organization_id", adminId);

    const activeSeatsCount = currentMembers?.length || 0;

    if (activeSeatsCount >= maxAllowedSeats) {
      return NextResponse.json(
        {
          error: `Limite de assentos atingido (${activeSeatsCount}/${maxAllowedSeats}). Contrate assentos adicionais no painel para prosseguir.`,
          currentSeats: activeSeatsCount,
          maxSeats: maxAllowedSeats,
        },
        { status: 403 }
      );
    }

    // 3. Gerar token criptográfico compatível com Edge Runtime
    const randomBytes = new Uint8Array(24);
    crypto.getRandomValues(randomBytes);
    const token = Array.from(randomBytes, (b) => b.toString(16).padStart(2, "0")).join("");

    // 4. Salvar convite na tabela organization_invitations
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 dias

    const { data: inviteRecord, error: inviteErr } = await supabaseAdmin
      .from("organization_invitations")
      .insert({
        org_admin_id: adminId,
        invited_email: invitedEmail.trim().toLowerCase(),
        token,
        role: role === "ADMIN" ? "ADMIN" : "MEMBER",
        status: "PENDING",
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (inviteErr) {
      return NextResponse.json(
        { error: "Erro ao gravar convite: " + inviteErr.message },
        { status: 500 }
      );
    }

    const inviteUrl = `/signup?invite=${token}&email=${encodeURIComponent(invitedEmail.trim().toLowerCase())}`;

    return NextResponse.json({
      success: true,
      invitationId: inviteRecord.id,
      token,
      inviteUrl,
      expiresAt,
      message: "Convite criado com sucesso.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Falha interna ao criar convite: " + err.message },
      { status: 500 }
    );
  }
}
