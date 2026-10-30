-- =========================================================================
-- MIGRATION 004: FULL LIFECYCLE FOR VAULT DOCUMENTS (LGPD & STORAGE)
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.vault_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in storage bucket / R2
  doc_type TEXT DEFAULT 'OTHER', -- 'CND_FEDERAL', 'FGTS', 'BALANCO', 'ATESTADO', 'OTHER'
  tipo TEXT, -- Nome legível (ex: 'Certidão Fiscal', 'Qualificação Técnica')
  emissor TEXT,
  expiration_date DATE,
  data_emissao DATE DEFAULT CURRENT_DATE,
  data_validade DATE,
  status TEXT DEFAULT 'VALIDO', -- 'VALIDO', 'EXPIRANDO', 'VENCIDO'
  file_size INT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativação de RLS
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

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_vault_documents_user_id ON public.vault_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_vault_documents_expiration ON public.vault_documents(expiration_date);
