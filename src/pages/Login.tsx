import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { User as UserIcon, Phone, MapPin, Key, AlertCircle, Sparkles, CheckCircle2, Shield, Hammer, FileText, Upload } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { Location, ServiceType, ExperienceLevel } from '@/types';
import { toast } from 'sonner';

const egyptianPhoneRegex = /^01[0125][0-9]{8}$/;
const nationalIdRegex = /^[23][0-9]{13}$/; // 14 digits starting with 2 or 3

const loginSchema = z.object({
  phone: z.string().regex(egyptianPhoneRegex, 'اكتب رقم مصري صح (زي 01012345678)'),
});

const registerCustomerSchema = z.object({
  name: z.string().min(2, 'الاسم لازم يكون أكتر من حرفين'),
  phone: z.string().regex(egyptianPhoneRegex, 'اكتب رقم مصري صح (زي 01012345678)'),
  address: z.string().min(5, 'لو سمحت اكتب العنوان بالتفصيل'),
  location: z.enum(['مدينة نصر', 'المعادي', 'التجمع الخامس', 'الشيخ زايد', 'مصر الجديدة'] as const, {
    errorMap: () => ({ message: 'اختار المنطقة من القائمة' }),
  }),
});

const registerTechnicianSchema = z.object({
  name: z.string().min(2, 'الاسم لازم يكون أكتر من حرفين'),
  phone: z.string().regex(egyptianPhoneRegex, 'اكتب رقم مصري صح (زي 01012345678)'),
  location: z.enum(['مدينة نصر', 'المعادي', 'التجمع الخامس', 'الشيخ زايد', 'مصر الجديدة'] as const, {
    errorMap: () => ({ message: 'اختار المنطقة من القائمة' }),
  }),
  serviceType: z.enum(['plumbing', 'electrical', 'carpentry', 'hvac', 'appliances', 'painting'] as const, {
    errorMap: () => ({ message: 'اختار التخصص' }),
  }),
  experienceLevel: z.enum(['junior', 'mid', 'senior'] as const, {
    errorMap: () => ({ message: 'اختار مستوى الخبرة' }),
  }),
  yearsOfExperience: z.number().min(1, 'سنين الخبرة لازم تكون سنة أو أكتر'),
  priceRangeMin: z.number().min(50, 'الحد الأدنى للسعر 50 جنيه'),
  priceRangeMax: z.number().min(100, 'الحد الأقصى للسعر 100 جنيه'),
  nationalId: z.string().regex(nationalIdRegex, 'الرقم القومي لازم يكون 14 رقم صحيح'),
  criminalRecordNumber: z.string().min(5, 'رقم الفيش والتشبيه غير صحيح'),
});

const locations: Location[] = ['مدينة نصر', 'المعادي', 'التجمع الخامس', 'الشيخ زايد', 'مصر الجديدة'];

const serviceOptions = [
  { value: 'plumbing', label: 'سباكة' },
  { value: 'electrical', label: 'كهرباء' },
  { value: 'carpentry', label: 'نجارة' },
  { value: 'hvac', label: 'تكييف' },
  { value: 'appliances', label: 'أجهزة منزلية' },
  { value: 'painting', label: 'نقاشة' },
];

const experienceOptions = [
  { value: 'junior', label: 'صنايعي (مبتدئ)' },
  { value: 'mid', label: 'خبرة (متوسط)' },
  { value: 'senior', label: 'أسطى (محترف)' },
];

const Login = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { login, register, demoAccounts, demoTechnicians, isLoading } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  
  // Login State
  const [phone, setPhone] = useState('');
  
  // Register Customer State
  const [custData, setCustData] = useState({
    name: '',
    phone: '',
    address: '',
    location: '' as Location | '',
  });

  // Register Technician State
  const [techData, setTechData] = useState({
    name: '',
    phone: '',
    location: '' as Location | '',
    serviceType: '' as ServiceType | '',
    experienceLevel: '' as ExperienceLevel | '',
    yearsOfExperience: 5,
    priceRangeMin: 150,
    priceRangeMax: 400,
    nationalId: '',
    criminalRecordNumber: '',
  });

  // Mock Upload state
  const [nationalIdFileUploaded, setNationalIdFileUploaded] = useState(false);
  const [criminalRecordFileUploaded, setCriminalRecordFileUploaded] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fromPath = (routerLocation.state as { from?: string } | null)?.from || '/';

  const handleDemoLogin = async (demoPhone: string) => {
    const res = await login(demoPhone);
    if (res.success) {
      toast.success(res.message);
      navigate(fromPath);
    } else {
      toast.error(res.message);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ phone });
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errs[err.path[0] as string] = err.message;
      });
      setErrors(errs);
      return;
    }

    const res = await login(phone);
    if (res.success) {
      toast.success(res.message);
      navigate(fromPath);
    } else {
      toast.error(res.message);
      setErrors({ phone: res.message });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (role === 'customer') {
      const result = registerCustomerSchema.safeParse(custData);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          errs[err.path[0] as string] = err.message;
        });
        setErrors(errs);
        return;
      }

      const res = await register(
        custData.name,
        custData.phone,
        custData.address,
        custData.location as Location,
        'customer'
      );

      if (res.success) {
        toast.success(res.message);
        navigate(fromPath);
      } else {
        toast.error(res.message);
        setErrors({ registerGeneral: res.message });
      }
    } else {
      // Validate files are attached
      if (!nationalIdFileUploaded) {
        setErrors((prev) => ({ ...prev, nationalIdFile: 'لو سمحت ارفع صورة البطاقة الشخصية' }));
        return;
      }
      if (!criminalRecordFileUploaded) {
        setErrors((prev) => ({ ...prev, criminalRecordFile: 'لو سمحت ارفع صورة الفيش والتشبيه' }));
        return;
      }

      const result = registerTechnicianSchema.safeParse(techData);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          errs[err.path[0] as string] = err.message;
        });
        setErrors(errs);
        return;
      }

      const res = await register(
        techData.name,
        techData.phone,
        '', // address is empty for tech registration
        techData.location as Location,
        'technician',
        {
          serviceType: techData.serviceType as ServiceType,
          experienceLevel: techData.experienceLevel as ExperienceLevel,
          yearsOfExperience: techData.yearsOfExperience,
          priceRangeMin: techData.priceRangeMin,
          priceRangeMax: techData.priceRangeMax,
          nationalId: techData.nationalId,
          criminalRecordNumber: techData.criminalRecordNumber,
        }
      );

      if (res.success) {
        toast.success(res.message);
        navigate('/account'); // Redirect newly registered techs to their account dashboard
      } else {
        toast.error(res.message);
        setErrors({ registerGeneral: res.message });
      }
    }
  };

  const handleCustChange = (field: keyof typeof custData, value: string) => {
    setCustData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleTechChange = (field: keyof typeof techData, value: any) => {
    setTechData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <PageHeader
        title={isLoginMode ? 'تسجيل الدخول للمنصة' : 'إنشاء حساب جديد'}
        subtitle="صنايعية معتمدين.. في الإنجاز"
        backPath="/"
      />

      <div className="container py-8 max-w-lg mx-auto">
        {/* Switch Mode Tabs (Login / Register) */}
        <div className="flex border-4 border-foreground rounded-2xl overflow-hidden mb-6 shadow-[0_4px_0_hsl(355,65%,30%)] bg-secondary">
          <button
            onClick={() => {
              setIsLoginMode(true);
              setErrors({});
            }}
            className={`flex-1 py-4 text-xl font-black transition-all ${
              isLoginMode ? 'bg-primary text-primary-foreground border-l-4 border-foreground' : 'text-foreground hover:bg-background/50'
            }`}
          >
            تسجيل دخول
          </button>
          <button
            onClick={() => {
              setIsLoginMode(false);
              setErrors({});
            }}
            className={`flex-1 py-4 text-xl font-black transition-all ${
              !isLoginMode ? 'bg-primary text-primary-foreground border-r-4 border-foreground' : 'text-foreground hover:bg-background/50'
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        {/* Role Toggle Selector (Client / Handyman) */}
        <div className="bg-background rounded-2xl border-2 border-foreground p-3 mb-6 flex gap-3 text-center">
          <button
            type="button"
            onClick={() => {
              setRole('customer');
              setErrors({});
            }}
            className={`flex-1 py-2 px-4 rounded-xl border-2 font-black transition-all text-base ${
              role === 'customer'
                ? 'bg-primary text-primary-foreground border-foreground shadow-[0_3px_0_hsl(355,80%,20%)]'
                : 'bg-secondary text-foreground border-transparent hover:bg-secondary/80'
            }`}
          >
            أنا زبون (أطلب خدمات)
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('technician');
              setErrors({});
            }}
            className={`flex-1 py-2 px-4 rounded-xl border-2 font-black transition-all text-base ${
              role === 'technician'
                ? 'bg-primary text-primary-foreground border-foreground shadow-[0_3px_0_hsl(355,80%,20%)]'
                : 'bg-secondary text-foreground border-transparent hover:bg-secondary/80'
            }`}
          >
            أنا صنايعي (أقدم خدمات)
          </button>
        </div>

        {/* Demo Accounts Quick Login Buttons */}
        {isLoginMode && (
          <div className="bg-secondary rounded-[1.5rem] border-2 border-foreground p-5 mb-8 shadow-[0_4px_0_hsl(355,65%,30%)] text-right animate-fade-in">
            <h3 className="text-xl font-black text-foreground mb-3 flex items-center justify-end gap-2 flex-row-reverse">
              <Sparkles className="w-5 h-5 text-primary" />
              تسجيل دخول سريع (للفحص والتجربة)
            </h3>
            
            <div className="space-y-4">
              {/* Clients */}
              <div>
                <p className="text-xs font-black text-foreground/80 mb-2 border-b border-foreground/10 pb-1">دخول كزبون:</p>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleDemoLogin(acc.phone)}
                      className="bg-background border-2 border-foreground hover:bg-secondary rounded-xl p-2 text-right transition-colors text-xs font-bold"
                    >
                      <p className="font-black text-foreground truncate">{acc.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-foreground/60 font-mono">{acc.phone}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Technicians */}
              <div>
                <p className="text-xs font-black text-foreground/80 mb-2 border-b border-foreground/10 pb-1">دخول كصنايعي (مفعل):</p>
                <div className="grid grid-cols-2 gap-2">
                  {demoTechnicians.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleDemoLogin(acc.phone)}
                      className="bg-background border-2 border-foreground hover:bg-secondary rounded-xl p-2 text-right transition-colors text-xs font-bold"
                    >
                      <p className="font-black text-foreground truncate">{acc.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-foreground/60 font-mono">{acc.phone}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin */}
              <div>
                <p className="text-xs font-black text-foreground/80 mb-2 border-b border-foreground/10 pb-1">دخول كمسؤول النظام (أدمن):</p>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('01000000000')}
                  className="w-full bg-primary text-primary-foreground border-2 border-foreground hover:bg-primary/90 rounded-xl p-3 flex items-center justify-between flex-row-reverse text-right transition-colors text-xs font-black shadow-[0_3px_0_hsl(355,80%,20%)]"
                >
                  <span>لوحة تحكم الإدارة (الأدمن)</span>
                  <span className="font-mono bg-background text-primary px-2 py-0.5 rounded border border-foreground text-[10px]">01000000000</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forms Block */}
        {isLoginMode ? (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="animate-fade-in text-right">
              <label className="flex items-center gap-2 justify-end text-lg font-bold text-foreground mb-2 flex-row-reverse">
                <Phone className="w-5 h-5 text-primary" />
                رقم التليفون
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({});
                }}
                placeholder="اكتب رقمك (مثل: 01012345678)"
                className={`input-field w-full text-right ${errors.phone ? 'border-destructive ring-destructive' : ''}`}
                dir="ltr"
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="flex items-center gap-1 justify-end text-sm font-bold text-destructive mt-2 flex-row-reverse">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 text-xl font-black mt-2"
            >
              {isLoading ? 'بيسجل دخول...' : 'سجل دخول'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            {errors.registerGeneral && (
              <div className="bg-destructive/10 border-2 border-destructive rounded-2xl p-4 text-right flex items-center gap-2 flex-row-reverse">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm font-bold text-destructive">{errors.registerGeneral}</p>
              </div>
            )}

            {/* Common fields: Name & Phone & Location */}
            <div className="animate-fade-in text-right">
              <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                <UserIcon className="w-5 h-5 text-primary" />
                الاسم بالكامل
              </label>
              <input
                type="text"
                value={role === 'customer' ? custData.name : techData.name}
                onChange={(e) =>
                  role === 'customer'
                    ? handleCustChange('name', e.target.value)
                    : handleTechChange('name', e.target.value)
                }
                placeholder="اكتب اسمك بالكامل"
                className={`input-field w-full text-right ${errors.name ? 'border-destructive' : ''}`}
                dir="rtl"
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm font-bold text-destructive text-right mt-1">{errors.name}</p>}
            </div>

            <div className="animate-fade-in text-right">
              <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                <Phone className="w-5 h-5 text-primary" />
                رقم التليفون
              </label>
              <input
                type="tel"
                value={role === 'customer' ? custData.phone : techData.phone}
                onChange={(e) =>
                  role === 'customer'
                    ? handleCustChange('phone', e.target.value)
                    : handleTechChange('phone', e.target.value)
                }
                placeholder="01012345678"
                className={`input-field w-full text-right ${errors.phone ? 'border-destructive' : ''}`}
                dir="ltr"
                disabled={isLoading}
              />
              {errors.phone && <p className="text-sm font-bold text-destructive text-right mt-1">{errors.phone}</p>}
            </div>

            <div className="animate-fade-in text-right">
              <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                <MapPin className="w-5 h-5 text-primary" />
                المنطقة (المحافظة)
              </label>
              <select
                value={role === 'customer' ? custData.location : techData.location}
                onChange={(e) =>
                  role === 'customer'
                    ? handleCustChange('location', e.target.value)
                    : handleTechChange('location', e.target.value)
                }
                className={`w-full bg-background border-2 border-foreground text-foreground rounded-full px-6 py-3 text-right font-bold appearance-none cursor-pointer focus:outline-none focus:ring-4 ${
                  errors.location ? 'border-destructive' : ''
                }`}
                dir="rtl"
                disabled={isLoading}
              >
                <option value="">اختار منطقتك</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.location && <p className="text-sm font-bold text-destructive text-right mt-1">{errors.location}</p>}
            </div>

            {/* Role specific: Address (Customer Only) */}
            {role === 'customer' && (
              <div className="animate-fade-in text-right">
                <label className="flex items-center gap-2 justify-end text-base font-bold text-foreground mb-2 flex-row-reverse">
                  <MapPin className="w-5 h-5 text-primary" />
                  العنوان بالتفصيل
                </label>
                <input
                  type="text"
                  value={custData.address}
                  onChange={(e) => handleCustChange('address', e.target.value)}
                  placeholder="رقم العمارة، الشارع، علامة مميزة"
                  className={`input-field w-full text-right ${errors.address ? 'border-destructive' : ''}`}
                  dir="rtl"
                  disabled={isLoading}
                />
                {errors.address && <p className="text-sm font-bold text-destructive text-right mt-1">{errors.address}</p>}
              </div>
            )}

            {/* Role specific: Tech Info & Verification (Technician Only) */}
            {role === 'technician' && (
              <>
                <div className="border-t-2 border-foreground/20 pt-4 mt-4 space-y-4 text-right">
                  <h4 className="text-lg font-black text-primary mb-2 flex items-center justify-end gap-2 flex-row-reverse">
                    <Shield className="w-5 h-5" />
                    المستندات الفنية والتوثيق المطلوب
                  </h4>

                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">تخصصك الرئيسي</label>
                    <select
                      value={techData.serviceType}
                      onChange={(e) => handleTechChange('serviceType', e.target.value)}
                      className="w-full bg-background border-2 border-foreground text-foreground rounded-full px-6 py-3 text-right font-bold appearance-none cursor-pointer focus:outline-none focus:ring-4"
                      dir="rtl"
                    >
                      <option value="">اختار التخصص</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && <p className="text-sm font-bold text-destructive mt-1">{errors.serviceType}</p>}
                  </div>

                  {/* Level and Experience */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1">سنين الخبرة</label>
                      <input
                        type="number"
                        min={1}
                        value={techData.yearsOfExperience}
                        onChange={(e) => handleTechChange('yearsOfExperience', parseInt(e.target.value) || 1)}
                        className="input-field w-full text-right"
                        disabled={isLoading}
                      />
                      {errors.yearsOfExperience && <p className="text-xs font-bold text-destructive mt-1">{errors.yearsOfExperience}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1">مستوى الخبرة</label>
                      <select
                        value={techData.experienceLevel}
                        onChange={(e) => handleTechChange('experienceLevel', e.target.value)}
                        className="w-full bg-background border-2 border-foreground text-foreground rounded-full px-4 py-3 text-right font-bold appearance-none cursor-pointer focus:outline-none focus:ring-4"
                        dir="rtl"
                      >
                        <option value="">اختار المستوى</option>
                        {experienceOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.experienceLevel && <p className="text-xs font-bold text-destructive mt-1">{errors.experienceLevel}</p>}
                    </div>
                  </div>

                  {/* Prices Min / Max */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1">الحد الأقصى للمعاينة (جنيه)</label>
                      <input
                        type="number"
                        min={100}
                        value={techData.priceRangeMax}
                        onChange={(e) => handleTechChange('priceRangeMax', parseInt(e.target.value) || 100)}
                        className="input-field w-full text-right"
                        disabled={isLoading}
                      />
                      {errors.priceRangeMax && <p className="text-xs font-bold text-destructive mt-1">{errors.priceRangeMax}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-1">الحد الأدنى للمعاينة (جنيه)</label>
                      <input
                        type="number"
                        min={50}
                        value={techData.priceRangeMin}
                        onChange={(e) => handleTechChange('priceRangeMin', parseInt(e.target.value) || 50)}
                        className="input-field w-full text-right"
                        disabled={isLoading}
                      />
                      {errors.priceRangeMin && <p className="text-xs font-bold text-destructive mt-1">{errors.priceRangeMin}</p>}
                    </div>
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">الرقم القومي (14 رقم)</label>
                    <input
                      type="text"
                      maxLength={14}
                      value={techData.nationalId}
                      onChange={(e) => handleTechChange('nationalId', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="اكتب 14 رقم باللغة الإنجليزية"
                      className="input-field w-full text-right"
                      dir="ltr"
                      disabled={isLoading}
                    />
                    {errors.nationalId && <p className="text-sm font-bold text-destructive mt-1">{errors.nationalId}</p>}
                  </div>

                  {/* Criminal Record Certification */}
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-1">رقم الفيش والتشبيه (صحيفة الحالة الجنائية)</label>
                    <input
                      type="text"
                      value={techData.criminalRecordNumber}
                      onChange={(e) => handleTechChange('criminalRecordNumber', e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="رقم الصحيفة (مثل: 3847291)"
                      className="input-field w-full text-right"
                      dir="ltr"
                      disabled={isLoading}
                    />
                    {errors.criminalRecordNumber && <p className="text-sm font-bold text-destructive mt-1">{errors.criminalRecordNumber}</p>}
                  </div>

                  {/* Mock Upload components */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {/* Criminal Record Upload */}
                    <div className="bg-secondary rounded-2xl border-2 border-foreground p-3 text-center">
                      <p className="text-xs font-black text-foreground mb-2">صحيفة الفيش والتشبيه</p>
                      {criminalRecordFileUploaded ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-6 h-6 text-success" />
                          <span className="text-[10px] font-black text-success">تم التوثيق والمحاكاة</span>
                          <button
                            type="button"
                            onClick={() => setCriminalRecordFileUploaded(false)}
                            className="text-[10px] text-destructive font-bold underline mt-1"
                          >
                            حذف
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setCriminalRecordFileUploaded(true);
                            if (errors.criminalRecordFile) setErrors((prev) => ({ ...prev, criminalRecordFile: '' }));
                          }}
                          className="w-full flex flex-col items-center gap-1 justify-center bg-background border border-dashed border-foreground/40 hover:bg-secondary rounded-xl py-3 text-foreground/80 transition-colors"
                        >
                          <Upload className="w-5 h-5 text-primary" />
                          <span className="text-[10px] font-bold">ارفه الفيش</span>
                        </button>
                      )}
                      {errors.criminalRecordFile && <p className="text-[10px] font-bold text-destructive mt-1">{errors.criminalRecordFile}</p>}
                    </div>

                    {/* National ID Upload */}
                    <div className="bg-secondary rounded-2xl border-2 border-foreground p-3 text-center">
                      <p className="text-xs font-black text-foreground mb-2">البطاقة الشخصية (وجهين)</p>
                      {nationalIdFileUploaded ? (
                        <div className="flex flex-col items-center gap-1">
                          <CheckCircle2 className="w-6 h-6 text-success" />
                          <span className="text-[10px] font-black text-success">تم التوثيق والمحاكاة</span>
                          <button
                            type="button"
                            onClick={() => setNationalIdFileUploaded(false)}
                            className="text-[10px] text-destructive font-bold underline mt-1"
                          >
                            حذف
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setNationalIdFileUploaded(true);
                            if (errors.nationalIdFile) setErrors((prev) => ({ ...prev, nationalIdFile: '' }));
                          }}
                          className="w-full flex flex-col items-center gap-1 justify-center bg-background border border-dashed border-foreground/40 hover:bg-secondary rounded-xl py-3 text-foreground/80 transition-colors"
                        >
                          <Upload className="w-5 h-5 text-primary" />
                          <span className="text-[10px] font-bold">ارفع البطاقة</span>
                        </button>
                      )}
                      {errors.nationalIdFile && <p className="text-[10px] font-bold text-destructive mt-1">{errors.nationalIdFile}</p>}
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 text-xl font-black mt-6"
            >
              {isLoading ? 'بيسجل الحساب الجديد...' : 'أنشئ حساب وسجل دخول'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
