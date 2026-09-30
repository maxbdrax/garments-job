import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
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
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['bn']) => string;
  firebaseConnected: boolean;
  
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
  
  // Company Actions
  createCompanyAccountByAdmin: (companyData: Partial<Company> & { accessCode: string }) => Promise<Company>;
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
  authTargetRole: UserRole;
  setAuthTargetRole: (role: UserRole) => void;
  
  // Reset
  resetSystemData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'gn_role',
  LANG: 'gn_lang',
  JOBS: 'gn_jobs_v2',
  COMPANIES: 'gn_companies_v2',
  CATEGORIES: 'gn_categories_v2',
  APPLICATIONS: 'gn_applications_v2',
  TRANSACTIONS: 'gn_transactions_v2',
  APPLICANT: 'gn_applicant_v2',
  SETTINGS: 'gn_settings_v2',
  NOTIFICATIONS: 'gn_notifications_v2',
  AUDIT_LOGS: 'gn_audit_v2',
  CURRENT_COMPANY: 'gn_current_comp_id_v2'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'applicant';
  });

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
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif-1',
        targetRole: 'all',
        title: 'স্বাগতম গার্মেন্টসনিয়োগ পোর্টালে!',
        message: 'বাংলাদেশের সমস্ত টেক্সটাইল ও তৈরি পোশাক খাতের ভেরিফাইড চাকরির একমাত্র বিশ্বস্ত প্লাটফর্ম।',
        type: 'announcement',
        read: false,
        createdAt: '2026-09-30 08:00 AM'
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'log-1',
        actorName: 'System Super Admin',
        actorRole: 'super_admin',
        action: 'SYSTEM_BOOT',
        target: 'Firebase Firestore',
        details: 'Connected to Firestore cloud database with multi-device sync.',
        timestamp: '2026-09-30 10:00:00'
      }
    ];
  });

  // UI state
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedJob, setSelectedJob] = useState<JobCircular | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobCircular | null>(null);
  const [showCvModal, setShowCvModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole>('applicant');

  // Sync to local storage for instant render
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

  // -------------------------------------------------------------
  // REAL-TIME FIREBASE FIRESTORE SYNCHRONIZATION
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Listen to global settings
    const settingsDocRef = doc(db, 'settings', 'global');
    const unsubSettings = onSnapshot(settingsDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as SystemSettings;
        setSettings(prev => ({ ...prev, ...data }));
        setFirebaseConnected(true);
      } else {
        // Seed initial settings into Firestore
        setDoc(settingsDocRef, INITIAL_SETTINGS).catch(console.error);
      }
    }, (err) => {
      console.warn('[Firestore] Settings sync notice:', err.message);
    });

    // 2. Listen to applications collection in real-time
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

    // 3. Listen to companies collection in real-time
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

    // 4. Listen to jobs collection in real-time
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

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
  };

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
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      actorName: role === 'super_admin' ? 'Super Admin' : role === 'company' ? currentCompany.name : applicantProfile.name,
      actorRole: role,
      action,
      target,
      details,
      timestamp: new Date().toLocaleString('en-GB')
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 99)]);
    try {
      await setDoc(doc(db, 'audit_logs', newLog.id), newLog);
    } catch (e) {
      // Local fallback active
    }
  };

  const addJob = async (jobData: Partial<JobCircular>): Promise<JobCircular> => {
    const newId = `job-${Date.now().toString().slice(-6)}`;
    const newJob: JobCircular = {
      id: newId,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyLogo: currentCompany.logo,
      isCompanyVerified: currentCompany.isVerified,
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
      jobLocation: jobData.jobLocation || currentCompany.factoryLocation,
      factoryLocation: jobData.factoryLocation || currentCompany.factoryLocation,
      district: jobData.district || currentCompany.district,
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
      contactPhone: jobData.contactPhone || currentCompany.phone,
      contactEmail: jobData.contactEmail || currentCompany.email,
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
    } catch (e) {
      console.warn('Syncing job locally:', e);
    }

    addAudit('CREATED_JOB', newJob.title, `Company ${currentCompany.name} created circular`);
    return newJob;
  };

  const updateJob = async (id: string, updates: Partial<JobCircular>) => {
    setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : job));
    try {
      await updateDoc(doc(db, 'jobs', id), updates);
    } catch (e) {
      // Local fallback
    }
    addAudit('UPDATED_JOB', `Job ID: ${id}`, `Updated fields: ${Object.keys(updates).join(', ')}`);
  };

  const deleteJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    setJobs(prev => prev.filter(j => j.id !== id));
    try {
      await deleteDoc(doc(db, 'jobs', id));
    } catch (e) {
      // Local fallback
    }
    addAudit('DELETED_JOB', job?.title || id, `Deleted circular`);
  };

  const toggleFeaturedJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const nextState = !job.isFeatured;
    setJobs(prev => prev.map(j => j.id === id ? { ...j, isFeatured: nextState } : j));
    try {
      await updateDoc(doc(db, 'jobs', id), { isFeatured: nextState });
    } catch (e) {}
    addAudit(nextState ? 'FEATURED_JOB' : 'UNFEATURED_JOB', job.title, `Changed featured status`);
  };

  const toggleUrgentJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;
    const nextState = !job.isUrgent;
    setJobs(prev => prev.map(j => j.id === id ? { ...j, isUrgent: nextState } : j));
    try {
      await updateDoc(doc(db, 'jobs', id), { isUrgent: nextState });
    } catch (e) {}
    addAudit(nextState ? 'MARKED_URGENT' : 'UNMARKED_URGENT', job.title, `Changed urgent status`);
  };

  // -------------------------------------------------------------
  // SECRET ADMIN COMPANY ISSUANCE (Requirement: Admin creates Company ID)
  // -------------------------------------------------------------
  const createCompanyAccountByAdmin = async (companyData: Partial<Company> & { accessCode: string }): Promise<Company> => {
    const newId = `comp-${Date.now().toString().slice(-5)}`;
    const newComp: Company = {
      id: newId,
      name: companyData.name || 'New Garments Factory',
      nameBn: companyData.nameBn,
      logo: companyData.logo || 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=160&auto=format&fit=crop&q=80',
      email: companyData.email || `factory_${newId}@garments.com`,
      phone: companyData.phone || '',
      address: companyData.address || '',
      factoryLocation: companyData.factoryLocation || '',
      district: companyData.district || 'Gazipur',
      division: companyData.division || 'Dhaka',
      website: companyData.website || '',
      businessType: companyData.businessType || 'Garments Manufacturer',
      garmentsType: companyData.garmentsType || 'Woven',
      employeeCount: companyData.employeeCount || '1000-5000',
      description: companyData.description || 'Admin authorized 100% export garments unit.',
      tradeLicenseNumber: companyData.tradeLicenseNumber || 'TRAD/ADMIN-APPROVED',
      contactPerson: companyData.contactPerson || 'HR Manager',
      contactNumber: companyData.contactNumber || companyData.phone || '',
      verificationStatus: 'verified',
      isVerified: true,
      rating: 4.8,
      followersCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      accessCode: companyData.accessCode || 'factory123',
      createdByAdmin: true
    };

    setCompanies(prev => [newComp, ...prev]);
    try {
      await setDoc(doc(db, 'companies', newId), newComp);
    } catch (e) {
      console.warn('Saving company locally:', e);
    }

    addAudit('ADMIN_CREATED_COMPANY', newComp.name, `Admin issued official ID for ${newComp.name} (Login: ${newComp.email})`);
    return newComp;
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

  // -------------------------------------------------------------
  // APPLICATION SUBMISSION WITH REAL TrxID & FULL CV SNAPSHOT
  // -------------------------------------------------------------
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

    // Save into Firestore collection
    try {
      await setDoc(doc(db, 'applications', appId), newApp);
    } catch (e) {
      console.warn('Syncing application locally:', e);
    }

    // Increment applications count
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applicationsCount: j.applicationsCount + 1 } : j));
    try {
      await updateDoc(doc(db, 'jobs', jobId), { applicationsCount: job.applicationsCount + 1 });
    } catch (e) {}

    // Add notification
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'applicant',
      targetUserId: applicantProfile.id,
      title: lang === 'bn' ? 'আবেদন সফল!' : 'Application Submitted!',
      message: `${job.title} - ${job.companyName} এ TrxID: ${newApp.paymentTrxId} দিয়ে আবেদন সফলভাবে গৃহীত হয়েছে।`,
      type: 'application',
      read: false,
      createdAt: nowStr
    };
    setNotifications(prev => [newNotif, ...prev]);

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
    } catch (e) {
      console.warn('Saving settings locally:', e);
    }
    addAudit('UPDATED_SETTINGS', 'Payment Gateway Numbers & Fees', `Updated bKash: ${merged.bKashMerchantNumber}, Nagad: ${merged.nagadMerchantNumber}`);
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
    setRole('applicant');
    setLang('bn');
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      lang,
      setLang,
      t,
      firebaseConnected,
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
      authTargetRole,
      setAuthTargetRole,
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
