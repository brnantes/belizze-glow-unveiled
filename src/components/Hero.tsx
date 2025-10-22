import { Button } from "@/components/ui/button";

export const Hero = () => {
  const heroImage = '/30.JPG';
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Split Design - Responsive */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Mobile background - full width on small screens */}
        <div className="md:hidden w-full h-full bg-[#d2bfaa] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <img 
            src={heroImage} 
            alt="Clínica Belizze - Harmonização Facial"
            className="h-full w-full object-cover"
            style={{ objectPosition: 'left center' }}
          />
        </div>
        
        {/* Desktop split background - hidden on mobile */}
        <div className="hidden md:block md:w-1/2 h-full bg-[#d2bfaa] relative overflow-hidden">
          <img 
            src={heroImage} 
            alt="Clínica Belizze - Harmonização Facial"
            className="h-full object-cover absolute left-0 max-w-none"
            style={{ width: 'auto', minWidth: '100%', objectPosition: 'center' }}
          />
        </div>
        <div className="hidden md:block md:w-1/2 h-full bg-[#f5f0e8]"></div>
      </div>
      
      {/* Hero Content - Different for Mobile and Desktop */}
      {/* Mobile Content - Minimal */}
      <div className="md:hidden relative z-10 flex flex-col justify-center h-full w-full">
        <div className="absolute left-6 top-[25%] flex flex-col space-y-2 w-[45%] opacity-90">
          <Button 
            className="bg-[#f5e1d5] hover:bg-[#f5d5c0] text-[#8a6e5c] text-[10px] px-3 py-1.5 rounded-full shadow-sm border border-[#e0c8b8]/30"
            onClick={() => window.open('https://wa.me/5567992436211?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20Belizze.', '_blank')}
          >
            Agende sua avaliação
          </Button>
          <Button 
            className="bg-[#e9e2d8] hover:bg-[#e0d8cb] text-[#8a6e5c] text-[10px] px-3 py-1.5 rounded-full shadow-sm border border-[#d5cabb]/30"
            onClick={() => window.open('https://wa.me/5567992436211?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20os%20procedimentos%20da%20Belizze.', '_blank')}
          >
            Conheça procedimentos
          </Button>
        </div>
      </div>
      
      {/* Desktop Content - Normal */}
      <div className="hidden md:block relative z-10 text-center px-6 max-w-md mx-auto md:text-black md:ml-auto md:mr-16">
        <div className="space-y-6">
          {/* Main Headline */}
          <h1 className="text-hero animate-fade-up">
            Beleza em harmonia
          </h1>
          
          {/* CTA Buttons */}
          <div className="flex flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              className="btn-rose-gold text-lg px-10 py-4"
              onClick={() => window.open('https://wa.me/5567992436211?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20Belizze.', '_blank')}
            >
              Agende sua avaliação
            </Button>
            <Button 
              variant="outline" 
              className="btn-elegant text-lg"
              onClick={() => window.open('https://wa.me/5567992436211?text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20os%20procedimentos%20da%20Belizze.', '_blank')}
            >
              Conheça nossos procedimentos
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating Elements - Desktop only */}
      <div className="hidden md:block absolute top-20 right-10 w-32 h-32 bg-rose-gold/20 rounded-full blur-xl animate-pulse opacity-50"></div>
      <div className="hidden md:block absolute bottom-20 right-1/4 w-24 h-24 bg-rose-gold/30 rounded-full blur-lg animate-pulse opacity-40"></div>
    </section>
  );
};