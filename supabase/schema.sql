-- =========================================================================
-- ESQUEMA DE BANCO DE DADOS POSTGRESQL + ROW-LEVEL SECURITY (RLS) - SUPABASE
-- Plataforma: EditalFlash | Auditoria Preventiva de Habilitação (Lei 14.133/21)
-- =========================================================================

-- 1. Extensões essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Tenants / Empresas Licitantes
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(30),
    primary_vertical VARCHAR(100) DEFAULT 'Obras Públicas e Engenharia',
    plan VARCHAR(50) DEFAULT 'Starter', -- 'Starter', 'Pro', 'Enterprise'
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'annual'
    analyses_limit INT DEFAULT 5,
    analyses_used INT DEFAULT 0,
    -- Campos de Governança LGPD / Aceite de Termos
    terms_accepted BOOLEAN DEFAULT TRUE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    terms_version VARCHAR(20) DEFAULT '2026-10-28',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helper function para checagem de SuperAdmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' IN ('renan.oacruz@gmail.com', 'renanoacruz@gmail.com')
    OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'superadmin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativação de RLS para Tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants visualizam apenas seus próprios dados" 
    ON public.tenants FOR SELECT 
    USING (public.is_superadmin() OR auth.uid() = user_id);

CREATE POLICY "Tenants atualizam apenas seus próprios dados" 
    ON public.tenants FOR UPDATE 
    USING (public.is_superadmin() OR auth.uid() = user_id);

-- 3. Tabela do Cofre de Documentos (Art. 62)
CREATE TABLE IF NOT EXISTS public.vault_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- 'Certidão Fiscal', 'Qualificação Técnica', 'Balanço', etc.
    nome VARCHAR(255) NOT NULL,
    emissor VARCHAR(255) NOT NULL,
    data_emissao DATE NOT NULL,
    data_validade DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'VALIDO', -- 'VALIDO', 'EXPIRANDO', 'VENCIDO'
    file_path TEXT, -- Caminho no Cloudflare R2 / Supabase Storage
    file_hash VARCHAR(64), -- SHA-256 para integridade
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS para Documentos do Cofre (Isolamento Absoluto entre Empresas com Suporte SuperAdmin)
ALTER TABLE public.vault_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Licitante acessa apenas documentos do seu cofre" 
    ON public.vault_documents FOR ALL 
    USING (
        public.is_superadmin() OR
        tenant_id IN (
            SELECT id FROM public.tenants WHERE user_id = auth.uid()
        )
    );

-- 4. Tabela de Auditorias e Pareceres Técnicos Emitidos
CREATE TABLE IF NOT EXISTS public.auditorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    numero_edital VARCHAR(100),
    orgao VARCHAR(255),
    uf VARCHAR(2),
    valor_estimado NUMERIC(15,2),
    vertical_detectada VARCHAR(100),
    vertical_mismatch BOOLEAN DEFAULT FALSE,
    veredito_geral VARCHAR(50) NOT NULL, -- 'PASSA', 'RESSALVA', 'ELIMINATORIA', 'REVISAO_HUMANA_NECESSARIA'
    justificativa_veredito TEXT,
    semaforo_items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Requisitos com citações Pág. X, Linha Y
    calculo_pl JSONB, -- Memória do cálculo PL >= 10% (Art. 69)
    calculo_atestados JSONB, -- Validação dos 50% de atestado técnico (Art. 67)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS para Histórico de Auditorias
ALTER TABLE public.auditorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Licitante visualiza apenas suas auditorias emitidas" 
    ON public.auditorias FOR ALL 
    USING (
        public.is_superadmin() OR
        tenant_id IN (
            SELECT id FROM public.tenants WHERE user_id = auth.uid()
        )
    );

-- 6. Tabela de Auditorias de Editais em Nuvem (Multi-Dispositivo & ROI)
CREATE TABLE IF NOT EXISTS public.audited_tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    edital_pncp_id TEXT,
    edital_title TEXT NOT NULL,
    verdict TEXT CHECK (verdict IN ('PASSA', 'RESSALVA', 'ELIMINATÓRIA', 'ELIMINATORIA', 'REVISÃO_HUMANA', 'REVISAO_HUMANA_NECESSARIA')),
    analysis_date TIMESTAMPTZ DEFAULT NOW(),
    pdf_url TEXT,
    report_data JSONB,
    -- Campos operacionais de desfecho e ROI
    desfecho TEXT DEFAULT 'EM_ANDAMENTO' CHECK (desfecho IN ('EM_ANDAMENTO', 'GANHA', 'PERDIDA', 'REVOGADA_ANULADA', 'NAO_DISPUTADA')),
    valor_homologado_ganha NUMERIC(15,2),
    motivo_perda TEXT,
    segmento TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativação de RLS para Audited Tenders
ALTER TABLE public.audited_tenders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audits" 
    ON public.audited_tenders FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audits" 
    ON public.audited_tenders FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own audits" 
    ON public.audited_tenders FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own audits" 
    ON public.audited_tenders FOR DELETE 
    USING (auth.uid() = user_id);

