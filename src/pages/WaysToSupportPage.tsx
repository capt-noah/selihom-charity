import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Heart,
  Package,
  Pill,
  Cake,
  Users,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SuppliesPledge from "../components/SuppliesPledge";
import MedicinePledge from "../components/MedicinePledge";
import DonateSection from "../components/DonateSection";
import BookingSection from "../components/BookingSection";
import GetInvolvedSection from "../components/GetInvolvedSection";

export default function WaysToSupportPage() {
  const { language, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [activePathway, setActivePathway] = useState<
    "all" | "money" | "supplies" | "medicine" | "events" | "volunteer"
  >("all");

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash === "money" || hash === "donate") setActivePathway("money");
    else if (hash === "supplies") setActivePathway("supplies");
    else if (hash === "medicine") setActivePathway("medicine");
    else if (hash === "events") setActivePathway("events");
    else if (hash === "volunteer") setActivePathway("volunteer");
  }, [location.hash]);

  const pathways = [
    {
      id: "all",
      label: { am: "ሁሉንም መንገዶች", en: "All Ways to Help" },
      icon: Sparkles,
    },
    {
      id: "money",
      label: { am: "የገንዘብ ድጋፍ", en: "Financial Gifts" },
      icon: Heart,
      desc: {
        am: "ባንክና ቴሌብር ቀጥተኛ መዋጮ",
        en: "Bank & Telebirr direct transfers",
      },
    },
    {
      id: "supplies",
      label: { am: "የምግብና ቁሳቁስ ቃልኪዳን", en: "Food & In-Kind Supplies" },
      icon: Package,
      desc: {
        am: "ጤፍ፣ ስንዴ፣ ዘይትና ንጽህና እቃዎች",
        en: "Grains, oil, hygiene items",
      },
    },
    {
      id: "medicine",
      label: { am: "የአዕምሮ መድሃኒት ስፖንሰር", en: "Psychiatric Medicine" },
      icon: Pill,
      desc: {
        am: "48 ወሳኝ የህክምና መድሃኒቶች",
        en: "48 vital clinical prescriptions",
      },
    },
    {
      id: "events",
      label: { am: "የፍቅር ድግስ ማዕድ", en: "Sponsor a Feast" },
      icon: Cake,
      desc: {
        am: "ልደት፣ ሰርግና መታሰቢያ ማዕድ",
        en: "Birthdays, weddings & memorials",
      },
    },
    {
      id: "volunteer",
      label: { am: "በጎ ፈቃደኝነት", en: "Volunteer Shifts" },
      icon: Users,
      desc: {
        am: "የኩሽና፣ የህክምናና ሙያ ድጋፍ",
        en: "Kitchen, medical & tutoring",
      },
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50/50">
      {/* ── Page Hero ── */}
      <section className="bg-gradient-to-b from-brand-sky-50/80 via-white to-gray-50/50 py-16 sm:py-20 border-b border-brand-sky-100/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sky-100 text-brand-sky-700 font-extrabold text-xs uppercase tracking-wider border border-brand-sky-200"
          >
            <ShieldCheck className="w-4 h-4 text-brand-sky-500" />
            {language === "am" ? "የድጋፍ መንገዶች መመሪያ" : "Direct Impact Directory"}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-brand-sky-950 tracking-tight"
          >
            {language === "am"
              ? "የሰሊሆም ማህበርን የሚደግፉባቸው መንገዶች"
              : "Ways to Support Selihom"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
          >
            {language === "am"
              ? "በገንዘብ፣ በምግብ እህሎች፣ በአዕምሮ መድሃኒት፣ በክብረ-በዓላት ማዕድ ወይም በጉልበትና ሙያዎ ተጠቃሚዎቻችንን በክብር መደገፍ ይችላሉ።"
              : "Whether through financial contributions, daily grain supplies, vital psychiatric medicines, celebration feasts, or hands-on volunteering — every contribution restores human dignity."}
          </motion.p>

          {/* ── Interactive Pathway Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto"
          >
            {pathways.map((pw) => {
              const Icon = pw.icon;
              const isActive = activePathway === pw.id;
              return (
                <button
                  key={pw.id}
                  onClick={() => setActivePathway(pw.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                    isActive
                      ? "bg-brand-sky-400 text-white border-brand-sky-500 shadow-md ring-2 ring-brand-sky-200 scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-brand-sky-300 hover:bg-brand-sky-50/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{t(pw.label)}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* 1. Money Donations */}
        {(activePathway === "all" || activePathway === "money") && (
          <div id="money" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-sky-950">
                  {language === "am" ? "የገንዘብ ድጋፍና የባንክ ሂሳቦች" : "1. Direct Financial Support"}
                </h2>
                <p className="text-xs text-gray-500">
                  {language === "am"
                    ? "በ5 ዋና የኢትዮጵያ ባንኮች እና በቴሌብር የዕለት ወጪዎችን ይደግፉ"
                    : "Official bank transfer numbers and Telebirr donation channels"}
                </p>
              </div>
            </div>

            <DonateSection />
          </div>
        )}

        {/* 2. In-Kind Food & Essential Supplies */}
        {(activePathway === "all" || activePathway === "supplies") && (
          <div id="supplies" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-sky-950">
                  {language === "am" ? "የምግብ እህሎችና የቁሳቁስ ቃልኪዳን" : "2. Food Grains & Essential Supplies"}
                </h2>
                <p className="text-xs text-gray-500">
                  {language === "am"
                    ? "ጤፍ፣ ስንዴ፣ ዘይት፣ አልባሳትና የንጽህና መጠበቂያ ቁሳቁሶች (በኪሎ፣ ኩንታልና ካርቶን)"
                    : "Pledge grains, cooking oil, hygiene items, and shelter provisions with live dynamic goal feedback"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-100 shadow-sm">
              <SuppliesPledge />
            </div>
          </div>
        )}

        {/* 3. Psychiatric Medicine */}
        {(activePathway === "all" || activePathway === "medicine") && (
          <div id="medicine" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-sky-950">
                  {language === "am" ? "የአዕምሮ ህክምና መድሃኒቶች ስፖንሰር" : "3. Psychiatric Clinical Medications"}
                </h2>
                <p className="text-xs text-gray-500">
                  {language === "am"
                    ? "ለ400+ የአዕምሮ ህሙማን ዕለታዊ ህክምና የሚያስፈልጉ 48 ወሳኝ መድሃኒቶች"
                    : "Sponsor vital daily psychiatric prescriptions with real-time deficit and surplus monitoring"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-sm">
              <MedicinePledge />
            </div>
          </div>
        )}

        {/* 4. Celebrate & Sponsor Meals */}
        {(activePathway === "all" || activePathway === "events") && (
          <div id="events" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-sky-950">
                  {language === "am" ? "የፍቅር ድግስ ማዕድ ስፖንሰር" : "4. Host or Sponsor a Celebration Feast"}
                </h2>
                <p className="text-xs text-gray-500">
                  {language === "am"
                    ? "ልደትዎን፣ ሰርግዎን ወይም መታሰቢያዎን ከተጠቃሚዎች ጋር በማክበር ማዕድ ያጋሩ"
                    : "Celebrate life milestones by hosting a shared banquet with residents at Entoto"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-100 shadow-sm">
              <BookingSection />
            </div>
          </div>
        )}

        {/* 5. Volunteer Roles & Shifts */}
        {(activePathway === "all" || activePathway === "volunteer") && (
          <div id="volunteer" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-sky-950">
                  {language === "am" ? "በበጎ ፈቃደኝነት መሳተፍ" : "5. Dedicated Volunteer Roles"}
                </h2>
                <p className="text-xs text-gray-500">
                  {language === "am"
                    ? "የወጥ ቤት ዝግጅት፣ የህክምና ድጋፍ፣ ስነ-ልቦና ቴራፒ ወይም የልጆች ትምህርት ማስተማር"
                    : "Apply for kitchen, nursing, psychiatric care, counseling, tutoring, or vocational shifts"}
                </p>
              </div>
            </div>

            <GetInvolvedSection />
          </div>
        )}
      </div>
    </div>
  );
}
