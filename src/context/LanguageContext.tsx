import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "../types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (obj: { en: string; am: string } | string | undefined) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("selihom_lang");
    return (saved === "am" || saved === "en") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("selihom_lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "am" : "en"));
  };

  const t = (obj: { en: string; am: string } | string | undefined): string => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[language] || obj.en || "";
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
