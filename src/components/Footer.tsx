import React from "react";
import { Mail, Phone, MapPin, ShieldCheck, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { SELIHOM_INFO, IMAGES } from "../data";

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  return (
    <footer className="bg-brand-sky-50 text-brand-sky-950 pt-20 pb-10 border-t border-brand-sky-200">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Main columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">

          {/* Logo & description */}
          <div className="md:col-span-5 space-y-5">
            <button onClick={() => { navigate("/"); window.scrollTo(0, 0); }} className="flex items-center gap-3 group text-left cursor-pointer">
              <img src={IMAGES.selihomLogo} alt="Selihom Logo" className="w-12 h-12 object-contain rounded-xl bg-white p-1 border-2 border-brand-sky-400 shadow-sm" />
              <div>
                <span className="font-serif font-black text-2xl tracking-tight block uppercase text-brand-sky-950 leading-none">
                  {t(SELIHOM_INFO.name)}
                </span>
                <span className="text-[10px] text-brand-sky-500 font-extrabold uppercase tracking-widest mt-1 block">
                  {language === "am" ? "የሀገር በቀል በጎ አድራጎት ድርጅት" : "Rehabilitation NGO · Reg No. 6131"}
                </span>
              </div>
            </button>

            <p className="text-brand-sky-700 text-xs leading-relaxed max-w-md">{t(SELIHOM_INFO.hero.description)}</p>

            {/* Colour stripe — echoes the three logo figures */}
            <div className="flex gap-1.5 pt-1">
              <span className="h-1 flex-1 rounded-full bg-brand-sky-400" />
              <span className="h-1 flex-1 rounded-full bg-brand-green-400" />
              <span className="h-1 flex-1 rounded-full bg-brand-yellow-400" />
              <span className="h-1 flex-1 rounded-full bg-brand-orange-400" />
            </div>

            <div className="pt-1">
              <span className="text-[10px] text-brand-sky-500 uppercase tracking-wider block font-bold mb-2">
                {language === "am" ? "የሶሻል ሚዲያ ገጾቻችን" : "Follow Us"}
              </span>
              <div className="flex gap-2 flex-wrap">
                <a href={SELIHOM_INFO.contact.social.telegram} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-brand-sky-300 bg-white hover:bg-brand-sky-400 hover:text-white hover:border-brand-sky-400 text-brand-sky-700 text-xs font-bold transition-all shadow-xs">
                  Telegram
                </a>
                <a href={SELIHOM_INFO.contact.social.facebook} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-brand-sky-300 bg-white hover:bg-brand-sky-400 hover:text-white hover:border-brand-sky-400 text-brand-sky-700 text-xs font-bold transition-all shadow-xs">
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif font-bold text-sm tracking-wide text-brand-sky-600 uppercase">
              {language === "am" ? "አድራሻና ስልክ" : "Address & Contact"}
            </h4>
            <div className="space-y-3 text-xs text-brand-sky-800">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-sky-400 shrink-0 mt-0.5" />
                <span>{t(SELIHOM_INFO.contact.address)}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {SELIHOM_INFO.contact.phones.map((phone, idx) => (
                    <a key={idx} href={`tel:${phone.replace(/\s/g, "")}`} className="block hover:text-brand-sky-500 transition-colors font-medium">{phone}</a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-sky-400 shrink-0" />
                <a href={`mailto:${SELIHOM_INFO.contact.email}`} className="hover:text-brand-sky-500 transition-colors font-medium">
                  {SELIHOM_INFO.contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif font-bold text-sm tracking-wide text-brand-sky-600 uppercase">
              {language === "am" ? "ህጋዊ ሁኔታ" : "Legal Registration"}
            </h4>
            <div className="space-y-3">
              <div className="flex gap-2.5 items-start bg-white p-3.5 rounded-2xl border border-brand-sky-200 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-brand-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block text-brand-sky-950">{language === "am" ? "የምዝገባ ቁጥር 6131" : "Registration No. 6131"}</span>
                  <span className="text-[10px] text-brand-sky-600 block leading-tight mt-0.5">
                    {language === "am" ? "ህጋዊ ፍቃድ ያለው ድርጅት" : "Officially registered non-profit."}
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 items-start bg-white p-3.5 rounded-2xl border border-brand-sky-200 shadow-xs">
                <Award className="w-5 h-5 text-brand-green-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold block text-brand-sky-950">{language === "am" ? "ቀጥተኛና ግልጽ አሰራር" : "Transparent & Accountable"}</span>
                  <span className="text-[10px] text-brand-sky-600 block leading-tight mt-0.5">
                    {language === "am" ? "ቀጥተኛ ድጋፍ ለተጠቃሚዎች" : "Direct care for all beneficiaries."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-brand-sky-200 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-sky-500 gap-4">
          <p>© {new Date().getFullYear()} {t(SELIHOM_INFO.fullName)}. All Rights Reserved.</p>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Link to="/programs"     className="hover:text-brand-sky-700 transition-colors font-medium">{language === "am" ? "አገልግሎቶች" : "Programs"}</Link>
            <Link to="/about"        className="hover:text-brand-sky-700 transition-colors font-medium">{language === "am" ? "ስለ እኛ"   : "About"}</Link>
            <Link to="/gallery"      className="hover:text-brand-sky-700 transition-colors font-medium">{language === "am" ? "ምስሎች"    : "Gallery"}</Link>
            <Link to="/get-involved" className="hover:text-brand-sky-700 transition-colors font-medium">{language === "am" ? "ይደግፉ"    : "Donate"}</Link>
            <button onClick={onOpenAdmin} className="text-brand-sky-400 font-bold hover:text-brand-sky-600 cursor-pointer transition-colors">
              {language === "am" ? "የአስተዳደር ገፅ" : "Admin Portal"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
