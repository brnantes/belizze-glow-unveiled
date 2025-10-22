import { Hero } from "@/components/Hero";
import { Procedures } from "@/components/Procedures";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Testimonials } from "@/components/Testimonials";
import { LegacyPreview } from "@/components/LegacyPreview";
import { Footer } from "@/components/Footer";
import { AdminDirectAccess } from "@/components/AdminDirectAccess";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <BeforeAfter />
      <Procedures />
      <LegacyPreview />
      <Testimonials />
      
      <Footer />
      
      {/* Botão de acesso direto ao painel administrativo */}
      <AdminDirectAccess />
    </div>
  );
};

export default Index;
