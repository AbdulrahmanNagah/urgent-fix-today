import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, User, Phone, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { useBooking } from '@/context/BookingContext';
import { getTechnicianById } from '@/data/technicians';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { currentBooking } = useBooking();
  const [copied, setCopied] = useState(false);

  if (!currentBooking) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Confirmation" showBack={false} />
        <EmptyState
          title="No booking found"
          description="You haven't made a booking yet."
          action={{ label: 'Book Now', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const technician = getTechnicianById(currentBooking.technicianId);

  const handleCopyRef = async () => {
    await navigator.clipboard.writeText(currentBooking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveFeedback = () => {
    navigate('/feedback');
  };

  const handleBookAnother = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <PageHeader title="Booking Confirmed" showBack={false} />

      <div className="container py-6">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex p-4 rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Your technician is confirmed!
          </h2>
          <p className="text-sm text-muted-foreground">
            They will arrive today as scheduled.
          </p>
        </div>

        {/* Booking Reference */}
        <div
          className="card-trust p-4 mb-4 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Booking Reference</p>
              <p className="text-lg font-bold text-foreground font-mono">{currentBooking.id}</p>
            </div>
            <button
              onClick={handleCopyRef}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Copy className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Technician Info */}
        {technician && (
          <div
            className="card-trust p-4 mb-4 animate-fade-in"
            style={{ animationDelay: '150ms' }}
          >
            <div className="flex items-center gap-4">
              <img
                src={technician.photoUrl}
                alt={technician.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{technician.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {technician.serviceType}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div
          className="card-trust p-4 mb-6 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          <h3 className="font-semibold text-foreground mb-4">Booking Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Arrival Window</p>
                <p className="text-sm font-medium text-foreground">
                  Today, {currentBooking.arrivalWindow}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium text-foreground">{currentBooking.userName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">{currentBooking.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">{currentBooking.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Reminder */}
        {technician && (
          <div
            className="bg-secondary rounded-lg p-4 mb-6 animate-fade-in"
            style={{ animationDelay: '250ms' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">Estimated Price</p>
              <p className="text-lg font-bold text-foreground">
                {technician.priceRangeMin} - {technician.priceRangeMax} EGP
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Pay directly to technician after service
            </p>
          </div>
        )}

        {/* Actions */}
        <div
          className="space-y-3 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <button
            onClick={handleLeaveFeedback}
            className="w-full btn-primary py-4 rounded-xl text-base font-semibold"
          >
            Leave Feedback After Service
          </button>
          <button
            onClick={handleBookAnother}
            className="w-full btn-secondary py-4 rounded-xl text-base font-semibold"
          >
            Book Another Technician
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
