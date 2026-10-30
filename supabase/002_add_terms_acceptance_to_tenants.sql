-- =========================================================================
-- MIGRATION: 002_add_terms_acceptance_to_tenants.sql
-- Governança LGPD e Versionamento de Aceite de Termos de Uso
-- =========================================================================

ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS terms_version VARCHAR(20) DEFAULT '2026-10-28';

COMMENT ON COLUMN public.tenants.terms_version IS 'Versão dos Termos de Uso e Política de Privacidade aceitos pelo usuário corporativo.';
COMMENT ON COLUMN public.tenants.terms_accepted_at IS 'Carimbo de data/hora oficial do consentimento LGPD registrado no cadastro.';
