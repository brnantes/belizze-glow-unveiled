import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TrackingPixels from "@/components/TrackingPixels";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Legacy from "./pages/Legacy";
import Mentorship from "./pages/Mentorship";
import MentorshipThankYou from "./pages/MentorshipThankYou";
import UploadImages from "./pages/UploadImages";
import AdminProfessional from "./pages/AdminProfessional";
import AdminLogin from "./pages/AdminLogin";
import { Header } from "@/components/Header";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Pixels de rastreamento no head */}
      <TrackingPixels location="head" />
      <BrowserRouter>
        <Routes>
          {/* Rota de login administrativo */}
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Rota protegida do painel administrativo */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute>
              <AdminProfessional />
            </ProtectedRoute>
          } />
          
          {/* Redirecionar /admin para /admin-login */}
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
          
          {/* Rotas públicas do site */}
          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/legado" element={<Legacy />} />
                  <Route path="/mentoria" element={<Mentorship />} />
                  <Route path="/mentoria-agradecimento" element={<MentorshipThankYou />} />
                  <Route path="/upload-images" element={<UploadImages />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
      {/* Pixels de rastreamento no body */}
      <TrackingPixels location="body" />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
