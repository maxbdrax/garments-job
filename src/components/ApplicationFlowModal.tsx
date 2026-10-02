import React, { useState } from 'react';
import { JobCircular, PaymentMethod, PaymentTransaction, Application } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  CheckCircle, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  Printer, 
  QrCode, 
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Copy,
  Check,
  Phone,
  FileText,
  User,
  Wrench,
  HelpCircle
} from 'lucide-react';

interface ApplicationFlowModalProps {
  job: JobCircular | null;
  onClose: () => void;
  onSuccess: (app: Application, tx?: PaymentTransaction) => void;
}

export const ApplicationFlowModal: React.FC<ApplicationFlowModalProps> = ({ job, onClose, onSuccess }) => {
  const { lang, t, applicantProfile, submitApplication, settings, setShowCvModal } = useApp();

  const [step, setStep] = useState<'review' | 'payment' | 'confirmed'>('review');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bkash');
  const [senderPhone, setSenderPhone] = useState(applicantProfile.phone);
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [coverLetter, setCoverLetter] = useState('আমি নিষ্ঠার সাথে কাজ করতে ইচ্ছুক এবং টেক্সটাইল ও গার্মেন্টস খাতে আমার অভিজ্ঞতা কাজে লাগাতে চাই।');
  const [expectedSalary, setExpectedSalary] = useState(job?.salaryMin || 15000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Result
  const [completedApp, setCompletedApp] = useState<Application | null>(null);
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);

  if (!job) return null;

  const fee = job.applicationFee;
  const platformFee = Math.round(fee * (settings.platformCommissionPercent / 100));
  const gatewayFee = fee > 0 ? Math.round(fee * (settings.gatewayFeePercent / 100) * 10) / 10 : 0;
  const totalPayable = fee > 0 ? fee + platformFee + gatewayFee : 0;

  // Active admin-configured payment numbers
  const currentPaymentInfo = {
    bkash: {
      name: 'bKash (বিকাশ)',
      number: settings.bKashMerchantNumber || '01712-345678',
      type: settings.bKashAccountType || 'Personal (সেন্ড মানি)',
      color: 'bg-[#d12053] text-white',
      accentColor: 'text-[#d12053]',
      borderColor: 'border-[#d12053]',
      bgLight: 'bg-[#d12053]/5 border-[#d12053]/20'
    },
    nagad: {
      name: 'Nagad (নগদ)',
      number: settings.nagadMerchantNumber || '01812-345678',
      type: settings.nagadAccountType || 'Personal (সেন্ড মানি)',
      color: 'bg-[#f7941d] text-white',
      accentColor: 'text-[#f7941d]',
      borderColor: 'border-[#f7941d]',
      bgLight: 'bg-[#f7941d]/5 border-[#f7941d]/20'
    },
    rocket: {
      name: 'Rocket (রকেট)',
      number: settings.rocketMerchantNumber || '01912-345678',
      type: settings.rocketAccountType || 'Personal (সেন্ড মানি)',
      color: 'bg-[#8c3494] text-white',
      accentColor: 'text-[#8c3494]',
      borderColor: 'border-[#8c3494]',
      bgLight: 'bg-[#8c3494]/5 border-[#8c3494]/20'
    }
  }[paymentMethod as 'bkash' | 'nagad' | 'rocket'] || {
    name: 'bKash (বিকাশ)',
    number: settings.bKashMerchantNumber || '01712-345678',
    type: 'Personal (সেন্ড মানি)',
    color: 'bg-[#d12053] text-white',
    accentColor: 'text-[#d12053]',
    borderColor: 'border-[#d12053]',
    bgLight: 'bg-[#d12053]/5 border-[#d12053]/20'
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentPaymentInfo.number);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleProceedToPayment = () => {
    if (fee === 0) {
      handleFinalSubmission('free');
    } else {
      setStep('payment');
    }
  };

  const handleFinalSubmission = async (method: PaymentMethod = paymentMethod) => {
    if (fee > 0 && method !== 'free') {
      if (!senderPhone.trim()) {
        setErrorMessage('অনুগ্রহ করে আপনি যে নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন।');
        return;
      }
      if (!trxId.trim()) {
        setErrorMessage('অনুগ্রহ করে SMS-এ প্রাপ্ত Transaction ID (TrxID) টি লিখুন।');
        return;
      }
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const result = await submitApplication(
        job.id, 
        method, 
        senderPhone, 
        trxId.trim(),
        {
          coverLetter,
          expectedSalary
        }
      );

      setCompletedApp(result.application);
      setCompletedTx(result.transaction || null);
      setStep('confirmed');
      onSuccess(result.application, result.transaction);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting application');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Step Indicator Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
              {step === 'confirmed' ? 'আবেদন ও রসিদ প্রস্তুত' : step === 'payment' ? 'ফি প্রদান ও ট্রানজেকশন আইডি' : 'আবেদন ও পূর্ণাঙ্গ সিভি যাচাই'}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-sm">
              {job.title} · {job.companyName}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: REVIEW FULL APPLICANT CV & INFO */}
          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>আপনার ডিজিটাল সিভি ও প্রোফাইল সংযুক্ত হচ্ছে</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCvModal(true)}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    সিভি এডিট
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={applicantProfile.photo}
                    alt={applicantProfile.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-2xs"
                  />
                  <div className="space-y-0.5 text-slate-700">
                    <div className="font-bold text-sm text-slate-900">{applicantProfile.name}</div>
                    <div>মোবাইল: <span className="font-mono">{applicantProfile.phone}</span> · জেলা: {applicantProfile.district}</div>
                    <div>জাতীয় পরিচয়পত্র (NID): <span className="font-mono">{applicantProfile.nidNumber}</span></div>
                    <div>শিক্ষাগত যোগ্যতা: {applicantProfile.highestDegree}</div>
                  </div>
                </div>

                {/* Machine operating expertise preview */}
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="font-bold text-slate-800 block mb-1">মেশিন চালনা পারদর্শিতা (Machine Expertise):</span>
                  <div className="flex flex-wrap gap-1">
                    {applicantProfile.machineExpertise.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px]">
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience preview */}
                <div className="text-slate-600">
                  <span className="font-bold text-slate-800">পূর্বের অভিজ্ঞতা: </span>
                  {applicantProfile.experienceList[0]?.company} ({applicantProfile.experienceList[0]?.position})
                </div>
              </div>

              {/* Form custom fields */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    প্রত্যাশিত মাসিক বেতন (৳):
                  </label>
                  <input
                    type="number"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    কভার লেটার / কারখানার জন্য বার্তা:
                  </label>
                  <textarea
                    rows={2}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Transparent Fee Summary Box */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                <div className="font-bold text-slate-800 text-sm">আবেদন ফি হিসাব:</div>
                <div className="flex justify-between text-slate-600">
                  <span>সার্কুলার ফি:</span>
                  <span className="font-semibold text-slate-900">৳{job.applicationFee}</span>
                </div>
                {fee > 0 && (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>প্ল্যাটফর্ম কমিশন ({settings.platformCommissionPercent}%):</span>
                      <span className="font-semibold text-slate-900">৳{platformFee}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>পেমেন্ট গেটওয়ে চার্জ:</span>
                      <span className="font-semibold text-slate-900">৳{gatewayFee}</span>
                    </div>
                  </>
                )}
                <div className="pt-2 border-t border-emerald-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-emerald-700 text-base">{totalPayable > 0 ? `৳${totalPayable}` : 'ফ্রি (৳০)'}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>{fee === 0 ? 'আবেদন নিশ্চিত করুন' : 'পেমেন্ট ধাপে যান (TrxID লিখুন)'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BANGLADESH PAYMENT GATEWAY WITH ADMIN-CONFIGURED NUMBERS */}
          {step === 'payment' && (
            <div className="space-y-4">
              
              {/* Payment Gateway Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  যে মাধ্যমে টাকা পাঠিয়েছেন নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  {(['bkash', 'nagad', 'rocket'] as PaymentMethod[]).map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setPaymentMethod(gw)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === gw 
                          ? 'border-2 border-slate-900 bg-slate-50 font-bold shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-slate-900 uppercase">{gw}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {gw === 'bkash' ? 'বিকাশ' : gw === 'nagad' ? 'নগদ' : 'রকেট'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ADMIN-CONFIGURED NUMBER DISPLAY CARD */}
              <div className={`p-4 rounded-xl border ${currentPaymentInfo.bgLight} space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{currentPaymentInfo.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                      {currentPaymentInfo.type}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    প্রদেয়: <strong className="text-emerald-700 text-sm">৳{totalPayable}</strong>
                  </span>
                </div>

                {/* Big Number Copy Box */}
                <div className="bg-white rounded-lg p-3 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                      টাকা পাঠানোর অফিসিয়াল নম্বর:
                    </span>
                    <span className="text-base sm:text-lg font-black font-mono text-slate-900 tracking-wider">
                      {currentPaymentInfo.number}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                  </button>
                </div>

                {/* Instructions */}
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {settings.paymentInstructions || 'প্রথমে আপনার বিকাশ/নগদ/রকেট অ্যাপ থেকে উপরের নম্বরে নির্ধারিত ফি সেন্ড মানি করুন। এরপর ফিরতি SMS-এ প্রাপ্ত Transaction ID (TrxID) এবং যে নম্বর থেকে পাঠিয়েছেন তা লিখে আবেদন নিশ্চিত করুন।'}
                </p>
              </div>

              {/* SENDER PHONE & TrxID INPUTS */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    যে মোবাইল নম্বর থেকে টাকা পাঠিয়েছেন (Sender Mobile):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 017XXXXXXXX"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    টাকা পাঠানোর পর প্রাপ্ত Transaction ID (TrxID):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: 9J8A7K2L বা BK998124"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white font-mono uppercase font-bold tracking-widest"
                  />
                </div>

                {/* SMS TrxID helper notice */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-emerald-700 font-medium">* টাকা সফলভাবে পাঠানোর পর আসা ফিরতি SMS থেকে TrxID দেখে সঠিকভাবে লিখুন</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  পেছনে যান
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleFinalSubmission()}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>যাচাই ও ক্লাউড সেভ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>আবেদন নিশ্চিত করুন</span>
                      <CheckCircle className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION & RECEIPT */}
          {step === 'confirmed' && completedApp && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  আবেদন সফলভাবে গৃহীত হয়েছে!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  আপনার সম্পূর্ণ ডিজিটাল সিভি ও TrxID সংশ্লিষ্ট কারখানার মানবসম্পদ (HR) ড্যাশবোর্ডে সংরক্ষিত হয়েছে।
                </p>
              </div>

              {/* Digital Receipt */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="font-extrabold text-slate-900">ডিজিটাল আবেদন ও ফি রসিদ</div>
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    ক্লাউড ভেরিফাইড
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">আবেদন নম্বর:</span>
                    <strong className="text-slate-900">{completedApp.id}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">ট্রানজেকশন আইডি (TrxID):</span>
                    <strong className="text-emerald-700">{completedApp.paymentTrxId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">প্রেরক মোবাইল:</span>
                    <span className="text-slate-900">{completedApp.paymentSenderPhone || completedApp.applicantPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] font-sans">পরিশোধিত ফি:</span>
                    <strong className="text-emerald-700 text-sm font-sans">৳{completedApp.totalPaid}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <div className="flex items-center gap-1">
                    <QrCode className="w-4 h-4 text-slate-700" />
                    <span>ডিজিটাল কিউআর সংরক্ষিত</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>রসিদ প্রিন্ট করুন</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  ঠিক আছে, বন্ধ করুন
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
