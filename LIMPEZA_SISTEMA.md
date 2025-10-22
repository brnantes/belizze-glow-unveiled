# Instruções para Limpeza do Sistema

## Arquivos a serem mantidos

### Arquivos principais
1. `src/App.tsx` - Substituir pelo conteúdo de `App_admin.tsx` para incluir a rota para o Admin
2. `src/pages/Admin.tsx` - O painel administrativo completo
3. `src/pages/Index.tsx` - Substituir pelo conteúdo de `Index_admin.tsx` para incluir o botão de admin
4. `src/pages/Legacy.tsx` - Página de legado original
5. `src/pages/NotFound.tsx` - Página de erro 404
6. `src/lib/supabase.ts` - Configuração do Supabase
7. `src/main.tsx` - Arquivo principal de entrada

### Componentes necessários
1. `src/components/AdminButton.tsx` - Botão para acessar o painel admin
2. `src/components/AdminContacts.tsx` - Componente para gerenciar contatos no admin
3. `src/components/AppointmentForm.tsx` - Formulário de agendamento
4. `src/components/BeforeAfter.tsx` - Componente de antes e depois
5. `src/components/BeforeAfterSupabase.tsx` - Versão com Supabase
6. `src/components/ContactForm.tsx` - Formulário de contato
7. `src/components/Footer.tsx` - Rodapé do site
8. `src/components/Header.tsx` - Cabeçalho do site
9. `src/components/Hero.tsx` - Hero section
10. `src/components/LegacyPreview.tsx` - Preview de legado
11. `src/components/Procedures.tsx` - Componente de procedimentos
12. `src/components/ProceduresSupabase.tsx` - Versão com Supabase
13. `src/components/Testimonials.tsx` - Componente de depoimentos
14. `src/components/BelizzeSimpleLogo.tsx` - Logo simples da Belizze

### Componentes UI necessários
1. `src/components/ui/tabs.tsx`
2. `src/components/ui/button.tsx`
3. `src/components/ui/input.tsx`
4. `src/components/ui/textarea.tsx`
5. `src/components/ui/card.tsx`
6. `src/components/ui/toaster.tsx`
7. `src/components/ui/sonner.tsx`
8. `src/components/ui/tooltip.tsx`
9. `src/components/ui/skeleton.tsx`
10. `src/components/ui/dialog.tsx`
11. `src/components/ui/select.tsx`
12. `src/components/ui/form.tsx`
13. `src/components/ui/badge.tsx`

## Arquivos que podem ser removidos

### Arquivos duplicados do App
1. `src/App_admin.tsx` - Após copiar seu conteúdo para App.tsx
2. `src/App_updated.tsx`
3. `src/App_with_admin_login.tsx`

### Páginas duplicadas
1. `src/pages/AdminLogin.tsx` - Não é necessário, o Admin.tsx já tem a funcionalidade de login
2. `src/pages/Admin_updated.tsx`
3. `src/pages/Index_admin.tsx` - Após copiar seu conteúdo para Index.tsx
4. `src/pages/Index_direct_access.tsx`
5. `src/pages/Index_updated.tsx`
6. `src/pages/Index_with_admin_banner.tsx`
7. `src/pages/Index_with_admin_button.tsx`

### Componentes duplicados
1. `src/components/AdminAccessButton.tsx`
2. `src/components/AdminBanner.tsx`
3. `src/components/AdminDirectAccess.tsx`
4. `src/components/Footer_updated.tsx`
5. `src/components/Header_updated.tsx`
6. `src/components/HeroFixed.tsx`
7. `src/components/HeroNew.tsx`

### Arquivos de configuração duplicados
1. `src/lib/supabase-config.ts`

### Arquivos HTML duplicados
1. `admin.html`
2. `admin-direto.html`
3. `acesso-admin.html`

### Arquivos de instruções
1. `ACESSO_ADMIN_INSTRUCOES.md`
2. `COMO_ACESSAR_ADMIN.md`
3. `INSTRUCOES_SIMPLES.txt`
4. `README_ADMIN_ACCESS.md`
5. `README_SUPABASE_UPDATED.md`

## Passos para limpeza

1. **Atualizar App.tsx**:
   ```tsx
   import { Toaster } from "@/components/ui/toaster";
   import { Toaster as Sonner } from "@/components/ui/sonner";
   import { TooltipProvider } from "@/components/ui/tooltip";
   import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
   import { BrowserRouter, Routes, Route } from "react-router-dom";
   import Index from "./pages/Index";
   import NotFound from "./pages/NotFound";
   import Legacy from "./pages/Legacy";
   import Admin from "./pages/Admin";
   import { Header } from "@/components/Header";

   const queryClient = new QueryClient();

   const App = () => (
     <QueryClientProvider client={queryClient}>
       <TooltipProvider>
         <Toaster />
         <Sonner />
         <BrowserRouter>
           <Header />
           <Routes>
             <Route path="/" element={<Index />} />
             <Route path="/legado" element={<Legacy />} />
             <Route path="/admin" element={<Admin />} />
             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
             <Route path="*" element={<NotFound />} />
           </Routes>
         </BrowserRouter>
       </TooltipProvider>
     </QueryClientProvider>
   );

   export default App;
   ```

2. **Atualizar Index.tsx**:
   ```tsx
   import { Hero } from "@/components/Hero";
   import { Procedures } from "@/components/Procedures";
   import { BeforeAfter } from "@/components/BeforeAfter";
   import { Testimonials } from "@/components/Testimonials";
   import { LegacyPreview } from "@/components/LegacyPreview";
   import { Footer } from "@/components/Footer";
   import { AdminButton } from "@/components/AdminButton";

   const Index = () => {
     return (
       <div className="overflow-x-hidden">
         <Hero />
         <BeforeAfter />
         <Procedures />
         <LegacyPreview />
         <Testimonials />
         <Footer />
         
         {/* Botão de acesso ao painel administrativo */}
         <AdminButton />
       </div>
     );
   };

   export default Index;
   ```

3. Após fazer essas alterações, remova todos os arquivos listados na seção "Arquivos que podem ser removidos".
