import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in bg-secondary rounded-[2rem] border-2 border-foreground shadow-[0_8px_0_hsl(355,65%,30%)]">
      <div className="p-5 rounded-2xl bg-primary mb-6 border-2 border-foreground text-background">
        {icon || <AlertCircle className="w-10 h-10" />}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-base font-semibold text-foreground/80 max-w-xs mb-6 leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary text-lg"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
