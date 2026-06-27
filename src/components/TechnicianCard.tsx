import { Shield, Clock, Award, MapPin } from 'lucide-react';
import { Technician } from '@/types';
import { StarRating } from './StarRating';

interface TechnicianCardProps {
  technician: Technician;
  onClick: () => void;
}

const experienceBadgeColors = {
  junior: 'bg-secondary text-secondary-foreground border-2 border-foreground',
  mid: 'bg-background text-foreground border-2 border-foreground',
  senior: 'bg-primary text-primary-foreground border-2 border-foreground',
};

const experienceLabels = {
  junior: 'صنايعي',
  mid: 'خبرة',
  senior: 'أسطى',
};

export const TechnicianCard = ({ technician, onClick }: TechnicianCardProps) => {
  const reliabilityStars = Math.round(technician.reliabilityScore / 20);

  return (
    <button
      onClick={onClick}
      className="card-trust w-full h-full p-5 text-right transition-all hover:-translate-y-1 bg-background flex flex-col justify-between"
    >
      <div className="flex gap-4 flex-row-reverse mb-4">
        {/* Photo */}
        <div className="relative flex-shrink-0">
          <img
            src={technician.photoUrl}
            alt={technician.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-foreground"
          />
          {technician.verified && (
            <div className="absolute -bottom-2 -left-2 bg-foreground text-background rounded-full p-1 border-2 border-foreground">
              <Shield className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-right flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2 mb-2 flex-row-reverse">
            <h3 className="text-xl font-bold text-foreground truncate">{technician.name}</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${experienceBadgeColors[technician.experienceLevel]}`}>
              {experienceLabels[technician.experienceLevel]}
            </span>
          </div>

          {/* Reliability */}
          <div className="flex items-center gap-2 mb-3 flex-row-reverse justify-start">
            <StarRating rating={reliabilityStars} size="sm" />
            <span className="text-sm font-semibold text-foreground/80">
              {technician.reliabilityScore}% نسبة الثقة
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-foreground/80 flex-row-reverse justify-start flex-wrap">
            <div className="flex items-center gap-1 flex-row-reverse">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">{technician.location}</span>
            </div>
            <div className="flex items-center gap-1 flex-row-reverse">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">{technician.arrivalWindow}</span>
            </div>
            <div className="flex items-center gap-1 flex-row-reverse">
              <Award className="w-4 h-4 text-foreground" />
              <span className="font-bold">{technician.completedJobs} شغلانة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mt-auto pt-4 border-t-2 border-foreground flex items-center justify-between flex-row-reverse w-full">
        <span className="text-sm font-semibold text-foreground/80">السعر المتوقع</span>
        <span className="text-lg font-black text-primary">
          {technician.priceRangeMin} - {technician.priceRangeMax} جنيه
        </span>
      </div>
    </button>
  );
};
