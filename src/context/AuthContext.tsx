import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Location, ServiceType, ExperienceLevel, Technician } from '@/types';
import { getLocalStorageTechnicians, saveLocalStorageTechnicians } from '@/data/technicians';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<{ success: boolean; message: string; role?: 'customer' | 'technician' | 'admin' }>;
  register: (
    name: string,
    phone: string,
    address: string,
    location: Location,
    role?: 'customer' | 'technician',
    techDetails?: {
      serviceType: ServiceType;
      experienceLevel: ExperienceLevel;
      priceRangeMin: number;
      priceRangeMax: number;
      yearsOfExperience: number;
      nationalId: string;
      criminalRecordNumber: string;
    }
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    name: string,
    phone: string,
    address: string,
    location: Location,
    techDetails?: {
      priceRangeMin?: number;
      priceRangeMax?: number;
      yearsOfExperience?: number;
      availableHours?: string[];
      serviceType?: ServiceType;
      experienceLevel?: ExperienceLevel;
    }
  ) => Promise<{ success: boolean; message: string }>;
  demoAccounts: User[];
  demoTechnicians: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo customer accounts
const DEMO_ACCOUNTS: User[] = [
  {
    id: 'admin-1',
    name: 'مدير النظام (أدمن)',
    phone: '01000000000',
    address: 'المقر الرئيسي، التجمع الخامس',
    location: 'التجمع الخامس',
    role: 'admin',
  },
  {
    id: 'demo-1',
    name: 'أحمد محمد (زبون)',
    phone: '01012345678',
    address: '12 شارع عباس العقاد، الدور الرابع شقة 8',
    location: 'مدينة نصر',
    role: 'customer',
  },
  {
    id: 'demo-2',
    name: 'سارة أحمد (زبونة)',
    phone: '01234567890',
    address: '45 شارع التسعين الشمالي، بجوار وترواي',
    location: 'التجمع الخامس',
    role: 'customer',
  },
];

// Demo technician accounts (representing Ahmed Hassan e.g. p1)
const DEMO_TECHNICIANS: User[] = [
  {
    id: 'USR-TECH-p1',
    name: 'أحمد حسن (صنايعي سباك)',
    phone: '01011111111',
    location: 'مدينة نصر',
    role: 'technician',
    technicianId: 'p1',
  },
  {
    id: 'USR-TECH-p2',
    name: 'محمد علي (صنايعي سباك)',
    phone: '01022222222',
    location: 'المعادي',
    role: 'technician',
    technicianId: 'p2',
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Seed initial technicians database in localStorage if empty
    getLocalStorageTechnicians();

    // Check if there is an active session
    const activeSession = localStorage.getItem('sanay3i_active_user');
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        console.error('Failed to parse active session', e);
      }
    }
    
    // Initialize demo accounts in registered users list if empty
    const registered = localStorage.getItem('sanay3i_registered_users');
    if (!registered) {
      localStorage.setItem('sanay3i_registered_users', JSON.stringify(DEMO_ACCOUNTS));
    }
    
    setIsLoading(false);
  }, []);

  const getRegisteredUsers = (): User[] => {
    const list = localStorage.getItem('sanay3i_registered_users');
    return list ? JSON.parse(list) : DEMO_ACCOUNTS;
  };

  const saveRegisteredUsers = (users: User[]) => {
    localStorage.setItem('sanay3i_registered_users', JSON.stringify(users));
  };

  const login = async (phone: string): Promise<{ success: boolean; message: string; role?: 'customer' | 'technician' | 'admin' }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 1. Check Admin Account (Superuser)
    if (phone === '01000000000') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'مدير النظام (أدمن)',
        phone: '01000000000',
        location: 'التجمع الخامس',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('sanay3i_active_user', JSON.stringify(adminUser));
      setIsLoading(false);
      return { success: true, message: 'تم تسجيل دخول المسؤول بنجاح!', role: 'admin' };
    }

    // 2. Check Technicians database
    const techs = getLocalStorageTechnicians();
    const foundTech = techs.find((t) => t.phone === phone);
    if (foundTech) {
      const techUser: User = {
        id: `USR-TECH-${foundTech.id}`,
        name: foundTech.name,
        phone: foundTech.phone || phone,
        location: foundTech.location,
        role: 'technician',
        technicianId: foundTech.id,
      };
      setUser(techUser);
      localStorage.setItem('sanay3i_active_user', JSON.stringify(techUser));
      setIsLoading(false);
      return { success: true, message: 'تم تسجيل دخول الصنايعي بنجاح!', role: 'technician' };
    }

    // 3. Check Customers database
    const users = getRegisteredUsers();
    const foundCustomer = users.find((u) => u.phone === phone);

    if (foundCustomer) {
      const customerUser: User = {
        ...foundCustomer,
        role: foundCustomer.role || 'customer',
      };
      setUser(customerUser);
      localStorage.setItem('sanay3i_active_user', JSON.stringify(customerUser));
      setIsLoading(false);
      return { success: true, message: 'تم تسجيل الدخول بنجاح!', role: 'customer' };
    } else {
      setIsLoading(false);
      return { success: false, message: 'رقم الهاتف ده مش مسجل. يرجى إنشاء حساب أولاً.' };
    }
  };

  const register = async (
    name: string,
    phone: string,
    address: string,
    location: Location,
    role: 'customer' | 'technician' = 'customer',
    techDetails?: {
      serviceType: ServiceType;
      experienceLevel: ExperienceLevel;
      priceRangeMin: number;
      priceRangeMax: number;
      yearsOfExperience: number;
      nationalId: string;
      criminalRecordNumber: string;
    }
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 850));

    // Ensure phone number is not taken by customers, technicians or admin
    const users = getRegisteredUsers();
    const techs = getLocalStorageTechnicians();

    const phoneExistsInCustomers = users.some((u) => u.phone === phone);
    const phoneExistsInTechs = techs.some((t) => t.phone === phone);

    if (phoneExistsInCustomers || phoneExistsInTechs || phone === '01000000000') {
      setIsLoading(false);
      return { success: false, message: 'رقم الهاتف ده مسجل قبل كده فعلاً. جرب تسجل دخول.' };
    }

    if (role === 'technician' && techDetails) {
      // Create a new Technician record
      const newTechId = `tech-${Date.now()}`;
      const newTech: Technician = {
        id: newTechId,
        name,
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
        serviceType: techDetails.serviceType,
        experienceLevel: techDetails.experienceLevel,
        location,
        priceRangeMin: techDetails.priceRangeMin,
        priceRangeMax: techDetails.priceRangeMax,
        reliabilityScore: 100,
        verified: false, // Default is false, needs admin approval!
        arrivalWindow: '10:00 AM - 12:00 PM',
        yearsOfExperience: techDetails.yearsOfExperience,
        completedJobs: 0,
        phone,
        nationalId: techDetails.nationalId,
        criminalRecordNumber: techDetails.criminalRecordNumber,
        criminalRecordAttached: true,
        availableHours: ['10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM'],
      };

      const updatedTechs = [...techs, newTech];
      saveLocalStorageTechnicians(updatedTechs);

      const techUser: User = {
        id: `USR-TECH-${newTechId}`,
        name,
        phone,
        location,
        role: 'technician',
        technicianId: newTechId,
      };

      setUser(techUser);
      localStorage.setItem('sanay3i_active_user', JSON.stringify(techUser));
      setIsLoading(false);
      return { success: true, message: 'تم إنشاء الحساب بنجاح! في انتظار موافقة الإدارة لتفعيل حسابك.' };
    } else {
      // Create Customer Account
      const newUser: User = {
        id: `USR-${Date.now()}`,
        name,
        phone,
        address,
        location,
        role: 'customer',
      };

      const updatedUsers = [...users, newUser];
      saveRegisteredUsers(updatedUsers);
      setUser(newUser);
      localStorage.setItem('sanay3i_active_user', JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true, message: 'تم إنشاء الحساب وتدوين الدخول بنجاح!' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sanay3i_active_user');
  };

  const updateProfile = async (
    name: string,
    phone: string,
    address: string,
    location: Location,
    techDetails?: {
      priceRangeMin?: number;
      priceRangeMax?: number;
      yearsOfExperience?: number;
      availableHours?: string[];
      serviceType?: ServiceType;
      experienceLevel?: ExperienceLevel;
    }
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'مفيش مستخدم مسجل حالياً' };
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (user.role === 'technician' && user.technicianId) {
      // Update Technician
      const techs = getLocalStorageTechnicians();
      
      const phoneTaken = techs.some((t) => t.phone === phone && t.id !== user.technicianId);
      if (phoneTaken) {
        setIsLoading(false);
        return { success: false, message: 'رقم التليفون الجديد ده مستخدم لحساب تاني!' };
      }

      const updatedTechs = techs.map((t) => {
        if (t.id === user.technicianId) {
          return {
            ...t,
            name,
            phone,
            location,
            priceRangeMin: techDetails?.priceRangeMin ?? t.priceRangeMin,
            priceRangeMax: techDetails?.priceRangeMax ?? t.priceRangeMax,
            yearsOfExperience: techDetails?.yearsOfExperience ?? t.yearsOfExperience,
            availableHours: techDetails?.availableHours ?? t.availableHours,
            serviceType: techDetails?.serviceType ?? t.serviceType,
            experienceLevel: techDetails?.experienceLevel ?? t.experienceLevel,
          };
        }
        return t;
      });
      saveLocalStorageTechnicians(updatedTechs);

      const updatedUser: User = {
        ...user,
        name,
        phone,
        location,
      };
      setUser(updatedUser);
      localStorage.setItem('sanay3i_active_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return { success: true, message: 'تم تحديث بيانات ملفك كصنايعي!' };
    } else {
      // Update Customer
      const users = getRegisteredUsers();
      
      const phoneTaken = users.some((u) => u.phone === phone && u.id !== user.id);
      if (phoneTaken) {
        setIsLoading(false);
        return { success: false, message: 'رقم التليفون الجديد ده مستخدم لحساب تاني!' };
      }

      const updatedUser: User = {
        ...user,
        name,
        phone,
        address,
        location,
      };

      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
      saveRegisteredUsers(updatedUsers);

      setUser(updatedUser);
      localStorage.setItem('sanay3i_active_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return { success: true, message: 'تم تحديث البيانات بنجاح!' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        demoAccounts: DEMO_ACCOUNTS,
        demoTechnicians: DEMO_TECHNICIANS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
