-- =========================================================================
-- MIGRATION 003: CONCESSÃO DE PRIVILÉGIOS SUPERADMIN & FOUNDER (CNPJ 51.926.034/0001-42)
-- Plataforma: EditalFlash | SuperAdmin Global & Suporte Multitenant
-- =========================================================================

-- 1. Helper function para checagem de SuperAdmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' IN ('renan.oacruz@gmail.com', 'renanoacruz@gmail.com')
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Políticas RLS de SuperAdmin para visualização e suporte global de tenants
CREATE POLICY "Superadmin pode visualizar todos os tenants para suporte"
  ON public.tenants FOR SELECT
  USING (public.is_superadmin() OR auth.uid() = user_id);

CREATE POLICY "Superadmin pode visualizar documentos do cofre para auditoria de suporte"
  ON public.vault_documents FOR SELECT
  USING (
    public.is_superadmin() OR
    tenant_id IN (SELECT id FROM public.tenants WHERE user_id = auth.uid())
  );

CREATE POLICY "Superadmin pode visualizar todas as auditorias para suporte pericial"
  ON public.auditorias FOR SELECT
  USING (
    public.is_superadmin() OR
    tenant_id IN (SELECT id FROM public.tenants WHERE user_id = auth.uid())
  );

CREATE POLICY "Superadmin pode visualizar todos os certames auditados"
  ON public.audited_tenders FOR SELECT
  USING (public.is_superadmin() OR auth.uid() = user_id);

-- 3. Inserção / Upsert do Perfil Oficial do Fundador
INSERT INTO public.tenants (
  razao_social,
  nome_fantasia,
  cnpj,
  email,
  primary_vertical,
  plan,
  billing_cycle,
  analyses_limit,
  analyses_used,
  terms_accepted,
  terms_version
) VALUES (
  '51.926.034 RENAN OSCAR ARAUJO CRUZ',
  'EditalFlash HQ / Fundador',
  '51.926.034/0001-42',
  'renanoacruz@gmail.com',
  'Serviços Contínuos (Limpeza, Segurança, Manutenção)',
  'Pro',
  'annual',
  999999,
  0,
  TRUE,
  '2026-10-28'
) ON CONFLICT (cnpj) DO UPDATE SET
  razao_social = EXCLUDED.razao_social,
  email = EXCLUDED.email,
  primary_vertical = EXCLUDED.primary_vertical,
  plan = EXCLUDED.plan,
  analyses_limit = EXCLUDED.analyses_limit;
