# Implementação de Leads de Mentoria

Este documento contém instruções para implementar o sistema de leads de mentoria no site da Belizze.

## Funcionalidades Implementadas

1. **Formulário de Mentoria**:
   - Salvamento dos dados no Supabase
   - Redirecionamento para página de agradecimento
   - Integração com webhook para envio dos dados para outros sistemas

2. **Painel Administrativo**:
   - Nova guia "Leads Mentoria" no painel administrativo
   - Visualização de todos os leads cadastrados
   - Filtro por status (Novo, Contatado, Agendado, Rejeitado)
   - Adição de notas e atualização de status

## Configuração do Banco de Dados

Execute o script SQL abaixo no Supabase SQL Editor para criar a tabela de leads:

```sql
-- Conteúdo do arquivo sql/create_mentorship_leads_table.sql
```

## Configuração do Webhook

Para configurar o webhook para envio dos dados para outros sistemas:

1. Crie uma variável de ambiente `NEXT_PUBLIC_WEBHOOK_URL` com a URL do seu webhook
2. Ou edite o arquivo `src/lib/mentorshipLeads.ts` e substitua a URL padrão pela URL do seu webhook

## Fluxo de Funcionamento

1. Usuário preenche o formulário na página de mentoria
2. Os dados são salvos na tabela `mentorship_leads` no Supabase
3. Os dados são enviados para o webhook configurado
4. O usuário é redirecionado para a página de agradecimento
5. Os administradores podem visualizar e gerenciar os leads no painel administrativo

## Arquivos Criados/Modificados

- `src/lib/mentorshipLeads.ts`: Funções para salvar e gerenciar leads
- `src/pages/MentorshipThankYou.tsx`: Página de agradecimento
- `src/components/admin/MentorshipLeadsManager.tsx`: Componente para gerenciar leads
- `src/components/MentorshipForm.tsx`: Modificado para salvar dados e redirecionar
- `src/App.tsx`: Adicionada rota para página de agradecimento
- `src/pages/AdminProfessional.tsx`: Adicionada guia para leads de mentoria
- `sql/create_mentorship_leads_table.sql`: Script para criar tabela no Supabase

## Próximos Passos

1. Configurar notificações por email quando novos leads forem cadastrados
2. Implementar exportação dos leads para CSV/Excel
3. Adicionar filtros adicionais (por data, localização, etc.)
4. Implementar sistema de tags para categorizar leads
