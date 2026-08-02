import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X, Calendar, Gift, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { IMAGES, SELIHOM_INFO } from "../data";

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      id: "hero",
      label: { am: "መነሻ", en: "Home" }
    },
    {
      id: "initiatives",
      label: { am: "አገልግሎቶች", en: "Programs" }
    },
    {
      id: "about",
      label: { am: "ስለ እኛ", en: "About" }
    },
    {
      id: "gallery",
      label: { am: "ምስሎች", en: "Gallery" }
    },
    {
      id: "contact",
      label: { am: "አድራሻ", en: "Contact" }
    }
  ];

  const handleClick = (id: string) => {
    setIsOpen(false);
    onNavigate(id);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-green-950/95 backdrop-blur-md shadow-xl border-b border-brand-green-800/80 py-2.5"
          : "bg-brand-green-950 border-b border-brand-green-800/40 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Selihom Brand Logo */}
        <button
          onClick={() => handleClick("hero")}
          className="flex items-center gap-3 group cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-yellow-500 shadow-md group-hover:scale-105 transition-transform bg-white flex items-center justify-center p-0.5">
            <img
              src={IMAGES.selihomLogo}
              alt="Selihom Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="font-serif font-black text-xl sm:text-2xl tracking-tight block leading-none text-white uppercase">
              {t(SELIHOM_INFO.name)}
            </span>
            <span className="text-[10px] text-brand-yellow-400 font-bold block mt-0.5 tracking-wider uppercase">
              {t(SELIHOM_INFO.motto)}
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={`relative py-2 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                    isActive
                      ? "text-brand-yellow-400"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {t(item.label)}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-yellow-500 transition-all duration-300 origin-center ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pl-2 border-l border-brand-green-800">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-brand-yellow-400"
              title="Switch Language / ቋንቋ ይቀይሩ"
            >
              <Languages className="w-3.5 h-3.5 text-brand-yellow-400" />
              <span className="text-brand-yellow-400">{language === "en" ? "አማርኛ" : "English"}</span>
            </button>

            <button
              onClick={() => handleClick("visit")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer text-white bg-white/10 hover:bg-white/20 border border-white/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              {language === "am" ? "ጉብኝት ይያዙ" : "Book Visit"}
            </button>

            <button
              onClick={() => handleClick("donate")}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-full shadow-md transition-all hover:-translate-y-0.5 cursor-pointer text-brand-green-950 bg-brand-yellow-500 hover:bg-brand-yellow-400 shadow-brand-yellow-500/20"
            >
              <Gift className="w-3.5 h-3.5 fill-current/10" />
              {language === "am" ? "ይምረጡ / ይለግሱ" : "Donate"}
            </button>
          </div>
        </div>

        {/* Mobile Controls (Lang + Menu) */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full text-brand-yellow-400 bg-white/10 border border-white/20"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === "en" ? "አማ" : "EN"}</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg transition-colors cursor-pointer text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-green-950 border-b border-brand-green-800"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleClick(item.id)}
                    className={`w-full text-left py-2.5 text-base font-semibold transition-colors border-b border-brand-green-900 last:border-0 ${
                      isActive ? "text-brand-yellow-400 pl-2 border-l-2 border-l-brand-yellow-500" : "text-white/85 hover:text-white"
                    }`}
                  >
                    {t(item.label)}
                  </button>
                );
              })}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={() => handleClick("visit")}
                  className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-white bg-white/10 rounded-xl hover:bg-white/20"
                >
                  <Calendar className="w-5 h-5" />
                  {language === "am" ? "ጉብኝት ይያዙ" : "Book a Visit"}
                </button>
                <button
                  onClick={() => handleClick("donate")}
                  className="w-full flex items-center justify-center gap-2 py-3 font-bold text-brand-green-950 bg-brand-yellow-500 rounded-xl shadow-md shadow-brand-yellow-500/20"
                >
                  <Gift className="w-5 h-5" />
                  {language === "am" ? "ይለግሱ / ይደግፉ" : "Donate / Support"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
