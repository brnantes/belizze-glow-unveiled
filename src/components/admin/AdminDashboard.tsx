import { useState, useEffect } from "react";
import { StatCard } from "./StatCard";
import { Sparkles, ImageIcon, Calendar, Users, TrendingUp, Eye, Mail, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface RealStats {
  totalMentorshipLeads: number;
  totalBeforeAfter: number;
  totalSiteImages: number;
  totalAdmins: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<RealStats>({
    totalMentorshipLeads: 0,
    totalBeforeAfter: 0,
    totalSiteImages: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  // Carregar estatísticas reais do banco
  const loadRealStats = async () => {
    try {
      setLoading(true);

      // Contar leads de mentoria
      const { count: mentorshipCount } = await supabase
        .from('mentorship_leads')
        .select('*', { count: 'exact', head: true });

      // Contar galerias antes/depois
      const { count: beforeAfterCount } = await supabase
        .from('before_after')
        .select('*', { count: 'exact', head: true });

      // Contar imagens do site
      const { data: siteImagesData } = await supabase.storage
        .from('site-images')
        .list();

      // Contar admins
      const { count: adminsCount } = await supabase
        .from('site_admins')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalMentorshipLeads: mentorshipCount || 0,
        totalBeforeAfter: beforeAfterCount || 0,
        totalSiteImages: siteImagesData?.length || 0,
        totalAdmins: adminsCount || 0,
      });

      // Carregar leads recentes
      const { data: recentLeadsData } = await supabase
        .from('mentorship_leads')
        .select('name, instagram, created_at')
        .order('created_at', { ascending: false })
        .limit(4);

      setRecentLeads(recentLeadsData || []);

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealStats();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} horas atrás`;
    return `${Math.floor(diffInMinutes / 1440)} dias atrás`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do sistema Belizze</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Formulários de Mentoria"
          value={stats.totalMentorshipLeads}
          icon={Mail}
          trend="Leads interessados"
          trendUp={true}
        />
        <StatCard
          title="Galerias Antes & Depois"
          value={stats.totalBeforeAfter}
          icon={ImageIcon}
          trend="Casos de sucesso"
          trendUp={true}
        />
        <StatCard
          title="Imagens do Site"
          value={stats.totalSiteImages}
          icon={FileText}
          trend="Arquivos de mídia"
          trendUp={true}
        />
        <StatCard
          title="Administradores"
          value={stats.totalAdmins}
          icon={Users}
          trend="Usuários do sistema"
          trendUp={true}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-rose-gold" />
              Recursos do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Formulário de Mentoria", count: stats.totalMentorshipLeads, description: "Leads capturados" },
                { name: "Galerias de Resultados", count: stats.totalBeforeAfter, description: "Casos documentados" },
                { name: "Banco de Imagens", count: stats.totalSiteImages, description: "Arquivos disponíveis" },
                { name: "Painel Administrativo", count: stats.totalAdmins, description: "Usuários com acesso" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="ml-4 text-lg font-bold text-rose-gold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-rose-gold" />
              Leads de Mentoria Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-gold mx-auto"></div>
                </div>
              ) : recentLeads.length > 0 ? (
                recentLeads.map((lead, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="h-2 w-2 rounded-full bg-rose-gold mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">@{lead.instagram}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(lead.created_at)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">Nenhum lead de mentoria ainda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
