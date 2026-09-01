import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Handshake, X, Send, HeartHandshake, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { VolunteerApplication } from "../types";
import { saveVolunteer } from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";
import { useNavigate } from "react-router-dom";

export default function GetInvolvedSection() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<VolunteerApplication | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interestArea, setInterestArea] = useState<VolunteerApplication["interestArea"]>("kitchen");
  const [availability, setAvailability] = useState<VolunteerApplication["availability"]>("weekends");
  const [experience, setExperience] = useState("");
  const [formError, setFormError] = useState("");

  const handleCardClick = (trackId: string) => {
    if (trackId === "volunteer") { setIsModalOpen(true); }
    else { const el = document.getElementById("contact"); if (el) el.scrollIntoView({ behavior: "smooth" }); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const cleanName  = sanitizeText(fullName, 120);
    const cleanPhone = sanitizePhone(phone);
    const cleanEmail = sanitizeText(email, 120);
    const cleanExp   = sanitizeText(experience, 1000);
    if (!isNonEmpty(cleanName))                         { setFormError(language === "am" ? "ሙሉ ስምዎን ያስገቡ።" : "Please enter your full name."); return; }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) { setFormError(language === "am" ? "ስልክ ወይም ኢሜይልዎን ያስገቡ።" : "Please enter your phone or email."); return; }
    if (cleanEmail && !isValidEmail(cleanEmail))        { setFormError(language === "am" ? "ኢሜይሉ ትክክል አይደለም።" : "Please enter a valid email address."); return; }
    setIsSubmitting(true);
    const app: VolunteerApplication = {
      id: "VOL-" + Math.floor(Math.random() * 900000 + 100000),
      fullName: cleanName, email: cleanEmail, phone: cleanPhone,
      interestArea, availability, experience: cleanExp, status: "new",
      submittedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };
    await saveVolunteer(app);
    setSubmittedApp(app);
    setIsSubmitting(false);
    setFullName(""); setEmail(""); setPhone(""); setExperience("");
  };

  const tracks = [
    { id:"volunteer", icon:Users,     primary:true,
      title:{ am:"በበጎ ፈቃደኝነት መሳተፍ",    en:"Become a Volunteer"         },
      description:{ am:"ምግብ፣ ህክምና፣ ምክር ወይም ትምህርት ለማገልገል ይቀላቀሉን።", en:"Join our kitchen, medical, counseling, or tutoring shifts." },
      badge:{ am:"በጎ ፈቃደኝነት", en:"Volunteer" }, ctaText:{ am:"ለመመዝገብ ይጫኑ", en:"Click to Apply" },
      tags:[{am:"ምግብ ቤት",en:"Kitchen"},{am:"ህክምና",en:"Medical"},{am:"ትምህርት",en:"Education"}],
    },
    { id:"partner", icon:Handshake,   primary:false,
      title:{ am:"ድርጅታዊ አጋርነት",          en:"Institutional Partnership"  },
      description:{ am:"ህክምና፣ ምግብ ወይም ሙያ ቁሳቁሶችን ያቅርቡልን።", en:"Sponsor medical equipment, food supplies, or vocational toolkits." },
      badge:{ am:"አጋርነት", en:"Partnership" }, ctaText:{ am:"በስልክ ያግኙን →", en:"Contact Us →" },
      tags:[] as {am:string;en:string}[],
    },
  ];

  return (
    <section id="get-involved" className="relative py-24 bg-brand-sky-50 overflow-hidden border-b border-brand-sky-100">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "ተሳተፉ" : "Get Involved"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-sky-950 mb-4 tracking-tight leading-tight">
            {language === "am" ? (
              <>በሰሊሆም <span className="text-brand-sky-400 italic font-medium">ተሳተፉ</span></>
            ) : (
              <>Ways to <span className="text-brand-sky-400 italic font-medium">Get Involved</span></>
            )}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-gray-500 text-sm md:text-base leading-relaxed">
            {language === "am"
              ? "ትንሹ የበጎ አድራጎት እርዳታና ጊዜ ዕጩ ሰዎችን ለማንሳትና ለማጠናከር ትልቅ ጉልበት ይሆናል።"
              : "Every act of kindness and time pledged empowers our mission to rescue, rehabilitate, and reintegrate vulnerable individuals."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tracks.map((track, idx) => {
            const Icon = track.icon;
            return (
              <motion.div key={track.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handleCardClick(track.id)}
                className="bg-white rounded-3xl p-8 border-2 border-brand-sky-100 hover:border-brand-sky-400 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-brand-sky-50 text-brand-sky-600 rounded-2xl flex items-center justify-center shadow-sm border border-brand-sky-200 group-hover:bg-brand-sky-400 group-hover:text-white group-hover:border-brand-sky-400 transition-all">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border bg-brand-sky-50 text-brand-sky-600 border-brand-sky-200">
                      {t(track.badge)}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-sky-950 mb-3 group-hover:text-brand-sky-500 transition-colors">{t(track.title)}</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4">{t(track.description)}</p>
                  {track.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {track.tags.map((tag) => (
                        <span key={tag.en} className="text-[10px] font-bold bg-brand-sky-50 text-brand-sky-700 px-2.5 py-1 rounded-lg border border-brand-sky-200">
                          {language === "am" ? tag.am : tag.en}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <button type="button" onClick={(e) => { e.stopPropagation(); handleCardClick(track.id); }}
                    className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      track.primary
                        ? "bg-brand-sky-400 hover:bg-brand-sky-500 text-white shadow-md shadow-brand-sky-400/25"
                        : "bg-brand-sky-50 hover:bg-brand-sky-100 text-brand-sky-800 border border-brand-sky-200"
                    }`}>
                    <span>{t(track.ctaText)}</span>
                    <HeartHandshake className="w-4 h-4 text-brand-yellow-400 shrink-0" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Volunteer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-2 border-brand-sky-100 relative my-8">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              {submittedApp ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-brand-sky-100 text-brand-sky-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-sky-600 bg-brand-sky-50 px-2.5 py-1 rounded-lg border border-brand-sky-200 block w-fit mx-auto">
                    ID: {submittedApp.id}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-brand-sky-950">{language === "am" ? "ማመልከቻዎ ተቀብለናል!" : "Application Submitted!"}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                    {language === "am" ? "እናመሰግናለን! አስተዳደር ቡድናችን ብዙም ሳይቆይ ያግኝዎታል።" : "Thank you! Our admin team will review your profile and reach out shortly."}
                  </p>
                  <button onClick={() => { setSubmittedApp(null); setIsModalOpen(false); }}
                    className="w-full py-3 bg-brand-sky-400 text-white font-bold text-sm rounded-xl hover:bg-brand-sky-500 transition-all cursor-pointer shadow-md">
                    {language === "am" ? "ዝጋ" : "Close"}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-brand-sky-950">{language === "am" ? "የበጎ ፈቃደኝነት ቅጽ" : "Volunteer Application Form"}</h3>
                      <p className="text-xs text-gray-400">{language === "am" ? "ጊዜዎንና ችሎታዎን ለሰሊሆም ያበርክቱ" : "Offer your skills and time to our shelter residents"}</p>
                    </div>
                  </div>

                  {formError && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">{formError}</div>}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">{language === "am" ? "ሙሉ ስም *" : "Full Name *"}</label>
                      <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Abebe Kebede"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 focus:ring-2 focus:ring-brand-sky-100 outline-none text-xs text-gray-900" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{language === "am" ? "ስልክ" : "Phone"}</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 911 000 000"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 focus:ring-2 focus:ring-brand-sky-100 outline-none text-xs text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{language === "am" ? "ኢሜይል" : "Email"}</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 focus:ring-2 focus:ring-brand-sky-100 outline-none text-xs text-gray-900" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{language === "am" ? "የስራ ዘርፍ" : "Area of Interest"}</label>
                        <select value={interestArea} onChange={(e) => setInterestArea(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 outline-none text-xs text-gray-900 bg-white">
                          <option value="kitchen">   {language === "am" ? "ምግብ ቤት"       : "Kitchen & Food"     }</option>
                          <option value="medical">   {language === "am" ? "ህክምና"          : "Medical & Nursing"  }</option>
                          <option value="psychology">{language === "am" ? "ስነ-ልቦና"        : "Counseling"         }</option>
                          <option value="education"> {language === "am" ? "ትምህርትና ስልጠና"  : "Teaching & Skills"  }</option>
                          <option value="general">   {language === "am" ? "ጠቅላላ ስራ"      : "General Operations" }</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">{language === "am" ? "የአገልግሎት ጊዜ" : "Availability"}</label>
                        <select value={availability} onChange={(e) => setAvailability(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 outline-none text-xs text-gray-900 bg-white">
                          <option value="weekends">{language === "am" ? "ቅዳሜና እሁድ"  : "Weekends"  }</option>
                          <option value="weekdays">{language === "am" ? "በስራ ቀናት"    : "Weekdays"  }</option>
                          <option value="flexible">{language === "am" ? "ተለዋዋጭ ጊዜ"   : "Flexible"  }</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">{language === "am" ? "ልምድ / ምክንያት" : "Brief Experience / Motivation"}</label>
                      <textarea rows={3} value={experience} onChange={(e) => setExperience(e.target.value)}
                        placeholder={language === "am" ? "ስለ ሙያዎ ባጭሩ..." : "Tell us briefly about your background..."}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-sky-400 focus:ring-2 focus:ring-brand-sky-100 outline-none text-xs text-gray-900 resize-none" />
                    </div>
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50">
                      {isSubmitting
                        ? <span>{language === "am" ? "በመላክ ላይ..." : "Submitting..."}</span>
                        : <><span>{language === "am" ? "ማመልከቻውን ላክ" : "Submit Application"}</span><Send className="w-4 h-4 text-brand-yellow-400" /></>
                      }
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
