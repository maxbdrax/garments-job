import React, { useState } from 'react';
import { JobCircular } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Share2, 
  AlertTriangle, 
  Check, 
  Coffee, 
  Bus, 
  Home, 
  HeartPulse, 
  Gift, 
  ShieldCheck,
  Send,
  Phone,
  Mail,
  Copy
} from 'lucide-react';

interface JobDetailsModalProps {
  job: JobCircular | null;
  onClose: () => void;
  onApply: (job: JobCircular) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose, onApply }) => {
  const { lang, t, settings, toggleSaveJob, applicantProfile } = useApp();
  const [copied, setCopied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('fake');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!job) return null;

  const isSaved = applicantProfile.savedJobIds.includes(job.id);

  // Fee calculation
  const fee = job.applicationFee;
  const platformFee = Math.round(fee * (settings.platformCommissionPercent / 100));
  const gatewayFee = fee > 0 ? Math.round(fee * (settings.gatewayFeePercent / 100) * 10) / 10 : 0;
  const totalPayable = fee > 0 ? fee + platformFee + gatewayFee : 0;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(`Garments Job Circular: ${job.title} at ${job.companyName}`);
    const url = encodeURIComponent(window.location.href);
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-16 h-16 rounded-xl object-cover border-2 border-slate-700 shadow-md shrink-0 bg-white"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-300">{job.companyName}</span>
                  {job.isCompanyVerified && (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('verifiedCompany')}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {lang === 'bn' && job.titleBn ? job.titleBn : job.title}
                </h2>
                <div className="mt-2 flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.factoryLocation}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.jobType}
                  </span>
                  <span>·</span>
                  <span>পদসংখ্যা: {job.vacancies} জন</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* Transparent Fee & Application Notice Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                স্বচ্ছ আবেদন ফি হিসাব (Fee Transparency)
              </span>
              <span className="text-xs text-slate-500">
                আবেদনের শেষ তারিখ: <strong className="text-slate-900">{job.applicationDeadline}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">{t('applicationFee')}</div>
                <div className="text-base font-bold text-slate-800">৳{job.applicationFee}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">{t('platformFee')}</div>
                <div className="text-base font-bold text-slate-800">৳{platformFee}</div>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500">{t('gatewayFee')}</div>
                <div className="text-base font-bold text-slate-800">৳{gatewayFee}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-[11px] text-emerald-800 font-semibold">{t('totalPayable')}</div>
                <div className="text-base font-extrabold text-emerald-700">৳{totalPayable}</div>
              </div>
            </div>
            <p className="mt-2.5 text-[11px] text-slate-500">
              * কোনো অতিরিক্ত বা গোপন চার্জ নেই। পেমেন্ট সম্পন্ন হলে তাৎক্ষণিক ডিজিটাল রসিদ ও ভেরিফিকেশন কোড পাবেন।
            </p>
          </div>

          {/* Key Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">মাসিক বেতন:</span>
              <span className="text-sm font-bold text-slate-900">
                ৳{job.salaryMin.toLocaleString()} - ৳{job.salaryMax.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">অভিজ্ঞতা:</span>
              <span className="text-sm font-bold text-slate-900">{job.experienceYears}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">শিক্ষাগত যোগ্যতা:</span>
              <span className="text-sm font-bold text-slate-900">{job.education}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">বয়স সীমা:</span>
              <span className="text-sm font-bold text-slate-900">{job.ageLimit}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">ডিউটি ও ছুটি:</span>
              <span className="text-sm font-bold text-slate-900">{job.workingHours} ({job.weeklyHoliday} ছুটি)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">ওভারটাইম সুবিধা:</span>
              <span className="text-sm font-bold text-slate-900">{job.overtimeDetails}</span>
            </div>
          </div>

          {/* Factory Benefits & Working Facilities */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
              {t('benefits')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${job.benefits.foodFacility ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 text-slate-400 opacity-60'}`}>
                <Coffee className="w-4 h-4 text-emerald-600" />
                <span>{t('foodFacility')}</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${job.benefits.transportFacility ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 text-slate-400 opacity-60'}`}>
                <Bus className="w-4 h-4 text-emerald-600" />
                <span>{t('transport')}</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${job.benefits.accommodation ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 text-slate-400 opacity-60'}`}>
                <Home className="w-4 h-4 text-emerald-600" />
                <span>{t('accommodation')}</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${job.benefits.medicalFacility ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 text-slate-400 opacity-60'}`}>
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                <span>{t('medical')}</span>
              </div>
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${job.benefits.festivalBonus ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 text-slate-400 opacity-60'}`}>
                <Gift className="w-4 h-4 text-emerald-600" />
                <span>{t('bonus')}</span>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              কাজের বিবরণ (Job Description)
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {job.responsibilities.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                দায়িত্বসমূহ (Key Responsibilities)
              </h4>
              <ul className="space-y-1.5 text-sm text-slate-700 list-disc list-inside">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="leading-snug">{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {job.requiredSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                প্রয়োজনীয় দক্ষতা (Required Skills)
              </h4>
              <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                {job.requiredSkills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Factory Contact Info */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">সরাসরি যোগাযোগের ঠিকানা ও হেল্পলাইন:</span>
            <div className="flex flex-wrap items-center gap-4 text-slate-700">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {job.contactPhone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                {job.contactEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.jobLocation}
              </span>
            </div>
          </div>

          {/* Social Share & Report */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">{t('shareJob')}:</span>
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors font-medium"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition-colors font-medium"
              >
                Facebook
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t('reportJob')}</span>
            </button>
          </div>
        </div>

        {/* Modal Bottom Sticky Action Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="text-xs text-slate-500">প্রদেয় আবেদন ফি:</div>
            <div className="text-lg font-extrabold text-slate-900">
              {totalPayable > 0 ? `৳${totalPayable}` : 'ফ্রি (৳০)'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={() => {
                onClose();
                onApply(job);
              }}
              className="px-6 py-2.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>{t('applyNow')}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Modal Popup */}
        {showReportModal && (
          <div className="absolute inset-0 bg-slate-900/80 z-20 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">রিপোর্ট করুন (ভুয়া সার্কুলার প্রতিরোধ)</h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reportSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-lg text-sm text-center">
                  আপনার অভিযোগটি গ্রহণ করা হয়েছে। সুপার অ্যাডমিন টিম খুব শীঘ্রই তদন্ত করবে।
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-600">
                    কোনো কারণে এই সার্কুলারটি সন্দেহজনক মনে হলে কারণ সিলেক্ট করুন:
                  </p>
                  <div className="space-y-2 text-xs text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="report" value="fake" checked={reportReason === 'fake'} onChange={() => setReportReason('fake')} />
                      <span>ভুয়া কারখানা বা অস্তিত্বহীন পদ</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="report" value="money" checked={reportReason === 'money'} onChange={() => setReportReason('money')} />
                      <span>ব্যক্তিগত বিকাশ/নগদে অতিরিক্ত ঘুষ বা টাকা দাবি</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="report" value="wrong" checked={reportReason === 'wrong'} onChange={() => setReportReason('wrong')} />
                      <span>ভুল বা বিভ্রান্তিকর তথ্য</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => setReportSubmitted(true)}
                      className="px-4 py-1.5 text-xs bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                    >
                      রিপোর্ট জমা দিন
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
