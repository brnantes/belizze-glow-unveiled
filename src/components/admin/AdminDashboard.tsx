import { StatCard } from "./StatCard";
import { Sparkles, ImageIcon, Calendar, Users, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardProps {
  stats: {
    totalProcedures: number;
    totalBeforeAfter: number;
    totalAppointments: number;
    totalViews: number;
  };
}

export const AdminDashboard = ({ stats }: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Procedimentos"
          value={stats.totalProcedures}
          icon={Sparkles}
          trend="+12% este mês"
          trendUp={true}
        />
        <StatCard
          title="Antes & Depois"
          value={stats.totalBeforeAfter}
          icon={ImageIcon}
          trend="+8% este mês"
          trendUp={true}
        />
        <StatCard
          title="Agendamentos"
          value={stats.totalAppointments}
          icon={Calendar}
          trend="+23% este mês"
          trendUp={true}
        />
        <StatCard
          title="Visualizações"
          value={stats.totalViews}
          icon={Eye}
          trend="+45% este mês"
          trendUp={true}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-rose-gold" />
              Procedimentos Mais Populares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Preenchimento Labial", count: 145, percentage: 35 },
                { name: "Botox", count: 98, percentage: 24 },
                { name: "Bioestimuladores", count: 87, percentage: 21 },
                { name: "Harmonização Facial", count: 82, percentage: 20 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-rose-gold h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-rose-gold" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Novo agendamento", client: "Maria Silva", time: "5 min atrás" },
                { action: "Procedimento concluído", client: "Ana Costa", time: "1 hora atrás" },
                { action: "Novo depoimento", client: "Julia Santos", time: "2 horas atrás" },
                { action: "Agendamento confirmado", client: "Carla Oliveira", time: "3 horas atrás" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="h-2 w-2 rounded-full bg-rose-gold mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.client}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
