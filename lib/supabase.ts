/**
 * lib/supabase.ts
 * 
 * Camada de Integração Oficial do Supabase para o EditalFlash.
 * - Suporte a fallback seguro no modo offline/desenvolvimento local.
 * - Cliente público anônimo com Row-Level Security (RLS) habilitado.
 * - Cliente administrativo com service_role para operações de SuperAdmin/Webhooks.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder-project")
);

// Cliente público para o browser e Server Components (respeita RLS por usuário)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Cliente administrativo para rotas de backend (Webhooks, SuperAdmin, Batch Jobs)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
