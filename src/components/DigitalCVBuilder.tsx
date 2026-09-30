import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  Edit3, 
  Check, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

interface DigitalCVBuilderProps {
  onClose: () => void;
}

export const DigitalCVBuilder: React.FC<DigitalCVBuilderProps> = ({ onClose }) => {
  const { lang, t, applicantProfile, updateApplicantProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(applicantProfile);
  const [newSkill, setNewSkill] = useState('');
  const [newMachine, setNewMachine] = useState('');

  const handleSave = () => {
    updateApplicantProfile(profile);
    setIsEditing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };

  const handleAddMachine = () => {
    if (newMachine.trim() && !profile.machineExpertise.includes(newMachine.trim())) {
      setProfile({ ...profile, machineExpertise: [...profile.machineExpertise, newMachine.trim()] });
      setNewMachine('');
    }
  };

  const handleRemoveMachine = (m: string) => {
    setProfile({ ...profile, machineExpertise: profile.machineExpertise.filter(x => x !== m) });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-150">
        
        {/* Header Controls (No-print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h3 className="font-extrabold text-base text-white">
              গার্মেন্টস স্ট্যান্ডার্ড ডিজিটাল সিভি (Digital Resume)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'প্রিভিউ দেখুন' : 'সিভি এডিট করুন'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / PDF ডাউনলোড</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CV Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-slate-100 flex-1">
          {isEditing ? (
            /* Editing Form Mode */
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-5 text-xs text-slate-800">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">ব্যক্তিগত ও পেশাগত তথ্য সম্পাদন</span>
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>পরিবর্তন সংরক্ষণ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">পূর্ণ নাম:</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">বাংলায় নাম:</label>
                  <input
                    type="text"
                    value={profile.nameBn || ''}
                    onChange={(e) => setProfile({ ...profile, nameBn: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">জাতীয় পরিচয়পত্র (NID) নম্বর:</label>
                  <input
                    type="text"
                    value={profile.nidNumber}
                    onChange={(e) => setProfile({ ...profile, nidNumber: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">বর্তমান ঠিকানা ও জেলা:</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">প্রত্যাশিত মাসিক বেতন (৳):</label>
                  <input
                    type="number"
                    value={profile.expectedSalary}
                    onChange={(e) => setProfile({ ...profile, expectedSalary: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">পেশাগত লক্ষ্য (Career Objective):</label>
                <textarea
                  rows={3}
                  value={profile.careerObjective}
                  onChange={(e) => setProfile({ ...profile, careerObjective: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Machine Expertise Editor */}
              <div className="pt-2">
                <label className="block font-semibold mb-2">মেশিন চালনা পারদর্শিতা (Machine Expertise):</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="যেমন: Kansai Special, Juki Automated Button..."
                    value={newMachine}
                    onChange={(e) => setNewMachine(e.target.value)}
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    onClick={handleAddMachine}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold"
                  >
                    যোগ করুন
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.machineExpertise.map(m => (
                    <span key={m} className="px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 text-slate-700 flex items-center gap-1.5">
                      <span>{m}</span>
                      <button onClick={() => handleRemoveMachine(m)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Editor */}
              <div className="pt-2">
                <label className="block font-semibold mb-2">কাজের দক্ষতা (Garments Skills):</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="যেমন: Collar Attaching, Overlock 5-thread..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 p-2 border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold"
                  >
                    যোগ করুন
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-md border border-emerald-200 flex items-center gap-1.5">
                      <span>{s}</span>
                      <button onClick={() => handleRemoveSkill(s)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Printable Standard CV Sheet */
            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-slate-200 text-slate-900 space-y-6">
              
              {/* CV Top Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                    {profile.name}
                  </h1>
                  <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                    {profile.experienceList[0]?.position || 'Garments Professional'}
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{profile.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.email}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.address}, {profile.district}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-24 h-28 object-cover rounded-md border-2 border-slate-300 shadow-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-1">পাসপোর্ট সাইজ ছবি</span>
                </div>
              </div>

              {/* Career Objective */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  ক্যারিয়ার অবজেক্টিভ / লক্ষ্য (Career Objective)
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {profile.careerObjective}
                </p>
              </div>

              {/* Garments Work Experience */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  কাজের অভিজ্ঞতা (Work Experience)
                </h2>
                <div className="space-y-3">
                  {profile.experienceList.map((exp, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{exp.position}</span>
                        <span className="text-slate-500 font-normal">{exp.duration}</span>
                      </div>
                      <div className="text-slate-600 font-medium">{exp.company} · {exp.department}</div>
                      <p className="text-slate-600 mt-1 leading-snug">{exp.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Machine Expertise (Crucial for Garments Hiring) */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  মেশিন চালনা পারদর্শিতা (Machine Expertise)
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {profile.machineExpertise.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  দক্ষতাসমূহ (Key Skills)
                </h2>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-700">
                  {profile.skills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  শিক্ষাগত যোগ্যতা (Education)
                </h2>
                <div className="space-y-2 text-xs">
                  {profile.educationList.map((edu, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{edu.degree}</span>
                        <span className="text-slate-600 block">{edu.institute}</span>
                      </div>
                      <div className="text-right text-slate-600">
                        <span>{edu.passingYear}</span>
                        <span className="block font-medium text-slate-800">{edu.gpaOrGrade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Training & Safety Certificates */}
              <div>
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
                  প্রশিক্ষণ ও সার্টিফিকেট (Training & Safety)
                </h2>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {profile.trainingCertificates.map((cert, idx) => (
                    <li key={idx}>{cert}</li>
                  ))}
                </ul>
              </div>

              {/* Signature & Declaration */}
              <div className="pt-6 flex items-end justify-between text-xs text-slate-600 border-t border-slate-200">
                <div>
                  <p>তারিখ: {new Date().toLocaleDateString('en-GB')}</p>
                  <p>স্থান: {profile.district}</p>
                </div>
                <div className="text-center">
                  <div className="font-serif italic text-base text-slate-800 font-bold mb-1">
                    {profile.name}
                  </div>
                  <div className="border-t border-slate-400 pt-1 w-32 text-center text-[10px] text-slate-500">
                    আবেদনকারীর স্বাক্ষর
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
