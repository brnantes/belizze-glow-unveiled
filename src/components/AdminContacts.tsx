import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Erro ao buscar contatos:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_read: isRead })
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar o estado local
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, is_read: isRead } : contact
      ));
      
      toast.success(isRead ? "Marcado como lido" : "Marcado como não lido");
    } catch (error) {
      console.error("Erro ao atualizar contato:", error);
      toast.error("Erro ao atualizar status do contato");
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Atualizar o estado local
      setContacts(contacts.filter(contact => contact.id !== id));
      
      toast.success("Contato excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir contato:", error);
      toast.error("Erro ao excluir contato");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Mensagens de Contato</h2>
        <Button 
          variant="outline" 
          onClick={fetchContacts}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Atualizar"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold"></div>
        </div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma mensagem de contato encontrada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map(contact => (
            <Card key={contact.id} className={contact.is_read ? "opacity-75" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {contact.name}
                      {!contact.is_read && (
                        <Badge variant="default" className="bg-rose-gold text-white">
                          Nova
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDate(contact.created_at)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsRead(contact.id, !contact.is_read)}
                    >
                      {contact.is_read ? "Marcar como não lido" : "Marcar como lido"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteContact(contact.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div>
                    <span className="text-sm font-medium">Email:</span>{" "}
                    <a href={`mailto:${contact.email}`} className="text-rose-gold-metallic hover:underline">
                      {contact.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Telefone:</span>{" "}
                    <a href={`tel:${contact.phone}`} className="text-rose-gold-metallic hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{contact.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
