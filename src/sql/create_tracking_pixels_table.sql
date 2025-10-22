-- Script para criar a tabela de pixels de rastreamento
CREATE TABLE IF NOT EXISTS public.tracking_pixels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    code TEXT NOT NULL,
    location TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar comentários à tabela e colunas
COMMENT ON TABLE public.tracking_pixels IS 'Tabela para armazenar códigos de pixels de rastreamento e scripts de análise';
COMMENT ON COLUMN public.tracking_pixels.id IS 'ID único do pixel';
COMMENT ON COLUMN public.tracking_pixels.name IS 'Nome descritivo do pixel';
COMMENT ON COLUMN public.tracking_pixels.type IS 'Tipo do pixel (google, facebook, custom)';
COMMENT ON COLUMN public.tracking_pixels.code IS 'Código do pixel a ser inserido no site';
COMMENT ON COLUMN public.tracking_pixels.location IS 'Local onde o código deve ser inserido (head, body)';
COMMENT ON COLUMN public.tracking_pixels.is_active IS 'Indica se o pixel está ativo';
COMMENT ON COLUMN public.tracking_pixels.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.tracking_pixels.updated_at IS 'Data da última atualização do registro';

-- Criar função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o campo updated_at automaticamente
DROP TRIGGER IF EXISTS update_tracking_pixels_updated_at ON public.tracking_pixels;
CREATE TRIGGER update_tracking_pixels_updated_at
BEFORE UPDATE ON public.tracking_pixels
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Criar função RPC para criar a tabela de pixels de rastreamento
CREATE OR REPLACE FUNCTION create_tracking_pixels_table()
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar se a tabela já existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tracking_pixels') THEN
        RETURN TRUE;
    END IF;
    
    -- Criar a tabela
    CREATE TABLE public.tracking_pixels (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        code TEXT NOT NULL,
        location TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Adicionar comentários
    COMMENT ON TABLE public.tracking_pixels IS 'Tabela para armazenar códigos de pixels de rastreamento e scripts de análise';
    
    -- Criar trigger para atualizar o campo updated_at automaticamente
    CREATE TRIGGER update_tracking_pixels_updated_at
    BEFORE UPDATE ON public.tracking_pixels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
