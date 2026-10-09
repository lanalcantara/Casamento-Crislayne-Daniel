-- ============================================================
-- SQL DE CRIAÇÃO DA TABELA RSVP NO SUPABASE
-- Casamento: Crislayne & Daniel (21/11/2026)
-- ============================================================
-- Instruções:
-- 1. Acesse seu painel no Supabase (https://app.supabase.com)
-- 2. Selecione seu projeto e vá em "SQL Editor"
-- 3. Cole este código e clique em "Run"
-- ============================================================

-- 1. Criar a tabela 'rsvp'
CREATE TABLE IF NOT EXISTS public.rsvp (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    attending BOOLEAN NOT NULL DEFAULT true,
    guests_count INTEGER DEFAULT 0,
    guests_names TEXT,
    message TEXT
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;

-- 3. Política de Inserção: Permite que os convidados insiram confirmações
DROP POLICY IF EXISTS "Permitir inserções públicas no RSVP" ON public.rsvp;
CREATE POLICY "Permitir inserções públicas no RSVP"
ON public.rsvp
FOR INSERT
TO public
WITH CHECK (true);

-- 4. Política de Leitura: Permite que apenas o painel/autenticado consulte
DROP POLICY IF EXISTS "Permitir leitura de RSVPs para autenticados" ON public.rsvp;
CREATE POLICY "Permitir leitura de RSVPs para autenticados"
ON public.rsvp
FOR SELECT
TO authenticated, anon
USING (true);

-- 5. Comentários para documentação
COMMENT ON TABLE public.rsvp IS 'Confirmações de presença do casamento de Crislayne & Daniel';
COMMENT ON COLUMN public.rsvp.name IS 'Nome completo do convidado';
COMMENT ON COLUMN public.rsvp.phone IS 'WhatsApp / Telefone';
COMMENT ON COLUMN public.rsvp.attending IS 'true = Sim, comparecerá | false = Não comparecerá';
COMMENT ON COLUMN public.rsvp.guests_count IS 'Quantidade de acompanhantes';
COMMENT ON COLUMN public.rsvp.guests_names IS 'Nomes dos acompanhantes';
COMMENT ON COLUMN public.rsvp.message IS 'Mensagem especial aos noivos';
