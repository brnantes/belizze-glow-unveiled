import { useState } from "react";
import { Link } from "react-router-dom";

export const AdminBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 bg-rose-gold z-50 text-white py-2 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            className="w-5 h-5 mr-2" 
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
          <span className="font-medium">Acesso Administrativo</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/admin-login" 
            className="bg-white text-rose-gold px-4 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Entrar
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
