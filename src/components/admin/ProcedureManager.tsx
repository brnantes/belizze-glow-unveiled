import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Save, X, Clock, DollarSign } from "lucide-react";
import { Procedure } from "@/lib/supabase";

interface ProcedureManagerProps {
  procedures: Procedure[];
  onAdd: (procedure: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, procedure: any) => Promise<void>;
}

export const ProcedureManager = ({ procedures, onAdd, onDelete, onUpdate }: ProcedureManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    details: "",
    duration: "",
    price: "",
    icon: ""
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      details: "",
      duration: "",
      price: "",
      icon: ""
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId && onUpdate) {
      await onUpdate(editingId, formData);
    } else {
      await onAdd(formData);
    }
    resetForm();
  };

  const handleEdit = (procedure: Procedure) => {
    setFormData({
      title: procedure.title,
      description: procedure.description,
      details: procedure.details,
      duration: procedure.duration,
      price: procedure.price,
      icon: procedure.icon
    });
    setEditingId(procedure.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Procedimentos</h2>
          <p className="text-muted-foreground">Gerencie os procedimentos oferecidos</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="btn-rose-gold">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Procedimento
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <Card className="border-rose-gold/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingId ? "Editar Procedimento" : "Novo Procedimento"}
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Preencha as informações do procedimento
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Título *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Preenchimento Labial"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ícone (emoji) *</label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Ex: 💋"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição Curta *</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição do procedimento"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Detalhes Completos *</label>
                <Textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Descrição detalhada do procedimento, benefícios, indicações..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Duração *
                  </label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ex: 45 minutos"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Preço *
                  </label>
                  <Input
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: A partir de R$ 800"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit" className="btn-rose-gold flex-1">
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Salvar Alterações" : "Adicionar Procedimento"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Procedures List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {procedures.map((procedure) => (
          <Card key={procedure.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{procedure.icon}</span>
                  <span>{procedure.title}</span>
                </span>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {procedure.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {procedure.details}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {procedure.duration}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  {procedure.price}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEdit(procedure)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (confirm(`Tem certeza que deseja excluir "${procedure.title}"?`)) {
                    onDelete(procedure.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {procedures.length === 0 && !isAdding && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Nenhum procedimento cadastrado ainda.</p>
          <Button onClick={() => setIsAdding(true)} className="btn-rose-gold">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Procedimento
          </Button>
        </Card>
      )}
    </div>
  );
};
