-- =========================================================================
-- MIGRATION: 001_create_audited_tenders.sql
-- Tabela de Auditorias de Editais em Nuvem (Multi-Dispositivo & ROI)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.audited_tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    edital_pncp_id TEXT,
    edital_title TEXT NOT NULL,
    verdict TEXT CHECK (verdict IN ('PASSA', 'RESSALVA', 'ELIMINATÓRIA', 'ELIMINATORIA', 'REVISÃO_HUMANA', 'REVISAO_HUMANA_NECESSARIA')),
    analysis_date TIMESTAMPTZ DEFAULT NOW(),
    pdf_url TEXT,
    report_data JSONB,
    desfecho TEXT DEFAULT 'EM_ANDAMENTO' CHECK (desfecho IN ('EM_ANDAMENTO', 'GANHA', 'PERDIDA', 'REVOGADA_ANULADA', 'NAO_DISPUTADA')),
    valor_homologado_ganha NUMERIC(15,2),
    motivo_perda TEXT,
    segmento TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativação de RLS (Row Level Security)
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

-- Índices de Performance
CREATE INDEX IF NOT EXISTS idx_audited_tenders_user_id ON public.audited_tenders(user_id);
CREATE INDEX IF NOT EXISTS idx_audited_tenders_created_at ON public.audited_tenders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audited_tenders_verdict ON public.audited_tenders(verdict);
