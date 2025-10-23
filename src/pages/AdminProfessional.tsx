import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase, Procedure, BeforeAfterImage } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Sparkles, 
  ImageIcon, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  Images, 
  Users, 
  ChevronRight,
  Settings,
  Home,
  UserCog,
  Code,
  Shield,
  HelpCircle
} from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { BeforeAfterManager } from "@/components/admin/BeforeAfterManager";
import { SiteImagesManager } from "@/components/admin/SiteImagesManager";
import { MentorshipLeadsManager } from "@/components/admin/MentorshipLeadsManager";
import { UserManager } from "@/components/admin/UserManager";
import { TrackingPixelsManager } from "@/components/admin/TrackingPixelsManager";
import { ActivityLogsManager } from "@/components/admin/ActivityLogsManager";
import { FAQManager } from "@/components/admin/FAQManager";
import { AppointmentsManager } from "@/components/admin/AppointmentsManager";
import { useAdminLogger } from "@/hooks/useAdminLogger";
import { BelizzeSimpleLogo } from "@/components/BelizzeSimpleLogo";
import { cn } from "@/lib/utils";

const AdminProfessional = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [beforeAfterImages, setBeforeAfterImages] = useState<BeforeAfterImage[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { logLogout } = useAdminLogger();

  useEffect(() => {
    // Usar apenas a sessão local do admin criada em AdminLogin/ProtectedRoute
    const localSession = localStorage.getItem('admin_session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        setSession(parsed);
      } catch {
        setSession({});
      }
    } else {
      navigate("/admin-login", { replace: true });
    }

    setLoading(false);
    fetchProcedures();
    fetchBeforeAfterImages();

    // Listener para recarregar dados quando necessário
    const handleReloadData = () => {
      console.log('🔄 Recarregando dados do before/after...');
      fetchBeforeAfterImages();
    };

    window.addEventListener('reloadBeforeAfterData', handleReloadData);

    return () => {
      window.removeEventListener('reloadBeforeAfterData', handleReloadData);
    };
  }, []);

  const fetchProcedures = async () => {
    try {
      const { data, error } = await supabase
        .from('procedures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProcedures(data || []);
    } catch (error) {
      console.error("Erro ao buscar procedimentos:", error);
      toast.error("Erro ao carregar procedimentos");
    }
  };

  const fetchBeforeAfterImages = async () => {
    try {
      console.log('🔍 Iniciando busca de imagens before_after...');
      
      const { data, error } = await supabase
        .from('before_after')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("🔍 Dados do banco before_after:", { 
        count: data?.length || 0,
        error: error,
        data: data
      });
      
      if (error) throw error;
      
      // Verificar se os dados têm a estrutura esperada
      if (data && data.length > 0) {
        console.log('💾 Estrutura do primeiro item:', {
          id: data[0].id,
          procedure_name: data[0].procedure_name,
          before_image_url: data[0].before_image_url?.substring(0, 50) + '...',
          after_image_url: data[0].after_image_url?.substring(0, 50) + '...',
        });
      }
      
      setBeforeAfterImages(data || []);
      console.log('✅ BeforeAfterImages atualizadas com', data?.length || 0, 'itens');
    } catch (error) {
      console.error("❌ Erro ao buscar imagens antes/depois:", error);
      toast.error("Erro ao carregar imagens antes/depois");
    }
  };

  const handleAddProcedure = async (procedureData: any) => {
    try {
      const { data, error } = await supabase
        .from('procedures')
        .insert([procedureData])
        .select();

      if (error) throw error;
      
      toast.success("Procedimento adicionado com sucesso!");
      fetchProcedures();
    } catch (error: any) {
      toast.error(`Erro ao adicionar procedimento: ${error.message}`);
      throw error;
    }
  };

  const handleUpdateProcedure = async (id: string, procedureData: any) => {
    try {
      const { error } = await supabase
        .from('procedures')
        .update(procedureData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Procedimento atualizado com sucesso!");
      fetchProcedures();
    } catch (error: any) {
      toast.error(`Erro ao atualizar procedimento: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteProcedure = async (id: string) => {
    try {
      const { error } = await supabase
        .from('procedures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Procedimento excluído com sucesso!");
      fetchProcedures();
    } catch (error: any) {
      toast.error(`Erro ao excluir procedimento: ${error.message}`);
      throw error;
    }
  };

  const handleAddBeforeAfter = async (data: any) => {
    try {
      console.log('🔍 handleAddBeforeAfter chamado com:', data);
      
      // Se não há imagens como arquivos, usar as URLs fornecidas (caso dos templates)
      let beforeUrl = data.before_image_url;
      let afterUrl = data.after_image_url;
      
      // Se há arquivos de imagem, fazer upload
      if (data.before_image && data.before_image instanceof File) {
        const beforeFileName = `${Date.now()}_before_${data.before_image.name}`;
        const { error: beforeError } = await supabase.storage
          .from('before_after')
          .upload(beforeFileName, data.before_image);
        
        if (beforeError) throw beforeError;
        beforeUrl = supabase.storage.from('before_after').getPublicUrl(beforeFileName).data.publicUrl;
      }

      if (data.after_image && data.after_image instanceof File) {
        const afterFileName = `${Date.now()}_after_${data.after_image.name}`;
        const { error: afterError } = await supabase.storage
          .from('before_after')
          .upload(afterFileName, data.after_image);
        
        if (afterError) throw afterError;
        afterUrl = supabase.storage.from('before_after').getPublicUrl(afterFileName).data.publicUrl;
      }

      // Verificar se temos as URLs necessárias
      if (!beforeUrl || !afterUrl) {
        throw new Error("URLs das imagens não disponíveis");
      }

      console.log('💾 Inserindo no banco:', {
        procedure_name: data.procedure_name,
        description: data.description,
        is_featured: data.is_featured,
        before_image_url: beforeUrl,
        after_image_url: afterUrl
      });

      const { error } = await supabase
        .from('before_after')
        .insert([{
          procedure_name: data.procedure_name,
          description: data.description,
          is_featured: data.is_featured,
          before_image_url: beforeUrl,
          after_image_url: afterUrl
        }]);

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }
      
      console.log('✅ Inserção no banco bem-sucedida!');
      toast.success("Galeria adicionada com sucesso!");
      fetchBeforeAfterImages();
    } catch (error: any) {
      console.error('❌ Erro em handleAddBeforeAfter:', error);
      toast.error(`Erro ao adicionar galeria: ${error.message}`);
      throw error;
    }
  };

  const handleUpdateBeforeAfter = async (id: string, data: any) => {
    try {
      const updateData: any = {
        procedure_name: data.procedure_name,
        description: data.description,
        is_featured: data.is_featured,
      };

      // Se houver novas imagens, fazer upload
      if (data.before_image) {
        const beforeFileName = `${Date.now()}_before_${data.before_image.name}`;
        const { error: beforeError } = await supabase.storage
          .from('before_after')
          .upload(beforeFileName, data.before_image);
        
        if (beforeError) throw beforeError;
        updateData.before_image_url = supabase.storage.from('before_after').getPublicUrl(beforeFileName).data.publicUrl;
      }

      if (data.after_image) {
        const afterFileName = `${Date.now()}_after_${data.after_image.name}`;
        const { error: afterError } = await supabase.storage
          .from('before_after')
          .upload(afterFileName, data.after_image);
        
        if (afterError) throw afterError;
        updateData.after_image_url = supabase.storage.from('before_after').getPublicUrl(afterFileName).data.publicUrl;
      }

      const { error } = await supabase
        .from('before_after')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Galeria atualizada com sucesso!");
      fetchBeforeAfterImages();
    } catch (error: any) {
      toast.error(`Erro ao atualizar galeria: ${error.message}`);
      throw error;
    }
  };

  const handleDeleteBeforeAfter = async (id: string) => {
    try {
      console.log(`🗑️ Iniciando deleção da galeria ${id}...`);
      
      // Deletar apenas do banco de dados - NÃO deletar imagens do storage
      const { error: dbError } = await supabase
        .from('before_after')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('❌ Erro ao deletar do banco:', dbError);
        throw dbError;
      }
      
      console.log(`✅ Registro deletado do banco de dados`);
      
      // Atualizar o estado imediatamente removendo a galeria deletada
      setBeforeAfterImages(prevImages => {
        const updated = prevImages.filter(img => img.id !== id);
        console.log(`✅ Estado atualizado. Galerias restantes: ${updated.length}`);
        return updated;
      });
      
      toast.success("Galeria excluída com sucesso!");
      
    } catch (error: any) {
      console.error(`❌ Erro ao excluir galeria:`, error);
      toast.error(`Erro ao excluir galeria: ${error.message}`);
      throw error;
    }
  };

  const handleLogout = () => {
    // Registrar logout antes de remover a sessão
    logLogout();
    
    localStorage.removeItem('admin_session');
    toast.success("Logout realizado com sucesso!");
    navigate("/admin-login", { replace: true });
  };

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold"></div>
      </div>
    );
  }

  const stats = {
    totalProcedures: procedures.length,
    totalBeforeAfter: beforeAfterImages.length,
    totalAppointments: 127,
    totalViews: 8542
  };

  // Verificar se é o admin principal
  const isMainAdmin = session?.email === 'admin@belizze.com.br';

  // Menu items configuration
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "before-after", label: "Antes & Depois", icon: <ImageIcon className="h-5 w-5" /> },
    { id: "site-images", label: "Imagens do Site", icon: <Images className="h-5 w-5" /> },
    { id: "mentorship-leads", label: "Leads Mentoria", icon: <Users className="h-5 w-5" /> },
    { id: "faq", label: "Perguntas Frequentes", icon: <HelpCircle className="h-5 w-5" /> },
    { id: "appointments", label: "Agendamentos", icon: <Calendar className="h-5 w-5" /> },
    { id: "users", label: "Usuários", icon: <UserCog className="h-5 w-5" /> },
    { id: "tracking-pixels", label: "Pixels de Rastreamento", icon: <Code className="h-5 w-5" /> },
    ...(isMainAdmin ? [{ id: "activity-logs", label: "Logs de Atividade", icon: <Shield className="h-5 w-5" /> }] : []),
  ];

  // Handle menu item click
  const handleMenuClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Render active content based on selected tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "before-after":
        return (
          <BeforeAfterManager
            images={beforeAfterImages}
            procedures={procedures}
            onAdd={handleAddBeforeAfter}
            onDelete={handleDeleteBeforeAfter}
            onUpdate={handleUpdateBeforeAfter}
          />
        );
      case "site-images":
        return <SiteImagesManager />;
      case "mentorship-leads":
        return <MentorshipLeadsManager />;
      case "faq":
        return <FAQManager />;
      case "appointments":
        return <AppointmentsManager />;
      case "users":
        return <UserManager />;
      case "tracking-pixels":
        return <TrackingPixelsManager />;
      case "activity-logs":
        return <ActivityLogsManager />;
      default:
        return <AdminDashboard />;

    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-gradient-to-b from-beige-light to-nude-elegant text-gray-700 w-64 flex-shrink-0 transition-all duration-300 ease-in-out overflow-y-auto shadow-lg",
          !sidebarOpen && "w-16"
        )}
      >
        {/* Header da Sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-rose-gold/20">
          {sidebarOpen && (
            <div className="flex-1 text-center">
              <h1 className="text-sm font-serif text-rose-gold-metallic">Menu</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-gold hover:text-rose-gold-metallic hover:bg-rose-gold/10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-gold/10 transition-colors rounded-lg mx-2",
                    activeTab === item.id ? "bg-rose-gold/20 border-l-4 border-rose-gold-metallic text-rose-gold-metallic" : "text-gray-600"
                  )}
                >
                  <span className={cn(
                    "transition-colors",
                    activeTab === item.id ? "text-rose-gold-metallic" : "text-gray-500"
                  )}>{item.icon}</span>
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-rose-gold/10 shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Logo da Belizze no cabeçalho */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <BelizzeSimpleLogo />
              </div>
              <div>
                <h1 className="text-lg font-serif font-bold text-rose-gold-metallic">Belizze</h1>
                <p className="text-xs text-gray-500">Estética Avançada</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{session?.email || 'Administrador'}</p>
                <p className="text-xs text-rose-gold-metallic">Online</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                size="sm"
                className="border-rose-gold/30 text-rose-gold-metallic hover:bg-rose-gold/10 hover:border-rose-gold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfessional;
