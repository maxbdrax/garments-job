import React from 'react';
import { JobCircular } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Calendar, 
  Bookmark, 
  CheckCircle, 
  Flame, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface JobCardProps {
  job: JobCircular;
  onSelect: (job: JobCircular) => void;
  onApply: (job: JobCircular) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onApply }) => {
  const { lang, t, applicantProfile, toggleSaveJob } = useApp();

  const isSaved = applicantProfile.savedJobIds.includes(job.id);

  // Format currency
  const formatSalary = (min: number, max: number) => {
    if (min === 0 && max === 0) return t('negotiable');
    return `৳${min.toLocaleString()} - ৳${max.toLocaleString()}`;
  };

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-lg transition-all p-5 flex flex-col justify-between">
      {/* Top Meta Indicator */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            {/* Company Logo Thumbnail */}
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-12 h-12 rounded-lg object-cover border border-slate-100 shadow-2xs shrink-0"
              loading="lazy"
            />
            <div>
              {/* Company Name with Verified Badge */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <span>{job.companyName}</span>
                {job.isCompanyVerified && (
                  <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold text-[11px]" title="Verified Factory by Admin">
                    <CheckCircle className="w-3.5 h-3.5 fill-emerald-100" />
                    <span>ভেরিফাইড</span>
                  </span>
                )}
              </div>

              {/* Job Title */}
              <h3 
                onClick={() => onSelect(job)}
                className="mt-1 font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
              >
                {lang === 'bn' && job.titleBn ? job.titleBn : job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'text-emerald-600 bg-emerald-50' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save this job'}
            aria-label="Save Job"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600' : ''}`} />
          </button>
        </div>

        {/* Clean Unboxed Metadata with Typographic Separator */}
        <div className="mt-3 flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-slate-500">
          <span className="text-slate-700 font-medium">{job.category}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.district}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{job.experienceYears}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{job.vacancies} জন পদ</span>
        </div>

        {/* Garments Specific Perks (Overtime, Food, Transport) */}
        <div className="mt-3 text-xs text-slate-600 line-clamp-1">
          <span className="font-semibold text-slate-700">সুবিধা: </span>
          {[
            job.benefits.foodFacility && 'ক্যান্টিন খাবার',
            job.benefits.transportFacility && 'ফ্যাক্টরি বাস',
            job.benefits.accommodation && 'থাকার ব্যবস্থা',
            job.benefits.festivalBonus && '২টি বোনাস',
            job.overtimeDetails && 'ওভারটাইম'
          ].filter(Boolean).join(', ')}
        </div>
      </div>

      {/* Card Footer: Salary, Fee & Action */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div>
          {/* Salary */}
          <div className="text-base font-extrabold text-slate-900 tracking-tight">
            {formatSalary(job.salaryMin, job.salaryMax)}
            <span className="text-xs font-normal text-slate-500 ml-1">/মাসিক</span>
          </div>

          {/* Application Fee Transparency */}
          <div className="text-[11px] text-slate-500 mt-0.5">
            {job.applicationFee > 0 ? (
              <span className="text-amber-700 font-semibold">
                আবেদন ফি: ৳{job.applicationFee}
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold">
                বিনা ফিতে আবেদন (Free)
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(job)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {t('viewDetails')}
          </button>
          <button
            onClick={() => onApply(job)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-xs flex items-center gap-1 active:scale-95"
          >
            <span>{t('applyNow')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
