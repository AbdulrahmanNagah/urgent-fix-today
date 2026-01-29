import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { TechnicianCard } from '@/components/TechnicianCard';
import { EmptyState } from '@/components/EmptyState';
import { getTechniciansByService } from '@/data/technicians';
import { useBooking } from '@/context/BookingContext';
import { Technician } from '@/types';
import { Droplets, Zap } from 'lucide-react';

const serviceLabels = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
};

const serviceIcons = {
  plumbing: Droplets,
  electrical: Zap,
};

const TechnicianList = () => {
  const { service } = useParams<{ service: 'plumbing' | 'electrical' }>();
  const navigate = useNavigate();
  const { setSelectedTechnician } = useBooking();

  if (!service || !['plumbing', 'electrical'].includes(service)) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Service not found" backPath="/" />
        <EmptyState
          title="Invalid Service"
          description="Please select a valid service from the home page."
          action={{ label: 'Go Home', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const technicians = getTechniciansByService(service as 'plumbing' | 'electrical');
  const Icon = serviceIcons[service as keyof typeof serviceIcons];

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    navigate(`/technician/${technician.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={serviceLabels[service as keyof typeof serviceLabels]}
        subtitle={`${technicians.length} technicians available today`}
        backPath="/"
      />

      <div className="container py-6">
        {/* Service indicator */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-secondary rounded-lg">
          <Icon className="w-5 h-5 text-accent" />
          <span className="text-sm text-foreground">
            Sorted by <span className="font-semibold">earliest arrival</span>
          </span>
        </div>

        {technicians.length > 0 ? (
          <div className="space-y-4">
            {technicians.map((technician, index) => (
              <div key={technician.id} style={{ animationDelay: `${index * 50}ms` }}>
                <TechnicianCard
                  technician={technician}
                  onClick={() => handleTechnicianSelect(technician)}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No technicians available today"
            description="All technicians are booked. Please try again later."
            action={{ label: 'Go Back', onClick: () => navigate('/') }}
          />
        )}
      </div>
    </div>
  );
};

export default TechnicianList;
