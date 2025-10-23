import { supabase } from '@/lib/supabase';

// Função para converter File para ArrayBuffer
const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const uploadImageToMentorship = async (file: File, fileName: string): Promise<string | null> => {
  try {
    const arrayBuffer = await fileToArrayBuffer(file);
    
    const { data, error } = await supabase.storage
      .from('mentorship')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      console.error('Erro no upload:', error);
      return null;
    }

    // Retornar a URL pública da imagem
    const { data: publicData } = supabase.storage
      .from('mentorship')
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return null;
  }
};

// Função para upload de múltiplas imagens
export const uploadMentorshipImages = async (files: File[]): Promise<string[]> => {
  const urls: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileName = `mentoria-${i + 1}.jpg`;
    
    const url = await uploadImageToMentorship(file, fileName);
    if (url) {
      urls.push(url);
    }
  }
  
  return urls;
};
