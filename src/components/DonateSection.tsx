import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Package, Gift, Building, AlertCircle, Copy, PhoneCall, CheckCircle2 } from "lucide-react";
import { BANK_ACCOUNTS, SELIHOM_INFO } from "../data";
import { DonationPledge, InKindItem } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { savePledge, getInKindNeeds } from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";
import { DotGridPattern } from "./Sketches";

interface DonateSectionProps {
  initialInitiativeId?: string | null;
  initialCustomAmount?: number | null;
  onClearInitialValues: () => void;
}

export default function DonateSection({ initialInitiativeId, initialCustomAmount, onClearInitialValues }: DonateSectionProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"bank" | "inkind">("bank");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [inKindNeeds, setInKindNeeds] = useState<InKindItem[]>([]);
  const [pledgedQty, setPledgedQty] = useState<Record<string, number>>({});
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [submittedPledge, setSubmittedPledge] = useState<DonationPledge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { getInKindNeeds().then(setInKindNeeds); }, [activeTab]);
  useEffect(() => {
    if (initialInitiativeId || initialCustomAmount) {
      const el = document.getElementById("donate");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      onClearInitialValues();
    }
  }, [initialInitiativeId, initialCustomAmount]);

  const copy = (acc: string) => { navigator.clipboard.writeText(acc); setCopiedAccount(acc); setTimeout(() => setCopiedAccount(null), 2500); };
  const changeQty = (id: string, d: number) => setPledgedQty((p) => ({ ...p, [id]: Math.max(0, (p[id] || 0) + d) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMessage("");
    const cleanName  = sanitizeText(donorName, 120);
    const cleanPhone = sanitizePhone(donorPhone);
    const cleanEmail = sanitizeText(donorEmail, 120);
    if (!isNonEmpty(cleanName))                             { setErrorMessage(language === "am" ? "ስምዎን ያስገቡ።" : "Please enter your name."); return; }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) { setErrorMessage(language === "am" ? "ስልክ ወይም ኢሜይልዎን ያስገቡ።" : "Please provide your phone or email."); return; }
    if (cleanEmail && !isValidEmail(cleanEmail))            { setErrorMessage(language === "am" ? "ኢሜይሉ ትክክል አይደለም።" : "Please enter a valid email address."); return; }
    const items = Object.entries(pledgedQty).filter(([_,q]) => Number(q) > 0).map(([id,q]) => {
      const item = inKindNeeds.find(it => it.id === id);
      return { itemId:id, name:sanitizeText(t(item?.name)||"Item",200), quantity:Math.max(1,Math.min(10000,Number(q))) };
    });
    if (items.length === 0) { setErrorMessage(language === "am" ? "ቢያንስ 1 እቃ ይምረጡ።" : "Please pledge at least 1 item."); return; }
    setIsSubmitting(true);
    const pledge: DonationPledge = {
      id:"PLG-"+Math.floor(Math.random()*900000+100000), donorName:cleanName, donorEmail:cleanEmail||cleanPhone,
      donorPhone:cleanPhone||cleanEmail, type:"inkind", pledgedItems:items,
      date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}), status:"pledged",
    };
    await savePledge(pledge); setSubmittedPledge(pledge); setIsSubmitting(false);
  };

  return (
    <section id="donate" className="py-24 bg-white relative overflow-hidden border-t border-brand-sky-100">
      <DotGridPattern />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "ይደግፉ" : "Support Us"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-sky-950 mb-4 tracking-tight leading-tight">
            {language === "am" ? <>ለሰሊሆም <span className="text-brand-sky-400 italic font-medium">ድጋፍ ያድርጉ</span></> : <>Ways to <span className="text-brand-sky-400 italic font-medium">Support Selihom</span></>}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-gray-500 text-sm md:text-base leading-relaxed">
            {language === "am" ? "በባንክ ሂሳቦቻችን፣ ዓይነት እቃዎች ወይም ቀጥታ ስልክ ድጋፍዎን ያድርሱን።"
              : "Support Selihom through bank transfer, in-kind supply pledges, or direct phone contact."}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-3xl border-2 border-brand-sky-100 overflow-hidden shadow-xl max-w-5xl mx-auto">

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-brand-sky-100 bg-brand-sky-50/50">
            {(["bank","inkind"] as const).map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setSubmittedPledge(null); }}
                className={`py-4 sm:py-5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab ? "border-brand-sky-400 text-brand-sky-600 bg-white shadow-sm" : "border-transparent text-gray-400 hover:text-brand-sky-500"
                }`}>
                {tab === "bank"
                  ? <><Building className="w-5 h-5 shrink-0" />{language === "am" ? "የባንክ ሂሳቦች" : "Bank Accounts"}</>
                  : <><Package  className="w-5 h-5 shrink-0" />{language === "am" ? "የዓይነት እቃዎች" : "In-Kind Pledge"}</>}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-10">
            {errorMessage && (
              <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-2xl text-xs font-semibold flex items-start gap-2.5 mb-6">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{errorMessage}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!submittedPledge ? (
                <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>

                  {/* ── BANK ── */}
                  {activeTab === "bank" && (
                    <div className="space-y-8">
                      <div className="text-center max-w-xl mx-auto mb-6">
                        <span className="text-brand-sky-600 text-[11px] font-black uppercase tracking-widest block mb-2">
                          {language === "am" ? "ህጋዊ ሂሳቦች" : "Official NGO Bank Accounts"}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-brand-sky-950">{t(SELIHOM_INFO.fullName)}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {language === "am" ? "ሞባይል ባንኪንግ ወይም ቅርንጫፍ ቀጥታ ገቢ ማድረግ ይቻላል።" : "Deposit via Mobile Banking or any branch across Ethiopia."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {BANK_ACCOUNTS.map((acc, idx) => {
                          const colours = ["bg-brand-sky-400","bg-brand-green-400","bg-brand-yellow-400"];
                          return (
                            <div key={idx} className="bg-gray-50 hover:bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-brand-sky-300 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
                              <div>
                                <div className={`w-10 h-10 rounded-xl ${colours[idx % colours.length]} text-white font-serif font-black flex items-center justify-center text-lg mb-4 shadow-sm`}>
                                  {idx + 1}
                                </div>
                                <h4 className="font-serif font-extrabold text-brand-sky-950 text-base mb-1">{t(acc.bank)}</h4>
                                <p className="text-[11px] text-gray-400 mb-4 font-medium">{acc.accountName}</p>
                                <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-2 shadow-inner">
                                  <span className="font-mono font-black text-sm text-brand-sky-950 tracking-wider">{acc.accountNumber}</span>
                                  <button onClick={() => copy(acc.accountNumber)} className="p-1.5 hover:bg-brand-sky-50 text-brand-sky-500 rounded-lg transition-colors cursor-pointer">
                                    {copiedAccount === acc.accountNumber ? <Check className="w-4 h-4 text-brand-green-500 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                              <button onClick={() => copy(acc.accountNumber)}
                                className="mt-5 w-full py-2.5 bg-brand-sky-950 hover:bg-brand-sky-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2">
                                {copiedAccount === acc.accountNumber
                                  ? <><Check className="w-4 h-4 text-brand-yellow-400" />{language === "am" ? "ተቀድቷል!" : "Copied!"}</>
                                  : <><Copy className="w-4 h-4" />{language === "am" ? "ቁጥሩን ቅዳ" : "Copy Account No"}</>}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-brand-sky-950 text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-brand-yellow-400 text-[10px] font-black uppercase tracking-widest block">{language === "am" ? "ቀጥታ ስልክ" : "Direct Phone Contact"}</span>
                          <h4 className="font-serif text-xl font-bold text-white">{language === "am" ? "ለበለጠ ድጋፍ ይደውሉ" : "Call Us for Donations"}</h4>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
                          {SELIHOM_INFO.contact.phones.map((phone, pIdx) => (
                            <a key={pIdx} href={`tel:${phone.replace(/\s/g,"")}`}
                              className="px-4 py-2 bg-white/10 hover:bg-brand-yellow-400 hover:text-brand-sky-950 text-white font-mono font-extrabold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5">
                              <PhoneCall className="w-3.5 h-3.5" /><span>{phone}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── IN-KIND ── */}
                  {activeTab === "inkind" && (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-7 space-y-4">
                          <label className="block text-xs font-extrabold text-brand-sky-950 uppercase tracking-wider mb-2">
                            1. {language === "am" ? "የሚደግፉትን እቃ ይምረጡ" : "Select Supplies to Pledge"}
                          </label>
                          <div className="space-y-3">
                            {[...inKindNeeds].sort((a,b) => a.urgency==="High"?-1:b.urgency==="High"?1:0).map((item) => {
                              const qty = pledgedQty[item.id] || 0;
                              return (
                                <div key={item.id} className={`bg-white rounded-2xl p-4 border-2 transition-all flex items-center justify-between gap-4 ${qty>0?"border-brand-sky-400 bg-brand-sky-50/30":"border-gray-100"}`}>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-extrabold text-brand-sky-950">{t(item.name)}</span>
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${item.urgency==="High"?"bg-brand-orange-50 text-brand-orange-600":"bg-brand-yellow-50 text-brand-yellow-600"}`}>
                                        {item.urgency}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-normal mb-1">{t(item.description)}</p>
                                    <span className="text-[10px] text-brand-sky-600 font-bold bg-brand-sky-50 px-2 py-0.5 rounded-full inline-block">Goal: {t(item.neededQuantity)}</span>
                                  </div>
                                  <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shrink-0">
                                    <button type="button" onClick={() => changeQty(item.id,-1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-brand-sky-500 hover:bg-white rounded-lg transition-colors cursor-pointer">-</button>
                                    <span className="w-8 text-center text-xs font-black text-brand-sky-950">{qty}</span>
                                    <button type="button" onClick={() => changeQty(item.id,1)}  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-brand-sky-500 hover:bg-white rounded-lg transition-colors cursor-pointer">+</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="lg:col-span-5">
                          <div className="bg-brand-sky-50 p-6 rounded-2xl border-2 border-brand-sky-100 space-y-4">
                            <span className="block text-xs font-extrabold text-brand-sky-950 uppercase tracking-wider">
                              2. {language === "am" ? "የእርስዎን መረጃ ያስገቡ" : "Your Contact Information"}
                            </span>
                            {[
                              { label:language==="am"?"ሙሉ ስም *":"Full Name *",       type:"text",  value:donorName,  setter:setDonorName,  req:true  },
                              { label:language==="am"?"ስልክ ቁጥር *":"Phone *",         type:"tel",   value:donorPhone, setter:setDonorPhone, req:true  },
                              { label:language==="am"?"ኢሜይል (አማራጭ)":"Email (Opt.)", type:"email", value:donorEmail, setter:setDonorEmail, req:false },
                            ].map(({label,type,value,setter,req}) => (
                              <div key={label}>
                                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{label}</label>
                                <input type={type} required={req} value={value} onChange={(e) => setter(e.target.value)}
                                  className="w-full bg-white border border-brand-sky-200 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-sky-400 text-brand-sky-950 font-medium" />
                              </div>
                            ))}
                            <button type="submit" disabled={isSubmitting}
                              className="w-full py-3.5 bg-brand-sky-400 hover:bg-brand-sky-500 disabled:bg-gray-300 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2">
                              {isSubmitting
                                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <><Gift className="w-4 h-4" />{language === "am" ? "ቃልኪዳን ላክ" : "Submit Pledge"}</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="text-center py-10 space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 bg-brand-sky-50 text-brand-sky-500 rounded-full flex items-center justify-center mx-auto border-2 border-brand-sky-100 shadow-md">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <h3 className="font-serif text-3xl font-extrabold text-brand-sky-950">{language === "am" ? "ቃልኪዳንዎ ደርሶናል!" : "Thank You for Your Support!"}</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                    {language === "am" ? `እናመሰግናለን ${submittedPledge.donorName}!` : `Thank you ${submittedPledge.donorName}! A Selihom representative will contact you shortly.`}
                  </p>
                  <button onClick={() => setSubmittedPledge(null)}
                    className="px-6 py-2.5 bg-brand-sky-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-sky-500 transition-colors cursor-pointer">
                    {language === "am" ? "ወደ ዋናው ገጽ" : "Back to Donation"}
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
