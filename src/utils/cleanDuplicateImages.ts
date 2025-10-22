import { supabase } from "@/lib/supabase";

export const cleanDuplicateImages = async () => {
  try {
    console.log('🧹 Iniciando limpeza de imagens duplicadas...');

    // Lista das imagens duplicadas para deletar
    const imagesToDelete = [
      '1760963376997_before_mentoria-treinamento.jpg',
      '1760963380045_before_mentoria-treinamento.jpg', 
      '1760963380541_before_mentoria-treinamento.jpg',
      '1760963383931_after_mentoria-pratica.jpg',
      '1760963385774_after_mentoria-pratica.jpg',
      '1760963387340_after_mentoria-pratica.jpg'
    ];

    console.log('🔍 Verificando imagens existentes no bucket before_after...');
    
    // Verificar quais imagens existem antes de tentar deletar
    const { data: beforeAfterData, error: beforeAfterError } = await supabase.storage
      .from('before_after')
      .list();
      
    if (beforeAfterError) {
      console.error('❌ Erro ao listar imagens do before_after:', beforeAfterError);
      return { success: false, message: `Erro ao listar imagens: ${beforeAfterError.message}` };
    }

    // Filtrar apenas as imagens que realmente existem
    const existingImages = imagesToDelete.filter(img => 
      beforeAfterData?.some(file => file.name === img)
    );
    
    console.log(`📋 Encontradas ${existingImages.length} imagens duplicadas para deletar:`, existingImages);
    
    if (existingImages.length > 0) {
      console.log('🗑️ Deletando imagens duplicadas...');
      
      const { error: deleteError } = await supabase.storage
        .from('before_after')
        .remove(existingImages);

      if (deleteError) {
        console.error('❌ Erro ao deletar imagens duplicadas:', deleteError);
        return { success: false, message: `Erro ao deletar imagens: ${deleteError.message}` };
      } else {
        console.log(`✅ ${existingImages.length} imagens duplicadas deletadas com sucesso!`);
        return { success: true, message: `${existingImages.length} imagens duplicadas removidas com sucesso!` };
      }
    } else {
      console.log('ℹ️ Nenhuma imagem duplicada encontrada para deletar');
      return { success: true, message: 'Nenhuma imagem duplicada encontrada' };
    }

  } catch (error: any) {
    console.error('❌ Erro na limpeza:', error);
    return { success: false, message: error.message };
  }
};
