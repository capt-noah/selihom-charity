import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Award, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";

import award1Img from "../assets/images/award1.jpg";
import award2Img from "../assets/images/award2.jpg";
import award3Img from "../assets/images/award3.jpg";
import award4Img from "../assets/images/award4.jpg";
import award5Img from "../assets/images/award5.jpg";
import award6Img from "../assets/images/award6.jpg";
import award7Img from "../assets/images/award7.jpg";

interface HeroSlide {
  id: string;
  name:  { am: string; en: string };
  tag:   { am: string; en: string };
  story: { am: string; en: string };
  image: string;
}

const HERO_SLIDES: HeroSlide[] = [
  { id: "s1", image: award1Img,
    name:  { am: "የመንግስት ህጋዊ እውቅና",    en: "Official NGO Certification"    },
    tag:   { am: "ምዝገባ ቁጥር 1113/2019",  en: "Reg No. 1113/2019"             },
    story: { am: "በፌደራል ሲቪል ማህበረሰብ ኤጀንሲ ህጋዊ ምዝገባ።", en: "Officially registered by FDRE Civil Society Organizations Agency." } },
  { id: "s2", image: award2Img,
    name:  { am: "የበጎ አድራጎት የክብር ሽልማት", en: "Distinguished Service Award"   },
    tag:   { am: "የሰብአዊ አገልግሎት",         en: "Humanitarian Honor"            },
    story: { am: "ሺዎችን ከጎዳና በማንሳት የተበረከተ ሽልማት።", en: "Award honouring Selihom's outstanding community impact." } },
  { id: "s3", image: award3Img,
    name:  { am: "ብሄራዊ የሰብአዊ እውቅና",    en: "National Recognition"          },
    tag:   { am: "ብሄራዊ ተጽዕኖ",           en: "National Impact"               },
    story: { am: "ሁለንተናዊ ድጋፍ ለብሄራዊ እውቅና አብቅቶ።", en: "Recognised nationally for holistic rescue and rehabilitation." } },
  { id: "s4", image: award4Img,
    name:  { am: "ታዋቂ እንግዶችና አምባሳደሮች", en: "VIP & Dignitary Visits"        },
    tag:   { am: "የማህበረሰብ አጋርነት",       en: "Community Support"             },
    story: { am: "ታዋቂ ግለሰቦች ሰሊሆምን ጎብኝተው ድጋፍ አደረጉ።", en: "Renowned personalities visiting Selihom Entoto shelter." } },
  { id: "s5", image: award5Img,
    name:  { am: "የሰብአዊ አገልግሎት ሰርተፍኬት", en: "Humanitarian Certificate"     },
    tag:   { am: "ኦፊሴላዊ ሰርተፍኬት",        en: "Official Certificate"          },
    story: { am: "ከተቋማት የተበረከተ ሰርተፍኬት።", en: "Certificate acknowledging Selihom's dedicated service." } },
  { id: "s6", image: award6Img,
    name:  { am: "85% ማገገሚያ ማረጋገጫ",    en: "Service Certification"         },
    tag:   { am: "ተአማኒ ድርጅት",           en: "Trusted NGO"                   },
    story: { am: "85% ተጠቃሚዎች ሙሉ ማገገሚያ ማረጋገጫ።", en: "Certified track record: over 85% of beneficiaries fully restored." } },
  { id: "s7", image: award7Img,
    name:  { am: "የማህበረሰብ አገልግሎት ሽልማት", en: "Community Service Honour"     },
    tag:   { am: "ሽልማቶችና እውቅና",         en: "Honours & Medals"              },
    story: { am: "ዓመታዊ ቁርጠኝነትና ህዝባዊ ድጋፍ።", en: "Celebrating years of collective dedication and public generosity." } },
];

export default function HeroCarousel({ onNavigateAchievements }: { onNavigateAchievements?: () => void }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setCurrentIndex((p) => (p + 1) % HERO_SLIDES.length), 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = HERO_SLIDES[currentIndex];
  const prev = () => setCurrentIndex((p) => (p === 0 ? HERO_SLIDES.length - 1 : p - 1));
  const next = () => setCurrentIndex((p) => (p + 1) % HERO_SLIDES.length);

  const handleViewAll = () => {
    if (onNavigateAchievements) { onNavigateAchievements(); } else { navigate("/about"); }
  };

  return (
    <div className="relative w-full" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {/* Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-brand-sky-200 shadow-xl h-[360px] sm:h-[420px] md:h-[460px] group">

        {/* Slide image */}
        <AnimatePresence initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0.3, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img src={current.image} alt={current.name[language === "am" ? "am" : "en"]}
              className="w-full h-full object-contain object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-sky-950/80 via-brand-sky-950/20 to-transparent z-10" />
          </motion.div>
        </AnimatePresence>

        {/* Tag pill */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-sky-400 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-md">
            <Award className="w-3.5 h-3.5" />
            {current.tag[language === "am" ? "am" : "en"]}
          </span>
        </div>

        {/* Arrows */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
          <button onClick={prev} aria-label="Previous"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-brand-sky-400 hover:text-white text-brand-sky-700 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-brand-sky-200 shadow-sm">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} aria-label="Next"
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-brand-sky-400 hover:text-white text-brand-sky-700 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-brand-sky-200 shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-6 z-20 text-white space-y-2">
          <AnimatePresence mode="wait">
            <motion.div key={current.id + "-info"}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }} className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                  {current.name[language === "am" ? "am" : "en"]}
                </h3>
                <button onClick={handleViewAll}
                  className="text-brand-yellow-400 hover:text-white text-xs font-bold flex items-center gap-0.5 transition-colors cursor-pointer">
                  <span>{language === "am" ? "ሁሉንም ይመልከቱ" : "View All"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-sky-100/80 leading-relaxed line-clamp-2">
                {current.story[language === "am" ? "am" : "en"]}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          <div className="flex items-center justify-between pt-2 border-t border-white/15">
            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} aria-label={`Slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === currentIndex ? "w-6 bg-brand-sky-400" : "w-1.5 bg-white/40 hover:bg-white/70"}`} />
              ))}
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-brand-yellow-400/90 font-bold">
              {language === "am" ? "ሽልማቶች" : "HONOURS & AWARDS"}
            </span>
          </div>
        </div>
      </div>

      {/* Floating badge — Certified */}
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -left-4 z-30 pointer-events-none">
        <div className="px-3.5 py-1.5 bg-white border-2 border-brand-sky-400 shadow-lg rounded-2xl flex items-center gap-1.5 text-xs font-black text-brand-sky-950 font-serif">
          <span className="w-2 h-2 rounded-full bg-brand-green-400 animate-pulse" />
          {language === "am" ? "እውቅና • CERTIFIED" : "CERTIFIED • እውቅና"}
        </div>
      </motion.div>

      {/* Floating badge — Awards */}
      <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-4 -right-4 z-30 pointer-events-none">
        <div className="px-3.5 py-1.5 bg-brand-yellow-400 border-2 border-white shadow-lg rounded-2xl flex items-center gap-1.5 text-xs font-black text-brand-sky-950 font-serif">
          <Award className="w-3.5 h-3.5" />
          {language === "am" ? "ሽልማት • AWARDS" : "AWARDS • ሽልማት"}
        </div>
      </motion.div>
    </div>
  );
}
