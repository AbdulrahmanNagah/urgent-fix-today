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
        <PageHeader title="التأكيد" showBack={false} />
        <div className="container mt-10">
          <EmptyState
            title="مفيش حجز"
            description="لسه ما عملتش حجز."
            action={{ label: 'احجز دلوقتي', onClick: () => navigate('/') }}
          />
        </div>
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
    <div className="min-h-screen bg-background pb-10">
      <PageHeader title="تم تأكيد الحجز" showBack={false} />

      <div className="container py-8 max-w-lg mx-auto">
        {/* Success Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex p-5 rounded-[2rem] bg-success border-4 border-foreground shadow-[0_8px_0_hsl(355,65%,30%)] mb-6">
            <CheckCircle2 className="w-16 h-16 text-background" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-3">
            تم تأكيد الصنايعي!
          </h2>
          <p className="text-lg font-semibold text-foreground/80">
            هيوصل النهارده في ميعاده.
          </p>
        </div>

        {/* Booking Reference */}
        <div
          className="bg-secondary rounded-[1.5rem] border-2 border-foreground p-5 mb-6 shadow-[0_4px_0_hsl(355,65%,30%)] animate-fade-in text-right"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between flex-row-reverse">
            <div>
              <p className="text-sm font-bold text-foreground/80 mb-1">رقم الحجز</p>
              <p className="text-2xl font-black text-primary font-mono">{currentBooking.id}</p>
            </div>
            <button
              onClick={handleCopyRef}
              className="p-3 rounded-xl bg-background border-2 border-foreground hover:bg-secondary transition-colors"
            >
              {copied ? (
                <Check className="w-6 h-6 text-success" />
              ) : (
                <Copy className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Technician Info */}
        {technician && (
          <div
            className="bg-background rounded-[1.5rem] border-2 border-foreground p-5 mb-6 shadow-[0_4px_0_hsl(355,65%,30%)] animate-fade-in"
            style={{ animationDelay: '150ms' }}
          >
            <div className="flex items-center gap-4 flex-row-reverse">
              <img
                src={technician.photoUrl}
                alt={technician.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-foreground"
              />
              <div className="flex-1 text-right">
                <h3 className="text-xl font-black text-foreground">{technician.name}</h3>
                <p className="text-base font-bold text-foreground/80">
                  {
                    {
                      plumbing: 'سباكة',
                      electrical: 'كهرباء',
                      carpentry: 'نجارة',
                      hvac: 'تكييف',
                      appliances: 'أجهزة منزلية',
                      painting: 'نقاشة',
                    }[technician.serviceType] || technician.serviceType
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Details */}
        <div
          className="bg-background rounded-[2rem] border-2 border-foreground p-6 mb-8 shadow-[0_6px_0_hsl(355,65%,30%)] animate-fade-in text-right"
          style={{ animationDelay: '200ms' }}
        >
          <h3 className="text-2xl font-black text-foreground mb-6">تفاصيل الحجز</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 flex-row-reverse">
              <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-foreground/80">ميعاد الوصول</p>
                <p className="text-base font-black text-foreground">
                  النهارده، {currentBooking.arrivalWindow}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 flex-row-reverse">
              <User className="w-6 h-6 text-foreground/80 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-foreground/80">الاسم</p>
                <p className="text-base font-black text-foreground">{currentBooking.userName}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 flex-row-reverse">
              <Phone className="w-6 h-6 text-foreground/80 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-foreground/80">رقم التليفون</p>
                <p className="text-base font-black text-foreground" dir="ltr">{currentBooking.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 flex-row-reverse">
              <MapPin className="w-6 h-6 text-foreground/80 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm font-bold text-foreground/80">العنوان</p>
                <p className="text-base font-black text-foreground">{currentBooking.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Reminder */}
        {technician && (
          <div
            className="bg-primary/10 border-2 border-primary rounded-2xl p-5 mb-8 animate-fade-in text-right"
            style={{ animationDelay: '250ms' }}
          >
            <div className="flex items-center justify-between flex-row-reverse">
              <p className="text-base font-bold text-foreground">السعر المتوقع</p>
              <p className="text-2xl font-black text-primary">
                {technician.priceRangeMin} - {technician.priceRangeMax} جنيه
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground/80 mt-2">
              الدفع هيكون مع الصنايعي بعد ما يخلص
            </p>
          </div>
        )}

        {/* Actions */}
        <div
          className="space-y-4 animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          <button
            onClick={handleLeaveFeedback}
            className="w-full btn-primary py-4 text-xl"
          >
            سيب تقييم بعد الشغل
          </button>
          <button
            onClick={handleBookAnother}
            className="w-full btn-secondary py-4 text-xl"
          >
            احجز صنايعي تاني
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
