import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://wgamkjtlvebwquuxxqwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const images = [
  '25.jpg',
  '30.JPG',
  'antes.png',
  'belizze-logo-full.png',
  'depois.png',
  'dra-kamylle.jpg',
  'labios-comparacao.jpg'
];

async function uploadImages() {
  console.log('🚀 Iniciando upload de imagens para Supabase Storage...\n');

  // Verificar buckets existentes
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('📦 Buckets existentes:', buckets?.map(b => b.name).join(', '));
  console.log('✅ Prosseguindo com upload...\n');

  // Upload de cada imagem
  const uploadedUrls = {};
  
  for (const imageName of images) {
    try {
      const imagePath = path.join(__dirname, 'public', imageName);
      
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️  Arquivo não encontrado: ${imageName}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(imagePath);
      const fileExt = path.extname(imageName);
      const fileName = imageName;

      console.log(`📤 Fazendo upload de ${imageName}...`);

      const { data, error } = await supabase.storage
        .from('site-images')
        .upload(fileName, fileBuffer, {
          contentType: getContentType(fileExt),
          upsert: true
        });

      if (error) {
        console.error(`❌ Erro ao fazer upload de ${imageName}:`, error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

      uploadedUrls[imageName] = publicUrl;
      console.log(`✅ Upload concluído: ${imageName}`);
      console.log(`🔗 URL: ${publicUrl}\n`);

    } catch (error) {
      console.error(`❌ Erro ao processar ${imageName}:`, error);
    }
  }

  console.log('\n🎉 Upload completo!\n');
  console.log('📋 URLs das imagens:\n');
  console.log(JSON.stringify(uploadedUrls, null, 2));

  // Salvar URLs em arquivo
  fs.writeFileSync(
    path.join(__dirname, 'supabase-image-urls.json'),
    JSON.stringify(uploadedUrls, null, 2)
  );
  console.log('\n💾 URLs salvas em supabase-image-urls.json');
}

function getContentType(ext) {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.JPG': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return types[ext] || 'image/jpeg';
}

uploadImages().catch(console.error);
