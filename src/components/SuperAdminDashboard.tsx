import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Company, Application } from '../types';
import { 
  ShieldCheck, 
  Building2, 
  Briefcase, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Settings, 
  Layers, 
  Download, 
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Activity,
  UserPlus,
  Key,
  Copy,
  Check,
  Eye,
  Phone,
  QrCode
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../data/initialData';

export const SuperAdminDashboard: React.FC = () => {
  const { 
    lang, 
    companies, 
    jobs, 
    applications, 
    transactions, 
    categories, 
    auditLogs, 
    settings,
    approveCompany, 
    rejectCompany, 
    suspendCompany,
    toggleVerifyCompany,
    toggleFeaturedJob,
    toggleUrgentJob,
    deleteJob,
    addCategory,
    deleteCategory,
    updateSettings,
    createCompanyAccountByAdmin
  } = useApp();

  const [adminTab, setAdminTab] = useState<'overview' | 'companies' | 'jobs' | 'applications' | 'categories' | 'revenue' | 'audit' | 'settings'>('overview');

  // New Category State
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatBn, setNewCatBn] = useState('');
  const [newCatDept, setNewCatDept] = useState('Production');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Company Creation by Admin State (Requirement: Admin creates Company IDs)
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompAccessCode, setNewCompAccessCode] = useState('');
  const [newCompPhone, setNewCompPhone] = useState('');
  const [newCompLocation, setNewCompLocation] = useState('');
  const [newCompDistrict, setNewCompDistrict] = useState('Gazipur');
  const [newCompLicense, setNewCompLicense] = useState('');
  const [newCompType, setNewCompType] = useState<'Woven' | 'Knitwear' | 'Denim' | 'Sweater' | 'Diverse'>('Woven');
  const [createdCompanySuccess, setCreatedCompanySuccess] = useState<Company | null>(null);

  // Applicant Full CV View modal
  const [viewingAppCv, setViewingAppCv] = useState<Application | null>(null);

  // Settings State for bKash, Nagad, Rocket
  const [commissionPct, setCommissionPct] = useState(settings.platformCommissionPercent);
  const [gatewayPct, setGatewayPct] = useState(settings.gatewayFeePercent);
  const [minFee, setMinFee] = useState(settings.minApplicationFee);
  const [maxFee, setMaxFee] = useState(settings.maxApplicationFee);
  const [bkashMerchant, setBkashMerchant] = useState(settings.bKashMerchantNumber || '01712-345678');
  const [nagadMerchant, setNagadMerchant] = useState(settings.nagadMerchantNumber || '01812-345678');
  const [rocketMerchant, setRocketMerchant] = useState(settings.rocketMerchantNumber || '01912-345678');
  const [bkashType, setBkashType] = useState(settings.bKashAccountType || 'Personal (সেন্ড মানি)');
  const [nagadType, setNagadType] = useState(settings.nagadAccountType || 'Personal (সেন্ড মানি)');
  const [rocketType, setRocketType] = useState(settings.rocketAccountType || 'Personal (সেন্ড মানি)');
  const [payInstructions, setPayInstructions] = useState(settings.paymentInstructions || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Revenue calculations
  const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalPlatformCommission = transactions.reduce((acc, t) => acc + t.platformFee, 0);
  const totalGatewayFee = transactions.reduce((acc, t) => acc + t.gatewayFee, 0);
  const totalCompanyPayout = transactions.reduce((acc, t) => acc + t.companyAmount, 0);

  const pendingCompanies = companies.filter(c => c.verificationStatus === 'pending');
  const verifiedCompanies = companies.filter(c => c.isVerified);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      platformCommissionPercent: Number(commissionPct),
      gatewayFeePercent: Number(gatewayPct),
      minApplicationFee: Number(minFee),
      maxApplicationFee: Number(maxFee),
      bKashMerchantNumber: bkashMerchant,
      nagadMerchantNumber: nagadMerchant,
      rocketMerchantNumber: rocketMerchant,
      bKashAccountType: bkashType,
      nagadAccountType: nagadType,
      rocketAccountType: rocketType,
      paymentInstructions: payInstructions
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleCreateCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim() || !newCompEmail.trim()) return;

    const code = newCompAccessCode.trim() || `fact_${Math.floor(1000 + Math.random() * 9000)}`;

    const comp = await createCompanyAccountByAdmin({
      name: newCompName,
      email: newCompEmail,
      accessCode: code,
      phone: newCompPhone || '01700-000000',
      factoryLocation: newCompLocation || `${newCompDistrict} Industrial Zone`,
      district: newCompDistrict,
      tradeLicenseNumber: newCompLicense || `TRAD/BGMEA/${Math.floor(100000 + Math.random() * 900000)}`,
      garmentsType: newCompType
    });

    setCreatedCompanySuccess(comp);
    setNewCompName('');
    setNewCompEmail('');
    setNewCompAccessCode('');
    setNewCompLocation('');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatEn.trim()) return;
    addCategory({
      nameEn: newCatEn,
      nameBn: newCatBn || newCatEn,
      department: newCatDept,
      description: newCatDesc || `${newCatEn} in garments operations`,
      iconName: 'Briefcase'
    });
    setNewCatEn('');
    setNewCatBn('');
    setNewCatDesc('');
  };

  const exportCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(val => `"${val}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Super Admin Top Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-purple-900/40">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center border border-purple-500/40">
            <ShieldCheck className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">সুপার অ্যাডমিন নিয়ন্ত্রণ কেন্দ্র</h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                MASTER ADMIN · CLOUD SYNCED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              কারখানা আইডি প্রদান, বিকাশ/নগদ/রকেট নম্বর কনফিগারেশন, সার্কুলার ও আবেদন তদারকি
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateCompanyModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>নতুন কোম্পানি আইডি ইস্যু করুন</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
        {[
          { id: 'overview', label: 'সিস্টেম ওভারভিউ', icon: Activity },
          { id: 'companies', label: `কারখানা ও নিয়োগকর্তা (${companies.length})`, icon: Building2 },
          { id: 'applications', label: `আবেদন ও TrxID তালিকা (${applications.length})`, icon: FileText },
          { id: 'jobs', label: `সকল সার্কুলার (${jobs.length})`, icon: Briefcase },
          { id: 'settings', label: 'বিকাশ/নগদ/রকেট নম্বর ও ফি সেটিংস', icon: Settings },
          { id: 'revenue', label: 'রাজস্ব ও পেমেন্ট লেজার', icon: DollarSign },
          { id: 'categories', label: `ক্যাটাগরি সমূহ (${categories.length})`, icon: Layers },
          { id: 'audit', label: 'অডিট লগ (Audit Trail)', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-purple-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRIC TILES */}
      {adminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">নিবন্ধিত কারখানা</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{companies.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">{verifiedCompanies.length} টি ভেরিফাইড</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">মোট চাকরির সার্কুলার</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{jobs.length}</div>
              <span className="text-[11px] text-blue-600 font-semibold">সক্রিয় রয়েছে</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">অনলাইন আবেদন জমা</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{applications.length}</div>
              <span className="text-[11px] text-purple-600 font-semibold">TrxID যাচাইকৃত</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">প্ল্যাটফর্ম কমিশন আয়</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">৳{totalPlatformCommission}</div>
              <span className="text-[11px] text-slate-500 font-semibold">মোট ফি ৳{totalRevenue}</span>
            </div>
          </div>

          {/* Payment gateway quick info */}
          <div className="bg-slate-900 rounded-xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold block mb-1">অ্যাক্টিভ পেমেন্ট নম্বর (আবেদনকারীদের দেখানো হচ্ছে):</span>
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <span>bKash: <strong className="text-white">{settings.bKashMerchantNumber}</strong> ({settings.bKashAccountType})</span>
                <span>Nagad: <strong className="text-white">{settings.nagadMerchantNumber}</strong> ({settings.nagadAccountType})</span>
                <span>Rocket: <strong className="text-white">{settings.rocketMerchantNumber}</strong></span>
              </div>
            </div>
            <button
              onClick={() => setAdminTab('settings')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 border border-slate-700"
            >
              নম্বর পরিবর্তন করুন
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY MANAGEMENT & SECRET ID CREATION */}
      {adminTab === 'companies' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">কারখানা ও নিয়োগকর্তা অ্যাকাউন্ট তালিকা</h3>
              <p className="text-xs text-slate-500">শুধুমাত্র সুপার অ্যাডমিন নতুন কারখানার জন্য আইডি ও এক্সেস পাসওয়ার্ড ইস্যু করতে পারেন।</p>
            </div>
            <button
              onClick={() => setShowCreateCompanyModal(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>নতুন কোম্পানি আইডি ইস্যু করুন</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="p-3">কারখানার নাম</th>
                    <th className="p-3">লগইন ইমেইল / আইডি</th>
                    <th className="p-3">সিক্রেট পাসওয়ার্ড</th>
                    <th className="p-3">অবস্থান</th>
                    <th className="p-3">ট্রেড লাইসেন্স</th>
                    <th className="p-3">স্ট্যাটাস</th>
                    <th className="p-3">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {companies.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <img src={c.logo} alt={c.name} className="w-7 h-7 rounded object-cover border" />
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-medium text-slate-800">{c.email}</td>
                      <td className="p-3 font-mono text-emerald-800 font-bold bg-slate-50 px-2 rounded">
                        {c.accessCode || 'factory123'}
                      </td>
                      <td className="p-3">{c.district}</td>
                      <td className="p-3 font-mono text-[11px]">{c.tradeLicenseNumber}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          c.isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {c.isVerified ? 'ভেরিফাইড' : 'পেন্ডিং'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleVerifyCompany(c.id)}
                            className="px-2 py-1 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-[11px]"
                          >
                            {c.isVerified ? 'আনভেরিফাই' : 'ভেরিফাই'}
                          </button>
                          <button
                            onClick={() => suspendCompany(c.id)}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px]"
                          >
                            সাসপেন্ড
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATIONS & TrxID MONITORING */}
      {adminTab === 'applications' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">আবেদন ও TrxID মনিটরিং ({applications.length})</h3>
              <p className="text-xs text-slate-500">প্রার্থীদের পাঠানো বিকাশ/নগদ TrxID এবং পূর্ণাঙ্গ ডিজিটাল সিভি দেখুন।</p>
            </div>
            <button
              onClick={() => exportCSV(applications, 'applications_report')}
              className="px-3 py-1.5 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV এক্সপোর্ট</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">আবেদন নম্বর</th>
                  <th className="p-3">প্রার্থীর নাম ও মোবাইল</th>
                  <th className="p-3">কারখানা ও পদ</th>
                  <th className="p-3">Transaction ID (TrxID)</th>
                  <th className="p-3">প্রেরক মোবাইল</th>
                  <th className="p-3">পরিশোধিত অর্থ</th>
                  <th className="p-3">সিভি ও অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {applications.map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-slate-900">{app.id}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{app.applicantPhone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{app.companyName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{app.jobTitle}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-emerald-700 bg-emerald-50/50 px-2 rounded">
                      {app.paymentTrxId || 'FREE'}
                    </td>
                    <td className="p-3 font-mono">{app.paymentSenderPhone || app.applicantPhone}</td>
                    <td className="p-3 font-bold font-mono">৳{app.totalPaid}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setViewingAppCv(app)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>সিভি ও তথ্য</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: JOBS OVERSIGHT */}
      {adminTab === 'jobs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">সার্কুলার পরিচালনা</h3>
            <span className="text-xs text-slate-500">মোট সার্কুলার: {jobs.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">শিরোনাম</th>
                  <th className="p-3">কারখানা</th>
                  <th className="p-3">ক্যাটাগরি</th>
                  <th className="p-3">আবেদন ফি</th>
                  <th className="p-3">আবেদন সংখ্যা</th>
                  <th className="p-3">ফিচার্ড / জরুরি</th>
                  <th className="p-3">মুছুন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">{j.title}</td>
                    <td className="p-3">{j.companyName}</td>
                    <td className="p-3">{j.category}</td>
                    <td className="p-3 font-mono">৳{j.applicationFee}</td>
                    <td className="p-3 font-bold text-emerald-700">{j.applicationsCount}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFeaturedJob(j.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            j.isFeatured ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          ★ ফিচার্ড
                        </button>
                        <button
                          onClick={() => toggleUrgentJob(j.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            j.isUrgent ? 'bg-red-100 text-red-800 border-red-300' : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          জরুরি
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteJob(j.id)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px]"
                      >
                        মুছুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS & PAYMENT NUMBERS (Explicit User Requirement) */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-3xl mx-auto shadow-2xs text-xs text-slate-800 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-black text-base text-slate-900">
              বিকাশ, নগদ ও রকেট পেমেন্ট নম্বর এবং সিস্টেম ফি সেটিংস
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              এখানে যে নম্বর সেট করবেন, চাকরিপ্রার্থীরা আবেদন করার সময় সরাসরি ঐ নম্বর দেখতে পাবেন এবং ঐ নম্বরে টাকা পাঠিয়ে TrxID প্রদান করবেন।
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>নম্বর ও সেটিংস ক্লাউড ডাটাবেজে (Firestore) সংরক্ষিত হয়েছে এবং সব ডিভাইসে আপডেট হয়েছে!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            
            {/* bKash Configuration */}
            <div className="p-4 rounded-xl border border-[#d12053]/20 bg-[#d12053]/5 space-y-3">
              <div className="font-bold text-sm text-[#d12053] flex items-center justify-between">
                <span>১. bKash (বিকাশ) নম্বর কনফিগারেশন:</span>
                <span className="text-xs font-normal">আবেদনকারী পেমেন্ট স্ক্রিনে এটি দেখতে পাবেন</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিকাশ মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    required
                    value={bkashMerchant}
                    onChange={(e) => setBkashMerchant(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অ্যাকাউন্টের ধরণ:</label>
                  <select
                    value={bkashType}
                    onChange={(e) => setBkashType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold"
                  >
                    <option value="Personal (সেন্ড মানি)">Personal (সেন্ড মানি)</option>
                    <option value="Merchant (পেমেন্ট)">Merchant (মার্চেন্ট পেমেন্ট)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Nagad Configuration */}
            <div className="p-4 rounded-xl border border-[#f7941d]/20 bg-[#f7941d]/5 space-y-3">
              <div className="font-bold text-sm text-[#f7941d] flex items-center justify-between">
                <span>২. Nagad (নগদ) নম্বর কনফিগারেশন:</span>
                <span className="text-xs font-normal">ডাক বিভাগীয় ডিজিটাল ওয়ালেট</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">নগদ মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    required
                    value={nagadMerchant}
                    onChange={(e) => setNagadMerchant(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অ্যাকাউন্টের ধরণ:</label>
                  <select
                    value={nagadType}
                    onChange={(e) => setNagadType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold"
                  >
                    <option value="Personal (সেন্ড মানি)">Personal (সেন্ড মানি)</option>
                    <option value="Merchant (পেমেন্ট)">Merchant (মার্চেন্ট পেমেন্ট)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rocket Configuration */}
            <div className="p-4 rounded-xl border border-[#8c3494]/20 bg-[#8c3494]/5 space-y-3">
              <div className="font-bold text-sm text-[#8c3494] flex items-center justify-between">
                <span>৩. Rocket (রকেট) নম্বর কনফিগারেশন:</span>
                <span className="text-xs font-normal">ডাচ-বাংলা ব্যাংক</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রকেট মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    required
                    value={rocketMerchant}
                    onChange={(e) => setRocketMerchant(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm font-mono font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">অ্যাকাউন্টের ধরণ:</label>
                  <select
                    value={rocketType}
                    onChange={(e) => setRocketType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold"
                  >
                    <option value="Personal (সেন্ড মানি)">Personal (সেন্ড মানি)</option>
                    <option value="Merchant (পেমেন্ট)">Merchant (মার্চেন্ট পেমেন্ট)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Commission & Instruction */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  প্ল্যাটফর্ম কমিশন হার (%):
                </label>
                <input
                  type="number"
                  value={commissionPct}
                  onChange={(e) => setCommissionPct(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  সর্বোচ্চ আবেদন ফি সীমা (৳):
                </label>
                <input
                  type="number"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                আবেদনকারীর স্ক্রিনে প্রদর্শিত পেমেন্ট নির্দেশনা:
              </label>
              <textarea
                rows={2}
                value={payInstructions}
                onChange={(e) => setPayInstructions(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg text-xs shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>সকল নম্বর ও সেটিংস ক্লাউডে সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: REVENUE */}
      {adminTab === 'revenue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">মোট প্রক্রিয়াকৃত অর্থ</span>
              <div className="text-2xl font-black text-slate-900 mt-1">৳{totalRevenue}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-2xs">
              <span className="text-xs text-emerald-800 font-medium">প্ল্যাটফর্ম কমিশন আয়</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">৳{totalPlatformCommission}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">পেমেন্ট গেটওয়ে চার্জ</span>
              <div className="text-2xl font-black text-slate-700 mt-1">৳{totalGatewayFee}</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">কারখানা প্রাপ্য নিট অর্থ</span>
              <div className="text-2xl font-black text-blue-700 mt-1">৳{totalCompanyPayout}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: CATEGORIES */}
      {adminTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs max-w-xl text-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">নতুন গার্মেন্টস ক্যাটাগরি তৈরি করুন</h3>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Category Name (English)"
                  value={newCatEn}
                  onChange={(e) => setNewCatEn(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="ক্যাটাগরি নাম (বাংলা)"
                  value={newCatBn}
                  onChange={(e) => setNewCatBn(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
              >
                ক্যাটাগরি যোগ করুন
              </button>
            </form>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">বিদ্যমান ক্যাটাগরি তালিকা ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {categories.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{c.nameEn}</span>
                    <span className="text-[11px] text-slate-500 block">{c.nameBn}</span>
                  </div>
                  <button onClick={() => deleteCategory(c.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">সিস্টেম সিকিউরিটি ও অডিট ট্রেইল</h3>
            <span className="text-xs text-slate-500">মোট লগ: {auditLogs.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">টাইমস্ট্যাম্প</th>
                  <th className="p-3">অ্যাক্টর</th>
                  <th className="p-3">অ্যাকশন</th>
                  <th className="p-3">টার্গেট</th>
                  <th className="p-3">বিবরণ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60">
                    <td className="p-3 text-slate-500">{log.timestamp}</td>
                    <td className="p-3 font-sans font-semibold text-slate-900">{log.actorName}</td>
                    <td className="p-3 text-purple-700 font-bold">{log.action}</td>
                    <td className="p-3 font-sans">{log.target}</td>
                    <td className="p-3 font-sans text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADMIN CREATES COMPANY ACCOUNT (Explicit user requirement) */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">নতুন কোম্পানি অ্যাকাউন্ট তৈরি ও আইডি প্রদান</h3>
                <p className="text-slate-500 text-[11px]">কারখানা কর্তৃপক্ষের জন্য লগইন ইমেইল ও সিক্রেট পাসওয়ার্ড নির্ধারণ করুন।</p>
              </div>
              <button onClick={() => { setShowCreateCompanyModal(false); setCreatedCompanySuccess(null); }} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {createdCompanySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>কোম্পানি অ্যাকাউন্ট সফলভাবে সক্রিয় করা হয়েছে!</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-200 font-mono text-xs space-y-1">
                  <div>কারখানার নাম: <strong className="text-slate-900">{createdCompanySuccess.name}</strong></div>
                  <div>লগইন ইমেইল: <strong className="text-slate-900">{createdCompanySuccess.email}</strong></div>
                  <div>সিক্রেট পাসওয়ার্ড: <strong className="text-emerald-700 font-bold">{createdCompanySuccess.accessCode}</strong></div>
                </div>
                <p className="text-[11px] text-slate-600">
                  * এই লগইন ইমেইল এবং সিক্রেট পাসওয়ার্ডটি কপি করে সংশ্লিষ্ট কারখানা কর্তৃপক্ষকে প্রদান করুন। তারা সরাসরি কোম্পানি পোর্টাল থেকে লগইন করে সার্কুলার দিতে পারবেন।
                </p>
                <button
                  type="button"
                  onClick={() => setCreatedCompanySuccess(null)}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg font-bold"
                >
                  আরেকটি কোম্পানি যোগ করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateCompanySubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">কারখানার নাম (Company Name):</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: অনন্ত অ্যাপারেলস লিমিটেড / Ananta Apparels"
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">কারখানার লগইন ইমেইল:</label>
                    <input
                      type="email"
                      required
                      placeholder="hr@ananta.com"
                      value={newCompEmail}
                      onChange={(e) => setNewCompEmail(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">সিক্রেট এক্সেস পাসওয়ার্ড:</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: ananta2026"
                      value={newCompAccessCode}
                      onChange={(e) => setNewCompAccessCode(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">জেলা (District):</label>
                    <select
                      value={newCompDistrict}
                      onChange={(e) => setNewCompDistrict(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    >
                      {BANGLADESH_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">গার্মেন্টস পণ্য ধরণ:</label>
                    <select
                      value={newCompType}
                      onChange={(e) => setNewCompType(e.target.value as any)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Woven">Woven (শার্ট, ট্রাউজার)</option>
                      <option value="Knitwear">Knitwear (টি-শার্ট, পোলো)</option>
                      <option value="Denim">Denim (জিন্স)</option>
                      <option value="Sweater">Sweater (সোয়েটার)</option>
                      <option value="Diverse">Composite / Diverse</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ফ্যাক্টরি অবস্থান ও ঠিকানা:</label>
                  <input
                    type="text"
                    placeholder="যেমন: নিচিন্তপুর, আশুলিয়া, সাভার"
                    value={newCompLocation}
                    onChange={(e) => setNewCompLocation(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ট্রেড লাইসেন্স নম্বর:</label>
                    <input
                      type="text"
                      placeholder="TRAD/DNCC/129841"
                      value={newCompLicense}
                      onChange={(e) => setNewCompLicense(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ফোন নম্বর:</label>
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={newCompPhone}
                      onChange={(e) => setNewCompPhone(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateCompanyModal(false)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    কোম্পানি আইডি তৈরি করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: VIEW FULL APPLICANT CV & TrxID */}
      {viewingAppCv && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-xs text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {viewingAppCv.applicantName} - পূর্ণাঙ্গ ডিজিটাল সিভি
                </h3>
                <p className="text-slate-500 font-mono">আবেদন নম্বর: {viewingAppCv.id}</p>
              </div>
              <button onClick={() => setViewingAppCv(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Payment & TrxID box */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 block">পেমেন্ট ও TrxID তথ্য:</span>
              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>TrxID: <strong className="text-emerald-800">{viewingAppCv.paymentTrxId}</strong></div>
                <div>মাধ্যম: <strong>{viewingAppCv.paymentMethod?.toUpperCase()}</strong></div>
                <div>পরিশোধিত ফি: <strong>৳{viewingAppCv.totalPaid}</strong></div>
              </div>
              <div className="text-slate-600 font-mono">
                টাকা পাঠানোর প্রেরক নম্বর: <strong>{viewingAppCv.paymentSenderPhone || viewingAppCv.applicantPhone}</strong>
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border">
              <div>নাম: <strong>{viewingAppCv.applicantName}</strong></div>
              <div>মোবাইল: <span className="font-mono">{viewingAppCv.applicantPhone}</span></div>
              <div>শিক্ষাগত যোগ্যতা: <strong>{viewingAppCv.highestDegree}</strong></div>
              <div>প্রত্যাশিত বেতন: <span className="font-mono font-bold">৳{viewingAppCv.expectedSalary}</span></div>
            </div>

            {/* Machine operating expertise */}
            {viewingAppCv.cvSnapshot?.machineExpertise && viewingAppCv.cvSnapshot.machineExpertise.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">মেশিন চালনা পারদর্শিতা (Machine Expertise):</span>
                <div className="flex flex-wrap gap-1">
                  {viewingAppCv.cvSnapshot.machineExpertise.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover letter */}
            {viewingAppCv.coverLetter && (
              <div className="p-3 bg-slate-50 rounded-lg border text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">কভার মেসেজ:</span>
                <p className="leading-relaxed">{viewingAppCv.coverLetter}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingAppCv(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
