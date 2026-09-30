export type UserRole = 'super_admin' | 'company' | 'applicant';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type JobStatus = 'active' | 'pending' | 'expired' | 'suspended';

export type ApplicationStatus = 
  | 'applied' 
  | 'payment_pending' 
  | 'under_review' 
  | 'shortlisted' 
  | 'interview' 
  | 'selected' 
  | 'rejected' 
  | 'withdrawn';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'card' | 'free';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'waived';

export interface Company {
  id: string;
  name: string;
  nameBn?: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  factoryLocation: string;
  district: string;
  division: string;
  website?: string;
  businessType: 'Garments Manufacturer' | 'Textile Mill' | 'Buying House' | 'Accessories & Packaging' | 'Composite Factory';
  garmentsType: 'Woven' | 'Knitwear' | 'Denim' | 'Sweater' | 'Undergarments' | 'Spinning' | 'Diverse';
  employeeCount: string;
  description: string;
  tradeLicenseNumber: string;
  contactPerson: string;
  contactNumber: string;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  rating: number;
  followersCount: number;
  joinedDate: string;
  accessCode?: string;
  createdByAdmin?: boolean;
}

export interface JobCircular {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  isCompanyVerified: boolean;
  title: string;
  titleBn?: string;
  position: string;
  department: string;
  category: string;
  vacancies: number;
  salaryMin: number;
  salaryMax: number;
  salaryType: 'monthly' | 'daily' | 'piece_rate' | 'negotiable';
  jobType: 'Full Time' | 'Part Time' | 'Contractual' | 'Internship' | 'Trainee';
  experienceYears: string;
  education: string;
  ageLimit: string;
  gender: 'Both' | 'Male' | 'Female';
  jobLocation: string;
  factoryLocation: string;
  district: string;
  workingHours: string;
  weeklyHoliday: string;
  overtimeDetails: string;
  benefits: {
    foodFacility: boolean;
    transportFacility: boolean;
    accommodation: boolean;
    medicalFacility: boolean;
    festivalBonus: boolean;
    otherBenefits: string[];
  };
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  applicationStartDate: string;
  applicationDeadline: string;
  applicationFee: number;
  platformFee: number;
  contactPhone: string;
  contactEmail: string;
  isFeatured: boolean;
  isUrgent: boolean;
  status: JobStatus;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  applicantPhoto?: string;
  cvUrl?: string;
  coverLetter?: string;
  experienceYears: string;
  highestDegree: string;
  expectedSalary: number;
  applicationFee: number;
  platformFee: number;
  gatewayFee: number;
  totalPaid: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentMethod?: PaymentMethod;
  paymentSenderPhone?: string;
  paymentTrxId?: string;
  cvSnapshot?: Partial<ApplicantProfile>;
  status: ApplicationStatus;
  appliedDate: string;
  interviewSchedule?: {
    date: string;
    time: string;
    type: 'In-Person' | 'Online Meeting';
    location: string;
    instructions: string;
  };
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  gatewayReference: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  companyId: string;
  companyName: string;
  totalAmount: number;
  applicationFee: number;
  platformFee: number;
  companyAmount: number;
  gatewayFee: number;
  paymentMethod: PaymentMethod;
  paymentPhone?: string;
  status: PaymentStatus;
  createdAt: string;
  receiptNumber: string;
}

export interface ApplicantProfile {
  id: string;
  name: string;
  nameBn?: string;
  email: string;
  phone: string;
  photo: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  district: string;
  upazila: string;
  nidNumber: string;
  careerObjective: string;
  expectedSalary: number;
  currentSalary?: number;
  highestDegree: string;
  educationList: Array<{
    degree: string;
    institute: string;
    passingYear: string;
    gpaOrGrade: string;
  }>;
  experienceList: Array<{
    company: string;
    position: string;
    duration: string;
    department: string;
    responsibilities: string;
  }>;
  skills: string[];
  machineExpertise: string[]; // e.g. Single Needle Lockstitch, Overlock 4/5 thread, Flatlock, Button Hole
  trainingCertificates: string[];
  languages: string[];
  references: Array<{
    name: string;
    designation: string;
    company: string;
    phone: string;
  }>;
  savedJobIds: string[];
  followedCompanyIds: string[];
}

export interface Wallet {
  companyId: string;
  balance: number;
  transactions: Array<{
    id: string;
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    createdAt: string;
    referenceId?: string;
  }>;
}

export interface SystemNotification {
  id: string;
  targetRole: UserRole | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'job' | 'application' | 'payment' | 'interview' | 'verification' | 'announcement';
  read: boolean;
  createdAt: string;
  linkAction?: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface JobCategory {
  id: string;
  nameEn: string;
  nameBn: string;
  department: string;
  description: string;
  iconName: string;
  activeJobsCount: number;
}

export interface JobAlert {
  id: string;
  userId: string;
  category: string;
  district: string;
  minSalary: number;
  active: boolean;
  createdAt: string;
}

export interface SystemSettings {
  minApplicationFee: number;
  maxApplicationFee: number;
  platformCommissionPercent: number;
  gatewayFeePercent: number;
  enablePaymentGateway: boolean;
  bKashMerchantNumber: string;
  nagadMerchantNumber: string;
  rocketMerchantNumber: string;
  bKashAccountType: 'Personal (সেন্ড মানি)' | 'Merchant (পেমেন্ট)';
  nagadAccountType: 'Personal (সেন্ড মানি)' | 'Merchant (পেমেন্ট)';
  rocketAccountType: 'Personal (সেন্ড মানি)' | 'Merchant (পেমেন্ট)';
  paymentInstructions: string;
  requireCompanyVerification: boolean;
  allowDuplicateApplications: boolean;
  siteNameEn: string;
  siteNameBn: string;
  supportPhone: string;
  supportEmail: string;
}
