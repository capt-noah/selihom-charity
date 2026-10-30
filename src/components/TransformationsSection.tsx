import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HeartHandshake, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { TRANSFORMATION_STORIES } from "../data";
import { DotGridPattern } from "./Sketches";

interface TransformationsSectionProps {
  isFullPage?: boolean;
  initialLimit?: number;
}

export default function TransformationsSection({
  isFullPage = false,
  initialLimit = 4,
}: TransformationsSectionProps) {
  const { t, language } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const displayedStories = isFullPage || expanded
    ? TRANSFORMATION_STORIES
    : TRANSFORMATION_STORIES.slice(0, initialLimit);

  return (
    <section id="transformations" className={`py-24 bg-white relative overflow-hidden ${isFullPage ? "" : "border-b border-brand-sky-100"}`}>
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
              ? "በሰሊሆም ማህበር ሁለንተናዊ ህክምና፣ ፍቅርና የስነ-አእምሮ ድጋፍ የተለወጡና ወደ ስራ የተመለሱ ተጠቃሚዎቻችን እውነተኛ ታሪኮች።"
              : "Real recovery stories from individuals rescued from street distress, healed through holistic psychiatric care, and empowered with sustainable livelihoods."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence>
            {displayedStories.map((story, idx) => (
              <motion.div key={story.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: (idx % initialLimit) * 0.08, duration: 0.4 }}
                className="bg-white rounded-3xl border-2 border-brand-sky-100 shadow-md hover:shadow-2xl hover:border-brand-sky-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative w-full aspect-[4/3] sm:h-[420px] overflow-hidden bg-brand-sky-950">
                    <img src={story.image} alt={t(story.name)}
                      className={`w-full h-full object-cover ${story.imagePosition || "object-center"} group-hover:scale-105 transition-transform duration-700`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-sky-950 via-brand-sky-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-5 right-5 z-10">
                      <span className="inline-block mb-1.5 px-3 py-0.5 bg-brand-yellow-400 text-brand-sky-950 text-[11px] font-black rounded-full shadow-sm">
                        {t(story.status)}
                      </span>
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

                <div className="px-6 sm:px-8 pb-6 pt-3 flex items-center justify-between border-t border-gray-100 text-xs font-bold text-brand-sky-700">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-brand-sky-400 shrink-0" />
                    <span>{language === "am" ? "የሰሊሆም ህክምናና ተሃድሶ" : "Selihom Care & Rehabilitation"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button for Home Page (2 rows -> 4 cards initially) */}
        {!isFullPage && TRANSFORMATION_STORIES.length > initialLimit && (
          <div className="mt-14 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-sm tracking-wider uppercase rounded-full shadow-lg shadow-brand-sky-400/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <span>
                {expanded
                  ? (language === "am" ? "ጥቂቶችን አሳይ" : "Show Fewer")
                  : (language === "am" ? "ተጨማሪ ታሪኮችን አሳይ" : "Show More Stories")}
              </span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
