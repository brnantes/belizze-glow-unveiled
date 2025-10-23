import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { deleteImageDirect } from "@/lib/storageDelete";
import { uploadImageToStorage } from "@/lib/storageUtils";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Trash2, Copy, Check, RefreshCw } from "lucide-react";

interface SiteImage {
  name: string;
  url: string;
  bucket: string;
}


export const SiteImagesManager = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [replacingImage, setReplacingImage] = useState<string | null>(null);

  useEffect(() => {
    initializeBucket();
  }, []);

  const initializeBucket = async () => {
    // Não tentar criar buckets, apenas carregar imagens
    console.log('🔄 Carregando imagens de todos os buckets...');
    loadImages();
  };

  const loadImages = async () => {
    try {
      const buckets = ['site-images', 'mentorship', 'before_after'];
      const allImages: SiteImage[] = [];
      const seenImages = new Set<string>();

      for (const bucketName of buckets) {
        try {
          console.log(`🔍 Carregando bucket: ${bucketName}`);
          const { data, error } = await supabase.storage
            .from(bucketName)
            .list();

          if (error) {
            if (error.message?.includes('not found')) {
              console.log(`Bucket ${bucketName} não encontrado`);
              continue;
            }
            throw error;
          }

          if (!data || data.length === 0) {
            console.log(`Bucket ${bucketName} está vazio`);
            continue;
          }

          console.log(`📁 ${bucketName}: encontradas ${data.length} imagens`);

          const bucketImages = data
            .filter(file => {
              // Filtrar apenas arquivos de imagem
              const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
              const uniqueKey = `${bucketName}/${file.name}`;
              
              console.log(`🔍 Processando arquivo: ${file.name} (isImage: ${isImage})`);
              
              if (!isImage) {
                console.log(`⚠️ Ignorando arquivo não-imagem: ${file.name}`);
                return false;
              }
              
              // Filtrar duplicatas baseadas no conteúdo da imagem, não apenas no nome
              const isDuplicate = allImages.some(existingImage => {
                // Verificar se é a mesma imagem baseada no nome base
                const baseName = file.name.replace(/^\d+_(before|after)_/, ''); // Remove prefixos de timestamp
                const existingBaseName = existingImage.name.replace(/^\d+_(before|after)_/, '');
                return baseName === existingBaseName && existingImage.bucket !== bucketName;
              });
              
              if (isDuplicate) {
                console.log(`⚠️ Imagem duplicada (conteúdo similar) ignorada: ${uniqueKey}`);
                return false;
              }
              
              if (seenImages.has(uniqueKey)) {
                console.log(`⚠️ Imagem duplicada (nome) ignorada: ${uniqueKey}`);
                return false;
              }
              
              seenImages.add(uniqueKey);
              console.log(`✅ Imagem aceita: ${uniqueKey}`);
              return true;
            })
            .map(file => {
              const publicUrl = supabase.storage.from(bucketName).getPublicUrl(file.name).data.publicUrl;
              if (file.name === '30.JPG') {
                console.log(`🔍 URL gerada para 30.JPG: ${publicUrl}`);
              }
              return {
                name: file.name,
                url: publicUrl,
                bucket: bucketName
              };
            });

          allImages.push(...bucketImages);
          console.log(`✅ ${bucketName}: adicionadas ${bucketImages.length} imagens únicas`);
        } catch (bucketError) {
          console.error(`❌ Erro ao carregar bucket ${bucketName}:`, bucketError);
        }
      }

      // Ordenar por bucket e depois por nome
      allImages.sort((a, b) => {
        if (a.bucket !== b.bucket) {
          return a.bucket.localeCompare(b.bucket);
        }
        return a.name.localeCompare(b.name);
      });

      setImages(allImages);
      console.log(`📸 Total: ${allImages.length} imagens únicas carregadas`);
    } catch (error: any) {
      console.error('❌ Erro geral ao carregar imagens:', error);
    }
  };

  const handleUpload = async (imageName: string, file: File) => {
    try {
      setUploading(imageName);
      console.log(`Iniciando upload de ${imageName}...`);
      
      const { url, error } = await uploadImageToStorage('site-images', imageName, file);

      if (error) {
        throw new Error(error);
      }

      console.log('Upload realizado com sucesso, URL:', url);
      toast.success(`${imageName} enviado com sucesso!`);
      loadImages();
    } catch (error: any) {
      console.error('Erro completo:', error);
      toast.error(`Erro ao enviar ${imageName}: ${error.message}`);
    } finally {
      setUploading(null);
    }
  };

  const handleSimpleImageUpload = async (file: File) => {
    const fileName = file.name;
    setUploading('new-image');
    
    try {
      const { url, error } = await uploadImageToStorage('site-images', fileName, file);

      if (error) {
        throw new Error(error);
      }

      console.log('Upload de imagem realizado com sucesso, URL:', url);
      toast.success(`${fileName} enviado com sucesso!`);
      loadImages();
    } catch (error: any) {
      console.error('Erro ao enviar imagem:', error);
      toast.error(`Erro ao enviar ${fileName}: ${error.message}`);
    } finally {
      setUploading(null);
    }
  };

  const handleReplaceImage = async (file: File, imageName: string, bucketName: string) => {
    const replaceKey = `${bucketName}/${imageName}`;
    setReplacingImage(replaceKey);
    
    try {
      const { url, error } = await uploadImageToStorage(bucketName, imageName, file);

      if (error) {
        throw new Error(error);
      }

      console.log('Imagem substituída com sucesso, URL:', url);
      toast.success(`${imageName} substituído com sucesso!`);
      loadImages();
    } catch (error: any) {
      console.error('Erro ao substituir imagem:', error);
      toast.error(`Erro ao substituir ${imageName}: ${error.message}`);
    } finally {
      setReplacingImage(null);
    }
  };

  const handleDelete = async (imageName: string, bucketName: string) => {
    try {
      console.log(`🗑️ Iniciando deleção de ${imageName}...`);
      
      // Tentar deletar do storage
      const { success, error } = await deleteImageDirect(bucketName, imageName);
      
      if (!success) {
        console.error(`❌ Falha ao deletar ${imageName}:`, error);
        toast.error(`Erro ao excluir ${imageName}: ${error}`);
        return;
      }
      
      // Sucesso confirmado - agora remover da UI
      console.log(`✅ ${imageName} deletado com sucesso do storage`);
      setImages(prevImages => prevImages.filter(img => !(img.name === imageName && img.bucket === bucketName)));
      
      toast.success(`${imageName} excluído com sucesso!`);
    } catch (error: any) {
      console.error('❌ Erro ao excluir:', error);
      toast.error(`Erro ao excluir ${imageName}: ${error.message}`);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('URL copiada!');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Separar imagens por categoria
  const bannerImages = images.filter(img => img.bucket === 'site-images' && (img.name.toLowerCase().includes('banner') || img.name.toLowerCase().includes('hero')));
  const mentorshipImages = images.filter(img => img.bucket === 'mentorship');
  const beforeAfterImages = images.filter(img => img.bucket === 'before_after');
  const otherImages = images.filter(img => img.bucket === 'site-images' && !img.name.toLowerCase().includes('banner') && !img.name.toLowerCase().includes('hero'));

  const renderImageGrid = (imgs: SiteImage[], title: string, description: string) => {
    if (imgs.length === 0) return null;
    
    return (
      <Card key={title}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {title} ({imgs.length})
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imgs.map((image) => (
              <div key={`${image.bucket}/${image.name}`} className="group relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.log(`❌ Erro ao carregar imagem: ${image.name}`);
                    console.log(`   URL: ${image.url}`);
                    console.log(`   Tentando fallback...`);
                    
                    // Tentar com cache buster como fallback
                    if (!e.currentTarget.src.includes('?t=')) {
                      e.currentTarget.src = `${image.url}?t=${Date.now()}`;
                      return;
                    }
                    
                    // Se ainda falhar, mostrar erro
                    console.log(`   Status: ${(e.currentTarget as HTMLImageElement).naturalWidth === 0 ? 'Falha de rede/CORS' : 'Arquivo inválido'}`);
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3EErro ao carregar%3C/text%3E%3C/svg%3E';
                  }}
                  onLoad={() => console.log(`✅ Imagem carregada: ${image.name}`)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/90 hover:bg-white text-black"
                    onClick={() => copyToClipboard(image.url)}
                    title="Copiar URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-blue-500/90 hover:bg-blue-600 text-white"
                    title="Substituir imagem"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleReplaceImage(file, image.name, image.bucket);
                        }
                      };
                      input.click();
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-red-500/90 hover:bg-red-600 text-white"
                    data-delete-image={`${image.bucket}/${image.name}`}
                    onClick={() => handleDelete(image.name, image.bucket)}
                    title="Deletar imagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white truncate" title={image.name}>{image.name}</p>
                  {replacingImage === `${image.bucket}/${image.name}` && (
                    <p className="text-xs text-yellow-300 mt-1">Substituindo...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Imagens do Site</h2>
          <p className="text-muted-foreground">
            Gerencie as imagens institucionais do site (Logo, Hero, Fotos da equipe)
          </p>
        </div>
      </div>


      {/* Seção para Upload de Novas Imagens */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Adicionar Nova Imagem
          </CardTitle>
          <CardDescription>
            Faça upload de uma nova imagem para o site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleSimpleImageUpload(file);
                  }
                }}
                disabled={uploading === 'new-image'}
                className="text-sm"
              />
              {uploading === 'new-image' && (
                <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Selecione uma imagem para fazer upload. O nome original do arquivo será mantido.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todas as Imagens do Bucket */}
      <div className="space-y-6">
        {/* Banner Principal */}
        {renderImageGrid(bannerImages, "🎯 Banner Principal", "Imagens do banner/hero da página inicial")}
        
        {/* Imagens da Mentoria */}
        {renderImageGrid(mentorshipImages, "📚 Imagens da Mentoria", "Imagens usadas na página de mentoria")}
        
        {/* Antes & Depois */}
        {renderImageGrid(beforeAfterImages, "📸 Antes & Depois", "Imagens de antes e depois dos procedimentos")}
        
        {/* Outras Imagens */}
        {renderImageGrid(otherImages, "🖼️ Outras Imagens do Site", "Logo, fotos da equipe e outras imagens institucionais")}
        
        {/* Mensagem se não houver imagens */}
        {images.length === 0 && (
          <Card className="p-8 text-center border-2 border-dashed">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma imagem encontrada</h3>
            <p className="text-muted-foreground">Faça upload de uma imagem acima para começar</p>
          </Card>
        )}
      </div>
    </div>
  );
};
