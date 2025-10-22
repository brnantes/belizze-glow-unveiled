import React, { useState } from 'react';
import { uploadImageAdmin } from '@/lib/supabaseAdmin';

const MentorshipImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const urls: string[] = [];

    const imageNames = [
      'mentoria-treinamento.jpg',
      'mentoria-certificados.jpg', 
      'mentoria-demonstracao.jpg',
      'mentoria-pratica.jpg'
    ];

    for (let i = 0; i < Math.min(files.length, 4); i++) {
      const file = files[i];
      const fileName = imageNames[i];
      
      console.log(`Fazendo upload de ${fileName}...`);
      const { url, error } = await uploadImageAdmin('mentorship', fileName, file);
      
      if (url && !error) {
        urls.push(url);
        console.log(`✅ Upload realizado: ${fileName}`);
      } else {
        console.error(`❌ Falha no upload: ${fileName}`, error);
      }
    }

    setUploadedUrls(urls);
    setUploading(false);
    
    if (urls.length > 0) {
      alert(`Upload concluído! ${urls.length} imagens enviadas com sucesso.`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Upload de Imagens da Mentoria</h2>
      
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="mb-4 block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-rose-50 file:text-rose-700
                   hover:file:bg-rose-100"
      />
      
      {uploading && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
          <p className="mt-2 text-sm text-gray-600">Fazendo upload das imagens...</p>
        </div>
      )}
      
      {uploadedUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Imagens enviadas:</h3>
          <div className="grid grid-cols-2 gap-2">
            {uploadedUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-4">
        Selecione até 4 imagens para a página de mentoria. 
        As imagens serão nomeadas automaticamente.
      </p>
    </div>
  );
};

export default MentorshipImageUploader;
