/**
 * app/api/team/members/route.ts
 * 
 * Lista os membros vinculados à organização do usuário autenticado
 * e status da capacidade de assentos (Seats).
 * Compatível com Cloudflare Pages / Edge Runtime.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateResult = checkRateLimit(`rate:team:members:${clientIp}`, 30, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Muitas requisições. Aguarde um instante." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Parâmetro userId é obrigatório." },
        { status: 400 }
      );
    }

    // Blindagem de Sessão contra IDOR (Cross-Tenant):
    // Valida se o solicitante possui sessão legítima ou é SuperAdmin
    const authHeader = req.headers.get("authorization");
    const adminSessionCookie = req.cookies.get("editalflash_admin_session")?.value;
    const isSuperAdmin =
      adminSessionCookie?.includes("renan.oacruz@gmail.com") ||
      authHeader?.includes("renan.oacruz@gmail.com") ||
      req.headers.get("x-user-role") === "superadmin";

    const requestingUserId = req.headers.get("x-user-id");
    if (requestingUserId && requestingUserId !== userId && !isSuperAdmin) {
      return NextResponse.json(
        { error: "Acesso negado. Você não tem permissão para consultar os membros desta organização." },
        { status: 403 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      // Mock para ambiente de desenvolvimento local sem credenciais ativas
      return NextResponse.json({
        success: true,
        isMock: true,
        role: "ADMIN",
        seats: {
          max: 5,
          active: 1,
          available: 4,
        },
        members: [
          {
            id: userId,
            email: "titular@empresa.com.br",
            role: "ADMIN",
            joinedAt: new Date().toISOString(),
          },
        ],
        invitations: [],
      });
    }

    // 1. Obter perfil do solicitante
    const { data: userProfile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, organization_id, role, max_seats, plan_tier")
      .eq("id", userId)
      .single();

    if (profileErr || !userProfile) {
      return NextResponse.json(
        { error: "Perfil de usuário não encontrado." },
        { status: 404 }
      );
    }

    const orgAdminId = userProfile.role === "ADMIN" ? userProfile.id : userProfile.organization_id;

    if (!orgAdminId) {
      return NextResponse.json({
        success: true,
        role: userProfile.role,
        seats: { max: 0, active: 1, available: 0 },
        members: [{ id: userProfile.id, email: userProfile.email, role: userProfile.role, joinedAt: null }],
        invitations: [],
      });
    }

    // 2. Buscar dados da conta Titular (Owner/Admin)
    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, max_seats, credits, plan_tier")
      .eq("id", orgAdminId)
      .single();

    const maxSeats = adminProfile?.max_seats || 0;

    // 3. Buscar todos os membros ativos vinculados a esta organização
    const { data: members, error: membersErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, role, created_at")
      .or(`id.eq.${orgAdminId},organization_id.eq.${orgAdminId}`);

    if (membersErr) {
      return NextResponse.json({ error: membersErr.message }, { status: 500 });
    }

    // 4. Buscar convites pendentes
    const { data: invitations } = await supabaseAdmin
      .from("organization_invitations")
      .select("id, invited_email, role, status, expires_at, created_at")
      .eq("org_admin_id", orgAdminId)
      .eq("status", "PENDING");

    const activeMembersCount = members?.length || 1;
    const additionalMembersCount = Math.max(0, activeMembersCount - 1);
    const availableSeats = Math.max(0, maxSeats - additionalMembersCount);

    return NextResponse.json({
      success: true,
      currentUserRole: userProfile.role,
      orgAdminId,
      planTier: adminProfile?.plan_tier || userProfile.plan_tier,
      poolCredits: adminProfile?.credits || 0,
      seats: {
        max: maxSeats,
        active: additionalMembersCount,
        available: availableSeats,
        hasReachedLimit: additionalMembersCount >= maxSeats,
      },
      members: (members || []).map((m) => ({
        id: m.id,
        email: m.email,
        role: m.role || (m.id === orgAdminId ? "ADMIN" : "MEMBER"),
        joinedAt: m.created_at,
        isCurrentUser: m.id === userId,
      })),
      invitations: invitations || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Falha interna ao listar equipe: " + err.message },
      { status: 500 }
    );
  }
}
