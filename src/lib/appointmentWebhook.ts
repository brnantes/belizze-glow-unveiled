import { supabase } from './supabase';

export interface AppointmentWebhookData {
  name: string;
  email: string;
  phone: string;
  procedure_interest: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
}

// Função para buscar a URL do webhook de agendamentos
export const getAppointmentWebhookUrl = async (): Promise<string | null> => {
  try {
    console.log('🔍 Buscando webhook URL de agendamentos...');
    
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'appointment_webhook_url')
      .single();

    if (error) {
      console.log('⚠️ Webhook URL não configurada ainda:', error.message);
      return null;
    }

    console.log('✅ Webhook URL encontrada:', data?.value);
    return data?.value || null;
  } catch (error) {
    console.error('❌ Erro ao buscar URL do webhook:', error);
    return null;
  }
};

// Função para salvar/atualizar a URL do webhook de agendamentos
export const saveAppointmentWebhookUrl = async (url: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔧 Tentando salvar webhook URL:', url);
    
    const { data, error } = await supabase
      .from('app_settings')
      .upsert({
        key: 'appointment_webhook_url',
        value: url,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('❌ Erro no upsert:', error);
      throw error;
    }

    console.log('✅ Webhook URL salva com sucesso:', data);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao salvar URL do webhook:', error);
    return { success: false, error: error.message };
  }
};

// Função para enviar dados do agendamento para o webhook
export const sendAppointmentToWebhook = async (appointmentData: AppointmentWebhookData): Promise<{ success: boolean; error?: string }> => {
  try {
    const webhookUrl = await getAppointmentWebhookUrl();
    
    if (!webhookUrl) {
      console.log('URL do webhook não configurada, pulando envio');
      return { success: true }; // Não é erro se não estiver configurado
    }

    console.log('📤 Enviando agendamento para webhook:', webhookUrl);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'appointment',
        data: appointmentData,
        timestamp: new Date().toISOString(),
        source: 'belizze-website'
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook retornou status ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Agendamento enviado com sucesso para o webhook');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Erro ao enviar agendamento para webhook:', error);
    return { success: false, error: error.message };
  }
};
