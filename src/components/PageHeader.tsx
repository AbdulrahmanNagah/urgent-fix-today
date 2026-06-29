import { ArrowRight, User as UserIcon, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backPath?: string;
}

export const PageHeader = ({ title, subtitle, showBack = true, backPath }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const showUserBtn = pathname !== '/login' && pathname !== '/account';

  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b-2 border-foreground">
      <div className="container py-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -mr-2 rounded-full hover:bg-secondary transition-colors border-2 border-transparent hover:border-foreground"
              aria-label="ارجع"
            >
              <ArrowRight className="w-6 h-6 text-foreground" />
            </button>
          )}
          
          <div className="text-right flex-1">
            <h1 className="text-2xl font-black text-foreground uppercase">{title}</h1>
            {subtitle && <p className="text-sm font-semibold text-foreground/80">{subtitle}</p>}
          </div>

          {/* User Account / Login Button */}
          {showUserBtn && (
            <div className="text-left animate-fade-in">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/account')}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary border-2 border-foreground rounded-full hover:bg-background transition-all font-black text-sm"
                >
                  <span className="max-w-[80px] truncate">{user?.name.split(' ')[0]}</span>
                  <UserIcon className="w-4 h-4 text-primary" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border-2 border-foreground rounded-full hover:translate-y-[1px] hover:shadow-none transition-all font-black text-sm shadow-[0_3px_0_hsl(355,80%,20%)]"
                >
                  <span>دخول</span>
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
