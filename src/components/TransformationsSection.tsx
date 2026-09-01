import React from "react";
import { motion } from "motion/react";
import { HeartHandshake } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TRANSFORMATION_STORIES } from "../data";
import { DotGridPattern } from "./Sketches";

export default function TransformationsSection() {
  const { t, language } = useLanguage();

  return (
    <section id="transformations" className="py-24 bg-white relative overflow-hidden border-b border-brand-sky-100">
      <DotGridPattern />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "የህይወት ለውጥ" : "Real Transformations"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-sky-950 tracking-tight leading-tight mb-4">
            {language === "am" ? "የተስፋና የህይወት መታደስ ታሪኮች" : "Stories of Hope & Renewal"}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
            {language === "am"
              ? "በሰሊሆም ማህበር ህክምናና ድጋፍ የተለወጡ ተጠቃሚዎቻችን እውነተኛ ታሪኮች።"
              : "Real before-and-after recovery stories from individuals rescued, cared for, and rehabilitated by Selihom."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {TRANSFORMATION_STORIES.map((story, idx) => (
            <motion.div key={story.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl border-2 border-brand-sky-100 shadow-md hover:shadow-2xl hover:border-brand-sky-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative w-full aspect-[4/3] sm:h-[420px] overflow-hidden bg-brand-sky-950">
                  <img src={story.image} alt={t(story.name)}
                    className={`w-full h-full object-cover ${story.imagePosition || "object-center"} group-hover:scale-105 transition-transform duration-700`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-sky-950 via-brand-sky-950/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-5 right-5 z-10">
                    <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-white drop-shadow-md">{t(story.name)}</h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-extrabold text-orange-700 uppercase tracking-widest block">
                      {language === "am" ? "ሲነሳ / ከለውጥ በፊት" : "When Rescued (Before)"}
                    </span>
                    <p className="text-xs sm:text-sm text-orange-950 font-medium leading-relaxed">{t(story.storyBefore)}</p>
                  </div>

                  <div className="bg-brand-sky-50 border-2 border-brand-sky-200 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-extrabold text-brand-sky-700 uppercase tracking-widest block">
                      {language === "am" ? "አሁን ላይ / ከለውጥ በኋላ" : "Present Day (After Recovery)"}
                    </span>
                    <p className="text-xs sm:text-sm text-brand-sky-950 font-bold leading-relaxed">{t(story.storyAfter)}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 pt-2 flex items-center justify-between border-t border-gray-100 text-xs font-bold text-brand-sky-700">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-brand-sky-400 shrink-0" />
                  <span>{language === "am" ? "የሰሊሆም ህክምናና ተሃድሶ" : "Selihom Care & Rehabilitation"}</span>
                </div>
                <span className="text-brand-green-500 font-extrabold">100% {language === "am" ? "ነፃ" : "Free"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
