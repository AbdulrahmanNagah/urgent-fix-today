import { Technician, ServiceType } from '@/types';

export const technicians: Technician[] = [
  // Plumbers
  {
    id: 'p1',
    name: 'Ahmed Hassan',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    serviceType: 'plumbing',
    experienceLevel: 'senior',
    location: 'مدينة نصر',
    priceRangeMin: 300,
    priceRangeMax: 600,
    reliabilityScore: 98,
    verified: true,
    arrivalWindow: '10:00 AM - 11:00 AM',
    yearsOfExperience: 12,
    completedJobs: 847,
    phone: '01011111111',
  },
  {
    id: 'p2',
    name: 'Mohamed Ali',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    serviceType: 'plumbing',
    experienceLevel: 'mid',
    location: 'المعادي',
    priceRangeMin: 200,
    priceRangeMax: 400,
    reliabilityScore: 92,
    verified: true,
    arrivalWindow: '11:00 AM - 12:00 PM',
    yearsOfExperience: 6,
    completedJobs: 312,
    phone: '01022222222',
  },
  {
    id: 'p3',
    name: 'Khaled Ibrahim',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    serviceType: 'plumbing',
    experienceLevel: 'junior',
    location: 'التجمع الخامس',
    priceRangeMin: 150,
    priceRangeMax: 300,
    reliabilityScore: 85,
    verified: true,
    arrivalWindow: '12:00 PM - 1:00 PM',
    yearsOfExperience: 2,
    completedJobs: 89,
  },
  {
    id: 'p4',
    name: 'Youssef Mahmoud',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    serviceType: 'plumbing',
    experienceLevel: 'senior',
    location: 'الشيخ زايد',
    priceRangeMin: 350,
    priceRangeMax: 700,
    reliabilityScore: 96,
    verified: true,
    arrivalWindow: '2:00 PM - 3:00 PM',
    yearsOfExperience: 15,
    completedJobs: 1203,
  },
  {
    id: 'p5',
    name: 'Omar Saeed',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    serviceType: 'plumbing',
    experienceLevel: 'mid',
    location: 'مصر الجديدة',
    priceRangeMin: 180,
    priceRangeMax: 350,
    reliabilityScore: 88,
    verified: false,
    arrivalWindow: '3:00 PM - 4:00 PM',
    yearsOfExperience: 4,
    completedJobs: 156,
  },
  {
    id: 'p6',
    name: 'Tarek Fawzy',
    photoUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face',
    serviceType: 'plumbing',
    experienceLevel: 'junior',
    location: 'مدينة نصر',
    priceRangeMin: 120,
    priceRangeMax: 250,
    reliabilityScore: 82,
    verified: true,
    arrivalWindow: '4:00 PM - 5:00 PM',
    yearsOfExperience: 1,
    completedJobs: 45,
  },
  // Electricians
  {
    id: 'e1',
    name: 'Amr Saleh',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    serviceType: 'electrical',
    experienceLevel: 'senior',
    location: 'التجمع الخامس',
    priceRangeMin: 400,
    priceRangeMax: 800,
    reliabilityScore: 99,
    verified: true,
    arrivalWindow: '9:00 AM - 10:00 AM',
    yearsOfExperience: 18,
    completedJobs: 1567,
  },
  {
    id: 'e2',
    name: 'Hossam Nabil',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face',
    serviceType: 'electrical',
    experienceLevel: 'mid',
    location: 'المعادي',
    priceRangeMin: 250,
    priceRangeMax: 500,
    reliabilityScore: 94,
    verified: true,
    arrivalWindow: '10:00 AM - 11:00 AM',
    yearsOfExperience: 7,
    completedJobs: 423,
  },
  {
    id: 'e3',
    name: 'Sherif Kamal',
    photoUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face',
    serviceType: 'electrical',
    experienceLevel: 'junior',
    location: 'مدينة نصر',
    priceRangeMin: 180,
    priceRangeMax: 350,
    reliabilityScore: 86,
    verified: true,
    arrivalWindow: '11:00 AM - 12:00 PM',
    yearsOfExperience: 3,
    completedJobs: 112,
  },
  {
    id: 'e4',
    name: 'Wael Mostafa',
    photoUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=face',
    serviceType: 'electrical',
    experienceLevel: 'senior',
    location: 'مصر الجديدة',
    priceRangeMin: 450,
    priceRangeMax: 900,
    reliabilityScore: 97,
    verified: true,
    arrivalWindow: '1:00 PM - 2:00 PM',
    yearsOfExperience: 14,
    completedJobs: 982,
  },
  {
    id: 'e5',
    name: 'Kareem Adel',
    photoUrl: 'https://images.unsplash.com/photo-1542178243-bc20974f57b4?w=200&h=200&fit=crop&crop=face',
    serviceType: 'electrical',
    experienceLevel: 'mid',
    location: 'الشيخ زايد',
    priceRangeMin: 220,
    priceRangeMax: 450,
    reliabilityScore: 91,
    verified: true,
    arrivalWindow: '2:00 PM - 3:00 PM',
    yearsOfExperience: 5,
    completedJobs: 234,
  },
  {
    id: 'e6',
    name: 'Mahmoud Zaki',
    photoUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&h=200&fit=crop&crop=face',
    serviceType: 'electrical',
    experienceLevel: 'junior',
    location: 'المعادي',
    priceRangeMin: 150,
    priceRangeMax: 300,
    reliabilityScore: 83,
    verified: false,
    arrivalWindow: '4:00 PM - 5:00 PM',
    yearsOfExperience: 2,
    completedJobs: 67,
  },
  // Carpentry
  {
    id: 'c1',
    name: 'Hassan Nasr',
    photoUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=200&fit=crop&crop=face',
    serviceType: 'carpentry',
    experienceLevel: 'senior',
    location: 'التجمع الخامس',
    priceRangeMin: 300,
    priceRangeMax: 600,
    reliabilityScore: 95,
    verified: true,
    arrivalWindow: '10:00 AM - 12:00 PM',
    yearsOfExperience: 20,
    completedJobs: 1420,
  },
  // HVAC
  {
    id: 'h1',
    name: 'Sayed Fathy',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face',
    serviceType: 'hvac',
    experienceLevel: 'mid',
    location: 'مدينة نصر',
    priceRangeMin: 400,
    priceRangeMax: 800,
    reliabilityScore: 92,
    verified: true,
    arrivalWindow: '11:00 AM - 2:00 PM',
    yearsOfExperience: 8,
    completedJobs: 650,
  },
  // Appliances
  {
    id: 'a1',
    name: 'Yasser Gamal',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    serviceType: 'appliances',
    experienceLevel: 'senior',
    location: 'الشيخ زايد',
    priceRangeMin: 200,
    priceRangeMax: 500,
    reliabilityScore: 98,
    verified: true,
    arrivalWindow: '1:00 PM - 3:00 PM',
    yearsOfExperience: 15,
    completedJobs: 2100,
  },
  // Painting
  {
    id: 'pa1',
    name: 'Mohsen Nabil',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    serviceType: 'painting',
    experienceLevel: 'mid',
    location: 'مصر الجديدة',
    priceRangeMin: 500,
    priceRangeMax: 1500,
    reliabilityScore: 89,
    verified: true,
    arrivalWindow: '9:00 AM - 11:00 AM',
    yearsOfExperience: 6,
    completedJobs: 130,
  },
];

export const getLocalStorageTechnicians = (): Technician[] => {
  if (typeof window === 'undefined') return technicians;
  const saved = localStorage.getItem('sanay3i_technicians');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse technicians from localStorage', e);
    }
  }
  localStorage.setItem('sanay3i_technicians', JSON.stringify(technicians));
  return technicians;
};

export const saveLocalStorageTechnicians = (techs: Technician[]) => {
  localStorage.setItem('sanay3i_technicians', JSON.stringify(techs));
};

export const getTechniciansByService = (serviceType: ServiceType): Technician[] => {
  const allTechs = getLocalStorageTechnicians();
  return allTechs
    .filter((t) => t.serviceType === serviceType && t.verified === true)
    .sort((a, b) => {
      // Sort by arrival time (earliest first)
      const timeA = a.arrivalWindow.split(' - ')[0];
      const timeB = b.arrivalWindow.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });
};

export const getTechnicianById = (id: string): Technician | undefined => {
  const allTechs = getLocalStorageTechnicians();
  return allTechs.find((t) => t.id === id);
};

export const getUnverifiedTechnicians = (): Technician[] => {
  const allTechs = getLocalStorageTechnicians();
  return allTechs.filter((t) => !t.verified);
};

export const verifyTechnician = (id: string): boolean => {
  const allTechs = getLocalStorageTechnicians();
  const techIndex = allTechs.findIndex((t) => t.id === id);
  if (techIndex > -1) {
    allTechs[techIndex].verified = true;
    saveLocalStorageTechnicians(allTechs);
    return true;
  }
  return false;
};

export const rejectTechnician = (id: string): boolean => {
  const allTechs = getLocalStorageTechnicians();
  const filtered = allTechs.filter((t) => t.id !== id);
  if (filtered.length !== allTechs.length) {
    saveLocalStorageTechnicians(filtered);
    return true;
  }
  return false;
};
