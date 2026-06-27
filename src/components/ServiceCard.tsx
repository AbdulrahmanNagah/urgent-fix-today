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
      className="card-trust w-full p-6 text-right transition-all hover:-translate-y-1 group bg-background"
    >
      <div className="flex items-start gap-4 flex-row-reverse">
        <div className="p-3 rounded-2xl bg-primary text-primary-foreground transition-colors border-2 border-foreground">
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-base text-foreground/80 mb-4">{description}</p>
          <div className="flex flex-wrap gap-2 justify-end">
            {examples.map((example) => (
              <span
                key={example}
                className="text-sm font-semibold border-2 border-foreground text-foreground px-3 py-1 rounded-full bg-secondary"
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
