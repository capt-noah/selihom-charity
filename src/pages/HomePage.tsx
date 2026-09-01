import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Heart, Users, Award, Stethoscope, Home, GraduationCap, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { SELIHOM_INFO, INITIATIVES } from "../data";
import HeroCarousel from "../components/HeroCarousel";
import ImpactCounters from "../components/ImpactCounters";
import TestimonialsSection from "../components/TestimonialsSection";
import TransformationsSection from "../components/TransformationsSection";
import { HelpingHandsSketch, FoodNourishSketch, EducationBookSketch } from "../components/Sketches";

function InitiativePreviewCard({ item, index }: { item: (typeof INITIATIVES)[0]; index: number }) {
  const { t } = useLanguage();

  // Mirror the same accent colours as InitiativesSection
  const colours = [
    { bg: "bg-brand-sky-400",    icon: "text-white" },
    { bg: "bg-brand-green-400",  icon: "text-white" },
    { bg: "bg-brand-yellow-400", icon: "text-white" },
    { bg: "bg-brand-orange-400", icon: "text-white" },
  ];
  const c = colours[index % colours.length];

  const icons = [Stethoscope, Home, GraduationCap, Briefcase];
  const Icon = icons[index % icons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden border border-brand-sky-100 shadow-sm hover:shadow-lg hover:border-brand-sky-300 transition-all duration-300 group"
    >
      {/* Coloured header block — no image */}
      <div className={`relative h-36 ${c.bg} flex items-center justify-center overflow-hidden`}>
        {/* Faded bg icon */}
        <Icon className="absolute opacity-10 w-28 h-28 text-white" strokeWidth={1} />
        {/* Centred icon */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-white/25 flex items-center justify-center border border-white/20">
          <Icon className={`w-6 h-6 stroke-[2] ${c.icon}`} />
        </div>
        {/* Tag */}
        <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-wider text-white bg-white/20 border border-white/30 px-2.5 py-1 rounded-lg">
          {t({ en: item.tags.en[0], am: item.tags.am[0] })}
        </span>
        {/* Wave */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 400 16" preserveAspectRatio="none" fill="white">
          <path d="M0,16 C100,0 300,16 400,0 L400,16 Z" />
        </svg>
      </div>

      <div className="p-5">
        <h3 className="font-serif font-bold text-base text-brand-sky-950 mb-1.5 leading-snug group-hover:text-brand-sky-500 transition-colors">
          {t(item.title)}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{t(item.description)}</p>
      </div>
    </motion.div>
  );
}

function StatPill({ icon: Icon, value, label, color }: { icon: React.ComponentType<any>; value: string; label: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 bg-white border border-brand-sky-100 shadow-sm rounded-2xl px-5 py-3"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <span className="font-mono font-black text-lg text-brand-sky-950 block leading-none">{value}</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</span>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen">

      {/* ── HERO — light background, sky-blue accents ── */}
      <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">

        {/* Soft sky-blue glow blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-sky-100/60 rounded-full blur-3xl pointer-events-none translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-brand-green-100/40 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-sky-50/80 rounded-full blur-3xl pointer-events-none" />

        {/* Watermark sketches */}
        <div className="absolute top-24 -left-10 text-brand-sky-400/[0.08] pointer-events-none select-none">
          <HelpingHandsSketch className="w-64 h-64 rotate-12" />
        </div>
        <div className="absolute bottom-10 -right-8 text-brand-yellow-400/[0.10] pointer-events-none select-none">
          <FoodNourishSketch className="w-56 h-56 -rotate-12" />
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" fill="#F0FAFE" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">

            {/* Left copy */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-7">

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-brand-sky-950"
              >
                {language === "am" ? (
                  <>
                    <span className="block">ተስፋ፣ ፍቅርና</span>
                    <span className="block text-brand-sky-400">አንድነት</span>
                    <span className="block text-xl md:text-2xl font-normal text-gray-500 mt-2">
                      {t(SELIHOM_INFO.fullName)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block">Hope, Love &</span>
                    <span className="block text-brand-sky-400">Unity</span>
                    <span className="block text-xl md:text-2xl font-normal text-gray-500 mt-2">
                      {t(SELIHOM_INFO.fullName)}
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                {t(SELIHOM_INFO.hero.description)}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link
                  to="/get-involved#donate"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-extrabold text-sm tracking-wider uppercase rounded-2xl shadow-lg shadow-brand-sky-400/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 group"
                >
                  {language === "am" ? "አሁኑኑ ይደግፉ" : "Support Us Now"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/get-involved#visit"
                  className="w-full sm:w-auto px-8 py-4 border-2 border-brand-sky-300 hover:border-brand-sky-400 text-brand-sky-700 font-bold text-sm tracking-wider uppercase rounded-2xl transition-all flex items-center justify-center gap-2.5 hover:bg-brand-sky-50"
                >
                  <Calendar className="w-4 h-4" />
                  {language === "am" ? "ጉብኝት ያስይዙ" : "Book a Visit"}
                </Link>
              </motion.div>

              {/* Stat pills — white cards on white hero, bordered */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2"
              >
                <StatPill icon={Users} value="200+" label={language === "am" ? "ዕለታዊ ተጠቃሚዎች" : "Daily Beneficiaries"} color="bg-brand-sky-100 text-brand-sky-600" />
                <StatPill icon={Heart} value="85%"  label={language === "am" ? "የማገገም መጠን"     : "Recovery Rate"}        color="bg-brand-green-100 text-brand-green-600" />
                <StatPill icon={Award} value="6+"   label={language === "am" ? "ሽልማቶች"           : "Awards"}               color="bg-brand-yellow-100 text-brand-yellow-600" />
              </motion.div>
            </div>

            {/* Right — award carousel */}
            <div className="lg:col-span-6">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT COUNTERS ── */}
      <ImpactCounters />

      {/* ── INITIATIVES PREVIEW ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sky-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-yellow-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 text-brand-sky-400/[0.06] pointer-events-none select-none">
          <EducationBookSketch className="w-64 h-64 rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <motion.span
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3"
            >
              {language === "am" ? "አገልግሎቶቻችን" : "Our Programs"}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl font-bold text-brand-sky-950 tracking-tight mb-4"
            >
              {language === "am" ? "የምናቀርባቸው አገልግሎቶች" : "What We Do"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm md:text-base leading-relaxed"
            >
              {language === "am"
                ? "የአዕምሮ ህክምና፣ የአዛውንቶች እንክብካቤ፣ የህጻናት ትምህርትና የሙያ ስልጠናን ሁሉ አቀፍ ድጋፍ።"
                : "Comprehensive support through psychiatric care, elderly housing, child education, and vocational training."}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIATIVES.map((item, idx) => (
              <InitiativePreviewCard key={item.id} item={item} index={idx} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-sm tracking-wider uppercase rounded-full shadow-lg shadow-brand-sky-400/25 hover:-translate-y-0.5 transition-all"
            >
              {language === "am" ? "ሁሉም አገልግሎቶች" : "View All Programs"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STORIES OF HOPE ── */}
      <TransformationsSection />

      {/* ── TESTIMONIALS ── */}
      <TestimonialsSection />
    </div>
  );
}
