/**
 * app/api/health/route.ts
 * 
 * Health Check e Monitoramento de Conectividade de Produção.
 * Retorna status 200 OK se os serviços essenciais estiverem operacionais,
 * ou status 503 Service Unavailable se houver degradação crítica.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { CircuitBreaker } from "@/lib/circuit-breaker";

export async function GET(req: NextRequest) {
  const start = performance.now();
  const checks: Record<string, { status: "UP" | "DOWN" | "DEGRADED"; latencyMs?: number; message?: string }> = {};

  let isHealthy = true;

  // 1. Verificação de Conectividade com Supabase
  if (isSupabaseConfigured) {
    const dbStart = performance.now();
    try {
      const { error } = await supabaseAdmin.from("profiles").select("id").limit(1);
      const dbLatency = Math.round(performance.now() - dbStart);
      if (error) {
        checks.database = { status: "DEGRADED", latencyMs: dbLatency, message: error.message };
      } else {
        checks.database = { status: "UP", latencyMs: dbLatency };
      }
    } catch (err: any) {
      checks.database = { status: "DOWN", message: err?.message || "Erro de conexão" };
      isHealthy = false;
    }
  } else {
    checks.database = { status: "UP", message: "Modo Local / Mock Ativo" };
  }

  // 2. Status dos Circuit Breakers
  checks.circuit_pagou = {
    status: CircuitBreaker.getStatus("pagou_ai") === "OPEN" ? "DEGRADED" : "UP",
  };
  checks.circuit_pncp = {
    status: CircuitBreaker.getStatus("pncp_gov") === "OPEN" ? "DEGRADED" : "UP",
  };

  const totalDurationMs = Math.round(performance.now() - start);

  const payload = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime ? process.uptime() : 0),
    version: "1.2.0",
    totalDurationMs,
    checks,
  };

  return NextResponse.json(payload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
