import { Link } from "react-router-dom";

export const AdminButton = () => {
  return (
    <div className="fixed top-20 right-4 z-50">
      <Link
        to="/admin"
        className="bg-rose-gold text-white px-4 py-2 rounded-md shadow-lg hover:bg-rose-gold-metallic transition-colors flex items-center"
      >
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
        Painel Admin
      </Link>
    </div>
  );
};
