import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Procedure, scheduleAppointment } from "@/lib/supabase";
import { toast } from "sonner";

const formSchema = z.object({
  client_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  client_email: z.string().email("Email inválido"),
  client_phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  procedure_id: z.string().uuid("Selecione um procedimento"),
  appointment_date: z.string().min(1, "Selecione uma data"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AppointmentFormProps {
  procedures: Procedure[];
  onSuccess?: () => void;
}

export const AppointmentForm = ({ procedures, onSuccess }: AppointmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      client_email: "",
      client_phone: "",
      procedure_id: "",
      appointment_date: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      await scheduleAppointment(data);
      toast.success("Agendamento realizado com sucesso! Entraremos em contato em breve.");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao agendar:", error);
      toast.error("Erro ao realizar agendamento. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="client_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="client_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="procedure_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedimento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um procedimento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {procedures.map((procedure) => (
                    <SelectItem key={procedure.id} value={procedure.id}>
                      {procedure.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appointment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data preferencial</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Alguma informação adicional que gostaria de compartilhar?" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="btn-rose-gold w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Agendando..." : "Agendar Consulta"}
        </Button>
      </form>
    </Form>
  );
};
