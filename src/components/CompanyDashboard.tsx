import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JobCircular, Application, ApplicationStatus } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { 
  Building2, 
  Briefcase, 
  PlusCircle, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Wallet, 
  Settings, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  MapPin, 
  Phone, 
  FileText, 
  Search,
  Filter,
  DollarSign
} from 'lucide-react';

export const CompanyDashboard: React.FC = () => {
  const { 
    lang, 
    t, 
    currentCompany, 
    jobs, 
    applications, 
    addJob, 
    updateJob, 
    deleteJob, 
    toggleUrgentJob, 
    updateApplicationStatus,
    categories,
    updateCompanyProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applicants' | 'post_job' | 'profile' | 'wallet'>('overview');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // Filter applicants
  const [applicantFilter, setApplicantFilter] = useState<string>('all');
  const [selectedJobIdFilter, setSelectedJobIdFilter] = useState<string>('all');

  // Interview state
  const [interviewDate, setInterviewDate] = useState('2026-10-10');
  const [interviewTime, setInterviewTime] = useState('10:00 AM');
  const [interviewLocation, setInterviewLocation] = useState(currentCompany.factoryLocation);
  const [interviewInstructions, setInterviewInstructions] = useState('অনুগ্রহ করে আসল এনআইডি ও শিক্ষাগত যোগ্যতার সনদ সাথে আনবেন।');

  // New Job Form State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState('Sewing Operator');
  const [newJobDepartment, setNewJobDepartment] = useState('Production');
  const [newJobVacancies, setNewJobVacancies] = useState(10);
  const [newJobSalaryMin, setNewJobSalaryMin] = useState(14000);
  const [newJobSalaryMax, setNewJobSalaryMax] = useState(18000);
  const [newJobExperience, setNewJobExperience] = useState('2 - 4 years');
  const [newJobEducation, setNewJobEducation] = useState('Class 8 / SSC Pass');
  const [newJobDistrict, setNewJobDistrict] = useState(currentCompany.district);
  const [newJobDeadline, setNewJobDeadline] = useState('2026-11-15');
  const [newJobFee, setNewJobFee] = useState(50);
  const [newJobOvertime, setNewJobOvertime] = useState('দৈনিক ২-৩ ঘণ্টা ওভারটাইম সুবিধা');
  const [newJobFood, setNewJobFood] = useState(true);
  const [newJobTransport, setNewJobTransport] = useState(true);
  const [newJobAccom, setNewJobAccom] = useState(false);
  const [newJobDesc, setNewJobDesc] = useState('রপ্তানিমুখী তৈরি পোশাক কারখানায় কাজের অভিজ্ঞতা সম্পন্ন দক্ষ জনবল প্রয়োজন।');
  const [postSuccessMessage, setPostSuccessMessage] = useState('');

  // Company specific data
  const companyJobs = jobs.filter(j => j.companyId === currentCompany.id);
  const companyApplications = applications.filter(a => a.companyId === currentCompany.id);

  const activeJobsCount = companyJobs.filter(j => j.status === 'active').length;
  const expiredJobsCount = companyJobs.filter(j => j.status === 'expired').length;
  const shortlistedCount = companyApplications.filter(a => a.status === 'shortlisted').length;
  const interviewCount = companyApplications.filter(a => a.status === 'interview').length;
  const selectedCount = companyApplications.filter(a => a.status === 'selected').length;
  const rejectedCount = companyApplications.filter(a => a.status === 'rejected').length;

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    addJob({
      title: newJobTitle,
      category: newJobCategory,
      department: newJobDepartment,
      vacancies: Number(newJobVacancies),
      salaryMin: Number(newJobSalaryMin),
      salaryMax: Number(newJobSalaryMax),
      experienceYears: newJobExperience,
      education: newJobEducation,
      district: newJobDistrict,
      applicationDeadline: newJobDeadline,
      applicationFee: Number(newJobFee),
      overtimeDetails: newJobOvertime,
      description: newJobDesc,
      benefits: {
        foodFacility: newJobFood,
        transportFacility: newJobTransport,
        accommodation: newJobAccom,
        medicalFacility: true,
        festivalBonus: true,
        otherBenefits: ['হাজিরা বোনাস ৳১,০০০', 'ক্লিনিক চিকিৎসা সেবা']
      }
    });

    setPostSuccessMessage('সার্কুলারটি সফলভাবে প্রকাশিত হয়েছে!');
    setTimeout(() => {
      setPostSuccessMessage('');
      setActiveTab('jobs');
    }, 1200);
  };

  const handleScheduleInterview = () => {
    if (!selectedApp) return;

    updateApplicationStatus(selectedApp.id, 'interview', {
      date: interviewDate,
      time: interviewTime,
      type: 'In-Person',
      location: interviewLocation,
      instructions: interviewInstructions
    });

    setShowInterviewModal(false);
    setSelectedApp(null);
  };

  // Filtered applications
  const filteredApps = companyApplications.filter(app => {
    if (applicantFilter !== 'all' && app.status !== applicantFilter) return false;
    if (selectedJobIdFilter !== 'all' && app.jobId !== selectedJobIdFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner with Company Info & Verification Badge */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={currentCompany.logo}
            alt={currentCompany.name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 bg-white"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{currentCompany.name}</h1>
              {currentCompany.isVerified ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ভেরিফাইড কোম্পানি</span>
                </span>
              ) : (
                <span className="text-amber-400 text-xs font-semibold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  অ্যাডমিন যাচাইকরণ বাকি
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {currentCompany.factoryLocation} · ট্রেড লাইসেন্স: {currentCompany.tradeLicenseNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('post_job')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন সার্কুলার পোস্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Functional interactive button tabs) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'ওভারভিউ ড্যাশবোর্ড', icon: Briefcase },
          { id: 'jobs', label: `সার্কুলারসমূহ (${companyJobs.length})`, icon: FileText },
          { id: 'applicants', label: `আবেদনকারী (${companyApplications.length})`, icon: Users },
          { id: 'post_job', label: 'নতুন নিয়োগ ফর্ম', icon: PlusCircle },
          { id: 'wallet', label: 'কোম্পানি ওয়ালেট ও লেজার', icon: Wallet },
          { id: 'profile', label: 'ফ্যাক্টরি প্রোফাইল', icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRIC CARDS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">মোট সার্কুলার</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{companyJobs.length}</div>
              <span className="text-[11px] text-emerald-600 font-medium">{activeJobsCount} টি বর্তমানে সক্রিয়</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">মোট আবেদন জমা</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{companyApplications.length}</div>
              <span className="text-[11px] text-blue-600 font-medium">{shortlistedCount} জন শর্টলিস্টেড</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">ইন্টারভিউ শিডিউল</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{interviewCount}</div>
              <span className="text-[11px] text-slate-500 font-medium">আহ্বান পাঠানো হয়েছে</span>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">চূড়ান্ত নির্বাচিত</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{selectedCount}</div>
              <span className="text-[11px] text-slate-500 font-medium">নিয়োগ প্রক্রিয়ায় অন্তর্ভুক্ত</span>
            </div>
          </div>

          {/* Recent Circulars Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">সাম্প্রতিক সক্রিয় সার্কুলারসমূহ</h3>
              <button 
                onClick={() => setActiveTab('jobs')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                সবগুলো দেখুন
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {companyJobs.slice(0, 3).map(j => (
                <div key={j.id} className="py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{j.title}</span>
                    <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                      <span>{j.category}</span>
                      <span>·</span>
                      <span>পদ: {j.vacancies} জন</span>
                      <span>·</span>
                      <span>আবেদন ফি: ৳{j.applicationFee}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-semibold">{j.applicationsCount} টি আবেদন</span>
                    <button
                      onClick={() => {
                        setSelectedJobIdFilter(j.id);
                        setActiveTab('applicants');
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md transition-colors"
                    >
                      আবেদনকারী দেখুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JOB CIRCULARS MANAGER */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-extrabold text-sm text-slate-900">সকল চাকরির সার্কুলার ({companyJobs.length})</h3>
            <button
              onClick={() => setActiveTab('post_job')}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>নতুন সার্কুলার যোগ করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">পদের নাম</th>
                  <th className="p-3">ক্যাটাগরি</th>
                  <th className="p-3">পদসংখ্যা</th>
                  <th className="p-3">বেতন সীমা</th>
                  <th className="p-3">আবেদন ফি</th>
                  <th className="p-3">আবেদন সংখ্যা</th>
                  <th className="p-3">ডেডলাইন</th>
                  <th className="p-3">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {companyJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-bold text-slate-900">
                      <div>{job.title}</div>
                      {job.isUrgent && <span className="text-[10px] text-red-600 font-semibold">জরুরি নিয়োগ</span>}
                    </td>
                    <td className="p-3">{job.category}</td>
                    <td className="p-3 font-semibold">{job.vacancies} জন</td>
                    <td className="p-3 font-mono">৳{job.salaryMin} - ৳{job.salaryMax}</td>
                    <td className="p-3 font-mono">৳{job.applicationFee}</td>
                    <td className="p-3 font-bold text-emerald-700">{job.applicationsCount}</td>
                    <td className="p-3 text-slate-500">{job.applicationDeadline}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleUrgentJob(job.id)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                            job.isUrgent ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {job.isUrgent ? 'জরুরি বাদ' : 'জরুরি করুন'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedJobIdFilter(job.id);
                            setActiveTab('applicants');
                          }}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-semibold hover:bg-slate-800"
                        >
                          প্রার্থী
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px]"
                        >
                          ডিলিট
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPLICANTS PIPELINE (SHORTLIST, INTERVIEW, SELECT, REJECT) */}
      {activeTab === 'applicants' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-500">ফিল্টার:</span>
              <select
                value={applicantFilter}
                onChange={(e) => setApplicantFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="all">সকল অবস্থা (All Status)</option>
                <option value="applied">নতুন আবেদন (Applied)</option>
                <option value="shortlisted">শর্টলিস্টেড (Shortlisted)</option>
                <option value="interview">ইন্টারভিউ (Interview)</option>
                <option value="selected">নির্বাচিত (Selected)</option>
                <option value="rejected">বাতিল (Rejected)</option>
              </select>

              <select
                value={selectedJobIdFilter}
                onChange={(e) => setSelectedJobIdFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-lg text-xs"
              >
                <option value="all">সকল সার্কুলার</option>
                {companyJobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            <span className="text-slate-500 font-medium">
              মোট আবেদনকারী: <strong className="text-slate-900">{filteredApps.length}</strong>
            </span>
          </div>

          {/* Applicants Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">প্রার্থী</th>
                    <th className="p-3">আবেদনকৃত পদ</th>
                    <th className="p-3">অভিজ্ঞতা ও ডিগ্রি</th>
                    <th className="p-3">প্রত্যাশিত বেতন</th>
                    <th className="p-3">পেমেন্ট স্ট্যাটাস</th>
                    <th className="p-3">বর্তমান অবস্থা</th>
                    <th className="p-3">ব্যবস্থা গ্রহণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        কোনো আবেদনকারী পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/60">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={app.applicantPhoto || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80'}
                              alt={app.applicantName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{app.applicantName}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{app.applicantPhone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-900">{app.jobTitle}</td>
                        <td className="p-3">
                          <div>{app.experienceYears}</div>
                          <div className="text-[11px] text-slate-500">{app.highestDegree}</div>
                        </td>
                        <td className="p-3 font-semibold font-mono">৳{app.expectedSalary}</td>
                        <td className="p-3">
                          <span className="font-mono text-emerald-700 font-semibold block">
                            {app.paymentStatus === 'paid' ? '৳' + app.totalPaid : 'ফ্রি'}
                          </span>
                          {app.paymentTrxId && (
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              TrxID: {app.paymentTrxId}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            app.status === 'shortlisted' ? 'bg-blue-50 text-blue-700' :
                            app.status === 'interview' ? 'bg-amber-50 text-amber-700' :
                            app.status === 'selected' ? 'bg-emerald-50 text-emerald-700' :
                            app.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {app.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            <button
                              onClick={() => {
                                updateApplicationStatus(app.id, 'shortlisted');
                              }}
                              className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold"
                            >
                              শর্টলিস্ট
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setShowInterviewModal(true);
                              }}
                              className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[11px] font-semibold"
                            >
                              ইন্টারভিউ
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'selected')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[11px] font-semibold"
                            >
                              সিলেক্ট
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app.id, 'rejected')}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px]"
                            >
                              বাতিল
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POST JOB CIRCULAR FORM */}
      {activeTab === 'post_job' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-3xl mx-auto text-slate-800">
          <div className="border-b border-slate-200 pb-4 mb-5">
            <h3 className="font-black text-lg text-slate-900">নতুন গার্মেন্টস সার্কুলার প্রকাশ করুন</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              কারখানার নির্ধারিত পদ অনুযায়ী সঠিক তথ্য প্রদান করুন।
            </p>
          </div>

          {postSuccessMessage && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>{postSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handlePostJob} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">পদের নাম (Title):</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সিনিয়র সুইং অপারেটর (ওভারলক)"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">গার্মেন্টস ক্যাটাগরি:</label>
                <select
                  value={newJobCategory}
                  onChange={(e) => setNewJobCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.nameEn}>{c.nameEn} ({c.nameBn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ডিপার্টমেন্ট:</label>
                <input
                  type="text"
                  value={newJobDepartment}
                  onChange={(e) => setNewJobDepartment(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">পদসংখ্যা (Vacancies):</label>
                <input
                  type="number"
                  min={1}
                  value={newJobVacancies}
                  onChange={(e) => setNewJobVacancies(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ন্যূনতম মাসিক বেতন (৳):</label>
                <input
                  type="number"
                  value={newJobSalaryMin}
                  onChange={(e) => setNewJobSalaryMin(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সর্বোচ্চ মাসিক বেতন (৳):</label>
                <input
                  type="number"
                  value={newJobSalaryMax}
                  onChange={(e) => setNewJobSalaryMax(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রয়োজনীয় অভিজ্ঞতা:</label>
                <input
                  type="text"
                  value={newJobExperience}
                  onChange={(e) => setNewJobExperience(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা:</label>
                <input
                  type="text"
                  value={newJobEducation}
                  onChange={(e) => setNewJobEducation(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">কারখানার জেলা (Location):</label>
                <select
                  value={newJobDistrict}
                  onChange={(e) => setNewJobDistrict(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                >
                  {BANGLADESH_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">আবেদনের শেষ তারিখ (Deadline):</label>
                <input
                  type="date"
                  value={newJobDeadline}
                  onChange={(e) => setNewJobDeadline(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  আবেদন ফি (৳) (বিনা ফি হলে ০ দিন):
                </label>
                <input
                  type="number"
                  value={newJobFee}
                  onChange={(e) => setNewJobFee(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ওভারটাইম তথ্য:</label>
                <input
                  type="text"
                  value={newJobOvertime}
                  onChange={(e) => setNewJobOvertime(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Benefits checkboxes */}
            <div className="pt-2">
              <label className="block font-bold text-slate-700 mb-2">ফ্যাক্টরি সুযোগ-সুবিধা:</label>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={newJobFood} onChange={(e) => setNewJobFood(e.target.checked)} />
                  <span>ক্যান্টিন ও খাবার সুবিধা</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={newJobTransport} onChange={(e) => setNewJobTransport(e.target.checked)} />
                  <span>ফ্যাক্টরি স্টাফ বাস</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={newJobAccom} onChange={(e) => setNewJobAccom(e.target.checked)} />
                  <span>আবাসন / থাকার ব্যবস্থা</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">কাজের বিবরণ (Job Description):</label>
              <textarea
                rows={3}
                value={newJobDesc}
                onChange={(e) => setNewJobDesc(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('jobs')}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md"
              >
                সার্কুলার প্রকাশ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: COMPANY WALLET & REVENUE LEDGER */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">মোট আবেদন ফি জমা</span>
              <div className="text-2xl font-black text-slate-900 mt-1">৳৪,২০০</div>
              <span className="text-[11px] text-emerald-600 font-medium">সরাসরি গেটওয়ে মারফত প্রাপ্ত</span>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium">প্ল্যাটফর্ম কমিশন কর্তন (১০%)</span>
              <div className="text-2xl font-black text-slate-600 mt-1">৳৪২০</div>
              <span className="text-[11px] text-slate-400 font-medium">অ্যাডমিন ফি</span>
            </div>
            <div className="p-5 bg-white rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-2xs">
              <span className="text-xs text-emerald-800 font-medium">কোম্পানি প্রাপ্য নীট ব্যালেন্স</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">৳৩,৭৮০</div>
              <span className="text-[11px] text-emerald-700 font-medium">ব্যাংক ট্রান্সফার প্রস্তুত</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FACTORY PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl mx-auto text-xs text-slate-800 space-y-4">
          <h3 className="font-black text-base text-slate-900 border-b border-slate-200 pb-3">
            কারখানা ও নিয়োগকর্তা প্রোফাইল
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">কোম্পানির নাম:</label>
              <input
                type="text"
                value={currentCompany.name}
                disabled
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">ব্যবসার ধরণ:</label>
              <input
                type="text"
                value={currentCompany.businessType}
                disabled
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">ফ্যাক্টরি লোকেশন:</label>
              <input
                type="text"
                value={currentCompany.factoryLocation}
                disabled
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">ট্রেড লাইসেন্স নম্বর:</label>
              <input
                type="text"
                value={currentCompany.tradeLicenseNumber}
                disabled
                className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Interview Scheduling Modal Popup */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">ইন্টারভিউ শিডিউল করুন</h3>
                <p className="text-xs text-slate-500">{selectedApp.applicantName} - {selectedApp.jobTitle}</p>
              </div>
              <button onClick={() => setShowInterviewModal(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">তারিখ:</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">সময়:</label>
                <input
                  type="text"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ইন্টারভিউ স্থান (Location):</label>
                <input
                  type="text"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">প্রার্থীর জন্য নির্দেশনা:</label>
                <textarea
                  rows={2}
                  value={interviewInstructions}
                  onChange={(e) => setInterviewInstructions(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                বাতিল
              </button>
              <button
                onClick={handleScheduleInterview}
                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
              >
                শিডিউল নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
