import { Hero } from "@/components/Hero";
import { ProceduresSupabase } from "@/components/ProceduresSupabase";
import { BeforeAfterSupabase } from "@/components/BeforeAfterSupabase";
import { Testimonials } from "@/components/Testimonials";
import { LegacyPreview } from "@/components/LegacyPreview";
import { Footer } from "@/components/Footer_updated";
import { AdminBanner } from "@/components/AdminBanner";
import { AdminAccessButton } from "@/components/AdminAccessButton";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Banner de acesso administrativo */}
      <AdminBanner />
      
      <Hero />
      <BeforeAfterSupabase />
      <ProceduresSupabase />
      <LegacyPreview />
      <Testimonials />
      
      <Footer />
      
      {/* Botão flutuante de acesso administrativo */}
      <AdminAccessButton />
    </div>
  );
};

export default Index;
