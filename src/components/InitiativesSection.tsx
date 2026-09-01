import React from "react";
import { motion } from "motion/react";
import {
  Stethoscope, Home, GraduationCap, Briefcase,
  CheckCircle2, HeartPulse, HeartHandshake, BookOpen, Wrench,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// ── Per-card visual theme: accent colour + background illustration colour ──
const CARD_THEMES = [
  {
    // Mental health — sky blue
    bg:         "bg-brand-sky-400",
    bgLight:    "bg-brand-sky-50",
    border:     "border-brand-sky-200",
    hoverBorder:"hover:border-brand-sky-400",
    iconBg:     "bg-white/25",
    iconColor:  "text-white",
    tag:        "bg-white/20 text-white border-white/30",
    check:      "text-brand-sky-500",
    checkRow:   "bg-brand-sky-50 border-brand-sky-100",
    titleHover: "group-hover:text-brand-sky-500",
    IllustIcon: HeartPulse,
  },
  {
    // Elderly — green
    bg:         "bg-brand-green-400",
    bgLight:    "bg-brand-green-50",
    border:     "border-brand-green-200",
    hoverBorder:"hover:border-brand-green-400",
    iconBg:     "bg-white/25",
    iconColor:  "text-white",
    tag:        "bg-white/20 text-white border-white/30",
    check:      "text-brand-green-500",
    checkRow:   "bg-brand-green-50 border-brand-green-100",
    titleHover: "group-hover:text-brand-green-500",
    IllustIcon: HeartHandshake,
  },
  {
    // Children — yellow
    bg:         "bg-brand-yellow-400",
    bgLight:    "bg-brand-yellow-50",
    border:     "border-brand-yellow-200",
    hoverBorder:"hover:border-brand-yellow-400",
    iconBg:     "bg-white/25",
    iconColor:  "text-white",
    tag:        "bg-white/20 text-white border-white/30",
    check:      "text-brand-yellow-600",
    checkRow:   "bg-brand-yellow-50 border-brand-yellow-100",
    titleHover: "group-hover:text-brand-yellow-600",
    IllustIcon: BookOpen,
  },
  {
    // Skills — orange
    bg:         "bg-brand-orange-400",
    bgLight:    "bg-brand-orange-50",
    border:     "border-brand-orange-200",
    hoverBorder:"hover:border-brand-orange-400",
    iconBg:     "bg-white/25",
    iconColor:  "text-white",
    tag:        "bg-white/20 text-white border-white/30",
    check:      "text-brand-orange-500",
    checkRow:   "bg-brand-orange-50 border-brand-orange-100",
    titleHover: "group-hover:text-brand-orange-500",
    IllustIcon: Wrench,
  },
];

const CARD_DATA = [
  {
    id:      "mental-health",
    MainIcon: Stethoscope,
    amTitle: "የአዕምሮ ህክምናና ተሃድሶ",
    enTitle: "Mental Healthcare & Rescue",
    amDesc:  "ከጎዳና ህሙማንን በማንሳት ሁለንተናዊ ህክምናና ተሃድሶ እንሰጣለን።",
    enDesc:  "Rescuing individuals with mental illness from the streets and providing full psychiatric care and rehabilitation.",
    amPoints: ["ከጎዳና ማንሳትና ንጹህ መጠለያ", "ዕለታዊ ህክምና ክትትል"],
    enPoints: ["Street rescue & clean shelter", "Daily psychiatric care"],
    tagAm: "ህክምናና ተሃድሶ",
    tagEn: "Psychiatric Care",
  },
  {
    id:      "elderly-support",
    MainIcon: Home,
    amTitle: "የአዛውንቶች እንክብካቤ",
    enTitle: "Elderly Care & Nutrition",
    amDesc:  "ተንከባካቢ የሌላቸው አዛውንቶች ምግብ፣ ህክምናና ፍቅር ይሰጣቸዋሉ።",
    enDesc:  "Providing warm meals, medical support, and dignity to abandoned senior citizens.",
    amPoints: ["ዕለታዊ ምግብና መጠለያ", "የቤት ህክምናና ድጋፍ"],
    enPoints: ["Nutritious meals & shelter", "In-home medical care"],
    tagAm: "አዛውንቶች",
    tagEn: "Senior Care",
  },
  {
    id:      "children-support",
    MainIcon: GraduationCap,
    amTitle: "የህጻናት ትምህርትና ድጋፍ",
    enTitle: "Child Welfare & Education",
    amDesc:  "ተጋላጭ ህጻናትን ትምህርት፣ ምግብና ሁለንተናዊ ድጋፍ እንሰጣቸዋለን።",
    enDesc:  "Supporting orphaned and vulnerable children with school tuition, meals, and tutoring.",
    amPoints: ["የትምህርት ቁሳቁስ ድጋፍ", "ከትምህርት ጊዜ ውጭ ማጠናከሪያ"],
    enPoints: ["School supplies & backpacks", "After-school tutoring"],
    tagAm: "ህጻናትና ትምህርት",
    tagEn: "Child Welfare",
  },
  {
    id:      "skills-training",
    MainIcon: Briefcase,
    amTitle: "የሙያ ስልጠናና የስራ እድል",
    enTitle: "Vocational Skills & Jobs",
    amDesc:  "ያገገሙ ሰዎችን ሙያ ስልጠና በማብቃት በራሳቸው እንዲቆሙ ማስቻል።",
    enDesc:  "Empowering recovered beneficiaries with practical job skills for financial independence.",
    amPoints: ["ሙያ ስልጠናዎች", "የስራ ማስጀመሪያ ድጋፍ"],
    enPoints: ["Practical trade training", "Seed equipment kits"],
    tagAm: "የሙያ ስልጠና",
    tagEn: "Job Placement",
  },
];

export default function InitiativesSection() {
  const { language } = useLanguage();

  return (
    <section id="initiatives" className="py-24 bg-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-sky-50/80 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-yellow-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "አገልግሎቶቻችን" : "Our Services"}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4">
            {language === "am" ? "የምናቀርባቸው አገልግሎቶች" : "Our Services & Initiatives"}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-medium">
            {language === "am"
              ? "ሁሉ አቀፍ ድጋፍ — ህክምና፣ አዛውንቶች፣ ህጻናት እና ሙያ ስልጠና።"
              : "Comprehensive support: psychiatric care, elderly housing, child education, and vocational skills."}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CARD_DATA.map((item, idx) => {
            const theme      = CARD_THEMES[idx];
            const Icon       = item.MainIcon;
            const IllustIcon = theme.IllustIcon;
            const title  = language === "am" ? item.amTitle  : item.enTitle;
            const desc   = language === "am" ? item.amDesc   : item.enDesc;
            const points = language === "am" ? item.amPoints : item.enPoints;
            const tag    = language === "am" ? item.tagAm    : item.tagEn;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className={`bg-white border-2 ${theme.border} ${theme.hoverBorder} rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col group`}
              >
                {/* ── Illustrated header block (replaces image) ── */}
                <div className={`relative ${theme.bg} h-44 flex items-center justify-center overflow-hidden`}>
                  {/* Large faded background icon as texture */}
                  <IllustIcon className="absolute opacity-10 w-40 h-40 text-white" strokeWidth={1} />

                  {/* Centred icon badge */}
                  <div className={`relative z-10 w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-lg border border-white/20`}>
                    <Icon className={`w-8 h-8 stroke-[2] ${theme.iconColor}`} />
                  </div>

                  {/* Category tag — bottom left */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${theme.tag}`}>
                      {tag}
                    </span>
                  </div>

                  {/* Subtle wave divider at the bottom */}
                  <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 20" preserveAspectRatio="none" fill="white">
                    <path d="M0,20 C100,0 300,20 400,0 L400,20 Z" />
                  </svg>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 flex flex-col p-6 space-y-4">
                  <h3 className={`font-serif font-bold text-xl text-brand-sky-950 leading-tight ${theme.titleHover} transition-colors`}>
                    {title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed flex-1">
                    {desc}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    {points.map((pt, pIdx) => (
                      <div key={pIdx} className={`flex items-start gap-2 text-xs font-semibold text-brand-sky-950 ${theme.checkRow} p-2 rounded-xl border`}>
                        <CheckCircle2 className={`w-4 h-4 ${theme.check} shrink-0 mt-0.5`} />
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
