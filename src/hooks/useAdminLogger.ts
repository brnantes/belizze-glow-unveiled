import { supabase } from "@/lib/supabase";

interface LogEntry {
  action: string;
  details?: string;
  resourceType?: string;
  resourceId?: string;
}

export const useAdminLogger = () => {
  const getCurrentAdmin = () => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.email;
      } catch {
        return null;
      }
    }
    return null;
  };

  const logActivity = async (entry: LogEntry) => {
    try {
      const adminEmail = getCurrentAdmin();
      if (!adminEmail) return;

      // Capturar informações do navegador
      const userAgent = navigator.userAgent;
      
      // Tentar capturar IP (limitado no frontend, mas podemos tentar)
      let ipAddress = 'N/A';
      
      const logData = {
        admin_email: adminEmail,
        action: entry.action,
        details: entry.details || null,
        resource_type: entry.resourceType || null,
        resource_id: entry.resourceId || null,
        ip_address: ipAddress,
        user_agent: userAgent
      };

      console.log('📝 Registrando atividade:', logData);

      const { error } = await supabase
        .from('admin_activity_logs')
        .insert([logData]);

      if (error) {
        console.error('❌ Erro ao registrar log:', error);
      } else {
        console.log('✅ Log registrado com sucesso');
      }
    } catch (error) {
      console.error('❌ Erro no sistema de logs:', error);
    }
  };

  // Funções específicas para diferentes tipos de ação
  const logLogin = () => {
    logActivity({
      action: 'LOGIN',
      details: 'Usuário fez login no painel administrativo'
    });
  };

  const logLogout = () => {
    logActivity({
      action: 'LOGOUT',
      details: 'Usuário fez logout do painel administrativo'
    });
  };

  const logImageUpload = (imageName: string, bucket: string) => {
    logActivity({
      action: 'IMAGE_UPLOAD',
      details: `Upload da imagem: ${imageName}`,
      resourceType: 'image',
      resourceId: `${bucket}/${imageName}`
    });
  };

  const logImageDelete = (imageName: string, bucket: string) => {
    logActivity({
      action: 'IMAGE_DELETE',
      details: `Exclusão da imagem: ${imageName}`,
      resourceType: 'image',
      resourceId: `${bucket}/${imageName}`
    });
  };

  const logGalleryCreate = (galleryName: string) => {
    logActivity({
      action: 'GALLERY_CREATE',
      details: `Criação da galeria: ${galleryName}`,
      resourceType: 'gallery',
      resourceId: galleryName
    });
  };

  const logGalleryDelete = (galleryName: string, galleryId: string) => {
    logActivity({
      action: 'GALLERY_DELETE',
      details: `Exclusão da galeria: ${galleryName}`,
      resourceType: 'gallery',
      resourceId: galleryId
    });
  };

  const logUserCreate = (userEmail: string) => {
    logActivity({
      action: 'USER_CREATE',
      details: `Criação do usuário administrador: ${userEmail}`,
      resourceType: 'user',
      resourceId: userEmail
    });
  };

  const logUserDelete = (userEmail: string) => {
    logActivity({
      action: 'USER_DELETE',
      details: `Exclusão do usuário administrador: ${userEmail}`,
      resourceType: 'user',
      resourceId: userEmail
    });
  };

  const logMentorshipLeadView = (leadId: string) => {
    logActivity({
      action: 'MENTORSHIP_LEAD_VIEW',
      details: `Visualização do lead de mentoria`,
      resourceType: 'mentorship_lead',
      resourceId: leadId
    });
  };

  return {
    logActivity,
    logLogin,
    logLogout,
    logImageUpload,
    logImageDelete,
    logGalleryCreate,
    logGalleryDelete,
    logUserCreate,
    logUserDelete,
    logMentorshipLeadView,
    getCurrentAdmin
  };
};
