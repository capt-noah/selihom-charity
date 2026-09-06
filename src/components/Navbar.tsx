import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Calendar, Heart, Languages } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { IMAGES, SELIHOM_INFO } from "../data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { to: "/",             label: { am: "መነሻ",      en: "Home"             } },
    { to: "/about",        label: { am: "ስለ እኛ",    en: "About"            } },
    { to: "/programs",     label: { am: "አገልግሎቶች", en: "Programs"         } },
    { to: "/stories",      label: { am: "ታሪኮች",    en: "Stories"          } },
    { to: "/events",       label: { am: "ፍቅር ድግሶች", en: "Events"          } },
    { to: "/news",         label: { am: "ዜናዎች",    en: "News"             } },
    { to: "/get-involved", label: { am: "ተሳተፉ",     en: "Get Involved"     } },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled
        ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-brand-sky-100 py-3"
        : "bg-white border-b border-gray-100 py-4"
    }`}>
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-10 flex items-center justify-between gap-3 lg:gap-4 xl:gap-8">

        {/* ── Section 1: Logo (Left) ── */}
        <button
          onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
          className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer text-left shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-brand-sky-400 shadow-xs group-hover:scale-105 transition-transform bg-white flex items-center justify-center p-0.5 shrink-0">
            <img src={IMAGES.selihomLogo} alt="Selihom Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-serif font-black text-lg sm:text-2xl tracking-tight block leading-none text-brand-sky-950 uppercase group-hover:text-brand-sky-600 transition-colors">
              {t(SELIHOM_INFO.name)}
            </span>
            <span className="text-[10px] text-brand-sky-500 font-bold block mt-1 tracking-wider uppercase">
              {t(SELIHOM_INFO.motto)}
            </span>
          </div>
        </button>

        {/* ── Section 2: Navbar Options (Center / Relaxed Middle) ── */}
        <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-2 xl:px-4">
          <div className="flex items-center gap-2 xl:gap-4 2xl:gap-6 flex-nowrap justify-center">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative py-1 px-1 xl:px-1.5 text-[11px] xl:text-xs font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-brand-sky-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-brand-sky-400"
                      : "text-gray-600 hover:text-brand-sky-500"
                  }`
                }
              >
                {t(item.label)}
              </NavLink>
            ))}
          </div>
        </div>

        {/* ── Section 3: Right Side Buttons (Right) ── */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 shrink-0">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer text-brand-sky-700 bg-brand-sky-50 hover:bg-brand-sky-100 border border-brand-sky-200/80 shrink-0"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-brand-sky-500" />
            <span>{language === "en" ? "አማርኛ" : "English"}</span>
          </button>

          <button
            onClick={() => navigate("/get-involved#visit")}
            className="flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 shrink-0 whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-brand-sky-500" />
            {language === "am" ? "ጉብኝት" : "Book Visit"}
          </button>

          <button
            onClick={() => navigate("/get-involved#donate")}
            className="flex items-center gap-1.5 px-3 xl:px-4 py-1.5 xl:py-2 text-xs font-black uppercase tracking-wider rounded-full shadow-sm shadow-brand-sky-400/25 transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-white bg-brand-sky-400 hover:bg-brand-sky-500 shrink-0 whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            {language === "am" ? "ይደግፉ" : "Support"}
          </button>
        </div>

        {/* ── Mobile controls ── */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full text-brand-sky-600 bg-brand-sky-50 border border-brand-sky-200"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === "en" ? "አማ" : "EN"}</span>
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl transition-colors cursor-pointer text-brand-sky-950 hover:bg-brand-sky-50 border border-transparent hover:border-brand-sky-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-b border-brand-sky-100"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `w-full text-left py-3 px-3 text-base font-semibold rounded-xl transition-colors ${
                      isActive
                        ? "text-brand-sky-500 bg-brand-sky-50 border-l-2 border-brand-sky-400 pl-4"
                        : "text-gray-700 hover:text-brand-sky-500 hover:bg-brand-sky-50"
                    }`
                  }
                >
                  {t(item.label)}
                </NavLink>
              ))}

              <div className="flex flex-col gap-2.5 pt-3 mt-1 border-t border-gray-100">
                <button
                  onClick={() => { setIsOpen(false); navigate("/get-involved#visit"); }}
                  className="w-full flex items-center justify-center gap-2 py-3 font-semibold text-brand-sky-700 bg-brand-sky-50 rounded-xl hover:bg-brand-sky-100 border border-brand-sky-200 transition-colors cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  {language === "am" ? "ጉብኝት ይያዙ" : "Book a Visit"}
                </button>
                <button
                  onClick={() => { setIsOpen(false); navigate("/get-involved#donate"); }}
                  className="w-full flex items-center justify-center gap-2 py-3 font-bold text-white bg-brand-sky-400 rounded-xl shadow-md shadow-brand-sky-400/20 hover:bg-brand-sky-500 transition-colors cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  {language === "am" ? "ይደግፉ" : "Support"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
