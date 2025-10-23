import { supabase } from "./supabase";

export const deleteImageFromStorage = async (
  bucketName: string,
  fileName: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    console.log(`🗑️ Deletando ${fileName} do bucket ${bucketName}...`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error(`❌ Erro ao deletar ${fileName}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`✅ ${fileName} deletado com sucesso`);
    return { success: true, error: null };
  } catch (error: any) {
    console.error(`❌ Erro ao deletar ${fileName}:`, error);
    return { success: false, error: error.message };
  }
};

export const uploadImageToStorage = async (
  bucketName: string,
  fileName: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  try {
    if (!file || file.size === 0) {
      return { url: null, error: "Arquivo inválido ou vazio" };
    }

    if (file.size > 52428800) {
      return { url: null, error: "Arquivo muito grande. Máximo 50MB permitido." };
    }

    if (!file.type.startsWith("image/")) {
      return { url: null, error: "Apenas arquivos de imagem são permitidos" };
    }

    console.log(`📤 Upload de ${fileName} para ${bucketName}...`);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      });

    if (error) {
      console.error(`❌ Erro no upload:`, error);
      return { url: null, error: error.message };
    }

    const { data: publicData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log(`✅ Upload realizado: ${publicData.publicUrl}`);
    return { url: publicData.publicUrl, error: null };
  } catch (error: any) {
    console.error(`❌ Erro no upload:`, error);
    return { url: null, error: error.message };
  }
};
