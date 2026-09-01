import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { DotGridPattern } from "./Sketches";

export default function TestimonialsSection() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((p) => (p + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-24 bg-white overflow-hidden border-t border-gray-100 relative">
      <DotGridPattern />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left heading */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
              {language === "am" ? "ምስክርነቶች" : "Testimonials"}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-serif text-3xl md:text-5xl font-extrabold text-brand-sky-950 mb-6 leading-tight tracking-tight">
              {language === "am" ? (
                <>የተጠቃሚዎቻችን <br /><span className="text-brand-sky-400 italic font-medium">ምስክርነት</span></>
              ) : (
                <>Voices of <br /><span className="text-brand-sky-400 italic font-medium">Hope & Gratitude</span></>
              )}
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-gray-500 text-sm md:text-base leading-relaxed">
              {language === "am"
                ? "በሰሊሆም ማህበር ድጋፍ ያገኙ ወገኖችና በጎ ፈቃደኞች አስተያየት።"
                : "Real words from our beneficiaries, volunteers, and supporters whose lives were transformed by Selihom."}
            </motion.p>
          </div>

          {/* Right carousel */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -top-10 -left-10 text-brand-yellow-400/10 select-none pointer-events-none">
              <Quote className="w-32 h-32 rotate-180 fill-brand-yellow-400/5" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentIndex}
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-8 md:p-10 border-2 border-brand-sky-100 relative z-10 flex flex-col justify-between min-h-[280px] shadow-xl">

                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 flex rounded-t-3xl overflow-hidden">
                  <div className="flex-1 bg-brand-sky-400" />
                  <div className="flex-1 bg-brand-green-400" />
                  <div className="flex-1 bg-brand-yellow-400" />
                  <div className="flex-1 bg-brand-orange-400" />
                </div>

                <p className="text-brand-sky-950 text-base md:text-lg font-medium leading-relaxed italic mb-8 pt-2">
                  "{t(current.quote)}"
                </p>

                <div className="flex items-center gap-4 border-t border-brand-sky-100 pt-6">
                  <img src={current.avatar} alt={current.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-sky-400" />
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-brand-sky-950">{current.name}</h4>
                    <p className="text-xs text-brand-sky-500 font-bold uppercase tracking-wider">{t(current.role)}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots + arrow controls — right-aligned under the card */}
            <div className="flex items-center justify-between mt-6 px-1">
              <div className="flex items-center gap-1.5">
                {TESTIMONIALS.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentIndex(idx)} aria-label={`Slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${currentIndex === idx ? "w-6 bg-brand-sky-400" : "w-2 bg-brand-sky-200"}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={prev} aria-label="Previous"
                  className="w-11 h-11 rounded-full border-2 border-brand-sky-200 bg-white hover:bg-brand-sky-400 hover:border-brand-sky-400 hover:text-white text-brand-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={next} aria-label="Next"
                  className="w-11 h-11 rounded-full border-2 border-brand-sky-200 bg-white hover:bg-brand-sky-400 hover:border-brand-sky-400 hover:text-white text-brand-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
