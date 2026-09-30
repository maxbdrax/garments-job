import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';
import { Building2, MapPin, Users, CheckCircle, ExternalLink, ArrowRight, Bookmark } from 'lucide-react';

interface CompaniesDirectoryProps {
  onSelectCompany: (companyId: string) => void;
}

export const CompaniesDirectory: React.FC<CompaniesDirectoryProps> = ({ onSelectCompany }) => {
  const { companies, jobs, applicantProfile, toggleFollowCompany, lang } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const types = ['all', 'Garments Manufacturer', 'Composite Factory', 'Textile Mill'];

  const filtered = filterType === 'all' 
    ? companies 
    : companies.filter(c => c.businessType === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          শীর্ষস্থানীয় গার্মেন্টস ও টেক্সটাইল কারখানাসমূহ
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          বাংলাদেশের আন্তর্জাতিক মানসম্পন্ন ও শ্রম আইন মান্যকারী শীর্ষ তৈরি পোশাক উৎপাদনকারী প্রতিষ্ঠান
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterType === t 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t === 'all' ? 'সকল কারখানা' : t}
          </button>
        ))}
      </div>

      {/* Factory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((company) => {
          const companyJobsCount = jobs.filter(j => j.companyId === company.id).length;
          const isFollowed = applicantProfile.followedCompanyIds.includes(company.id);

          return (
            <div
              key={company.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-100 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-sm text-slate-900">{company.name}</h3>
                        {company.isVerified && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">{company.businessType} ({company.garmentsType})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowCompany(company.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                      isFollowed 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isFollowed ? 'অনুসরণ করছেন' : '+ ফলো'}
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{company.factoryLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>কর্মী সংখ্যা: {company.employeeCount}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700">
                  {companyJobsCount} টি সক্রিয় সার্কুলার
                </span>
                <button
                  onClick={() => onSelectCompany(company.id)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>চাকরি দেখুন</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
