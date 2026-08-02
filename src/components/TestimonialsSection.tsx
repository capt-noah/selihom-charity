import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TESTIMONIALS } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { DotGridPattern, HelpingHandsSketch, EducationBookSketch } from "./Sketches";

export default function TestimonialsSection() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-24 bg-[#FAF8F5]/30 overflow-hidden border-t border-gray-100 relative">
      <div className="absolute top-10 right-4 md:right-16 text-brand-green-600/[0.04] pointer-events-none z-0 select-none">
        <HelpingHandsSketch className="w-56 h-56 rotate-[15deg]" />
      </div>
      <div className="absolute bottom-10 left-4 md:left-16 text-brand-yellow-600/[0.04] pointer-events-none z-0 select-none">
        <EducationBookSketch className="w-48 h-48 -rotate-[15deg]" />
      </div>

      <DotGridPattern />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Heading */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-5xl font-extrabold text-brand-green-950 mb-6 leading-tight tracking-tight"
            >
              {language === "am" ? (
                <>የተጠቃሚዎቻችን <br /><span className="text-brand-green-700 italic font-medium">ምስክርነትና ደስታ</span></>
              ) : (
                <>Voices of <br /><span className="text-brand-green-700 italic font-medium">Hope & Gratitude</span></>
              )}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gray-600 text-sm md:text-base leading-relaxed mb-8"
            >
              {language === "am"
                ? "በሰሊሆም ማህበር ድጋፍ ያገኙ ወገኖች፣ አረጋውያንና በጎ ፈቃደኞች ስለ ማህበሩ አገልግሎት የሰጡት አስተያየት።"
                : "Real words from our beneficiaries, community elders, and supporters whose lives have been transformed through Selihom's direct actions."
              }
            </motion.p>

            <div className="flex gap-2.5 justify-center lg:justify-start">
              <button
                onClick={prevTestimonial}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:border-brand-green-600 hover:text-brand-green-600 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:border-brand-green-600 hover:text-brand-green-600 flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -top-10 -left-10 text-brand-yellow-500/10 select-none pointer-events-none">
              <Quote className="w-32 h-32 rotate-180 fill-brand-yellow-500/5 text-brand-yellow-500/10" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-3xl p-8 md:p-10 border border-brand-green-100 relative z-10 flex flex-col justify-between min-h-[280px] shadow-xl"
              >
                <div>
                  <p className="text-brand-green-950 text-base md:text-lg font-medium leading-relaxed italic mb-8">
                    "{t(current.quote)}"
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-brand-green-100/60 pt-6">
                  <img
                    src={current.avatar}
                    alt={t(current.name)}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-yellow-500"
                  />
                  <div>
                    <h4 className="font-sans font-extrabold text-sm text-brand-green-950">
                      {t(current.name)}
                    </h4>
                    <p className="text-xs text-brand-green-700 font-bold uppercase tracking-wider">
                      {t(current.role)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-1.5 mt-6">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? "w-6 bg-brand-yellow-500" : "w-2 bg-brand-green-200"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
