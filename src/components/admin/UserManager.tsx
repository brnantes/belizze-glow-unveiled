import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefreshCw, UserPlus, Edit, Trash2, UserCog } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Interface para representar um admin do sistema
interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}

export const UserManager = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Carregar admins da tabela site_admins
  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_admins')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar admins:", error);
      toast.error(`Erro ao carregar admins: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Criar novo admin
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail) {
      toast.error("Email é obrigatório");
      return;
    }

    if (!newUserEmail.includes('@')) {
      toast.error("Email deve ter um formato válido");
      return;
    }

    if (!newUserPassword || newUserPassword.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      setLoading(true);
      console.log(`📧 Criando admin: ${newUserEmail}`);
      
      // Verificar se o email já existe
      const { data: existingAdmin } = await supabase
        .from('site_admins')
        .select('email')
        .eq('email', newUserEmail)
        .single();

      if (existingAdmin) {
        toast.error("Este email já está cadastrado como admin");
        return;
      }
      
      const { data, error } = await supabase
        .from('site_admins')
        .insert([{ email: newUserEmail, password: newUserPassword }])
        .select();
      
      if (error) {
        console.error("❌ Erro SQL:", error);
        throw error;
      }
      
      console.log("✅ Admin criado:", data);
      toast.success(`Admin ${newUserEmail} adicionado com sucesso!`);
      setNewUserEmail("");
      setNewUserPassword("");
      setIsDialogOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error("❌ Erro ao adicionar admin:", error);
      toast.error(`Erro ao adicionar admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Não precisa mais atualizar senha - removido
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Funcionalidade de reset de senha será implementada em breve");
  };

  // Deletar admin
  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === 'admin@belizze.com.br') {
      toast.error("Não é possível excluir o admin principal");
      return;
    }
    
    if (!confirm(`Tem certeza que deseja excluir o admin ${email}?`)) {
      return;
    }
    
    try {
      setLoading(true);
      console.log(`🗑️ Deletando admin: ${email} (ID: ${userId})`);
      
      const { error } = await supabase
        .from('site_admins')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error("❌ Erro SQL ao deletar:", error);
        throw error;
      }
      
      console.log("✅ Admin deletado com sucesso");
      toast.success(`Admin ${email} excluído com sucesso!`);
      
      // Atualizar lista removendo o usuário deletado
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
    } catch (error: any) {
      console.error("❌ Erro ao excluir admin:", error);
      toast.error(`Erro ao excluir admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Administradores</h2>
          <p className="text-muted-foreground">
            Gerencie os administradores que podem acessar o painel
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadUsers} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Admin</DialogTitle>
                <DialogDescription>
                  Adicione um novo email com acesso ao painel administrativo.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="admin@exemplo.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Digite uma senha segura"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adicionando..." : "Adicionar Admin"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Lista de Administradores</CardTitle>
          <CardDescription>Administradores com acesso ao painel</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && users.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold mx-auto"></div>
              <p className="text-muted-foreground">
                Carregando administradores...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhum administrador encontrado</h3>
              <p className="text-muted-foreground">
                Clique em "Novo Admin" para adicionar um administrador ao sistema.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Adicionado em</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {user.email}
                        {user.email === "admin@belizze.com.br" && (
                          <Badge variant="secondary" className="ml-2">Principal</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">{formatDate(user.created_at)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={user.email === "admin@belizze.com.br"}
                          className={user.email === "admin@belizze.com.br" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
