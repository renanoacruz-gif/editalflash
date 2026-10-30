-- =========================================================================
-- EDITALFLASH - SQL MESTRE DE PRODUÇÃO
-- Plataforma: EditalFlash (Lei 14.133/2021)
-- Tabelas: profiles, audited_tenders, vault_documents, payments
-- Recursos: Row Level Security (RLS) habilitado, Funções de SuperAdmin, Triggers
-- =========================================================================

-- 1. Extensões Essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Função Auxiliar de SuperAdmin (Bypass seguro para suporte e governança)
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' IN ('renan.oacruz@gmail.com', 'renanoacruz@gmail.com')
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- TABELA 1: PROFILES (Gestão de Contas, CNPJ, Verticais e Planos)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    company_name TEXT,
    cnpj TEXT,
    role TEXT DEFAULT 'tenant_user' CHECK (role IN ('superadmin', 'tenant_user')),
    primary_vertical TEXT DEFAULT 'Serviços Contínuos (Limpeza, Segurança, Manutenção)',
    plan TEXT DEFAULT 'Starter' CHECK (plan IN ('Starter', 'Pro', 'Enterprise')),
    plan_status TEXT DEFAULT 'inactive' CHECK (plan_status IN ('active', 'active_pro', 'trial', 'past_due', 'canceled', 'inactive')),
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
    analyses_used INT DEFAULT 0,
    analyses_limit INT DEFAULT 5,
    terms_accepted BOOLEAN DEFAULT TRUE,
    terms_accepted_at TIMESTAMPTZ DEFAULT NOW(),
    terms_version TEXT DEFAULT '2026-10-28',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles visualizaveis pelo proprio usuario" ON public.profiles;
CREATE POLICY "Profiles visualizaveis pelo proprio usuario"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_superadmin());

DROP POLICY IF EXISTS "Profiles atualizaveis pelo proprio usuario" ON public.profiles;
CREATE POLICY "Profiles atualizaveis pelo proprio usuario"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_superadmin())
    WITH CHECK (auth.uid() = id OR public.is_superadmin());

DROP POLICY IF EXISTS "Profiles inseriveis no signup" ON public.profiles;
CREATE POLICY "Profiles inseriveis no signup"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_superadmin());

-- -------------------------------------------------------------------------
-- TABELA 2: AUDITED_TENDERS (Auditorias de Editais em Nuvem & Desfecho ROI)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audited_tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    edital_pncp_id TEXT,
    edital_title TEXT NOT NULL,
    verdict TEXT CHECK (verdict IN ('PASSA', 'RESSALVA', 'ELIMINATORIA', 'ELIMINATÓRIA', 'REVISAO_HUMANA_NECESSARIA', 'REVISÃO_HUMANA')),
    analysis_date TIMESTAMPTZ DEFAULT NOW(),
    pdf_url TEXT,
    report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    desfecho TEXT DEFAULT 'EM_ANDAMENTO' CHECK (desfecho IN ('EM_ANDAMENTO', 'GANHA', 'PERDIDA', 'REVOGADA_ANULADA', 'NAO_DISPUTADA')),
    valor_homologado_ganha NUMERIC(15,2),
    motivo_perda TEXT,
    segmento TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audited_tenders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own audits" ON public.audited_tenders;
CREATE POLICY "Users can view own audits"
    ON public.audited_tenders FOR SELECT
    USING (auth.uid() = user_id OR public.is_superadmin());

DROP POLICY IF EXISTS "Users can insert own audits" ON public.audited_tenders;
CREATE POLICY "Users can insert own audits"
    ON public.audited_tenders FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

DROP POLICY IF EXISTS "Users can update own audits" ON public.audited_tenders;
CREATE POLICY "Users can update own audits"
    ON public.audited_tenders FOR UPDATE
    USING (auth.uid() = user_id OR public.is_superadmin())
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

DROP POLICY IF EXISTS "Users can delete own audits" ON public.audited_tenders;
CREATE POLICY "Users can delete own audits"
    ON public.audited_tenders FOR DELETE
    USING (auth.uid() = user_id OR public.is_superadmin());

-- -------------------------------------------------------------------------
-- TABELA 3: VAULT_DOCUMENTS (Cofre de Documentos, CNDs e Acervo Art. 62)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vault_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    doc_type TEXT DEFAULT 'OTHER', -- 'CND_FEDERAL', 'FGTS', 'BALANCO', 'ATESTADO', 'OTHER'
    tipo TEXT,
    emissor TEXT,
    expiration_date DATE,
    data_emissao DATE DEFAULT CURRENT_DATE,
    data_validade DATE,
    status TEXT DEFAULT 'VALIDO' CHECK (status IN ('VALIDO', 'EXPIRANDO', 'VENCIDO')),
    file_size INT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.vault_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own docs" ON public.vault_documents;
CREATE POLICY "Users can view own docs"
    ON public.vault_documents FOR SELECT
    USING (auth.uid() = user_id OR public.is_superadmin());

DROP POLICY IF EXISTS "Users can insert own docs" ON public.vault_documents;
CREATE POLICY "Users can insert own docs"
    ON public.vault_documents FOR INSERT
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

DROP POLICY IF EXISTS "Users can update own docs" ON public.vault_documents;
CREATE POLICY "Users can update own docs"
    ON public.vault_documents FOR UPDATE
    USING (auth.uid() = user_id OR public.is_superadmin())
    WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

DROP POLICY IF EXISTS "Users can delete own docs" ON public.vault_documents;
CREATE POLICY "Users can delete own docs"
    ON public.vault_documents FOR DELETE
    USING (auth.uid() = user_id OR public.is_superadmin());

-- -------------------------------------------------------------------------
-- TABELA 4: PAYMENTS (Histórico de Pagamentos, Assinaturas e Webhooks PIX)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_cnpj TEXT,
    provider TEXT DEFAULT 'pagou_ai', -- 'pagou_ai' | 'sandbox'
    payment_method TEXT DEFAULT 'pix' CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
    transaction_id TEXT UNIQUE,
    checkout_id TEXT,
    amount_cents INT NOT NULL, -- Valor em centavos (ex: 19700 = R$ 197,00)
    currency TEXT DEFAULT 'BRL',
    plan_tier TEXT DEFAULT 'Pro' CHECK (plan_tier IN ('Starter', 'Pro', 'Enterprise', 'Credits_5')),
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual', 'once')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'approved', 'failed', 'refunded', 'canceled')),
    pix_qr_code TEXT,
    pix_qr_code_url TEXT,
    pix_copy_paste TEXT,
    paid_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id OR customer_email = (auth.jwt() ->> 'email') OR public.is_superadmin());

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments"
    ON public.payments FOR INSERT
    WITH CHECK (auth.uid() = user_id OR customer_email = (auth.jwt() ->> 'email') OR public.is_superadmin());

DROP POLICY IF EXISTS "Superadmin full control over payments" ON public.payments;
CREATE POLICY "Superadmin full control over payments"
    ON public.payments FOR ALL
    USING (public.is_superadmin());

-- -------------------------------------------------------------------------
-- ÍNDICES DE PERFORMANCE E INTEGRIDADE
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_cnpj ON public.profiles(cnpj);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_audited_tenders_user_id ON public.audited_tenders(user_id);
CREATE INDEX IF NOT EXISTS idx_audited_tenders_created_at ON public.audited_tenders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vault_documents_user_id ON public.vault_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_documents_expiration ON public.vault_documents(expiration_date);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- -------------------------------------------------------------------------
-- TRIGGER AUTOMÁTICO: CRIAÇÃO DE PROFILE NO SIGNUP SUPABASE AUTH
-- -------------------------------------------------------------------------
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
    analyses_limit
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE WHEN v_is_founder THEN '51.926.034 RENAN OSCAR ARAUJO CRUZ' ELSE COALESCE(NEW.raw_user_meta_data->>'company_name', 'Minha Empresa Licitante') END,
    CASE WHEN v_is_founder THEN '51.926.034/0001-42' ELSE NEW.raw_user_meta_data->>'cnpj' END,
    CASE WHEN v_is_founder THEN 'superadmin' ELSE 'tenant_user' END,
    'Serviços Contínuos (Limpeza, Segurança, Manutenção)',
    CASE WHEN v_is_founder THEN 'Pro' ELSE 'Starter' END,
    CASE WHEN v_is_founder THEN 'active_pro' ELSE 'inactive' END,
    CASE WHEN v_is_founder THEN 999999 ELSE 5 END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    cnpj = EXCLUDED.cnpj,
    role = EXCLUDED.role,
    plan_status = EXCLUDED.plan_status;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
