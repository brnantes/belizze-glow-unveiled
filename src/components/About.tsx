import teamPhoto from "@/assets/team-photo.jpg";

export const About = () => {
  return (
    <section className="py-24 bg-elegant">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
                Sobre a 
                <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
                  Belizze
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full"></div>
            </div>
            
            <div className="space-y-6 text-sophisticated animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg leading-relaxed">
                Na Belizze, acreditamos que cada rosto possui uma beleza única que merece ser 
                realçada com delicadeza e precisão. Nossa missão é proporcionar harmonização 
                facial personalizada, respeitando suas características naturais.
              </p>
              
              <p className="leading-relaxed">
                Com anos de experiência em estética médica e utilizando as mais avançadas 
                técnicas do mercado, nossa equipe especializada está comprometida em oferecer 
                resultados naturais e elegantes, sempre priorizando sua segurança e bem-estar.
              </p>
            </div>
            
            {/* Values */}
            <div className="grid sm:grid-cols-2 gap-6 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="card-glass p-6 hover-grow">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl mb-2">Cuidado Personalizado</h3>
                <p className="text-sm text-muted-foreground">Cada tratamento é único, desenvolvido especialmente para você.</p>
              </div>
              
              <div className="card-glass p-6 hover-grow">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl mb-2">Excelência Técnica</h3>
                <p className="text-sm text-muted-foreground">Utilizamos as mais avançadas técnicas e produtos do mercado.</p>
              </div>
            </div>
          </div>
          
          {/* Team Photo */}
          <div className="relative animate-blur-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative overflow-hidden rounded-3xl shadow-sophisticated">
              <img 
                src={teamPhoto} 
                alt="Equipe Belizze"
                className="w-full h-full object-cover hover-grow"
              />
              {/* Glassmorphism Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-gold/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-sophisticated"></div>
            </div>
            
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-6 card-glass p-4 hover-glow">
              <div className="text-center">
                <div className="text-2xl font-serif text-rose-gold-metallic">1000+</div>
                <div className="text-sm text-muted-foreground">Clientes satisfeitas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};