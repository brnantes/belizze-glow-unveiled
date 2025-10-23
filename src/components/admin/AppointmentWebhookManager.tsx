import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Webhook, Save, TestTube, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { getAppointmentWebhookUrl, saveAppointmentWebhookUrl, sendAppointmentToWebhook } from "@/lib/appointmentWebhook";
import { useAdminLogger } from "@/hooks/useAdminLogger";

export const AppointmentWebhookManager = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{ success: boolean; timestamp: string } | null>(null);
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);

  const { logActivity } = useAdminLogger();

  useEffect(() => {
    loadWebhookUrl();
  }, []);

  const loadWebhookUrl = async () => {
    try {
      console.log('🔄 Carregando webhook URL...');
      const url = await getAppointmentWebhookUrl();
      console.log('📥 URL carregada:', url);
      setWebhookUrl(url || "");
    } catch (error) {
      console.error("Erro ao carregar URL do webhook:", error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      console.log('🔧 Iniciando salvamento do webhook:', webhookUrl.trim());

      const result = await saveAppointmentWebhookUrl(webhookUrl.trim());
      console.log('📝 Resultado do salvamento:', result);
      
      if (result.success) {
        await logActivity({
          action: 'APPOINTMENT_WEBHOOK_UPDATE',
          details: `URL do webhook de agendamentos atualizada: ${webhookUrl.trim() ? 'configurada' : 'removida'}`,
          resourceType: 'webhook',
          resourceId: 'appointment_webhook'
        });

        toast.success("URL do webhook salva com sucesso!");
        console.log('✅ Webhook salvo e toast exibido');
      } else {
        console.error('❌ Falha no salvamento:', result.error);
        throw new Error(result.error || "Erro desconhecido");
      }
    } catch (error: any) {
      console.error("Erro ao salvar webhook:", error);
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!webhookUrl.trim()) {
      toast.error("Configure uma URL antes de testar");
      return;
    }

    try {
      setTesting(true);

      // Dados de teste
      const testData = {
        name: "Teste do Sistema",
        email: "teste@belizze.com.br",
        phone: "67999999999",
        procedure_interest: "Teste de Integração",
        preferred_date: new Date().toISOString().split('T')[0],
        preferred_time: "14:00",
        message: "Este é um teste automático do sistema de webhooks de agendamento."
      };

      const result = await sendAppointmentToWebhook(testData);
      
      setLastTestResult({
        success: result.success,
        timestamp: new Date().toLocaleString('pt-BR')
      });

      if (result.success) {
        await logActivity({
          action: 'APPOINTMENT_WEBHOOK_TEST',
          details: `Teste do webhook de agendamentos realizado com sucesso`,
          resourceType: 'webhook',
          resourceId: 'appointment_webhook'
        });

        toast.success("Teste enviado com sucesso!");
      } else {
        throw new Error(result.error || "Erro no teste");
      }
    } catch (error: any) {
      console.error("Erro no teste:", error);
      setLastTestResult({
        success: false,
        timestamp: new Date().toLocaleString('pt-BR')
      });
      toast.error(`Erro no teste: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowWebhookConfig(!showWebhookConfig)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Webhook className="h-4 w-4 text-rose-gold" />
              ⚙️ Configurações de Integração - Agendamentos
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Webhook para receber agendamentos automaticamente
            </CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            {showWebhookConfig ? "▼" : "▶"}
          </div>
        </div>
      </CardHeader>
      {showWebhookConfig && (
        <CardContent className="space-y-6 border-t pt-4">
        {/* URL Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">URL do Webhook</label>
            {webhookUrl && (
              <Badge variant={webhookUrl ? "default" : "secondary"}>
                {webhookUrl ? "Configurado" : "Não configurado"}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://seu-sistema.com/webhook/agendamentos"
              className="flex-1"
            />
            <Button 
              onClick={handleSave} 
              disabled={loading}
              variant="outline"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Os dados dos agendamentos serão enviados via POST para esta URL sempre que um novo agendamento for solicitado.
          </p>
        </div>

        {/* Test Section */}
        {webhookUrl && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Teste de Integração</label>
              {lastTestResult && (
                <Badge 
                  variant={lastTestResult.success ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {lastTestResult.success ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {lastTestResult.success ? "Sucesso" : "Falha"}
                </Badge>
              )}
            </div>
            <Button 
              onClick={handleTest} 
              disabled={testing || !webhookUrl.trim()}
              variant="outline"
              className="w-full"
            >
              <TestTube className="h-4 w-4 mr-2" />
              {testing ? "Testando..." : "Enviar Teste"}
            </Button>
            {lastTestResult && (
              <p className="text-xs text-muted-foreground">
                Último teste: {lastTestResult.timestamp}
              </p>
            )}
          </div>
        )}

        {/* Documentation */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <label className="text-sm font-medium">Formato dos Dados</label>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs font-mono">
              {`{
  "type": "appointment",
  "data": {
    "name": "Nome do Cliente",
    "email": "cliente@email.com",
    "phone": "67999999999",
    "procedure_interest": "Procedimento",
    "preferred_date": "2024-01-15",
    "preferred_time": "14:00",
    "message": "Observações opcionais"
  },
  "timestamp": "2024-01-15T14:30:00.000Z",
  "source": "belizze-website"
}`}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Os dados são enviados via POST com Content-Type: application/json
          </p>
        </div>
        </CardContent>
      )}
    </Card>
  );
};
