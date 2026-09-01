import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Users,
  Check,
  MapPin,
  Info,
  X,
  CheckCircle2,
  Phone
} from "lucide-react";
import { Booking } from "../types";
import { TIME_SLOTS } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { saveBooking } from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";
import { DotGridPattern } from "./Sketches";

export default function BookingSection() {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("individual");
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);

  const [datesList, setDatesList] = useState<{ dateString: string; displayDay: string; displayNum: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const list = [];
    const baseDate = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + i);
      
      if (nextDate.getDay() === 0) continue; // Skip Sundays

      const dayName = nextDate.toLocaleDateString("en-US", { weekday: "short" });
      const dayNum = nextDate.toLocaleDateString("en-US", { day: "numeric" });
      const fullDateStr = nextDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      list.push({
        dateString: fullDateStr,
        displayDay: dayName,
        displayNum: dayNum,
      });
    }

    setDatesList(list);
    if (list.length > 0) {
      setSelectedDate(list[0].dateString);
    }
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanName  = sanitizeText(name, 120);
    const cleanPhone = sanitizePhone(phone);
    const cleanEmail = sanitizeText(email, 120);
    const cleanNotes = sanitizeText(notes, 600);

    if (!isNonEmpty(cleanName)) {
      setErrorMessage(language === "am" ? "ሙሉ ስምዎን ያስገቡ።" : "Please enter your full name.");
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
    if (!selectedDate || !selectedSlot) {
      setErrorMessage(language === "am" ? "እባክዎን ቀኑንና ሰዓቱን ይምረጡ።" : "Please select both a date and a time slot.");
      return;
    }

    setIsSubmitting(true);

    const newBooking: Booking = {
      id: "TKT-" + Math.floor(Math.random() * 900000 + 100000),
      name:  cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      date:      selectedDate,
      timeSlot:  selectedSlot,
      visitType: selectedType as any,
      visitorCount,
      notes:     cleanNotes,
      status:    "pending",
      createdAt: new Date().toLocaleDateString(),
    };

    await saveBooking(newBooking);

    setSubmittedBooking(newBooking);
    setIsSubmitting(false);

    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setVisitorCount(1);
  };

  return (
    <section id="visit" className="py-24 bg-[#FAF8F5] border-t border-brand-sky-100/35 relative overflow-hidden">
      <DotGridPattern />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-extrabold text-brand-sky-950 mb-3 tracking-tight"
          >
            {language === "am" ? "ማዕከላችንን ለመጎብኘት ጊዜ ይያዙ" : "Schedule a Guided Visit"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-lg mx-auto"
          >
            {language === "am"
              ? "ማዕከላችንን ድንገት ሳይነግሩን መጎብኘት ዝግጅታችንን ስለሚያስተጓጉል፣ እባክዎን አስቀድመው ጉብኝትዎን ይመዝግቡ። ድርጅታችን የእርስዎን መመደብ አውቆ ዝግጁ ሆኖ ይጠብቅዎታል።"
              : "To prevent unannounced visits and help our shelter staff prepare properly for your arrival, please book your date and time slot in advance."
            }
          </motion.p>
        </div>

        {/* Clean Center Visit Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Main Tour Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-8 bg-white rounded-3xl border border-brand-sky-100 p-8 md:p-10 shadow-md flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-brand-sky-50 text-brand-sky-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <CalendarIcon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                  {language === "am" ? "ክፍት የጉብኝት ማዕከል" : "Guided Center Open Tours"}
                </span>
              </div>
              
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-sky-700 block">
                  {language === "am" ? "የሰሊሆም ማህበር ማዕከል" : "Selihom Rehabilitation Center"}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-brand-sky-950 leading-tight">
                  {language === "am" ? (
                    <>የእንጦጦ ማዕከላችንን <br /><span className="text-brand-sky-700 italic font-normal">በአካል ይጎብኙ</span></>
                  ) : (
                    <>Entoto Center <br /><span className="text-brand-sky-700 italic font-normal">Guided Open Tour</span></>
                  )}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed max-w-lg">
                  {language === "am"
                    ? "የሰሊሆም ማህበር በሮች ለማንኛውም በጎ ፈቃደኛና ደጋፊ ክፍት ናቸው። በቦታው በመገኘት የምግብ ማዘጋጀት፣ የህክምና ድጋፍና የማቋቋም ስራዎቻችንን ይመልከቱ።"
                    : "Our doors are completely open. Visit our Entoto center near St. Raguel Church to witness our medical rehabilitation, food preparation, and skills training firsthand."
                  }
                </p>
              </div>

              {/* Tour Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-brand-sky-50 flex items-center justify-center shrink-0 text-brand-sky-600 border border-brand-sky-100 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-xs text-brand-sky-950 block">
                      {language === "am" ? "የህክምናና የስነ-ልቦና ክፍሎች" : "Medical Clinic Tour"}
                    </strong>
                    <span className="text-[11px] text-gray-500">
                      {language === "am" ? "የአዕምሮ ህሙማን ማገገሚያ ቦታዎችን ይጎብኙ" : "Inspect psychiatric recovery & medical rooms"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-brand-sky-50 flex items-center justify-center shrink-0 text-brand-sky-600 border border-brand-sky-100 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="text-xs text-brand-sky-950 block">
                      {language === "am" ? "የምግብ ማዘጋጃ ክፍል" : "Kitchen Operations"}
                    </strong>
                    <span className="text-[11px] text-gray-500">
                      {language === "am" ? "ለአረጋውያንና ህጻናት የሚዘጋጀውን ምግብ ይመልከቱ" : "Observe food preparation for beneficiaries"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-sky-600 shrink-0" />
                <span>{language === "am" ? "እንጦጦ ራጉኤል ቤተክርስቲያን አቅራቢያ፣ አዲስ አበባ" : "Location: Near Entoto St. Raguel Church, Addis Ababa"}</span>
              </div>
              <button
                onClick={() => { setSubmittedBooking(null); setIsModalOpen(true); }}
                className="py-3 px-6 bg-brand-sky-600 hover:bg-brand-sky-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl cursor-pointer shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-98 shrink-0"
              >
                <CalendarIcon className="w-4 h-4" />
                {language === "am" ? "የጉብኝት ጊዜ ይያዙ" : "Book Guided Visit"}
              </button>
            </div>
          </motion.div>

          {/* Visitor Information & Guidelines Side Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 bg-brand-sky-950 text-white rounded-3xl p-8 shadow-md flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-sky-900 border border-brand-sky-800 text-brand-yellow-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>

              <h4 className="font-serif text-xl font-bold text-white">
                {language === "am" ? "የጉብኝት መመሪያዎች" : "Visiting Guidelines"}
              </h4>

              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-brand-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{language === "am" ? "የስራ ሰዓት" : "Visiting Hours"}</strong>
                    <span>{language === "am" ? "ሰኞ - ቅዳሜ፡ ከጠዋቱ 3:00 እስከ ቀኑ 11:00" : "Mon - Sat: 9:00 AM - 5:00 PM"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-brand-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{language === "am" ? "የቡድን ጉብኝቶች" : "Group Visits"}</strong>
                    <span>{language === "am" ? "ለተማሪዎችና ለድርጅቶች የቡድን ጉብኝት ይቻላል" : "Individual & group visits welcomed"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-brand-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">{language === "am" ? "ቀጥታ ስልክ" : "Direct Hotline"}</strong>
                    <a href="tel:+251911242371" className="text-brand-yellow-400 hover:underline font-bold">
                      +251 911 24 23 71
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-sky-900">
              <span className="text-[10px] text-gray-400 block">
                {language === "am"
                  ? "ማስታወሻ፡ የማህበሩ አስተባባሪዎች ያስመዘገቡትን ሰዓት ተመልክተው በስልክ ያረጋግጡልዎታል።"
                  : "Note: Center coordinators will review your requested time slot and confirm via phone prior to your arrival."
                }
              </span>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Modal Popup for Scheduling Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-sky-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative border border-gray-100 max-h-[85vh] overflow-y-auto z-10 p-6 md:p-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {submittedBooking ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-brand-sky-700 bg-brand-sky-50 px-2.5 py-1 rounded-lg border border-brand-sky-200">
                      Ref ID: {submittedBooking.id}
                    </span>
                    <h3 className="font-serif text-2xl font-black text-brand-sky-950 mt-3">
                      {language === "am" ? "የጉብኝት ጥያቄዎ ተመዝግቧል!" : "Visit Request Registered!"}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {language === "am"
                      ? `እናመሰግናለን ${submittedBooking.name}! የማህበራችን አስተባባሪዎች በ${submittedBooking.phone} ደውለው ጉብኝትዎን ያረጋግጡልዎታል።`
                      : `Thank you, ${submittedBooking.name}! Our coordination team will review your requested time for ${submittedBooking.date} (${submittedBooking.timeSlot}) and confirm via ${submittedBooking.phone}.`
                    }
                  </p>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-3 bg-brand-sky-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-brand-sky-900 transition-all"
                    >
                      {language === "am" ? "ተመለስ" : "Close Confirmation"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6 pr-8">
                    <span className="text-[9px] uppercase tracking-widest font-extrabold text-brand-sky-700 block mb-1">
                      {language === "am" ? "የሰሊሆም ማህበር ጉብኝት" : "Selihom Guided Tour"}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-sky-950">
                      {language === "am" ? "የጉብኝት ጊዜ መምረጫ" : "Schedule Entry Window"}
                    </h3>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                        <Info className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Visit Type Segmented Control */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        {language === "am" ? "የጉብኝት አይነት" : "Visit Category"}
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => { setSelectedType("individual"); setVisitorCount(1); }}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            selectedType === "individual"
                              ? "bg-white text-brand-sky-950 shadow-xs border border-gray-200 font-extrabold"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <User className="w-3.5 h-3.5 text-brand-sky-700" />
                          <span>{language === "am" ? "የግል / ቤተሰብ" : "Individual / Family"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSelectedType("corporate"); if (visitorCount < 2) setVisitorCount(5); }}
                          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            selectedType === "corporate"
                              ? "bg-white text-brand-sky-950 shadow-xs border border-gray-200 font-extrabold"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <Users className="w-3.5 h-3.5 text-brand-sky-700" />
                          <span>{language === "am" ? "የድርጅት / የቡድን" : "Group / Corporate"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Date Picker Section with Quick Date Chips & Native Date Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                          {language === "am" ? "የጉብኝት ቀን ይምረጡ" : "Select Tour Date"}
                        </label>
                        {selectedDate && (
                          <span className="text-[10px] font-bold text-brand-sky-800 bg-brand-sky-50 px-2 py-0.5 rounded border border-brand-sky-200">
                            {selectedDate}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {/* Quick Date Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin">
                          {datesList.map((d, index) => (
                            <button
                              key={d.dateString}
                              type="button"
                              onClick={() => setSelectedDate(d.dateString)}
                              className={`min-w-[62px] py-2 px-2 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 ${
                                selectedDate === d.dateString
                                  ? "bg-brand-sky-600 text-white font-extrabold border-brand-sky-700 shadow-sm scale-102"
                                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                              }`}
                            >
                              <span className="text-[9px] uppercase font-bold tracking-wider opacity-90">
                                {index === 0 ? (language === "am" ? "ነገ" : "Tomorrow") : d.displayDay}
                              </span>
                              <span className="text-sm font-black">{d.displayNum}</span>
                            </button>
                          ))}
                        </div>

                        {/* Custom Date Input Fallback */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] text-gray-500 font-medium">
                            {language === "am" ? "ወይም የተለየ ቀን ይምረጡ፦" : "Or pick specific calendar date:"}
                          </span>
                          <input
                            type="date"
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const picked = new Date(e.target.value + "T00:00:00");
                              const formatted = picked.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                              setSelectedDate(formatted);
                            }}
                            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-800 cursor-pointer focus:bg-white focus:border-brand-sky-600 outline-none font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time Slot Selection */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        {language === "am" ? "የጉብኝት ሰዓት ይምረጡ" : "Choose Time Slot"}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = selectedSlot === slot;
                          const isMorning = slot.includes("AM");
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-2 ${
                                isSelected
                                  ? "border-brand-sky-600 bg-brand-sky-50 text-brand-sky-950 font-extrabold shadow-xs ring-1 ring-brand-sky-500"
                                  : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className={`w-4 h-4 shrink-0 ${isSelected ? "text-brand-sky-700" : "text-gray-400"}`} />
                                <span className="text-xs font-bold">{slot}</span>
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                isMorning ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"
                              }`}>
                                {isMorning ? "Morning" : "Afternoon"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Visitor Count for Corporate/Group */}
                    {selectedType === "corporate" && (
                      <div className="bg-brand-sky-50/50 p-3 rounded-xl border border-brand-sky-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-brand-sky-950 block">
                            {language === "am" ? "የጎብኝዎች ብዛት" : "Number of Visitors in Group"}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {language === "am" ? "እስከ 30 ሰዎች መመደብ ይቻላል" : "Up to 30 people per group slot"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => setVisitorCount(Math.max(2, visitorCount - 1))}
                            className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center cursor-pointer text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-extrabold text-brand-sky-950 min-w-[20px] text-center">
                            {visitorCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVisitorCount(Math.min(30, visitorCount + 1))}
                            className="w-6 h-6 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 flex items-center justify-center cursor-pointer text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Contact Information Fields */}
                    <div className="space-y-2.5 pt-1">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder={language === "am" ? "ሙሉ ስም *" : "Full Name *"}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-600 outline-none font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="tel"
                          required
                          placeholder={language === "am" ? "ስልክ ቁጥር *" : "Phone Number *"}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-600 outline-none font-medium"
                        />
                        <input
                          type="email"
                          placeholder={language === "am" ? "ኢሜይል (አማራጭ)" : "Email (Optional)"}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-600 outline-none font-medium"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder={language === "am" ? "ለማስተባበሪያ ማስታወሻ (ለምሳሌ፡ ቁሳቁስ ልገሳ) - አማራጭ" : "Notes / Special Request (Optional)"}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-brand-sky-950 focus:bg-white focus:border-brand-sky-600 outline-none font-medium"
                      />
                    </div>

                    {/* Schedule Live Preview Summary */}
                    {selectedDate && selectedSlot && (
                      <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 block">
                          {language === "am" ? "የተመረጠው የጉብኝት ማጠቃለያ" : "Tour Request Summary"}
                        </span>
                        <p className="text-brand-sky-950 font-extrabold flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-brand-sky-700" />
                          <span>{selectedDate} • {selectedSlot}</span>
                        </p>
                        <p className="text-gray-600 text-[11px] font-medium">
                          {selectedType === "corporate" ? `Group Visit (${visitorCount} visitors)` : "Individual / Family Visit"}
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-brand-sky-600 hover:bg-brand-sky-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      {isSubmitting ? "Processing..." : (language === "am" ? "የጉብኝት ጊዜውን መዝግብ" : "Confirm & Submit Visit Request")}
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
