import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backPath?: string;
}

export const PageHeader = ({ title, subtitle, showBack = true, backPath }: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b-2 border-foreground">
      <div className="container py-4">
        <div className="flex items-center gap-4 flex-row-reverse">
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
        </div>
      </div>
    </header>
  );
};
