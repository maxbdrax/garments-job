import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { JobCircular } from '../types';
import { JobCard } from './JobCard';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { Search, Filter, RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface JobSearchSectionProps {
  initialCategory?: string;
  initialDistrict?: string;
  initialQuery?: string;
  onSelectJob: (job: JobCircular) => void;
  onApplyJob: (job: JobCircular) => void;
}

export const JobSearchSection: React.FC<JobSearchSectionProps> = ({
  initialCategory = '',
  initialDistrict = '',
  initialQuery = '',
  onSelectJob,
  onApplyJob
}) => {
  const { jobs, categories, lang, t } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [filterJobType, setFilterJobType] = useState('all');
  const [filterFee, setFilterFee] = useState<'all' | 'free' | 'paid'>('all');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'salary_high' | 'salary_low'>('latest');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Query search
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q) || (job.titleBn && job.titleBn.toLowerCase().includes(q));
        const matchCompany = job.companyName.toLowerCase().includes(q);
        const matchDept = job.department.toLowerCase().includes(q);
        const matchSkills = job.requiredSkills.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchDept && !matchSkills) return false;
      }

      // Category
      if (selectedCategory && job.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // District
      if (selectedDistrict && job.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
        return false;
      }

      // Job Type
      if (filterJobType !== 'all' && job.jobType !== filterJobType) {
        return false;
      }

      // Fee
      if (filterFee === 'free' && job.applicationFee > 0) return false;
      if (filterFee === 'paid' && job.applicationFee === 0) return false;

      // Urgent
      if (onlyUrgent && !job.isUrgent) return false;

      // Featured
      if (onlyFeatured && !job.isFeatured) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
      }
      if (sortBy === 'salary_high') {
        return b.salaryMax - a.salaryMax;
      }
      if (sortBy === 'salary_low') {
        return a.salaryMin - b.salaryMin;
      }
      // default latest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [jobs, query, selectedCategory, selectedDistrict, filterJobType, filterFee, onlyUrgent, onlyFeatured, sortBy]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedDistrict('');
    setFilterJobType('all');
    setFilterFee('all');
    setOnlyUrgent(false);
    setOnlyFeatured(false);
    setSortBy('latest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Search Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="sm:col-span-5 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="পদের নাম বা দক্ষতা দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">সকল ক্যাটাগরি ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.nameEn}>
                  {lang === 'bn' ? c.nameBn : c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">সকল জেলা</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filters & Sort (Interactive button controls) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-500">ফিল্টার:</span>

            {/* Free vs Paid filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-md">
              <button
                onClick={() => setFilterFee('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${filterFee === 'all' ? 'bg-white shadow-2xs font-bold text-slate-900' : 'text-slate-600'}`}
              >
                সব
              </button>
              <button
                onClick={() => setFilterFee('free')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${filterFee === 'free' ? 'bg-white shadow-2xs font-bold text-emerald-800' : 'text-slate-600'}`}
              >
                বিনা ফি (Free)
              </button>
              <button
                onClick={() => setFilterFee('paid')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${filterFee === 'paid' ? 'bg-white shadow-2xs font-bold text-slate-900' : 'text-slate-600'}`}
              >
                ফি সহ
              </button>
            </div>

            {/* Urgent toggle */}
            <button
              onClick={() => setOnlyUrgent(!onlyUrgent)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                onlyUrgent 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              জরুরি নিয়োগ
            </button>

            {/* Featured toggle */}
            <button
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors ${
                onlyFeatured 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              ফিচার্ড
            </button>

            {(query || selectedCategory || selectedDistrict || filterFee !== 'all' || onlyUrgent || onlyFeatured) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-[11px] ml-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>রিসেট ফিল্টার</span>
              </button>
            )}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">সাজান:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1 px-2 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="latest">সর্বশেষ সার্কুলার</option>
              <option value="deadline">আবেদনের শেষ তারিখ আগে</option>
              <option value="salary_high">বেতন: বেশি থেকে কম</option>
              <option value="salary_low">বেতন: কম থেকে বেশি</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
        <span>
          মোট <strong className="text-slate-900">{filteredJobs.length}</strong> টি চাকরি পাওয়া গেছে
        </span>
        <span>
          সরাসরি ফ্যাক্টরি এইচআর এ আবেদন পৌছে দেওয়া হবে
        </span>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            আপনার নির্বাচিত ফিল্টারে কোনো সার্কুলার পাওয়া যায়নি।
          </p>
          <p className="text-xs text-slate-500">
            ফিল্টার পরিবর্তন করুন বা রিসেট ফিল্টার বাটনে চাপুন।
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
          >
            সকল সার্কুলার দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              onApply={onApplyJob}
            />
          ))}
        </div>
      )}

    </div>
  );
};
