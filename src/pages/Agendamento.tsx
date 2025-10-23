import { Header } from "@/components/Header";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { Footer } from "@/components/Footer";

const Agendamento = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AppointmentBooking />
      </main>
      <Footer />
    </div>
  );
};

export default Agendamento;
