import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { RefreshCw, Plus, Edit, Trash2, HelpCircle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdminLogger } from "@/hooks/useAdminLogger";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const FAQManager = () => {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    is_active: true
  });

  const { logActivity } = useAdminLogger();

  useEffect(() => {
    loadFAQItems();
  }, []);

  const loadFAQItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('faq_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setFaqItems(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar FAQ:", error);
      toast.error(`Erro ao carregar FAQ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Pergunta e resposta são obrigatórias");
      return;
    }

    try {
      setLoading(true);

      if (editingItem) {
        // Atualizar item existente
        const { error } = await supabase
          .from('faq_items')
          .update({
            question: formData.question.trim(),
            answer: formData.answer.trim(),
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        await logActivity({
          action: 'FAQ_UPDATE',
          details: `Pergunta atualizada: ${formData.question.substring(0, 50)}...`,
          resourceType: 'faq',
          resourceId: editingItem.id
        });

        toast.success("Pergunta atualizada com sucesso!");
      } else {
        // Criar novo item
        const maxOrder = Math.max(...faqItems.map(item => item.display_order), 0);
        
        const { error } = await supabase
          .from('faq_items')
          .insert([{
            question: formData.question.trim(),
            answer: formData.answer.trim(),
            is_active: formData.is_active,
            display_order: maxOrder + 1
          }]);

        if (error) throw error;

        await logActivity({
          action: 'FAQ_CREATE',
          details: `Nova pergunta criada: ${formData.question.substring(0, 50)}...`,
          resourceType: 'faq'
        });

        toast.success("Pergunta adicionada com sucesso!");
      }

      resetForm();
      loadFAQItems();
    } catch (error: any) {
      console.error("Erro ao salvar FAQ:", error);
      toast.error(`Erro ao salvar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: FAQItem) => {
    if (!confirm(`Tem certeza que deseja excluir a pergunta "${item.question}"?`)) {
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await logActivity({
        action: 'FAQ_DELETE',
        details: `Pergunta excluída: ${item.question.substring(0, 50)}...`,
        resourceType: 'faq',
        resourceId: item.id
      });

      toast.success("Pergunta excluída com sucesso!");
      setFaqItems(prevItems => prevItems.filter(faq => faq.id !== item.id));
    } catch (error: any) {
      console.error("Erro ao excluir FAQ:", error);
      toast.error(`Erro ao excluir: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (item: FAQItem) => {
    try {
      const { error } = await supabase
        .from('faq_items')
        .update({ 
          is_active: !item.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;

      await logActivity({
        action: 'FAQ_TOGGLE',
        details: `Pergunta ${!item.is_active ? 'ativada' : 'desativada'}: ${item.question.substring(0, 50)}...`,
        resourceType: 'faq',
        resourceId: item.id
      });

      toast.success(`Pergunta ${!item.is_active ? 'ativada' : 'desativada'} com sucesso!`);
      loadFAQItems();
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      toast.error(`Erro ao alterar status: ${error.message}`);
    }
  };

  const handleMoveOrder = async (item: FAQItem, direction: 'up' | 'down') => {
    const sortedItems = [...faqItems].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedItems.findIndex(faq => faq.id === item.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedItems.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetItem = sortedItems[targetIndex];

    try {
      // Trocar as ordens
      await supabase
        .from('faq_items')
        .update({ display_order: targetItem.display_order })
        .eq('id', item.id);

      await supabase
        .from('faq_items')
        .update({ display_order: item.display_order })
        .eq('id', targetItem.id);

      await logActivity({
        action: 'FAQ_REORDER',
        details: `Pergunta reordenada: ${item.question.substring(0, 50)}...`,
        resourceType: 'faq',
        resourceId: item.id
      });

      toast.success("Ordem alterada com sucesso!");
      loadFAQItems();
    } catch (error: any) {
      console.error("Erro ao reordenar:", error);
      toast.error(`Erro ao reordenar: ${error.message}`);
    }
  };

  const handleEdit = (item: FAQItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      is_active: item.is_active
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      is_active: true
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
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
          <h2 className="text-3xl font-serif font-bold mb-2">Perguntas Frequentes</h2>
          <p className="text-muted-foreground">
            Gerencie as perguntas e respostas que aparecem no site
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={loadFAQItems} 
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Pergunta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Editar Pergunta" : "Nova Pergunta"}
                </DialogTitle>
                <DialogDescription>
                  {editingItem ? "Modifique a pergunta e resposta" : "Adicione uma nova pergunta frequente"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="question" className="text-sm font-medium">
                      Pergunta
                    </label>
                    <Input
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="Digite a pergunta..."
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="answer" className="text-sm font-medium">
                      Resposta
                    </label>
                    <Textarea
                      id="answer"
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      placeholder="Digite a resposta..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">
                      Ativa (visível no site)
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Salvando..." : editingItem ? "Atualizar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-rose-gold" />
            Lista de Perguntas ({faqItems.length})
          </CardTitle>
          <CardDescription>
            Gerencie as perguntas que aparecem na seção FAQ do site
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && faqItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-gold mx-auto"></div>
              <p className="text-muted-foreground mt-4">Carregando perguntas...</p>
            </div>
          ) : faqItems.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhuma pergunta cadastrada</h3>
              <p className="text-muted-foreground">
                Clique em "Nova Pergunta" para adicionar a primeira pergunta frequente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqItems
                .sort((a, b) => a.display_order - b.display_order)
                .map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          #{item.display_order}
                        </span>
                        <Badge variant={item.is_active ? "default" : "secondary"}>
                          {item.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-foreground">
                        {item.question}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.answer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Atualizada em: {formatDate(item.updated_at)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      {/* Botão de ativar/desativar */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(item)}
                        className="h-8 w-8 p-0"
                      >
                        {item.is_active ? (
                          <EyeOff className="h-4 w-4 text-orange-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      
                      {/* Botão de editar */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Botão de excluir */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
