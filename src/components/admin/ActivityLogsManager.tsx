import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { RefreshCw, Eye, Shield, Clock, User, Activity } from "lucide-react";

interface ActivityLog {
  id: string;
  admin_email: string;
  action: string;
  details: string | null;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export const ActivityLogsManager = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<string>("");

  // Verificar se é o admin principal
  const isMainAdmin = () => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        return parsed.email === 'admin@belizze.com.br';
      } catch {
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setCurrentAdmin(parsed.email);
      } catch {
        setCurrentAdmin("");
      }
    }

    if (isMainAdmin()) {
      loadLogs();
    }
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setLogs(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar logs:", error);
      toast.error(`Erro ao carregar logs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'bg-green-100 text-green-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'IMAGE_UPLOAD': return 'bg-blue-100 text-blue-800';
      case 'IMAGE_DELETE': return 'bg-red-100 text-red-800';
      case 'GALLERY_CREATE': return 'bg-purple-100 text-purple-800';
      case 'GALLERY_DELETE': return 'bg-orange-100 text-orange-800';
      case 'USER_CREATE': return 'bg-emerald-100 text-emerald-800';
      case 'USER_DELETE': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN': return '🔐';
      case 'LOGOUT': return '🚪';
      case 'IMAGE_UPLOAD': return '📤';
      case 'IMAGE_DELETE': return '🗑️';
      case 'GALLERY_CREATE': return '🖼️';
      case 'GALLERY_DELETE': return '❌';
      case 'USER_CREATE': return '👤';
      case 'USER_DELETE': return '🚫';
      default: return '📝';
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'Login no sistema';
      case 'LOGOUT': return 'Logout do sistema';
      case 'IMAGE_UPLOAD': return 'Upload de imagem';
      case 'IMAGE_DELETE': return 'Exclusão de imagem';
      case 'GALLERY_CREATE': return 'Criação de galeria';
      case 'GALLERY_DELETE': return 'Exclusão de galeria';
      case 'USER_CREATE': return 'Criação de usuário';
      case 'USER_DELETE': return 'Exclusão de usuário';
      case 'MENTORSHIP_LEAD_VIEW': return 'Visualização de lead';
      default: return action;
    }
  };

  // Se não for o admin principal, mostrar acesso negado
  if (!isMainAdmin()) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Esta seção é exclusiva para o administrador principal. 
            Apenas o admin@belizze.com.br pode visualizar os logs de atividade.
          </p>
          <Badge variant="secondary" className="mt-4">
            <User className="h-4 w-4 mr-1" />
            Usuário atual: {currentAdmin}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Logs de Atividade</h2>
          <p className="text-muted-foreground">
            Monitoramento das ações realizadas pelos administradores
          </p>
        </div>
        <Button 
          onClick={loadLogs} 
          variant="outline"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-rose-gold" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>
            Últimas 100 atividades registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold mx-auto"></div>
              <p className="text-muted-foreground mt-4">Carregando logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhuma atividade registrada</h3>
              <p className="text-muted-foreground">
                Os logs de atividade aparecerão aqui conforme os administradores usam o sistema.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border">
                  <div className="text-2xl">{getActionIcon(log.action)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(log.action)}>
                        {getActionDescription(log.action)}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {log.admin_email}
                      </span>
                    </div>
                    
                    {log.details && (
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(log.created_at)}
                      </div>
                      
                      {log.resource_type && (
                        <div className="flex items-center gap-1">
                          <span>Tipo:</span>
                          <Badge variant="outline" className="text-xs">
                            {log.resource_type}
                          </Badge>
                        </div>
                      )}
                      
                      {log.ip_address && log.ip_address !== 'N/A' && (
                        <div className="flex items-center gap-1">
                          <span>IP:</span>
                          <code className="text-xs bg-gray-200 px-1 rounded">
                            {log.ip_address}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
