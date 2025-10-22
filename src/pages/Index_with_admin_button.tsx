import { Hero } from "@/components/Hero";
import { ProceduresSupabase } from "@/components/ProceduresSupabase";
import { BeforeAfterSupabase } from "@/components/BeforeAfterSupabase";
import { Testimonials } from "@/components/Testimonials";
import { LegacyPreview } from "@/components/LegacyPreview";
import { Footer } from "@/components/Footer";
import { AdminAccessButton } from "@/components/AdminAccessButton";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <BeforeAfterSupabase />
      <ProceduresSupabase />
      <LegacyPreview />
      <Testimonials />
      
      <Footer />
      
      {/* Botão de acesso administrativo */}
      <AdminAccessButton />
    </div>
  );
};

export default Index;
