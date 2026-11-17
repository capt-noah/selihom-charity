import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_ITEMS } from "../data";
import { GalleryItem } from "../types";
import { useLanguage } from "../context/LanguageContext";

export default function GallerySection() {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 9;
  const displayedItems = showAll ? GALLERY_ITEMS : GALLERY_ITEMS.slice(0, INITIAL_COUNT);

  const activeItem = activeIndex !== null ? displayedItems[activeIndex] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! > 0 ? prev! - 1 : displayedItems.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((prev) => (prev! < displayedItems.length - 1 ? prev! + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, displayedItems.length]);

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "ፎቶ ማህደር" : "Photo Gallery"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4">
            {language === "am" ? "የተግባርና የህይወት ምስሎቻችን" : "Moments of Care & Recovery"}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base leading-relaxed">
            {language === "am"
              ? "ዕለታዊ ህክምና፣ ምግብ፣ የመጠለያና የትምህርት ስራዎቻችን የቀጥታ ፎቶዎች።"
              : "Real photo moments of psychiatric recovery, elder care, kitchen operations, and life at Selihom."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, idx) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: (idx % INITIAL_COUNT) * 0.04 }}
              onClick={() => setActiveIndex(idx)}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 border-2 border-brand-sky-100 shadow-sm hover:shadow-xl hover:border-brand-sky-300 transition-all cursor-pointer aspect-[4/3]">
              <img src={item.url} alt={t(item.title)}
                className={`w-full h-full object-cover ${item.imagePosition || "object-center"} transform group-hover:scale-105 transition-transform duration-700`} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-sky-950/85 via-brand-sky-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10 transform group-hover:-translate-y-1 transition-transform">
                <h3 className="font-serif font-bold text-base text-white leading-snug mb-1">{t(item.title)}</h3>
                {item.description && <p className="text-xs text-sky-100/80 line-clamp-2">{t(item.description)}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {GALLERY_ITEMS.length > INITIAL_COUNT && (
          <div className="mt-12 text-center">
            <button onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer">
              <span>{showAll ? (language === "am" ? "ጥቂቶችን አሳይ" : "Show Fewer") : (language === "am" ? `ተጨማሪ ምስሎች (${GALLERY_ITEMS.length - INITIAL_COUNT}+)` : `Load More (${GALLERY_ITEMS.length - INITIAL_COUNT}+)`)}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox with interactive slider */}
      <AnimatePresence>
        {activeItem && activeIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6"
            onClick={() => setActiveIndex(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-sky-950 text-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative border border-brand-sky-800 flex flex-col">
              
              {/* Close Button */}
              <button onClick={() => setActiveIndex(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close (Esc)">
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next controls */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image viewport */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img src={activeItem.url} alt={t(activeItem.title)} className="w-full h-full object-contain" />
              </div>

              {/* Caption & Counter */}
              <div className="p-5 sm:p-6 bg-brand-sky-950/95 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-brand-sky-800/60">
                <div className="space-y-1 max-w-2xl">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white">{t(activeItem.title)}</h3>
                  {activeItem.description && <p className="text-xs sm:text-sm text-sky-100/80 leading-relaxed">{t(activeItem.description)}</p>}
                </div>
                <div className="shrink-0 text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full text-brand-sky-300 border border-white/10">
                  {activeIndex + 1} / {displayedItems.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
