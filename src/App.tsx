import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import StoriesPage from "./pages/StoriesPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import EventsPage from "./pages/EventsPage";
import NewsPage from "./pages/NewsPage";

import { useLanguage } from "./context/LanguageContext";
import selihomLogo from "./assets/images/selihom_logo.jpg";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Thin gradient divider between sections
function TiletBand() {
  return (
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-sky-200/40 to-transparent pointer-events-none select-none" />
  );
}

function AppInner() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminPage, setIsAdminPage] = useState(() => {
    const p = window.location.pathname;
    return p.endsWith("/admin") || window.location.hash === "#admin";
  });

  // Admin routing (pushState, keeps existing backend SPA pattern)
  useEffect(() => {
    const handleLocation = () => {
      const p = window.location.pathname;
      setIsAdminPage(p.endsWith("/admin") || window.location.hash === "#admin");
    };
    window.addEventListener("popstate", handleLocation);
    window.addEventListener("hashchange", handleLocation);
    return () => {
      window.removeEventListener("popstate", handleLocation);
      window.removeEventListener("hashchange", handleLocation);
    };
  }, []);

  const openAdminPage = () => {
    const base = window.location.pathname.startsWith("/selihom") ? "/selihom/admin" : "/admin";
    window.history.pushState({}, "", base);
    setIsAdminPage(true);
    window.scrollTo(0, 0);
  };

  const closeAdminPage = () => {
    const base = window.location.pathname.startsWith("/selihom") ? "/selihom/" : "/";
    window.history.pushState({}, "", base);
    setIsAdminPage(false);
    window.scrollTo(0, 0);
  };

  // Loading splash
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  if (isAdminPage) {
    return <AdminDashboard isOpen={true} onClose={closeAdminPage} />;
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        /* ── Splash screen ── */
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center"
        >
          {/* Soft background blobs matching the hero */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sky-100/50 rounded-full blur-3xl pointer-events-none translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green-100/30 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4" />

          <div className="text-center space-y-6 max-w-sm px-6 relative z-10">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-28 h-28 mx-auto flex items-center justify-center bg-white rounded-2xl shadow-xl border-4 border-brand-sky-400 p-2 overflow-hidden"
            >
              <img
                src={selihomLogo}
                alt="Selihom Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </motion.div>
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-black text-brand-sky-950 tracking-tight uppercase">
                Selihom
              </h2>
              <p className="text-xs text-brand-sky-500 uppercase font-bold tracking-widest font-serif">
                ተስፋ • ፍቅር • አንድነት
              </p>
            </div>
            {/* 4-colour progress bar matching the logo */}
            <div className="w-32 h-1.5 bg-brand-sky-100 mx-auto rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-brand-sky-400 via-brand-green-400 to-brand-yellow-400"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        /* ── Main app ── */
        <motion.div
          key="main-app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen subtle-canvas-pattern font-sans text-gray-800 antialiased selection:bg-brand-sky-100 selection:text-brand-sky-800 relative overflow-x-hidden"
        >
          <Navbar />

          <main>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/stories" element={<StoriesPage />} />
              {/* Legacy redirect */}
              <Route path="/gallery" element={<StoriesPage />} />
              <Route path="/get-involved" element={<GetInvolvedPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsPage />} />
              {/* Fallback → home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <TiletBand />
          <Footer onOpenAdmin={openAdminPage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  // Support running nested under /selihom or standalone at root domain
  const basename = window.location.pathname.startsWith('/selihom') ? '/selihom' : '';

  return (
    <BrowserRouter basename={basename}>
      <AppInner />
    </BrowserRouter>
  );
}
