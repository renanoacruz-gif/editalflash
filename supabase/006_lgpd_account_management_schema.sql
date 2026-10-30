-- =========================================================================
-- EDITALFLASH - MIGRATION 006: LGPD, GESTÃO DE CONTA E POLÍTICAS DE ACESSO
-- Plataforma: EditalFlash (Lei 14.133/2021)
-- =========================================================================

-- 1. Campos de Governança LGPD, Ciclo de Vida da Conta e Telefonia em profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS terms_version TEXT DEFAULT '2026-10-28',
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'PENDING_APPROVAL' CHECK (account_status IN ('PENDING_APPROVAL', 'ACTIVE', 'PAUSED', 'BANNED', 'DELETED')),
ADD COLUMN IF NOT EXISTS ban_reason TEXT,
ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'ACTIVE' CHECK (subscription_status IN ('ACTIVE', 'PAUSED', 'CANCELLED')),
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS pause_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Garantir Soft-Delete na tabela payments para auditoria contábil e fiscal
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS anonymized_at TIMESTAMPTZ;

-- Desvincular chave estrangeira estrita de payments para profiles caso haja ON DELETE CASCADE,
-- pois payments deve manter histórico financeiro auditável (soft delete) mesmo após exclusão do perfil
ALTER TABLE public.payments
DROP CONSTRAINT IF EXISTS payments_user_id_fkey;

ALTER TABLE public.payments
ADD CONSTRAINT payments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 3. Garantir Hard Delete com CASCADE em audited_tenders e vault_documents
ALTER TABLE public.audited_tenders
DROP CONSTRAINT IF EXISTS audited_tenders_user_id_fkey;

ALTER TABLE public.audited_tenders
ADD CONSTRAINT audited_tenders_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.vault_documents
DROP CONSTRAINT IF EXISTS vault_documents_user_id_fkey;

ALTER TABLE public.vault_documents
ADD CONSTRAINT vault_documents_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 4. Função RLS e Políticas de Segurança Granular
-- Apenas usuários ativos (não banidos ou deletados) podem acessar suas auditorias e documentos
DROP POLICY IF EXISTS "Users can view own audits" ON public.audited_tenders;
CREATE POLICY "Users can view own audits"
    ON public.audited_tenders FOR SELECT
    USING (
      (auth.uid() = user_id AND EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.account_status IN ('ACTIVE', 'PENDING_APPROVAL', 'PAUSED')
      )) OR public.is_superadmin()
    );

DROP POLICY IF EXISTS "Users can view own docs" ON public.vault_documents;
CREATE POLICY "Users can view own docs"
    ON public.vault_documents FOR SELECT
    USING (
      (auth.uid() = user_id AND EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.account_status IN ('ACTIVE', 'PENDING_APPROVAL', 'PAUSED')
      )) OR public.is_superadmin()
    );

-- Atualização na visualização de pagamentos
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (
      (auth.uid() = user_id AND is_deleted = FALSE) OR public.is_superadmin()
    );

-- Recarregar schema cache do PostgREST
NOTIFY pgrst, 'reload schema';
