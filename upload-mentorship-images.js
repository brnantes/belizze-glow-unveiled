import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://wgamkjtlvebwquuxxqwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados das imagens em base64 (você precisará substituir pelos dados reais das suas imagens)
const mentorshipImages = {
  'mentorship-certificates.jpg': {
    // Esta é uma imagem de exemplo - você precisará substituir pelo base64 real da primeira imagem
    data: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    contentType: 'image/jpeg'
  },
  'mentorship-training.jpg': {
    // Esta é uma imagem de exemplo - você precisará substituir pelo base64 real da segunda imagem
    data: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    contentType: 'image/jpeg'
  },
  'mentorship-practice.jpg': {
    // Esta é uma imagem de exemplo - você precisará substituir pelo base64 real da terceira imagem
    data: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    contentType: 'image/jpeg'
  }
};

async function uploadMentorshipImages() {
  console.log('🚀 Iniciando upload de imagens da mentoria para Supabase Storage...\n');

  // Verificar se o bucket mentorship existe
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === 'mentorship');

  if (!bucketExists) {
    console.log('📦 Criando bucket "mentorship"...');
    const { error: bucketError } = await supabase.storage.createBucket('mentorship', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    
    if (bucketError) {
      console.error('❌ Erro ao criar bucket:', bucketError);
      return;
    }
    console.log('✅ Bucket criado com sucesso!\n');
  } else {
    console.log('✅ Bucket "mentorship" já existe\n');
  }

  // Upload de cada imagem
  const uploadedUrls = {};
  
  for (const [imageName, imageInfo] of Object.entries(mentorshipImages)) {
    try {
      console.log(`📤 Fazendo upload de ${imageName}...`);

      // Converter base64 para buffer
      const base64Data = imageInfo.data.replace(/^data:image\/[a-z]+;base64,/, '');
      const fileBuffer = Buffer.from(base64Data, 'base64');

      const { data, error } = await supabase.storage
        .from('mentorship')
        .upload(imageName, fileBuffer, {
          contentType: imageInfo.contentType,
          upsert: true
        });

      if (error) {
        console.error(`❌ Erro ao fazer upload de ${imageName}:`, error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('mentorship')
        .getPublicUrl(imageName);

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
    path.join(__dirname, 'mentorship-image-urls.json'),
    JSON.stringify(uploadedUrls, null, 2)
  );
  console.log('\n💾 URLs salvas em mentorship-image-urls.json');

  return uploadedUrls;
}

uploadMentorshipImages().catch(console.error);
