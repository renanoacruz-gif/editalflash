-- =========================================================================
-- EDITALFLASH - MIGRATION 008: PERFORMANCE, ÍNDICES COMPOSTOS & CONCORRÊNCIA
-- =========================================================================

-- 1. Índices Compostos para Histórico Ordenado e Alertas de Validade
CREATE INDEX IF NOT EXISTS idx_audited_tenders_user_created 
    ON public.audited_tenders(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vault_documents_user_expiration 
    ON public.vault_documents(user_id, expiration_date);

CREATE INDEX IF NOT EXISTS idx_payments_user_status_created 
    ON public.payments(user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payments_gateway_tx 
    ON public.payments(transaction_id);

-- 2. Constraint de Unicidade em Transações para Idempotência Rigorosa
ALTER TABLE public.payments 
    DROP CONSTRAINT IF EXISTS uq_payments_transaction_id;

ALTER TABLE public.payments 
    ADD CONSTRAINT uq_payments_transaction_id UNIQUE (transaction_id);

-- 3. Função Atômica para Débito de Créditos Sem Condição de Corrida (Atomic Lock)
CREATE OR REPLACE FUNCTION public.debit_user_credit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_updated INT;
BEGIN
  UPDATE public.profiles
  SET analyses_used = analyses_used + 1,
      updated_at = NOW()
  WHERE id = p_user_id
    AND analyses_used < analyses_limit;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN (v_updated > 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Tabela de Eventos com Falha / Dead Letter Queue (DLQ)
CREATE TABLE IF NOT EXISTS public.failed_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    error_message TEXT,
    attempts INT DEFAULT 1,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_failed_events_resolved 
    ON public.failed_events(resolved, created_at DESC);

NOTIFY pgrst, 'reload schema';
