import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BeforeAfterImage, supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

// Dados de fallback para antes e depois
const fallbackData: BeforeAfterImage[] = [
  {
    id: "1",
    procedure_id: "",
    procedure_name: "Lipo de Papada com a máquina Pixie",
    before_image_url: "/antes.png",
    after_image_url: "/depois.png",
    description: "Redução de gordura localizada na região da papada com tecnologia Pixie, resultando em contorno facial mais definido e harmonioso.",
    is_featured: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: "2",
    procedure_id: "",
    procedure_name: "Harmonização Facial",
    before_image_url: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%236b7280'%3EANTES%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%239ca3af'%3ERosto natural%3C/text%3E%3C/svg%3E",
    after_image_url: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fdf2f8'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%23be185d'%3EDEPOIS%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%23ec4899'%3ERosto harmonioso%3C/text%3E%3C/svg%3E",
    description: "Harmonização completa para contorno facial perfeito.",
    is_featured: false,
    created_at: "",
    updated_at: ""
  },
  {
    id: "3",
    procedure_id: "",
    procedure_name: "Rinoplastia sem Cirurgia",
    before_image_url: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%236b7280'%3EANTES%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%239ca3af'%3ENariz original%3C/text%3E%3C/svg%3E",
    after_image_url: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fdf2f8'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%23be185d'%3EDEPOIS%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%23ec4899'%3ENariz refinado%3C/text%3E%3C/svg%3E",
    description: "Correção não-invasiva do perfil nasal com resultados naturais.",
    is_featured: false,
    created_at: "",
    updated_at: ""
  },
  {
    id: "4",
    procedure_id: "",
    procedure_name: "Bioestimuladores",
    before_image_url: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%236b7280'%3EANTES%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%239ca3af'%3EPele com sinais%3C/text%3E%3C/svg%3E",
    after_image_url: "data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23fdf2f8'/%3E%3Ctext x='50%25' y='45%25' font-size='16' text-anchor='middle' fill='%23be185d'%3EDEPOIS%3C/text%3E%3Ctext x='50%25' y='55%25' font-size='12' text-anchor='middle' fill='%23ec4899'%3EPele rejuvenescida%3C/text%3E%3C/svg%3E",
    description: "Rejuvenescimento gradual com estímulo natural de colágeno.",
    is_featured: false,
    created_at: "",
    updated_at: ""
  }
];

export const BeforeAfterSupabase = () => {
  const [beforeAfterData, setBeforeAfterData] = useState<BeforeAfterImage[]>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(45);

  useEffect(() => {
    const fetchBeforeAfterImages = async () => {
      try {
        setLoading(true);
        
        // Buscar diretamente da tabela before_after
        const { data, error } = await supabase
          .from('before_after')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log("🔍 Dados carregados para BeforeAfterSupabase:", data?.length || 0);
        
        if (data && data.length > 0) {
          setBeforeAfterData(data);
        }
      } catch (error) {
        console.error("Erro ao buscar imagens antes/depois:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeforeAfterImages();
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  // Adicionar interatividade para arrastar o slider com o mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Só processa se o botão esquerdo estiver pressionado
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calcular a porcentagem e limitar entre 0 e 100
    let newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(newPosition);
  };
  
  // Adicionar suporte para toque em dispositivos móveis
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calcular a porcentagem e limitar entre 0 e 100
    let newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    setSliderPosition(newPosition);
  };

  return (
    <section className="py-24 bg-elegant">
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

        {/* Before/After Slider - Agora em cima */}
        <div className="animate-scale-in max-w-4xl mx-auto mb-12" style={{ animationDelay: '0.3s' }}>
          {loading ? (
            <div className="card-elegant relative overflow-hidden">
              <Skeleton className="h-96 md:h-[450px] w-full" />
            </div>
          ) : (
            <div className="card-elegant relative overflow-hidden">
              {/* Image Container */}
              <div 
                className="relative h-96 md:h-[450px] overflow-hidden cursor-pointer bg-white flex items-center justify-center" 
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* Before Image */}
                <img
                  src={beforeAfterData[selectedImage].before_image_url}
                  alt="Antes do procedimento"
                  className="absolute inset-0 w-full h-full object-contain max-w-2xl mx-auto"
                  style={{ objectPosition: 'center' }}
                />
                {/* After Image with Clip Path - Smooth transition */}
                <div 
                  className="absolute inset-0 transition-all duration-100 ease-out overflow-hidden"
                  style={{
                    clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`
                  }}
                >
                  <img
                    src={beforeAfterData[selectedImage].after_image_url}
                    alt="Depois do procedimento"
                    className="w-full h-full object-contain max-w-2xl mx-auto"
                    style={{ objectPosition: 'center' }}
                  />
                </div>
                
                {/* Slider Line with glow effect */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10 transition-all duration-100"
                  style={{ left: `${sliderPosition}%` }}
                >
                  {/* Slider Handle with improved design */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_20px_rgba(212,165,116,0.7)] flex items-center justify-center cursor-pointer border-2 border-rose-gold-metallic"
                    onMouseDown={() => document.body.style.cursor = 'ew-resize'}
                    onMouseUp={() => document.body.style.cursor = 'default'}
                  >
                    <svg className="w-6 h-6 text-rose-gold-metallic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5l-7 7 7 7" />
                    </svg>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  ANTES
                </div>
                <div className="absolute top-4 right-4 bg-rose-gold-metallic text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  DEPOIS
                </div>
              </div>

              {/* Slider Control - Enhanced */}
              <div className="p-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  className="w-full h-3 bg-gray-elegant rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f3f4f6 0%, #f3f4f6 ${sliderPosition}%, #d4a574 ${sliderPosition}%, #d4a574 100%)`,
                    transition: 'background 0.1s ease-out'
                  }}
                />
              </div>

              {/* Procedure Info - Enhanced */}
              <div className="p-6 bg-gradient-to-r from-beige-light to-nude-warm">
                <h3 className="font-serif text-xl text-foreground mb-2 flex items-center">
                  <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
                    {beforeAfterData[selectedImage].procedure_name}
                  </span>
                  {beforeAfterData[selectedImage].is_featured && (
                    <span className="ml-2 bg-rose-gold/20 text-rose-gold-metallic text-xs px-2 py-0.5 rounded-full">
                      Destaque
                    </span>
                  )}
                </h3>
                <p className="text-sophisticated text-sm">
                  {beforeAfterData[selectedImage].description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Thumbnails - Agora embaixo */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-2xl text-foreground mb-6 text-center">Escolha um procedimento</h3>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="card-procedure">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
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
                      src={item.before_image_url}
                      alt={`${item.procedure_name} - Antes`}
                      className="w-full h-20 object-cover bg-white rounded-lg"
                    />
                    <img
                      src={item.after_image_url}
                      alt={`${item.procedure_name} - Depois`}
                      className="w-full h-20 object-cover bg-white rounded-lg"
                    />
                  </div>
                  <h4 className="font-medium text-sm text-foreground text-center">{item.procedure_name}</h4>
                </div>
              ))}
            </div>
          )}

          {/* Trust Elements e CTA */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
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

            <div className="flex flex-col justify-center">
              <Button className="btn-rose-gold w-full">
                Quero minha transformação
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
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
              Agende uma consulta e descubra como nossos tratamentos podem 
              realçar sua beleza natural com segurança e qualidade.
            </p>
            <Button 
              className="btn-rose-gold"
              onClick={() => window.open('https://wa.me/5567992436211?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20Belizze.', '_blank')}
            >
              Agendar consulta
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
