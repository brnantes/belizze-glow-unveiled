import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  AlertCircle 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPhoneNumber, removePhoneMask, isValidPhoneNumber } from "@/utils/phoneMask";
import { sendAppointmentToWebhook } from "@/lib/appointmentWebhook";

interface FormData {
  name: string;
  email: string;
  phone: string;
  procedure_interest: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
}

const procedureOptions = [
  "Preenchimento Labial",
  "Harmonização Facial",
  "Botox",
  "Bioestimuladores",
  "Rinoplastia sem Cirurgia",
  "Skincare Avançado",
  "Preenchimento de Olheiras",
  "Lifting sem Cirurgia",
  "Outros"
];

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00"
];

export const AppointmentBooking = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    procedure_interest: "",
    preferred_date: "",
    preferred_time: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Aplicar máscara no telefone
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.procedure_interest || !formData.preferred_date || !formData.preferred_time) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!isValidPhoneNumber(formData.phone)) {
      toast.error("Por favor, digite um número de telefone válido com DDD (11 dígitos)");
      return;
    }

    // Validar se a data não é no passado
    const selectedDate = new Date(formData.preferred_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error("Por favor, selecione uma data futura");
      return;
    }

    try {
      setLoading(true);

      // 1. Salvar os dados no Supabase
      const appointmentData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: removePhoneMask(formData.phone), // Remove máscara antes de salvar
        procedure_interest: formData.procedure_interest,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        message: formData.message.trim() || null,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('appointment_bookings')
        .insert(appointmentData)
        .select();

      if (error) throw error;

      console.log("📝 Agendamento salvo no banco de dados");

      // 2. Enviar para webhook (se configurado)
      const webhookData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: removePhoneMask(formData.phone),
        procedure_interest: formData.procedure_interest,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        message: formData.message.trim() || undefined
      };

      console.log("🔗 Enviando agendamento para webhook...");
      const webhookResult = await sendAppointmentToWebhook(webhookData);
      
      if (webhookResult.success) {
        console.log("✅ Webhook enviado com sucesso");
      } else {
        console.warn("⚠️ Falha no webhook (não afeta o agendamento):", webhookResult.error);
      }

      toast.success("Agendamento solicitado com sucesso! Entraremos em contato em breve.");
      
      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        phone: "",
        procedure_interest: "",
        preferred_date: "",
        preferred_time: "",
        message: ""
      });

    } catch (error: any) {
      console.error("Erro ao enviar agendamento:", error);
      
      // Mostrar erro mais específico
      let errorMessage = "Erro ao enviar agendamento. Tente novamente.";
      if (error?.message) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Data mínima (hoje)
  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="py-24 bg-gradient-to-br from-background to-beige-light/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-nude-elegant/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            Agende sua
            <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
              {" "}Consulta
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Preencha o formulário abaixo e nossa equipe entrará em contato para confirmar o melhor horário para você.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
          
          {/* Hero Image */}
          <div className="mt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/site-images/FOTOS-18.jpg"
                alt="Cliente agendando consulta pelo celular"
                className="w-full h-64 object-cover"
                onError={(e) => {
                  // Tentar diferentes extensões se a primeira falhar
                  const img = e.currentTarget;
                  if (img.src.includes('.jpg')) {
                    img.src = 'https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/site-images/FOTOS-18.png';
                  } else if (img.src.includes('.png')) {
                    img.src = 'https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/site-images/FOTOS-18';
                  } else {
                    // Se todas falharem, esconder a imagem
                    img.style.display = 'none';
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Importante sobre a data escolhida</h3>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    A data e horário selecionados são apenas uma <strong>preferência inicial</strong>. Nossa equipe entrará em contato 
                    para confirmar a disponibilidade e, se necessário, sugerir alternativas próximas à sua escolha. 
                    O agendamento só será confirmado após nosso contato.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="card-glass border border-rose-gold/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-rose-gold-metallic" />
                Formulário de Agendamento
              </CardTitle>
              <CardDescription>
                Preencha seus dados para solicitarmos seu agendamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-rose-gold-metallic" />
                      Nome Completo *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                      className="border-rose-gold/20 focus:border-rose-gold"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-rose-gold-metallic" />
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="border-rose-gold/20 focus:border-rose-gold"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-rose-gold-metallic" />
                      WhatsApp *
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      maxLength={15} // Limita o tamanho do input
                      required
                      className="border-rose-gold/20 focus:border-rose-gold"
                    />
                  </div>

                  {/* Procedimento */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-rose-gold-metallic" />
                      Procedimento de Interesse *
                    </label>
                    <select
                      value={formData.procedure_interest}
                      onChange={(e) => handleInputChange('procedure_interest', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-rose-gold/20 rounded-md focus:outline-none focus:border-rose-gold bg-white"
                    >
                      <option value="">Selecione um procedimento</option>
                      {procedureOptions.map((procedure) => (
                        <option key={procedure} value={procedure}>
                          {procedure}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Data Preferida */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-rose-gold-metallic" />
                      Data Preferida *
                    </label>
                    <Input
                      type="date"
                      value={formData.preferred_date}
                      onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                      min={today}
                      required
                      className="border-rose-gold/20 focus:border-rose-gold"
                    />
                  </div>

                  {/* Horário Preferido */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-rose-gold-metallic" />
                      Horário Preferido *
                    </label>
                    <select
                      value={formData.preferred_time}
                      onChange={(e) => handleInputChange('preferred_time', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-rose-gold/20 rounded-md focus:outline-none focus:border-rose-gold bg-white"
                    >
                      <option value="">Selecione um horário</option>
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mensagem */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Observações (opcional)
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Alguma observação especial ou dúvida sobre o procedimento..."
                    rows={4}
                    className="border-rose-gold/20 focus:border-rose-gold resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-rose-gold px-8 py-3 text-base"
                  >
                    {loading ? "Enviando..." : "Solicitar Agendamento"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};
