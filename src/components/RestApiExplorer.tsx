import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Code, Play, Check, Copy, ExternalLink, Database, Server } from 'lucide-react';

export const RestApiExplorer: React.FC = () => {
  const { jobs, categories, companies, applications, transactions, applicantProfile } = useApp();
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/jobs');
  const [responseJson, setResponseJson] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const endpoints = [
    {
      path: '/api/jobs',
      method: 'GET',
      description: 'Fetch all verified and active garments job circulars with filtering & pagination',
      handler: () => ({
        status: 'success',
        count: jobs.length,
        data: jobs
      })
    },
    {
      path: '/api/categories',
      method: 'GET',
      description: 'List 33+ standard Bangladesh RMG & Textile industry categories and vacancies count',
      handler: () => ({
        status: 'success',
        count: categories.length,
        data: categories
      })
    },
    {
      path: '/api/companies',
      method: 'GET',
      description: 'Retrieve verified garments manufacturers, factory details and BGMEA/BKMEA accreditation',
      handler: () => ({
        status: 'success',
        count: companies.length,
        data: companies
      })
    },
    {
      path: '/api/applications',
      method: 'GET',
      description: 'Get applicant submissions, status tracking and interview notifications',
      handler: () => ({
        status: 'success',
        count: applications.length,
        data: applications
      })
    },
    {
      path: '/api/payments',
      method: 'GET',
      description: 'Fetch financial transactions, bKash/Nagad gateway references, and fee ledgers',
      handler: () => ({
        status: 'success',
        count: transactions.length,
        data: transactions
      })
    },
    {
      path: '/api/profile',
      method: 'GET',
      description: 'Get applicant digital CV, machine operating expertise, and certifications',
      handler: () => ({
        status: 'success',
        data: applicantProfile
      })
    }
  ];

  const handleRunRequest = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      const ep = endpoints.find(e => e.path === path);
      if (ep) {
        setResponseJson(JSON.stringify(ep.handler(), null, 2));
      }
      setLoading(false);
    }, 200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">REST API ডকুমেন্টেশন ও টেস্ট এক্সপ্লোরার</h1>
            <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
              v1.0 Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            ভবিষ্যতে মোবাইল অ্যান্ড্রয়েড অ্যাপ (Android Mobile App) অথবা ফ্যাক্টরি ইআরপি (ERP) ইন্টিগ্রেশনের জন্য প্রস্তুতকৃত রেস্টফুল এন্ডপয়েন্টসমূহ।
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Endpoints Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            উপলব্ধ এপিআই এন্ডপয়েন্ট (Available Endpoints)
          </div>
          {endpoints.map((ep) => {
            const isSelected = selectedEndpoint === ep.path;
            return (
              <button
                key={ep.path}
                onClick={() => {
                  setSelectedEndpoint(ep.path);
                  handleRunRequest(ep.path);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-mono font-bold">
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">{ep.path}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{ep.description}</p>
              </button>
            );
          })}
        </div>

        {/* Live Playground / JSON Viewer */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-xl">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="text-emerald-400 font-bold">GET</span>
              <span>https://api.garmentsniyog.com.bd{selectedEndpoint}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRunRequest(selectedEndpoint)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>টেস্ট করুন</span>
              </button>
              {responseJson && (
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-md flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি JSON'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 flex-1 min-h-[350px] max-h-[500px] overflow-auto font-mono text-xs text-emerald-400 bg-slate-950/80">
            {loading ? (
              <div className="text-slate-400 animate-pulse">অনুরোধ প্রসেসিং হচ্ছে...</div>
            ) : responseJson ? (
              <pre>{responseJson}</pre>
            ) : (
              <div className="text-slate-500 italic">
                বাম পাশের যেকোনো এন্ডপয়েন্ট ক্লিক করুন অথবা "টেস্ট করুন" বাটনে চাপুন।
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
