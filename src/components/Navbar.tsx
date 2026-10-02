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
  LogIn,
  UserPlus,
  LogOut,
  Cloud
} from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const { 
    currentUser,
    role, 
    lang, 
    setLang, 
    t, 
    notifications, 
    activeView, 
    setActiveView,
    currentCompany,
    setShowCvModal,
    setShowAuthModal,
    setAuthMode,
    logout,
    firebaseConnected
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Briefcase },
    { id: 'jobs', label: t('navFindJobs'), icon: Search },
    { id: 'categories', label: t('navCategories'), icon: Layers },
    { id: 'companies', label: t('navCompanies'), icon: Building2 },
    { id: 'cv_builder', label: t('navCvBuilder'), icon: FileText, action: () => setShowCvModal(true) },
    { id: 'api_explorer', label: t('navApi'), icon: Code }
  ];

  const handleOpenLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
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
                ? '🇧🇩 সরকারি শ্রম আইন অনুযায়ী সম্পূর্ণ ভেরিফাইড গার্মেন্টস সার্কুলার পোর্টাল | ক্লাউড ডাটাবেজ সক্রিয়' 
                : '🇧🇩 100% Verified Garments Job Portal with Real-Time Cloud Sync'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden sm:inline">হেল্পলাইন: <strong className="text-white font-mono">09612-445566</strong></span>
            
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
          {/* Garments Niyog Logo */}
          <button 
            onClick={() => setActiveView('home')}
            className="flex items-center text-left group"
          >
            <Logo size="md" variant="dark" />
          </button>

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

          {/* User Actions & Authenticated Status (NO FAKE DEMO SWITCHER) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* NOT LOGGED IN GUEST ACTIONS */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenLogin}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>লগইন</span>
                </button>

                <button
                  onClick={handleOpenRegister}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>চাকরিপ্রার্থী রেজিস্ট্রেশন</span>
                </button>
              </div>
            ) : (
              /* AUTHENTICATED USER STATE */
              <div className="flex items-center gap-2">
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

                {/* Role Specific Actions */}
                {currentUser.role === 'super_admin' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveView('admin_dashboard')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeView === 'admin_dashboard' 
                          ? 'bg-purple-900 text-white' 
                          : 'bg-purple-700 text-white hover:bg-purple-800 shadow-xs'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">অ্যাডমিন প্যানেল</span>
                    </button>
                    <button
                      onClick={logout}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="লগআউট"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : currentUser.role === 'company' ? (
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
                      <span className="hidden sm:inline">{currentUser.name}</span>
                    </button>
                    <button
                      onClick={() => setActiveView('company_dashboard_post_job')}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{t('navPostJob')}</span>
                    </button>
                    <button
                      onClick={logout}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="লগআউট"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveView('applicant_dashboard')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeView === 'applicant_dashboard' 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-800 text-white hover:bg-slate-900 shadow-xs'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{currentUser.name}</span>
                    </button>
                    <button
                      onClick={logout}
                      className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="লগআউট"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {!currentUser ? (
            <div className="flex gap-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => { handleOpenRegister(); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 rounded-xl text-center"
              >
                চাকরিপ্রার্থী রেজিস্ট্রেশন
              </button>
              <button
                onClick={() => { handleOpenLogin(); setMobileMenuOpen(false); }}
                className="flex-1 py-2 text-xs font-bold text-slate-800 bg-slate-100 rounded-xl border border-slate-200 text-center"
              >
                লগইন
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-900">
                {currentUser.name} ({currentUser.role === 'super_admin' ? 'অ্যাডমিন' : currentUser.role === 'company' ? 'কারখানা' : 'চাকরিপ্রার্থী'})
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-xs text-red-600 font-bold"
              >
                লগআউট
              </button>
            </div>
          )}

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
