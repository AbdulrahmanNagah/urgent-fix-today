import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Clock, User, Phone, MapPin, FileText, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { useBooking } from '@/context/BookingContext';
import { BookingRequest } from '@/types';

// Egyptian phone regex: starts with 01, followed by 0/1/2/5, then 8 digits
const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

const bookingSchema = z.object({
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(egyptianPhoneRegex, 'Enter a valid Egyptian phone number (e.g., 01012345678)'),
  address: z.string().min(5, 'Please enter your full address'),
  problemDescription: z.string().min(10, 'Please describe your problem in at least 10 characters'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;

const BookingPage = () => {
  const navigate = useNavigate();
  const { selectedTechnician, selectedService, addBooking, setCurrentBooking } = useBooking();

  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    address: '',
    problemDescription: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedTechnician) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Book Technician" backPath="/" />
        <EmptyState
          title="No technician selected"
          description="Please select a technician first."
          action={{ label: 'Browse Technicians', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Create booking
    const booking: BookingRequest = {
      id: `BK-${Date.now()}`,
      technicianId: selectedTechnician.id,
      userName: formData.userName,
      phone: formData.phone,
      address: formData.address,
      problemDescription: formData.problemDescription,
      selectedService: selectedService || selectedTechnician.serviceType,
      status: 'confirmed',
      createdAt: new Date(),
      arrivalWindow: selectedTechnician.arrivalWindow,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    addBooking(booking);
    setCurrentBooking(booking);
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <PageHeader
        title="Book Technician"
        subtitle="Complete your booking"
        backPath={`/technician/${selectedTechnician.id}`}
      />

      <div className="container py-6">
        {/* Technician Summary */}
        <div className="card-trust p-4 mb-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <img
              src={selectedTechnician.photoUrl}
              alt={selectedTechnician.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{selectedTechnician.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-accent" />
                <span>{selectedTechnician.arrivalWindow}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">
                {selectedTechnician.priceRangeMin}-{selectedTechnician.priceRangeMax}
              </p>
              <p className="text-xs text-muted-foreground">EGP</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Your Name
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              placeholder="Enter your full name"
              className={`input-field w-full ${errors.userName ? 'border-destructive ring-1 ring-destructive' : ''}`}
            />
            {errors.userName && (
              <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.userName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="01012345678"
              className={`input-field w-full ${errors.phone ? 'border-destructive ring-1 ring-destructive' : ''}`}
            />
            {errors.phone && (
              <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Building number, street, area, city"
              className={`input-field w-full ${errors.address ? 'border-destructive ring-1 ring-destructive' : ''}`}
            />
            {errors.address && (
              <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Problem Description */}
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Problem Description
            </label>
            <textarea
              value={formData.problemDescription}
              onChange={(e) => handleChange('problemDescription', e.target.value)}
              placeholder="Describe your issue (e.g., Leaking pipe under kitchen sink, water dripping for 2 days)"
              rows={3}
              className={`input-field w-full resize-none ${errors.problemDescription ? 'border-destructive ring-1 ring-destructive' : ''}`}
            />
            {errors.problemDescription && (
              <p className="flex items-center gap-1 text-xs text-destructive mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.problemDescription}
              </p>
            )}
          </div>

          {/* Payment Notice */}
          <div
            className="bg-secondary rounded-lg p-4 animate-fade-in"
            style={{ animationDelay: '250ms' }}
          >
            <p className="text-sm text-foreground font-medium mb-1">Payment after service</p>
            <p className="text-xs text-muted-foreground">
              Payment will be made directly to the technician after service completion.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 rounded-xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
