import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Star, Upload, X, Edit3, Save, Eye, RefreshCw } from "lucide-react";
import { BeforeAfterImage, Procedure, supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface BeforeAfterManagerProps {
  images: BeforeAfterImage[];
  procedures: Procedure[];
  onAdd: (data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, data: any) => Promise<void>;
}

const TEMPLATE_IMAGES = [
  { 
    name: 'antes.png', 
    description: 'Template "Antes" - Lipo de Papada com a máquina Pixie',
    usage: 'Imagem do slider interativo na seção Antes & Depois da página inicial'
  },
  { 
    name: 'depois.png', 
    description: 'Template "Depois" - Lipo de Papada com a máquina Pixie',
    usage: 'Imagem do slider interativo na seção Antes & Depois da página inicial'
  },
];

export const BeforeAfterManager = ({ images, procedures, onAdd, onDelete, onUpdate }: BeforeAfterManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingTemplate, setUploadingTemplate] = useState<string | null>(null);
  const [templateImages, setTemplateImages] = useState<{ name: string; url: string }[]>([]);
  const [templatePreviews, setTemplatePreviews] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    procedure_id: null as string | null,
    procedure_name: "",
    description: "",
    is_featured: false,
    before_image: null as File | null,
    after_image: null as File | null
  });
  
  const [beforeImagePreview, setBeforeImagePreview] = useState<string | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditData, setQuickEditData] = useState({ procedure_name: "", description: "" });
  
  // Log para depuração inicial
  useEffect(() => {
    console.log('📚 BeforeAfterManager - Dados recebidos:', {
      imagesCount: images?.length || 0,
      proceduresCount: procedures?.length || 0,
      hasOnAdd: !!onAdd,
      hasOnDelete: !!onDelete,
      hasOnUpdate: !!onUpdate
    });
    
    // Logar os IDs das imagens para debug
    if (images && images.length > 0) {
      console.log('💾 IDs das imagens recebidas:', images.map(img => ({ id: img.id, name: img.procedure_name })));
    }
  }, [images, procedures, onAdd, onDelete, onUpdate]);

  useEffect(() => {
    loadTemplateImages();
  }, []);

  const loadTemplateImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('site-images')
        .list();

      if (error) return;

      const urls = TEMPLATE_IMAGES.map(template => {
        const exists = data?.some(file => file.name === template.name);
        if (exists) {
          return {
            name: template.name,
            url: supabase.storage.from('site-images').getPublicUrl(template.name).data.publicUrl
          };
        }
        return null;
      }).filter(Boolean) as { name: string; url: string }[];

      setTemplateImages(urls);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    }
  };

  const handleTemplateUpload = async (templateName: string, file: File) => {
    try {
      setUploadingTemplate(templateName);

      const { error } = await supabase.storage
        .from('site-images')
        .upload(templateName, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) throw error;

      toast.success(`${templateName} enviado com sucesso!`);
      loadTemplateImages();
    } catch (error: any) {
      toast.error(`Erro ao enviar ${templateName}: ${error.message}`);
    } finally {
      setUploadingTemplate(null);
    }
  };

  const resetForm = () => {
    setFormData({
      procedure_id: null,
      procedure_name: "",
      description: "",
      is_featured: false,
      before_image: null,
      after_image: null
    });
    setBeforeImagePreview(null);
    setAfterImagePreview(null);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('🔍 handleSubmit - Dados do formulário:', formData);
      
      if (editingId && onUpdate) {
        console.log('🔄 Atualizando procedimento existente...');
        await onUpdate(editingId, formData);
      } else {
        console.log('➕ Adicionando novo procedimento...');
        await onAdd(formData);
      }
      
      toast.success("Galeria adicionada com sucesso!");
      resetForm();
      
      // Forçar recarregamento dos dados
      console.log('🔄 Forçando recarregamento dos dados...');
      if (window.location.pathname.includes('admin-dashboard')) {
        window.dispatchEvent(new CustomEvent('reloadBeforeAfterData'));
      }
      
    } catch (error: any) {
      console.error('❌ Erro no handleSubmit:', error);
      toast.error(`Erro ao adicionar galeria: ${error.message}`);
    }
  };

  const handleEditTemplate = (templateName: string) => {
    const isAntes = templateName === 'antes.png';
    
    // Buscar dados salvos no banco se existirem
    const antesImg = templateImages.find(img => img.name === 'antes.png');
    const depoisImg = templateImages.find(img => img.name === 'depois.png');
    
    const savedProcedure = images.find(img => 
      img.before_image_url === antesImg?.url || 
      img.after_image_url === depoisImg?.url ||
      img.procedure_name.includes('Lipo de Papada')
    );
    
    const procedureName = savedProcedure?.procedure_name || "Lipo de Papada com a máquina Pixie";
    const description = savedProcedure?.description || "Resultado incrível com a tecnologia mais avançada em estética facial";
    const isFeatured = savedProcedure?.is_featured || false;
    
    setFormData({
      procedure_id: savedProcedure?.procedure_id || null,
      procedure_name: procedureName,
      description: description,
      is_featured: isFeatured,
      before_image: null,
      after_image: null
    });
    
    // Carregar as imagens atuais como preview
    setBeforeImagePreview(antesImg?.url || null);
    setAfterImagePreview(depoisImg?.url || null);
    setEditingId(templateName); // Usar o nome do template como ID
    setIsAdding(true);
    
    // Scroll suave para o formulário
    setTimeout(() => {
      const formElement = document.querySelector('[data-edit-form]');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleProcedureChange = (procedureId: string) => {
    const procedure = procedures.find(p => p.id === procedureId);
    setFormData({
      ...formData,
      procedure_id: procedureId,
      procedure_name: procedure?.title || ""
    });
  };

  const handleQuickEdit = (image: BeforeAfterImage) => {
    setQuickEditId(image.id);
    setQuickEditData({
      procedure_name: image.procedure_name,
      description: image.description
    });
  };

  const handleQuickSave = async (imageId: string) => {
    if (!onUpdate) return;
    
    try {
      await onUpdate(imageId, {
        procedure_name: quickEditData.procedure_name,
        description: quickEditData.description,
        is_featured: images.find(img => img.id === imageId)?.is_featured || false
      });
      setQuickEditId(null);
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dados");
    }
  };

  const handleQuickCancel = () => {
    setQuickEditId(null);
    setQuickEditData({ procedure_name: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Antes & Depois</h2>
          <p className="text-muted-foreground">Gerencie a galeria de transformações e resultados dos procedimentos</p>
          <p className="text-sm text-blue-600 mt-1">
            📸 Faça upload das fotos de antes e depois dos tratamentos realizados
          </p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)} 
            className="btn-rose-gold shadow-md hover:shadow-lg transition-all flex items-center gap-2 px-5 py-6"
          >
            <div className="bg-white/20 p-1 rounded-full">
              <Plus className="h-5 w-5" />
            </div>
            <span>Adicionar Novas Imagens</span>
          </Button>
        )}
      </div>

      {/* Galerias Cadastradas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-serif font-bold">Galerias Cadastradas ({images.length})</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // Forçar recarregamento dos dados
              console.log('🔄 Forçando recarregamento dos dados...');
              window.dispatchEvent(new CustomEvent('reloadBeforeAfterData'));
            }}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Atualizar
          </Button>
        </div>
        
        {/* Lista de todas as galerias */}
        <div className="space-y-3">
            {images.map((image, index) => (
              <Card key={`gallery-list-${image.id || index}`} className="border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4 p-3">
                  {/* Miniaturas das Imagens */}
                  <div className="flex gap-2 flex-shrink-0">
                    <div className="relative">
                      <img
                        src={image.before_image_url}
                        alt={`Antes - ${image.procedure_name}`}
                        className="w-12 h-12 object-cover rounded border border-red-300"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
                        A
                      </div>
                    </div>
                    <div className="relative">
                      <img
                        src={image.after_image_url}
                        alt={`Depois - ${image.procedure_name}`}
                        className="w-12 h-12 object-cover rounded border border-green-300"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1 rounded-full">
                        D
                      </div>
                    </div>
                  </div>
                  
                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{image.procedure_name}</h5>
                    <p className="text-xs text-gray-500 truncate">{image.description}</p>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setFormData({
                          procedure_id: image.id,
                          procedure_name: image.procedure_name,
                          description: image.description,
                          is_featured: image.is_featured,
                          before_image: null,
                          after_image: null
                        });
                        setBeforeImagePreview(image.before_image_url);
                        setAfterImagePreview(image.after_image_url);
                        setEditingId(image.id);
                        setIsAdding(true);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        if (confirm(`Excluir "${image.procedure_name}"?`)) {
                          onDelete(image.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      {/* Formulário de Edição Completo */}
      {isAdding && (
        <Card className="border-blue-200 bg-blue-50/30 shadow-lg" data-edit-form>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {editingId ? "Editar Galeria" : "Adicionar Nova Galeria"}
                  </h3>
                  <p className="text-sm text-blue-600 font-normal">
                    {editingId ? "Modifique título, descrição e imagens" : "Adicione um novo procedimento"}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <form data-edit-form onSubmit={async (e) => {
            e.preventDefault();
            
            try {
              console.log('🔍 Iniciando salvamento...', { 
                editingId, 
                formData: formData.procedure_name,
                hasUpdate: !!onUpdate,
                hasAdd: !!onAdd
              });
              
              if (editingId && (editingId === 'antes.png' || editingId === 'depois.png')) {
                // Editando templates existentes
                
                // 1. Fazer upload das novas imagens se fornecidas
                if (formData.before_image) {
                  console.log('📤 Fazendo upload da imagem ANTES...');
                  await handleTemplateUpload('antes.png', formData.before_image);
                }
                if (formData.after_image) {
                  console.log('📤 Fazendo upload da imagem DEPOIS...');
                  await handleTemplateUpload('depois.png', formData.after_image);
                }
                
                // 2. Recarregar URLs das imagens
                await loadTemplateImages();
                const antesImg = templateImages.find(img => img.name === 'antes.png');
                const depoisImg = templateImages.find(img => img.name === 'depois.png');
                
                // 3. Preparar dados para salvar
                const procedureData = {
                  procedure_name: formData.procedure_name,
                  description: formData.description,
                  is_featured: formData.is_featured,
                  before_image_url: antesImg?.url,
                  after_image_url: depoisImg?.url,
                  before_image: formData.before_image,
                  after_image: formData.after_image
                };
                
                console.log('💾 Dados a serem salvos:', procedureData);
                
                // 4. Verificar se já existe um registro
                const existingProcedure = images.find(img => 
                  img.procedure_name.includes('Lipo de Papada') || 
                  img.before_image_url === antesImg?.url ||
                  img.after_image_url === depoisImg?.url
                );
                
                console.log('🔍 Procedimento existente encontrado:', existingProcedure);
                
                if (existingProcedure && onUpdate) {
                  console.log('🔄 Atualizando procedimento existente...');
                  await onUpdate(existingProcedure.id, procedureData);
                } else if (onAdd) {
                  console.log('➕ Criando novo procedimento...');
                  try {
                    await onAdd(procedureData);
                    console.log('✅ Procedimento criado com sucesso!');
                  } catch (addError) {
                    console.error('❌ Erro ao criar procedimento:', addError);
                    throw addError;
                  }
                } else {
                  throw new Error('Funções onUpdate ou onAdd não disponíveis');
                }
                
                toast.success("Procedimento salvo com sucesso!");
                setIsAdding(false);
                
                // Recarregar apenas os dados necessários sem reload da página
                await loadTemplateImages();
                
                // Forçar re-render do componente pai para atualizar a lista de images
                if (window.location.pathname.includes('admin-dashboard')) {
                  // Disparar evento customizado para recarregar dados
                  window.dispatchEvent(new CustomEvent('reloadBeforeAfterData'));
                }
                
                console.log('✅ Dados recarregados sem reload da página');
                
              } else {
                // Adicionando nova galeria
                console.log('➕ Adicionando nova galeria...');
                await handleSubmit(e);
              }
            } catch (error: any) {
              console.error('❌ Erro ao salvar:', error);
              toast.error(`Erro ao salvar: ${error.message}`);
            }
          }}>
            <CardContent className="space-y-6">
              {/* Título e Descrição */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    📝 Título do Procedimento
                  </label>
                  <Input
                    value={formData.procedure_name}
                    onChange={(e) => setFormData({ ...formData, procedure_name: e.target.value })}
                    placeholder="Ex: Lipo de Papada com a máquina Pixie"
                    className="text-lg font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    📄 Descrição do Resultado
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva o resultado obtido, benefícios, tecnologia utilizada..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Imagens */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700">📸 Imagens do Procedimento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Imagem Antes */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-red-700">🔴 Imagem ANTES</label>
                    {beforeImagePreview && (
                      <div className="relative">
                        <img 
                          src={beforeImagePreview} 
                          alt="Preview antes" 
                          className="w-full h-32 object-cover rounded-lg border-2 border-red-300"
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                          ANTES
                        </div>
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, before_image: file });
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setBeforeImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      required={!editingId}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Imagem Depois */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-green-700">🟢 Imagem DEPOIS</label>
                    {afterImagePreview && (
                      <div className="relative">
                        <img 
                          src={afterImagePreview} 
                          alt="Preview depois" 
                          className="w-full h-32 object-cover rounded-lg border-2 border-green-300"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
                          DEPOIS
                        </div>
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, after_image: file });
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setAfterImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      required={!editingId}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                {editingId ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Galeria
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                Cancelar
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Espaçador */}
      <div className="h-6"></div>
      
      {/* Mensagem quando não há galerias */}
      {images.length === 0 && !isAdding && (
        <Card className="p-8 text-center border-2 border-dashed border-gray-300">
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma galeria cadastrada</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Comece adicionando sua primeira galeria de antes e depois para mostrar os resultados dos procedimentos.
            </p>
            <Button onClick={() => setIsAdding(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Galeria
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
