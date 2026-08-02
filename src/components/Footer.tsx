import React from "react";
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, ShieldCheck, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { SELIHOM_INFO, IMAGES } from "../data";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export default function Footer({ onNavigate, onOpenAdmin }: FooterProps) {
  const { t, language } = useLanguage();

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-green-950 text-white pt-20 pb-10 border-t border-brand-green-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          
          {/* Logo & Info Column */}
          <div className="md:col-span-5 space-y-5">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <img
                src={IMAGES.selihomLogo}
                alt="Selihom Logo"
                className="w-12 h-12 object-contain rounded-xl bg-white p-1"
              />
              <div>
                <span className="font-serif font-black text-2xl tracking-tight block uppercase text-white leading-none">
                  {t(SELIHOM_INFO.name)}
                </span>
                <span className="text-[10px] text-brand-yellow-400 font-extrabold uppercase tracking-widest mt-1 block">
                  {language === "am" ? "የሀገር በቀል በጎ አድራጎት ድርጅት" : "Rehabilitation NGO • Reg No. 6131"}
                </span>
              </div>
            </button>

            <p className="text-brand-green-100 text-xs leading-relaxed max-w-md">
              {t(SELIHOM_INFO.hero.description)}
            </p>

            <div className="pt-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-bold mb-2">
                {language === "am" ? "የሶሻል ሚዲያ ገጾቻችን" : "Follow Us"}
              </span>
              <div className="flex gap-2">
                <a
                  href={SELIHOM_INFO.contact.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-brand-green-800 bg-brand-green-900/50 hover:bg-brand-yellow-500 hover:text-brand-green-950 text-xs font-bold transition-all"
                >
                  Telegram Channel
                </a>
                <a
                  href={SELIHOM_INFO.contact.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-brand-green-800 bg-brand-green-900/50 hover:bg-brand-yellow-500 hover:text-brand-green-950 text-xs font-bold transition-all"
                >
                  Facebook Page
                </a>
              </div>
            </div>
          </div>

          {/* Contact Coordinates Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif font-bold text-sm tracking-wide text-brand-yellow-400 uppercase">
              {language === "am" ? "አድራሻና ስልክ ቁጥሮች" : "Address & Contact Info"}
            </h4>
            
            <div className="space-y-3 text-xs text-brand-green-100">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-green-500 shrink-0 mt-0.5" />
                <span>{t(SELIHOM_INFO.contact.address)}</span>
              </div>
              
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-green-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {SELIHOM_INFO.contact.phones.map((phone, idx) => (
                    <a key={idx} href={`tel:${phone.replace(/\s/g, '')}`} className="block hover:text-brand-yellow-400 transition-colors">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-green-500 shrink-0" />
                <a href={`mailto:${SELIHOM_INFO.contact.email}`} className="hover:text-brand-yellow-400 transition-colors">
                  {SELIHOM_INFO.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Registration & Legal Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-sm tracking-wide text-brand-yellow-400 uppercase">
              {language === "am" ? "ህጋዊ ሁኔታ" : "Legal Registration"}
            </h4>
            
            <div className="space-y-3">
              <div className="flex gap-2.5 items-start bg-brand-green-900/40 p-3.5 rounded-2xl border border-brand-green-800">
                <ShieldCheck className="w-5 h-5 text-brand-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block text-white">
                    {language === "am" ? "የምዝገባ ቁጥር 6131" : "Registration No. 6131"}
                  </span>
                  <span className="text-[10px] text-brand-green-200 block leading-tight mt-0.5">
                    {language === "am"
                      ? "በኢትዮጵያ ሲቪል ማህበረሰብ ድርጅቶች ባለስልጣን ህጋዊ ፍቃድ ያለው ድርጅት።"
                      : "Officially registered non-profit organization in Ethiopia."
                    }
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start bg-brand-green-900/40 p-3.5 rounded-2xl border border-brand-green-800">
                <Award className="w-5 h-5 text-brand-green-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block text-white">
                    {language === "am" ? "ቀጥተኛና ግልጽ አሰራር" : "Direct & Accountable"}
                  </span>
                  <span className="text-[10px] text-brand-green-200 block leading-tight mt-0.5">
                    {language === "am"
                      ? "ለአዕምሮ ህሙማን፣ አዛውንቶችና ህጻናት ቀጥተኛ ድጋፍ።"
                      : "Dedicated care, healthcare, and rehabilitation for beneficiaries."
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-brand-green-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-green-200 gap-4">
          <p>© {new Date().getFullYear()} {t(SELIHOM_INFO.fullName)}. All Rights Reserved.</p>
          <div className="flex gap-4">
            <button onClick={() => onNavigate("initiatives")} className="hover:text-white transition-colors cursor-pointer">
              {language === "am" ? "አገልግሎቶች" : "Programs"}
            </button>
            <button onClick={() => onNavigate("donate")} className="hover:text-white transition-colors cursor-pointer">
              {language === "am" ? "የባንክ ሂሳብ ቁጥሮች" : "Bank Accounts"}
            </button>
            <button onClick={() => onNavigate("visit")} className="hover:text-white transition-colors cursor-pointer">
              {language === "am" ? "ጉብኝት" : "Guided Tour"}
            </button>
            <button onClick={onOpenAdmin} className="text-brand-yellow-400 font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1">
              <span>{language === "am" ? "የአስተዳደር ገፅ" : "Admin Portal"}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
