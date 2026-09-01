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

        {/* ── Our Story ── */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
              {language === "am" ? "ታሪካችን" : "Our Story"}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4">
              {language === "am" ? "ከሀዘን ወደ ተስፋ" : "From Grief to Hope"}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm sm:text-base leading-relaxed">
              {language === "am"
                ? "ከሀዘን ወደ ተስፋ የተቀየረ፣ በቁርጠኝነትና በፍቅር የተመሰረተ ሰብአዊ ማህበር ታሪክ።"
                : "Born from grief, turning despair into enduring hope for Ethiopia's most vulnerable citizens."}
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-brand-sky-50 border-2 border-brand-sky-100 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm relative overflow-hidden">
            {/* Colour accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              <div className="flex-1 bg-brand-sky-400" />
              <div className="flex-1 bg-brand-green-400" />
              <div className="flex-1 bg-brand-yellow-400" />
              <div className="flex-1 bg-brand-orange-400" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8 relative z-10">
              <div className="flex items-center gap-3 border-b border-brand-sky-200 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand-sky-400 text-white flex items-center justify-center shrink-0 shadow-md">
                  <History className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-sky-950">
                  {t(SELIHOM_INFO.about.history.title)}
                </h3>
              </div>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                {t(SELIHOM_INFO.about.history.summary)}
              </p>

              <div className="bg-white border-2 border-brand-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm flex items-start gap-4">
                <Quote className="w-8 h-8 text-brand-yellow-400 shrink-0 mt-1 rotate-180" />
                <div className="space-y-1">
                  <p className="font-serif italic font-bold text-base sm:text-lg text-brand-sky-950">
                    "{t(SELIHOM_INFO.motto)}"
                  </p>
                  <p className="text-xs font-bold text-brand-sky-600 uppercase tracking-wider">
                    — {t(SELIHOM_INFO.about.founder)} ({language === "am" ? "የሰሊሆም ማህበር መስራች" : "Founder, Selihom Association"})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-brand-sky-100">
                {[
                  language === "am" ? "200+ ዕለታዊ ተጠቃሚዎች" : "200+ Daily Beneficiaries",
                  language === "am" ? "85% የማገገም መጠን"    : "85% Recovery Rate",
                  language === "am" ? "እንጦጦ ራጉኤል ማዕከል"  : "Entoto Raguel Shelter",
                  language === "am" ? "የሙያና የስራ እድል"     : "Vocational Jobs",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-brand-sky-100 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-brand-sky-400 shrink-0" />
                    <span className="text-xs font-extrabold text-brand-sky-950">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Vision, Mission & Objectives ── */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4">
              {language === "am" ? "ራዕይ፣ ተልዕኮና አላማ" : "Vision, Mission & Objectives"}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-gray-500 text-sm sm:text-base leading-relaxed">
              {language === "am"
                ? "ለተጠቃሚዎቻችን ሁለንተናዊ ድጋፍ ለመስጠት የተቀረጹ ዋና መሪ ሀሳቦቻችን።"
                : "The core pillars guiding our psychiatric care, senior shelter, child education, and rehabilitation work."}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { key: "vision",     icon: Eye,     delay: 0.1, data: SELIHOM_INFO.about.vision,     bg: "bg-brand-sky-400",    border: "border-brand-sky-300"   },
              { key: "mission",    icon: Compass, delay: 0.2, data: SELIHOM_INFO.about.mission,    bg: "bg-brand-green-400",  border: "border-brand-green-300" },
              { key: "objectives", icon: Target,  delay: 0.3, data: SELIHOM_INFO.about.objectives, bg: "bg-brand-yellow-400", border: "border-brand-yellow-300" },
            ].map(({ key, icon: Icon, delay, data, bg, border }) => (
              <motion.div key={key}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}
                className={`${bg} text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border-2 ${border} flex flex-col justify-between`}>
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center mb-6 shadow-md">
                    <Icon className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-white mb-3">{t(data.title)}</h3>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">{t(data.content)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
