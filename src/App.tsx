import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JobCard } from './components/JobCard';
import { JobSearchSection } from './components/JobSearchSection';
import { CategoriesBrowser } from './components/CategoriesBrowser';
import { CompaniesDirectory } from './components/CompaniesDirectory';
import { CompanyDashboard } from './components/CompanyDashboard';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { ApplicantDashboard } from './components/ApplicantDashboard';
import { RestApiExplorer } from './components/RestApiExplorer';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ApplicationFlowModal } from './components/ApplicationFlowModal';
import { DigitalCVBuilder } from './components/DigitalCVBuilder';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { JobCircular, Application } from './types';
import { 
  Briefcase, 
  Flame, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  CreditCard, 
  FileText,
  Clock,
  MapPin
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    role, 
    lang, 
    t, 
    jobs, 
    companies, 
    categories, 
    activeView, 
    setActiveView,
    selectedJob,
    setSelectedJob,
    applyingJob,
    setApplyingJob,
    showCvModal,
    setShowCvModal
  } = useApp();

  // Search parameters when transferring from Hero to Jobs View
  const [searchParams, setSearchParams] = useState<{ query: string; category: string; district: string }>({
    query: '',
    category: '',
    district: ''
  });

  const handleHeroSearch = (filters: { query: string; category: string; district: string }) => {
    setSearchParams(filters);
    setActiveView('jobs');
  };

  const urgentJobs = jobs.filter(j => j.isUrgent && j.status === 'active');
  const featuredJobs = jobs.filter(j => j.isFeatured && j.status === 'active');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* VIEW 1: HOME VIEW */}
        {activeView === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <HeroSection onSearch={handleHeroSearch} />

            {/* Urgent Hiring Carousel / Strip (Requirement #23) */}
            {urgentJobs.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                      <Flame className="w-5 h-5 fill-red-600" />
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-900">
                        জরুরি নিয়োগ সার্কুলার (Urgent Hiring)
                      </h2>
                      <p className="text-xs text-slate-500">
                        সরাসরি ইন্টারভিউ ও অবিলম্বে কাজে যোগদানের সুযোগ
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveView('jobs')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <span>সকল জরুরি সার্কুলার</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {urgentJobs.slice(0, 3).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelect={(j) => setSelectedJob(j)}
                      onApply={(j) => setApplyingJob(j)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Featured Circulars Section (Requirement #22) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      ফিচার্ড ও শীর্ষ সার্কুলার (Featured Jobs)
                    </h2>
                    <p className="text-xs text-slate-500">
                      শীর্ষস্থানীয় রপ্তানিমুখী গার্মেন্টস ও টেক্সটাইল গ্রুপসমূহ
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('jobs')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>সবগুলো দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {featuredJobs.slice(0, 6).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={(j) => setSelectedJob(j)}
                    onApply={(j) => setApplyingJob(j)}
                  />
                ))}
              </div>
            </section>

            {/* How It Works Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                    সহজ ও স্বচ্ছ নিয়োগ প্রক্রিয়া
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    কীভাবে গার্মেন্টসনিয়োগ কাজ করে?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    দালালমুক্ত পরিবেশে সরাসরি কারখানায় আবেদন ও ডিজিটাল ট্র্যাকিং
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 text-center">
                  <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                      ১
                    </div>
                    <h3 className="font-bold text-base text-white">ডিজিটাল সিভি তৈরি করুন</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      মেশিন চালনা পারদর্শিতা (Juki, Overlock, Flatlock) ও অভিজ্ঞতার তথ্য দিয়ে বিনামূল্যে স্ট্যান্ডার্ড সিভি তৈরি করুন।
                    </p>
                  </div>

                  <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                      ২
                    </div>
                    <h3 className="font-bold text-base text-white">স্বচ্ছ ফিতে অনলাইন আবেদন</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      যেকোনো সার্কুলারে ১-ক্লিকে আবেদন করুন। কোনো লুকানো চার্জ ছাড়া সরাসরি bKash/Nagad দিয়ে পেমেন্ট ও রসিদ সংগ্রহ করুন।
                    </p>
                  </div>

                  <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold mb-4">
                      ৩
                    </div>
                    <h3 className="font-bold text-base text-white">ইন্টারভিউ ও চূড়ান্ত নিয়োগ</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      কারখানা কর্তৃপক্ষ সরাসরি ড্যাশবোর্ডে আপনার ইন্টারভিউ শিডিউল পাঠাবে। এসএমএস ও পোর্টালে নোটিফিকেশন পান।
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: JOBS SEARCH VIEW */}
        {activeView === 'jobs' && (
          <JobSearchSection
            initialCategory={searchParams.category}
            initialDistrict={searchParams.district}
            initialQuery={searchParams.query}
            onSelectJob={(j) => setSelectedJob(j)}
            onApplyJob={(j) => setApplyingJob(j)}
          />
        )}

        {/* VIEW 3: CATEGORIES BROWSER */}
        {activeView === 'categories' && (
          <CategoriesBrowser
            onSelectCategory={(catName) => {
              setSearchParams({ query: '', category: catName, district: '' });
              setActiveView('jobs');
            }}
          />
        )}

        {/* VIEW 4: COMPANIES DIRECTORY */}
        {activeView === 'companies' && (
          <CompaniesDirectory
            onSelectCompany={(compId) => {
              const comp = companies.find(c => c.id === compId);
              setSearchParams({ query: comp?.name || '', category: '', district: '' });
              setActiveView('jobs');
            }}
          />
        )}

        {/* VIEW 5: COMPANY DASHBOARD */}
        {(activeView === 'company_dashboard' || activeView === 'company_dashboard_post_job') && (
          <CompanyDashboard />
        )}

        {/* VIEW 6: SUPER ADMIN DASHBOARD */}
        {activeView === 'admin_dashboard' && (
          <SuperAdminDashboard />
        )}

        {/* VIEW 7: APPLICANT DASHBOARD */}
        {activeView === 'applicant_dashboard' && (
          <ApplicantDashboard />
        )}

        {/* VIEW 8: REST API EXPLORER */}
        {activeView === 'api_explorer' && (
          <RestApiExplorer />
        )}
      </main>

      {/* Global Modals */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={(j) => {
            setSelectedJob(null);
            setApplyingJob(j);
          }}
        />
      )}

      {applyingJob && (
        <ApplicationFlowModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={(app, tx) => {
            // Keep open in confirmed step
          }}
        />
      )}

      {showCvModal && (
        <DigitalCVBuilder onClose={() => setShowCvModal(false)} />
      )}

      <AuthModal />

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
