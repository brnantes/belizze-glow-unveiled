import { supabase } from "@/lib/supabase";

// Lista de imagens duplicadas para deletar
const DUPLICATE_IMAGES = [
  '1760963376997_before_mentoria-treinamento.jpg',
  '1760963380045_before_mentoria-treinamento.jpg', 
  '1760963380541_before_mentoria-treinamento.jpg',
  '1760963383931_after_mentoria-pratica.jpg',
  '1760963385774_after_mentoria-pratica.jpg',
  '1760963387340_after_mentoria-pratica.jpg'
];

export const cleanupDuplicateImages = async () => {
  try {
    console.log('🧹 Iniciando limpeza de imagens duplicadas...');
    
    // Verificar quais imagens existem
    const { data, error } = await supabase.storage
      .from('before_after')
      .list();
      
    if (error) {
      console.error('❌ Erro ao listar imagens:', error);
      return { success: false, message: `Erro ao listar imagens: ${error.message}` };
    }
    
    // Filtrar apenas as imagens que existem
    const existingImages = DUPLICATE_IMAGES.filter(img => 
      data?.some(file => file.name === img)
    );
    
    console.log(`📋 Encontradas ${existingImages.length} imagens duplicadas para deletar`);
    
    if (existingImages.length === 0) {
      return { success: true, message: 'Nenhuma imagem duplicada encontrada' };
    }
    
    // Deletar as imagens
    const { error: deleteError } = await supabase.storage
      .from('before_after')
      .remove(existingImages);
      
    if (deleteError) {
      console.error('❌ Erro ao deletar imagens:', deleteError);
      return { success: false, message: `Erro ao deletar imagens: ${deleteError.message}` };
    }
    
    console.log('✅ Imagens duplicadas deletadas com sucesso!');
    return { success: true, message: `${existingImages.length} imagens duplicadas removidas com sucesso!` };
    
  } catch (error: any) {
    console.error('❌ Erro na limpeza:', error);
    return { success: false, message: error.message };
  }
};

// A limpeza não é mais executada automaticamente
