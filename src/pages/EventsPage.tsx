import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, Cake, HeartHandshake, Star, Sparkles,
  Calendar, Phone, Mail, User, MessageSquare,
  CheckCircle2, AlertCircle, Loader2, ArrowRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { saveEventPledge, EventPledge } from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";
import { DotGridPattern } from "../components/Sketches";

type EventType = "birthday" | "wedding" | "anniversary" | "other";

const EVENT_TYPES: { id: EventType; icon: React.ComponentType<any>; label: { en: string; am: string }; desc: { en: string; am: string }; color: string }[] = [
  {
    id: "birthday", icon: Cake, color: "bg-brand-sky-400",
    label: { en: "Birthday",     am: "ልደት" },
    desc:  { en: "Celebrate your special day by treating our beneficiaries to a warm birthday meal.", am: "ልደትዎን ለሰሊሆም ተጠቃሚዎች ሞቅ ያለ ምግብ በመስጠት ያክብሩ።" },
  },
  {
    id: "wedding", icon: HeartHandshake, color: "bg-brand-green-400",
    label: { en: "Wedding",      am: "ሰርግ" },
    desc:  { en: "Mark your wedding day with an act of love by feeding those who need it most.", am: "ሰርጎን ምግብ ለሚያስፈልጋቸው ሰዎች ከፋፍሎ ፍቅርዎን ያሳዩ።" },
  },
  {
    id: "anniversary", icon: Star, color: "bg-brand-yellow-400",
    label: { en: "Anniversary",  am: "ዓመት በዓል" },
    desc:  { en: "Turn your anniversary into a celebration of giving — sponsor a feast for our residents.", am: "ዓመት በዓልዎን ለተጠቃሚዎቻችን ድግስ በመደጎም ያክብሩ።" },
  },
  {
    id: "other", icon: Sparkles, color: "bg-brand-orange-400",
    label: { en: "Other",        am: "ሌላ" },
    desc:  { en: "Any occasion is a reason to give. Tell us about your special moment.", am: "ማንኛውም ክብረ-በዓል ምክንያት ነው። ስለ ልዩ ጊዜዎ ይንገሩን።" },
  },
];

export default function EventsPage() {
  const { language } = useLanguage();

  const [step, setStep] = useState<"type" | "form" | "success">("type");
  const [selectedType, setSelectedType] = useState<EventType>("birthday");

  const [name,          setName]          = useState("");
  const [phone,         setPhone]         = useState("");
  const [email,         setEmail]         = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [customType,    setCustomType]    = useState("");
  const [message,       setMessage]       = useState("");
  const [error,         setError]         = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [submitted,     setSubmitted]     = useState<EventPledge | null>(null);

  const selectedDef = EVENT_TYPES.find(e => e.id === selectedType)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanName  = sanitizeText(name, 120);
    const cleanPhone = sanitizePhone(phone);
    const cleanEmail = sanitizeText(email, 120);
    const cleanDate  = sanitizeText(preferredDate, 80);
    const cleanMsg   = sanitizeText(message, 600);

    if (!isNonEmpty(cleanName))                             { setError(language === "am" ? "ስምዎን ያስገቡ።" : "Please enter your name."); return; }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) { setError(language === "am" ? "ስልክ ወይም ኢሜይልዎን ያስገቡ።" : "Please provide your phone or email."); return; }
    if (cleanEmail && !isValidEmail(cleanEmail))            { setError(language === "am" ? "ኢሜይሉ ትክክል አይደለም።" : "Please enter a valid email."); return; }
    if (!cleanDate)                                         { setError(language === "am" ? "ቀኑን ያስገቡ።" : "Please enter your preferred date."); return; }

    setSubmitting(true);
    const pledge: EventPledge = {
      id:            "EVT-" + Math.floor(Math.random() * 900000 + 100000),
      name:          cleanName,
      phone:         cleanPhone,
      email:         cleanEmail,
      eventType:     selectedType,
      customType:    sanitizeText(customType, 80),
      preferredDate: cleanDate,
      message:       cleanMsg,
      status:        "pending",
      submittedAt:   new Date().toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" }),
    };
    await saveEventPledge(pledge);
    setSubmitted(pledge);
    setStep("success");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-16 bg-white">

      {/* Hero banner */}
      <div className="relative bg-brand-sky-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sky-700/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green-400/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-5">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-sky-800/60 border border-brand-sky-600/40 rounded-full text-xs font-bold text-brand-sky-200">
            <Heart className="w-3.5 h-3.5 text-brand-yellow-400" />
            {language === "am" ? "ፍቅር ያካፍሉ" : "Share Your Joy"}
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="font-serif text-4xl md:text-5xl font-bold leading-tight">
            {language === "am" ? (
              <>ልዩ ቀንዎን ለሌሎች <span className="text-brand-yellow-400">ፍቅር</span> ያድርጉ</>
            ) : (
              <>Celebrate Your Day. <span className="text-brand-yellow-400">Feed Those in Need.</span></>
            )}
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="text-brand-sky-200 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {language === "am"
              ? "ሰዎች ብዙ ጊዜ ልደት፣ ሰርግ ወይም ሌሎች ክብረ-በዓሎቻቸውን ፓርቲ ያደርጋሉ። ይህን ፓርቲ በሰሊሆም ማዕከል ሰዎችን ምግብ ለመስጠት ይጠቀሙበት። ምንም ክፍያ የለም — ፍቅርዎ ብቻ።"
              : "People throw parties for birthdays, weddings, and anniversaries. Why not hold that celebration here — feeding people in need with your joy? No cost, no package. Just your love."}
          </motion.p>

          {/* Quick stats */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            className="flex flex-wrap justify-center gap-6 pt-4">
            {[
              { num:"200+", label:{ en:"Beneficiaries fed daily", am:"ዕለታዊ ምግብ ተጠቃሚዎች" } },
              { num:"0",    label:{ en:"Cost to you", am:"ለእርስዎ ዋጋ" } },
              { num:"100%", label:{ en:"Goes to shelter", am:"ለማዕከሉ" } },
            ].map(s => (
              <div key={s.num} className="text-center">
                <span className="font-mono font-black text-3xl text-brand-yellow-400 block">{s.num}</span>
                <span className="text-xs text-brand-sky-300 font-medium">{language === "am" ? s.label.am : s.label.en}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-16 relative">
        <DotGridPattern />
        <div className="relative z-10">
          <AnimatePresence mode="wait">

            {/* Step 1: Choose event type */}
            {step === "type" && (
              <motion.div key="type" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                className="space-y-8">
                <div className="text-center">
                  <h2 className="font-serif text-2xl font-bold text-brand-sky-950 mb-2">
                    {language === "am" ? "የክብረ-በዓሉ አይነት ይምረጡ" : "What are you celebrating?"}
                  </h2>
                  <p className="text-gray-500 text-sm">{language === "am" ? "ከዚህ በታች ያለዉን ይምረጡ" : "Choose the type of celebration"}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {EVENT_TYPES.map(evt => {
                    const Icon = evt.icon;
                    const isSelected = selectedType === evt.id;
                    return (
                      <motion.button key={evt.id} onClick={() => setSelectedType(evt.id)}
                        whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                        className={`text-left p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-brand-sky-400 bg-brand-sky-50 shadow-lg shadow-brand-sky-400/10"
                            : "border-gray-100 bg-white hover:border-brand-sky-200 shadow-sm hover:shadow-md"
                        }`}>
                        <div className={`w-12 h-12 rounded-2xl ${evt.color} flex items-center justify-center mb-4 shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-serif font-bold text-lg text-brand-sky-950 mb-2">
                          {language === "am" ? evt.label.am : evt.label.en}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {language === "am" ? evt.desc.am : evt.desc.en}
                        </p>
                        {isSelected && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-brand-sky-600">
                            <CheckCircle2 className="w-4 h-4" />
                            {language === "am" ? "ተመርጧል" : "Selected"}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="text-center">
                  <button onClick={() => setStep("form")}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-sm uppercase tracking-wider rounded-2xl cursor-pointer shadow-xl shadow-brand-sky-400/25 hover:-translate-y-0.5 transition-all">
                    {language === "am" ? "ቀጥ ወደ ዝርዝር" : "Continue to Details"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Form */}
            {step === "form" && (
              <motion.div key="form" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                className="max-w-xl mx-auto space-y-6">

                {/* Selected type recap */}
                <div className={`flex items-center gap-3 p-4 rounded-2xl ${selectedDef.color} text-white`}>
                  <selectedDef.icon className="w-6 h-6 shrink-0" />
                  <div>
                    <span className="font-bold text-sm block">{language === "am" ? selectedDef.label.am : selectedDef.label.en}</span>
                    <button onClick={() => setStep("type")} className="text-[10px] text-white/70 hover:text-white underline cursor-pointer">
                      {language === "am" ? "ቀይር" : "Change"}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border-2 border-brand-sky-100 rounded-3xl p-6 shadow-xl space-y-5">
                  <h2 className="font-serif font-bold text-xl text-brand-sky-950">
                    {language === "am" ? "ዝርዝር መረጃ ያስገቡ" : "Tell Us About Your Celebration"}
                  </h2>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />{error}
                    </div>
                  )}

                  {/* If "other", show custom type field */}
                  {selectedType === "other" && (
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5">
                        {language === "am" ? "ምን ዓይነት ክብረ-በዓል ነው? *" : "What type of occasion? *"}
                      </label>
                      <input type="text" value={customType} onChange={e => setCustomType(e.target.value)}
                        placeholder={language === "am" ? "ለምሳሌ: ምርቃት፣ ምርጫ..." : "e.g. Graduation, Promotion..."}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />{language === "am" ? "ሙሉ ስም *" : "Full Name *"}
                      </label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)}
                        placeholder="e.g. Abebe Kebede"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />{language === "am" ? "የተፈለገ ቀን *" : "Preferred Date *"}
                      </label>
                      <input type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none cursor-pointer" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />{language === "am" ? "ስልክ" : "Phone"}
                      </label>
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="+251 911 000 000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />{language === "am" ? "ኢሜይል" : "Email"}
                      </label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />{language === "am" ? "ልዩ ፍላጎቶች ወይም ተጨማሪ ማስታወሻ" : "Special Requests or Message (optional)"}
                    </label>
                    <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
                      placeholder={language === "am" ? "ለምሳሌ: ልዩ ምናሌ ፍላጎት..." : "e.g. Any special requests or things to know..."}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none resize-none" />
                  </div>

                  {/* Info note */}
                  <div className="bg-brand-sky-50 border border-brand-sky-200 rounded-xl p-4 text-xs text-brand-sky-700 leading-relaxed">
                    <strong className="block mb-1">{language === "am" ? "📋 ሂደቱ ምን ይመስላል?" : "📋 What happens next?"}</strong>
                    {language === "am"
                      ? "ማመልከቻዎን ሲልኩ የሰሊሆም ቡድን ለማረጋገጥ ያናጋጥዎታል። ምንም ክፍያ የለም — ፍቅርዎ ብቻ።"
                      : "Once you submit, our Selihom team will reach out to confirm and arrange the celebration details. There is no payment required — your presence and love is the gift."}
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full py-4 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-sm uppercase tracking-wider rounded-2xl cursor-pointer shadow-xl shadow-brand-sky-400/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {submitting
                      ? <><Loader2 className="w-5 h-5 animate-spin" />{language === "am" ? "በመላክ..." : "Sending..."}</>
                      : <><Heart className="w-5 h-5" />{language === "am" ? "ጥያቄ ላክ" : "Submit Celebration Request"}</>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === "success" && submitted && (
              <motion.div key="success" initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
                className="text-center py-12 space-y-6 max-w-lg mx-auto">
                <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:0.6, delay:0.2 }}
                  className="w-20 h-20 bg-brand-sky-100 text-brand-sky-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Heart className="w-10 h-10 fill-brand-sky-400 text-brand-sky-400" />
                </motion.div>
                <span className="font-mono text-xs font-bold text-brand-sky-600 bg-brand-sky-50 border border-brand-sky-200 px-3 py-1.5 rounded-lg block w-fit mx-auto">
                  {submitted.id}
                </span>
                <h2 className="font-serif text-3xl font-bold text-brand-sky-950">
                  {language === "am" ? "ምስጋና! ጥያቄዎ ተቀብሎ ተመዝግቧል።" : "Thank You! Request Received."}
                </h2>
                <p className="text-gray-500 text-base leading-relaxed">
                  {language === "am"
                    ? `${submitted.name}፣ አስተዳደር ቡድናችን ብዙም ሳይቆይ ቀጠሮ ለማረጋገጥ ያናጋጥዎታል። ፍቅርዎ ያምናል!`
                    : `${submitted.name}, our team will reach out shortly to confirm the date and arrangements for your ${submitted.eventType} celebration. Your love means everything to our residents!`}
                </p>
                <button onClick={() => { setStep("type"); setSubmitted(null); setName(""); setPhone(""); setEmail(""); setPreferredDate(""); setMessage(""); setCustomType(""); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-sky-400 text-white text-sm font-bold uppercase tracking-wider rounded-2xl hover:bg-brand-sky-500 cursor-pointer transition-colors">
                  {language === "am" ? "ሌላ ጥያቄ" : "Submit Another"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
