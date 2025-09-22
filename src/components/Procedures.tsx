import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Procedure {
  id: string;
  title: string;
  description: string;
  details: string;
  duration: string;
  price: string;
  icon: string;
}

const procedures: Procedure[] = [
  {
    id: "preenchimento-labial",
    title: "Preenchimento Labial",
    description: "Lábios mais volumosos e definidos com ácido hialurônico de alta qualidade.",
    details: "O preenchimento labial com ácido hialurônico é um procedimento minimamente invasivo que proporciona volume e definição natural aos lábios. Utilizamos técnicas avançadas para garantir resultados harmoniosos e naturais, respeitando as proporções do seu rosto.",
    duration: "45 minutos",
    price: "A partir de R$ 800",
    icon: "💋"
  },
  {
    id: "botox",
    title: "Botox",
    description: "Suavização de rugas e linhas de expressão para um rosto mais jovem.",
    details: "A aplicação de toxina botulínica é ideal para suavizar rugas dinâmicas, especialmente na região da testa, entre as sobrancelhas e ao redor dos olhos. O procedimento é rápido, seguro e proporciona resultados naturais que preservam suas expressões.",
    duration: "30 minutos",
    price: "A partir de R$ 600",
    icon: "✨"
  },
  {
    id: "bioestimuladores",
    title: "Bioestimuladores",
    description: "Estímulo natural do colágeno para rejuvenescimento duradouro.",
    details: "Os bioestimuladores de colágeno promovem o rejuvenescimento gradual e natural da pele, estimulando a produção de colágeno próprio. Ideal para melhoria da qualidade da pele, firmeza e redução da flacidez facial.",
    duration: "60 minutos",
    price: "A partir de R$ 1.200",
    icon: "🌟"
  },
  {
    id: "rinoplastia",
    title: "Rinoplastia sem Cirurgia",
    description: "Harmonização nasal não-invasiva com resultados imediatos.",
    details: "A rinoplastia não-cirúrgica utiliza preenchedores para corrigir pequenas imperfeições do nariz, como giba nasal e assimetrias. Procedimento reversível com resultados imediatos e tempo de recuperação mínimo.",
    duration: "45 minutos",
    price: "A partir de R$ 1.000",
    icon: "👃"
  },
  {
    id: "harmonizacao",
    title: "Harmonização Completa",
    description: "Plano personalizado para harmonização facial total.",
    details: "A harmonização facial completa é um conjunto de procedimentos personalizados para equilibrar e realçar todas as características do seu rosto. Desenvolvemos um plano único baseado na sua anatomia e desejos estéticos.",
    duration: "2-3 horas",
    price: "Consulte-nos",
    icon: "💎"
  },
  {
    id: "skincare",
    title: "Skincare Avançado",
    description: "Tratamentos para melhorar qualidade e textura da pele.",
    details: "Nossos tratamentos de skincare incluem peelings químicos, microagulhamento, laser e outras tecnologias avançadas para melhorar a qualidade, textura e luminosidade da pele.",
    duration: "60-90 minutos",
    price: "A partir de R$ 400",
    icon: "🧴"
  }
];

export const Procedures = () => {
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);

  return (
    <section className="py-24 bg-sophisticated">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            Nossos 
            <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
              Procedimentos
            </span>
          </h2>
          <p className="text-elegant max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Descubra nossos tratamentos especializados em harmonização facial, 
            desenvolvidos com as mais avançadas técnicas da medicina estética.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        {/* Procedures Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {procedures.map((procedure, index) => (
            <Dialog key={procedure.id}>
              <DialogTrigger asChild>
                <div 
                  className="card-procedure group cursor-pointer animate-scale-in relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedProcedure(procedure)}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-sophisticated">
                    <div className="absolute top-4 right-4 text-6xl opacity-30">{procedure.icon}</div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center text-white text-xl">
                        {procedure.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl text-foreground group-hover:text-rose-gold-metallic transition-sophisticated">
                          {procedure.title}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sophisticated mb-4 leading-relaxed">
                      {procedure.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>⏱️ {procedure.duration}</span>
                      <span className="font-medium text-rose-gold-metallic">{procedure.price}</span>
                    </div>
                    
                    {/* Hover Indicator */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-sophisticated">
                      <div className="text-rose-gold-metallic text-sm font-medium">
                        Clique para saber mais →
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-md glass-morphism border-rose-gold/20">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3 text-xl font-serif">
                    <span className="text-2xl">{procedure.icon}</span>
                    <span>{procedure.title}</span>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <p className="text-sophisticated leading-relaxed">
                    {procedure.details}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-beige-light/50 rounded-xl">
                    <div>
                      <div className="text-sm text-muted-foreground">Duração</div>
                      <div className="font-medium">{procedure.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Investimento</div>
                      <div className="font-medium text-rose-gold-metallic">{procedure.price}</div>
                    </div>
                  </div>
                  
                  <Button className="btn-rose-gold w-full">
                    Agendar Consulta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="card-glass p-8 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl mb-4">Não sabe qual procedimento é ideal para você?</h3>
            <p className="text-sophisticated mb-6">
              Agende uma avaliação gratuita e nossa equipe especializada criará um plano 
              personalizado para seus objetivos estéticos.
            </p>
            <Button className="btn-rose-gold">
              Avaliação Gratuita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};