import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase"; // Usado apenas para validação da tabela site_admins
import { toast } from "sonner";
import { BelizzeOfficialLogo } from "@/components/BelizzeOfficialLogo";
import { useAdminLogger } from "@/hooks/useAdminLogger";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logLogin } = useAdminLogger();

  useEffect(() => {
    // Verificar se já tem sessão no localStorage
    const session = localStorage.getItem('admin_session');
    if (session) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log(`🔐 Tentativa de login: ${email}`);
      
      // Validar credenciais contra a tabela site_admins
      const { data: adminData, error } = await supabase
        .from('site_admins')
        .select('email, password')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Erro ao validar credenciais:', error);
        throw new Error('Erro ao validar credenciais');
      }
      
      if (!adminData) {
        console.log('❌ Credenciais inválidas');
        throw new Error('Email ou senha incorretos');
      }
      
      console.log('✅ Login válido para:', adminData.email);
      
      // Criar sessão no localStorage
      localStorage.setItem('admin_session', JSON.stringify({
        email: adminData.email,
        timestamp: new Date().toISOString()
      }));
      
      toast.success("Login realizado com sucesso!");
      
      // Registrar login no sistema de logs
      setTimeout(() => {
        logLogin();
      }, 100);
      
      navigate("/admin-dashboard", { replace: true });
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <BelizzeOfficialLogo />
          </div>
          <CardTitle className="text-2xl font-serif">Painel Administrativo</CardTitle>
          <CardDescription>Faça login para acessar o painel administrativo</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********" 
                required 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="btn-rose-gold w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
