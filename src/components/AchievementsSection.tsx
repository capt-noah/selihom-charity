import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Maximize2, X, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

import charityOwnerImg from "../assets/images/charity-owner.jpg";
import award1Img from "../assets/images/award1.jpg";
import award2Img from "../assets/images/award2.jpg";
import award3Img from "../assets/images/award3.jpg";
import award4Img from "../assets/images/award4.jpg";

interface GalleryItem {
  id: string;
  image: string;
  titleEn: string;
  titleAm: string;
  badgeEn: string;
  badgeAm: string;
  aspect?: string;
  featured?: boolean;
}

export const AchievementsSection: React.FC = () => {
  const { language } = useLanguage();
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: "owner",
      image: charityOwnerImg,
      titleEn: "Founder & Humanitarian Leadership",
      titleAm: "የድርጅቱ መስራችና የሰብአዊ አገልግሎት መሪ",
      badgeEn: "Founder Honor",
      badgeAm: "የመስራች አክብሮት",
      featured: true,
    },
    {
      id: "award1",
      image: award1Img,
      titleEn: "Official NGO Excellence & Certification",
      titleAm: "የመንግስት የክብር እውቅና የምስክር ወረቀት",
      badgeEn: "Official Certificate",
      badgeAm: "የምስክር ወረቀት",
    },
    {
      id: "award2",
      image: award2Img,
      titleEn: "Distinguished Service Award",
      titleAm: "የተለየ የበጎ አድራጎት ማረጋገጫ",
      badgeEn: "Merit Award",
      badgeAm: "የክብር ሽልማት",
    },
    {
      id: "award3",
      image: award3Img,
      titleEn: "National Humanitarian Recognition",
      titleAm: "ብሄራዊ የሰብአዊ እውቅና ማረጋገጫ",
      badgeEn: "National Honor",
      badgeAm: "ብሄራዊ እውቅና",
    },
    {
      id: "award4",
      image: award4Img,
      titleEn: "Distinguished VIP & Guest Visits",
      titleAm: "የታዋቂ ግለሰቦችና የእንግዶች ጉብኝት",
      badgeEn: "Dignitary Visit",
      badgeAm: "የክብር እንግዶች",
    },
  ];

  return (
    <section id="achievements" className="py-16 md:py-24 bg-gradient-to-b from-brand-green-50/40 via-white to-brand-green-50/20 border-b border-brand-green-100 relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-yellow-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-green-600/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Minimal Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-5xl font-bold text-brand-green-950 tracking-tight"
          >
            {language === "am"
              ? "የድርጅታችን እውቅና፣ ሽልማቶችና የክብር እንግዶች"
              : "Certified Excellence & Distinguished Recognition"}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-green-900/80 text-sm md:text-base mt-3 font-medium"
          >
            {language === "am"
              ? "ሰሊሆም በኢትዮጵያ በህጋዊ መልኩ ተመዝግቦ ለህብረተሰቡ የሚያበረክተውን የሰብአዊ አገልግሎት የሚያረጋግጡ የተገኙ ሽልማቶችና የክብር አባላት ጉብኝት"
              : "Visual proof of Selihom's official certifications, government accolades, and high-profile dignitary visits."}
          </motion.p>
        </div>

        {/* Full Stacked Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
          
          {/* Main Hero Card - Founder/Owner (Spans 5 columns on desktop) */}
          {galleryItems.filter(item => item.featured).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setActiveImage(item)}
              className="lg:col-span-5 group relative bg-white rounded-3xl p-3 border-2 border-brand-green-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div className="relative w-full h-[380px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-brand-green-950/5">
                <img
                  src={item.image}
                  alt={language === "am" ? item.titleAm : item.titleEn}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/90 via-brand-green-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Inspect Button Icon */}
                <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                  <Maximize2 className="w-5 h-5" />
                </div>

                {/* Bottom Content Banner */}
                <div className="absolute bottom-0 inset-x-0 p-6 text-white z-10 space-y-2">
                  <div className="flex items-center gap-2 text-brand-yellow-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === "am" ? "የድርጅቱ መስራች" : "Founder & Director"}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-white drop-shadow-sm">
                    {language === "am" ? item.titleAm : item.titleEn}
                  </h3>
                  <p className="text-xs text-brand-green-100 font-medium flex items-center gap-1 pt-1 opacity-90">
                    <span>{language === "am" ? "ለማሳደግና በግልጽ ለማየት ምስሉን ይጫኑ" : "Click image to view in full screen"}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Stacked 2x2 Grid of Certificates & Visits (Spans 7 columns on desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {galleryItems.filter(item => !item.featured).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClick={() => setActiveImage(item)}
                className="group relative bg-white rounded-2xl p-2.5 border-2 border-brand-green-100 hover:border-brand-green-300 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-[220px] sm:h-[225px] rounded-xl overflow-hidden bg-brand-green-950/5">
                  <img
                    src={item.image}
                    alt={language === "am" ? item.titleAm : item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/85 via-brand-green-950/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                  {/* Inspect Icon */}
                  <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-3.5 text-white z-10">
                    <h4 className="font-serif text-sm font-bold text-white leading-snug drop-shadow-xs line-clamp-2">
                      {language === "am" ? item.titleAm : item.titleEn}
                    </h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-brand-green-950/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-brand-green-950 border border-brand-green-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-brand-green-800/80 bg-brand-green-900/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-brand-yellow-500/10 text-brand-yellow-400 rounded-xl border border-brand-yellow-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                      {language === "am" ? activeImage.titleAm : activeImage.titleEn}
                    </h3>
                    <p className="text-xs text-brand-yellow-400 font-semibold uppercase tracking-wider">
                      {language === "am" ? activeImage.badgeAm : activeImage.badgeEn}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveImage(null)}
                  className="p-2.5 bg-brand-green-800 hover:bg-brand-green-700 text-gray-300 hover:text-white rounded-full transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Box */}
              <div className="p-3 sm:p-6 flex items-center justify-center bg-black/40 max-h-[75vh] overflow-auto">
                <img
                  src={activeImage.image}
                  alt={language === "am" ? activeImage.titleAm : activeImage.titleEn}
                  className="max-h-[68vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-brand-green-800/40"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-brand-green-800/80 bg-brand-green-900/40 text-center">
                <p className="text-xs sm:text-sm text-brand-green-100 font-medium">
                  {language === "am"
                    ? "የሰሊሆም በጎ አድራጎት ማህበር ይፋዊ ምስክር ወረቀትና የተገኙ እውቅናዎች"
                    : "Official Certificate & Certified Humanitarian Honor — Selihom Charity Organization"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AchievementsSection;
