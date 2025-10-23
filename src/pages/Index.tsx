import { Hero } from "@/components/Hero";
import { BeforeAfterSupabase } from "@/components/BeforeAfterSupabase";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { LegacyPreview } from "@/components/LegacyPreview";
import { AdminDirectAccess } from "@/components/AdminDirectAccess";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <BeforeAfterSupabase />
      <LegacyPreview />
      <Testimonials />
      <FAQ />
      
      <Footer />
      
      {/* Acesso administrativo discreto no rodapé */}
      <AdminDirectAccess />
    </div>
  );
};

export default Index;
