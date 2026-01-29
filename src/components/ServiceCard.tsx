import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  examples: string[];
  onClick: () => void;
}

export const ServiceCard = ({ title, description, icon: Icon, examples, onClick }: ServiceCardProps) => {
  return (
    <button
      onClick={onClick}
      className="card-trust w-full p-6 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <span
                key={example}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};
