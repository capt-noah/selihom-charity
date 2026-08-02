import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, Handshake, Check, X, Send, HeartHandshake, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { VolunteerApplication } from "../types";
import { saveVolunteer } from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";

export default function GetInvolvedSection() {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<VolunteerApplication | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interestArea, setInterestArea] = useState<VolunteerApplication["interestArea"]>("kitchen");
  const [availability, setAvailability] = useState<VolunteerApplication["availability"]>("weekends");
  const [experience, setExperience] = useState("");
  const [formError, setFormError] = useState("");

  const handleCardClick = (trackId: string) => {
    if (trackId === "volunteer") {
      setIsModalOpen(true);
    } else {
      // Smooth scroll to contact section
      const contactEl = document.getElementById("contact");
      if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cleanName       = sanitizeText(fullName, 120);
    const cleanPhone      = sanitizePhone(phone);
    const cleanEmail      = sanitizeText(email, 120);
    const cleanExperience = sanitizeText(experience, 1000);

    if (!isNonEmpty(cleanName)) {
      setFormError(language === "am" ? "ሙሉ ስምዎን ያስገቡ።" : "Please enter your full name.");
      return;
    }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) {
      setFormError(language === "am" ? "ስልክዎን ወይም ኢሜይልዎን ያስገቡ።" : "Please enter your phone number or email address.");
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setFormError(language === "am" ? "የኢሜይል አድራሻው ትክክል አይደለም።" : "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    const app: VolunteerApplication = {
      id: "VOL-" + Math.floor(Math.random() * 900000 + 100000),
      fullName:    cleanName,
      email:       cleanEmail,
      phone:       cleanPhone,
      interestArea,
      availability,
      experience:  cleanExperience,
      status:      "new",
      submittedAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    };

    await saveVolunteer(app);
    setSubmittedApp(app);
    setIsSubmitting(false);

    setFullName("");
    setEmail("");
    setPhone("");
    setExperience("");
  };

  const tracks = [
    {
      id: "volunteer",
      icon: Users,
      title: {
        am: "በበጎ ፈቃደኝነት መሳተፍ",
        en: "Become a Volunteer"
      },
      description: {
        am: "በማዕከላችን በምግብ ማዘጋጀት፣ በህክምና ድጋፍ፣ በስነ-ልቦና ምክር ወይም በትምህርት ድጋፍ በበጎ ፈቃደኝነት ለማገልገል ይቀላቀሉን።",
        en: "Join our daily food preparation, medical consultations, psychological counseling, or educational tutoring shifts."
      },
      badge: {
        am: "በጎ ፈቃደኝነት",
        en: "Volunteer"
      },
      color: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70",
      ctaText: {
        am: "በጎ ፈቃደኛ ለመሆን እዚህ ይጫኑ",
        en: "Click to Volunteer"
      }
    },
    {
      id: "partner",
      icon: Handshake,
      title: {
        am: "ድርጅታዊ አጋርነት",
        en: "Institutional Partnership"
      },
      description: {
        am: "ከድርጅትዎ ጋር በመሆን በአጋርነት የህክምና መሳሪያዎች፣ የምግብ እቃዎችና የሙያ ስልጠና ቁሳቁሶችን ያቀርቡልን።",
        en: "Partner with Selihom to sponsor medical equipment, food supplies, and vocational training toolkits."
      },
      badge: {
        am: "አጋርነት",
        en: "Partnership"
      },
      color: "bg-amber-50 text-amber-800 border-amber-200",
      ctaText: {
        am: "በስልክ ያግኙን →",
        en: "Contact Us for Partnership →"
      }
    }
  ];

  return (
    <section id="get-involved" className="relative py-24 bg-white overflow-hidden border-b border-brand-green-100/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-green-950 mb-4 tracking-tight leading-tight"
          >
            {language === "am" ? (
              <>በሰሊሆም ማህበር <span className="text-brand-green-700 italic font-medium">የመሳተፊያ መንገዶች</span></>
            ) : (
              <>Ways You Can <span className="text-brand-green-700 italic font-medium">Get Involved</span></>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-sm md:text-base leading-relaxed"
          >
            {language === "am"
              ? "የእርስዎ ትንሹ የበጎ አድራጎት እገዛና በጎ ፈቃደኝነት በጎዳና ላይ የወደቁትን ለማንሳትና ለማገገም ትልቅ ጉልበት ይሆናል።"
              : "Every act of kindness, time pledged, or partnership empowers our mission to rescue, rehabilitate, and reintegrate vulnerable individuals into society."
            }
          </motion.p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tracks.map((track, idx) => {
            const IconComponent = track.icon;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handleCardClick(track.id)}
                className="bg-gray-50/90 rounded-3xl p-8 border border-brand-green-100 hover:border-brand-yellow-500 flex flex-col justify-between hover:shadow-xl hover:bg-white transition-all duration-300 group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white text-brand-green-800 rounded-2xl flex items-center justify-center shadow-sm border border-brand-green-100 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${track.color}`}>
                      {t(track.badge)}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-brand-green-950 mb-3 group-hover:text-brand-green-700 transition-colors">
                    {t(track.title)}
                  </h3>
                  
                  <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4">
                    {t(track.description)}
                  </p>

                  {track.id === "volunteer" && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {language === "am" ? "ምግብ ማዘጋጀት" : "Kitchen & Meals"}
                      </span>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-lg border border-blue-200">
                        {language === "am" ? "የህክምና ድጋፍ" : "Medical Care"}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                        {language === "am" ? "ትምህርትና ምክር" : "Education & Counseling"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(track.id);
                    }}
                    className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      track.id === "volunteer"
                        ? "bg-brand-green-600 hover:bg-brand-green-700 text-white shadow-md hover:shadow-lg active:scale-98"
                        : "bg-brand-green-50 hover:bg-brand-green-100 text-brand-green-900 border border-brand-green-200"
                    }`}
                  >
                    <span>{t(track.ctaText)}</span>
                    <HeartHandshake className="w-4 h-4 text-brand-yellow-400 shrink-0" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Volunteer Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-brand-green-100 relative my-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {submittedApp ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-green-700 bg-brand-green-50 px-2.5 py-1 rounded-lg border border-brand-green-200">
                      ID: {submittedApp.id}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-green-950 mt-3">
                      {language === "am" ? "የበጎ ፈቃደኝነት ማመልከቻዎ ተቀብለናል!" : "Volunteer Application Submitted!"}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">
                      {language === "am"
                        ? "እናመሰግናለን! የአስተዳደር ቡድናችን ማመልከቻዎን ገምግሞ በቅርቡ በስልክ ወይም በኢሜይል ያገኝዎታል።"
                        : "Thank you for stepping forward! Our admin team will review your profile and reach out to you shortly."
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSubmittedApp(null);
                      setIsModalOpen(false);
                    }}
                    className="w-full py-3 bg-brand-green-950 text-white font-bold text-sm rounded-xl hover:bg-brand-green-900 transition-all cursor-pointer shadow-md"
                  >
                    {language === "am" ? "ዝጋ" : "Close Window"}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-brand-green-950">
                        {language === "am" ? "የበጎ ፈቃደኝነት ማመልከቻ ቅጽ" : "Volunteer Application Form"}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {language === "am" ? "ጊዜዎንና እውቀትዎን ለሰሊሆም ማህበር በማበርከት ተሳታፊ ይሁኑ" : "Offer your skills and time to support shelter residents"}
                      </p>
                    </div>
                  </div>

                  {formError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                      {formError}
                    </div>
                  )}

                  <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {language === "am" ? "ሙሉ ስም *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Abebe Kebede"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-green-600 focus:ring-2 focus:ring-brand-green-100 outline-none text-xs text-gray-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === "am" ? "ስልክ ቁጥር" : "Phone Number"}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+251 911 000 000"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-green-600 focus:ring-2 focus:ring-brand-green-100 outline-none text-xs text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === "am" ? "ኢሜይል" : "Email Address"}
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-green-600 focus:ring-2 focus:ring-brand-green-100 outline-none text-xs text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === "am" ? "የስራ/አገልግሎት ዘርፍ" : "Primary Area of Interest"}
                        </label>
                        <select
                          value={interestArea}
                          onChange={(e) => setInterestArea(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-green-600 focus:ring-2 focus:ring-brand-green-100 outline-none text-xs text-gray-900 bg-white"
                        >
                          <option value="kitchen">{language === "am" ? "ምግብ ቤትና ማብሰያ" : "Kitchen & Food Prep"}</option>
                          <option value="medical">{language === "am" ? "ህክምናና ነርስነት" : "Medical & Nursing Care"}</option>
                          <option value="psychology">{language === "am" ? "የስነ-ልቦና ምክር" : "Counseling & Psychotherapy"}</option>
                          <option value="education">{language === "am" ? "ትምህርትና ማሰልጠን" : "Teaching & Vocational Skills"}</option>
                          <option value="general">{language === "am" ? "ጠቅላላ የበጎ አድራጎት ስራ" : "General Shelter Operations"}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === "am" ? "የአገልግሎት ጊዜ" : "Availability"}
                        </label>
                        <select
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value as any)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-green-600 focus:ring-2 focus:ring-brand-green-100 outline-none text-xs text-gray-900 bg-white"
                        >
                          <option value="weekends">{language === "am" ? "ቅዳሜና እሁድ" : "Weekends Only"}</option>
                          <option value="weekdays">{language === "am" ? "በስራ ቀናት" : "Weekdays Only"}</option>
                          <option value="flexible">{language === "am" ? "ተለዋዋጭ/በማንኛውም ጊዜ" : "Flexible Schedule"}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        {language === "am" ? "ልምድ ወይም ተጨማሪ አስተያየት" : "Brief Experience / Motivation"}
                      </label>
                      <textarea
                        rows={3}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder={language === "am" ? "ስለ እርስዎ ሙያና ልምድ ባጭሩ ይግለጹ..." : "Tell us briefly about your background or motivation..."}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-green-600 focus:ring-2 focus:ring-brand-green-100 outline-none text-xs text-gray-900 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-green-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-brand-green-900 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>{language === "am" ? "በመላክ ላይ..." : "Submitting..."}</span>
                      ) : (
                        <>
                          <span>{language === "am" ? "ማመልከቻውን ላክ" : "Submit Volunteer Application"}</span>
                          <Send className="w-4 h-4 text-brand-yellow-400" />
                        </>
                      )}
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
