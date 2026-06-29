import { useNavigate } from 'react-router-dom';
import { Droplets, Zap, Shield, Clock, Banknote, Hammer, Snowflake, MonitorPlay, PaintRoller, Star, CheckCircle2, User as UserIcon, LogIn } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { ServiceType } from '@/types';

const Home = () => {
  const navigate = useNavigate();
  const { setSelectedService } = useBooking();
  const { user, isAuthenticated } = useAuth();

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    navigate(`/technicians/${service}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section (Deep Red) */}
      <div className="bg-primary text-primary-foreground border-b-4 border-foreground relative overflow-hidden">
        {/* Top navigation header row */}
        <div className="container py-4 flex items-center justify-between relative z-20">
          <div className="text-right">
            <span className="text-2xl font-black tracking-widest text-primary-foreground select-none">صنايعي</span>
          </div>
          <div className="text-left animate-fade-in">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/account')}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground border-2 border-foreground rounded-full hover:bg-background transition-all font-black text-sm"
              >
                <span className="max-w-[100px] truncate">{user?.name.split(' ')[0]}</span>
                <UserIcon className="w-4 h-4 text-primary" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 bg-background text-foreground border-2 border-foreground rounded-full hover:bg-secondary transition-all font-black text-sm shadow-[0_3px_0_foreground]"
              >
                <span>دخول / إنشاء حساب</span>
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="container py-12 pb-24 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight uppercase">
              صنايعية معتمدين.<br />النهارده.
            </h1>
            <p className="text-primary-foreground/90 text-xl md:text-2xl max-w-xl mx-auto font-bold leading-relaxed">
              احجز أحسن صنايعية في مصر. بييجوا في ميعادهم، وأسعارهم واضحة، ومن غير فرهدة.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background pt-10 pb-16">
        {/* Trust Indicators */}
        <div className="container -mt-24 relative z-20 mb-20">
          <div className="bg-secondary rounded-[2rem] shadow-[0_8px_0_hsl(355,65%,30%)] border-4 border-foreground p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center flex flex-col items-center p-6 bg-background rounded-3xl border-4 border-foreground shadow-[0_4px_0_hsl(355,65%,30%)] hover:-translate-y-2 transition-transform">
              <div className="inline-flex p-4 rounded-full bg-primary mb-4 border-4 border-foreground shadow-lg">
                <Shield className="w-10 h-10 text-background" />
              </div>
              <h3 className="text-2xl font-black text-foreground">صنايعية معتمدين</h3>
            </div>
            <div className="text-center flex flex-col items-center p-6 bg-background rounded-3xl border-4 border-foreground shadow-[0_4px_0_hsl(355,65%,30%)] hover:-translate-y-2 transition-transform">
              <div className="inline-flex p-4 rounded-full bg-primary mb-4 border-4 border-foreground shadow-lg">
                <Clock className="w-10 h-10 text-background" />
              </div>
              <h3 className="text-2xl font-black text-foreground">في نفس اليوم</h3>
            </div>
            <div className="text-center flex flex-col items-center p-6 bg-background rounded-3xl border-4 border-foreground shadow-[0_4px_0_hsl(355,65%,30%)] hover:-translate-y-2 transition-transform">
              <div className="inline-flex p-4 rounded-full bg-primary mb-4 border-4 border-foreground shadow-lg">
                <Banknote className="w-10 h-10 text-background" />
              </div>
              <h3 className="text-2xl font-black text-foreground">أسعار على المكشوف</h3>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="container mb-24">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-black text-foreground uppercase inline-block border-b-4 border-primary pb-2">
              عايز تصلح إيه؟
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="سباكة"
              description="تسريب مياه، حوض مسدود، سيفون"
              icon={Droplets}
              examples={['مواسير', 'بالوعة', 'سيفون']}
              onClick={() => handleServiceSelect('plumbing')}
            />
            <ServiceCard
              title="كهرباء"
              description="كهربا قاطعة، تصليح فيش، سلوك"
              icon={Zap}
              examples={['فيشة', 'لمبة', 'شورت']}
              onClick={() => handleServiceSelect('electrical')}
            />
            <ServiceCard
              title="نجارة"
              description="تصليح كوالين، أبواب، دواليب"
              icon={Hammer}
              examples={['كالون', 'مفصلة', 'شباك']}
              onClick={() => handleServiceSelect('carpentry')}
            />
            <ServiceCard
              title="تكييف"
              description="صيانة دورية، شحن فريون، تسريب"
              icon={Snowflake}
              examples={['فريون', 'تنظيف', 'تسريب']}
              onClick={() => handleServiceSelect('hvac')}
            />
            <ServiceCard
              title="أجهزة منزلية"
              description="تصليح غسالات، تلاجات، بوتاجازات"
              icon={MonitorPlay}
              examples={['غسالة', 'تلاجة', 'سخان']}
              onClick={() => handleServiceSelect('appliances')}
            />
            <ServiceCard
              title="نقاشة"
              description="دهانات، تصليح شروخ، معجون"
              icon={PaintRoller}
              examples={['دهان', 'معجون', 'رطوبة']}
              onClick={() => handleServiceSelect('painting')}
            />
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-secondary border-y-4 border-foreground py-20 mb-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-foreground uppercase inline-block border-b-4 border-primary pb-2">
                إزاي بنشتغل؟
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-foreground -z-10"></div>

              <div className="text-center flex flex-col items-center bg-background p-8 rounded-[2rem] border-4 border-foreground shadow-[0_6px_0_hsl(355,65%,30%)]">
                <div className="w-16 h-16 rounded-full bg-primary text-background font-black text-3xl flex items-center justify-center border-4 border-foreground mb-6 shadow-lg">1</div>
                <h3 className="text-2xl font-black text-foreground mb-3">اختار الخدمة</h3>
                <p className="text-lg font-bold text-foreground/80">
                  حدد المشكلة اللي عندك واختار الصنايعي المناسب لميزانيتك وميعادك.
                </p>
              </div>

              <div className="text-center flex flex-col items-center bg-background p-8 rounded-[2rem] border-4 border-foreground shadow-[0_6px_0_hsl(355,65%,30%)] md:-translate-y-8">
                <div className="w-16 h-16 rounded-full bg-primary text-background font-black text-3xl flex items-center justify-center border-4 border-foreground mb-6 shadow-lg">2</div>
                <h3 className="text-2xl font-black text-foreground mb-3">أكد الحجز</h3>
                <p className="text-lg font-bold text-foreground/80">
                  سجل بياناتك وعنوانك، والصنايعي هيجيلك في نفس اليوم.
                </p>
              </div>

              <div className="text-center flex flex-col items-center bg-background p-8 rounded-[2rem] border-4 border-foreground shadow-[0_6px_0_hsl(355,65%,30%)]">
                <div className="w-16 h-16 rounded-full bg-primary text-background font-black text-3xl flex items-center justify-center border-4 border-foreground mb-6 shadow-lg">3</div>
                <h3 className="text-2xl font-black text-foreground mb-3">ادفع بعد الشغل</h3>
                <p className="text-lg font-bold text-foreground/80">
                  بعد ما الشغل يخلص وتطمن، حاسب الصنايعي وسيب تقييمك.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="container mb-10">
          <div className="bg-primary rounded-[3rem] border-4 border-foreground p-10 md:p-16 text-center shadow-[0_12px_0_hsl(355,80%,20%)] relative overflow-hidden">
            <Star className="absolute top-10 left-10 w-20 h-20 text-background/20 animate-pulse-soft" />
            <Star className="absolute bottom-10 right-10 w-32 h-32 text-background/20 animate-pulse-soft" style={{ animationDelay: '1s' }} />

            <h2 className="text-4xl md:text-6xl font-black text-background uppercase mb-8 relative z-10">
              ليه الناس بتختارنا؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto relative z-10 text-right">
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-background/20 flex items-center gap-4 flex-row-reverse">
                <CheckCircle2 className="w-8 h-8 text-background flex-shrink-0" />
                <p className="text-xl font-bold text-background">ضمان على الشغل المخلص</p>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-background/20 flex items-center gap-4 flex-row-reverse">
                <CheckCircle2 className="w-8 h-8 text-background flex-shrink-0" />
                <p className="text-xl font-bold text-background">أسعار واضحة ومفيش مفاجآت</p>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-background/20 flex items-center gap-4 flex-row-reverse">
                <CheckCircle2 className="w-8 h-8 text-background flex-shrink-0" />
                <p className="text-xl font-bold text-background">صنايعية متراجعين ومتجربين</p>
              </div>
              <div className="bg-background/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-background/20 flex items-center gap-4 flex-row-reverse">
                <CheckCircle2 className="w-8 h-8 text-background flex-shrink-0" />
                <p className="text-xl font-bold text-background">دعم فني جاهز يحل مشاكلك</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Area (Deep Red) */}
      <div className="bg-primary text-primary-foreground border-t-4 border-foreground py-20 text-center relative overflow-hidden">
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-widest px-4 leading-normal opacity-90 drop-shadow-md">
          صنايعي <br /> في الإنجاز
        </h2>
      </div>
    </div>
  );
};

export default Home;
