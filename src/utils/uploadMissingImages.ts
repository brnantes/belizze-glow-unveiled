import { uploadImageAdmin } from '@/lib/supabaseAdmin';

// Função para fazer upload das imagens que estão faltando no Supabase
export const uploadMissingImages = async () => {
  // Todas as imagens válidas da pasta public (com tamanho > 0)
  const missingImages = [
    { name: '25.jpg', path: '/25.jpg' },
    { name: '30.JPG', path: '/30.JPG' },
    { name: 'antes.png', path: '/antes.png' },
    { name: 'belizze-logo-full.png', path: '/belizze-logo-full.png' },
    { name: 'depois.png', path: '/depois.png' }
  ];

  const results = [];

  for (const image of missingImages) {
    try {
      // Buscar a imagem da pasta public
      const response = await fetch(image.path);
      if (!response.ok) {
        throw new Error(`Não foi possível carregar ${image.name}`);
      }

      const blob = await response.blob();
      
      // Detectar o tipo MIME correto baseado na extensão
      let mimeType = 'image/jpeg';
      if (image.name.toLowerCase().endsWith('.png')) {
        mimeType = 'image/png';
      } else if (image.name.toLowerCase().endsWith('.jpg') || image.name.toLowerCase().endsWith('.jpeg')) {
        mimeType = 'image/jpeg';
      }
      
      const file = new File([blob], image.name, { type: mimeType });

      console.log(`Fazendo upload de ${image.name}...`);
      const { url, error } = await uploadImageAdmin('site-images', image.name, file);

      if (error) {
        throw new Error(error);
      }

      console.log(`✅ Upload realizado com sucesso: ${image.name}`);
      results.push({ name: image.name, success: true, url });
    } catch (error: any) {
      console.error(`❌ Erro ao fazer upload de ${image.name}:`, error);
      results.push({ name: image.name, success: false, error: error.message });
    }
  }

  return results;
};
