-- ==============================================================================
-- EDITALFLASH - REPARO E ALINHAMENTO DEFINITIVO DA TABELA PROFILES & TRIGGER
-- ==============================================================================

-- 1. Adicionar todas as colunas essenciais que faltam na tabela profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'tenant_user',
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'Starter',
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS analyses_used INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS analyses_limit INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS terms_version TEXT DEFAULT '2026-10-28',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Recriar/Atualizar a função e trigger de criação automática de usuário no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_is_founder BOOLEAN;
BEGIN
  v_is_founder := (NEW.email IN ('renan.oacruz@gmail.com', 'renanoacruz@gmail.com'));

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    company_name,
    cnpj,
    role,
    primary_vertical,
    plan,
    plan_status,
    analyses_used,
    analyses_limit,
    terms_accepted,
    terms_accepted_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE WHEN v_is_founder THEN '51.926.034 RENAN OSCAR ARAUJO CRUZ' ELSE COALESCE(NEW.raw_user_meta_data->>'company_name', 'Minha Empresa Licitante') END,
    CASE WHEN v_is_founder THEN '51.926.034/0001-42' ELSE NEW.raw_user_meta_data->>'cnpj' END,
    CASE WHEN v_is_founder THEN 'superadmin' ELSE 'tenant_user' END,
    COALESCE(NEW.raw_user_meta_data->>'primary_vertical', 'Obras Públicas e Engenharia'),
    CASE WHEN v_is_founder THEN 'Pro' ELSE 'Starter' END,
    CASE WHEN v_is_founder THEN 'active' ELSE 'active' END,
    0,
    CASE WHEN v_is_founder THEN 999999 ELSE 1 END,
    TRUE,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    cnpj = EXCLUDED.cnpj,
    role = EXCLUDED.role,
    plan_status = EXCLUDED.plan_status,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Assegurar que o trigger está devidamente apontado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Notificar PostgREST para recarregar o schema cache imediatamente
NOTIFY pgrst, 'reload schema';
