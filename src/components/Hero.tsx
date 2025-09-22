import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-clinic.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Blur Effect */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Clínica Belizze - Harmonização Facial"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero backdrop-blur-sm"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Main Headline */}
          <h1 className="text-hero animate-fade-up">
            Sua beleza em harmonia
            <span className="block bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
              com você mesma
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-elegant max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            Desperte sua beleza natural com procedimentos de harmonização facial 
            personalizados, utilizando as mais avançadas técnicas em estética médica.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <Button className="btn-rose-gold text-lg px-10 py-4">
              Agende sua avaliação gratuita
            </Button>
            <Button variant="outline" className="btn-elegant text-lg">
              Conheça nossos procedimentos
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
              <span>+5 anos de experiência</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
              <span>+1000 clientes satisfeitas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
              <span>Técnicas mais avançadas</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-glass-elegant rounded-full blur-xl animate-pulse opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-rose-gold/30 rounded-full blur-lg animate-pulse opacity-40"></div>
    </section>
  );
};