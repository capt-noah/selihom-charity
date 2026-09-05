import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { GALLERY_ITEMS } from "../data";
import { GalleryItem } from "../types";
import { useLanguage } from "../context/LanguageContext";

export default function GallerySection() {
  const { t, language } = useLanguage();
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [showAll, setShowAll] = useState(false);

  const INITIAL_COUNT = 6;
  const displayedItems = showAll ? GALLERY_ITEMS : GALLERY_ITEMS.slice(0, INITIAL_COUNT);

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "ምስሎቻችን" : "Inspiring Stories"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4">
            {language === "am" ? "የህይወት ታሪኮቻችን" : "Inspiring Stories"}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base leading-relaxed">
            {language === "am"
              ? "ዕለታዊ ህክምና፣ ምግብ እና ትምህርት ስራዎቻችን ፎቶዎች።"
              : "Real photo moments of recovery, elder care, kitchen operations, and study groups at Selihom."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, idx) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: (idx % INITIAL_COUNT) * 0.05 }}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 border-2 border-brand-sky-100 shadow-sm hover:shadow-xl hover:border-brand-sky-300 transition-all cursor-pointer aspect-[4/3]">
              <img src={item.url} alt={t(item.title)}
                className={`w-full h-full object-cover ${item.imagePosition || "object-center"} transform group-hover:scale-105 transition-transform duration-700`} />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-sky-950/80 via-brand-sky-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
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
              <span>{showAll ? (language === "am" ? "ጥቂቶችን አሳይ" : "Show Fewer") : (language === "am" ? "ተጨማሪ ምስሎች" : "Load More")}</span>
              {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setActiveItem(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-sky-950 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-brand-sky-800">
              <button onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img src={activeItem.url} alt={t(activeItem.title)} className="w-full h-full object-contain" />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif font-bold text-xl text-white">{t(activeItem.title)}</h3>
                {activeItem.description && <p className="text-xs text-sky-100/80 leading-relaxed">{t(activeItem.description)}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
