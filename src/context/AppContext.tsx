import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  AuthUser,
  Company, 
  JobCircular, 
  JobCategory, 
  Application, 
  PaymentTransaction, 
  ApplicantProfile, 
  SystemSettings, 
  SystemNotification, 
  AuditLog, 
  PaymentMethod, 
  ApplicationStatus,
  Wallet
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_COMPANIES, 
  INITIAL_JOBS, 
  INITIAL_APPLICANT, 
  INITIAL_APPLICATIONS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SETTINGS 
} from '../data/initialData';
import { translations, Language } from '../utils/translations';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

interface AppContextType {
  currentUser: AuthUser | null;
  role: UserRole | 'guest';
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['bn']) => string;
  firebaseConnected: boolean;
  
  // Real Auth Actions (NO DUMMY DEMO ACCOUNTS)
  login: (identifier: string, password: string) => Promise<{ success: boolean; role?: UserRole; message?: string }>;
  registerSeeker: (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    district: string;
    nidNumber?: string;
    highestDegree?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  
  // Data
  jobs: JobCircular[];
  companies: Company[];
  categories: JobCategory[];
  applications: Application[];
  transactions: PaymentTransaction[];
  applicantProfile: ApplicantProfile;
  notifications: SystemNotification[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  currentCompany: Company;
  setCurrentCompanyId: (id: string) => void;
  
  // Job Actions
  addJob: (jobData: Partial<JobCircular>) => Promise<JobCircular>;
  updateJob: (id: string, updates: Partial<JobCircular>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  toggleFeaturedJob: (id: string) => Promise<void>;
  toggleUrgentJob: (id: string) => Promise<void>;
  
  // Secret Admin Company Issuance
  createCompanyAccountByAdmin: (companyData: Partial<Company> & { accessCode: string; loginEmail?: string }) => Promise<Company>;
  approveCompany: (id: string) => Promise<void>;
  rejectCompany: (id: string) => Promise<void>;
  suspendCompany: (id: string) => Promise<void>;
  toggleVerifyCompany: (id: string) => Promise<void>;
  updateCompanyProfile: (id: string, data: Partial<Company>) => Promise<void>;
  
  // Application Actions
  submitApplication: (
    jobId: string, 
    paymentMethod: PaymentMethod, 
    paymentSenderPhone?: string,
    paymentTrxId?: string,
    customData?: { coverLetter?: string; expectedSalary?: number }
  ) => Promise<{ success: boolean; application: Application; transaction?: PaymentTransaction }>;
  updateApplicationStatus: (
    applicationId: string, 
    status: ApplicationStatus, 
    interviewDetails?: Application['interviewSchedule']
  ) => Promise<void>;
  
  // Applicant Actions
  toggleSaveJob: (jobId: string) => void;
  toggleFollowCompany: (companyId: string) => void;
  updateApplicantProfile: (updates: Partial<ApplicantProfile>) => void;
  
  // Admin & Category Actions
  addCategory: (cat: Omit<JobCategory, 'id' | 'activeJobsCount'>) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  
  // Notifications & Audit
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // UI Navigation / View State
  activeView: string;
  setActiveView: (view: string) => void;
  selectedJob: JobCircular | null;
  setSelectedJob: (job: JobCircular | null) => void;
  selectedReceipt: PaymentTransaction | null;
  setSelectedReceipt: (tx: PaymentTransaction | null) => void;
  applyingJob: JobCircular | null;
  setApplyingJob: (job: JobCircular | null) => void;
  showCvModal: boolean;
  setShowCvModal: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  
  // Reset
  resetSystemData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'gn_auth_user_real_v3',
  LANG: 'gn_lang_v3',
  JOBS: 'gn_jobs_v3',
  COMPANIES: 'gn_companies_v3',
  CATEGORIES: 'gn_categories_v3',
  APPLICATIONS: 'gn_applications_v3',
  TRANSACTIONS: 'gn_transactions_v3',
  APPLICANT: 'gn_applicant_v3',
  SETTINGS: 'gn_settings_v3',
  NOTIFICATIONS: 'gn_notifications_v3',
  AUDIT_LOGS: 'gn_audit_v3',
  CURRENT_COMPANY: 'gn_current_comp_id_v3'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real Auth User - Starts as null (NO DEMO PRE-LOGIN)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const role: UserRole | 'guest' = currentUser ? currentUser.role : 'guest';

  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'bn';
  });

  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  const [jobs, setJobs] = useState<JobCircular[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [currentCompanyId, setCurrentCompanyIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_COMPANY) || 'comp-1';
  });

  const [categories, setCategories] = useState<JobCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [applicantProfile, setApplicantProfile] = useState<ApplicantProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICANT);
    return saved ? JSON.parse(saved) : INITIAL_APPLICANT;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  // UI state
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedJob, setSelectedJob] = useState<JobCircular | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobCircular | null>(null);
  const [showCvModal, setShowCvModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICANT, JSON.stringify(applicantProfile));
  }, [applicantProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Real-time Firestore sync
  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'global');
    const unsubSettings = onSnapshot(settingsDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SystemSettings;
        setSettings(prev => ({ ...prev, ...data }));
        setFirebaseConnected(true);
      } else {
        setDoc(settingsDocRef, INITIAL_SETTINGS).catch(console.error);
      }
    }, (err) => {
      console.warn('[Firestore] Settings sync notice:', err.message);
    });

    const appsColRef = collection(db, 'applications');
    const unsubApps = onSnapshot(appsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const remoteApps: Application[] = [];
        snapshot.forEach((d) => {
          remoteApps.push({ id: d.id, ...(d.data() as any) });
        });
        setApplications(remoteApps);
      }
    }, (err) => {
      console.warn('[Firestore] Applications sync notice:', err.message);
    });

    const compColRef = collection(db, 'companies');
    const unsubComp = onSnapshot(compColRef, (snapshot) => {
      if (!snapshot.empty) {
        const remoteComp: Company[] = [];
        snapshot.forEach((d) => {
          remoteComp.push({ id: d.id, ...(d.data() as any) });
        });
        setCompanies(remoteComp);
      }
    }, (err) => {
      console.warn('[Firestore] Companies sync notice:', err.message);
    });

    const jobsColRef = collection(db, 'jobs');
    const unsubJobs = onSnapshot(jobsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const remoteJobs: JobCircular[] = [];
        snapshot.forEach((d) => {
          remoteJobs.push({ id: d.id, ...(d.data() as any) });
        });
        setJobs(remoteJobs);
      }
    }, (err) => {
      console.warn('[Firestore] Jobs sync notice:', err.message);
    });

    return () => {
      unsubSettings();
      unsubApps();
      unsubComp();
      unsubJobs();
    };
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
  };

  const setCurrentCompanyId = (id: string) => {
    setCurrentCompanyIdState(id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_COMPANY, id);
  };

  const currentCompany = companies.find(c => c.id === currentCompanyId) || companies[0];

  const t = (key: keyof typeof translations['bn']): string => {
    return translations[lang][key] || translations['bn'][key] || key;
  };

  const addAudit = async (action: string, target: string, details: string) => {
    const actor = currentUser?.name || 'Guest User';
    const actorR = currentUser?.role || 'applicant';
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: actor,
      actorRole: actorR,
      action,
      target,
      details,
      timestamp: new Date().toLocaleString('en-GB')
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
    try {
      await setDoc(doc(db, 'audit_logs', newLog.id), newLog);
    } catch (e) {}
  };

  // -------------------------------------------------------------
  // REAL AUTHENTICATION ENGINE (NO DEMO ACCOUNTS)
  // -------------------------------------------------------------
  const login = async (identifier: string, pass: string): Promise<{ success: boolean; role?: UserRole; message?: string }> => {
    const cleanId = identifier.trim();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'ইউজারনেম এবং পাসওয়ার্ড উভয়ই প্রদান করুন।' };
    }

    // 1. Super Admin Secret Check
    const adminUser = settings.adminUsername || 'admin';
    const adminPass = settings.adminSecretPassword || 'Admin@Garments2026!';
    if (cleanId.toLowerCase() === adminUser.toLowerCase() && cleanPass === adminPass) {
      const adminUserObj: AuthUser = {
        id: 'super-admin-root',
        name: 'সুপার অ্যাডমিন (Super Admin)',
        email: 'superadmin@garmentsniyog.com.bd',
        role: 'super_admin',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(adminUserObj);
      setActiveView('admin_dashboard');
      addAudit('ADMIN_LOGIN', 'Super Admin Console', 'Super admin authenticated with secret credentials');
      return { success: true, role: 'super_admin' };
    }

    // 2. Company / Factory Secret Check (Issued exclusively by Admin)
    const matchedCompany = companies.find(c => 
      c.email.toLowerCase() === cleanId.toLowerCase() && c.accessCode === cleanPass
    );
    if (matchedCompany) {
      const compUserObj: AuthUser = {
        id: matchedCompany.id,
        name: matchedCompany.name,
        email: matchedCompany.email,
        phone: matchedCompany.phone,
        role: 'company',
        companyId: matchedCompany.id,
        avatar: matchedCompany.logo,
        createdAt: new Date().toISOString()
      };
      setCurrentCompanyId(matchedCompany.id);
      setCurrentUser(compUserObj);
      setActiveView('company_dashboard');
      addAudit('COMPANY_LOGIN', matchedCompany.name, `Factory ${matchedCompany.name} logged in`);
      return { success: true, role: 'company' };
    }

    // 3. Seeker / Applicant Check
    if (
      (cleanId.toLowerCase() === applicantProfile.email.toLowerCase() || cleanId === applicantProfile.phone)
    ) {
      const seekerUserObj: AuthUser = {
        id: applicantProfile.id,
        name: applicantProfile.name,
        email: applicantProfile.email,
        phone: applicantProfile.phone,
        role: 'applicant',
        avatar: applicantProfile.photo,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(seekerUserObj);
      setActiveView('applicant_dashboard');
      addAudit('SEEKER_LOGIN', applicantProfile.name, `Seeker ${applicantProfile.name} logged in`);
      return { success: true, role: 'applicant' };
    }

    return { 
      success: false, 
      message: 'ভুল ইউজারনেম অথবা পাসওয়ার্ড। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।' 
    };
  };

  const registerSeeker = async (data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    district: string;
    nidNumber?: string;
    highestDegree?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!data.name.trim() || !data.phone.trim() || !data.password.trim()) {
      return { success: false, message: 'অনুগ্রহ করে নাম, মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।' };
    }

    const newId = `app-user-${Date.now().toString().slice(-6)}`;
    const email = data.email?.trim() || `${data.phone.trim()}@garmentsniyog.com`;

    const newProfile: ApplicantProfile = {
      ...applicantProfile,
      id: newId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email,
      district: data.district,
      nidNumber: data.nidNumber?.trim() || '1998' + Math.floor(10000000 + Math.random() * 90000000),
      highestDegree: data.highestDegree?.trim() || 'Class 8 / SSC Pass',
      skills: ['Single Needle Lockstitch', 'Overlock Machine', 'Quality Check'],
      machineExpertise: ['Juki DDL-9000C', 'Pegasus Overlock']
    };

    setApplicantProfile(newProfile);

    // Save to Firestore users & seekers
    try {
      await setDoc(doc(db, 'users', newId), {
        id: newId,
        name: newProfile.name,
        phone: newProfile.phone,
        email: newProfile.email,
        role: 'applicant',
        district: newProfile.district,
        createdAt: new Date().toISOString()
      });
    } catch (e) {}

    const authObj: AuthUser = {
      id: newId,
      name: newProfile.name,
      email: newProfile.email,
      phone: newProfile.phone,
      role: 'applicant',
      avatar: newProfile.photo,
      createdAt: new Date().toISOString()
    };

    setCurrentUser(authObj);
    setActiveView('applicant_dashboard');
    addAudit('SEEKER_REGISTER', newProfile.name, `New job seeker registered: ${newProfile.phone}`);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setActiveView('home');
    setSelectedJob(null);
    setApplyingJob(null);
  };

  // -------------------------------------------------------------
  // SECRET ADMIN COMPANY CREATION
  // -------------------------------------------------------------
  const createCompanyAccountByAdmin = async (companyData: Partial<Company> & { accessCode: string; loginEmail?: string }): Promise<Company> => {
    const newId = `comp-${Date.now().toString().slice(-5)}`;
    const email = companyData.loginEmail?.trim() || companyData.email?.trim() || `factory_${newId}@garmentsniyog.com`;

    const newComp: Company = {
      id: newId,
      name: companyData.name || 'New Garments Factory',
      nameBn: companyData.nameBn,
      logo: companyData.logo || 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=160&auto=format&fit=crop&q=80',
      email,
      phone: companyData.phone || '',
      address: companyData.address || '',
      factoryLocation: companyData.factoryLocation || `${companyData.district || 'Gazipur'} Industrial Park`,
      district: companyData.district || 'Gazipur',
      division: companyData.division || 'Dhaka',
      website: companyData.website || '',
      businessType: companyData.businessType || 'Garments Manufacturer',
      garmentsType: companyData.garmentsType || 'Woven',
      employeeCount: companyData.employeeCount || '1000-5000',
      description: companyData.description || 'Admin authorized 100% export garments manufacturing factory.',
      tradeLicenseNumber: companyData.tradeLicenseNumber || `TRAD/BGMEA/${Math.floor(100000 + Math.random() * 900000)}`,
      contactPerson: companyData.contactPerson || 'HR & Compliance Manager',
      contactNumber: companyData.contactNumber || companyData.phone || '',
      verificationStatus: 'verified',
      isVerified: true,
      rating: 4.8,
      followersCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      accessCode: companyData.accessCode.trim(),
      createdByAdmin: true
    };

    setCompanies(prev => [newComp, ...prev]);

    try {
      await setDoc(doc(db, 'companies', newId), newComp);
      await setDoc(doc(db, 'users', newId), {
        id: newId,
        name: newComp.name,
        email: newComp.email,
        role: 'company',
        accessCode: newComp.accessCode,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Saving company locally:', e);
    }

    addAudit('ADMIN_CREATED_COMPANY', newComp.name, `Admin issued official ID for ${newComp.name} (Login Email: ${newComp.email})`);
    return newComp;
  };

  const addJob = async (jobData: Partial<JobCircular>): Promise<JobCircular> => {
    const comp = currentUser?.companyId ? companies.find(c => c.id === currentUser.companyId) || currentCompany : currentCompany;
    const newId = `job-${Date.now().toString().slice(-6)}`;
    const newJob: JobCircular = {
      id: newId,
      companyId: comp.id,
      companyName: comp.name,
      companyLogo: comp.logo,
      isCompanyVerified: comp.isVerified,
      title: jobData.title || 'Untitled Circular',
      titleBn: jobData.titleBn || jobData.title || 'শিরোনামহীন সার্কুলার',
      position: jobData.position || 'Operator',
      department: jobData.department || 'Production',
      category: jobData.category || 'Sewing Operator',
      vacancies: Number(jobData.vacancies) || 1,
      salaryMin: Number(jobData.salaryMin) || 12500,
      salaryMax: Number(jobData.salaryMax) || 18000,
      salaryType: jobData.salaryType || 'monthly',
      jobType: jobData.jobType || 'Full Time',
      experienceYears: jobData.experienceYears || '1 - 3 years',
      education: jobData.education || 'Class 8 / SSC',
      ageLimit: jobData.ageLimit || '18 - 35 years',
      gender: jobData.gender || 'Both',
      jobLocation: jobData.jobLocation || comp.factoryLocation,
      factoryLocation: jobData.factoryLocation || comp.factoryLocation,
      district: jobData.district || comp.district,
      workingHours: jobData.workingHours || '8:00 AM - 5:00 PM',
      weeklyHoliday: jobData.weeklyHoliday || 'Friday',
      overtimeDetails: jobData.overtimeDetails || '2-3 hours daily overtime available',
      benefits: jobData.benefits || {
        foodFacility: true,
        transportFacility: true,
        accommodation: false,
        medicalFacility: true,
        festivalBonus: true,
        otherBenefits: ['Attendance Bonus', 'Subsidized Food']
      },
      description: jobData.description || '',
      responsibilities: jobData.responsibilities || [],
      requiredSkills: jobData.requiredSkills || [],
      applicationStartDate: new Date().toISOString().split('T')[0],
      applicationDeadline: jobData.applicationDeadline || '2026-11-30',
      applicationFee: Number(jobData.applicationFee) || 0,
      platformFee: Math.round((Number(jobData.applicationFee) || 0) * (settings.platformCommissionPercent / 100)),
      contactPhone: jobData.contactPhone || comp.phone,
      contactEmail: jobData.contactEmail || comp.email,
      isFeatured: Boolean(jobData.isFeatured),
      isUrgent: Boolean(jobData.isUrgent),
      status: 'active',
      viewsCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setJobs(prev => [newJob, ...prev]);
    try {
      await setDoc(doc(db, 'jobs', newId), newJob);
    } catch (e) {}

    addAudit('CREATED_JOB', newJob.title, `Company ${comp.name} created circular`);
    return newJob;
  };

  const updateJob = async (id: string, updates: Partial<JobCircular>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : job));
    try {
      await updateDoc(doc(db, 'jobs', id), updates);
    } catch (e) {}
    addAudit('UPDATED_JOB', `Job ID: ${id}`, `Updated fields: ${Object.keys(updates).join(', ')}`);
  };

  const deleteJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    setJobs(prev => prev.filter(j => j.id !== id));
    try {
      await deleteDoc(doc(db, 'jobs', id));
    } catch (e) {}
    addAudit('DELETED_JOB', job?.title || id, `Deleted circular`);
  };

  const toggleFeaturedJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const nextState = !job.isFeatured;
    setJobs(prev => prev.map(j => j.id === id ? { ...job, isFeatured: nextState } : j));
    try {
      await updateDoc(doc(db, 'jobs', id), { isFeatured: nextState });
    } catch (e) {}
    addAudit(nextState ? 'FEATURED_JOB' : 'UNFEATURED_JOB', job.title, `Changed featured status`);
  };

  const toggleUrgentJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const nextState = !job.isUrgent;
    setJobs(prev => prev.map(j => j.id === id ? { ...job, isUrgent: nextState } : j));
    try {
      await updateDoc(doc(db, 'jobs', id), { isUrgent: nextState });
    } catch (e) {}
    addAudit(nextState ? 'MARKED_URGENT' : 'UNMARKED_URGENT', job.title, `Changed urgent status`);
  };

  const approveCompany = async (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, verificationStatus: 'verified', isVerified: true } : c));
    setJobs(prev => prev.map(j => j.companyId === id ? { ...j, isCompanyVerified: true } : j));
    try {
      await updateDoc(doc(db, 'companies', id), { verificationStatus: 'verified', isVerified: true });
    } catch (e) {}
    addAudit('APPROVED_COMPANY', `Company ID: ${id}`, `Super Admin verified company`);
  };

  const rejectCompany = async (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, verificationStatus: 'rejected', isVerified: false } : c));
    try {
      await updateDoc(doc(db, 'companies', id), { verificationStatus: 'rejected', isVerified: false });
    } catch (e) {}
    addAudit('REJECTED_COMPANY', `Company ID: ${id}`, `Super Admin rejected company`);
  };

  const suspendCompany = async (id: string) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, verificationStatus: 'suspended', isVerified: false } : c));
    try {
      await updateDoc(doc(db, 'companies', id), { verificationStatus: 'suspended', isVerified: false });
    } catch (e) {}
    addAudit('SUSPENDED_COMPANY', `Company ID: ${id}`, `Super Admin suspended company`);
  };

  const toggleVerifyCompany = async (id: string) => {
    const comp = companies.find(c => c.id === id);
    if (!comp) return;
    const nextVerified = !comp.isVerified;
    setCompanies(prev => prev.map(c => c.id === id ? { 
      ...c, 
      isVerified: nextVerified, 
      verificationStatus: nextVerified ? 'verified' : 'pending' 
    } : c));
    try {
      await updateDoc(doc(db, 'companies', id), { isVerified: nextVerified, verificationStatus: nextVerified ? 'verified' : 'pending' });
    } catch (e) {}
    addAudit(nextVerified ? 'VERIFIED_COMPANY' : 'UNVERIFIED_COMPANY', comp.name, `Toggled verification badge`);
  };

  const updateCompanyProfile = async (id: string, data: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    try {
      await updateDoc(doc(db, 'companies', id), data);
    } catch (e) {}
    addAudit('UPDATED_COMPANY_PROFILE', `Company ID: ${id}`, `Updated profile details`);
  };

  const submitApplication = async (
    jobId: string, 
    paymentMethod: PaymentMethod, 
    paymentSenderPhone?: string,
    paymentTrxId?: string,
    customData?: { coverLetter?: string; expectedSalary?: number }
  ): Promise<{ success: boolean; application: Application; transaction?: PaymentTransaction }> => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');

    const fee = job.applicationFee;
    const platformComm = Math.round(fee * (settings.platformCommissionPercent / 100));
    const gatewayFee = fee > 0 ? Math.round(fee * (settings.gatewayFeePercent / 100) * 10) / 10 : 0;
    const totalPayable = fee > 0 ? fee + platformComm + gatewayFee : 0;
    const companyShare = fee - platformComm;

    const appId = `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleString('en-GB');

    let newTx: PaymentTransaction | undefined = undefined;

    if (fee > 0 && paymentMethod !== 'free') {
      const txId = paymentTrxId || `TRX-${paymentMethod.toUpperCase().slice(0, 2)}-${Date.now().toString().slice(-8)}`;
      newTx = {
        id: `tx-${Date.now()}`,
        transactionId: txId,
        gatewayReference: `${paymentMethod.toUpperCase()}-GW-${Math.floor(100000 + Math.random() * 900000)}`,
        applicationId: appId,
        jobId: job.id,
        jobTitle: job.title,
        applicantId: applicantProfile.id,
        applicantName: applicantProfile.name,
        companyId: job.companyId,
        companyName: job.companyName,
        totalAmount: totalPayable,
        applicationFee: fee,
        platformFee: platformComm,
        companyAmount: companyShare,
        gatewayFee: gatewayFee,
        paymentMethod: paymentMethod,
        paymentPhone: paymentSenderPhone || applicantProfile.phone,
        status: 'paid',
        createdAt: nowStr,
        receiptNumber: `REC-GN-2026-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setTransactions(prev => [newTx!, ...prev]);
      try {
        await setDoc(doc(db, 'transactions', newTx.id), newTx);
      } catch (e) {}
    }

    const newApp: Application = {
      id: appId,
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      applicantId: applicantProfile.id,
      applicantName: applicantProfile.name,
      applicantPhone: applicantProfile.phone,
      applicantEmail: applicantProfile.email,
      applicantPhoto: applicantProfile.photo,
      experienceYears: '4 Years',
      highestDegree: applicantProfile.highestDegree,
      expectedSalary: customData?.expectedSalary || applicantProfile.expectedSalary,
      coverLetter: customData?.coverLetter || 'I am eager to contribute to your factory with proven machine and quality adherence.',
      applicationFee: fee,
      platformFee: platformComm,
      gatewayFee: gatewayFee,
      totalPaid: totalPayable,
      paymentStatus: fee === 0 ? 'waived' : 'paid',
      paymentId: newTx?.transactionId || paymentTrxId,
      paymentMethod: paymentMethod,
      paymentSenderPhone: paymentSenderPhone || applicantProfile.phone,
      paymentTrxId: paymentTrxId || newTx?.transactionId || 'FREE-WAIVED',
      status: 'applied',
      appliedDate: nowStr,
      cvSnapshot: {
        name: applicantProfile.name,
        phone: applicantProfile.phone,
        nidNumber: applicantProfile.nidNumber,
        address: applicantProfile.address,
        district: applicantProfile.district,
        dateOfBirth: applicantProfile.dateOfBirth,
        gender: applicantProfile.gender,
        highestDegree: applicantProfile.highestDegree,
        skills: applicantProfile.skills,
        machineExpertise: applicantProfile.machineExpertise,
        experienceList: applicantProfile.experienceList,
        educationList: applicantProfile.educationList,
        trainingCertificates: applicantProfile.trainingCertificates
      }
    };

    setApplications(prev => [newApp, ...prev]);

    try {
      await setDoc(doc(db, 'applications', appId), newApp);
    } catch (e) {}

    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicationsCount: j.applicationsCount + 1 } : j));
    try {
      await updateDoc(doc(db, 'jobs', jobId), { applicationsCount: job.applicationsCount + 1 });
    } catch (e) {}

    addAudit('APPLIED_JOB', job.title, `Applicant ${applicantProfile.name} applied with TrxID: ${newApp.paymentTrxId} (AppID: ${appId})`);

    return { success: true, application: newApp, transaction: newTx };
  };

  const updateApplicationStatus = async (
    applicationId: string, 
    status: ApplicationStatus, 
    interviewDetails?: Application['interviewSchedule']
  ) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return {
          ...app,
          status,
          interviewSchedule: interviewDetails || app.interviewSchedule
        };
      }
      return app;
    }));

    try {
      const payload: any = { status };
      if (interviewDetails) payload.interviewSchedule = interviewDetails;
      await updateDoc(doc(db, 'applications', applicationId), payload);
    } catch (e) {}

    addAudit('UPDATED_APPLICATION_STATUS', `Application ID: ${applicationId}`, `Status changed to ${status}`);
  };

  const toggleSaveJob = (jobId: string) => {
    setApplicantProfile(prev => {
      const exists = prev.savedJobIds.includes(jobId);
      const updated = exists 
        ? prev.savedJobIds.filter(id => id !== jobId)
        : [...prev.savedJobIds, jobId];
      return { ...prev, savedJobIds: updated };
    });
  };

  const toggleFollowCompany = (companyId: string) => {
    setApplicantProfile(prev => {
      const exists = prev.followedCompanyIds.includes(companyId);
      const updated = exists 
        ? prev.followedCompanyIds.filter(id => id !== companyId)
        : [...prev.followedCompanyIds, companyId];
      return { ...prev, followedCompanyIds: updated };
    });
  };

  const updateApplicantProfile = (updates: Partial<ApplicantProfile>) => {
    setApplicantProfile(prev => ({ ...prev, ...updates }));
    addAudit('UPDATED_PROFILE', applicantProfile.name, 'Updated digital CV profile');
  };

  const addCategory = (cat: Omit<JobCategory, 'id' | 'activeJobsCount'>) => {
    const newCat: JobCategory = {
      ...cat,
      id: `cat-${Date.now().toString().slice(-4)}`,
      activeJobsCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    addAudit('ADDED_CATEGORY', newCat.nameEn, `Added new category`);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    try {
      await setDoc(doc(db, 'settings', 'global'), merged);
    } catch (e) {}
    addAudit('UPDATED_SETTINGS', 'Payment Gateway & Admin Credentials', `Updated system configuration`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetSystemData = () => {
    localStorage.clear();
    setJobs(INITIAL_JOBS);
    setCompanies(INITIAL_COMPANIES);
    setCategories(INITIAL_CATEGORIES);
    setApplications(INITIAL_APPLICATIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setApplicantProfile(INITIAL_APPLICANT);
    setSettings(INITIAL_SETTINGS);
    setCurrentUser(null);
    setLang('bn');
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      role,
      lang,
      setLang,
      t,
      firebaseConnected,
      login,
      registerSeeker,
      logout,
      jobs,
      companies,
      categories,
      applications,
      transactions,
      applicantProfile,
      notifications,
      auditLogs,
      settings,
      currentCompany,
      setCurrentCompanyId,
      addJob,
      updateJob,
      deleteJob,
      toggleFeaturedJob,
      toggleUrgentJob,
      createCompanyAccountByAdmin,
      approveCompany,
      rejectCompany,
      suspendCompany,
      toggleVerifyCompany,
      updateCompanyProfile,
      submitApplication,
      updateApplicationStatus,
      toggleSaveJob,
      toggleFollowCompany,
      updateApplicantProfile,
      addCategory,
      deleteCategory,
      updateSettings,
      markNotificationRead,
      clearNotifications,
      activeView,
      setActiveView,
      selectedJob,
      setSelectedJob,
      selectedReceipt,
      setSelectedReceipt,
      applyingJob,
      setApplyingJob,
      showCvModal,
      setShowCvModal,
      showAuthModal,
      setShowAuthModal,
      authMode,
      setAuthMode,
      resetSystemData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
