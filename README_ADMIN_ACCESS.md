# Acesso ao Painel Administrativo da Clínica Belizze

Este documento contém instruções específicas para acessar o painel administrativo da Clínica Belizze.

## Opções de Acesso ao Painel Administrativo

Existem várias maneiras de acessar o painel administrativo:

### 1. Botão Flutuante de Acesso Rápido

Foi adicionado um botão flutuante no canto inferior direito de todas as páginas do site. Este botão tem o ícone de um cadeado e leva diretamente à página de login administrativo.

### 2. URL Direta

Você pode acessar o painel administrativo diretamente através da URL:
```
https://seu-site.com/admin-login
```

### 3. Link no Rodapé

No rodapé do site, foi adicionado um link discreto "Área Administrativa" que também leva à página de login.

## Credenciais de Acesso

Para acessar o painel administrativo, utilize as seguintes credenciais:

- **Email**: admin@belizze.com.br
- **Senha**: admin123

## Arquivos Atualizados

Para implementar o acesso ao painel administrativo, foram criados ou atualizados os seguintes arquivos:

1. **src/pages/AdminLogin.tsx**: Nova página dedicada ao login administrativo.
2. **src/components/AdminAccessButton.tsx**: Componente do botão flutuante de acesso rápido.
3. **src/App_with_admin_login.tsx**: Versão atualizada do App.tsx com a rota para a página de login.
4. **src/pages/Index_with_admin_button.tsx**: Versão atualizada da página inicial com o botão de acesso.
5. **src/components/Footer_updated.tsx**: Rodapé atualizado com link para a área administrativa.

## Instruções para Implementação

1. Substitua os arquivos originais pelos arquivos atualizados:

   ```
   App.tsx → App_with_admin_login.tsx
   pages/Index.tsx → pages/Index_with_admin_button.tsx
   components/Footer.tsx → components/Footer_updated.tsx
   ```

2. Adicione os novos arquivos ao projeto:

   ```
   src/pages/AdminLogin.tsx
   src/components/AdminAccessButton.tsx
   ```

3. Certifique-se de que as dependências do Supabase estão instaladas:

   ```bash
   npm install @supabase/supabase-js
   ```

4. Reinicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse o painel administrativo usando uma das opções mencionadas acima e faça login com as credenciais fornecidas.

## Segurança

- O acesso ao painel administrativo é protegido por autenticação.
- Todas as operações administrativas requerem um usuário autenticado.
- As credenciais de acesso devem ser alteradas após o primeiro login por motivos de segurança.

## Próximos Passos

1. Implementar sistema de recuperação de senha.
2. Adicionar autenticação de dois fatores para maior segurança.
3. Criar diferentes níveis de acesso administrativo (admin, editor, etc.).
4. Implementar registro de atividades (logs) para monitorar ações administrativas.
