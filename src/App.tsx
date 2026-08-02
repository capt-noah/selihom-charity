import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  Smile
} from "lucide-react";

// Components
import Navbar from "./components/Navbar";
import AchievementsSection from "./components/AchievementsSection";
import InitiativesSection from "./components/InitiativesSection";
import CoreValuesSection from "./components/CoreValuesSection";
import AboutSection from "./components/AboutSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import TransformationsSection from "./components/TransformationsSection";
import DonateSection from "./components/DonateSection";
import BookingSection from "./components/BookingSection";
import ImpactCounters from "./components/ImpactCounters";
import TestimonialsSection from "./components/TestimonialsSection";
import GetInvolvedSection from "./components/GetInvolvedSection";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import HeroCarousel from "./components/HeroCarousel";
import { HelpingHandsSketch, FoodNourishSketch, EducationBookSketch, HealthCareSketch } from "./components/Sketches";
import { useLanguage } from "./context/LanguageContext";
import selihomLogo from "./assets/images/selihom_logo.jpg";

// Subtle divider lines separating main page content
function TiletBand() {
  return (
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-green-200/45 to-transparent relative z-10 pointer-events-none select-none" />
  );
}

export default function App() {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState("hero");
  const [isLoading, setIsLoading] = useState(true);
  
  // Dedicated Admin Page route checking
  const [isAdminPage, setIsAdminPage] = useState(() => {
    return window.location.pathname === "/admin" || window.location.hash === "#admin";
  });

  useEffect(() => {
    const handleLocation = () => {
      setIsAdminPage(window.location.pathname === "/admin" || window.location.hash === "#admin");
    };
    window.addEventListener("popstate", handleLocation);
    window.addEventListener("hashchange", handleLocation);
    return () => {
      window.removeEventListener("popstate", handleLocation);
      window.removeEventListener("hashchange", handleLocation);
    };
  }, []);

  const openAdminPage = () => {
    window.history.pushState({}, "", "/admin");
    setIsAdminPage(true);
    window.scrollTo(0, 0);
  };

  const closeAdminPage = () => {
    window.history.pushState({}, "", "/");
    setIsAdminPage(false);
    window.scrollTo(0, 0);
  };

  // Cross-component state: choosing an initiative preset
  const [donateInitiativeId, setDonateInitiativeId] = useState<string | null>(null);
  const [donateCustomAmount, setDonateCustomAmount] = useState<number | null>(null);

  // Load state timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Track scrolling to set active menu links smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("hero");
        return;
      }

      const mainNavIds = ["hero", "initiatives", "about", "gallery", "contact"];
      let current = "hero";

      for (const id of mainNavIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInitiativeDonateSelect = (initiativeId: string, customAmount?: number) => {
    setDonateInitiativeId(initiativeId);
    if (customAmount) {
      setDonateCustomAmount(customAmount);
    } else {
      setDonateCustomAmount(null);
    }
    setTimeout(() => {
      handleNavigate("donate");
    }, 50);
  };

  const clearDonateSelection = () => {
    setDonateInitiativeId(null);
    setDonateCustomAmount(null);
  };

  if (isAdminPage) {
    return (
      <AdminDashboard isOpen={true} onClose={closeAdminPage} />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#FAF8F5] flex flex-col items-center justify-center"
        >
          <div className="text-center space-y-6 max-w-sm px-6">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-28 h-28 mx-auto flex items-center justify-center bg-white rounded-2xl shadow-md border-2 border-brand-green-100 p-2 overflow-hidden"
            >
              <img
                src={selihomLogo}
                alt="Selihom Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </motion.div>
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-black text-brand-green-950 tracking-tight uppercase">Selihom</h2>
              <p className="text-xs text-brand-green-700 uppercase font-bold tracking-widest font-serif">ተስፋ • ፍቅር • አንድነት</p>
            </div>
            <div className="w-24 h-1 bg-brand-green-100 mx-auto rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="h-full bg-brand-yellow-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen subtle-canvas-pattern font-sans text-gray-800 antialiased selection:bg-brand-green-100 selection:text-brand-green-800 relative overflow-x-hidden"
        >
          
          {/* Centered background sketches */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] pointer-events-none z-0 overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute top-[320px] -left-12 text-brand-green-600/[0.18] select-none">
                <HelpingHandsSketch className="w-64 h-64 rotate-[15deg]" />
              </div>
              <div className="absolute top-[1250px] -left-16 text-brand-yellow-600/[0.18] select-none">
                <FoodNourishSketch className="w-72 h-72 -rotate-12" />
              </div>
              <div className="absolute top-[2800px] -left-14 text-brand-green-600/[0.16] select-none">
                <HealthCareSketch className="w-64 h-64 rotate-[10deg]" />
              </div>
              <div className="absolute top-[400px] -right-12 text-brand-yellow-600/[0.18] select-none">
                <FoodNourishSketch className="w-64 h-64 rotate-12" />
              </div>
              <div className="absolute top-[2100px] -right-16 text-brand-green-600/[0.15] select-none">
                <EducationBookSketch className="w-68 h-68 rotate-45" />
              </div>
            </div>
          </div>

          {/* Header / Navbar */}
          <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

          {/* 1. HOME SECTION */}
          {/* Hero Section */}
          <section
            id="hero"
            className="relative pt-24 pb-14 md:pt-32 md:pb-20 2xl:pt-40 2xl:pb-28 overflow-hidden bg-transparent text-brand-green-950 border-b border-brand-green-100"
          >
            <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-brand-green-100/30 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-brand-yellow-500/5 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4 pointer-events-none" />

            <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-6 2xl:px-16 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-20 2xl:gap-28 items-center">
                
                {/* Left Narrative Column */}
                <div className="lg:col-span-6 text-center lg:text-left space-y-6 2xl:space-y-8">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight tracking-tight text-brand-green-950"
                  >
                    {language === "am" ? (
                      <>በኢትዮጵያ <span className="text-brand-green-700 italic font-medium">ተስፋንና</span> <br />አንድነትን ማጠናከር</>
                    ) : (
                      <>
                        <span className="block mb-1">EMPOWERING</span>
                        <span className="block mb-1"><span className="text-brand-green-700 italic font-medium">HOPE</span> &amp; UNITY</span>
                        <span className="block">IN <span className="text-brand-green-700">ETHIOPIA</span></span>
                      </>
                    )}
                    <span className="relative block mt-4 text-brand-yellow-600 font-serif text-3xl md:text-4xl 2xl:text-5xl tracking-wide font-normal">
                      {language === "am" ? "ተስፋ • ፍቅር • አንድነት" : "Hope • Love • Unity"}
                      <svg className="absolute -bottom-3.5 left-0 w-64 2xl:w-80 h-3 text-brand-yellow-500" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0,5 Q50,9 100,4" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                      </svg>
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                    className="text-brand-green-950/80 text-base md:text-lg 2xl:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium"
                  >
                    {language === "am"
                      ? "የአዕምሮ ህሙማንን፣ አዛውንቶችንና ህጻናትን በየቀኑ በምግብ፣ በህክምናና በትምህርት በመደገፍ ወደ ማህበረሰብ እንዲመለሱ እናስችላለን።"
                      : "We provide psychiatric treatment, warm daily kitchens, child study support, and elderly care for vulnerable citizens in Addis Ababa, Ethiopia."
                    }
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
                  >
                    <button
                      onClick={() => handleNavigate("donate")}
                      className="w-full sm:w-auto px-8 2xl:px-10 py-4 2xl:py-5 bg-brand-green-600 hover:bg-brand-green-700 text-white font-extrabold text-sm 2xl:text-base tracking-wider uppercase rounded-2xl shadow-xl shadow-brand-green-600/20 hover:shadow-brand-green-600/40 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
                    >
                      {language === "am" ? "አሁኑኑ ይለግሱ (በብር)" : "Donate Now (ETB)"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleNavigate("visit")}
                      className="w-full sm:w-auto px-8 2xl:px-10 py-4 2xl:py-5 bg-transparent border-2 border-brand-green-600/80 hover:border-brand-green-800 text-brand-green-950 font-bold text-sm 2xl:text-base tracking-wider uppercase rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      <Calendar className="w-4 h-4 text-brand-green-700" />
                      {language === "am" ? "የበጎ ፈቃድ ጉብኝት ይያዙ" : "Book Guided Visit"}
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-4 text-xs 2xl:text-sm font-semibold text-brand-green-900/80"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-brand-green-700 shrink-0" />
                      <span>{language === "am" ? "100% ቀጥተኛ እርዳታ" : "100% Direct Impact"}</span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-brand-green-300 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Smile className="w-5 h-5 text-brand-green-700 shrink-0" />
                      <span>{language === "am" ? "ምዝገባ ቁጥር 6131 (ሲቪል ማህበረሰብ)" : "Officially Registered NGO (Reg 6131)"}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Right Hero Transformation Carousel */}
                <div className="lg:col-span-6 relative flex items-center justify-center py-4">
                  <HeroCarousel onNavigateAchievements={() => handleNavigate("achievements")} />
                </div>

              </div>
            </div>
          </section>

          <TiletBand />

          {/* Owner Achievements, Certificates & Famous Guest Visits */}
          <AchievementsSection />
          <TiletBand />

          {/* Recovery Stories & Transformations */}
          <TransformationsSection />
          <TiletBand />

          {/* Programs (What We Do) */}
          <InitiativesSection onDonateSelect={handleInitiativeDonateSelect} />
          <TiletBand />

          {/* Core Values */}
          <CoreValuesSection />
          <TiletBand />

          {/* Impact Statistics */}
          <ImpactCounters />
          <TiletBand />

          {/* 2. ABOUT SECTION (Story/History, Vision, Mission, Objectives) */}
          <AboutSection />
          <TiletBand />

          <TestimonialsSection />
          <TiletBand />

          {/* Get Involved */}
          <GetInvolvedSection />
          <TiletBand />

          {/* DONATION SECTION */}
          <DonateSection
            initialInitiativeId={donateInitiativeId}
            initialCustomAmount={donateCustomAmount}
            onClearInitialValues={clearDonateSelection}
          />
          <TiletBand />

          {/* BOOK VISIT SECTION */}
          <BookingSection />
          <TiletBand />

          {/* 3. GALLERY SECTION (Images & Videos) */}
          <GallerySection />
          <TiletBand />

          {/* 4. CONTACT SECTION (Address, Phone Numbers, Bank Accounts, Map) */}
          <ContactSection />
          <TiletBand />

          {/* Footer */}
          <Footer onNavigate={handleNavigate} onOpenAdmin={openAdminPage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
