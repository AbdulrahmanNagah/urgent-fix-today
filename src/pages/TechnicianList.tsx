import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { TechnicianCard } from '@/components/TechnicianCard';
import { EmptyState } from '@/components/EmptyState';
import { getTechniciansByService } from '@/data/technicians';
import { useBooking } from '@/context/BookingContext';
import { Technician, ServiceType, Location } from '@/types';
import { Droplets, Zap, Hammer, Snowflake, MonitorPlay, PaintRoller, MapPin } from 'lucide-react';

const serviceLabels = {
  plumbing: 'سباكة',
  electrical: 'كهرباء',
  carpentry: 'نجارة',
  hvac: 'تكييف',
  appliances: 'أجهزة منزلية',
  painting: 'نقاشة',
};

const serviceIcons = {
  plumbing: Droplets,
  electrical: Zap,
  carpentry: Hammer,
  hvac: Snowflake,
  appliances: MonitorPlay,
  painting: PaintRoller,
};

const locations: { value: Location | 'all'; label: string }[] = [
  { value: 'all', label: 'كل المناطق' },
  { value: 'مدينة نصر', label: 'مدينة نصر' },
  { value: 'المعادي', label: 'المعادي' },
  { value: 'التجمع الخامس', label: 'التجمع الخامس' },
  { value: 'الشيخ زايد', label: 'الشيخ زايد' },
  { value: 'مصر الجديدة', label: 'مصر الجديدة' },
];

const TechnicianList = () => {
  const { service } = useParams<{ service: string }>();
  const navigate = useNavigate();
  const { setSelectedTechnician } = useBooking();
  const [selectedLocation, setSelectedLocation] = useState<Location | 'all'>('all');

  const validServices = ['plumbing', 'electrical', 'carpentry', 'hvac', 'appliances', 'painting'];

  if (!service || !validServices.includes(service)) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <PageHeader title="الخدمة مش موجودة" backPath="/" />
        <div className="container mt-10">
          <EmptyState
            title="خدمة غلط"
            description="لو سمحت اختار خدمة من الصفحة الرئيسية."
            action={{ label: 'الرئيسية', onClick: () => navigate('/') }}
          />
        </div>
      </div>
    );
  }

  const allTechnicians = getTechniciansByService(service as ServiceType);
  
  // Filter by location
  const technicians = selectedLocation === 'all' 
    ? allTechnicians 
    : allTechnicians.filter(t => t.location === selectedLocation);

  const Icon = serviceIcons[service as keyof typeof serviceIcons];

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    navigate(`/technician/${technician.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <PageHeader
        title={serviceLabels[service as keyof typeof serviceLabels]}
        subtitle={`${technicians.length} صنايعية متاحين`}
        backPath="/"
      />

      <div className="container py-8">
        <div className="w-full mx-auto">
          {/* Filter Section */}
          <div className="mb-6 p-4 bg-secondary rounded-[1.5rem] border-2 border-foreground shadow-[0_4px_0_hsl(355,65%,30%)]">
            <label className="flex items-center gap-2 justify-end text-sm font-bold text-foreground mb-2 flex-row-reverse">
              <MapPin className="w-5 h-5 text-primary" />
              تصفية بالمنطقة
            </label>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as Location | 'all')}
              className="w-full bg-background border-2 border-foreground text-foreground rounded-xl px-4 py-3 text-right font-bold appearance-none cursor-pointer"
              dir="rtl"
            >
              {locations.map(loc => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>

          {/* Service indicator */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-background rounded-[1.5rem] border-2 border-foreground shadow-[0_4px_0_hsl(355,65%,30%)] flex-row-reverse">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl border-2 border-foreground">
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-base text-foreground font-semibold">
              مترتبين حسب <span className="font-black text-primary">الأسرع</span>
            </span>
          </div>
        </div>

        {technicians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((technician, index) => (
              <div key={technician.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <TechnicianCard
                  technician={technician}
                  onClick={() => handleTechnicianSelect(technician)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 animate-fade-in max-w-lg mx-auto">
             <EmptyState
              title="مافيش صنايعية متاحين"
              description="كل الصنايعية في المنطقة دي محجوزين. جرب منطقة تانية."
              action={{ label: 'ارجع', onClick: () => navigate('/') }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianList;
