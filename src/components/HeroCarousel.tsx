import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Heart, Sparkles, ArrowUpRight, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

import award1Img from "../assets/images/award1.jpg";
import award2Img from "../assets/images/award2.jpg";
import award3Img from "../assets/images/award3.jpg";
import award4Img from "../assets/images/award4.jpg";
import award5Img from "../assets/images/award5.jpg";
import award6Img from "../assets/images/award6.jpg";
import award7Img from "../assets/images/award7.jpg";

interface HeroSlide {
  id: string;
  name: { am: string; en: string };
  tag: { am: string; en: string };
  story: { am: string; en: string };
  image: string;
  imagePosition?: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "hero-award-1",
    name: { am: "የመንግስት ህጋዊ እውቅና", en: "Official NGO Certification" },
    tag: { am: "ምዝገባ ቁጥር 1113/2019", en: "Reg No. 1113/2019" },
    story: {
      am: "በፌደራል የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ በህጋዊ መንገድ የተመዘገበና እውቅና ያገኘ ሰብአዊ ማህበር።",
      en: "Officially registered & accredited NGO by the FDRE Civil Society Organizations Agency."
    },
    image: award1Img,
    imagePosition: "object-center"
  },
  {
    id: "hero-award-2",
    name: { am: "የበጎ አድራጎት የክብር ሽልማት", en: "Distinguished Service Award" },
    tag: { am: "የሰብአዊ አገልግሎት", en: "Humanitarian Honor" },
    story: {
      am: "በሺዎች የሚቆጠሩ ሰዎችን ከጎዳና በማንሳትና በመንከባከብ የተበረከተ የክብር ሽልማትና ዋንጫ።",
      en: "Distinguished service award honoring Selihom's outstanding community impact and care."
    },
    image: award2Img,
    imagePosition: "object-center"
  },
  {
    id: "hero-award-3",
    name: { am: "ብሄራዊ የሰብአዊ እውቅና", en: "National Recognition" },
    tag: { am: "የተሃድሶ ውጤት", en: "National Impact" },
    story: {
      am: "የአዕምሮ ህሙማንን፣ አዛውንቶችንና ህፃናትን በምግብና በህክምና በመደገፍ የተገኘ ብሄራዊ እውቅና።",
      en: "Recognized nationally for rescuing street beneficiaries and delivering holistic rehabilitation."
    },
    image: award3Img,
    imagePosition: "object-center"
  },
  {
    id: "hero-award-4",
    name: { am: "የታዋቂ እንግዶችና አምባሳደሮች ጉብኝት", en: "VIP & Dignitary Visits" },
    tag: { am: "የማህበረሰብ አጋርነት", en: "Community Support" },
    story: {
      am: "ታዋቂ ግለሰቦች፣ አርቲስቶችና የክብር እንግዶች የሰሊሆም እንጦጦ ማዕከልን ጎብኝተው ድጋፍ ሲያደርጉ።",
      en: "Renowned personalities, cultural icons, and dignitaries visiting Selihom Entoto shelter."
    },
    image: award4Img,
    imagePosition: "object-center"
  },
  {
    id: "hero-award-5",
    name: { am: "የሰብአዊ አገልግሎት ምስክር ወረቀት", en: "Humanitarian Excellence Certificate" },
    tag: { am: "የክብር ሰርተፍኬት", en: "Official Certificate" },
    story: {
      am: "ከመንግስታዊና ማህበረሰባዊ ተቋማት ለሰሊሆም ማህበር የተበረከተ የላቀ አገልግሎት ምስክር ወረቀት።",
      en: "Certificate of appreciation acknowledging Selihom's dedicated service to vulnerable citizens."
    },
    image: award5Img,
    imagePosition: "object-center"
  },
  {
    id: "hero-award-6",
    name: { am: "የተሃድሶና የእንክብካቤ ማረጋገጫ", en: "Official Service Certification" },
    tag: { am: "ተአማኒነት", en: "Trusted NGO" },
    story: {
      am: "85% ተጠቃሚዎችን ሙሉ በሙሉ በመፈወስና ወደ ህብረተሰብ በመመለስ የተገኘ ማረጋገጫ።",
      en: "Certified track record of restoring health to over 85% of rescued beneficiaries."
    },
    image: award6Img,
    imagePosition: "object-center"
  },
  {
    id: "hero-award-7",
    name: { am: "የማህበረሰብ አግልግሎት ሽልማት", en: "Community Service Honor" },
    tag: { am: "እውቅናና ድጋፍ", en: "Honors & Medals" },
    story: {
      am: "በጎ ፈቃደኞችን፣ ህክምና ባለሙያዎችንና ደጋፊዎችን ያስተባበረ ድንቅ የበጎ አድራጎት ጉዞ።",
      en: "Celebrating years of collective dedication, medical volunteers, and public generosity."
    },
    image: award7Img,
    imagePosition: "object-center"
  }
];

interface HeroCarouselProps {
  onNavigateAchievements?: () => void;
}

export default function HeroCarousel({ onNavigateAchievements }: HeroCarouselProps) {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handleViewAll = () => {
    if (onNavigateAchievements) {
      onNavigateAchievements();
    } else {
      const el = document.getElementById("achievements");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative w-full max-w-full mx-auto py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Glow Container */}
      <div className="relative">
        {/* Main Card Frame */}
        <div className="relative overflow-hidden rounded-3xl bg-brand-green-950 border-4 border-white shadow-2xl h-[380px] sm:h-[420px] md:h-[460px] 2xl:h-[560px] w-full group">
          {/* Animated Background Slide */}
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0.3, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full z-0"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.name[language === "am" ? "am" : "en"]}
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-contain object-center block"
              />
              {/* Gradient Overlay for Readable Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950 via-brand-green-950/30 to-transparent pointer-events-none z-10" />
            </motion.div>
          </AnimatePresence>

          {/* Top Tag Pill */}
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow-500 text-brand-green-950 font-extrabold text-[11px] uppercase tracking-wider rounded-full shadow-md">
              <Award className="w-3.5 h-3.5 text-brand-green-950" />
              {currentSlide.tag[language === "am" ? "am" : "en"]}
            </span>
          </div>

          {/* Navigation Controls (Arrows) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Previous Award"
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-brand-green-900 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Award"
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-brand-green-900 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-105"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Card Content Info */}
          <div className="absolute bottom-0 inset-x-0 p-6 z-20 text-white space-y-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + "-info"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-white tracking-tight">
                    {currentSlide.name[language === "am" ? "am" : "en"]}
                  </h3>
                  <button
                    onClick={handleViewAll}
                    className="text-brand-yellow-400 hover:text-white text-xs font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span>{language === "am" ? "እውቅናዎችን ይመልከቱ" : "View All"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-brand-green-100/90 leading-relaxed font-medium line-clamp-2">
                  {currentSlide.story[language === "am" ? "am" : "en"]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Pagination Dots */}
            <div className="flex items-center justify-between pt-2 border-t border-white/15">
              <div className="flex items-center gap-1.5">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? "w-6 bg-brand-yellow-500" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-yellow-400/90 font-bold">
                {language === "am" ? "የክብር እውቅናዎች" : "HONORS & AWARDS"}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Pill Badges around the Card */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-5 -left-4 z-30 pointer-events-none"
        >
          <div className="px-3.5 py-1.5 bg-white border-2 border-brand-green-600 shadow-lg rounded-2xl flex items-center gap-1.5 text-xs font-black text-brand-green-950 font-serif">
            <span className="w-2 h-2 rounded-full bg-brand-green-600 animate-pulse"></span>
            {language === "am" ? "እውቅና • CERTIFIED" : "CERTIFIED • እውቅና"}
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-4 -right-4 z-30 pointer-events-none"
        >
          <div className="px-3.5 py-1.5 bg-brand-yellow-500 border-2 border-brand-green-950 shadow-lg rounded-2xl flex items-center gap-1.5 text-xs font-black text-brand-green-950 font-serif">
            <Award className="w-3.5 h-3.5 fill-current text-brand-green-950" />
            {language === "am" ? "ሽልማት • AWARDS" : "AWARDS • ሽልማት"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

