import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BeforeAfterImage {
  id: string;
  procedure: string;
  before: string;
  after: string;
  description: string;
}

// Simulando imagens before/after com placeholders coloridos
const beforeAfterData: BeforeAfterImage[] = [
  {
    id: "1",
    procedure: "Preenchimento Labial",
    before: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%236b7280'%3EANTES%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%239ca3af'%3ELábios naturais%3C/text%3E%3C/svg%3E",
    after: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fdf2f8'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%23be185d'%3EDEPOIS%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%23ec4899'%3ELábios volumosos%3C/text%3E%3C/svg%3E",
    description: "Preenchimento com ácido hialurônico para lábios naturalmente volumosos."
  },
  {
    id: "2",
    procedure: "Harmonização Facial",
    before: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%236b7280'%3EANTES%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%239ca3af'%3ERosto natural%3C/text%3E%3C/svg%3E",
    after: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fdf2f8'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%23be185d'%3EDEPOIS%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%23ec4899'%3ERosto harmonioso%3C/text%3E%3C/svg%3E",
    description: "Harmonização completa para contorno facial perfeito."
  },
  {
    id: "3",
    procedure: "Rinoplastia sem Cirurgia",
    before: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%236b7280'%3EANTES%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%239ca3af'%3ENariz original%3C/text%3E%3C/svg%3E",
    after: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fdf2f8'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%23be185d'%3EDEPOIS%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%23ec4899'%3ENariz refinado%3C/text%3E%3C/svg%3E",
    description: "Correção não-invasiva do perfil nasal com resultados naturais."
  },
  {
    id: "4",
    procedure: "Bioestimuladores",
    before: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%236b7280'%3EANTES%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%239ca3af'%3EPele com sinais%3C/text%3E%3C/svg%3E",
    after: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fdf2f8'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%23be185d'%3EDEPOIS%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%23ec4899'%3EPele rejuvenescida%3C/text%3E%3C/svg%3E",
    description: "Rejuvenescimento gradual com estímulo natural de colágeno."
  }
];

export const BeforeAfter = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            Antes e
            <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
              {" "}Depois
            </span>
          </h2>
          <p className="text-elegant max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Veja os resultados reais dos nossos tratamentos de harmonização facial. 
            Cada transformação é única e personalizada.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Before/After Slider */}
          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="card-elegant relative overflow-hidden">
              {/* Image Container */}
              <div className="relative h-96 overflow-hidden">
                {/* Before Image */}
                <img
                  src={beforeAfterData[selectedImage].before}
                  alt="Antes do procedimento"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* After Image with Clip Path */}
                <img
                  src={beforeAfterData[selectedImage].after}
                  alt="Depois do procedimento"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`
                  }}
                />
                
                {/* Slider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Slider Handle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer">
                    <svg className="w-4 h-4 text-rose-gold-metallic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  Antes
                </div>
                <div className="absolute top-4 right-4 bg-rose-gold-metallic text-white px-3 py-1 rounded-full text-sm">
                  Depois
                </div>
              </div>

              {/* Slider Control */}
              <div className="p-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gray-elegant rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f3f4f6 0%, #f3f4f6 ${sliderPosition}%, #d4a574 ${sliderPosition}%, #d4a574 100%)`
                  }}
                />
              </div>

              {/* Procedure Info */}
              <div className="p-6 bg-gradient-to-r from-beige-light to-nude-warm">
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {beforeAfterData[selectedImage].procedure}
                </h3>
                <p className="text-sophisticated text-sm">
                  {beforeAfterData[selectedImage].description}
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="font-serif text-2xl text-foreground">Explore mais resultados</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {beforeAfterData.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(index)}
                  className={`card-procedure cursor-pointer ${
                    index === selectedImage ? 'ring-2 ring-rose-gold-metallic' : ''
                  }`}
                >
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <img
                      src={item.before}
                      alt={`${item.procedure} - Antes`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <img
                      src={item.after}
                      alt={`${item.procedure} - Depois`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-foreground">{item.procedure}</h4>
                </div>
              ))}
            </div>

            {/* Trust Elements */}
            <div className="card-glass p-6 space-y-4">
              <h4 className="font-serif text-xl text-foreground">Por que escolher a Belizze?</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
                  <span className="text-sophisticated text-sm">Resultados naturais e harmoniosos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
                  <span className="text-sophisticated text-sm">Técnicas mais avançadas do mercado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
                  <span className="text-sophisticated text-sm">Acompanhamento completo pós-procedimento</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-rose-gold rounded-full"></div>
                  <span className="text-sophisticated text-sm">+1000 clientes satisfeitas</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button className="btn-rose-gold w-full">
                Quero minha transformação
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                *Resultados podem variar. Consulte sempre um profissional.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-up" style={{ animationDelay: '0.7s' }}>
          <div className="card-glass p-8 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl mb-4">Quer ver seu resultado antes de decidir?</h3>
            <p className="text-sophisticated mb-6">
              Agende uma consulta gratuita e descubra como nossos tratamentos podem 
              realçar sua beleza natural com segurança e qualidade.
            </p>
            <Button className="btn-rose-gold">
              Consulta gratuita
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Styles for Slider */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4a574, #c4956a);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(212, 165, 116, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4a574, #c4956a);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(212, 165, 116, 0.3);
        }
      `}</style>
    </section>
  );
};