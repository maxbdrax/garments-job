import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scissors, 
  Users, 
  CheckCircle, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Layers, 
  Box, 
  PackageCheck, 
  TrendingUp, 
  Compass, 
  FileText, 
  UserCheck, 
  Archive, 
  Database, 
  Shield, 
  Truck, 
  Zap, 
  Wrench, 
  Settings, 
  DollarSign, 
  Monitor, 
  Keyboard, 
  Building, 
  Flag, 
  Eye, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';

interface CategoriesBrowserProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesBrowser: React.FC<CategoriesBrowserProps> = ({ onSelectCategory }) => {
  const { categories, lang } = useApp();
  const [selectedDept, setSelectedDept] = useState<string>('all');

  const departments = ['all', 'Production', 'Quality Assurance', 'Industrial Engineering', 'Merchandising', 'Human Resources', 'Supply Chain', 'Cutting', 'Finishing', 'Maintenance', 'Administration'];

  const filteredCategories = selectedDept === 'all' 
    ? categories 
    : categories.filter(c => c.department.toLowerCase() === selectedDept.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          গার্মেন্টস ও টেক্সটাইল ক্যাটাগরি সমূহ
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          সুইং অপারেটর থেকে মার্চেন্ডাইজার ও ফ্যাক্টরি ম্যানেজার পর্যন্ত ৩৩+ বিশেষায়িত বিভাগ
        </p>
      </div>

      {/* Department Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedDept === dept 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {dept === 'all' ? 'সকল বিভাগ' : dept}
          </button>
        ))}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.nameEn)}
            className="text-left bg-white p-4 rounded-xl border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-slate-500">{c.department}</span>
                <span className="text-emerald-700 font-bold">{c.activeJobsCount} সার্কুলার</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                {lang === 'bn' ? c.nameBn : c.nameEn}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {c.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>সার্কুলার দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
