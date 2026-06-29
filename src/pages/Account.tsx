import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  User as UserIcon,
  Phone,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  LogOut,
  HeartHandshake,
  AlertCircle,
  Shield,
  Activity,
  Check,
  X,
  Briefcase,
  FileText,
  DollarSign
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { StarRating } from '@/components/StarRating';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import {
  getTechnicianById,
  getUnverifiedTechnicians,
  verifyTechnician,
  rejectTechnician,
  getLocalStorageTechnicians
} from '@/data/technicians';
import { Location, BookingStatus, BookingRequest, ServiceType, ExperienceLevel, Technician, User } from '@/types';
import { toast } from 'sonner';

const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

const customerProfileSchema = z.object({
  name: z.string().min(2, 'الاسم لازم يكون أكتر من حرفين'),
  phone: z.string().regex(egyptianPhoneRegex, 'اكتب رقم مصري صح (زي 01012345678)'),
  address: z.string().min(5, 'لو سمحت اكتب العنوان بالتفصيل'),
  location: z.enum(['مدينة نصر', 'المعادي', 'التجمع الخامس', 'الشيخ زايد', 'مصر الجديدة'] as const, {
    errorMap: () => ({ message: 'اختار المنطقة من القائمة' }),
  }),
});

const technicianProfileSchema = z.object({
  name: z.string().min(2, 'الاسم لازم يكون أكتر من حرفين'),
  phone: z.string().regex(egyptianPhoneRegex, 'اكتب رقم مصري صح (زي 01012345678)'),
  location: z.enum(['مدينة نصر', 'المعادي', 'التجمع الخامس', 'الشيخ زايد', 'مصر الجديدة'] as const, {
    errorMap: () => ({ message: 'اختار المنطقة من القائمة' }),
  }),
  serviceType: z.enum(['plumbing', 'electrical', 'carpentry', 'hvac', 'appliances', 'painting'] as const, {
    errorMap: () => ({ message: 'اختار التخصص من القائمة' }),
  }),
  experienceLevel: z.enum(['junior', 'mid', 'senior'] as const, {
    errorMap: () => ({ message: 'اختار مستوى الخبرة' }),
  }),
  yearsOfExperience: z.number().min(1, 'سنين الخبرة لازم تكون سنة أو أكتر'),
  priceRangeMin: z.number().min(50, 'الحد الأدنى للمعاينة 50 جنيه'),
  priceRangeMax: z.number().min(100, 'الحد الأقصى للمعاينة 100 جنيه'),
});

const serviceLabels: Record<string, string> = {
  plumbing: 'سباكة',
  electrical: 'كهرباء',
  carpentry: 'نجارة',
  hvac: 'تكييف',
  appliances: 'أجهزة منزلية',
  painting: 'نقاشة',
};

const experienceLabels: Record<string, string> = {
  junior: 'صنايعي (مبتدئ)',
  mid: 'خبرة (متوسط)',
  senior: 'أسطى (محترف)',
};

const locations: Location[] = ['مدينة نصر', 'المعادي', 'التجمع الخامس', 'الشيخ زايد', 'مصر الجديدة'];

const ALL_HOURS_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
  '6:00 PM - 8:00 PM',
];

const hourSlotLabels: Record<string, string> = {
  '10:00 AM - 12:00 PM': '10:00 ص - 12:00 م',
  '12:00 PM - 2:00 PM': '12:00 م - 02:00 م',
  '2:00 PM - 4:00 PM': '02:00 م - 04:00 م',
  '4:00 PM - 6:00 PM': '04:00 م - 06:00 م',
  '6:00 PM - 8:00 PM': '06:00 م - 08:00 م',
};

const Account = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isLoading: authLoading } = useAuth();
  const { bookings, feedbacks, updateBookingStatus, setCurrentBooking } = useBooking();

  const [activeTab, setActiveTab] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Admin states
  const [pendingTechs, setPendingTechs] = useState<Technician[]>([]);
  const [platformStats, setPlatformStats] = useState({
    customers: 0,
    activeTechs: 0,
    pendingTechs: 0,
    totalBookings: 0,
  });

  // Customer Profile form state
  const [customerProfileData, setCustomerProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    location: '' as Location | '',
  });

  // Technician profile & availability states
  const [techProfileData, setTechProfileData] = useState({
    name: '',
    phone: '',
    location: '' as Location | '',
    serviceType: '' as ServiceType | '',
    experienceLevel: '' as ExperienceLevel | '',
    yearsOfExperience: 5,
    priceRangeMin: 150,
    priceRangeMax: 400,
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [techRecord, setTechRecord] = useState<Technician | null>(null);

  // Sync user details to forms when logged in
  useEffect(() => {
    if (user) {
      // Set default tab based on role if not set
      if (!activeTab) {
        if (user.role === 'admin') {
          setActiveTab('pending');
        } else if (user.role === 'technician') {
          setActiveTab('tech-bookings');
        } else {
          setActiveTab('bookings');
        }
      }

      if (user.role === 'customer') {
        setCustomerProfileData({
          name: user.name,
          phone: user.phone,
          address: user.address || '',
          location: user.location,
        });
      } else if (user.role === 'technician' && user.technicianId) {
        const tech = getTechnicianById(user.technicianId);
        if (tech) {
          setTechRecord(tech);
          setTechProfileData({
            name: tech.name,
            phone: tech.phone || user.phone,
            location: tech.location,
            serviceType: tech.serviceType,
            experienceLevel: tech.experienceLevel,
            yearsOfExperience: tech.yearsOfExperience,
            priceRangeMin: tech.priceRangeMin,
            priceRangeMax: tech.priceRangeMax,
          });
          setAvailableSlots(tech.availableHours || []);
        }
      } else if (user.role === 'admin') {
        loadAdminData();
      }
    }
  }, [user, activeTab]);

  const loadAdminData = () => {
    // Load pending technicians
    const unverified = getUnverifiedTechnicians();
    setPendingTechs(unverified);

    // Calculate statistics
    const registered = localStorage.getItem('sanay3i_registered_users');
    const registeredList: User[] = registered ? JSON.parse(registered) : [];
    const custCount = registeredList.filter((u) => u.role === 'customer').length + 2; // +2 for demo customers

    const techs = getLocalStorageTechnicians();
    const activeTechCount = techs.filter((t) => t.verified).length;
    const pendingTechCount = techs.filter((t) => !t.verified).length;

    setPlatformStats({
      customers: custCount,
      activeTechs: activeTechCount,
      pendingTechs: pendingTechCount,
      totalBookings: bookings.length,
    });
  };

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/account' } });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center font-bold text-lg text-foreground animate-pulse">
          جاري تحميل بيانات الحساب...
        </div>
      </div>
    );
  }

  // Filter bookings for customer & technician
  const customerBookings = bookings
    .filter((b) => b.userId === user.id || b.phone === user.phone)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const technicianBookings = bookings
    .filter((b) => b.technicianId === user.technicianId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Customer submit profile modification
  const handleCustomerProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsUpdating(true);

    const result = customerProfileSchema.safeParse(customerProfileData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errs[err.path[0] as string] = err.message;
      });
      setErrors(errs);
      setIsUpdating(false);
      return;
    }

    const res = await updateProfile(
      customerProfileData.name,
      customerProfileData.phone,
      customerProfileData.address,
      customerProfileData.location as Location
    );

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
      setErrors({ general: res.message });
    }
    setIsUpdating(false);
  };

  // Technician submit profile modification
  const handleTechnicianProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsUpdating(true);

    const result = technicianProfileSchema.safeParse(techProfileData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errs[err.path[0] as string] = err.message;
      });
      setErrors(errs);
      setIsUpdating(false);
      return;
    }

    const res = await updateProfile(
      techProfileData.name,
      techProfileData.phone,
      '',
      techProfileData.location as Location,
      {
        priceRangeMin: techProfileData.priceRangeMin,
        priceRangeMax: techProfileData.priceRangeMax,
        yearsOfExperience: techProfileData.yearsOfExperience,
        serviceType: techProfileData.serviceType as ServiceType,
        experienceLevel: techProfileData.experienceLevel as ExperienceLevel,
        availableHours: availableSlots,
      }
    );

    if (res.success) {
      toast.success(res.message);
      // Refresh tech record locally
      if (user.technicianId) {
        const tech = getTechnicianById(user.technicianId);
        if (tech) setTechRecord(tech);
      }
    } else {
      toast.error(res.message);
      setErrors({ general: res.message });
    }
    setIsUpdating(false);
  };

  // Technician save availability hours
  const handleSaveAvailability = async () => {
    if (!user.technicianId || !techRecord) return;
    setIsUpdating(true);

    const res = await updateProfile(
      techProfileData.name,
      techProfileData.phone,
      '',
      techProfileData.location as Location,
      {
        priceRangeMin: techProfileData.priceRangeMin,
        priceRangeMax: techProfileData.priceRangeMax,
        yearsOfExperience: techProfileData.yearsOfExperience,
        serviceType: techProfileData.serviceType as ServiceType,
        experienceLevel: techProfileData.experienceLevel as ExperienceLevel,
        availableHours: availableSlots,
      }
    );

    if (res.success) {
      toast.success('تم تحديث مواعيد العمل المتاحة بنجاح!');
      const tech = getTechnicianById(user.technicianId);
      if (tech) setTechRecord(tech);
    } else {
      toast.error(res.message);
    }
    setIsUpdating(false);
  };

  const handleToggleSlot = (slot: string) => {
    setAvailableSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  // Admin verify technician request
  const handleApproveTechnician = (techId: string) => {
    const success = verifyTechnician(techId);
    if (success) {
      toast.success('تم تفعيل وتوثيق حساب الصنايعي بنجاح!');
      loadAdminData();
    } else {
      toast.error('حدث خطأ أثناء التفعيل.');
    }
  };

  // Admin reject technician request
  const handleRejectTechnician = (techId: string) => {
    if (window.confirm('هل أنت متأكد من رفض هذا الطلب؟ سيتم مسح بيانات الصنايعي نهائياً.')) {
      const success = rejectTechnician(techId);
      if (success) {
        toast.info('تم رفض طلب التفعيل وحذف الصنايعي.');
        loadAdminData();
      } else {
        toast.error('حدث خطأ أثناء رفض الطلب.');
      }
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
      updateBookingStatus(bookingId, 'cancelled');
      toast.success('تم إلغاء الحجز بنجاح');
    }
  };

  const handleCompleteBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
    toast.success('مبروك! تم إتمام العمل بنجاح.');
  };

  const handleConfirmBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    toast.success('تم تأكيد الحجز بنجاح!');
  };

  const handleLeaveFeedback = (booking: BookingRequest) => {
    setCurrentBooking(booking);
    navigate('/feedback');
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 border-2 border-yellow-800 font-black px-3 py-1 rounded-full text-xs">
            في الانتظار
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border-2 border-blue-800 font-black px-3 py-1 rounded-full text-xs">
            مؤكد
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border-2 border-green-800 font-black px-3 py-1 rounded-full text-xs">
            مكتمل <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border-2 border-red-800 font-black px-3 py-1 rounded-full text-xs">
            ملغي <XCircle className="w-3.5 h-3.5" />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <PageHeader
        title={user.role === 'admin' ? 'لوحة تحكم المسؤول' : 'حسابي الشخصي'}
        subtitle={`مرحباً بك، ${user.name}`}
        backPath="/"
      />

      <div className="container py-8 max-w-lg mx-auto">
        {/* Profile Card Header */}
        <div className="bg-primary text-primary-foreground rounded-[2rem] border-4 border-foreground p-6 mb-8 shadow-[0_8px_0_hsl(355,65%,30%)] flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-[1.5rem] bg-secondary border-2 border-foreground flex items-center justify-center text-primary mb-4 shadow-[0_4px_0_hsl(355,80%,20%)]">
            {user.role === 'admin' ? (
              <Shield className="w-12 h-12 text-primary" />
            ) : (
              <UserIcon className="w-12 h-12" />
            )}
          </div>
          <h2 className="text-3xl font-black">{user.name}</h2>
          <p className="text-sm font-bold opacity-90 font-mono mt-1 text-center" dir="ltr">
            {user.phone}
          </p>
          <div className="flex items-center gap-2 mt-3 bg-foreground/20 px-3 py-1 rounded-full border border-primary-foreground/30 flex-row-reverse text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>
              {user.role === 'admin'
                ? 'لوحة التحكم العامة للمنصة'
                : `${user.location} - ${user.role === 'technician' ? 'حساب صنايعي' : 'حساب عميل'}`}
            </span>
          </div>
        </div>

        {/* ----------------- RENDER ADMIN VIEW ----------------- */}
        {user.role === 'admin' && (
          <>
            {/* Admin Tabs */}
            <div className="flex border-4 border-foreground rounded-2xl overflow-hidden mb-8 shadow-[0_4px_0_hsl(355,65%,30%)] bg-secondary">
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 py-4 text-lg font-black transition-all flex items-center justify-center gap-2 flex-row-reverse ${
                  activeTab === 'pending'
                    ? 'bg-primary text-primary-foreground border-l-4 border-foreground'
                    : 'text-foreground hover:bg-background/50'
                }`}
              >
                طلبات التفعيل
                <span className="bg-foreground text-background text-xs font-black px-2 py-0.5 rounded-full border border-foreground">
                  {pendingTechs.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-4 text-lg font-black transition-all ${
                  activeTab === 'stats'
                    ? 'bg-primary text-primary-foreground border-r-4 border-foreground'
                    : 'text-foreground hover:bg-background/50'
                }`}
              >
                إحصائيات المنصة
              </button>
            </div>

            {/* Tab content: Pending Verification List */}
            {activeTab === 'pending' && (
              <div className="space-y-6">
                {pendingTechs.length > 0 ? (
                  pendingTechs.map((tech) => (
                    <div
                      key={tech.id}
                      className="bg-background rounded-[1.8rem] border-2 border-foreground p-5 shadow-[0_4px_0_hsl(355,65%,30%)] text-right animate-fade-in"
                    >
                      {/* Tech Info */}
                      <div className="flex items-center gap-4 flex-row-reverse mb-4 border-b-2 border-foreground/10 pb-4">
                        <img
                          src={tech.photoUrl}
                          alt={tech.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-foreground shadow-[0_2px_0_foreground]"
                        />
                        <div className="flex-1">
                          <h4 className="text-xl font-black text-foreground">{tech.name}</h4>
                          <div className="flex items-center justify-end gap-3 flex-wrap mt-1">
                            <span className="bg-secondary text-foreground text-xs font-black border border-foreground px-2.5 py-0.5 rounded-md">
                              {serviceLabels[tech.serviceType] || tech.serviceType}
                            </span>
                            <span className="bg-primary/10 text-primary text-xs font-black border border-primary px-2.5 py-0.5 rounded-md">
                              {experienceLabels[tech.experienceLevel] || tech.experienceLevel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Doc Details */}
                      <div className="bg-secondary/40 border-2 border-foreground/15 rounded-2xl p-4 mb-5 space-y-3 text-sm text-foreground/90 font-semibold text-right">
                        <div className="flex items-center justify-between flex-row-reverse">
                          <span className="text-foreground/75 font-bold">الهاتف الموثق:</span>
                          <span className="font-mono font-black" dir="ltr">
                            {tech.phone || 'غير مسجل'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse">
                          <span className="text-foreground/75 font-bold">المنطقة الجغرافية:</span>
                          <span className="font-black">{tech.location}</span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse">
                          <span className="text-foreground/75 font-bold">سعر المعاينة التقريبي:</span>
                          <span className="font-black text-primary">
                            {tech.priceRangeMin} - {tech.priceRangeMax} جنيه
                          </span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse border-t border-foreground/10 pt-2">
                          <span className="text-foreground/75 font-bold">الرقم القومي (14 رقم):</span>
                          <span className="font-mono font-black tracking-wider" dir="ltr">
                            {tech.nationalId || 'غير متوفر'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between flex-row-reverse">
                          <span className="text-foreground/75 font-bold">رقم صحيفة الحالة الجنائية:</span>
                          <span className="font-mono font-black tracking-wider" dir="ltr">
                            {tech.criminalRecordNumber || 'غير متوفر'}
                          </span>
                        </div>
                      </div>

                      {/* Mock Documents Attachments Showcase */}
                      <div className="space-y-4 mb-6">
                        <p className="text-xs font-black text-foreground/60 border-b border-foreground/10 pb-1">
                          معاينة المستندات المرفوعة (توليد تلقائي):
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                          {/* National ID Mock Card */}
                          <div className="bg-[#f0ece9] border-2 border-foreground p-3 rounded-2xl shadow-[0_2px_0_foreground] relative overflow-hidden text-right">
                            <div className="absolute top-0 right-0 bg-[#c0392b] text-white text-[8px] px-2 py-0.5 border-b border-l border-foreground font-black">
                              بطاقة رقم قومي - معاينة
                            </div>
                            <div className="flex gap-3 mt-3 items-center flex-row-reverse">
                              <div className="w-10 h-10 border border-foreground bg-gray-300 rounded flex items-center justify-center flex-shrink-0">
                                <UserIcon className="w-6 h-6 text-foreground/50" />
                              </div>
                              <div className="flex-1 text-xs">
                                <p className="font-black text-foreground text-[10px]">جمهورية مصر العربية</p>
                                <p className="font-bold text-foreground/80 mt-1">{tech.name}</p>
                                <p className="font-mono font-bold tracking-tight text-primary mt-1 text-[10px]" dir="ltr">
                                  {tech.nationalId}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Criminal Record Certification Certificate */}
                          <div className="bg-[#fcf8f2] border-2 border-foreground p-3 rounded-2xl shadow-[0_2px_0_foreground] relative overflow-hidden text-right">
                            <div className="absolute top-0 right-0 bg-success text-success-foreground text-[8px] px-2 py-0.5 border-b border-l border-foreground font-black">
                              صحيفة جنائية - فيش موثق
                            </div>
                            <div className="mt-3 text-xs">
                              <p className="font-black text-foreground text-[10px]">وزارة الداخلية - قطاع مصلحة الأمن العام</p>
                              <p className="font-bold text-foreground/80 mt-1">لا يوجد أحكام جنائية مسجلة</p>
                              <div className="flex items-center justify-between mt-2 flex-row-reverse">
                                <span className="font-mono text-[9px] text-foreground/60" dir="ltr">
                                  رقم الفيش: {tech.criminalRecordNumber}
                                </span>
                                <span className="inline-flex items-center text-[9px] text-success font-black border border-success px-1.5 py-0.5 rounded bg-success/10 rotate-[-4deg]">
                                  ختم النسر - صالح للعمل
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Approval Controls */}
                      <div className="flex gap-2 flex-row-reverse">
                        <button
                          onClick={() => handleApproveTechnician(tech.id)}
                          className="flex-1 bg-success text-success-foreground hover:bg-success/90 font-black border-2 border-foreground py-2.5 px-3 rounded-xl transition-all shadow-[0_2px_0_foreground] hover:translate-y-[1px] hover:shadow-none text-center text-sm flex items-center justify-center gap-1 flex-row-reverse"
                        >
                          <Check className="w-4 h-4" />
                          موافقة وتفعيل الحساب
                        </button>
                        <button
                          onClick={() => handleRejectTechnician(tech.id)}
                          className="bg-destructive/10 text-destructive hover:bg-destructive/20 font-black border-2 border-destructive py-2.5 px-4 rounded-xl transition-all text-center text-sm flex items-center justify-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          رفض الطلب
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="مفيش طلبات معلقة"
                    description="كل الصنايعية المسجلين متفعلين وموثقين بالفعل."
                  />
                )}
              </div>
            )}

            {/* Tab content: Stats View */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center shadow-[0_4px_0_foreground]">
                  <p className="text-3xl font-black text-primary">{platformStats.customers}</p>
                  <p className="text-xs font-black text-foreground/80 mt-1">الزبائن المسجلين</p>
                </div>
                <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center shadow-[0_4px_0_foreground]">
                  <p className="text-3xl font-black text-success">{platformStats.activeTechs}</p>
                  <p className="text-xs font-black text-foreground/80 mt-1">صنايعية مفعلين وموثقين</p>
                </div>
                <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center shadow-[0_4px_0_foreground]">
                  <p className="text-3xl font-black text-yellow-600">{platformStats.pendingTechs}</p>
                  <p className="text-xs font-black text-foreground/80 mt-1">طلبات في انتظار التفعيل</p>
                </div>
                <div className="bg-background rounded-2xl border-2 border-foreground p-4 text-center shadow-[0_4px_0_foreground]">
                  <p className="text-3xl font-black text-blue-600">{platformStats.totalBookings}</p>
                  <p className="text-xs font-black text-foreground/80 mt-1">إجمالي الحجوزات</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ----------------- RENDER TECHNICIAN VIEW ----------------- */}
        {user.role === 'technician' && techRecord && (
          <>
            {/* Unverified Warning Alert */}
            {!techRecord.verified ? (
              <div className="bg-[#fef9c3] text-[#854d0e] border-4 border-foreground rounded-[1.8rem] p-6 mb-8 shadow-[0_6px_0_foreground] text-right animate-fade-in flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-[#a16207] mb-2" />
                <h3 className="text-2xl font-black">حسابك قيد المراجعة</h3>
                <p className="text-sm font-bold text-center mt-2 leading-relaxed">
                  حسابك المهني لم يتم تفعيله بعد من قبل إدارة المنصة. نقوم بمراجعة الرقم القومي وصحيفة الحالة الجنائية (الفيش والتشبيه) لضمان أمان عملائنا.
                </p>
                <div className="w-full bg-[#fef08a] border-2 border-foreground rounded-2xl p-4 mt-4 text-xs font-bold space-y-2">
                  <p className="border-b border-[#ca8a04]/20 pb-1 font-black">المستندات التي قدمتها للمراجعة:</p>
                  <p>الرقم القومي: {techRecord.nationalId || 'غير متوفر'}</p>
                  <p>رقم الفيش: {techRecord.criminalRecordNumber || 'غير متوفر'}</p>
                  <p className="text-primary font-black mt-1">بمجرد الموافقة، ستظهر للعملاء في نتائج البحث فورياً ويمكنك تلقي الطلبات.</p>
                </div>
              </div>
            ) : (
              /* Verified Technician Panel */
              <>
                {/* Tech Tabs */}
                <div className="flex border-4 border-foreground rounded-2xl overflow-hidden mb-8 shadow-[0_4px_0_hsl(355,65%,30%)] bg-secondary">
                  <button
                    onClick={() => setActiveTab('tech-bookings')}
                    className={`flex-1 py-4 text-base font-black transition-all flex items-center justify-center gap-2 flex-row-reverse ${
                      activeTab === 'tech-bookings'
                        ? 'bg-primary text-primary-foreground border-l-2 border-foreground'
                        : 'text-foreground hover:bg-background/50'
                    }`}
                  >
                    الطلبات الواردة
                    <span className="bg-foreground text-background text-[10px] font-black px-1.5 py-0.5 rounded-full border border-foreground">
                      {technicianBookings.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('slots')}
                    className={`flex-1 py-4 text-base font-black transition-all ${
                      activeTab === 'slots'
                        ? 'bg-primary text-primary-foreground border-l-2 border-r-2 border-foreground'
                        : 'text-foreground hover:bg-background/50'
                    }`}
                  >
                    مواعيد العمل
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-4 text-base font-black transition-all ${
                      activeTab === 'profile'
                        ? 'bg-primary text-primary-foreground border-r-2 border-foreground'
                        : 'text-foreground hover:bg-background/50'
                    }`}
                  >
                    ملفي المهني
                  </button>
                </div>

                {/* Tab content: Technician Bookings */}
                {activeTab === 'tech-bookings' && (
                  <div className="space-y-6">
                    {technicianBookings.length > 0 ? (
                      technicianBookings.map((booking, idx) => {
                        const bookingDate = new Date(booking.createdAt).toLocaleDateString('ar-EG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });

                        return (
                          <div
                            key={booking.id}
                            className="bg-background rounded-[1.8rem] border-2 border-foreground p-5 shadow-[0_4px_0_hsl(355,65%,30%)] text-right animate-fade-in"
                            style={{ animationDelay: `${idx * 50}ms` }}
                          >
                            <div className="flex items-center justify-between border-b-2 border-foreground/15 pb-4 mb-4 flex-row-reverse">
                              <div className="flex items-center gap-2 flex-row-reverse">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-xs font-black text-foreground/80">{bookingDate}</span>
                              </div>
                              <div>{getStatusBadge(booking.status)}</div>
                            </div>

                            <div className="flex-1 text-right mb-4">
                              <h4 className="text-xl font-black text-foreground">{booking.userName}</h4>
                              <p className="text-xs font-black text-primary font-mono mt-1" dir="ltr">
                                {booking.phone}
                              </p>
                            </div>

                            <div className="bg-secondary/40 border-2 border-foreground/10 rounded-2xl p-3 mb-4 space-y-2 text-sm text-foreground/90 font-semibold">
                              <div className="flex items-start gap-2 flex-row-reverse">
                                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="leading-tight">توقيت الوصول المختار: {booking.arrivalWindow}</p>
                              </div>
                              <div className="flex items-start gap-2 flex-row-reverse">
                                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="leading-tight">العنوان: {booking.address}</p>
                              </div>
                              <div className="flex items-start gap-2 flex-row-reverse border-t border-foreground/10 pt-2 mt-2">
                                <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <p className="leading-normal font-bold">المشكلة ووصف الطلب: {booking.problemDescription}</p>
                              </div>
                            </div>

                            {/* Booking Action Buttons */}
                            <div className="flex gap-2 flex-row-reverse">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleConfirmBooking(booking.id)}
                                    className="flex-1 bg-success text-success-foreground hover:bg-success/90 font-black border-2 border-foreground py-2.5 px-3 rounded-xl transition-all shadow-[0_2px_0_foreground]"
                                  >
                                    قبول وتأكيد الحجز
                                  </button>
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 font-black border-2 border-destructive py-2.5 px-4 rounded-xl transition-all text-center text-sm"
                                  >
                                    رفض الحجز
                                  </button>
                                </>
                              )}

                              {booking.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => handleCompleteBooking(booking.id)}
                                    className="flex-1 bg-success text-success-foreground hover:bg-success/90 font-black border-2 border-foreground py-2.5 px-3 rounded-xl transition-all shadow-[0_2px_0_foreground]"
                                  >
                                    إتمام وإغلاق الطلب
                                  </button>
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 font-black border-2 border-destructive py-2.5 px-4 rounded-xl transition-all text-center text-sm"
                                  >
                                    إلغاء الحجز
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <EmptyState
                        title="لا توجد طلبات بعد"
                        description="عندما يقوم الزبائن بحجز موعد معك ستظهر طلبات العمل هنا."
                      />
                    )}
                  </div>
                )}

                {/* Tab content: Availability Slots */}
                {activeTab === 'slots' && (
                  <div className="bg-background rounded-3xl border-4 border-foreground p-5 shadow-[0_6px_0_foreground] text-right space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-primary mb-1">مواعيد عملك المتاحة</h3>
                      <p className="text-xs text-foreground/80 font-bold">اختار المواعيد المناسبة ليك في اليوم عشان العملاء يقدروا يحجزوك فيها.</p>
                    </div>

                    <div className="space-y-3">
                      {ALL_HOURS_SLOTS.map((slot) => {
                        const isChecked = availableSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleToggleSlot(slot)}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 border-foreground text-right font-black transition-all ${
                              isChecked
                                ? 'bg-primary/20 text-foreground shadow-[0_3px_0_foreground] scale-[1.01]'
                                : 'bg-background text-foreground/60 hover:bg-secondary/40'
                            }`}
                          >
                            <span className="text-base">{hourSlotLabels[slot] || slot}</span>
                            <div
                              className={`w-6 h-6 rounded-lg border-2 border-foreground flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-primary text-primary-foreground' : 'bg-background'
                              }`}
                            >
                              {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleSaveAvailability}
                      disabled={isUpdating}
                      className="w-full btn-primary py-4 text-xl font-black"
                    >
                      {isUpdating ? 'جاري الحفظ...' : 'حفظ مواعيد العمل'}
                    </button>
                  </div>
                )}

                {/* Tab content: Technician Profile */}
                {activeTab === 'profile' && (
                  <form onSubmit={handleTechnicianProfileSubmit} className="space-y-5">
                    {errors.general && (
                      <div className="bg-destructive/10 border-2 border-destructive rounded-2xl p-4 text-right flex items-center gap-2 flex-row-reverse">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                        <p className="text-sm font-bold text-destructive">{errors.general}</p>
                      </div>
                    )}

                    {/* Name */}
                    <div className="animate-fade-in text-right">
                      <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                        <UserIcon className="w-5 h-5 text-primary" />
                        الاسم بالكامل
                      </label>
                      <input
                        type="text"
                        value={techProfileData.name}
                        onChange={(e) => setTechProfileData((prev) => ({ ...prev, name: e.target.value }))}
                        className={`input-field w-full text-right ${errors.name ? 'border-destructive' : ''}`}
                        dir="rtl"
                        disabled={isUpdating}
                      />
                      {errors.name && <p className="text-sm font-bold text-destructive mt-2">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div className="animate-fade-in text-right">
                      <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                        <Phone className="w-5 h-5 text-primary" />
                        رقم التليفون
                      </label>
                      <input
                        type="tel"
                        value={techProfileData.phone}
                        onChange={(e) => setTechProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        className={`input-field w-full text-right ${errors.phone ? 'border-destructive' : ''}`}
                        dir="ltr"
                        disabled={isUpdating}
                      />
                      {errors.phone && <p className="text-sm font-bold text-destructive mt-2">{errors.phone}</p>}
                    </div>

                    {/* Location */}
                    <div className="animate-fade-in text-right">
                      <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                        <MapPin className="w-5 h-5 text-primary" />
                        المنطقة الجغرافية
                      </label>
                      <select
                        value={techProfileData.location}
                        onChange={(e) => setTechProfileData((prev) => ({ ...prev, location: e.target.value as Location }))}
                        className={`w-full bg-background border-2 border-foreground text-foreground rounded-full px-6 py-3 text-right font-bold appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                          errors.location ? 'border-destructive' : ''
                        }`}
                        dir="rtl"
                        disabled={isUpdating}
                      >
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      {errors.location && <p className="text-sm font-bold text-destructive mt-2">{errors.location}</p>}
                    </div>

                    {/* Service Type */}
                    <div className="animate-fade-in text-right">
                      <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                        <Briefcase className="w-5 h-5 text-primary" />
                        تخصصك الرئيسي
                      </label>
                      <select
                        value={techProfileData.serviceType}
                        onChange={(e) => setTechProfileData((prev) => ({ ...prev, serviceType: e.target.value as ServiceType }))}
                        className={`w-full bg-background border-2 border-foreground text-foreground rounded-full px-6 py-3 text-right font-bold appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                          errors.serviceType ? 'border-destructive' : ''
                        }`}
                        dir="rtl"
                        disabled={isUpdating}
                      >
                        {Object.entries(serviceLabels).map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {errors.serviceType && <p className="text-sm font-bold text-destructive mt-2">{errors.serviceType}</p>}
                    </div>

                    {/* Experience Level & Years */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-right">
                        <label className="block text-sm font-bold text-foreground mb-2">سنين الخبرة</label>
                        <input
                          type="number"
                          min={1}
                          value={techProfileData.yearsOfExperience}
                          onChange={(e) => setTechProfileData((prev) => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 1 }))}
                          className="input-field w-full text-right"
                          disabled={isUpdating}
                        />
                        {errors.yearsOfExperience && <p className="text-xs font-bold text-destructive mt-1">{errors.yearsOfExperience}</p>}
                      </div>
                      <div className="text-right">
                        <label className="block text-sm font-bold text-foreground mb-2">مستوى الخبرة</label>
                        <select
                          value={techProfileData.experienceLevel}
                          onChange={(e) => setTechProfileData((prev) => ({ ...prev, experienceLevel: e.target.value as ExperienceLevel }))}
                          className="w-full bg-background border-2 border-foreground text-foreground rounded-full px-4 py-3 text-right font-bold appearance-none cursor-pointer"
                          dir="rtl"
                          disabled={isUpdating}
                        >
                          {Object.entries(experienceLabels).map(([val, label]) => (
                            <option key={val} value={val}>
                              {label}
                            </option>
                          ))}
                        </select>
                        {errors.experienceLevel && <p className="text-xs font-bold text-destructive mt-1">{errors.experienceLevel}</p>}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-right">
                        <label className="block text-sm font-bold text-foreground mb-2">سعر المعاينة الأقصى</label>
                        <input
                          type="number"
                          min={100}
                          value={techProfileData.priceRangeMax}
                          onChange={(e) => setTechProfileData((prev) => ({ ...prev, priceRangeMax: parseInt(e.target.value) || 100 }))}
                          className="input-field w-full text-right"
                          disabled={isUpdating}
                        />
                        {errors.priceRangeMax && <p className="text-xs font-bold text-destructive mt-1">{errors.priceRangeMax}</p>}
                      </div>
                      <div className="text-right">
                        <label className="block text-sm font-bold text-foreground mb-2">سعر المعاينة الأدنى</label>
                        <input
                          type="number"
                          min={50}
                          value={techProfileData.priceRangeMin}
                          onChange={(e) => setTechProfileData((prev) => ({ ...prev, priceRangeMin: parseInt(e.target.value) || 50 }))}
                          className="input-field w-full text-right"
                          disabled={isUpdating}
                        />
                        {errors.priceRangeMin && <p className="text-xs font-bold text-destructive mt-1">{errors.priceRangeMin}</p>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full btn-primary py-4 text-xl font-black mt-4"
                    >
                      {isUpdating ? 'جاري الحفظ...' : 'حفظ التعديلات المهنية'}
                    </button>
                  </form>
                )}
              </>
            )}
          </>
        )}

        {/* ----------------- RENDER CUSTOMER VIEW ----------------- */}
        {user.role === 'customer' && (
          <>
            {/* Customer Tabs */}
            <div className="flex border-4 border-foreground rounded-2xl overflow-hidden mb-8 shadow-[0_4px_0_hsl(355,65%,30%)] bg-secondary">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 py-4 text-xl font-black transition-all flex items-center justify-center gap-2 flex-row-reverse ${
                  activeTab === 'bookings'
                    ? 'bg-primary text-primary-foreground border-l-4 border-foreground'
                    : 'text-foreground hover:bg-background/50'
                }`}
              >
                حجوزاتي
                <span className="bg-foreground text-background text-xs font-black px-2 py-0.5 rounded-full border border-foreground">
                  {customerBookings.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 text-xl font-black transition-all ${
                  activeTab === 'profile'
                    ? 'bg-primary text-primary-foreground border-r-4 border-foreground'
                    : 'text-foreground hover:bg-background/50'
                }`}
              >
                تعديل بياناتي
              </button>
            </div>

            {/* Tab content: Customer Bookings */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {customerBookings.length > 0 ? (
                  customerBookings.map((booking, idx) => {
                    const tech = getTechnicianById(booking.technicianId);
                    const bookingFeedback = feedbacks.find((f) => f.bookingId === booking.id);
                    const bookingDate = new Date(booking.createdAt).toLocaleDateString('ar-EG', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={booking.id}
                        className="bg-background rounded-[1.8rem] border-2 border-foreground p-5 shadow-[0_4px_0_hsl(355,65%,30%)] text-right animate-fade-in"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <div className="flex items-center justify-between border-b-2 border-foreground/15 pb-4 mb-4 flex-row-reverse">
                          <div className="flex items-center gap-2 flex-row-reverse">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-xs font-black text-foreground/80">{bookingDate}</span>
                          </div>
                          <div>{getStatusBadge(booking.status)}</div>
                        </div>

                        <div className="flex items-center gap-4 flex-row-reverse mb-4">
                          {tech ? (
                            <img
                              src={tech.photoUrl}
                              alt={tech.name}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-foreground"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-secondary border-2 border-foreground rounded-xl flex items-center justify-center">
                              <UserIcon className="w-6 h-6 text-foreground/60" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-foreground">{tech ? tech.name : 'صنايعي'}</h4>
                            <p className="text-sm font-semibold text-foreground/80">
                              {serviceLabels[booking.selectedService] || booking.selectedService}
                            </p>
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-mono font-bold bg-secondary px-2 py-1 rounded border border-foreground/30">
                              {booking.id}
                            </span>
                          </div>
                        </div>

                        <div className="bg-secondary/40 border-2 border-foreground/10 rounded-2xl p-3 mb-4 space-y-2 text-sm text-foreground/90 font-semibold">
                          <div className="flex items-start gap-2 flex-row-reverse">
                            <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="leading-tight">الوصول: {booking.arrivalWindow}</p>
                          </div>
                          <div className="flex items-start gap-2 flex-row-reverse">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="leading-tight">العنوان: {booking.address}</p>
                          </div>
                          <div className="flex items-start gap-2 flex-row-reverse border-t border-foreground/10 pt-2 mt-2">
                            <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="leading-normal font-bold">المشكلة: {booking.problemDescription}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-row-reverse">
                          {(booking.status === 'confirmed' || booking.status === 'pending') && (
                            <>
                              <button
                                onClick={() => handleCompleteBooking(booking.id)}
                                className="flex-1 bg-success text-success-foreground hover:bg-success/90 font-black border-2 border-foreground py-2.5 px-3 rounded-xl transition-all shadow-[0_2px_0_hsl(355,80%,20%)] hover:translate-y-[1px]"
                              >
                                تم إنجاز الشغل
                              </button>
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="bg-destructive/10 text-destructive hover:bg-destructive/20 font-black border-2 border-destructive py-2.5 px-4 rounded-xl transition-all text-center text-sm"
                              >
                                إلغاء الحجز
                              </button>
                            </>
                          )}

                          {booking.status === 'completed' && (
                            <div className="w-full">
                              {bookingFeedback ? (
                                <div className="bg-success/5 border-2 border-success/30 rounded-2xl p-3 flex items-center justify-between flex-row-reverse text-right">
                                  <div className="flex items-center gap-1 flex-row-reverse">
                                    <StarRating rating={bookingFeedback.rating} size="sm" />
                                    <span className="font-mono text-sm font-black mr-2">({bookingFeedback.rating}/5)</span>
                                  </div>
                                  {bookingFeedback.comment && (
                                    <p className="text-xs text-foreground/80 italic max-w-[200px] truncate">
                                      "{bookingFeedback.comment}"
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleLeaveFeedback(booking)}
                                  className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-black border-2 border-foreground py-3 px-4 rounded-xl transition-all shadow-[0_2px_0_hsl(355,80%,20%)] text-center text-base"
                                >
                                  سيب تقييم للصنايعي
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState
                    title="لسه معملتش أي حجوزات"
                    description="احجز صنايعي شاطر دلوقتي عشان يجيلك في أسرع وقت."
                    action={{ label: 'احجز صنايعي دلوقتي', onClick: () => navigate('/') }}
                  />
                )}
              </div>
            )}

            {/* Tab content: Customer Edit Profile */}
            {activeTab === 'profile' && (
              <form onSubmit={handleCustomerProfileSubmit} className="space-y-5">
                {errors.general && (
                  <div className="bg-destructive/10 border-2 border-destructive rounded-2xl p-4 text-right flex items-center gap-2 flex-row-reverse">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <p className="text-sm font-bold text-destructive">{errors.general}</p>
                  </div>
                )}

                {/* Name */}
                <div className="animate-fade-in text-right">
                  <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                    <UserIcon className="w-5 h-5 text-primary" />
                    الاسم بالكامل
                  </label>
                  <input
                    type="text"
                    value={customerProfileData.name}
                    onChange={(e) => setCustomerProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    className={`input-field w-full text-right ${errors.name ? 'border-destructive' : ''}`}
                    dir="rtl"
                    disabled={isUpdating}
                  />
                  {errors.name && <p className="text-sm font-bold text-destructive mt-2">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="animate-fade-in text-right">
                  <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                    <Phone className="w-5 h-5 text-primary" />
                    رقم التليفون
                  </label>
                  <input
                    type="tel"
                    value={customerProfileData.phone}
                    onChange={(e) => setCustomerProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                    className={`input-field w-full text-right ${errors.phone ? 'border-destructive' : ''}`}
                    dir="ltr"
                    disabled={isUpdating}
                  />
                  {errors.phone && <p className="text-sm font-bold text-destructive mt-2">{errors.phone}</p>}
                </div>

                {/* Location */}
                <div className="animate-fade-in text-right">
                  <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                    <MapPin className="w-5 h-5 text-primary" />
                    المنطقة (المحافظة)
                  </label>
                  <select
                    value={customerProfileData.location}
                    onChange={(e) => setCustomerProfileData((prev) => ({ ...prev, location: e.target.value as Location }))}
                    className={`w-full bg-background border-2 border-foreground text-foreground rounded-full px-6 py-3 text-right font-bold appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/20 ${
                      errors.location ? 'border-destructive' : ''
                    }`}
                    dir="rtl"
                    disabled={isUpdating}
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  {errors.location && <p className="text-sm font-bold text-destructive mt-2">{errors.location}</p>}
                </div>

                {/* Address */}
                <div className="animate-fade-in text-right">
                  <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                    <MapPin className="w-5 h-5 text-primary" />
                    العنوان بالتفصيل
                  </label>
                  <input
                    type="text"
                    value={customerProfileData.address}
                    onChange={(e) => setCustomerProfileData((prev) => ({ ...prev, address: e.target.value }))}
                    className={`input-field w-full text-right ${errors.address ? 'border-destructive' : ''}`}
                    dir="rtl"
                    disabled={isUpdating}
                  />
                  {errors.address && <p className="text-sm font-bold text-destructive mt-2">{errors.address}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full btn-primary py-4 text-xl font-black mt-4"
                >
                  {isUpdating ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </form>
            )}
          </>
        )}

        {/* Logout Button */}
        <div className="mt-12 animate-fade-in">
          <button
            onClick={() => {
              if (window.confirm('هل تريد تسجيل الخروج؟')) {
                logout();
                toast.success('تم تسجيل الخروج بنجاح');
                navigate('/');
              }
            }}
            className="w-full flex items-center justify-center gap-2 text-destructive border-2 border-destructive hover:bg-destructive/5 font-black py-4 px-6 rounded-full transition-colors text-lg bg-background shadow-[0_4px_0_destructive] hover:translate-y-[1px] hover:shadow-none"
          >
            <span>تسجيل الخروج</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
