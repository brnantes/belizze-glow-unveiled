import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { saveMentorshipLead, sendLeadToWebhook } from "@/lib/mentorshipLeads";
import { Loader2 } from "lucide-react";

const MentorshipForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    location: "",
    familyRoutine: "",
    education: "",
    experience: "",
    whatsapp: "",
    email: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = ['name', 'instagram', 'location', 'familyRoutine', 'education', 'experience', 'whatsapp', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData].trim());

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Salvar os dados no Supabase
      const leadData = {
        name: formData.name,
        instagram: formData.instagram,
        location: formData.location,
        family_routine: formData.familyRoutine,
        education: formData.education,
        experience: formData.experience,
        whatsapp: formData.whatsapp,
        email: formData.email
      };
      
      console.log("📝 Enviando dados do formulário:", leadData);
      
      // Salvar no Supabase
      const saveResult = await saveMentorshipLead(leadData);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || "Erro ao salvar dados");
      }
      
      // 2. Enviar para webhook (integração com outros sistemas)
      try {
        await sendLeadToWebhook({
          ...leadData,
          id: saveResult.data?.[0]?.id,
          status: 'new',
          created_at: new Date().toISOString()
        });
        console.log("✅ Dados enviados para webhook");
      } catch (webhookError) {
        // Não interromper o fluxo se o webhook falhar
        console.error("❌ Erro ao enviar para webhook:", webhookError);
      }
      
      // 3. Mostrar mensagem de sucesso
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Sua aplicação será analisada pessoalmente pela Dra. Kamylle. Aguarde nosso contato.",
      });

      // 4. Redirecionar para página de agradecimento
      const firstName = formData.name.split(' ')[0];
      window.location.href = `/mentoria-agradecimento?name=${encodeURIComponent(firstName)}`;

      // Reset form (embora vá redirecionar, é bom limpar por segurança)
      setFormData({
        name: "",
        instagram: "",
        location: "",
        familyRoutine: "",
        education: "",
        experience: "",
        whatsapp: "",
        email: ""
      });
    } catch (error: any) {
      console.error("❌ Erro ao processar formulário:", error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Ocorreu um erro ao enviar o formulário. Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card-glass p-8 animate-fade-up">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-serif mb-4 bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
            Formulário de Aplicação
          </h3>
          <div className="space-y-4 text-sophisticated">
            <p className="font-medium">⚠️ Preencha este formulário apenas se estiver pronta para se destacar entre as melhores.</p>
            <p>
              Essa não é uma mentoria para quem busca atalhos. É para quem está decidida a crescer com clareza, 
              atitude e consistência e a aplicar tudo o que aprender com intensidade e responsabilidade.
            </p>
            <p className="italic">
              Você será guiada, mas precisará fazer a sua parte. Se estiver verdadeiramente pronta para esse salto, 
              será uma honra caminhar ao seu lado.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Seu nome completo e como prefere ser chamada durante a mentoria *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite seu nome completo e como prefere ser chamada"
              required
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-foreground font-medium">
              1. Qual o @ do seu Instagram? *
            </Label>
            <Input
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              placeholder="@seuinstagram"
              required
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground font-medium">
              2. Sua cidade e seu estado? *
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Cidade - Estado"
              required
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyRoutine" className="text-foreground font-medium">
              3. Como é sua rotina familiar hoje? *
            </Label>
            <p className="text-sm text-sophisticated mb-2">
              Você é casada, tem filhos, solteira ou outras responsabilidades que influenciam sua organização de agenda?
              (Queremos entender como está sua vida fora do consultório para te apoiar com mais realismo e direcionamento.)
            </p>
            <Textarea
              id="familyRoutine"
              name="familyRoutine"
              value={formData.familyRoutine}
              onChange={handleInputChange}
              placeholder="Descreva sua rotina familiar e responsabilidades"
              required
              rows={4}
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education" className="text-foreground font-medium">
              4. Qual é sua formação acadêmica? E qual a sua idade? *
            </Label>
            <Textarea
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              placeholder="Descreva sua formação acadêmica e idade"
              required
              rows={3}
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-foreground font-medium">
              5. Qual tempo de atuação na sua área? *
            </Label>
            <Input
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="Ex: 3 anos, 6 meses, etc."
              required
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-foreground font-medium">
              6. Qual é o número do seu WhatsApp com (DDD)? *
            </Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="(67) 99999-9999"
              required
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              7. Qual é o seu e-mail? *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              required
              className="bg-background/50 border-rose-gold/20 focus:border-rose-gold"
            />
          </div>

          <div className="text-center pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-rose-gold px-12 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Aplicação"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorshipForm;
