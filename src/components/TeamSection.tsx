import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Briefcase,
  Award,
  CheckCircle2,
  Users,
  Scale,
  Megaphone,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SELIHOM_GOVERNANCE } from "../data";

import founderImg from "../assets/images/charity-owner.jpg";
import person1Img from "../assets/images/person1.jpg";
import person2Img from "../assets/images/person2.jpg";
import person3Img from "../assets/images/person3.jpg";
import person4Img from "../assets/images/person4.jpg";

export default function TeamSection() {
  const { language, t } = useLanguage();
  const [activeTier, setActiveTier] = useState<"all" | "board" | "departments">("all");

  const boardIcons = [ShieldCheck, Scale, Stethoscope];
  const departmentIcons: Record<string, React.ComponentType<any>> = {
    "dept-finance": ShieldCheck,
    "dept-clinical": Stethoscope,
    "dept-shelter": HeartHandshake,
    "dept-marketing": Megaphone,
    "dept-vocational": Briefcase,
    "dept-volunteer": Users,
  };

  const departmentImages: Record<string, string> = {
    "dept-finance": person3Img,
    "dept-clinical": person1Img,
    "dept-shelter": person2Img,
    "dept-marketing": person4Img,
    "dept-vocational": person4Img,
    "dept-volunteer": person1Img,
  };

  return (
    <section id="team" className="py-24 bg-gray-50/60 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-sky-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-green-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3"
          >
            {language === "am" ? "አመራርና መልካም አስተዳደር" : "Leadership & Governance"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4"
          >
            {language === "am" ? "የሰሊሆም ቡድን እና የአመራር መዋቅር" : "Team & Organizational Governance"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base leading-relaxed"
          >
            {language === "am"
              ? "የሰሊሆም ማህበር የሚመራው በቁርጠኛ መስራች፣ በአማካሪ ቦርድ አባላትና በሙያተኞች የጋራ አገልጋይነት ነው።"
              : "Structured for transparency, medical excellence, and accountable leadership across all operations."}
          </motion.p>

          {/* Tier filter pills */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setActiveTier("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTier === "all"
                  ? "bg-brand-sky-400 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-sky-300"
              }`}
            >
              {language === "am" ? "ሙሉ መዋቅር" : "Complete Structure"}
            </button>
            <button
              onClick={() => setActiveTier("board")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTier === "board"
                  ? "bg-brand-sky-400 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-sky-300"
              }`}
            >
              {language === "am" ? "የአማካሪ ቦርድ" : "Advisory Board"}
            </button>
            <button
              onClick={() => setActiveTier("departments")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTier === "departments"
                  ? "bg-brand-sky-400 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-sky-300"
              }`}
            >
              {language === "am" ? "የስራ አስፈጻሚ ክፍሎች" : "Executive Department Leads"}
            </button>
          </div>
        </div>

        {/* ── Tier 1: Founder & General Manager Feature Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-brand-sky-100 rounded-3xl p-6 sm:p-10 shadow-md mb-14 overflow-hidden relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Founder Image */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-56 h-64 sm:w-64 sm:h-72 rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-4 ring-brand-sky-100 group">
                <img
                  src={founderImg}
                  alt={t(SELIHOM_GOVERNANCE.founder.name)}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-sky-400">
                    {language === "am" ? "መስራች" : "Founder"}
                  </span>
                </div>
              </div>
            </div>

            {/* Founder Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sky-50 text-brand-sky-600 text-xs font-bold border border-brand-sky-200">
                  <Award className="w-3.5 h-3.5" />
                  <span>{t(SELIHOM_GOVERNANCE.founder.title)}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-sky-950">
                  {t(SELIHOM_GOVERNANCE.founder.name)}
                </h3>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {t(SELIHOM_GOVERNANCE.founder.bio)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-sky-950 bg-brand-sky-50/60 p-2.5 rounded-xl border border-brand-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-sky-500 shrink-0" />
                  <span>{language === "am" ? "ቀጥተኛና ተጨባጭ እርዳታ" : "Direct & measurable street impact"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-brand-sky-950 bg-brand-sky-50/60 p-2.5 rounded-xl border border-brand-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-500 shrink-0" />
                  <span>{language === "am" ? "የበር ከፈታ ፖሊሲና ግልጽነት" : "Open door policy & transparent reporting"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Tier 2: Advisory Board & Governance (shown on 'all' or 'board') ── */}
        {(activeTier === "all" || activeTier === "board") && (
          <div className="mb-14 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200/80 pb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center font-black text-xs">
                II
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-brand-sky-950">
                  {language === "am" ? "የአስተዳደርና አማካሪ ቦርድ" : "Advisory Board & Honorary Patrons"}
                </h3>
                <p className="text-xs text-gray-500">
                  {language === "am"
                    ? "የስትራቴጂካዊ አመራር፣ የህግ ተገዢነትና የክሊኒካል ጥራት አማካሪዎች"
                    : "Strategic guidance, legal compliance, and clinical psychiatric oversight"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SELIHOM_GOVERNANCE.board.map((item, idx) => {
                const Icon = boardIcons[idx % boardIcons.length];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-3xl p-6 border-2 border-brand-sky-100 hover:border-brand-sky-300 shadow-xs hover:shadow-lg transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-brand-sky-50 border border-brand-sky-200 flex items-center justify-center text-brand-sky-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand-sky-50 text-brand-sky-700 border border-brand-sky-200">
                        {language === "am" ? "ቦርድ" : "Board"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-lg text-brand-sky-950">
                        {t(item.name)}
                      </h4>
                      <p className="text-xs font-black text-brand-sky-600 uppercase tracking-wide mt-0.5">
                        {t(item.role)}
                      </p>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed pt-1">
                      {t(item.desc)}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tier 3: Executive Department Leads (shown on 'all' or 'departments') ── */}
        {(activeTier === "all" || activeTier === "departments") && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200/80 pb-3">
              <div className="w-8 h-8 rounded-xl bg-brand-green-100 text-brand-green-700 flex items-center justify-center font-black text-xs">
                III
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-brand-sky-950">
                  {language === "am" ? "የስራ አስፈጻሚ ክፍሎች" : "Executive Department Leads"}
                </h3>
                <p className="text-xs text-gray-500">
                  {language === "am"
                    ? "የዕለት ተዕለት የማዕከል አስተዳደር፣ የፋይናንስ ግልጽነትና የተጠቃሚዎች እንክብካቤ መሪዎች"
                    : "Day-to-day residential management, financial transparency, and clinical coordinators"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SELIHOM_GOVERNANCE.departments.map((dept, idx) => {
                const Icon = departmentIcons[dept.id] || Briefcase;
                const img = departmentImages[dept.id] || person1Img;
                const name = t(dept.name);
                const role = t(dept.role);
                const desc = t(dept.desc);

                return (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="bg-white border-2 border-gray-100 hover:border-brand-sky-300 rounded-3xl p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Photo */}
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                      <img
                        src={img}
                        alt={name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-brand-sky-600 shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col space-y-1.5">
                      <h4 className="font-serif font-bold text-lg text-brand-sky-950 group-hover:text-brand-sky-600 transition-colors">
                        {name}
                      </h4>
                      <p className="text-xs font-black text-brand-sky-500 uppercase tracking-wider">
                        {role}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed flex-1 pt-1">
                        {desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
