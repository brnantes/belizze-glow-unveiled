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
  Code
} from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { BeforeAfterManager } from "@/components/admin/BeforeAfterManager";
import { SiteImagesManager } from "@/components/admin/SiteImagesManager";
import { MentorshipLeadsManager } from "@/components/admin/MentorshipLeadsManager";
import { UserManager } from "@/components/admin/UserManager";
import { TrackingPixelsManager } from "@/components/admin/TrackingPixelsManager";
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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      fetchProcedures();
      fetchBeforeAfterImages();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/admin-login", { replace: true });
      } else {
        setSession(session);
      }
    });

    // Listener para recarregar dados quando necessário
    const handleReloadData = () => {
      console.log('🔄 Recarregando dados do before/after...');
      fetchBeforeAfterImages();
    };
    
    window.addEventListener('reloadBeforeAfterData', handleReloadData);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('reloadBeforeAfterData', handleReloadData);
    };
  }, [navigate]);

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
      const { error } = await supabase
        .from('before_after')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Galeria excluída com sucesso!");
      fetchBeforeAfterImages();
    } catch (error: any) {
      toast.error(`Erro ao excluir galeria: ${error.message}`);
      throw error;
    }
  };

  const handleLogout = () => {
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

  // Menu items configuration
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "before-after", label: "Antes & Depois", icon: <ImageIcon className="h-5 w-5" /> },
    { id: "site-images", label: "Imagens do Site", icon: <Images className="h-5 w-5" /> },
    { id: "mentorship-leads", label: "Leads Mentoria", icon: <Users className="h-5 w-5" /> },
    { id: "appointments", label: "Agendamentos", icon: <Calendar className="h-5 w-5" /> },
    { id: "users", label: "Usuários", icon: <UserCog className="h-5 w-5" /> },
    { id: "tracking-pixels", label: "Pixels de Rastreamento", icon: <Code className="h-5 w-5" /> },
  ];

  // Handle menu item click
  const handleMenuClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Render active content based on selected tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard stats={stats} />;
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
      case "appointments":
        return (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-serif font-bold mb-2">Agendamentos</h3>
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
          </div>
        );
      case "users":
        return <UserManager />;
      case "tracking-pixels":
        return <TrackingPixelsManager />;
      default:
        return <AdminDashboard stats={stats} />;

    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#23282d] text-gray-200 w-64 flex-shrink-0 transition-all duration-300 ease-in-out overflow-y-auto",
          !sidebarOpen && "w-16"
        )}
      >
        {/* Logo and Brand */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-3">
            <BelizzeSimpleLogo />
            {sidebarOpen && (
              <h1 className="text-lg font-medium text-white">Belizze</h1>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronRight className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors",
                    activeTab === item.id ? "bg-gray-800 border-l-4 border-rose-gold" : ""
                  )}
                >
                  <span className="text-gray-400">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="text-sm">{item.label}</span>
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
        <header className="bg-white border-b shadow-sm z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-serif font-bold">Painel Administrativo</h1>
              <p className="text-xs text-muted-foreground">Belizze Estética Avançada</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{session?.user?.email}</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm">
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
