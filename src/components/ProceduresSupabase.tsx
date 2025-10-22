import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Procedure, getProcedures } from "@/lib/supabase";
import { AppointmentForm } from "./AppointmentForm";

export const ProceduresSupabase = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const data = await getProcedures();
        if (data && data.length > 0) {
          setProcedures(data);
        }
      } catch (error) {
        console.error("Erro ao carregar procedimentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  return (
    <section className="py-24 bg-sophisticated">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            Nossos <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">Procedimentos</span>
          </h2>
          <p className="text-elegant max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Descubra nossos tratamentos especializados em harmonização facial, 
            desenvolvidos com as mais avançadas técnicas da medicina estética.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        {/* Procedures Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Esqueletos de carregamento
            [...Array(6)].map((_, index) => (
              <div key={index} className="card-procedure">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            // Procedimentos carregados
            procedures.map((procedure, index) => (
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
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>⏱️ {procedure.duration}</span>
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
                    
                    <div className="p-4 bg-beige-light/50 rounded-xl">
                      <div className="mb-2">
                        <div className="text-sm text-muted-foreground">Duração</div>
                        <div className="font-medium">{procedure.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Investimento</div>
                        <div className="font-medium">{procedure.price}</div>
                      </div>
                    </div>
                    
                    <Button 
                      className="btn-rose-gold w-full"
                      onClick={() => {
                        setShowAppointmentForm(true);
                      }}
                    >
                      Agendar Consulta
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))
          )}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="card-glass p-8 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl mb-4">Não sabe qual procedimento é ideal para você?</h3>
            <p className="text-sophisticated mb-6">
              Agende uma avaliação e nossa equipe especializada criará um plano 
              personalizado para seus objetivos estéticos.
            </p>
            <Button 
              className="btn-rose-gold"
              onClick={() => setShowAppointmentForm(true)}
            >
              Agendar Avaliação
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {!loading && (
        <Dialog open={showAppointmentForm} onOpenChange={setShowAppointmentForm}>
          <DialogContent className="max-w-md glass-morphism border-rose-gold/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">
                Agendar Consulta
              </DialogTitle>
            </DialogHeader>
            
            <AppointmentForm 
              procedures={procedures} 
              onSuccess={() => setShowAppointmentForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
