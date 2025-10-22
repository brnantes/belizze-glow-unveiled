import { supabase } from "@/lib/supabase";

export const moveBeforeAfterImages = async () => {
  try {
    console.log('🔄 Iniciando transferência de imagens...');

    // 1. Primeiro, verificar se as imagens existem nos buckets
    console.log('🔍 Verificando imagens existentes...');
    
    // Verificar no site-images
    const { data: siteImagesData, error: siteImagesError } = await supabase.storage
      .from('site-images')
      .list();
      
    if (siteImagesError) {
      throw new Error(`Erro ao listar imagens do site-images: ${siteImagesError.message}`);
    }
    
    const antesExists = siteImagesData?.some(file => file.name === 'antes.png');
    const depoisExists = siteImagesData?.some(file => file.name === 'depois.png');
    
    if (!antesExists || !depoisExists) {
      throw new Error(`Imagens não encontradas no bucket site-images: ${!antesExists ? 'antes.png' : ''} ${!depoisExists ? 'depois.png' : ''}`);
    }
    
    console.log('✅ Imagens encontradas no bucket site-images');
    
    // 2. Deletar as 6 imagens duplicadas do bucket before_after
    const imagesToDelete = [
      '1760963376997_before_mentoria-treinamento.jpg',
      '1760963380045_before_mentoria-treinamento.jpg', 
      '1760963380541_before_mentoria-treinamento.jpg',
      '1760963383931_after_mentoria-pratica.jpg',
      '1760963385774_after_mentoria-pratica.jpg',
      '1760963387340_after_mentoria-pratica.jpg'
    ];

    console.log('🗑️ Deletando imagens duplicadas...');
    
    // Verificar quais imagens existem antes de tentar deletar
    const { data: beforeAfterData, error: beforeAfterError } = await supabase.storage
      .from('before_after')
      .list();
      
    if (beforeAfterError) {
      console.error('❌ Erro ao listar imagens do before_after:', beforeAfterError);
    } else {
      // Filtrar apenas as imagens que realmente existem
      const existingImages = imagesToDelete.filter(img => 
        beforeAfterData?.some(file => file.name === img)
      );
      
      if (existingImages.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from('before_after')
          .remove(existingImages);

        if (deleteError) {
          console.error('❌ Erro ao deletar imagens duplicadas:', deleteError);
        } else {
          console.log(`✅ ${existingImages.length} imagens duplicadas deletadas com sucesso!`);
        }
      } else {
        console.log('ℹ️ Nenhuma imagem duplicada encontrada para deletar');
      }
    }

    // 3. Baixar as imagens do bucket site-images
    console.log('📥 Baixando imagens do bucket site-images...');
    
    const { data: antesData, error: antesDownloadError } = await supabase.storage
      .from('site-images')
      .download('antes.png');

    const { data: depoisData, error: depoisDownloadError } = await supabase.storage
      .from('site-images')
      .download('depois.png');

    if (antesDownloadError) {
      console.error('❌ Erro ao baixar antes.png:', antesDownloadError);
      throw new Error(`Erro ao baixar antes.png: ${antesDownloadError.message}`);
    }
    
    if (depoisDownloadError) {
      console.error('❌ Erro ao baixar depois.png:', depoisDownloadError);
      throw new Error(`Erro ao baixar depois.png: ${depoisDownloadError.message}`);
    }
    
    console.log('✅ Imagens baixadas com sucesso!');

    // 4. Fazer upload para o bucket before_after
    console.log('📤 Fazendo upload para bucket before_after...');
    
    const { error: antesUploadError } = await supabase.storage
      .from('before_after')
      .upload('antes.png', antesData!, {
        upsert: true,
        contentType: 'image/png'
      });

    if (antesUploadError) {
      console.error('❌ Erro ao fazer upload de antes.png:', antesUploadError);
      throw new Error(`Erro ao fazer upload de antes.png: ${antesUploadError.message}`);
    }
    
    const { error: depoisUploadError } = await supabase.storage
      .from('before_after')
      .upload('depois.png', depoisData!, {
        upsert: true,
        contentType: 'image/png'
      });

    if (depoisUploadError) {
      console.error('❌ Erro ao fazer upload de depois.png:', depoisUploadError);
      throw new Error(`Erro ao fazer upload de depois.png: ${depoisUploadError.message}`);
    }
    
    console.log('✅ Upload para before_after concluído com sucesso!');

    // 5. Deletar as imagens originais do site-images
    console.log('🗑️ Removendo imagens originais do site-images...');
    
    const { error: removeError } = await supabase.storage
      .from('site-images')
      .remove(['antes.png', 'depois.png']);

    if (removeError) {
      console.error('❌ Erro ao remover imagens do site-images:', removeError);
    } else {
      console.log('✅ Imagens removidas do site-images com sucesso!');
    }

    console.log('🎉 Transferência concluída com sucesso!');
    return { success: true, message: 'Imagens transferidas com sucesso!' };

  } catch (error: any) {
    console.error('❌ Erro na transferência:', error);
    return { success: false, message: error.message };
  }
};
