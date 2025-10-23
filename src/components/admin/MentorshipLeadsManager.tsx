import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Eye, MessageCircle, Calendar, X, Clock, Trash2 } from "lucide-react";
import { MentorshipLead, getMentorshipLeads, updateLeadStatus, getMentorshipWebhookUrl, setMentorshipWebhookUrl, deleteMentorshipLead } from "@/lib/mentorshipLeads";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const MentorshipLeadsManager = () => {
  const [leads, setLeads] = useState<MentorshipLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingLead, setEditingLead] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [savingWebhook, setSavingWebhook] = useState<boolean>(false);
  const [showWebhookConfig, setShowWebhookConfig] = useState<boolean>(false);

  // Carregar leads
  const loadLeads = async () => {
    setLoading(true);
    const result = await getMentorshipLeads();
    
    if (result.success) {
      setLeads(result.data || []);
    } else {
      toast.error("Erro ao carregar leads");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
    // Carregar URL do webhook
    (async () => {
      const url = await getMentorshipWebhookUrl();
      if (url) setWebhookUrl(url);
    })();
  }, []);

  // Salvar URL do webhook
  const handleSaveWebhook = async () => {
    try {
      setSavingWebhook(true);
      if (!webhookUrl || !/^https?:\/\//i.test(webhookUrl)) {
        toast.error("Informe uma URL válida iniciando com http ou https");
        return;
      }
      await setMentorshipWebhookUrl(webhookUrl);
      toast.success("Webhook salvo com sucesso");
    } catch (e: any) {
      toast.error(`Erro ao salvar webhook: ${e.message || e}`);
    } finally {
      setSavingWebhook(false);
    }
  };

  // Atualizar status do lead
  const handleStatusUpdate = async (leadId: string, status: 'new' | 'contacted' | 'scheduled' | 'rejected') => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const result = await updateLeadStatus(leadId, status, notes);
    if (result.success) {
      toast.success(`Status atualizado para ${getStatusLabel(status)}`);
      loadLeads();
      setExpandedLead(null);
      setNotes("");
    } else {
      toast.error("Erro ao atualizar status");
    }
  };

  // Deletar lead
  const handleDelete = async (lead: MentorshipLead) => {
    if (!confirm(`Tem certeza que deseja excluir o lead de ${lead.name}?`)) {
      return;
    }
    
    const result = await deleteMentorshipLead(lead.id!);
    
    if (result.success) {
      toast.success("Lead excluído com sucesso!");
      
      // Atualizar estado diretamente para resposta imediata
      setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));
      setExpandedLead(null);
      
      // Recarregar do banco para garantir sincronização
      await loadLeads();
    } else {
      toast.error(`Erro ao excluir lead: ${result.error || 'Erro desconhecido'}`);
    }
  };

  // Obter label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return "Novo";
      case 'contacted': return "Contatado";
      case 'scheduled': return "Agendado";
      case 'rejected': return "Rejeitado";
      default: return status;
    }
  };

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return "bg-blue-100 text-blue-800";
      case 'contacted': return "bg-yellow-100 text-yellow-800";
      case 'scheduled': return "bg-green-100 text-green-800";
      case 'rejected': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <MessageCircle className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'rejected': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  // Filtrar leads
  const filteredLeads = statusFilter === "all" 
    ? leads 
    : leads.filter(lead => lead.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Leads da Mentoria</h2>
          <p className="text-muted-foreground">
            Gerencie os leads que se inscreveram para a mentoria
          </p>
        </div>
        <Button 
          onClick={loadLeads} 
          variant="outline"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="new">Novos</SelectItem>
              <SelectItem value="contacted">Contatados</SelectItem>
              <SelectItem value="scheduled">Agendados</SelectItem>
              <SelectItem value="rejected">Rejeitados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'} encontrados
        </div>
      </div>

      {/* Lista de Leads */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <Card className="p-8 text-center border-2 border-dashed border-gray-300">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum lead encontrado</h3>
              <p className="text-gray-600 mb-6 text-sm">
                {statusFilter === "all" 
                  ? "Ainda não há leads cadastrados para a mentoria." 
                  : `Não há leads com o status "${getStatusLabel(statusFilter)}".`}
              </p>
            </div>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className={`border ${expandedLead === lead.id ? 'border-blue-300 shadow-md' : 'border-gray-200'}`}>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {lead.name}
                      <Badge className={`ml-2 ${getStatusColor(lead.status || 'new')} flex items-center gap-1`}>
                        {getStatusIcon(lead.status || 'new')}
                        {getStatusLabel(lead.status || 'new')}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {lead.instagram} • {lead.location} • {lead.whatsapp}
                    </CardDescription>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lead.created_at && formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">Email:</span> {lead.email}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {expandedLead === lead.id ? "Ocultar Detalhes" : "Ver Detalhes"}
                  </Button>
                </div>

                {expandedLead === lead.id && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div>
                      <h4 className="font-medium mb-1">Rotina Familiar</h4>
                      <p className="text-sm text-muted-foreground">{lead.family_routine}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Formação e Idade</h4>
                      <p className="text-sm text-muted-foreground">{lead.education}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Experiência</h4>
                      <p className="text-sm text-muted-foreground">{lead.experience}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">WhatsApp</h4>
                      <p className="text-sm text-muted-foreground">{lead.whatsapp}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Instagram</h4>
                      <p className="text-sm text-muted-foreground">{lead.instagram}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Localização</h4>
                      <p className="text-sm text-muted-foreground">{lead.location}</p>
                    </div>

                    {/* Notas e Atualização de Status */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-2">Notas e Próximos Passos</h4>
                      <Textarea
                        placeholder="Adicione notas sobre este lead..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mb-4"
                        rows={3}
                      />
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          onClick={() => handleStatusUpdate(lead.id!, 'new')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Marcar como Novo
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                          onClick={() => handleStatusUpdate(lead.id!, 'contacted')}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Marcar como Contatado
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          onClick={() => handleStatusUpdate(lead.id!, 'scheduled')}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Marcar como Agendado
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          onClick={() => handleStatusUpdate(lead.id!, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Marcar como Rejeitado
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDelete(lead)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Configurações - Webhook (Colapsável) */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowWebhookConfig(!showWebhookConfig)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">⚙️ Configurações de Integração</CardTitle>
              <CardDescription className="text-xs mt-1">Webhook para receber leads</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {showWebhookConfig ? "▼" : "▶"}
            </div>
          </div>
        </CardHeader>
        {showWebhookConfig && (
          <CardContent className="flex flex-col gap-3 border-t pt-4">
            <label className="text-sm font-medium">URL do Webhook</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://seu-webhook.exemplo/endpoint"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button onClick={handleSaveWebhook} disabled={savingWebhook}>
                {savingWebhook ? "Salvando..." : "Salvar"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ao salvar, todos os envios do formulário de mentoria serão POSTados para esta URL.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
