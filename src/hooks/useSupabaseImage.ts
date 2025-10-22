import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabaseImage = (imageName: string, fallbackUrl?: string) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getImageUrl = async () => {
      try {
        // Tenta usar a URL pública do Supabase diretamente
        const { data: { publicUrl } } = supabase.storage
          .from('site-images')
          .getPublicUrl(imageName);

        // Verifica se a imagem existe fazendo um HEAD request
        const response = await fetch(publicUrl, { method: 'HEAD' });
        
        if (response.ok) {
          setImageUrl(publicUrl);
        } else {
          // Se não existir no Supabase, usa o fallback
          setImageUrl(fallbackUrl || `/${imageName}`);
        }
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        // Em caso de erro, usa o fallback
        setImageUrl(fallbackUrl || `/${imageName}`);
      } finally {
        setLoading(false);
      }
    };

    getImageUrl();
  }, [imageName, fallbackUrl]);

  return { imageUrl, loading };
};

// Helper para pegar URL diretamente (sem fallback para local)
export const getSupabaseImageUrl = (imageName: string): string => {
  return supabase.storage
    .from('site-images')
    .getPublicUrl(imageName).data.publicUrl;
};
