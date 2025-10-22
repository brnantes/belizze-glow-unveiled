import { BelizzeSimpleLogo } from "@/components/BelizzeSimpleLogo";
import { useState, useEffect } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Fechar o menu ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent backdrop-blur-md"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-sm font-medium text-white hover:text-[#f5e1d5] transition-colors">Início</a>
          <a href="/legado" className="text-sm font-medium text-white hover:text-[#f5e1d5] transition-colors">Legado</a>
          <a href="/mentoria" className="text-sm font-medium text-white hover:text-[#f5e1d5] transition-colors">Mentoria</a>
        </nav>
        <a href="/" aria-label="Belizze" className="flex items-center px-2 py-1 rounded-md bg-white/10">
          <BelizzeSimpleLogo />
        </a>
        <div className="md:hidden">
          <button 
            className="p-1.5 text-white menu-button" 
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12"/>
                <line x1="4" x2="20" y1="6" y2="6"/>
                <line x1="4" x2="20" y1="18" y2="18"/>
              </svg>
            )}
          </button>
        </div>
        
        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-lg mobile-menu">
            <div className="py-4 px-6 flex flex-col space-y-3">
              <a href="/" className="text-white font-medium py-2 px-3 rounded-md hover:bg-white/10 transition-colors">
                Início
              </a>
              <a href="/legado" className="text-white font-medium py-2 px-3 rounded-md hover:bg-white/10 transition-colors">
                Legado
              </a>
              <a href="/mentoria" className="text-white font-medium py-2 px-3 rounded-md hover:bg-white/10 transition-colors">
                Mentoria
              </a>
              <a 
                href="https://wa.me/5567992436211?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20Belizze."
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium py-2 px-3 rounded-md bg-rose-gold/30 hover:bg-rose-gold/50 transition-colors mt-2"
              >
                Agendar Consulta
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
