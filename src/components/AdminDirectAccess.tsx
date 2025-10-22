import { Link } from "react-router-dom";
import { useState } from "react";

export const AdminDirectAccess = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Contador para detectar cliques no canto inferior direito
  const handleFooterCornerClick = () => {
    setIsVisible(true);
    
    // Esconder o link após 5 segundos
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };
  
  return (
    <>
      {/* Área clicável invisível no canto do rodapé */}
      <div 
        className="fixed bottom-0 right-0 w-12 h-12 cursor-default z-40" 
        onClick={handleFooterCornerClick}
        title="Clique para acesso administrativo"
      />
      
      {/* Link de acesso administrativo - aparece apenas quando ativado */}
      <div className={`
        fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
      `}>
        <Link
          to="/admin-login"
          className="text-xs text-gray-400 hover:text-rose-gold flex items-center gap-1 py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <svg 
            className="w-3 h-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Acesso Administrativo
        </Link>
      </div>
    </>
  );
};
