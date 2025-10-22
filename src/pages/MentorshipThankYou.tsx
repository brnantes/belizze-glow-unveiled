import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const MentorshipThankYou = () => {
  // Obter o nome da URL
  const [name, setName] = useState<string | null>(null);
  
  // Efeito para obter o nome da URL e fazer scroll para o topo
  useEffect(() => {
    // Obter o nome da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    setName(nameParam);
    
    // Scroll para o topo
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-x-hidden bg-background relative min-h-screen flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-nude-elegant/10 rounded-full blur-2xl"></div>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 text-center">
          <div className="animate-scale-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
              Aplicação <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">Recebida!</span>
            </h1>
            
            <p className="text-xl text-sophisticated max-w-2xl mx-auto mb-8">
              {name ? `Olá, ${name.toString().split(' ')[0]}! ` : ''}
              Sua aplicação para a mentoria foi recebida com sucesso e será analisada pessoalmente pela Dra. Kamylle.
            </p>
            
            <div className="card-glass p-8 mb-12 max-w-2xl mx-auto">
              <h2 className="text-2xl font-serif mb-4">Próximos Passos</h2>
              <div className="space-y-4 text-sophisticated text-left">
                <p className="flex items-start">
                  <span className="text-rose-gold mr-2 font-bold">1.</span>
                  Nossa equipe analisará sua aplicação com cuidado.
                </p>
                <p className="flex items-start">
                  <span className="text-rose-gold mr-2 font-bold">2.</span>
                  Se seu perfil for compatível com a mentoria, entraremos em contato pelo WhatsApp informado.
                </p>
                <p className="flex items-start">
                  <span className="text-rose-gold mr-2 font-bold">3.</span>
                  Será agendada uma conversa para conhecermos melhor suas necessidades e objetivos.
                </p>
                <p className="flex items-start">
                  <span className="text-rose-gold mr-2 font-bold">4.</span>
                  Caso aprovada, você receberá todas as informações sobre investimento, cronograma e início da mentoria.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="/" className="inline-block">
                <Button variant="outline" className="px-8 py-6 text-lg">
                  Voltar para o Início
                </Button>
              </a>
              <a href="/mentoria" className="inline-block">
                <Button className="btn-rose-gold px-8 py-6 text-lg">
                  Saiba Mais Sobre a Mentoria
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MentorshipThankYou;
