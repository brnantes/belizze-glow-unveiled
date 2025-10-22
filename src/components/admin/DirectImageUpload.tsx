import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImageAdmin } from '@/lib/supabaseAdmin';
import { toast } from 'sonner';

export const DirectImageUpload = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
  const [uploading, setUploading] = useState(false);

  const uploadDirectImages = async () => {
    setUploading(true);
    
    try {
      // Dados das imagens em base64 (você precisa converter as imagens)
      const images = [
        {
          name: '25.jpg',
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
        },
        {
          name: '30.JPG', 
          data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
        }
      ];

      for (const image of images) {
        // Converter base64 para blob
        const response = await fetch(image.data);
        const blob = await response.blob();
        const file = new File([blob], image.name, { type: 'image/jpeg' });

        const { url, error } = await uploadImageAdmin('site-images', image.name, file);
        
        if (error) {
          throw new Error(`Erro ao fazer upload de ${image.name}: ${error}`);
        }
        
        console.log(`✅ ${image.name} enviado com sucesso`);
      }

      toast.success('Imagens enviadas com sucesso!');
      onUploadComplete();
      
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error('Erro ao enviar imagens: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Button 
      onClick={uploadDirectImages}
      disabled={uploading}
      className="bg-green-600 hover:bg-green-700"
    >
      {uploading ? 'Enviando...' : 'Upload Direto das Imagens'}
    </Button>
  );
};
