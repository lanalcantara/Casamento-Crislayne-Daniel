-- ============================================================
-- SQL DE CRIAÇÃO DAS TABELAS NO SUPABASE (RSVP & RECADOS)
-- Casamento: Crislayne & Daniel (21/11/2026)
-- Projeto Supabase: ulqcevrqyfqlhvezreea
-- ============================================================
-- Instruções:
-- 1. Acesse seu painel no Supabase: https://supabase.com/dashboard/project/ulqcevrqyfqlhvezreea
-- 2. No menu lateral esquerdo, clique em "SQL Editor"
-- 3. Cole todo este código e clique no botão verde "Run"
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABELA 'rsvp' (Confirmações de Presença)
-- ------------------------------------------------------------
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

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;

-- Política de Inserção: Permite que convidados enviem respostas anonimamente
DROP POLICY IF EXISTS "Permitir inserções públicas no RSVP" ON public.rsvp;
CREATE POLICY "Permitir inserções públicas no RSVP"
ON public.rsvp
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política de Leitura: Permite leitura
DROP POLICY IF EXISTS "Permitir leitura de RSVPs para autenticados" ON public.rsvp;
CREATE POLICY "Permitir leitura de RSVPs para autenticados"
ON public.rsvp
FOR SELECT
TO anon, authenticated
USING (true);

-- ------------------------------------------------------------
-- 2. TABELA 'recados' (Mural de Mensagens dos Convidados)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nome TEXT,
    autor TEXT,
    mensagem TEXT NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.recados ENABLE ROW LEVEL SECURITY;

-- Política de Inserção Pública no Mural
DROP POLICY IF EXISTS "Permitir inserções públicas em recados" ON public.recados;
CREATE POLICY "Permitir inserções públicas em recados"
ON public.recados
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política de Leitura Pública no Mural
DROP POLICY IF EXISTS "Permitir leitura pública de recados" ON public.recados;
CREATE POLICY "Permitir leitura pública de recados"
ON public.recados
FOR SELECT
TO anon, authenticated
USING (true);
