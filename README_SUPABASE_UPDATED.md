# Belizze Glow - Integração com Supabase

Este documento contém instruções para a integração do site da Clínica Belizze com o Supabase, incluindo a configuração do banco de dados, storage e funções Edge.

## Configuração do Supabase

### URL e Chave Anônima
- **URL do Projeto**: https://wgamkjtlvebwquuxxqwu.supabase.co
- **Chave Anônima**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYW1ranRsdmVid3F1dXh4cXd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjMxNDgsImV4cCI6MjA3NTczOTE0OH0.5o0-VAfsLfvNOREB-Aujw4CDq3-68X1igSYz10_bYGU

### Tabelas Criadas
1. **procedures**: Armazena informações sobre os procedimentos estéticos oferecidos pela clínica.
2. **before_after**: Armazena imagens de antes e depois dos procedimentos.
3. **testimonials**: Armazena depoimentos de clientes.
4. **appointments**: Armazena agendamentos de consultas.
5. **professionals**: Armazena informações sobre os profissionais da clínica.
6. **contacts**: Armazena mensagens de contato enviadas pelo site.

### Buckets de Storage
1. **procedures**: Para armazenar imagens relacionadas aos procedimentos.
2. **before_after**: Para armazenar imagens de antes e depois.
3. **professionals**: Para armazenar fotos dos profissionais.
4. **testimonials**: Para armazenar avatares dos clientes que deram depoimentos.

### Funções Edge
1. **get-procedures**: Retorna a lista de procedimentos.
2. **get-before-after**: Retorna a lista de imagens antes e depois.
3. **schedule-appointment**: Agenda uma consulta.
4. **upload-image**: Faz upload de imagens para o storage.

## Acesso Administrativo

### Credenciais de Acesso
- **Email**: admin@belizze.com.br
- **Senha**: admin123

### Funcionalidades do Painel Administrativo
1. **Gerenciamento de Procedimentos**: Adicionar, editar e excluir procedimentos.
2. **Gerenciamento de Imagens Antes/Depois**: Adicionar, editar e excluir imagens de antes e depois.
3. **Gerenciamento de Contatos**: Visualizar e responder mensagens de contato.
4. **Gerenciamento de Agendamentos**: Visualizar e gerenciar agendamentos de consultas.

## Arquivos Atualizados

Para utilizar a integração com o Supabase, você precisa substituir os seguintes arquivos:

1. **App.tsx** → **App_updated.tsx**: Atualizado para incluir a rota de administração.
2. **pages/Index.tsx** → **pages/Index_updated.tsx**: Atualizado para usar os componentes que integram com o Supabase.
3. **components/Header.tsx** → **components/Header_updated.tsx**: Atualizado para incluir um link para a área administrativa.
4. **components/Footer.tsx** → **components/Footer_updated.tsx**: Atualizado para incluir um link para a área administrativa no rodapé.
5. **pages/Admin.tsx** → **pages/Admin_updated.tsx**: Atualizado para incluir a gestão de contatos.

## Novos Componentes

1. **src/lib/supabase.ts**: Configuração e funções para interagir com o Supabase.
2. **components/BeforeAfterSupabase.tsx**: Componente de antes e depois integrado com o Supabase.
3. **components/ProceduresSupabase.tsx**: Componente de procedimentos integrado com o Supabase.
4. **components/AppointmentForm.tsx**: Formulário de agendamento integrado com o Supabase.
5. **components/ContactForm.tsx**: Formulário de contato integrado com o Supabase.
6. **components/AdminContacts.tsx**: Componente para gerenciar contatos no painel administrativo.

## Instruções para Implementação

1. Instale as dependências do Supabase:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Substitua os arquivos mencionados acima pelos seus equivalentes atualizados.

3. Acesse o painel administrativo em `/admin` e faça login com as credenciais fornecidas.
   - Você também pode acessar o painel administrativo através do link no rodapé do site.

4. Comece a adicionar procedimentos, imagens antes/depois e outros conteúdos através do painel administrativo.

## Segurança

- Todas as tabelas estão protegidas com Row Level Security (RLS).
- O acesso ao painel administrativo requer autenticação.
- As operações de escrita nas tabelas principais (procedures, before_after, etc.) só podem ser realizadas por usuários autenticados.
- As imagens são armazenadas em buckets públicos, mas o upload só pode ser feito por usuários autenticados.

## Próximos Passos

1. Implementar sistema de recuperação de senha.
2. Melhorar o sistema de agendamentos com confirmação por email.
3. Adicionar mais relatórios e estatísticas no painel administrativo.
4. Implementar sistema de notificações para novos contatos e agendamentos.
