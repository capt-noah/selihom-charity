import React from "react";
import { motion } from "motion/react";
import { Stethoscope, Home, GraduationCap, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { STATS } from "../data";

export default function ImpactCounters() {
  const { t, language } = useLanguage();

  const iconMap: Record<string, React.ComponentType<any>> = {
    Stethoscope, Home, GraduationCap, Heart,
  };

  // Each stat card gets one of the three logo figure colours
  const cardStyles = [
    { bg: "bg-brand-sky-400",    icon: "bg-white text-brand-sky-500",    num: "text-white", label: "text-white/90", desc: "text-white/80" },
    { bg: "bg-brand-green-400",  icon: "bg-white text-brand-green-500",  num: "text-white", label: "text-white/90", desc: "text-white/80" },
    { bg: "bg-brand-yellow-400", icon: "bg-white text-brand-yellow-600", num: "text-white", label: "text-white/90", desc: "text-white/80" },
  ];

  return (
    <section className="py-20 bg-brand-sky-50 relative overflow-hidden border-y border-brand-sky-100">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-brand-yellow-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-brand-sky-950 leading-tight">
            {language === "am" ? (
              <>የተጠቃሚዎቻችን <span className="text-brand-sky-400 italic">ስብጥር</span></>
            ) : (
              <>Beneficiary <span className="text-brand-sky-400 italic">Breakdown</span></>
            )}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {STATS.map((st, index) => {
            const Icon = iconMap[st.icon] || Heart;
            const style = cardStyles[index % cardStyles.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`${style.bg} rounded-3xl p-8 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group text-center items-center shadow-lg`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${style.icon} group-hover:scale-110 transition-transform shadow-md`}>
                    <Icon className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <span className={`font-mono text-5xl font-black block tracking-tight mb-2 ${style.num}`}>
                    {st.number}
                  </span>
                  <h4 className={`font-serif text-xl sm:text-2xl font-bold mb-2 leading-snug ${style.label}`}>
                    {t(st.label)}
                  </h4>
                </div>
                <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${style.desc}`}>
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
