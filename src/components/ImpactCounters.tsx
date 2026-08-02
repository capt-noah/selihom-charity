import React from "react";
import { motion } from "motion/react";
import { Stethoscope, Home, GraduationCap, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { STATS } from "../data";

export default function ImpactCounters() {
  const { t, language } = useLanguage();

  const iconMap: Record<string, React.ComponentType<any>> = {
    Stethoscope,
    Home,
    GraduationCap,
    Heart,
  };

  return (
    <section className="py-20 bg-brand-green-950 text-white relative overflow-hidden border-b border-brand-green-800">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-green-800/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-brand-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
            {language === "am" ? (
              <>የተጠቃሚዎቻችን <span className="text-brand-yellow-400 italic">ስብጥር</span></>
            ) : (
              <>Beneficiary <span className="text-brand-yellow-400 italic">Breakdown</span></>
            )}
          </h3>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {STATS.map((st, index) => {
            const Icon = iconMap[st.icon] || Heart;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-brand-green-900/60 border-2 border-brand-green-800/80 rounded-3xl p-8 hover:bg-brand-green-900/90 hover:border-brand-yellow-500/80 transition-all duration-300 flex flex-col justify-between group text-center items-center shadow-lg"
              >
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-brand-yellow-500 text-brand-green-950 font-black group-hover:scale-110 transition-transform shadow-md">
                    <Icon className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <span className="font-mono text-5xl font-black text-brand-yellow-400 block tracking-tight mb-2">
                    {st.number}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold mb-2 leading-snug text-white">
                    {t(st.label)}
                  </h4>
                </div>
                <p className="text-emerald-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
                  {t(st.description)}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
