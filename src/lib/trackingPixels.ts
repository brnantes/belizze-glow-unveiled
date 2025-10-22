import { supabase } from './supabase';

export interface TrackingPixel {
  id: string;
  name: string;
  type: string;
  code: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Função para criar a tabela de pixels de rastreamento no Supabase
export const createTrackingPixelsTable = async () => {
  try {
    // Verificar se a tabela já existe
    const { error: checkError } = await supabase
      .from('tracking_pixels')
      .select('id')
      .limit(1);
    
    // Se não houver erro, a tabela existe
    if (!checkError) {
      console.log('Tabela tracking_pixels já existe');
      return { success: true, error: null };
    }
    
    // Executar SQL para criar a tabela
    const { error } = await supabase.rpc('create_tracking_pixels_table');
    
    if (error) {
      console.error('Erro ao criar tabela tracking_pixels:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Tabela tracking_pixels criada com sucesso');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Erro ao criar tabela tracking_pixels:', error);
    return { success: false, error: error.message };
  }
};

// Função para obter todos os pixels de rastreamento
export const getTrackingPixels = async () => {
  try {
    const { data, error } = await supabase
      .from('tracking_pixels')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Erro ao obter pixels de rastreamento:', error);
    return { data: null, error: error.message };
  }
};

// Função para obter pixels ativos por localização
export const getActivePixelsByLocation = async (location: string) => {
  try {
    const { data, error } = await supabase
      .from('tracking_pixels')
      .select('*')
      .eq('is_active', true)
      .eq('location', location);
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Erro ao obter pixels ativos para localização ${location}:`, error);
    return { data: null, error: error.message };
  }
};

// Função para salvar um pixel de rastreamento
export const saveTrackingPixel = async (pixel: Partial<TrackingPixel> & { id?: string }) => {
  try {
    const now = new Date().toISOString();
    
    if (pixel.id) {
      // Atualizar pixel existente
      const { error } = await supabase
        .from('tracking_pixels')
        .update({
          name: pixel.name,
          code: pixel.code,
          is_active: pixel.is_active,
          updated_at: now
        })
        .eq('id', pixel.id);
        
      if (error) throw error;
      
      return { success: true, error: null };
    } else {
      // Criar novo pixel
      const { error } = await supabase
        .from('tracking_pixels')
        .insert([{
          name: pixel.name,
          type: pixel.type,
          code: pixel.code,
          location: pixel.location,
          is_active: pixel.is_active,
          created_at: now,
          updated_at: now
        }]);
        
      if (error) throw error;
      
      return { success: true, error: null };
    }
  } catch (error: any) {
    console.error('Erro ao salvar pixel de rastreamento:', error);
    return { success: false, error: error.message };
  }
};
