import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  age: number;
  procedure: string;
  content: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ana Carolina",
    age: 28,
    procedure: "Preenchimento Labial",
    content: "Resultado perfeito! Os lábios ficaram naturais e com o volume que eu sempre sonhei. A equipe da Belizze é incredibly profissional.",
    rating: 5,
    image: "👩🏻‍💼"
  },
  {
    id: "2", 
    name: "Mariana Santos",
    age: 35,
    procedure: "Harmonização Completa",
    content: "Transformação incrível! Realizei o procedimento completo e o resultado superou todas as minhas expectativas. Recomendo demais!",
    rating: 5,
    image: "👩🏻‍🦰"
  },
  {
    id: "3",
    name: "Julia Ferreira",
    age: 31,
    procedure: "Botox + Bioestimuladores",
    content: "Excelente experiência! Profissionais altamente qualificados e ambiente muito acolhedor. Já estou planejando o próximo procedimento.",
    rating: 5,
    image: "👩🏻"
  },
  {
    id: "4",
    name: "Beatriz Lima",
    age: 26,
    procedure: "Rinoplastia sem Cirurgia",
    content: "Procedimento rápido e resultado imediato! Finalmente tenho o nariz que sempre quis, sem cirurgia. A Belizze é nota 10!",
    rating: 5,
    image: "👩🏽"
  },
  {
    id: "5",
    name: "Camila Rodriguez",
    age: 33,
    procedure: "Skincare Avançado",
    content: "Minha pele nunca esteve tão bonita! Os tratamentos de skincare da Belizze são realmente eficazes. Equipe maravilhosa!",
    rating: 5,
    image: "👩🏻‍🦱"
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-rose-gold-metallic fill-current' : 'text-gray-elegant'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-nude-elegant/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            O que dizem nossas
            <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
              {" "}clientes
            </span>
          </h2>
          <p className="text-elegant max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Depoimentos reais de mulheres que confiaram na Belizze para realçar sua beleza natural.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="card-glass p-8 md:p-12 text-center space-y-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              {/* Client Avatar */}
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center text-3xl">
                {testimonials[currentIndex].image}
              </div>

              {/* Stars Rating */}
              <div className="flex justify-center space-x-1">
                {renderStars(testimonials[currentIndex].rating)}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-lg md:text-xl text-sophisticated leading-relaxed font-light italic">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Client Info */}
              <div className="space-y-2">
                <div className="font-serif text-xl text-foreground">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-muted-foreground">
                  {testimonials[currentIndex].age} anos • {testimonials[currentIndex].procedure}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-rose-gold/30 hover:border-rose-gold hover:bg-rose-gold/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>

            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-rose-gold/30 hover:border-rose-gold hover:bg-rose-gold/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlay(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-rose-gold-metallic scale-125'
                    : 'bg-gray-elegant hover:bg-rose-gold/50'
                }`}
              />
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-3xl font-serif text-rose-gold-metallic">1000+</div>
              <div className="text-sophisticated">Clientes satisfeitas</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-3xl font-serif text-rose-gold-metallic">5.0</div>
              <div className="text-sophisticated">Avaliação média</div>
            </div>
            <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="text-3xl font-serif text-rose-gold-metallic">99%</div>
              <div className="text-sophisticated">Recomendam a Belizze</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-scale-in" style={{ animationDelay: '0.8s' }}>
          <div className="card-glass p-8 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl mb-4">Seja a próxima a se sentir radiante!</h3>
            <p className="text-sophisticated mb-6">
              Junte-se às centenas de mulheres que já descobriram o poder transformador 
              dos nossos tratamentos de harmonização facial.
            </p>
            <Button className="btn-rose-gold">
              Agendar minha transformação
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};