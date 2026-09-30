import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Phone, Mail, MapPin, Heart, AlertTriangle, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, setLang, setActiveView } = useApp();

  return (
    <footer className="no-print bg-slate-950 text-slate-300 border-t border-slate-800 text-xs mt-20">
      
      {/* Worker Safety Banner for Bangladesh */}
      <div className="bg-emerald-950 border-b border-emerald-900/60 py-4 px-4 text-emerald-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white text-xs block">
                শ্রমিক ভাই ও বোনদের জন্য সতর্কতা:
              </span>
              <span className="text-[11px] text-emerald-300">
                গার্মেন্টসনিয়োগ পোর্টালে ভেরিফাইড কারখানার বাইরে কোনো ব্যক্তিগত বিকাশ নম্বরে বা দালালের হাতে কোনো টাকা প্রদান করবেন না।
              </span>
            </div>
          </div>
          <div className="shrink-0 font-mono text-xs bg-emerald-900/80 px-3 py-1.5 rounded-lg border border-emerald-700/60 text-white font-bold">
            জরুরি হেল্পলাইন: 09612-445566
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                GN
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Garments<span className="text-emerald-500">Niyog</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              বাংলাদেশের তৈরি পোশাক (RMG), টেক্সটাইল, ডেনিম এবং নিটওয়্যার শিল্পের সকল গ্রেডের কর্মী ও কর্মকর্তাদের জন্য আধুনিক এবং স্বচ্ছ ডিজিটাল প্ল্যাটফর্ম।
            </p>
            <div className="pt-2 flex items-center gap-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>বাংলাদেশ শ্রম আইন ২০০৬ অনুসরণে পরিচালিত</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setActiveView('jobs')} className="hover:text-white transition-colors">
                  চাকরি ও সার্কুলার খুঁজুন
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('categories')} className="hover:text-white transition-colors">
                  ৩৩+ গার্মেন্টস ক্যাটাগরি
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('companies')} className="hover:text-white transition-colors">
                  শীর্ষস্থানীয় ফ্যাক্টরি সমূহ
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('cv_builder')} className="hover:text-white transition-colors">
                  ডিজিটাল সিভি মেকার (Free)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('api_explorer')} className="hover:text-white transition-colors">
                  মোবাইল অ্যাপ API এক্সপ্লোরার
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">জনপ্রিয় ক্যাটাগরি</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>সুইং মেশিন অপারেটর (প্লেন/ওভারলক)</li>
              <li>কোয়ালিটি ইন্সপেক্টর ও কন্ট্রোলার (QC)</li>
              <li>মার্চেন্ডাইজার ও স্যাম্পল অফিসার</li>
              <li>ইন্ডাস্ট্রিয়াল ইঞ্জিনিয়ারিং (IE) অফিসার</li>
              <li>কাটিং ও ফিনিশিং সুপারভাইজার</li>
              <li>সুইং মেশিন মেকানিক ও টেকনিশিয়ান</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">যোগাযোগ ও সহায়তা</h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>লেভেল ৫, বিজিএমইএ কমপ্লেক্স, উত্তরা, ঢাকা</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-mono">+880 9612-445566</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@garmentsniyog.com.bd</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} GarmentsNiyog BD Ltd. সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">ব্যবহারের শর্তাবলী</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">গোপনীয়তা নীতি</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">রিফান্ড ও পেমেন্ট রুলস</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">বিজিএমইএ নির্দেশিকা</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
