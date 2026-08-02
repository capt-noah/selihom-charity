import React from "react";
import { motion } from "motion/react";
import { Eye, Target, Compass, History, CheckCircle2, Quote } from "lucide-react";
import { SELIHOM_INFO } from "../data";
import { useLanguage } from "../context/LanguageContext";

export default function AboutSection() {
  const { t, language } = useLanguage();

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ================= SECTION 1: OUR STORY ================= */}
        <div className="mb-20">
          {/* Our Story Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green-950 tracking-tight mb-4"
            >
              {language === "am" ? "ታሪካችን" : "Our Story"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-sm sm:text-base leading-relaxed"
            >
              {language === "am"
                ? "ከሀዘን ወደ ተስፋ የተቀየረ፣ በቁርጠኝነትና በፍቅር የተመሰረተ ሰብአዊ ማህበር ታሪክና አጀማመር።"
                : "Born from grief to turn despair into enduring hope for the most vulnerable citizens of Ethiopia."
              }
            </motion.p>
          </div>

          {/* Story / History Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#FAF8F5] to-brand-green-50/40 border-2 border-brand-green-950/15 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm relative overflow-hidden"
          >
            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
              {/* Header / Title inside Card */}
              <div className="flex items-center gap-3 border-b border-brand-green-950/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-green-950 text-brand-yellow-400 flex items-center justify-center shrink-0 shadow-md">
                  <History className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green-950">
                    {t(SELIHOM_INFO.about.history.title)}
                  </h3>
                </div>
              </div>

              {/* Narrative text */}
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
                {t(SELIHOM_INFO.about.history.summary)}
              </p>

              {/* Founder Motto Callout Box */}
              <div className="bg-white border-2 border-brand-green-900/10 rounded-2xl p-5 sm:p-6 shadow-sm flex items-start gap-4">
                <Quote className="w-8 h-8 text-brand-yellow-500 shrink-0 mt-1 rotate-180" />
                <div className="space-y-1">
                  <p className="font-serif italic font-bold text-base sm:text-lg text-brand-green-950">
                    "{t(SELIHOM_INFO.motto)}"
                  </p>
                  <p className="text-xs font-bold text-brand-green-800 uppercase tracking-wider">
                    — {t(SELIHOM_INFO.about.founder)} ({language === "am" ? "የሰሊሆም ማህበር መስራች" : "Founder of Selihom Association"})
                  </p>
                </div>
              </div>

              {/* Quick Milestones Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-brand-green-950/10">
                <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-brand-green-100 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 shrink-0" />
                  <span className="text-xs font-extrabold text-brand-green-950">
                    {language === "am" ? "200+ ዕለታዊ ተጠቃሚዎች" : "200+ Daily Beneficiaries"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-brand-green-100 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 shrink-0" />
                  <span className="text-xs font-extrabold text-brand-green-950">
                    {language === "am" ? "85% የማገገም መጠን" : "85% Recovery Rate"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-brand-green-100 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 shrink-0" />
                  <span className="text-xs font-extrabold text-brand-green-950">
                    {language === "am" ? "እንጦጦ ራጉኤል ማዕከል" : "Entoto Raguel Shelter"}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/80 p-3 rounded-xl border border-brand-green-100 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-brand-green-600 shrink-0" />
                  <span className="text-xs font-extrabold text-brand-green-950">
                    {language === "am" ? "የሙያና የስራ እድል" : "Vocational Jobs"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        {/* ================= SECTION 2: VISION, MISSION & OBJECTIVES ================= */}
        <div>
          {/* Dedicated Header for Vision, Mission & Objectives */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green-950 tracking-tight mb-4"
            >
              {language === "am" ? "ራዕይ፣ ተልዕኮና አላማ" : "Vision, Mission & Objectives"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-sm sm:text-base leading-relaxed"
            >
              {language === "am"
                ? "ለተጠቃሚዎቻችን ሁለንተናዊ ድጋፍ ለመስጠትና ቀጣይነት ያለው ሰብአዊ ለውጥ ለማምጣት የተቀረጹ መመሪያዎቻችን።"
                : "The core pillars guiding our psychiatric care, senior shelter, child education, and rehabilitation work."
              }
            </motion.p>
          </div>

          {/* Vision, Mission, Objectives 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-brand-green-950 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border-2 border-brand-green-800 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-yellow-500 text-brand-green-950 flex items-center justify-center mb-6 shadow-md">
                  <Eye className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-white mb-3">
                  {t(SELIHOM_INFO.about.vision.title)}
                </h3>
                <p className="text-emerald-100/90 text-sm leading-relaxed font-medium">
                  {t(SELIHOM_INFO.about.vision.content)}
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-brand-green-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border-2 border-brand-green-700 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-yellow-500 text-brand-green-950 flex items-center justify-center mb-6 shadow-md">
                  <Compass className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-white mb-3">
                  {t(SELIHOM_INFO.about.mission.title)}
                </h3>
                <p className="text-emerald-100/95 text-sm leading-relaxed font-medium">
                  {t(SELIHOM_INFO.about.mission.content)}
                </p>
              </div>
            </motion.div>

            {/* Objectives */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-brand-green-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border-2 border-brand-green-600 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand-yellow-500 text-brand-green-950 flex items-center justify-center mb-6 shadow-md">
                  <Target className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-white mb-3">
                  {t(SELIHOM_INFO.about.objectives.title)}
                </h3>
                <p className="text-emerald-100/90 text-sm leading-relaxed font-medium">
                  {t(SELIHOM_INFO.about.objectives.content)}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
