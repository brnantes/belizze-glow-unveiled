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
