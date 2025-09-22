import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    procedure: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada! Entraremos em contato em breve.");
    setFormData({ name: "", phone: "", email: "", procedure: "", message: "" });
  };

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de agendar uma consulta na Belizze. Meu nome é ${formData.name || '[Nome]'} e tenho interesse em ${formData.procedure || 'harmonização facial'}.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-24 bg-elegant relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-rose-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-nude-elegant/20 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
                Agende sua
                <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
                  {" "}Consulta
                </span>
              </h2>
              <p className="text-elegant animate-fade-up" style={{ animationDelay: '0.2s' }}>
                Entre em contato conosco e descubra como podemos realçar sua beleza natural.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="card-glass p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Nome completo</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Seu nome"
                      className="bg-background/50 border-border/50 focus:border-rose-gold"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Telefone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      className="bg-background/50 border-border/50 focus:border-rose-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">E-mail</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="seu@email.com"
                    className="bg-background/50 border-border/50 focus:border-rose-gold"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Procedimento de interesse</label>
                  <select
                    value={formData.procedure}
                    onChange={(e) => setFormData({...formData, procedure: e.target.value})}
                    className="w-full px-3 py-2 bg-background/50 border border-border/50 rounded-lg focus:border-rose-gold focus:outline-none"
                  >
                    <option value="">Selecione um procedimento</option>
                    <option value="Preenchimento Labial">Preenchimento Labial</option>
                    <option value="Botox">Botox</option>
                    <option value="Bioestimuladores">Bioestimuladores</option>
                    <option value="Rinoplastia sem Cirurgia">Rinoplastia sem Cirurgia</option>
                    <option value="Harmonização Completa">Harmonização Completa</option>
                    <option value="Skincare Avançado">Skincare Avançado</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Mensagem (opcional)</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Conte-nos mais sobre seus objetivos..."
                    className="bg-background/50 border-border/50 focus:border-rose-gold min-h-[100px]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" className="btn-rose-gold flex-1">
                    Enviar Mensagem
                  </Button>
                  <Button type="button" onClick={handleWhatsApp} className="btn-elegant flex-1">
                    WhatsApp Direto
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="card-glass p-8 space-y-6">
              <h3 className="font-serif text-2xl text-foreground">Informações de Contato</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Endereço</div>
                    <div className="text-muted-foreground">Rua das Flores, 123 - Jardins<br />São Paulo, SP - CEP 01234-567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Telefone</div>
                    <div className="text-muted-foreground">(11) 9999-9999</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">Horário de Funcionamento</div>
                    <div className="text-muted-foreground">
                      Segunda a Sexta: 9h às 19h<br />
                      Sábado: 9h às 17h
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">E-mail</div>
                    <div className="text-muted-foreground">contato@belizze.com.br</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card-glass p-6">
              <h4 className="font-serif text-xl mb-4">Siga-nos nas redes sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center hover-grow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center hover-grow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-gradient-to-br from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center hover-grow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={handleWhatsApp} className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </Button>
      </div>
    </section>
  );
};