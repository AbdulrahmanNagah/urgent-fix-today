import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Clock, Award, Briefcase, CheckCircle2, MapPin, Star } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StarRating } from '@/components/StarRating';
import { EmptyState } from '@/components/EmptyState';
import { getTechnicianById } from '@/data/technicians';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';

const experienceLabels = {
  junior: 'صنايعي',
  mid: 'خبرة',
  senior: 'أسطى',
};

const TechnicianProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setSelectedTechnician, selectedService } = useBooking();
  const { user } = useAuth();

  const technician = id ? getTechnicianById(id) : undefined;

  if (!technician) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="صنايعي" backPath="/" />
        <div className="container mt-10">
          <EmptyState
            title="البروفايل مش موجود"
            description="مش لاقيين بيانات الصنايعي ده."
            action={{ label: 'شوف صنايعية تانيين', onClick: () => navigate('/') }}
          />
        </div>
      </div>
    );
  }

  const reliabilityStars = Math.round(technician.reliabilityScore / 20);

  const handleBookNow = () => {
    setSelectedTechnician(technician);
    navigate('/booking');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader
        title="بروفايل الصنايعي"
        backPath={selectedService ? `/technicians/${selectedService}` : '/'}
      />

      {/* Profile Header */}
      <div className="container py-8">
        <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
          <div className="relative mb-6">
            <img
              src={technician.photoUrl}
              alt={technician.name}
              className="w-32 h-32 rounded-[2rem] object-cover border-4 border-foreground shadow-[0_8px_0_hsl(355,65%,30%)]"
            />
            {technician.verified && (
              <div className="absolute -bottom-3 -left-3 bg-foreground text-background rounded-full p-2 border-2 border-background shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
            )}
          </div>
          <h2 className="text-3xl font-black text-foreground mb-2">{technician.name}</h2>
          <p className="text-lg font-bold text-primary mb-4">
            {experienceLabels[technician.experienceLevel]}
          </p>

          {/* Reliability */}
          <div className="flex items-center gap-2 flex-row-reverse">
            <StarRating rating={reliabilityStars} size="md" />
            <span className="text-lg font-black text-foreground">
              {technician.reliabilityScore}%
            </span>
            <span className="text-base font-semibold text-foreground/80">نسبة الثقة</span>
          </div>
        </div>

        {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-foreground/80 mb-1 flex-row-reverse">
                <Star className="w-4 h-4 text-primary" />
                <span className="font-bold">نسبة الثقة</span>
              </div>
              <p className="text-xl font-black text-foreground">{technician.reliabilityScore}%</p>
            </div>
            <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-foreground/80 mb-1 flex-row-reverse">
                <Award className="w-4 h-4 text-primary" />
                <span className="font-bold">شغلانة</span>
              </div>
              <p className="text-xl font-black text-foreground">{technician.completedJobs}</p>
            </div>
            <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-foreground/80 mb-1 flex-row-reverse">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-bold">ميعاد الوصول</span>
              </div>
              <p className="text-xl font-black text-foreground">{technician.arrivalWindow}</p>
            </div>
            <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-foreground/80 mb-1 flex-row-reverse">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-bold">المنطقة</span>
              </div>
              <p className="text-xl font-black text-foreground">{technician.location}</p>
            </div>
          </div>

        {/* Price Range */}
        <div className="bg-background rounded-[2rem] border-2 border-foreground p-6 mb-8 shadow-[0_6px_0_hsl(355,65%,30%)]">
          <div className="flex items-center justify-between flex-row-reverse mb-4">
            <div className="text-right">
              <p className="text-base font-bold text-foreground/80 mb-1">السعر المتوقع</p>
              <p className="text-3xl font-black text-primary">
                {technician.priceRangeMin} - {technician.priceRangeMax}{' '}
                <span className="text-xl font-bold text-foreground/80">جنيه</span>
              </p>
            </div>
            <div className="text-left">
              <span className="text-sm font-bold border-2 border-foreground text-foreground px-4 py-2 rounded-full bg-secondary">
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
              </span>
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground/70 text-right">
            السعر النهائي بيتحدد حسب الشغلانة. الدفع بعد ما الشغل يخلص.
          </p>
        </div>

        {/* Trust Signals */}
        {technician.verified && (
          <div className="bg-secondary rounded-[1.5rem] border-2 border-foreground p-5 shadow-[0_4px_0_hsl(355,65%,30%)]">
            <div className="flex items-start gap-4 flex-row-reverse">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl border-2 border-foreground">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground mb-1">صنايعي معتمد</p>
                <p className="text-sm font-semibold text-foreground/80">
                  البيانات متراجعة • الفيش والتشبيه سليم • المهارات متجربة
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      {user?.role !== 'technician' && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t-2 border-foreground p-4 z-50">
          <div className="container max-w-lg mx-auto">
            <button
              onClick={handleBookNow}
              className="w-full btn-primary py-4 text-xl"
            >
              احجز دلوقتي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianProfile;
