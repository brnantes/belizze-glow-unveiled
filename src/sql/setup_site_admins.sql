-- ============================================
-- SETUP: Tabela de Administradores do Site
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- para configurar o gerenciamento de admins

-- 1. Criar tabela site_admins
CREATE TABLE IF NOT EXISTS public.site_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "site_admins_select" ON public.site_admins;
DROP POLICY IF EXISTS "site_admins_insert" ON public.site_admins;
DROP POLICY IF EXISTS "site_admins_delete" ON public.site_admins;

-- 4. Criar política: Qualquer usuário autenticado pode ler a lista de admins
CREATE POLICY "site_admins_select" ON public.site_admins
FOR SELECT USING (true);

-- 5. Criar política: Apenas admins podem inserir/deletar
CREATE POLICY "site_admins_modify" ON public.site_admins
FOR ALL USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.site_admins WHERE email = auth.email()
  )
) WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.site_admins WHERE email = auth.email()
  )
);

-- 6. Inserir admin inicial
INSERT INTO public.site_admins (email)
VALUES ('admin@belizze.com.br')
ON CONFLICT (email) DO NOTHING;

-- 7. Verificar dados
SELECT * FROM public.site_admins;
