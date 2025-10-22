import { Link } from "react-router-dom";

export const AdminAccessButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        to="/admin-login"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-gold shadow-lg hover:bg-rose-gold-metallic transition-colors"
        title="Acesso Administrativo"
      >
        <svg
          className="w-6 h-6 text-white"
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
      </Link>
    </div>
  );
};
