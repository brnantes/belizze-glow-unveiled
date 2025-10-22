import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface BeforeAfterImage {
  id: string;
  procedure_name: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  is_featured: boolean;
  created_at: string;
}

export const BeforeAfterSection = () => {
  const [images, setImages] = useState<BeforeAfterImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    const fetchBeforeAfterImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('before_after')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        console.log('📊 Dados carregados para BeforeAfterSection:', data?.length || 0);
        setImages(data || []);
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

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    setSliderPosition(50); // Reset slider position
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    setSliderPosition(50); // Reset slider position
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-rose-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando resultados...</p>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Não mostrar a seção se não houver imagens
  }

  const activeImage = images[activeIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Resultados <span className="text-rose-gold">Reais</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Veja a transformação dos nossos procedimentos através de imagens reais de antes e depois.
          </p>
        </div>

        {images.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-96 md:h-[500px]">
                {/* Slider Container */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Before Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={activeImage.before_image_url} 
                      alt={`Antes - ${activeImage.procedure_name}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      ANTES
                    </div>
                  </div>
                  
                  {/* After Image (clipped) */}
                  <div 
                    className="absolute inset-0 overflow-hidden" 
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img 
                      src={activeImage.after_image_url} 
                      alt={`Depois - ${activeImage.procedure_name}`} 
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ width: `${100 / (sliderPosition/100)}%` }}
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      DEPOIS
                    </div>
                  </div>
                  
                  {/* Slider Control */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div 
                      className="h-full w-0.5 bg-white pointer-events-none"
                      style={{ left: `${sliderPosition}%`, position: 'absolute' }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto cursor-grab"
                      style={{ left: `${sliderPosition}%`, position: 'absolute', transform: 'translateX(-50%)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8L22 12L18 16" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M6 8L2 12L6 16" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Slider Input */}
                  <input 
                    type="range" 
                    min="1" 
                    max="99" 
                    value={sliderPosition} 
                    onChange={handleSliderChange}
                    className="absolute bottom-0 w-full opacity-0 cursor-pointer h-full z-10"
                  />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeImage.procedure_name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeImage.description}
                </p>
                
                {images.length > 1 && (
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={prevImage}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                    >
                      Anterior
                    </button>
                    <div className="text-sm text-gray-500">
                      {activeIndex + 1} de {images.length}
                    </div>
                    <button 
                      onClick={nextImage}
                      className="px-4 py-2 bg-rose-gold hover:bg-rose-gold-dark text-white rounded-lg transition-colors"
                    >
                      Próximo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
