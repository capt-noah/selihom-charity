import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Stethoscope, Home, GraduationCap, Briefcase,
  CheckCircle2, HeartPulse, HeartHandshake, BookOpen, Wrench,
  Cake, Eye, X, ArrowRight, Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

import healthImg from "../assets/images/health_cutout.jpg";
import elderlyImg from "../assets/images/elderly_care.jpg";
import childrenImg from "../assets/images/children_clean.jpg";
import mealsImg from "../assets/images/meals_cutout.jpg";
import skillsImg from "../assets/images/about_cutout_color.jpg";

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
    bg:         "bg-amber-500",
    bgLight:    "bg-amber-50",
    border:     "border-amber-200",
    hoverBorder:"hover:border-amber-400",
    iconBg:     "bg-white/25",
    iconColor:  "text-white",
    tag:        "bg-white/20 text-white border-white/30",
    check:      "text-amber-600",
    checkRow:   "bg-amber-50 border-amber-100",
    titleHover: "group-hover:text-amber-600",
    IllustIcon: BookOpen,
  },
  {
    // Community Feasts & Celebrations — rose
    bg:         "bg-rose-500",
    bgLight:    "bg-rose-50",
    border:     "border-rose-200",
    hoverBorder:"hover:border-rose-400",
    iconBg:     "bg-white/25",
    iconColor:  "text-white",
    tag:        "bg-white/20 text-white border-white/30",
    check:      "text-rose-500",
    checkRow:   "bg-rose-50 border-rose-100",
    titleHover: "group-hover:text-rose-500",
    IllustIcon: Cake,
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
    id:       "mental-health",
    MainIcon: Stethoscope,
    image:    healthImg,
    amTitle:  "የአዕምሮ ህክምናና የጎዳና ተሃድሶ",
    enTitle:  "Mental Healthcare & Street Rescue",
    amDesc:   "ከጎዳና የአዕምሮ ህሙማንን በማንሳት ንጹህ መጠለያ፣ ሁለንተናዊ ህክምናና የስነ-ልቦና ተሃድሶ እንሰጣለን።",
    enDesc:   "Rescuing vulnerable individuals with mental illness from streets, providing clean shelter, psychiatric treatment, and compassionate rehabilitation.",
    amPoints: ["ከጎዳና ማንሳትና ንጹህ መጠለያ", "ዕለታዊ ህክምናና የስነ-ልቦና ክትትል"],
    enPoints: ["Street rescue & secure shelter", "Daily psychiatric & medical care"],
    tagAm:    "ህክምናና ተሃድሶ",
    tagEn:    "Psychiatric Care",
    targetId: "medicine",
  },
  {
    id:       "elderly-support",
    MainIcon: Home,
    image:    elderlyImg,
    amTitle:  "የአዛውንቶች መጠለያና እንክብካቤ",
    enTitle:  "Elderly Care & Safe Shelter",
    amDesc:   "መጠለያ እና ተንከባካቢ የሌላቸውን አረጋውያን ቋሚ መጠለያ፣ አልባሳት፣ ሞቅ ያለ የተመጣጠነ ምግብና ሰብአዊ ክብር እንሰጣቸዋለን።",
    enDesc:   "Providing permanent shelter, warm bedding, nutritious meals, healthcare, and human dignity to abandoned elderly citizens.",
    amPoints: ["ቋሚ ንጹህ መጠለያና ሞቅ ያለ አልጋ", "የተመጣጠነ ምግብና የጤና እንክብካቤ"],
    enPoints: ["Permanent safe housing & warm beds", "Nutritious meals & healthcare"],
    tagAm:    "መጠለያና አዛውንቶች",
    tagEn:    "Housing & Seniors",
    targetId: "supplies",
  },
  {
    id:       "children-support",
    MainIcon: GraduationCap,
    image:    childrenImg,
    amTitle:  "የህጻናት መጠለያ፣ እንክብካቤና ትምህርት",
    enTitle:  "Child Welfare, Housing & Education",
    amDesc:   "ተጋላጭና ወላጅ አልባ ህጻናትን ደህንነቱ የተጠበቀ መጠለያ፣ አልባሳት፣ የተመጣጠነ ምግብና ጥራት ያለው ትምህርት እንሰጣለን።",
    enDesc:   "Supporting vulnerable children with secure shelter, nutritious meals, school tuition, uniforms, and educational mentoring.",
    amPoints: ["ደህንነቱ የተጠበቀ መጠለያና የተመጣጠነ ምግብ", "የትምህርት ክፍያ፣ ዩኒፎርም እና ደብተር"],
    enPoints: ["Safe shelter & daily nutrition", "Tuition, school kits & mentoring"],
    tagAm:    "ህጻናትና መጠለያ",
    tagEn:    "Shelter & Education",
    targetId: "supplies",
  },
  {
    id:       "community-events",
    MainIcon: Cake,
    image:    mealsImg,
    amTitle:  "የማህበረሰብ ማዕድና በዓላት ማክበር",
    enTitle:  "Community Feasts & Celebrations",
    amDesc:   "ልደትዎን፣ ሰርግዎን ወይም መታሰቢያዎን በማዕከላችን ከተጠቃሚዎች ጋር በማክበር የጋራ ፍቅርና ደስታ መፍጠር ይችላሉ።",
    enDesc:   "Host or sponsor communal meals, holiday feasts, birthdays, and memorial banquets directly with residents at Selihom center.",
    amPoints: ["የልደትና የበዓል ማዕድ መጋራት", "የአዳራሽና የምግብ ዝግጅት ድጋፍ"],
    enPoints: ["Holiday feasts & birthday meals", "Full hall & catering logistics"],
    tagAm:    "ማዕድና በዓላት",
    tagEn:    "Feasts & Events",
    targetId: "events",
  },
  {
    id:       "skills-training",
    MainIcon: Briefcase,
    image:    skillsImg,
    amTitle:  "የሙያ ስልጠናና የስራ እድል ፈጠራ",
    enTitle:  "Vocational Skills & Reintegration",
    amDesc:   "ያገገሙ ሰዎችን በልዩ ልዩ የሙያ መስኮች በማሰልጠን ራሳቸውን እንዲችሉና ወደ ማህበረሰቡ በክብር እንዲቀላቀሉ ማስቻል።",
    enDesc:   "Empowering recovered beneficiaries with hands-on vocational trade skills and startup toolkits for dignified financial independence.",
    amPoints: ["የእጅ ሙያ ስልጠናዎች", "የስራ ማስጀመሪያ ቁሳቁስ ድጋፍ"],
    enPoints: ["Practical trade skills & crafts", "Startup tools & reintegration kit"],
    tagAm:    "የሙያ ስልጠና",
    tagEn:    "Job Placement",
    targetId: "supplies",
  },
];

export default function InitiativesSection() {
  const { language } = useLanguage();
  const [selectedInitiative, setSelectedInitiative] = useState<typeof CARD_DATA[0] | null>(null);

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
              ? "ሁሉ አቀፍ ድጋፍ — የአዕምሮ ህክምና፣ የአረጋውያንና የህጻናት መጠለያ፣ የማህበረሰብ ማዕድ እና ሙያ ስልጠና።"
              : "Comprehensive support: psychiatric care, elderly housing, child shelter & education, community feasts, and vocational skills."}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                transition={{ delay: idx * 0.08, duration: 0.45 }}
                onClick={() => setSelectedInitiative(item)}
                className={`bg-white border-2 ${theme.border} ${theme.hoverBorder} rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col group cursor-pointer`}
              >
                {/* ── Illustrated header block ── */}
                <div className={`relative ${theme.bg} h-40 flex items-center justify-center overflow-hidden`}>
                  {/* Large faded background icon as texture */}
                  <IllustIcon className="absolute opacity-15 w-36 h-36 text-white" strokeWidth={1} />

                  {/* Centred icon badge */}
                  <div className={`relative z-10 w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 stroke-[2] ${theme.iconColor}`} />
                  </div>

                  {/* Category tag — bottom left */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${theme.tag}`}>
                      {tag}
                    </span>
                  </div>

                  {/* View photo indicator top right */}
                  <div className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 backdrop-blur-xs text-white p-1.5 rounded-xl transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </div>

                  {/* Subtle wave divider at the bottom */}
                  <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 20" preserveAspectRatio="none" fill="white">
                    <path d="M0,20 C100,0 300,20 400,0 L400,20 Z" />
                  </svg>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 flex flex-col p-5 space-y-3">
                  <h3 className={`font-serif font-bold text-lg text-brand-sky-950 leading-tight ${theme.titleHover} transition-colors line-clamp-2`}>
                    {title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1 line-clamp-3">
                    {desc}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    {points.map((pt, pIdx) => (
                      <div key={pIdx} className={`flex items-start gap-1.5 text-[11px] font-semibold text-brand-sky-950 ${theme.checkRow} p-1.5 rounded-lg border`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${theme.check} shrink-0 mt-0.5`} />
                        <span className="leading-tight">{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInitiative(item);
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-gray-50 hover:bg-brand-sky-50 text-gray-700 hover:text-brand-sky-700 text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-200 hover:border-brand-sky-300 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === "am" ? "ፎቶና ዝርዝር ይመልከቱ" : "View Photos & Details"}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Interactive Program Photo & Details Modal ── */}
      <AnimatePresence>
        {selectedInitiative && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]"
            >
              {/* Photo header */}
              <div className="relative h-64 sm:h-72 w-full bg-gray-900 overflow-hidden">
                <img
                  src={selectedInitiative.image}
                  alt={language === "am" ? selectedInitiative.amTitle : selectedInitiative.enTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedInitiative(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badge & Title over image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-sky-500 text-white mb-2 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    {language === "am" ? selectedInitiative.tagAm : selectedInitiative.tagEn}
                  </span>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl leading-snug drop-shadow-md">
                    {language === "am" ? selectedInitiative.amTitle : selectedInitiative.enTitle}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 overflow-y-auto">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {language === "am" ? selectedInitiative.amDesc : selectedInitiative.enDesc}
                </p>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
                    {language === "am" ? "ቁልፍ የአገልግሎት ክፍሎች" : "Key Program Pillars"}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {(language === "am" ? selectedInitiative.amPoints : selectedInitiative.enPoints).map((pt, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold text-brand-sky-950 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-brand-green-500 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer / Direct CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {selectedInitiative.targetId === "events" ? (
                    <a
                      href="/events"
                      className="flex-1 py-3 px-5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-md transition-colors"
                      onClick={() => setSelectedInitiative(null)}
                    >
                      <Cake className="w-4 h-4" />
                      <span>{language === "am" ? "የበዓል ማዕድ ዝግጅት ያስይዙ" : "Book / Sponsor an Event Feast"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <a
                      href="#supplies"
                      className="flex-1 py-3 px-5 rounded-2xl bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-md transition-colors"
                      onClick={() => setSelectedInitiative(null)}
                    >
                      <span>{language === "am" ? "ለዚህ ፕሮግራም ቁሳቁስ ይለግሱ" : "Pledge Supplies for this Program"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedInitiative(null)}
                    className="py-3 px-5 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                  >
                    {language === "am" ? "ዝጋ" : "Close"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
