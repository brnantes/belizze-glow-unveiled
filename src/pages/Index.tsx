import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Procedures } from "@/components/Procedures";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <BeforeAfter />
      <Procedures />
      <About />
      <Testimonials />
      <Contact />
    </div>
  );
};

export default Index;
