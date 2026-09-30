import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { Search, MapPin, Briefcase, Building, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onSearch: (filters: { query: string; category: string; district: string }) => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onSearch }) => {
  const { lang, t, categories, jobs } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, category, district });
  };

  const quickPicks = [
    { en: 'Sewing Operator', bn: 'সুইং অপারেটর' },
    { en: 'Quality Inspector (QI)', bn: 'কোয়ালিটি ইন্সপেক্টর' },
    { en: 'Senior Merchandiser', bn: 'মার্চেন্ডাইজার' },
    { en: 'IE Officer (Industrial Eng.)', bn: 'আইই অফিসার' },
    { en: 'Cutting Supervisor', bn: 'কাটিং সুপারভাইজার' },
    { en: 'Mechanic (Sewing Machine)', bn: 'মেকানিক' }
  ];

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden py-14 lg:py-20">
      {/* Subtle industrial garment pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top trust marker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3.5 py-1.5 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'bn' 
                ? 'বিজিএমইএ ও বিকেএমইএ ভেরিফাইড কারখানার সরাসরি নিয়োগ সার্কুলার' 
                : 'Direct circulars from BGMEA & BKMEA verified textile factories'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('heroHeading')}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            {t('heroSubheading')}
          </p>
        </div>

        {/* Multi-Faceted Search Box */}
        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-800">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Keyword Input */}
            <div className="md:col-span-4 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3 relative flex items-center">
              <Briefcase className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700"
              >
                <option value="">{t('allCategories')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.nameEn}>
                    {lang === 'bn' ? c.nameBn : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div className="md:col-span-3 relative flex items-center">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700"
              >
                <option value="">{t('allLocations')}</option>
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <span>{t('searchButton')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Category Buttons (interactive controls) */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">{t('popularSearches')}</span>
            {quickPicks.map((pick) => (
              <button
                key={pick.en}
                onClick={() => {
                  setCategory(pick.en);
                  onSearch({ query: '', category: pick.en, district });
                }}
                type="button"
                className="hover:text-emerald-700 hover:underline transition-colors font-medium text-slate-700"
              >
                {lang === 'bn' ? pick.bn : pick.en}
              </button>
            ))}
          </div>
        </div>

        {/* Industrial Highlights Metric Bar (Quiet, unboxed text with subtle dividers) */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">৫০০+</div>
            <div className="text-xs text-slate-400 mt-1">{t('statFactories')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{jobs.length}+</div>
            <div className="text-xs text-slate-400 mt-1">{t('statJobs')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">৪৫,০০০+</div>
            <div className="text-xs text-slate-400 mt-1">{t('statPlaced')}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">৳০ গোপন চার্জ</div>
            <div className="text-xs text-slate-400 mt-1">{t('statSecurePayment')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
