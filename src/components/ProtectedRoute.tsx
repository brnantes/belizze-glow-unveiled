import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}


export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Verificar se tem sessão no localStorage
    const session = localStorage.getItem('admin_session');
    if (session) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold mb-4"></div>
        <p className="text-muted-foreground">Verificando autenticação...</p>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};
