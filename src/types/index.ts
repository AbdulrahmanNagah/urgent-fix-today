// Sanay3i MVP Types

export type ServiceType = 'plumbing' | 'electrical' | 'carpentry' | 'hvac' | 'appliances' | 'painting';

export type ExperienceLevel = 'junior' | 'mid' | 'senior';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type IssueFlag = 'no-show' | 'late' | 'poor-work' | null;

export type Location = 'مدينة نصر' | 'المعادي' | 'التجمع الخامس' | 'الشيخ زايد' | 'مصر الجديدة';

export interface Technician {
  id: string;
  name: string;
  photoUrl: string;
  serviceType: ServiceType;
  experienceLevel: ExperienceLevel;
  location: Location;
  priceRangeMin: number;
  priceRangeMax: number;
  reliabilityScore: number; // 0-100
  verified: boolean;
  arrivalWindow: string; // e.g., "10:00 AM - 12:00 PM"
  yearsOfExperience: number;
  completedJobs: number;
}

export interface BookingRequest {
  id: string;
  technicianId: string;
  userName: string;
  phone: string;
  address: string;
  problemDescription: string;
  selectedService: ServiceType;
  status: BookingStatus;
  createdAt: Date;
  arrivalWindow: string;
}

export interface Feedback {
  id: string;
  bookingId: string;
  rating: number; // 1-5
  comment: string;
  issueFlag: IssueFlag;
  submittedAt: Date;
}

// Form validation types
export interface BookingFormData {
  userName: string;
  phone: string;
  address: string;
  problemDescription: string;
}

export interface FeedbackFormData {
  rating: number;
  comment: string;
  issueFlag: IssueFlag;
}
