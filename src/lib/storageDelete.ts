import { supabase } from "./supabase";

const SUPABASE_URL = 'https://wgamkjtlvebwquuxxqwu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU';

export const deleteImageDirect = async (
  bucketName: string,
  fileName: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    console.log(`🗑️ Deletando ${fileName} do bucket ${bucketName}...`);
    
    // Tentar com o cliente Supabase primeiro
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (!error) {
      console.log(`✅ ${fileName} deletado com sucesso via Supabase client`);
      return { success: true, error: null };
    }

    console.warn('Falha com cliente Supabase, tentando fetch direto...');

    // Se falhar, tentar com fetch direto
    const url = `${SUPABASE_URL}/storage/v1/object/${bucketName}/${encodeURIComponent(fileName)}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Erro desconhecido');
      console.error(`❌ Erro ao deletar via fetch:`, response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    console.log(`✅ ${fileName} deletado com sucesso via fetch direto`);
    return { success: true, error: null };
  } catch (error: any) {
    console.error(`❌ Erro ao deletar ${fileName}:`, error);
    return { success: false, error: error.message };
  }
};
