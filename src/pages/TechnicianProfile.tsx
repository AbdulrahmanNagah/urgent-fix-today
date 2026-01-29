import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Clock, Award, Briefcase, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StarRating } from '@/components/StarRating';
import { EmptyState } from '@/components/EmptyState';
import { getTechnicianById } from '@/data/technicians';
import { useBooking } from '@/context/BookingContext';

const experienceLabels = {
  junior: 'Junior Technician',
  mid: 'Mid-Level Technician',
  senior: 'Senior Technician',
};

const TechnicianProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedTechnician, selectedService } = useBooking();

  const technician = id ? getTechnicianById(id) : undefined;

  if (!technician) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Technician" backPath="/" />
        <EmptyState
          title="Profile unavailable"
          description="This technician profile could not be found."
          action={{ label: 'Browse Technicians', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const reliabilityStars = Math.round(technician.reliabilityScore / 20);

  const handleBookNow = () => {
    setSelectedTechnician(technician);
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Technician Profile"
        backPath={selectedService ? `/technicians/${selectedService}` : '/'}
      />

      {/* Profile Header */}
      <div className="container py-6">
        <div className="flex flex-col items-center text-center mb-6 animate-fade-in">
          <div className="relative mb-4">
            <img
              src={technician.photoUrl}
              alt={technician.name}
              className="w-28 h-28 rounded-2xl object-cover shadow-card"
            />
            {technician.verified && (
              <div className="absolute -bottom-2 -right-2 bg-success text-success-foreground rounded-full p-1.5 shadow-lg">
                <Shield className="w-4 h-4" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">{technician.name}</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {experienceLabels[technician.experienceLevel]}
          </p>

          {/* Reliability */}
          <div className="flex items-center gap-2">
            <StarRating rating={reliabilityStars} size="md" />
            <span className="text-sm font-semibold text-foreground">
              {technician.reliabilityScore}%
            </span>
            <span className="text-sm text-muted-foreground">reliable</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card-trust p-4 text-center">
            <Clock className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-0.5">Arriving Today</p>
            <p className="text-sm font-bold text-foreground">{technician.arrivalWindow}</p>
          </div>
          <div className="card-trust p-4 text-center">
            <Briefcase className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-0.5">Experience</p>
            <p className="text-sm font-bold text-foreground">{technician.yearsOfExperience} years</p>
          </div>
          <div className="card-trust p-4 text-center">
            <Award className="w-5 h-5 text-warning mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-0.5">Completed Jobs</p>
            <p className="text-sm font-bold text-foreground">{technician.completedJobs}</p>
          </div>
          <div className="card-trust p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-success mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-0.5">Verification</p>
            <p className="text-sm font-bold text-foreground">
              {technician.verified ? 'Verified' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Price Range */}
        <div className="card-trust p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Price Range</p>
              <p className="text-2xl font-bold text-foreground">
                {technician.priceRangeMin} - {technician.priceRangeMax}{' '}
                <span className="text-base font-medium text-muted-foreground">EGP</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                {technician.serviceType === 'plumbing' ? 'Plumbing' : 'Electrical'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Final price depends on job complexity. Payment after service completion.
          </p>
        </div>

        {/* Trust Signals */}
        {technician.verified && (
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Verified Technician</p>
                <p className="text-xs text-muted-foreground">
                  Identity verified • Background checked • Skills assessed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="container">
          <button
            onClick={handleBookNow}
            className="w-full btn-primary py-4 rounded-xl text-base font-semibold"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProfile;
