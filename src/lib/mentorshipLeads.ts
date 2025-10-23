import { supabase } from "./supabase";

// Chave usada na tabela de configurações
const WEBHOOK_KEY = 'mentorship_webhook_url';

export interface MentorshipLead {
  id?: string;
  name: string;
  instagram: string;
  location: string;
  family_routine: string;
  education: string;
  experience: string;
  whatsapp: string;
  email: string;
  status?: 'new' | 'contacted' | 'scheduled' | 'rejected';
  notes?: string;
  created_at?: string;
}

/**
 * Salva um novo lead de mentoria no Supabase
 */
export const saveMentorshipLead = async (
  leadData: Omit<MentorshipLead, 'id' | 'status' | 'notes' | 'created_at'>
) => {
  try {
    // Formatar os dados para o formato do banco
    const formattedData = {
      name: leadData.name,
      instagram: leadData.instagram,
      location: leadData.location,
      family_routine: leadData.family_routine,
      education: leadData.education,
      experience: leadData.experience,
      whatsapp: leadData.whatsapp,
      email: leadData.email,
      status: 'new' as const,
      created_at: new Date().toISOString()
    };

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('mentorship_leads')
      .insert([formattedData])
      .select();

    if (error) throw error;
    
    console.log('✅ Lead salvo com sucesso:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Erro ao salvar lead:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envia os dados do lead para um webhook externo
 */
// Lê a URL do webhook do banco ou da variável de ambiente
export const getMentorshipWebhookUrl = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', WEBHOOK_KEY)
      .maybeSingle();

    if (error) throw error;

    const dbUrl = data?.value as string | undefined;
    const envUrl = (import.meta as any)?.env?.VITE_MENTORSHIP_WEBHOOK_URL || (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_WEBHOOK_URL : undefined);
    return dbUrl || envUrl || null;
  } catch (e) {
    const envFallback = (import.meta as any)?.env?.VITE_MENTORSHIP_WEBHOOK_URL || (typeof process !== 'undefined' ? (process.env as any)?.NEXT_PUBLIC_WEBHOOK_URL : undefined);
    return envFallback || null;
  }
};

// Atualiza ou cria a URL do webhook no banco
export const setMentorshipWebhookUrl = async (url: string) => {
  const { error } = await supabase
    .from('app_settings')
    .upsert({ key: WEBHOOK_KEY, value: url }, { onConflict: 'key' });
  if (error) throw error;
  return true;
};

export const sendLeadToWebhook = async (leadData: MentorshipLead) => {
  try {
    // Obter o webhook salvo (painel) ou fallback do ambiente
    const webhookUrl = await getMentorshipWebhookUrl();
    if (!webhookUrl) {
      console.warn('Nenhuma URL de webhook configurada. Pulei envio.');
      return { success: true, skipped: true } as any;
    }

    console.log('💬 Tentando enviar para webhook:', webhookUrl);

    // Formatar dados para o webhook (garantir que todos os campos estão presentes)
    const webhookData = {
      source: 'website_mentorship_form',
      data: {
        ...leadData,
        // Garantir que todos os campos estão presentes, mesmo que vazios
        name: leadData.name || '',
        instagram: leadData.instagram || '',
        location: leadData.location || '',
        family_routine: leadData.family_routine || '',
        education: leadData.education || '',
        experience: leadData.experience || '',
        whatsapp: leadData.whatsapp || '',
        email: leadData.email || '',
        status: leadData.status || 'new',
        created_at: leadData.created_at || new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    console.log('💬 Payload do webhook:', webhookData);

    // Enviar os dados para o webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No response body');
      console.error('❌ Resposta do webhook não-OK:', response.status, errorText);
      throw new Error(`Erro ao enviar para webhook: ${response.status} ${errorText}`);
    }

    const responseData = await response.text().catch(() => 'No response body');
    console.log('✅ Lead enviado para webhook com sucesso. Resposta:', responseData);
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao enviar para webhook:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtém todos os leads de mentoria
 */
export const getMentorshipLeads = async () => {
  try {
    const { data, error } = await supabase
      .from('mentorship_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Erro ao buscar leads:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Atualiza o status de um lead
 */
export const updateLeadStatus = async (leadId: string, status: 'new' | 'contacted' | 'scheduled' | 'rejected', notes?: string) => {
  try {
    const updateData: { status: string; notes?: string } = { status };
    if (notes) updateData.notes = notes;

    const { data, error } = await supabase
      .from('mentorship_leads')
      .update(updateData)
      .eq('id', leadId)
      .select();

    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ Erro ao atualizar lead:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Deleta um lead de mentoria
 */
export const deleteMentorshipLead = async (leadId: string) => {
  try {
    const { error } = await supabase
      .from('mentorship_leads')
      .delete()
      .eq('id', leadId);

    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erro ao deletar lead:', error);
    return { success: false, error: error.message };
  }
};
