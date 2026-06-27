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
  userName: z.string().min(2, 'الاسم لازم يكون أكتر من حرفين'),
  phone: z.string().regex(egyptianPhoneRegex, 'اكتب رقم مصري صح (زي 01012345678)'),
  address: z.string().min(5, 'لو سمحت اكتب العنوان بالتفصيل'),
  problemDescription: z.string().min(10, 'اشرح المشكلة بالتفصيل شوية (أكتر من 10 حروف)'),
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
        <PageHeader title="احجز الصنايعي" backPath="/" />
        <div className="container mt-10">
          <EmptyState
            title="مفيش صنايعي متحدد"
            description="لو سمحت اختار صنايعي الأول."
            action={{ label: 'شوف الصنايعية', onClick: () => navigate('/') }}
          />
        </div>
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
    <div className="min-h-screen bg-background pb-10">
      <PageHeader
        title="احجز الصنايعي"
        subtitle="كمل بيانات الحجز"
        backPath={`/technician/${selectedTechnician.id}`}
      />

      <div className="container py-8 max-w-lg mx-auto">
        {/* Technician Summary */}
        <div className="bg-secondary rounded-[1.5rem] border-2 border-foreground p-4 mb-8 shadow-[0_4px_0_hsl(355,65%,30%)] animate-fade-in">
          <div className="flex items-center gap-4 flex-row-reverse">
            <img
              src={selectedTechnician.photoUrl}
              alt={selectedTechnician.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-foreground"
            />
            <div className="flex-1 text-right">
              <h3 className="text-xl font-black text-foreground mb-1">{selectedTechnician.name}</h3>
              <div className="flex items-center gap-2 text-sm text-foreground/80 flex-row-reverse justify-start">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-bold">{selectedTechnician.arrivalWindow}</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-lg font-black text-primary">
                {selectedTechnician.priceRangeMin}-{selectedTechnician.priceRangeMax}
              </p>
              <p className="text-sm font-bold text-foreground/80">جنيه</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="animate-fade-in text-right" style={{ animationDelay: '50ms' }}>
            <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
              <User className="w-5 h-5 text-primary" />
              اسمك
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => handleChange('userName', e.target.value)}
              placeholder="اكتب اسمك بالكامل"
              className={`input-field w-full text-right ${errors.userName ? 'border-destructive ring-destructive' : ''}`}
              dir="rtl"
            />
            {errors.userName && (
              <p className="flex items-center gap-1 justify-end text-sm font-bold text-destructive mt-2 flex-row-reverse">
                <AlertCircle className="w-4 h-4" />
                {errors.userName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="animate-fade-in text-right" style={{ animationDelay: '100ms' }}>
            <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
              <Phone className="w-5 h-5 text-primary" />
              رقم التليفون
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="01012345678"
              className={`input-field w-full text-right ${errors.phone ? 'border-destructive ring-destructive' : ''}`}
              dir="ltr"
            />
            {errors.phone && (
              <p className="flex items-center gap-1 justify-end text-sm font-bold text-destructive mt-2 flex-row-reverse">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="animate-fade-in text-right" style={{ animationDelay: '150ms' }}>
            <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
              <MapPin className="w-5 h-5 text-primary" />
              العنوان
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="رقم العمارة، الشارع، المنطقة، المحافظة"
              className={`input-field w-full text-right ${errors.address ? 'border-destructive ring-destructive' : ''}`}
              dir="rtl"
            />
            {errors.address && (
              <p className="flex items-center gap-1 justify-end text-sm font-bold text-destructive mt-2 flex-row-reverse">
                <AlertCircle className="w-4 h-4" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Problem Description */}
          <div className="animate-fade-in text-right" style={{ animationDelay: '200ms' }}>
            <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
              <FileText className="w-5 h-5 text-primary" />
              وصف المشكلة
            </label>
            <textarea
              value={formData.problemDescription}
              onChange={(e) => handleChange('problemDescription', e.target.value)}
              placeholder="اشرح المشكلة (مثلا: الحوض بينقط بقاله يومين، فيشة محروقة)"
              rows={3}
              className={`input-field w-full resize-none rounded-3xl text-right ${errors.problemDescription ? 'border-destructive ring-destructive' : ''}`}
              dir="rtl"
            />
            {errors.problemDescription && (
              <p className="flex items-center gap-1 justify-end text-sm font-bold text-destructive mt-2 flex-row-reverse">
                <AlertCircle className="w-4 h-4" />
                {errors.problemDescription}
              </p>
            )}
          </div>

          {/* Payment Notice */}
          <div
            className="bg-primary/10 border-2 border-primary rounded-2xl p-5 text-right animate-fade-in"
            style={{ animationDelay: '250ms' }}
          >
            <p className="text-lg text-foreground font-black mb-1">الدفع بعد الشغل</p>
            <p className="text-sm font-semibold text-foreground/80">
              المحاسبة هتكون مع الصنايعي بعد ما يخلص الشغل.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-4 text-xl mt-4 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            {isSubmitting ? 'بيأكد الحجز...' : 'أكد الحجز'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
