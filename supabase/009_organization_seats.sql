-- =========================================================================
-- EDITALFLASH - MIGRATION 009: MULTI-USER & SEATS ENGINE (v1.2)
-- Compatibilidade: Supabase PostgreSQL + Edge Runtime (Cloudflare Pages)
-- Regra: Ponytail Ultra (Zero Over-engineering, Isolamento RLS Estrito)
-- =========================================================================

-- 1. EXTENDER A TABELA PROFILES COM SUPORTE A ORGANIZAÇÃO E SEATS
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'ADMIN' CHECK (role IN ('ADMIN', 'MEMBER')),
  ADD COLUMN IF NOT EXISTS max_seats INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_seats INTEGER DEFAULT 0;

-- Criar índices de performance para consultas de membros e permissões
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. TABELA DE CONVITES DE MEMBROS (TOKEN SEGURO)
CREATE TABLE IF NOT EXISTS public.organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invited_email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED')),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ativar e Forçar RLS na tabela de convites
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations FORCE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_org_invitations_token ON public.organization_invitations(token);
CREATE INDEX IF NOT EXISTS idx_org_invitations_admin ON public.organization_invitations(org_admin_id);

-- 3. POLÍTICAS RLS PARA ORGANIZATION_INVITATIONS
DROP POLICY IF EXISTS "Admins can view and manage their invitations" ON public.organization_invitations;
CREATE POLICY "Admins can view and manage their invitations"
    ON public.organization_invitations FOR ALL
    USING (auth.uid() = org_admin_id OR public.is_superadmin())
    WITH CHECK (auth.uid() = org_admin_id OR public.is_superadmin());

-- Permitir que convidados consultem o token durante o aceite do convite
DROP POLICY IF EXISTS "Anyone with valid token can view invitation" ON public.organization_invitations;
CREATE POLICY "Anyone with valid token can view invitation"
    ON public.organization_invitations FOR SELECT
    USING (status = 'PENDING' AND expires_at > NOW());

-- 4. ATUALIZAR RLS DE AUDITED_TENDERS (COMPARTILHAMENTO INTRA-ORGANIZAÇÃO)
-- Membros da mesma organização podem visualizar os editais auditados pelo titular ou outros membros
DROP POLICY IF EXISTS "Users can view own or org audits" ON public.audited_tenders;
CREATE POLICY "Users can view own or org audits"
    ON public.audited_tenders FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_superadmin()
        OR EXISTS (
            SELECT 1 FROM public.profiles p_viewer
            JOIN public.profiles p_owner ON (
                p_owner.id = audited_tenders.user_id 
                AND (
                    p_viewer.organization_id = p_owner.id 
                    OR p_viewer.id = p_owner.organization_id
                    OR (p_viewer.organization_id IS NOT NULL AND p_viewer.organization_id = p_owner.organization_id)
                )
            )
            WHERE p_viewer.id = auth.uid()
        )
    );

-- 5. ATUALIZAR RLS DE VAULT_DOCUMENTS (COFRE COMPARTILHADO DA ORGANIZAÇÃO)
DROP POLICY IF EXISTS "Users can view own or org docs" ON public.vault_documents;
CREATE POLICY "Users can view own or org docs"
    ON public.vault_documents FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_superadmin()
        OR EXISTS (
            SELECT 1 FROM public.profiles p_viewer
            JOIN public.profiles p_owner ON (
                p_owner.id = vault_documents.user_id 
                AND (
                    p_viewer.organization_id = p_owner.id 
                    OR p_viewer.id = p_owner.organization_id
                    OR (p_viewer.organization_id IS NOT NULL AND p_viewer.organization_id = p_owner.organization_id)
                )
            )
            WHERE p_viewer.id = auth.uid()
        )
    );

-- 6. POLÍTICA RLS PARA PAYMENTS: EXCLUSIVO ADMIN
-- Membros (MEMBER) NUNCA têm permissão de leitura ou alteração na tabela de pagamentos
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Admins can view own payments"
    ON public.payments FOR SELECT
    USING (
        (auth.uid() = user_id AND NOT EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'MEMBER'
        )) 
        OR public.is_superadmin()
    );
