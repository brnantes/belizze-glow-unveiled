import { Footer } from "@/components/Footer";

const Legacy = () => {
  return (
    <div className="overflow-x-hidden bg-background relative">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-nude-elegant/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            Legado da <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">Dra. Kamylle Casacurta</span>
          </h2>
          <p className="text-elegant max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Conheça a trajetória de uma profissional que revolucionou a harmonização facial
            com técnica, ciência e dedicação.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <img 
              src="https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/site-images/25.jpg" 
              alt="Dra. Kamylle Casacurta" 
              className="rounded-2xl shadow-elegant w-full h-auto object-cover"
              style={{ maxHeight: '600px' }}
            />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="mb-12">
              <h2 className="text-3xl font-medium mb-6">O Início</h2>
              <p className="text-sophisticated mb-6">
                Aos 21 anos, biomédica formada, a Dra. Kamylle Casacurta transformou um pequeno espaço de menos de 50 m² em um centro de referência em harmonização facial.
              </p>
              <p className="text-sophisticated mb-6">
                Hoje, a Clínica Belizze soma 500 m², com dois andares e elevador, localizada na Rua Euclides da Cunha, no coração de Campo Grande.
              </p>
              <p className="text-sophisticated italic font-medium">
                "Um legado sendo construído com coragem, resiliência e planejamento."
              </p>
            </div>
          </div>
        </div>

        <div className="mt-24 mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-12 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">Trajetória</span> de Excelência
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-medium mb-4 font-serif">Reconhecimento Acadêmico</h2>
            <p className="text-sophisticated">
              Tornou-se Embaixadora da Universidade Unigran no MS.
            </p>
          </div>

          <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '0.7s' }}>
            <h2 className="text-2xl font-medium mb-4 font-serif">Referência Nacional</h2>
            <p className="text-sophisticated">
              Fez história ao ser a primeira e única biomédica do Brasil convidada pela Faculdade de Medicina da USP para participar de uma imersão em anatomia.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '0.8s' }}>
            <h2 className="text-2xl font-medium mb-4 font-serif">Palestrante Internacional</h2>
            <p className="text-sophisticated">
              Tornou-se com 22 anos de idade a palestrante mais jovem da história do maior congresso internacional CIOSP de odontologia do mundo, realizado em São Paulo.
            </p>
          </div>

          <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '0.9s' }}>
            <h2 className="text-2xl font-medium mb-4 font-serif">Conquista Global</h2>
            <p className="text-sophisticated">
              Representou o estado do Mato Grosso do Sul no AMWC Dubai, o maior congresso mundial de medicina e tecnologia.
            </p>
          </div>
        </div>

        <div className="card-elegant mb-16 animate-fade-up hover-glow" style={{ animationDelay: '1s' }}>
          <h2 className="text-2xl font-medium mb-4 font-serif">Expansão e Inspiração</h2>
          <p className="text-sophisticated">
            Foi convidada pela Cimed para uma imersão científica na Coreia do Sul, ampliando horizontes e levando o nome da Belizze para o mundo.
          </p>
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-24 mb-16 animate-scale-in" style={{ animationDelay: '1.1s' }}>
          <div className="card-glass p-8 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl mb-4">Conheça a Excelência Belizze</h3>
            <p className="text-sophisticated mb-6">
              Descubra como a Dra. Kamylle Casacurta transformou a Belizze em referência 
              em harmonização facial com técnica, ciência e dedicação.
            </p>
            <button 
              className="btn-rose-gold"
              onClick={() => window.open('https://wa.me/5567992436211?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20Belizze.', '_blank')}
            >
              Agendar Consulta
            </button>
          </div>
        </div>
        
        {/* Floating Elements - Decorative */}
        <div className="hidden md:block absolute top-40 right-10 w-32 h-32 bg-rose-gold/20 rounded-full blur-xl animate-pulse opacity-50"></div>
        <div className="hidden md:block absolute bottom-40 left-20 w-24 h-24 bg-rose-gold/30 rounded-full blur-lg animate-pulse opacity-40"></div>
        <div className="hidden md:block absolute top-[60%] left-10 w-40 h-40 bg-nude-elegant/10 rounded-full blur-2xl animate-pulse opacity-30"></div>
        <div className="hidden md:block absolute bottom-[30%] right-20 w-36 h-36 bg-rose-gold/10 rounded-full blur-xl animate-pulse opacity-40"></div>
      </div>
      <Footer />
    </div>
  );
};

export default Legacy;
