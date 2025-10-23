import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefreshCw, Calendar, Clock, User, Mail, Phone, Sparkles, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminLogger } from "@/hooks/useAdminLogger";
import { AppointmentWebhookManager } from "./AppointmentWebhookManager";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  procedure_interest: string;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export const AppointmentsManager = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { logActivity } = useAdminLogger();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('appointment_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAppointments(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar agendamentos:", error);
      toast.error(`Erro ao carregar agendamentos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) return;

      const { error } = await supabase
        .from('appointment_bookings')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      await logActivity({
        action: 'APPOINTMENT_STATUS_UPDATE',
        details: `Status do agendamento alterado para: ${newStatus} - Cliente: ${appointment.name}`,
        resourceType: 'appointment',
        resourceId: appointmentId
      });

      const statusLabels = {
        pending: 'pendente',
        confirmed: 'confirmado',
        cancelled: 'cancelado',
        completed: 'concluído'
      };

      toast.success(`Agendamento ${statusLabels[newStatus]} com sucesso!`);
      loadAppointments();
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      toast.error(`Erro ao alterar status: ${error.message}`);
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    if (!confirm(`Tem certeza que deseja excluir o agendamento de ${appointment.name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointment_bookings')
        .delete()
        .eq('id', appointment.id);

      if (error) throw error;

      await logActivity({
        action: 'APPOINTMENT_DELETE',
        details: `Agendamento excluído - Cliente: ${appointment.name}`,
        resourceType: 'appointment',
        resourceId: appointment.id
      });

      toast.success("Agendamento excluído com sucesso!");
      setAppointments(prev => prev.filter(apt => apt.id !== appointment.id));
    } catch (error: any) {
      console.error("Erro ao excluir agendamento:", error);
      toast.error(`Erro ao excluir: ${error.message}`);
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const getStatusCounts = () => {
    return {
      pending: appointments.filter(apt => apt.status === 'pending').length,
      confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
      cancelled: appointments.filter(apt => apt.status === 'cancelled').length,
      completed: appointments.filter(apt => apt.status === 'completed').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Agendamentos</h2>
          <p className="text-muted-foreground">
            Gerencie os agendamentos solicitados pelos clientes
          </p>
        </div>
        <Button 
          onClick={loadAppointments} 
          variant="outline"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmados</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelados</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.completed}</p>
              </div>
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-rose-gold" />
            Lista de Agendamentos ({appointments.length})
          </CardTitle>
          <CardDescription>
            Todos os agendamentos solicitados pelos clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && appointments.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold mx-auto"></div>
              <p className="text-muted-foreground mt-4">Carregando agendamentos...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground">
                Os agendamentos solicitados pelos clientes aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                          <User className="h-4 w-4 text-rose-gold-metallic" />
                          {appointment.name}
                        </h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {appointment.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {appointment.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          {appointment.procedure_interest}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(appointment.preferred_date)} às {appointment.preferred_time}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Solicitado em: {formatDateTime(appointment.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      {/* Botão de visualizar */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(appointment)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {/* Botões de status */}
                      {appointment.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {/* Botão de excluir */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(appointment)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              Informações completas do agendamento solicitado
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="font-medium">{selectedAppointment.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedAppointment.status)}>
                      {getStatusLabel(selectedAppointment.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-medium">{selectedAppointment.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">WhatsApp</label>
                  <p className="font-medium">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Procedimento</label>
                  <p className="font-medium">{selectedAppointment.procedure_interest}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data/Hora Preferida</label>
                  <p className="font-medium">
                    {formatDate(selectedAppointment.preferred_date)} às {selectedAppointment.preferred_time}
                  </p>
                </div>
              </div>
              
              {selectedAppointment.message && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedAppointment.message}
                  </p>
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Solicitado em</label>
                  <p className="text-sm">{formatDateTime(selectedAppointment.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                  <p className="text-sm">{formatDateTime(selectedAppointment.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webhook Integration Section */}
      <AppointmentWebhookManager />
    </div>
  );
};
