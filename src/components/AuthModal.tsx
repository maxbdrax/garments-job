import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  X, 
  User, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../data/initialData';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    authMode, 
    setAuthMode, 
    authTargetRole, 
    setRole, 
    companies,
    setCurrentCompanyId,
    setActiveView,
    applicantProfile,
    updateApplicantProfile
  } = useApp();

  const [activeLoginTab, setActiveLoginTab] = useState<UserRole>(authTargetRole || 'applicant');
  
  // Seeker register fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState('Gazipur');
  const [regNid, setRegNid] = useState('');
  const [regDegree, setRegDegree] = useState('Class 8 / SSC Pass');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!showAuthModal) return null;

  const handleRegisterSeeker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setLoginError('অনুগ্রহ করে নাম এবং মোবাইল নম্বর সঠিকভাবে প্রদান করুন।');
      return;
    }

    updateApplicantProfile({
      name: regName,
      phone: regPhone,
      email: regEmail || `${regPhone}@seeker.com`,
      district: regDistrict,
      nidNumber: regNid || '1998' + Math.floor(10000000 + Math.random() * 90000000),
      highestDegree: regDegree
    });

    setRole('applicant');
    setSuccessMsg('চাকরিপ্রার্থী অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
    setTimeout(() => {
      setShowAuthModal(false);
      setActiveView('applicant_dashboard');
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (activeLoginTab === 'applicant') {
      setRole('applicant');
      setSuccessMsg('চাকরিপ্রার্থী হিসেবে লগইন সফল!');
      setTimeout(() => {
        setShowAuthModal(false);
        setActiveView('applicant_dashboard');
      }, 700);
    } else if (activeLoginTab === 'company') {
      // Find company by email or allow any registered factory
      const matched = companies.find(c => c.email.toLowerCase() === loginEmail.toLowerCase().trim() || c.accessCode === loginPassword.trim());
      if (matched) {
        setCurrentCompanyId(matched.id);
        setRole('company');
        setSuccessMsg(`${matched.name} হিসেবে লগইন সফল!`);
        setTimeout(() => {
          setShowAuthModal(false);
          setActiveView('company_dashboard');
        }, 700);
      } else {
        // Fallback to primary company for demo
        setCurrentCompanyId('comp-1');
        setRole('company');
        setSuccessMsg(`কোম্পানি ড্যাশবোর্ডে প্রবেশ করা হয়েছে!`);
        setTimeout(() => {
          setShowAuthModal(false);
          setActiveView('company_dashboard');
        }, 700);
      }
    } else if (activeLoginTab === 'super_admin') {
      setRole('super_admin');
      setSuccessMsg('সুপার অ্যাডমিন সেন্টারে প্রবেশ সফল!');
      setTimeout(() => {
        setShowAuthModal(false);
        setActiveView('admin_dashboard');
      }, 700);
    }
  };

  const handleQuickDemo = (target: UserRole) => {
    setRole(target);
    if (target === 'super_admin') setActiveView('admin_dashboard');
    else if (target === 'company') setActiveView('company_dashboard');
    else setActiveView('applicant_dashboard');
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-white">
              {authMode === 'register' ? 'চাকরিপ্রার্থী রেজিস্ট্রেশন' : 'নিরাপদ অ্যাকাউন্ট প্রবেশ'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {authMode === 'register' ? 'শুধুমাত্র চাকরিপ্রার্থীদের জন্য উন্মুক্ত' : 'আপনার সঠিক রোলে লগইন করুন'}
            </p>
          </div>
          <button onClick={() => setShowAuthModal(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-xs text-slate-800 space-y-4">
          
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* REGISTER MODE (Job Seeker ONLY) */}
          {authMode === 'register' ? (
            <form onSubmit={handleRegisterSeeker} className="space-y-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>পাবলিক রেজিস্ট্রেশন নীতি:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  এখানে শুধুমাত্র সাধারণ চাকরিপ্রার্থীরা অ্যাকাউন্ট খুলতে পারবেন। কোনো ভুয়া কোম্পানি যাতে রেজিস্ট্রেশন করতে না পারে সেজন্য কোম্পানি অ্যাকাউন্ট শুধুমাত্র সুপার অ্যাডমিন কর্তৃক সরাসরি ইস্যু করা হয়।
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম:</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মো: রবিউল ইসলাম"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    required
                    placeholder="017XXXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড:</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বর্তমান জেলা:</label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  >
                    {BANGLADESH_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা:</label>
                  <input
                    type="text"
                    value={regDegree}
                    onChange={(e) => setRegDegree(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">এনআইডি নম্বর (ঐচ্ছিক):</label>
                <input
                  type="text"
                  placeholder="জাতীয় পরিচয়পত্র নম্বর"
                  value={regNid}
                  onChange={(e) => setRegNid(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm text-xs mt-2"
              >
                চাকরিপ্রার্থী অ্যাকাউন্ট তৈরি করুন
              </button>

              <div className="pt-2 text-center text-slate-500">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  লগইন করুন
                </button>
              </div>
            </form>
          ) : (
            /* LOGIN MODE WITH ROLE SELECTOR TABS */
            <div className="space-y-4">
              
              {/* Role Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveLoginTab('applicant')}
                  className={`py-2 px-2 rounded-lg font-bold text-center transition-all ${
                    activeLoginTab === 'applicant' 
                      ? 'bg-white text-slate-900 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
                  <span>চাকরিপ্রার্থী</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLoginTab('company')}
                  className={`py-2 px-2 rounded-lg font-bold text-center transition-all ${
                    activeLoginTab === 'company' 
                      ? 'bg-white text-slate-900 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 mx-auto mb-1 text-blue-600" />
                  <span>কারখানা/কোম্পানি</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveLoginTab('super_admin')}
                  className={`py-2 px-2 rounded-lg font-bold text-center transition-all ${
                    activeLoginTab === 'super_admin' 
                      ? 'bg-white text-slate-900 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-purple-600" />
                  <span>অ্যাডমিন</span>
                </button>
              </div>

              {/* Company Note */}
              {activeLoginTab === 'company' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                  <strong>কোম্পানিদের জন্য নির্দেশনা:</strong> অ্যাডমিন প্যানেল থেকে আপনার কারখানার জন্য তৈরি করে দেওয়া ইমেইল এবং সিক্রেট এক্সেস পাসওয়ার্ড দিয়ে লগইন করুন।
                </div>
              )}

              {/* Admin Note */}
              {activeLoginTab === 'super_admin' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-[11px] leading-relaxed">
                  <strong>সুপার অ্যাডমিন সিকিউরিটি:</strong> শুধুমাত্র অনুমোদিত সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {activeLoginTab === 'applicant' ? 'ইমেইল অথবা মোবাইল নম্বর:' : 
                     activeLoginTab === 'company' ? 'কারখানা ইমেইল / কোম্পানি আইডি:' : 'অ্যাডমিন ইউজারনেম:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={activeLoginTab === 'applicant' ? '017XXXXXXXX' : 'factory@hameemgroup.com'}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {activeLoginTab === 'company' ? 'অ্যাডমিন প্রদত্ত সিক্রেট পাসওয়ার্ড:' : 'পাসওয়ার্ড:'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 text-white font-bold rounded-lg shadow-sm text-xs transition-colors ${
                    activeLoginTab === 'super_admin' ? 'bg-purple-700 hover:bg-purple-800' :
                    activeLoginTab === 'company' ? 'bg-blue-700 hover:bg-blue-800' :
                    'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  লগইন নিশ্চিত করুন
                </button>
              </form>

              {/* 1-Click Quick Demo Sandbox Switcher */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-semibold block mb-2">
                  টেস্ট মোড (এক ক্লিকে ডেমো প্রবেশ):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('applicant')}
                    className="p-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-[10px] font-bold border border-emerald-200"
                  >
                    চাকরিপ্রার্থী ডেমো
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('company')}
                    className="p-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 rounded text-[10px] font-bold border border-blue-200"
                  >
                    হা-মীম কারখানা ডেমো
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('super_admin')}
                    className="p-1.5 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded text-[10px] font-bold border border-purple-200"
                  >
                    সুপার অ্যাডমিন ডেমো
                  </button>
                </div>
              </div>

              <div className="pt-1 text-center text-slate-500">
                নতুন চাকরিপ্রার্থী?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  রেজিস্ট্রেশন করুন
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
