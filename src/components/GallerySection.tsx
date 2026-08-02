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
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green-950 tracking-tight mb-4"
          >
            {language === "am" ? "የስራዎቻችን ምስሎች" : "Visual Gallery"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-sm sm:text-base leading-relaxed"
          >
            {language === "am"
              ? "በሰሊሆም ማዕከል የሚከናወኑ ዕለታዊ የምግብ፣ የህክምና፣ የትምህርትና የተሃድሶ ስራዎችን በፎቶ ይመልከቱ።"
              : "Explore life at Selihom through real photo moments of recovery, study groups, elder care, and kitchen operations."
            }
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % INITIAL_COUNT) * 0.05 }}
                onClick={() => setActiveItem(item)}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-[4/3]"
              >
                <img
                  src={item.url}
                  alt={t(item.title)}
                  className={`w-full h-full object-cover ${item.imagePosition || "object-center"} transform group-hover:scale-105 transition-transform duration-700`}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/80 via-brand-green-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10 transform group-hover:-translate-y-1 transition-transform">
                  <h3 className="font-serif font-bold text-base text-white leading-snug mb-1">
                    {t(item.title)}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-emerald-100/80 line-clamp-2">
                      {t(item.description)}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More / Show Less Button */}
        {GALLERY_ITEMS.length > INITIAL_COUNT && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-green-950 text-white hover:bg-brand-green-900 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-brand-green-800"
            >
              <span>
                {showAll
                  ? language === "am"
                    ? "ጥቂቶችን አሳይ"
                    : "Show Fewer Pictures"
                  : language === "am"
                    ? "ተጨማሪ ምስሎችን አሳይ"
                    : "Load More Pictures"}
              </span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 text-brand-yellow-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-brand-yellow-400" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-green-950 text-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative border border-brand-green-800"
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={activeItem.url}
                  alt={t(activeItem.title)}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-serif font-bold text-xl text-white">
                  {t(activeItem.title)}
                </h3>
                {activeItem.description && (
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    {t(activeItem.description)}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
