import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  FileText, 
  Bookmark, 
  Building2, 
  Bell, 
  Printer, 
  CheckCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  QrCode,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Application } from '../types';

export const ApplicantDashboard: React.FC = () => {
  const { 
    lang, 
    t, 
    applicantProfile, 
    applications, 
    jobs, 
    companies, 
    toggleSaveJob, 
    toggleFollowCompany,
    setSelectedJob,
    setShowCvModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'applications' | 'interviews' | 'saved' | 'companies'>('applications');
  const [selectedReceiptApp, setSelectedReceiptApp] = useState<Application | null>(null);

  const myApplications = applications.filter(a => a.applicantId === applicantProfile.id);
  const myInterviews = myApplications.filter(a => a.status === 'interview' && a.interviewSchedule);
  const mySavedJobs = jobs.filter(j => applicantProfile.savedJobIds.includes(j.id));
  const myFollowedCompanies = companies.filter(c => applicantProfile.followedCompanyIds.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={applicantProfile.photo}
            alt={applicantProfile.name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-emerald-500 shadow-md bg-white"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{applicantProfile.name}</h1>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ভেরিফাইড আবেদনকারী
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {applicantProfile.phone} · {applicantProfile.highestDegree} · {applicantProfile.district}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCvModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>ডিজিটাল সিভি দেখুন ও প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 text-xs">
        {[
          { id: 'applications', label: `আমার আবেদনসমূহ (${myApplications.length})`, icon: FileText },
          { id: 'interviews', label: `ইন্টারভিউ কল (${myInterviews.length})`, icon: Calendar },
          { id: 'saved', label: `সংরক্ষিত সার্কুলার (${mySavedJobs.length})`, icon: Bookmark },
          { id: 'companies', label: `অনুসরণ করা কারখানা (${myFollowedCompanies.length})`, icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold whitespace-nowrap transition-colors ${
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

      {/* TAB 1: APPLICATIONS LIST */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              আপনি এখনো কোনো সার্কুলারে আবেদন করেননি।
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="p-3">আবেদন নম্বর</th>
                      <th className="p-3">পদের নাম</th>
                      <th className="p-3">কারখানা</th>
                      <th className="p-3">আবেদনের তারিখ</th>
                      <th className="p-3">পরিশোধিত ফি</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3">রসিদ ও অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {myApplications.map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-bold text-slate-900">{app.id}</td>
                        <td className="p-3 font-semibold text-slate-900">{app.jobTitle}</td>
                        <td className="p-3">{app.companyName}</td>
                        <td className="p-3 text-slate-500">{app.appliedDate}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">
                          {app.totalPaid > 0 ? `৳${app.totalPaid}` : 'ফ্রি'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            app.status === 'shortlisted' ? 'bg-blue-50 text-blue-700' :
                            app.status === 'interview' ? 'bg-amber-50 text-amber-700 animate-pulse' :
                            app.status === 'selected' ? 'bg-emerald-50 text-emerald-700 font-bold' :
                            app.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {app.status === 'shortlisted' ? 'বাছাইকৃত' :
                             app.status === 'interview' ? 'ইন্টারভিউ নির্ধারিত' :
                             app.status === 'selected' ? 'নির্বাচিত' :
                             app.status === 'rejected' ? 'বাতিল' : 'আবেদন জমা'}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedReceiptApp(app)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" />
                            <span>রসিদ</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERVIEWS */}
      {activeTab === 'interviews' && (
        <div className="space-y-4">
          {myInterviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              বর্তমানে কোনো ইন্টারভিউ শিডিউল নেই। শর্টলিস্ট হলে কারখানা কর্তৃপক্ষ ইন্টারভিউ কল প্রদান করবে।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myInterviews.map(app => (
                <div key={app.id} className="bg-white rounded-xl border-2 border-amber-300 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ইন্টারভিউ ইনভাইটেশন
                    </span>
                    <span className="text-xs font-mono text-slate-400">{app.id}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-600 font-semibold">{app.companyName}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>তারিখ: <strong>{app.interviewSchedule?.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>সময়: <strong>{app.interviewSchedule?.time}</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>স্থান: <strong>{app.interviewSchedule?.location}</strong></span>
                    </div>
                  </div>

                  {app.interviewSchedule?.instructions && (
                    <div className="text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                      <strong>নির্দেশনা:</strong> {app.interviewSchedule.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED CIRCULARS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {mySavedJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              কোনো সার্কুলার সেভ করা নেই।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySavedJobs.map(job => (
                <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{job.companyName}</span>
                    <button onClick={() => toggleSaveJob(job.id)} className="text-emerald-600 text-xs">
                      বাদ দিন
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{job.title}</h4>
                  <div className="text-xs text-slate-500">
                    <span>{job.district}</span> · <span>৳{job.salaryMin} - ৳{job.salaryMax}</span>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    সার্কুলার দেখুন
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FOLLOWED COMPANIES */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myFollowedCompanies.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={c.logo} alt={c.name} className="w-10 h-10 rounded-lg object-cover border" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{c.name}</h4>
                  <span className="text-[11px] text-slate-500">{c.district}</span>
                </div>
              </div>
              <button
                onClick={() => toggleFollowCompany(c.id)}
                className="px-3 py-1 text-xs border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
              >
                আনফলো
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-extrabold text-sm text-slate-900">অফিসিয়াল ডিজিটাল আবেদন রসিদ</span>
              <button onClick={() => setSelectedReceiptApp(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
              <div className="text-center font-sans font-black text-base text-slate-900">
                গার্মেন্টসনিয়োগ ডটকম ডটবিডি
              </div>
              <div className="text-center text-[11px] text-slate-500 pb-2 border-b">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের নিয়ম অনুযায়ী পরিচালিত
              </div>

              <div className="flex justify-between text-slate-700">
                <span>আবেদন আইডি:</span>
                <span className="font-bold text-slate-900">{selectedReceiptApp.id}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>প্রার্থীর নাম:</span>
                <span className="font-sans font-bold text-slate-900">{selectedReceiptApp.applicantName}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>পদের নাম:</span>
                <span className="font-sans text-slate-900">{selectedReceiptApp.jobTitle}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>কারখানা:</span>
                <span className="font-sans text-slate-900">{selectedReceiptApp.companyName}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>তারিখ:</span>
                <span>{selectedReceiptApp.appliedDate}</span>
              </div>
              <div className="flex justify-between text-slate-700 border-t pt-2 font-sans font-bold">
                <span>পরিশোধিত অর্থ:</span>
                <span className="text-emerald-700 text-sm">৳{selectedReceiptApp.totalPaid}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReceiptApp(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
