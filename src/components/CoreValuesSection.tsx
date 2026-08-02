import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Heart, Users, Award, Eye, BookOpen } from "lucide-react";
import { VALUES } from "../data";
import { useLanguage } from "../context/LanguageContext";

const VALUE_ICONS: Record<string, React.ReactNode> = {
  "val-1": <Eye className="w-6 h-6 stroke-[2.5]" />,
  "val-2": <ShieldCheck className="w-6 h-6 stroke-[2.5]" />,
  "val-3": <Users className="w-6 h-6 stroke-[2.5]" />,
  "val-4": <Award className="w-6 h-6 stroke-[2.5]" />,
  "val-5": <Heart className="w-6 h-6 stroke-[2.5]" />,
  "val-6": <BookOpen className="w-6 h-6 stroke-[2.5]" />,
};

const VALUE_BADGES: Record<string, { am: string; en: string }> = {
  "val-1": { am: "ግልጽነት", en: "Transparency" },
  "val-2": { am: "ታማኝነት", en: "Integrity" },
  "val-3": { am: "አንድነት", en: "Family Spirit" },
  "val-4": { am: "የላቀ ጥራት", en: "Excellence" },
  "val-5": { am: "እኩልነት", en: "Inclusion" },
  "val-6": { am: "እምነትና ሙያ", en: "Faith & Knowledge" },
};

export default function CoreValuesSection() {
  const { t, language } = useLanguage();

  return (
    <section id="values" className="py-24 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background radial soft lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-green-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green-950 tracking-tight mb-4"
          >
            {language === "am" ? "ዋና ዋና እሴቶቻችን" : "Core Values"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium"
          >
            {language === "am"
              ? "የዕለት ተዕለት ተግባራችን፣ ለለጋሾቻችን የምንሰጠው ግልጽነትና ለተጠቃሚዎች የምናሳየው ቅን ፍቅር በነዚህ መመሪያዎች ላይ የተመሰረተ ነው።"
              : "The foundational principles shaping our operations, donor accountability, and compassionate service every single day."
            }
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {VALUES.map((value, idx) => {
            const numStr = String(idx + 1).padStart(2, "0");
            const badge = VALUE_BADGES[value.id] || { am: "እሴት", en: "Value" };

            return (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="bg-white border-2 border-brand-green-950/15 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-brand-green-600/50 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Decorative top colored border accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-green-700 via-brand-yellow-500 to-brand-green-900 group-hover:h-2 transition-all" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    {/* Icon Container */}
                    <div className="w-14 h-14 rounded-2xl bg-brand-green-950 text-brand-yellow-400 group-hover:bg-brand-green-700 group-hover:text-white flex items-center justify-center shadow-md transition-colors duration-300">
                      {VALUE_ICONS[value.id] || <Heart className="w-6 h-6" />}
                    </div>

                    {/* Number Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-brand-green-800 bg-brand-green-50 px-2.5 py-1 rounded-lg border border-brand-green-100">
                        {language === "am" ? badge.am : badge.en}
                      </span>
                      <span className="font-mono text-2xl font-black text-brand-green-950/20 group-hover:text-brand-yellow-500 transition-colors">
                        {numStr}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-brand-green-950 mb-3 group-hover:text-brand-green-700 transition-colors">
                    {t(value.title)}
                  </h3>

                  {value.description && (
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium">
                      {t(value.description)}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
