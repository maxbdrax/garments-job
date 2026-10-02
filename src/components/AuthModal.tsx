import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
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
  Info,
  Key
} from 'lucide-react';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { Logo } from './Logo';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    authMode, 
    setAuthMode, 
    login, 
    registerSeeker 
  } = useApp();

  // Register fields (Job Seeker ONLY)
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDistrict, setRegDistrict] = useState('Gazipur');
  const [regNid, setRegNid] = useState('');
  const [regDegree, setRegDegree] = useState('Class 8 / SSC Pass');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!showAuthModal) return null;

  const handleRegisterSeekerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const res = await registerSeeker({
        name: regName,
        phone: regPhone,
        email: regEmail,
        password: regPassword,
        district: regDistrict,
        nidNumber: regNid,
        highestDegree: regDegree
      });

      if (!res.success) {
        setLoginError(res.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।');
      } else {
        setSuccessMsg('চাকরিপ্রার্থী একাউন্ট সফলভাবে তৈরি হয়েছে!');
        setTimeout(() => {
          setShowAuthModal(false);
        }, 800);
      }
    } catch (err: any) {
      setLoginError(err.message || 'রেজিস্ট্রেশনে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const res = await login(loginIdentifier, loginPassword);
      if (!res.success) {
        setLoginError(res.message || 'লগইন ব্যর্থ হয়েছে।');
      } else {
        setSuccessMsg(
          res.role === 'super_admin' ? 'সুপার অ্যাডমিন হিসেবে লগইন সফল!' :
          res.role === 'company' ? 'কারখানা কর্তৃপক্ষ হিসেবে লগইন সফল!' :
          'চাকরিপ্রার্থী হিসেবে লগইন সফল!'
        );
        setTimeout(() => {
          setShowAuthModal(false);
        }, 700);
      }
    } catch (err: any) {
      setLoginError(err.message || 'লগইন ত্রুটি।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in duration-200 border border-slate-100">
        
        {/* Header with Garments Niyog Logo */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <Logo size="sm" variant="light" showTagline={false} />
          <button 
            onClick={() => setShowAuthModal(false)} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 text-xs text-slate-800 space-y-4">
          
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* REGISTER MODE (Job Seeker ONLY) */}
          {authMode === 'register' ? (
            <form onSubmit={handleRegisterSeekerSubmit} className="space-y-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  নতুন চাকরিপ্রার্থী রেজিস্ট্রেশন
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  গার্মেন্টস ও টেক্সটাইল কারখানায় সরাসরি আবেদনের জন্য একাউন্ট খুলুন
                </p>
              </div>

              {/* Seeker registration notice */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>শুধুমাত্র চাকরিপ্রার্থীদের জন্য:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  পাবলিকভাবে শুধুমাত্র চাকরিপ্রার্থী রেজিস্ট্রেশন করতে পারবেন। কোনো ফ্যাক্টরি বা কোম্পানি একাউন্ট বহিরাগত কেউ খুলতে পারবে না; সকল কোম্পানি একাউন্ট শুধুমাত্র সুপার অ্যাডমিন কর্তৃক ইস্যু করা হয়।
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
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">জেলা (District):</label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white"
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
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">জাতীয় পরিচয়পত্র (NID) নম্বর:</label>
                <input
                  type="text"
                  placeholder="যেমন: 19983315200004123"
                  value={regNid}
                  onChange={(e) => setRegNid(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50/50 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md text-xs mt-2 transition-all flex items-center justify-center gap-1.5"
              >
                {isLoading ? (
                  <span>একাউন্ট তৈরি হচ্ছে...</span>
                ) : (
                  <>
                    <span>চাকরিপ্রার্থী একাউন্ট নিশ্চিত করুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-slate-500">
                ইতিমধ্যে একাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setLoginError(''); }}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  লগইন করুন
                </button>
              </div>
            </form>
          ) : (
            /* REAL LOGIN MODE (SEEKER / COMPANY WITH ADMIN ID / SECRET ADMIN) */
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  নিরাপদ একাউন্ট প্রবেশ (Login)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  চাকরিপ্রার্থী, অনুমোদিত কারখানা কর্তৃপক্ষ ও সুপার অ্যাডমিন পোর্টাল
                </p>
              </div>

              {/* Login explanation note */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-600 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  <span>লগইন নির্দেশিকা:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 pl-1">
                  <li><strong>চাকরিপ্রার্থী:</strong> আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল এবং পাসওয়ার্ড দিন।</li>
                  <li><strong>কারখানা/কোম্পানি:</strong> অ্যাডমিন কর্তৃক দেওয়া কারখানার আইডি/ইমেইল এবং সিক্রেট পাসওয়ার্ড দিন।</li>
                  <li><strong>সুপার অ্যাডমিন:</strong> অ্যাডমিন সিক্রেট ইউজারনেম ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।</li>
                </ul>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ইউজারনেম / ইমেইল / মোবাইল নম্বর:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="মোবাইল, ইমেইল বা অ্যাডমিন ইউজারনেম"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    গোপন পাসওয়ার্ড (Password):
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <span>যাচাইকরণ হচ্ছে...</span>
                  ) : (
                    <>
                      <span>লগইন করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-slate-500">
                নতুন চাকরিপ্রার্থী?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setLoginError(''); }}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  চাকরিপ্রার্থী রেজিস্ট্রেশন করুন
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
