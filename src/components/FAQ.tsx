import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export const FAQ = () => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [faqData, setFaqData] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFAQData();
  }, []);

  const loadFAQData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('faq_items')
        .select('id, question, answer, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      setFaqData(data || []);
    } catch (error) {
      console.error('Erro ao carregar FAQ:', error);
      // Em caso de erro, usar dados de fallback
      setFaqData([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-background to-beige-light/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-rose-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-rose-gold/10 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground animate-fade-up">
            Perguntas
            <span className="bg-gradient-to-r from-rose-gold-metallic to-rose-gold-bright bg-clip-text text-transparent">
              {" "}Frequentes
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Esclarecemos as principais dúvidas sobre nossos procedimentos e tratamentos de harmonização facial.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full mx-auto"></div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold mx-auto"></div>
              <p className="text-muted-foreground mt-4">Carregando perguntas...</p>
            </div>
          ) : faqData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma pergunta disponível no momento.</p>
            </div>
          ) : (
            faqData.map((item, index) => (
            <div 
              key={item.id} 
              className="card-glass border border-rose-gold/20 hover:border-rose-gold/40 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-beige-light/20 transition-colors duration-200"
              >
                <h3 className="font-serif text-lg md:text-xl text-foreground pr-4">
                  {item.question}
                </h3>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-rose-gold to-rose-gold-metallic flex items-center justify-center">
                  {openItems.has(item.id) ? (
                    <ChevronUp className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
              
              {openItems.has(item.id) && (
                <div className="px-6 pb-5 animate-fade-in">
                  <div className="border-t border-rose-gold/10 pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 animate-scale-in" style={{ animationDelay: '0.8s' }}>
          <div className="card-glass p-8 max-w-2xl mx-auto border border-rose-gold/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-rose-gold to-rose-gold-metallic rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl mb-4 bg-gradient-to-r from-rose-gold to-rose-gold-metallic bg-clip-text text-transparent">
              Ainda tem dúvidas?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está pronta para esclarecer todas as suas questões e ajudar você a escolher o melhor tratamento.
            </p>
            <button className="btn-rose-gold px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105">
              Falar com nossa equipe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
