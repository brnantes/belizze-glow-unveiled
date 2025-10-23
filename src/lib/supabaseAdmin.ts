import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase-config';
import { supabase } from './supabase'; // Importar o cliente regular

const supabaseUrl = SUPABASE_CONFIG.url;
// Chave de serviço para operações administrativas
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODk5NzQ2MSwiZXhwIjoyMDQ0NTczNDYxfQ.tMlVFzJFVLqFYhCqTzJVgMFnEKgHBnGDZgHQBzjvWTk';

// Cliente com service role para operações administrativas
// Configuração melhorada para evitar problemas de autenticação
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    storage: undefined
  },
  global: {
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': supabaseServiceKey
    }
  }
});

// Função para excluir imagens usando métodos diretos
export const deleteImageAdmin = async (
  bucketName: string,
  fileName: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    console.log(`🗑️ Excluindo imagem ${fileName} do bucket ${bucketName}...`);
    
    // Abordagem 1: Usar o cliente regular com requisição direta
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (!error) {
        console.log(`✅ Imagem ${fileName} excluída com sucesso via cliente regular`);
        return { success: true, error: null };
      }
      
      console.warn('Falha ao excluir com cliente regular, tentando método admin:', error);
    } catch (regularError) {
      console.warn('Erro ao excluir com cliente regular:', regularError);
    }
    
    // Abordagem 2: Usar o cliente admin com headers específicos
    try {
      const { error } = await supabaseAdmin.storage
        .from(bucketName)
        .remove([fileName]);

      if (!error) {
        console.log(`✅ Imagem ${fileName} excluída com sucesso via cliente admin`);
        return { success: true, error: null };
      }
      
      console.warn('Falha ao excluir com cliente admin:', error);
    } catch (adminError) {
      console.warn('Erro ao excluir com cliente admin:', adminError);
    }
    
    // Abordagem 3: Usar fetch diretamente com a API Supabase Storage
    try {
      const response = await fetch(
        `${supabaseUrl}/storage/v1/object/${bucketName}/${fileName}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          }
        }
      );
      
      if (response.ok) {
        console.log(`✅ Imagem ${fileName} excluída com sucesso via fetch direto`);
        return { success: true, error: null };
      }
      
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
      console.warn('Falha ao excluir com fetch direto:', errorData);
    } catch (fetchError) {
      console.warn('Erro ao excluir com fetch direto:', fetchError);
    }
    
    // Se chegou aqui, todas as abordagens falharam
    return { success: false, error: 'Não foi possível excluir a imagem após múltiplas tentativas' };
  } catch (error: any) {
    console.error('Erro geral ao excluir imagem:', error);
    return { success: false, error: error.message };
  }
};

export const uploadImageAdmin = async (
  bucketName: string, 
  fileName: string, 
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  try {
    // Verificar se o arquivo é válido
    if (!file || file.size === 0) {
      return { url: null, error: 'Arquivo inválido ou vazio' };
    }

    // Verificar tamanho do arquivo (máximo 50MB)
    if (file.size > 52428800) {
      return { url: null, error: 'Arquivo muito grande. Máximo 50MB permitido.' };
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'Apenas arquivos de imagem são permitidos' };
    }

    console.log(`Iniciando upload de ${fileName} para bucket ${bucketName}...`);
    
    // Usar o cliente regular do Supabase para upload
    // Isso usa as permissões do usuário autenticado
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error('Erro no upload:', error);
      return { url: null, error: error.message };
    }

    // Obter URL pública
    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('Upload realizado com sucesso:', data);
    return { url: publicData.publicUrl, error: null };
    
  } catch (error: any) {
    console.error('Erro no upload:', error);
    return { url: null, error: error.message };
  }
};
