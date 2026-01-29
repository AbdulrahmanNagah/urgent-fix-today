import { useNavigate } from 'react-router-dom';
import { Droplets, Zap, Shield, Clock, Banknote } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { useBooking } from '@/context/BookingContext';

const Home = () => {
  const navigate = useNavigate();
  const { setSelectedService } = useBooking();

  const handleServiceSelect = (service: 'plumbing' | 'electrical') => {
    setSelectedService(service);
    navigate(`/technicians/${service}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="gradient-hero text-primary-foreground">
        <div className="container py-10 pb-14">
          <div className="max-w-md">
            <h1 className="text-3xl font-extrabold mb-3 leading-tight">
              Reliable technicians.
              <br />
              <span className="text-accent">Today.</span>
            </h1>
            <p className="text-primary-foreground/80 text-base">
              Book verified plumbers and electricians who actually show up. Clear pricing, no chasing.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="container -mt-6">
        <div className="bg-card rounded-2xl shadow-card p-4 grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="inline-flex p-2 rounded-lg bg-success/10 mb-2">
              <Shield className="w-5 h-5 text-success" />
            </div>
            <p className="text-xs font-medium text-foreground">Verified</p>
            <p className="text-xs text-muted-foreground">Technicians</p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-2 rounded-lg bg-accent/10 mb-2">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <p className="text-xs font-medium text-foreground">Same Day</p>
            <p className="text-xs text-muted-foreground">Arrival</p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-2">
              <Banknote className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">Clear</p>
            <p className="text-xs text-muted-foreground">Pricing</p>
          </div>
        </div>
      </div>

      {/* Service Selection */}
      <div className="container py-8">
        <h2 className="text-lg font-bold text-foreground mb-4">What do you need fixed?</h2>
        <div className="space-y-4">
          <ServiceCard
            title="Plumbing"
            description="Water leaks, clogged drains, toilet repairs"
            icon={Droplets}
            examples={['Leaking pipe', 'Blocked drain', 'Toilet issue']}
            onClick={() => handleServiceSelect('plumbing')}
          />
          <ServiceCard
            title="Electrical"
            description="Power outages, socket repairs, wiring issues"
            icon={Zap}
            examples={['No power', 'Socket repair', 'Light fixture']}
            onClick={() => handleServiceSelect('electrical')}
          />
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
};

export default Home;
