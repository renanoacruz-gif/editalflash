-- =========================================================================
-- EDITALFLASH - PATCH CRÍTICO DE SEGURANÇA E BLINDAGEM RLS (v1.2)
-- Execute este script no SQL Editor do Supabase (projeto: eucdxjezctovtoozbqtt)
-- =========================================================================

-- 1. REATIVAR ROW LEVEL SECURITY RIGOROSO EM TODAS AS TABELAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audited_tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- FORÇAR RLS PARA PROPRIETÁRIO DA TABELA (EVITA BYPASS INDESEJADO)
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audited_tenders FORCE ROW LEVEL SECURITY;
ALTER TABLE public.vault_documents FORCE ROW LEVEL SECURITY;
ALTER TABLE public.payments FORCE ROW LEVEL SECURITY;

-- 2. RECRIAR FUNÇÃO DE SUPERADMIN SEGURA
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    COALESCE(auth.jwt() ->> 'email', '') IN ('renan.oacruz@gmail.com', 'renanoacruz@gmail.com')
    OR COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- 3. POLÍTICAS BLINDADAS PARA PROFILES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Profiles visualizaveis pelo proprio usuario" ON public.profiles;
DROP POLICY IF EXISTS "Profiles atualizaveis pelo proprio usuario" ON public.profiles;
DROP POLICY IF EXISTS "Profiles inseriveis no signup" ON public.profiles;
DROP POLICY IF EXISTS "Profiles deletaveis apenas pelo proprio usuario" ON public.profiles;
DROP POLICY IF EXISTS "allow_all" ON public.profiles;

CREATE POLICY "Profiles visualizaveis pelo proprio usuario"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_superadmin());

CREATE POLICY "Profiles atualizaveis pelo proprio usuario"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_superadmin())
    WITH CHECK (auth.uid() = id OR public.is_superadmin());

CREATE POLICY "Profiles inseriveis no signup"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_superadmin());

CREATE POLICY "Profiles deletaveis apenas pelo proprio usuario"
    ON public.profiles FOR DELETE
    USING (auth.uid() = id OR public.is_superadmin());

-- -------------------------------------------------------------------------
-- 4. POLÍTICAS BLINDADAS PARA AUDITED_TENDERS
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own audits" ON public.audited_tenders;
DROP POLICY IF EXISTS "Users can insert own audits" ON public.audited_tenders;
DROP POLICY IF EXISTS "Users can update own audits" ON public.audited_tenders;
DROP POLICY IF EXISTS "Users can delete own audits" ON public.audited_tenders;
DROP POLICY IF EXISTS "allow_all" ON public.audited_tenders;

CREATE POLICY "Users can view own audits"
    ON public.audited_tenders FOR SELECT
    USING (auth.uid() = user_id OR public.is_superadmin());

CREATE POLICY "Users can insert own audits"
    ON public.audited_tenders FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

CREATE POLICY "Users can update own audits"
    ON public.audited_tenders FOR UPDATE
    USING (auth.uid() = user_id OR public.is_superadmin())
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

CREATE POLICY "Users can delete own audits"
    ON public.audited_tenders FOR DELETE
    USING (auth.uid() = user_id OR public.is_superadmin());

-- -------------------------------------------------------------------------
-- 5. POLÍTICAS BLINDADAS PARA VAULT_DOCUMENTS
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own docs" ON public.vault_documents;
DROP POLICY IF EXISTS "Users can insert own docs" ON public.vault_documents;
DROP POLICY IF EXISTS "Users can update own docs" ON public.vault_documents;
DROP POLICY IF EXISTS "Users can delete own docs" ON public.vault_documents;
DROP POLICY IF EXISTS "allow_all" ON public.vault_documents;

CREATE POLICY "Users can view own docs"
    ON public.vault_documents FOR SELECT
    USING (auth.uid() = user_id OR public.is_superadmin());

CREATE POLICY "Users can insert own docs"
    ON public.vault_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

CREATE POLICY "Users can update own docs"
    ON public.vault_documents FOR UPDATE
    USING (auth.uid() = user_id OR public.is_superadmin())
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

CREATE POLICY "Users can delete own docs"
    ON public.vault_documents FOR DELETE
    USING (auth.uid() = user_id OR public.is_superadmin());

-- -------------------------------------------------------------------------
-- 6. POLÍTICAS BLINDADAS PARA PAYMENTS
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Superadmin full control over payments" ON public.payments;
DROP POLICY IF EXISTS "allow_all" ON public.payments;

CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING ((auth.uid() = user_id AND COALESCE(is_deleted, false) = false) OR public.is_superadmin());

CREATE POLICY "Users can insert own payments"
    ON public.payments FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

CREATE POLICY "Superadmin full control over payments"
    ON public.payments FOR ALL
    USING (public.is_superadmin());

-- Recarrega o cache do PostgREST
NOTIFY pgrst, 'reload schema';
