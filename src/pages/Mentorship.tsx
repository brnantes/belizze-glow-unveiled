import { Footer } from "@/components/Footer";
import MentorshipForm from "@/components/MentorshipForm";
import { useState } from "react";

const Mentorship = () => {
  const [imagesLoaded, setImagesLoaded] = useState({ cert: false, train: false, pract: false });
  
  const handleImageLoad = (imageKey: string) => {
    setImagesLoaded(prev => ({ ...prev, [imageKey]: true }));
  };

  return (
    <div className="overflow-x-hidden bg-background relative">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-nude-elegant/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif text-foreground animate-fade-up">
            Método <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">Belizze</span>
          </h1>
          <p className="text-xl md:text-2xl text-elegant max-w-4xl mx-auto animate-fade-up font-medium" style={{ animationDelay: '0.2s' }}>
            Essa não é uma mentoria comum. É o ponto de virada da sua carreira.
          </p>
          <p className="text-lg text-sophisticated max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.3s' }}>
            É o acesso direto ao método que me fez faturar mais de R$ 2 milhões em apenas 18 meses e que pode transformar 
            não só seus resultados, mas a forma como você se posiciona, atende e cresce.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        {/* Images Section - Otimizada para Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="animate-scale-in relative" style={{ animationDelay: '0.4s' }}>
            {!imagesLoaded.cert && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-gray-400 text-sm">Carregando...</div>
              </div>
            )}
            <img 
              src="https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/mentorship/mentoria-certificados.jpg" 
              alt="Certificados de conclusão - Método Belizze" 
              className="rounded-2xl shadow-elegant w-full h-64 object-cover hover-grow"
              loading="lazy"
              decoding="async"
              onLoad={() => handleImageLoad('cert')}
              style={{ opacity: imagesLoaded.cert ? '1' : '0', transition: 'opacity 0.5s ease-in-out' }}
            />
          </div>
          <div className="animate-scale-in relative" style={{ animationDelay: '0.5s' }}>
            {!imagesLoaded.train && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-gray-400 text-sm">Carregando...</div>
              </div>
            )}
            <img 
              src="https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/mentorship/mentoria-treinamento.jpg" 
              alt="Treinamento prático - Método Belizze" 
              className="rounded-2xl shadow-elegant w-full h-64 object-cover hover-grow"
              loading="lazy"
              decoding="async"
              onLoad={() => handleImageLoad('train')}
              style={{ opacity: imagesLoaded.train ? '1' : '0', transition: 'opacity 0.5s ease-in-out' }}
            />
          </div>
          <div className="animate-scale-in relative" style={{ animationDelay: '0.6s' }}>
            {!imagesLoaded.pract && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-gray-400 text-sm">Carregando...</div>
              </div>
            )}
            <img 
              src="https://wgamkjtlvebwquuxxqwu.supabase.co/storage/v1/object/public/mentorship/mentoria-pratica.jpg" 
              alt="Prática supervisionada - Método Belizze" 
              className="rounded-2xl shadow-elegant w-full h-64 object-cover hover-grow"
              loading="lazy"
              decoding="async"
              onLoad={() => handleImageLoad('pract')}
              style={{ opacity: imagesLoaded.pract ? '1' : '0', transition: 'opacity 0.5s ease-in-out' }}
            />
          </div>
        </div>

        {/* Important Notice */}
        <div className="card-elegant mb-16 animate-fade-up hover-glow" style={{ animationDelay: '0.8s' }}>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-serif text-foreground mb-4">Importante:</h2>
            <div className="space-y-3 text-sophisticated">
              <p className="font-medium">Preencher o formulário não garante vaga.</p>
              <p>Cada aplicação será avaliada por mim pessoalmente.</p>
              <p>Apenas quem demonstra real comprometimento será selecionada.</p>
            </div>
          </div>
        </div>

        {/* Selection Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-up" style={{ animationDelay: '0.8s' }}>
            <div className="card-glass p-8">
              <h3 className="text-2xl font-serif mb-6 text-center">
                <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
                  Processo Seletivo
                </span>
              </h3>
              <div className="space-y-4 text-sophisticated">
                <p className="flex items-start">
                  <span className="text-rose-gold mr-2">🔍</span>
                  Cada aplicação será analisada por mim pessoalmente e com extremo cuidado.
                </p>
                <p>
                  Selecionarei apenas <strong className="text-rose-gold">4 profissionais</strong> com perfil alinhado, 
                  prontas para absorver e aplicar um método que pode levá-las a faturar acima de 
                  <strong className="text-rose-gold"> R$ 100 mil mensais</strong> de forma independente, 
                  estruturada e estratégica.
                </p>
              </div>
            </div>
          </div>
          
          <div className="animate-scale-in" style={{ animationDelay: '0.9s' }}>
            <div className="card-glass p-8">
              <h3 className="text-2xl font-serif mb-6 text-center">
                <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
                  Para Quem É
                </span>
              </h3>
              <div className="space-y-4 text-sophisticated">
                <p>
                  Essa não é uma mentoria para quem busca atalhos. É para quem está decidida a crescer com 
                  <strong className="text-rose-gold"> clareza, atitude e consistência</strong> e a aplicar tudo 
                  o que aprender com intensidade e responsabilidade.
                </p>
                <p className="italic text-center font-medium">
                  "Você será guiada, mas precisará fazer a sua parte."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-12 animate-fade-up" style={{ animationDelay: '1s' }}>
            <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">Resultados</span> Comprovados
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '1.1s' }}>
              <h3 className="text-2xl font-medium mb-4 font-serif text-rose-gold">Faturamento Exponencial</h3>
              <p className="text-sophisticated">
                Método que gerou mais de R$ 2 milhões em 18 meses, com estratégias replicáveis e sustentáveis.
              </p>
            </div>

            <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '1.2s' }}>
              <h3 className="text-2xl font-medium mb-4 font-serif text-rose-gold">Posicionamento Estratégico</h3>
              <p className="text-sophisticated">
                Transforme sua forma de se posicionar no mercado e atrair clientes de alto valor.
              </p>
            </div>

            <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '1.3s' }}>
              <h3 className="text-2xl font-medium mb-4 font-serif text-rose-gold">Técnicas Avançadas</h3>
              <p className="text-sophisticated">
                Acesso exclusivo às técnicas mais avançadas de harmonização facial com base científica.
              </p>
            </div>

            <div className="card-glass animate-scale-in hover-grow" style={{ animationDelay: '1.4s' }}>
              <h3 className="text-2xl font-medium mb-4 font-serif text-rose-gold">Mentoria Personalizada</h3>
              <p className="text-sophisticated">
                Acompanhamento direto e personalizado para acelerar seus resultados.
              </p>
            </div>
          </div>
        </div>

        {/* Application Form Section */}
        <div className="mb-16 animate-fade-up" style={{ animationDelay: '1.5s' }}>
          <MentorshipForm />
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 mb-16 animate-scale-in" style={{ animationDelay: '1.6s' }}>
          <div className="card-glass p-8 max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl mb-4">Pronta para a Transformação?</h3>
            <p className="text-sophisticated mb-6">
              Se estiver verdadeiramente pronta para esse salto, será uma honra caminhar ao seu lado 
              nesta jornada de crescimento e sucesso.
            </p>
            <div className="flex items-center justify-center space-x-2 text-rose-gold">
              <span>✨</span>
              <span className="font-medium">Apenas 4 vagas disponíveis</span>
              <span>✨</span>
            </div>
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

export default Mentorship;
