import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CreditCard,
  Heart,
  Check,
  Sparkles,
  Package,
  ShieldCheck,
  Gift,
  Building,
  AlertCircle,
  Copy,
  PhoneCall,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { BANK_ACCOUNTS, SELIHOM_INFO } from "../data";
import { DonationPledge, InKindItem } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { savePledge, getInKindNeeds } from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";
import { DotGridPattern, HelpingHandsSketch, FoodNourishSketch } from "./Sketches";

interface DonateSectionProps {
  initialInitiativeId?: string | null;
  initialCustomAmount?: number | null;
  onClearInitialValues: () => void;
}

export default function DonateSection({
  initialInitiativeId,
  initialCustomAmount,
  onClearInitialValues,
}: DonateSectionProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"bank" | "inkind">("bank");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // In-Kind states
  const [inKindNeeds, setInKindNeeds] = useState<InKindItem[]>([]);
  const [pledgedQuantities, setPledgedQuantities] = useState<Record<string, number>>({});
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [selectedBank, setSelectedBank] = useState<string>("cbe");

  // Load latest in-kind needs from storage
  useEffect(() => {
    getInKindNeeds().then(setInKindNeeds);
  }, [activeTab]);

  // Submission / Success State
  const [submittedPledge, setSubmittedPledge] = useState<DonationPledge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialInitiativeId || initialCustomAmount) {
      const el = document.getElementById("donate");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      onClearInitialValues();
    }
  }, [initialInitiativeId, initialCustomAmount]);

  const copyToClipboard = (accNum: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedAccount(accNum);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleInKindQuantityChange = (itemId: string, delta: number) => {
    setPledgedQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const handleInKindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanName  = sanitizeText(donorName, 120);
    const cleanPhone = sanitizePhone(donorPhone);
    const cleanEmail = sanitizeText(donorEmail, 120);

    if (!isNonEmpty(cleanName)) {
      setErrorMessage(language === "am" ? "ስምዎን ያስገቡ።" : "Please enter your name.");
      return;
    }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) {
      setErrorMessage(language === "am" ? "ስልክዎን ወይም ኢሜይልዎን ያስገቡ።" : "Please provide your phone or email to proceed.");
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setErrorMessage(language === "am" ? "የኢሜይል አድራሻው ትክክል አይደለም።" : "Please enter a valid email address.");
      return;
    }

    const itemPledges = Object.entries(pledgedQuantities)
      .filter(([_, qty]) => Number(qty) > 0)
      .map(([id, qty]) => {
        const item = inKindNeeds.find((it) => it.id === id);
        return {
          itemId:   id,
          name:     sanitizeText(t(item?.name) || "Item", 200),
          quantity: Math.max(1, Math.min(10000, Number(qty))),
        };
      });

    if (itemPledges.length === 0) {
      setErrorMessage(language === "am" ? "እባክዎን ቢያንስ የ1 እቃ ብዛት ይምረጡ።" : "Please pledge at least 1 item to proceed.");
      return;
    }

    setIsSubmitting(true);
    const pledge: DonationPledge = {
      id:         "PLG-" + Math.floor(Math.random() * 900000 + 100000),
      donorName:  cleanName,
      donorEmail: cleanEmail || cleanPhone,
      donorPhone: cleanPhone || cleanEmail,
      type: "inkind",
      pledgedItems: itemPledges,
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      status: "pledged",
    };
    await savePledge(pledge);
    setSubmittedPledge(pledge);
    setIsSubmitting(false);
  };

  return (
    <section id="donate" className="py-24 bg-[#FAF8F5]/40 relative overflow-hidden border-t border-brand-green-100/50">
      <div className="absolute top-20 -left-16 text-brand-green-600/[0.04] pointer-events-none z-0 select-none">
        <HelpingHandsSketch className="w-80 h-80 -rotate-12" />
      </div>
      <div className="absolute bottom-16 -right-16 text-brand-yellow-600/[0.04] pointer-events-none z-0 select-none">
        <FoodNourishSketch className="w-80 h-80 rotate-12" />
      </div>

      <DotGridPattern />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-green-950 mb-4 tracking-tight leading-tight"
          >
            {language === "am" ? (
              <>ለሰሊሆም ማህበር <span className="text-brand-green-700 italic font-medium">የድጋፍ መንገዶች</span></>
            ) : (
              <>Ways to <span className="text-brand-green-700 italic font-medium">Support Selihom</span></>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-sm md:text-base leading-relaxed"
          >
            {language === "am"
              ? "የሰሊሆም ማህበር በባንክ ሂሳብ ቁጥሮቻችን፣ በዓይነት እቃዎች አቅርቦት ወይም በቀጥታ በመደወል እርዳታዎን ማድረስ ይችላሉ።"
              : "Support Selihom Association directly through our official Ethiopian bank transfer accounts, in-kind grain/supply pledges, or direct phone contact."
            }
          </motion.p>
        </div>

        {/* Outer Layout Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-brand-green-100/80 overflow-hidden shadow-2xl max-w-5xl mx-auto"
        >
          {/* Custom Tabs */}
          <div className="grid grid-cols-2 border-b border-gray-100 bg-gray-50/50">
            <button
              onClick={() => {
                setActiveTab("bank");
                setSubmittedPledge(null);
              }}
              className={`py-4 sm:py-5 text-xs sm:text-sm md:text-base font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "bank"
                  ? "border-brand-green-600 text-brand-green-700 bg-white shadow-sm"
                  : "border-transparent text-gray-500 hover:text-brand-green-600"
              }`}
            >
              <Building className="w-5 h-5 shrink-0" />
              {language === "am" ? "የባንክ ሂሳብ ቁጥሮች" : "Bank Transfer Accounts"}
            </button>
            <button
              onClick={() => {
                setActiveTab("inkind");
                setSubmittedPledge(null);
              }}
              className={`py-4 sm:py-5 text-xs sm:text-sm md:text-base font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "inkind"
                  ? "border-brand-green-600 text-brand-green-700 bg-white shadow-sm"
                  : "border-transparent text-gray-500 hover:text-brand-green-600"
              }`}
            >
              <Package className="w-5 h-5 shrink-0" />
              {language === "am" ? "የዓይነት እቃዎች ድጋፍ" : "In-Kind Supplies Pledge"}
            </button>
          </div>

          <div className="p-6 md:p-10">
            {errorMessage && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2.5 mb-6">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!submittedPledge ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* TAB 1: BANK ACCOUNTS */}
                  {activeTab === "bank" && (
                    <div className="space-y-8">
                      <div className="text-center max-w-xl mx-auto mb-6">
                        <span className="text-brand-green-800 text-[11px] font-black uppercase tracking-widest block mb-2">
                          {language === "am" ? "ህጋዊ የባንክ ሂሳብ ቁጥሮች" : "Official NGO Bank Accounts"}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-brand-green-950">
                          {t(SELIHOM_INFO.fullName)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {language === "am" 
                            ? "በማንኛውም ባንክ በሞባይል ባንኪንግ ወይም በባንክ ቅርንጫፍ በቀጥታ ገቢ ማድረግ ይችላሉ።"
                            : "You can deposit directly using Mobile Banking or visiting any branch across Ethiopia."
                          }
                        </p>
                      </div>

                      {/* 3 Bank Account Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {BANK_ACCOUNTS.map((acc, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50/80 hover:bg-white rounded-2xl p-6 border-2 border-brand-green-100 hover:border-brand-yellow-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                          >
                            <div>
                              <div className="w-10 h-10 rounded-xl bg-brand-green-950 text-brand-yellow-400 font-serif font-black flex items-center justify-center text-lg mb-4 shadow-sm">
                                {idx + 1}
                              </div>
                              <h4 className="font-serif font-extrabold text-brand-green-950 text-base mb-1">
                                {t(acc.bank)}
                              </h4>
                              <p className="text-[11px] text-gray-500 mb-4 font-medium">
                                {acc.accountName}
                              </p>

                              <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-2 shadow-inner">
                                <span className="font-mono font-black text-sm text-brand-green-950 tracking-wider">
                                  {acc.accountNumber}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(acc.accountNumber)}
                                  className="p-1.5 hover:bg-brand-green-50 text-brand-green-700 rounded-lg transition-colors cursor-pointer"
                                  title="Copy account number"
                                >
                                  {copiedAccount === acc.accountNumber ? (
                                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => copyToClipboard(acc.accountNumber)}
                              className="mt-5 w-full py-2.5 bg-brand-green-950 hover:bg-brand-green-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              {copiedAccount === acc.accountNumber ? (
                                <>
                                  <Check className="w-4 h-4 text-brand-yellow-400" />
                                  {language === "am" ? "ተቀድቷል!" : "Copied!"}
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  {language === "am" ? "ቁጥሩን ቅዳ" : "Copy Account No"}
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Direct Phone Support Callout */}
                      <div className="bg-brand-green-950 text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-brand-yellow-400 text-[10px] font-black uppercase tracking-widest block">
                            {language === "am" ? "የስልክ መስመሮቻችን" : "Direct Phone Contact Lines"}
                          </span>
                          <h4 className="font-serif text-xl font-bold text-white">
                            {language === "am" ? "ለበለጠ መረጃና ድጋፍ በቀጥታ ይደውሉልን" : "Call Us Directly for Donations & Inquiries"}
                          </h4>
                          <p className="text-xs text-brand-green-100">
                            {language === "am"
                              ? "የማህበሩ ስራ አስኪያጅና አስተባባሪዎች በቀጥታ ጥሪዎን ለመቀበል ዝግጁ ናቸው።"
                              : "Our administrators and management team are ready to guide your support."
                            }
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
                          {SELIHOM_INFO.contact.phones.map((phone, pIdx) => (
                            <a
                              key={pIdx}
                              href={`tel:${phone.replace(/\s/g, '')}`}
                              className="px-4 py-2 bg-white/10 hover:bg-brand-yellow-500 hover:text-brand-green-950 text-white font-mono font-extrabold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>{phone}</span>
                            </a>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: IN-KIND SUPPLIES PLEDGE */}
                  {activeTab === "inkind" && (
                    <form onSubmit={handleInKindSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT: Supplies selection */}
                        <div className="lg:col-span-7 space-y-4">
                          <label className="block text-xs font-extrabold text-brand-green-950 uppercase tracking-wider mb-2">
                            1. {language === "am" ? "የሚደግፉትን እቃ ይምረጡ" : "Select Supplies to Pledge"}
                          </label>

                          <div className="space-y-3">
                            {[...inKindNeeds]
                              .sort((a, b) => (a.urgency === "High" ? -1 : b.urgency === "High" ? 1 : 0))
                              .map((item) => {
                              const qty = pledgedQuantities[item.id] || 0;
                              return (
                                <div
                                  key={item.id}
                                  className={`bg-white rounded-2xl p-4 border transition-all ${
                                    qty > 0 ? "border-brand-green-600 bg-brand-green-50/20" : "border-gray-100"
                                  } flex items-center justify-between gap-4`}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-extrabold text-brand-green-950">{t(item.name)}</span>
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${
                                          item.urgency === "High" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                                        }`}
                                      >
                                        {item.urgency} Priority
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-normal mb-1">{t(item.description)}</p>
                                    <span className="text-[10px] text-brand-green-700 font-bold bg-brand-green-50 px-2 py-0.5 rounded-full inline-block">
                                      Goal: {t(item.neededQuantity)}
                                    </span>
                                  </div>

                                  <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleInKindQuantityChange(item.id, -1)}
                                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-green-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center text-xs font-black text-brand-green-950">
                                      {qty}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleInKindQuantityChange(item.id, 1)}
                                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-green-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* RIGHT: Contact info */}
                        <div className="lg:col-span-5 space-y-6">
                          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                            <span className="block text-xs font-extrabold text-brand-green-950 uppercase tracking-wider">
                              2. {language === "am" ? "የእርስዎን መረጃ ያስገቡ" : "Your Contact Information"}
                            </span>
                            
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                {language === "am" ? "ሙሉ ስም *" : "Full Name *"}
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Almaz Kebede"
                                value={donorName}
                                onChange={(e) => setDonorName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-green-600 text-brand-green-950 font-medium"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                {language === "am" ? "ስልክ ቁጥር *" : "Phone Number *"}
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="0911000000"
                                value={donorPhone}
                                onChange={(e) => setDonorPhone(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-green-600 text-brand-green-950 font-medium"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                                {language === "am" ? "ኢሜይል (አማራጭ)" : "Email Address (Optional)"}
                              </label>
                              <input
                                type="email"
                                placeholder="name@example.com"
                                value={donorEmail}
                                onChange={(e) => setDonorEmail(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-green-600 text-brand-green-950 font-medium"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3.5 bg-brand-green-600 hover:bg-brand-green-700 disabled:bg-gray-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Heart className="w-4 h-4 fill-white" />
                                  {language === "am" ? "የእቃ ድጋፍ ቃልኪዳኑን ላክ" : "Submit Supply Pledge"}
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    </form>
                  )}
                </motion.div>
              ) : (
                /* SUCCESS PLEDGE SCREEN */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-4 max-w-lg mx-auto"
                >
                  <div className="w-16 h-16 bg-brand-green-50 text-brand-green-600 rounded-full flex items-center justify-center mx-auto border-2 border-brand-green-100 shadow-md">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <h3 className="font-serif text-3xl font-extrabold text-brand-green-950">
                    {language === "am" ? "የድጋፍ ቃልኪዳንዎ ደርሶናል!" : "Thank You for Your Support!"}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                    {language === "am"
                      ? `እናመሰግናለን ${submittedPledge.donorName}! የሰሊሆም አስተባባሪዎች በአጭር ጊዜ ውስጥ በጥሪ ወይም በኢሜይል ያነጋግሩዎታል።`
                      : `Thank you ${submittedPledge.donorName}! A Selihom representative will contact you shortly to confirm logistics.`
                    }
                  </p>
                  <button
                    onClick={() => setSubmittedPledge(null)}
                    className="px-6 py-2.5 bg-brand-green-950 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-green-800 transition-colors cursor-pointer"
                  >
                    {language === "am" ? "ወደ ዋናው ገጽ ተመለስ" : "Back to Donation"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
