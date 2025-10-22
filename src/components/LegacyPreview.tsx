import { Button } from "@/components/ui/button";

export const LegacyPreview = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-nude-elegant/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            Conheça o <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">Legado Belizze</span>
          </h2>
          <p className="text-elegant max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Uma trajetória de excelência, inovação e dedicação à beleza natural
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        {/* Legacy Preview Card */}
        <div className="max-w-4xl mx-auto">
          <div className="card-glass p-8 md:p-10 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/site-images/25.jpg" 
                  alt="Dra. Kamylle Casacurta" 
                  className="rounded-2xl shadow-elegant w-full h-auto object-cover"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-serif">Dra. Kamylle Casacurta</h3>
                <p className="text-sophisticated">
                  Aos 21 anos, biomédica formada, transformou um pequeno espaço em um centro de 
                  referência em harmonização facial. Hoje, a Clínica Belizze é reconhecida 
                  nacionalmente pela excelência e inovação.
                </p>
                <p className="text-sophisticated italic">
                  "Um legado sendo construído com coragem, resiliência e planejamento."
                </p>
                <div className="mt-6">
                  <Button 
                    className="bg-gradient-to-r from-rose-gold to-rose-gold-metallic text-white font-medium px-6 py-3 rounded-xl shadow-rose-gold transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl border border-rose-gold/30 flex items-center"
                    onClick={() => window.location.href = '/legado'}
                  >
                    Conheça nossa trajetória
                    <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 right-1/4 w-40 h-40 bg-rose-gold/10 rounded-full blur-xl animate-pulse opacity-40"></div>
      </div>
    </section>
  );
};
