const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = 'https://wgamkjtlvebwquuxxqwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODk5NzQ2MSwiZXhwIjoyMDQ0NTczNDYxfQ.tMlVFzJFVLqFYhCqTzJVgMFnEKgHBnGDZgHQBzjvWTk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImageToSupabase(filePath, bucketName, fileName) {
  try {
    // Ler o arquivo
    const fileBuffer = fs.readFileSync(filePath);
    
    // Fazer upload para o Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error(`Erro ao fazer upload de ${fileName}:`, error);
      return false;
    }

    console.log(`✅ Upload realizado com sucesso: ${fileName}`);
    return true;
  } catch (err) {
    console.error(`Erro ao processar ${fileName}:`, err);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando upload das imagens da mentoria...\n');
  
  // Definir as imagens que serão enviadas
  const images = [
    {
      localPath: './temp/mentoria-treinamento.jpg',
      bucketName: 'mentorship',
      fileName: 'mentoria-treinamento.jpg'
    },
    {
      localPath: './temp/mentoria-certificados.jpg',
      bucketName: 'mentorship',
      fileName: 'mentoria-certificados.jpg'
    },
    {
      localPath: './temp/mentoria-demonstracao.jpg',
      bucketName: 'mentorship',
      fileName: 'mentoria-demonstracao.jpg'
    },
    {
      localPath: './temp/mentoria-pratica.jpg',
      bucketName: 'mentorship',
      fileName: 'mentoria-pratica.jpg'
    }
  ];

  let successCount = 0;
  
  for (const image of images) {
    if (fs.existsSync(image.localPath)) {
      const success = await uploadImageToSupabase(
        image.localPath,
        image.bucketName,
        image.fileName
      );
      if (success) successCount++;
    } else {
      console.log(`⚠️  Arquivo não encontrado: ${image.localPath}`);
    }
  }
  
  console.log(`\n✨ Upload concluído! ${successCount}/${images.length} imagens enviadas com sucesso.`);
}

main().catch(console.error);
