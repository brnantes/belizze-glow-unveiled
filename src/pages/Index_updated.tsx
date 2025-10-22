import { Hero } from "@/components/Hero";
import { ProceduresSupabase } from "@/components/ProceduresSupabase";
import { BeforeAfterSupabase } from "@/components/BeforeAfterSupabase";
import { Testimonials } from "@/components/Testimonials";
import { LegacyPreview } from "@/components/LegacyPreview";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <BeforeAfterSupabase />
      <ProceduresSupabase />
      <LegacyPreview />
      <Testimonials />
      
      <Footer />
    </div>
  );
};

export default Index;
