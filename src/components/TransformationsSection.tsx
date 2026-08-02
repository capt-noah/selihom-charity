import React from "react";
import { motion } from "motion/react";
import { HeartHandshake } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TRANSFORMATION_STORIES } from "../data";
import { DotGridPattern } from "./Sketches";

export default function TransformationsSection() {
  const { t, language } = useLanguage();

  return (
    <section id="transformations" className="py-24 bg-gradient-to-b from-white via-[#FAF8F5] to-white relative overflow-hidden border-b border-brand-green-100/50">
      <DotGridPattern />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-green-950 tracking-tight leading-tight mb-4"
          >
            {language === "am" ? "የተስፋና የህይወት መታደስ ታሪኮች" : "Stories of Hope & Renewal"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-700 text-sm md:text-base leading-relaxed font-medium"
          >
            {language === "am" 
              ? "በሰሊሆም ማህበር በህክምና፣ በምግብና በስነ-ልቦና ድጋፍ የተለወጡና ወደ ህብረተሰቡ የተመለሱ ተጠቃሚዎቻችን እውነተኛ የለውጥ ምስሎች።"
              : "Witness real before-and-after recovery stories of individuals rescued from street vulnerability, provided medical psychiatric care, housing, and loving rehabilitation."
            }
          </motion.p>
        </div>

        {/* Multi-Card Grid Showcase - All Stories Visible at Once */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {TRANSFORMATION_STORIES.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl border-2 border-brand-green-950/15 shadow-md hover:shadow-2xl hover:border-brand-green-600/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Name Header */}
                <div className="relative w-full aspect-[4/3] sm:h-[440px] md:h-[460px] overflow-hidden bg-brand-green-950">
                  <img
                    src={story.image}
                    alt={t(story.name)}
                    className={`w-full h-full object-cover ${story.imagePosition || "object-center"} group-hover:scale-105 transition-transform duration-700`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950 via-brand-green-950/20 to-transparent pointer-events-none" />
                  
                  {/* Name Banner Overlay at bottom of image */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white z-10">
                    <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-white drop-shadow-md">
                      {t(story.name)}
                    </h3>
                  </div>
                </div>

                {/* Narrative Details */}
                <div className="p-6 sm:p-8 space-y-4">
                  {/* Before Box */}
                  <div className="bg-rose-50/80 border-2 border-rose-200/80 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-widest block">
                      {language === "am" ? "ሲነሳ / ከለውጥ በፊት" : "When Rescued (Before)"}
                    </span>
                    <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                      {t(story.storyBefore)}
                    </p>
                  </div>

                  {/* After Box */}
                  <div className="bg-emerald-50/90 border-2 border-emerald-200/80 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest block">
                      {language === "am" ? "አሁን ላይ / ከለውጥ በኋላ" : "Present Day (After Recovery)"}
                    </span>
                    <p className="text-xs sm:text-sm text-emerald-950 font-bold leading-relaxed">
                      {t(story.storyAfter)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 sm:px-8 pb-6 pt-2 flex items-center justify-between border-t border-gray-100 text-xs font-bold text-brand-green-900">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-brand-green-600 shrink-0" />
                  <span>{language === "am" ? "የሰሊሆም ህክምናና ተሃድሶ ውጤት" : "Selihom Care & Rehabilitation"}</span>
                </div>
                <span className="text-brand-yellow-600 font-extrabold">100% {language === "am" ? "ነፃ አገልግሎት" : "Free Care"}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
