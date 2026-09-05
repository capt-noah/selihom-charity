import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon, Clock, User, Users, Check, MapPin,
  Info, X, CheckCircle2, Phone, Building2, AlertCircle, Loader2,
} from "lucide-react";
import { Booking } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { saveBooking, getAvailableSlots, AvailabilitySlot } from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";
import { DotGridPattern } from "./Sketches";
import LoadingDots from "./LoadingDots";

// Contact type: individual or organization
type ContactType = "individual" | "organization";

export default function BookingSection() {
  const { language } = useLanguage();

  // ── Slot state ──
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  // ── Contact type toggle ──
  const [contactType, setContactType] = useState<ContactType>("individual");

  // ── Form fields ──
  const [name, setName]     = useState("");
  const [orgName, setOrgName] = useState("");
  const [phone, setPhone]   = useState("");
  const [email, setEmail]   = useState("");
  const [notes, setNotes]   = useState("");
  const [visitorCount, setVisitorCount] = useState(1);

  // ── Modal / submission state ──
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage]       = useState("");

  // Load available slots when modal opens
  useEffect(() => {
    if (!isModalOpen) return;
    setSlotsLoading(true);
    setSlotsError(false);
    getAvailableSlots()
      .then(setSlots)
      .catch(() => setSlotsError(true))
      .finally(() => setSlotsLoading(false));
  }, [isModalOpen]);

  const selectedSlot = slots.find(s => s.id === selectedSlotId);

  const spotsLeft = (slot: AvailabilitySlot) => slot.maxBookings - slot.currentBookings;

  // Group slots by date for display
  const slotsByDate = slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    (acc[slot.date] = acc[slot.date] || []).push(slot);
    return acc;
  }, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanName    = sanitizeText(name, 120);
    const cleanOrgName = sanitizeText(orgName, 120);
    const cleanPhone   = sanitizePhone(phone);
    const cleanEmail   = sanitizeText(email, 120);
    const cleanNotes   = sanitizeText(notes, 600);

    if (!isNonEmpty(cleanName)) {
      setErrorMessage(language === "am" ? "ሙሉ ስምዎን ያስገቡ።" : "Please enter your full name.");
      return;
    }
    if (contactType === "organization" && !isNonEmpty(cleanOrgName)) {
      setErrorMessage(language === "am" ? "ድርጅቱ ስም ያስገቡ።" : "Please enter your organization name.");
      return;
    }
    if (!isNonEmpty(cleanPhone)) {
      setErrorMessage(language === "am" ? "ስልክ ቁጥርዎን ያስገቡ።" : "Please enter your phone number.");
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setErrorMessage(language === "am" ? "የኢሜይል አድራሻው ትክክል አይደለም።" : "Please enter a valid email address.");
      return;
    }
    if (!selectedSlotId || !selectedSlot) {
      setErrorMessage(language === "am" ? "እባክዎን ጊዜ ቦታ ይምረጡ።" : "Please select an available time slot.");
      return;
    }

    setIsSubmitting(true);

    const newBooking: Booking & { slotId?: string; contactType?: string; organizationName?: string } = {
      id:           "TKT-" + Math.floor(Math.random() * 900000 + 100000),
      name:         cleanName,
      email:        cleanEmail,
      phone:        cleanPhone,
      date:         selectedSlot.date,
      timeSlot:     `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
      visitType:    contactType === "organization" ? "corporate" : "individual",
      visitorCount: contactType === "organization" ? visitorCount : 1,
      notes:        cleanNotes,
      status:       "pending",
      createdAt:    new Date().toLocaleDateString(),
      slotId:       selectedSlotId,
      contactType,
      organizationName: cleanOrgName,
    };

    await saveBooking(newBooking as any);
    setSubmittedBooking(newBooking as any);
    setIsSubmitting(false);
    setName(""); setOrgName(""); setPhone(""); setEmail(""); setNotes(""); setVisitorCount(1);
  };

  const openModal = () => { setSubmittedBooking(null); setErrorMessage(""); setSelectedSlotId(""); setIsModalOpen(true); };

  return (
    <section id="visit" className="py-24 bg-brand-sky-50 border-t border-brand-sky-100 relative overflow-hidden">
      <DotGridPattern />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "ጉብኝት" : "Visit Us"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-extrabold text-brand-sky-950 mb-3 tracking-tight">
            {language === "am" ? "ማዕከላችንን ለመጎብኘት ጊዜ ይያዙ" : "Schedule a Guided Visit"}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
            {language === "am"
              ? "ያልተጠበቀ ጉብኝት ዝግጅታችንን ስለሚያስተጓጉል፣ ከዚህ በታች ባሉ ክፍት ቦታዎች ውስጥ ቀጠሮ ይያዙ።"
              : "Pick from the available slots below. Our team will confirm your visit via phone before the date."}
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">

          {/* Main card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-8 bg-white rounded-3xl border border-brand-sky-100 p-8 md:p-10 shadow-md flex flex-col justify-between">

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-brand-sky-50 text-brand-sky-500 rounded-2xl flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-brand-sky-50 text-brand-sky-700 border border-brand-sky-200 rounded-lg">
                  {language === "am" ? "ክፍት ጊዜ ቦታዎች" : "Live Availability"}
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-sky-600 block">
                  {language === "am" ? "የሰሊሆም ማህበር ማዕከል" : "Selihom Rehabilitation Center"}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-brand-sky-950 leading-tight">
                  {language === "am" ? <>የእንጦጦ ማዕከላችንን <span className="text-brand-sky-500 italic font-normal">በአካል ይጎብኙ</span></> : <>Entoto Center <span className="text-brand-sky-500 italic font-normal">Guided Open Tour</span></>}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  {language === "am"
                    ? "ወደ እንጦጦ ራጉኤል ቤተክርስቲያን አቅራቢያ ሰሊሆምን ጎብኙ፤ ምግብ ዝግጅት፣ ህክምናና ስልጠና ሂደቶቻችንን ይመልከቱ።"
                    : "Visit our Entoto center near St. Raguel Church to witness our food prep, psychiatric care, and vocational training firsthand."}
                </p>
              </div>

              {/* Feature bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { en: "Medical Clinic Tour", am: "የህክምናና ስነ-ልቦና ክፍሎች" },
                  { en: "Kitchen Operations", am: "የምግብ ማዘጋጃ ክፍል" },
                ].map(item => (
                  <div key={item.en} className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-brand-sky-50 flex items-center justify-center shrink-0 text-brand-sky-500 border border-brand-sky-100 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-brand-sky-950">{language === "am" ? item.am : item.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-sky-500 shrink-0" />
                <span>{language === "am" ? "እንጦጦ ራጉኤል፣ አዲስ አበባ" : "Near Entoto St. Raguel Church, Addis Ababa"}</span>
              </div>
              <button onClick={openModal}
                className="py-3 px-6 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl cursor-pointer shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 shrink-0">
                <CalendarIcon className="w-4 h-4" />
                {language === "am" ? "ቀጠሮ ይያዙ" : "Book Guided Visit"}
              </button>
            </div>
          </motion.div>

          {/* Guidelines card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-4 bg-brand-sky-950 text-white rounded-3xl p-8 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-sky-900 border border-brand-sky-800 text-brand-yellow-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-xl font-bold text-white">{language === "am" ? "የጉብኝት መመሪያዎች" : "Visiting Guidelines"}</h4>
              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-brand-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{language === "am" ? "የስራ ሰዓት" : "Visiting Hours"}</strong>
                    <span>{language === "am" ? "ሰኞ - ቅዳሜ፡ ጠዋቱ 9:00 - ቀኑ 5:00" : "Mon - Sat: 9:00 AM - 5:00 PM"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-brand-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{language === "am" ? "ግለሰቦችና ድርጅቶች" : "Individuals & Orgs"}</strong>
                    <span>{language === "am" ? "ግለሰቦችና ድርጅቶች ይቀበላሉ" : "Both individual and group visits welcomed"}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{language === "am" ? "ቀጥታ ስልክ" : "Direct Hotline"}</strong>
                    <a href="tel:+251911004903" className="text-brand-yellow-400 hover:underline font-bold">+251 911 004 903</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-brand-sky-900">
              <span className="text-[10px] text-gray-400 block">
                {language === "am"
                  ? "አስተባባሪዎቻችን ቀጠሮዎን ካረጋገጡ በኋላ ይደውሉልዎታል።"
                  : "Our coordinators will call to confirm your slot before arrival."}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-sky-950/40 backdrop-blur-sm" />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative border border-brand-sky-100 max-h-[90vh] overflow-y-auto z-10 p-6 md:p-8">

              <button onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer">
                <X className="w-4 h-4" />
              </button>

              {submittedBooking ? (
                /* ── Success screen ── */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-brand-sky-100 text-brand-sky-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-sky-600 bg-brand-sky-50 px-2.5 py-1 rounded-lg border border-brand-sky-200">
                    Ref: {(submittedBooking as any).id}
                  </span>
                  <h3 className="font-serif text-2xl font-black text-brand-sky-950">
                    {language === "am" ? "ቀጠሮዎ ተቀብሎ ተመዝግቧል!" : "Visit Request Registered!"}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    {language === "am"
                      ? `እናመሰግናለን ${submittedBooking.name}! አስተባባሪዎቻችን ቅርቡ ይደውሉልዎታል።`
                      : `Thank you, ${submittedBooking.name}! Our team will call ${submittedBooking.phone} to confirm your ${submittedBooking.date} (${submittedBooking.timeSlot}) visit.`}
                  </p>
                  <button onClick={() => setIsModalOpen(false)}
                    className="w-full py-3 bg-brand-sky-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-brand-sky-500 transition-all">
                    {language === "am" ? "ዝጋ" : "Close"}
                  </button>
                </div>
              ) : (
                /* ── Booking form ── */
                <>
                  <div className="mb-6 pr-8">
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-sky-500 block mb-1">
                      {language === "am" ? "የሰሊሆም ማህበር ጉብኝት" : "Selihom Guided Tour"}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-sky-950">
                      {language === "am" ? "ቀጠሮ ይያዙ" : "Book Your Visit"}
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
                      </div>
                    )}

                    {/* ── Contact type toggle ── */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                        {language === "am" ? "የጎብኚ አይነት" : "Visitor Type"}
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setContactType("individual")}
                          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            contactType === "individual" ? "bg-white text-brand-sky-950 shadow-xs border border-gray-200 font-extrabold" : "text-gray-600 hover:text-gray-900"
                          }`}>
                          <User className="w-3.5 h-3.5 text-brand-sky-500" />
                          <span>{language === "am" ? "ግለሰብ / ቤተሰብ" : "Individual / Family"}</span>
                        </button>
                        <button type="button" onClick={() => setContactType("organization")}
                          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            contactType === "organization" ? "bg-white text-brand-sky-950 shadow-xs border border-gray-200 font-extrabold" : "text-gray-600 hover:text-gray-900"
                          }`}>
                          <Building2 className="w-3.5 h-3.5 text-brand-sky-500" />
                          <span>{language === "am" ? "ድርጅት / ቡድን" : "Organization / Group"}</span>
                        </button>
                      </div>
                    </div>

                    {/* ── Contact fields ── */}
                    <div className="space-y-2.5">
                      <input type="text" required value={name} onChange={e => setName(e.target.value)}
                        placeholder={language === "am" ? "ሙሉ ስም *" : "Full Name *"}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-400 outline-none font-medium" />

                      {contactType === "organization" && (
                        <input type="text" required value={orgName} onChange={e => setOrgName(e.target.value)}
                          placeholder={language === "am" ? "ድርጅቱ ስም *" : "Organization Name *"}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-400 outline-none font-medium" />
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                          placeholder={language === "am" ? "ስልክ ቁጥር *" : "Phone Number *"}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-400 outline-none font-medium" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                          placeholder={language === "am" ? "ኢሜይል (አማራጭ)" : "Email (Optional)"}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-400 outline-none font-medium" />
                      </div>

                      {contactType === "organization" && (
                        <div className="bg-brand-sky-50 border border-brand-sky-100 rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-brand-sky-950 block">{language === "am" ? "የጎብኚዎች ብዛት" : "Number of Visitors"}</span>
                            <span className="text-[10px] text-gray-500">{language === "am" ? "እስከ 50 ሰዎች" : "Up to 50 people"}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                            <button type="button" onClick={() => setVisitorCount(Math.max(2, visitorCount - 1))}
                              className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center cursor-pointer text-xs">-</button>
                            <span className="text-xs font-extrabold text-brand-sky-950 min-w-[24px] text-center">{visitorCount}</span>
                            <button type="button" onClick={() => setVisitorCount(Math.min(50, visitorCount + 1))}
                              className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center cursor-pointer text-xs">+</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Available slots ── */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                        {language === "am" ? "ክፍት ጊዜ ቦታ ይምረጡ *" : "Select an Available Slot *"}
                      </label>

                      {slotsLoading && (
                        <div className="flex items-center justify-center py-8 text-brand-sky-400 gap-2 text-xs font-medium">
                          <LoadingDots />
                          <span>{language === "am" ? "ጊዜ ቦታዎችን በማምጣት ላይ..." : "Loading available slots..."}</span>
                        </div>
                      )}

                      {slotsError && (
                        <div className="text-center py-6 text-xs text-red-600 bg-red-50 rounded-xl border border-red-200">
                          {language === "am" ? "ጊዜ ቦታዎችን ማምጣት አልተቻለም።" : "Could not load slots. Please try again or call us directly."}
                        </div>
                      )}

                      {!slotsLoading && !slotsError && Object.keys(slotsByDate).length === 0 && (
                        <div className="text-center py-8 space-y-2">
                          <div className="w-12 h-12 bg-brand-sky-50 rounded-2xl flex items-center justify-center mx-auto">
                            <CalendarIcon className="w-6 h-6 text-brand-sky-400" />
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            {language === "am"
                              ? "በአሁኑ ጊዜ ክፍት ቦታ የለም። ቀጥታ ይደውሉ።"
                              : "No available slots right now. Please call us directly to arrange a visit."}
                          </p>
                          <a href="tel:+251911004903" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-sky-500 hover:underline">
                            <Phone className="w-3.5 h-3.5" /> +251 911 004 903
                          </a>
                        </div>
                      )}

                      {!slotsLoading && !slotsError && Object.keys(slotsByDate).length > 0 && (
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                          {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                            <div key={date}>
                              <p className="text-[10px] font-black uppercase tracking-widest text-brand-sky-600 mb-2">{date}</p>
                              <div className="space-y-2">
                                {dateSlots.map(slot => {
                                  const left = spotsLeft(slot);
                                  const isSelected = selectedSlotId === slot.id;
                                  const almostFull = left <= 3;
                                  return (
                                    <button key={slot.id} type="button" onClick={() => setSelectedSlotId(slot.id)}
                                      className={`w-full p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                        isSelected
                                          ? "border-brand-sky-400 bg-brand-sky-50 ring-1 ring-brand-sky-400"
                                          : "border-gray-200 bg-gray-50 hover:border-brand-sky-300 hover:bg-white"
                                      }`}>
                                      <div className="flex items-center gap-2.5">
                                        <Clock className={`w-4 h-4 shrink-0 ${isSelected ? "text-brand-sky-500" : "text-gray-400"}`} />
                                        <div>
                                          <span className="text-xs font-bold text-brand-sky-950 block">
                                            {slot.startTime} – {slot.endTime}
                                          </span>
                                          {slot.label && (
                                            <span className="text-[10px] text-gray-500">{slot.label}</span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                          almostFull
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-brand-sky-100 text-brand-sky-700"
                                        }`}>
                                          {left} {language === "am" ? "ቦታ ቀሩ" : "spots left"}
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder={language === "am" ? "ማስታወሻ (አማራጭ)" : "Notes / Special Request (Optional)"}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-400 outline-none font-medium" />

                    {/* Selected slot summary */}
                    {selectedSlot && (
                      <div className="bg-brand-sky-50 border border-brand-sky-200 p-3 rounded-xl text-xs space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-sky-700 block">
                          {language === "am" ? "የተመረጠ ቀጠሮ" : "Selected Slot"}
                        </span>
                        <p className="text-brand-sky-950 font-extrabold flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-brand-sky-500" />
                          {selectedSlot.date} · {selectedSlot.startTime}–{selectedSlot.endTime}
                        </p>
                      </div>
                    )}

                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {isSubmitting
                        ? <LoadingDots label={language === "am" ? "በማስቀመጥ ላይ..." : "Saving..."} className="justify-center" />
                        : <><CalendarIcon className="w-4 h-4" />{language === "am" ? "ቀጠሮ ያስቀምጡ" : "Confirm Visit Request"}</>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
