-- Migration 011: Tabela de Base Legislativa e Artigos Indexados para Agentes de IA
-- Suporta consultas determinísticas e busca textual para Pareceres e Minutas

CREATE TABLE IF NOT EXISTS public.legislation_norms (
    id TEXT PRIMARY KEY, -- ex: "lei-14133-2021"
    titulo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    numero TEXT NOT NULL,
    ano INTEGER NOT NULL,
    data_promulgacao DATE,
    ementa TEXT NOT NULL,
    revogada BOOLEAN DEFAULT FALSE,
    versao_texto TEXT NOT NULL, -- "compilado", "original", "republicação/retificação"
    urn TEXT,
    fonte_url TEXT NOT NULL,
    hash_conteudo TEXT,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.legislation_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    norma_id TEXT NOT NULL REFERENCES public.legislation_norms(id) ON DELETE CASCADE,
    artigo_numero TEXT NOT NULL, -- ex: "62", "67", "69", "164"
    rotulo TEXT NOT NULL,        -- ex: "Art. 62", "Art. 69, § 4º"
    topico TEXT,                 -- ex: "Habilitação", "Qualificação Econômico-Financeira", "Impugnação"
    conteudo_markdown TEXT NOT NULL,
    fonte_oficial_ancora_url TEXT NOT NULL, -- Link oficial direto ao artigo (ex: https://...#art62)
    palavras_chave TEXT[],
    tsv_search TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('portuguese', coalesce(rotulo, '') || ' ' || coalesce(topico, '') || ' ' || coalesce(conteudo_markdown, ''))
    ) STORED,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para buscas ultrarrápidas
CREATE INDEX IF NOT EXISTS idx_legislation_articles_norma_artigo ON public.legislation_articles(norma_id, artigo_numero);
CREATE INDEX IF NOT EXISTS idx_legislation_articles_tsv ON public.legislation_articles USING GIN(tsv_search);

-- RLS: Leitura pública para autenticados e serviço de IA; Escrita apenas para Admin/Service Role
ALTER TABLE public.legislation_norms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legislation_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura irrestrita de normas para consultas do sistema" ON public.legislation_norms;
CREATE POLICY "Leitura irrestrita de normas para consultas do sistema"
    ON public.legislation_norms FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Leitura irrestrita de artigos para consultas do sistema" ON public.legislation_articles;
CREATE POLICY "Leitura irrestrita de artigos para consultas do sistema"
    ON public.legislation_articles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Service role ou admin gerenciam normas" ON public.legislation_norms;
CREATE POLICY "Service role ou admin gerenciam normas"
    ON public.legislation_norms FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' IN ('renan.oacruz@gmail.com', 'renanoacruz@gmail.com'));

DROP POLICY IF EXISTS "Service role ou admin gerenciam artigos" ON public.legislation_articles;
CREATE POLICY "Service role ou admin gerenciam artigos"
    ON public.legislation_articles FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'email' IN ('renan.oacruz@gmail.com', 'renanoacruz@gmail.com'));
