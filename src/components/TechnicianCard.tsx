import { Shield, Clock, Award } from 'lucide-react';
import { Technician } from '@/types';
import { StarRating } from './StarRating';

interface TechnicianCardProps {
  technician: Technician;
  onClick: () => void;
}

const experienceBadgeColors = {
  junior: 'bg-secondary text-secondary-foreground',
  mid: 'bg-primary/10 text-primary',
  senior: 'bg-accent/10 text-accent',
};

const experienceLabels = {
  junior: 'Junior',
  mid: 'Mid-Level',
  senior: 'Senior',
};

export const TechnicianCard = ({ technician, onClick }: TechnicianCardProps) => {
  const reliabilityStars = Math.round(technician.reliabilityScore / 20);

  return (
    <button
      onClick={onClick}
      className="card-trust w-full p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] animate-fade-in"
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="relative flex-shrink-0">
          <img
            src={technician.photoUrl}
            alt={technician.name}
            className="w-16 h-16 rounded-xl object-cover"
          />
          {technician.verified && (
            <div className="absolute -bottom-1 -right-1 bg-success text-success-foreground rounded-full p-1">
              <Shield className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{technician.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${experienceBadgeColors[technician.experienceLevel]}`}>
              {experienceLabels[technician.experienceLevel]}
            </span>
          </div>

          {/* Reliability */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={reliabilityStars} size="sm" />
            <span className="text-xs font-medium text-muted-foreground">
              {technician.reliabilityScore}% reliable
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <span className="font-medium text-foreground">{technician.arrivalWindow}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{technician.completedJobs} jobs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Estimated price</span>
        <span className="font-bold text-primary">
          {technician.priceRangeMin} - {technician.priceRangeMax} EGP
        </span>
      </div>
    </button>
  );
};
