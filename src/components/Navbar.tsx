import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Briefcase, 
  Search, 
  Layers, 
  Building2, 
  FileText, 
  Bell, 
  User, 
  ShieldCheck, 
  Globe, 
  PlusCircle, 
  Menu, 
  X, 
  Code, 
  ChevronDown,
  CheckCircle2,
  LogIn,
  UserPlus,
  Cloud
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    role, 
    setRole, 
    lang, 
    setLang, 
    t, 
    notifications, 
    activeView, 
    setActiveView,
    applicantProfile,
    currentCompany,
    setShowCvModal,
    setShowAuthModal,
    setAuthMode,
    setAuthTargetRole,
    firebaseConnected
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const roleNames: Record<UserRole, { bn: string; en: string; icon: any; color: string }> = {
    applicant: { 
      bn: 'চাকরিপ্রার্থী (রবিউল ইসলাম)', 
      en: 'Job Seeker (Robiul Islam)', 
      icon: User, 
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200' 
    },
    company: { 
      bn: `কোম্পানি (${currentCompany.name})`, 
      en: `Employer (${currentCompany.name})`, 
      icon: Building2, 
      color: 'bg-blue-50 text-blue-800 border-blue-200' 
    },
    super_admin: { 
      bn: 'সুপার অ্যাডমিন প্যানেল', 
      en: 'Super Admin Portal', 
      icon: ShieldCheck, 
      color: 'bg-purple-50 text-purple-800 border-purple-200' 
    }
  };

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Briefcase },
    { id: 'jobs', label: t('navFindJobs'), icon: Search },
    { id: 'categories', label: t('navCategories'), icon: Layers },
    { id: 'companies', label: t('navCompanies'), icon: Building2 },
    { id: 'cv_builder', label: t('navCvBuilder'), icon: FileText, action: () => setShowCvModal(true) },
    { id: 'api_explorer', label: t('navApi'), icon: Code }
  ];

  const openRegister = () => {
    setAuthMode('register');
    setAuthTargetRole('applicant');
    setShowAuthModal(true);
  };

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice for Bangladesh Workers */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              {lang === 'bn' 
                ? '🇧🇩 সরকারি শ্রম আইন অনুযায়ী সম্পূর্ণ ভেরিফাইড গার্মেন্টস সার্কুলার পোর্টাল | ক্লাউড ডাটাবেজ কানেক্টেড' 
                : '🇧🇩 100% Verified Garments Job Portal with Real-Time Cloud Sync'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">হেল্পলাইন: <strong className="text-white font-mono">09612-445566</strong></span>
            
            {/* Cloud Sync Status */}
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Cloud className="w-3.5 h-3.5" />
              <span>Firebase Synced</span>
            </span>

            <button 
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1.5 text-xs text-white hover:text-emerald-400 font-medium transition-colors"
              title="Toggle Bengali / English"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:bg-emerald-600 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15.5 3.5 5 5-11 11-5-1 1-5z" />
                  <path d="M19.5 7.5 17 5" />
                  <path d="m9.5 14.5-2.5 2.5" />
                  <path d="M4.5 19.5c1.5-1.5 3-1.5 4.5 0" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    Garments<span className="text-emerald-600">Niyog</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    BD
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none hidden sm:block">
                  {lang === 'bn' ? 'তৈরি পোশাক ও টেক্সটাইল নিয়োগ' : 'RMG & Textile Career Platform'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveView(item.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-emerald-700 border-b-2 border-emerald-600 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-75" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Role Switcher & User Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Register button (Seeker Only) */}
            <button
              onClick={openRegister}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>রেজিস্ট্রেশন</span>
            </button>

            {/* Login button */}
            <button
              onClick={openLogin}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন</span>
            </button>

            {/* Interactive Role Switcher for seamless demo testing */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs ${roleNames[role].color}`}
                title="Click to switch perspective (Job Seeker / Company / Admin)"
              >
                {React.createElement(roleNames[role].icon, { className: 'w-3.5 h-3.5' })}
                <span className="font-semibold hidden md:inline">{roleNames[role][lang]}</span>
                <span className="font-semibold md:hidden">
                  {role === 'applicant' ? 'Seeker' : role === 'company' ? 'Company' : 'Admin'}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {lang === 'bn' ? 'ব্যবহারকারী রোল পরিবর্তন' : 'Switch Active Perspective'}
                  </div>
                  {(['applicant', 'company', 'super_admin'] as UserRole[]).map((r) => {
                    const info = roleNames[r];
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setRole(r);
                          setRoleDropdownOpen(false);
                          if (r === 'super_admin') setActiveView('admin_dashboard');
                          else if (r === 'company') setActiveView('company_dashboard');
                          else setActiveView('home');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors ${
                          isSelected ? 'bg-slate-50 font-semibold text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {React.createElement(info.icon, { className: 'w-4 h-4 text-slate-500' })}
                          <span>{info[lang]}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                  onMouseLeave={() => setNotifDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800">
                      {lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
                    </span>
                    <span className="text-[11px] text-slate-500">{notifications.length} মোট</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">কোনো নোটিফিকেশন নেই</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 text-xs">
                          <p className="font-semibold text-slate-900">{n.title}</p>
                          <p className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard / Post Job Action */}
            {role === 'super_admin' ? (
              <button
                onClick={() => setActiveView('admin_dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'admin_dashboard' 
                    ? 'bg-purple-900 text-white' 
                    : 'bg-purple-700 text-white hover:bg-purple-800 shadow-xs'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </button>
            ) : role === 'company' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('company_dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeView === 'company_dashboard' 
                      ? 'bg-blue-900 text-white' 
                      : 'bg-blue-700 text-white hover:bg-blue-800 shadow-xs'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('navDashboard')}</span>
                </button>
                <button
                  onClick={() => setActiveView('company_dashboard_post_job')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('navPostJob')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('applicant_dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeView === 'applicant_dashboard' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-800 text-white hover:bg-slate-900 shadow-xs'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('myApplications')}</span>
              </button>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          <div className="flex gap-2 pb-2 border-b border-slate-100 mb-2">
            <button
              onClick={() => { openRegister(); setMobileMenuOpen(false); }}
              className="flex-1 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200 text-center"
            >
              রেজিস্ট্রেশন (Seeker)
            </button>
            <button
              onClick={() => { openLogin(); setMobileMenuOpen(false); }}
              className="flex-1 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg border border-slate-200 text-center"
            >
              লগইন
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveView(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  activeView === item.id ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">ভাষা পরিবর্তন:</span>
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md"
            >
              {lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
