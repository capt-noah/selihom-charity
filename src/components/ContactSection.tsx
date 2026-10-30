import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Phone,
  Copy,
  Check,
  ExternalLink,
  Mail,
  MessageCircle,
} from "lucide-react";
import { SELIHOM_INFO } from "../data";
import { useLanguage } from "../context/LanguageContext";
import { getSiteSettings, SiteSettings } from "../utils/adminStorage";

export default function ContactSection() {
  const { t, language } = useLanguage();
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const phones = settings?.contact?.phones?.length ? settings.contact.phones : SELIHOM_INFO.contact.phones;
  const email = settings?.contact?.email || SELIHOM_INFO.contact.email;
  const address = settings?.contact?.address || SELIHOM_INFO.contact.address;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(text);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <section
      id="contact"
      className="py-24 bg-brand-sky-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sky-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3"
          >
            {language === "am" ? "ያግኙን" : "Contact Us"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4"
          >
            {language === "am" ? "አድራሻና ስልክ" : "Get in Touch"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base leading-relaxed"
          >
            {language === "am"
              ? "በስልክ ወይም በኢሜይል ቡድናችንን ያግኙ።"
              : "Reach our team directly by phone or email."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-stretch">
          {/* Phone card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="h-full bg-white border-2 border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b border-brand-sky-100 pb-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-sky-400 text-white flex items-center justify-center shadow-sm shrink-0">
                  <Phone className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-sky-600 block">
                    {language === "am" ? "ቀጥታ ስልክ" : "Direct Phone Lines"}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-brand-sky-950">
                    {language === "am" ? "ደውለው ያግኙን" : "Call Our Office"}
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {phones.map((phone) => (
                  <div
                    key={phone}
                    className="flex flex-col gap-2 p-3 bg-brand-sky-50 rounded-xl border border-brand-sky-100 hover:border-brand-sky-300 transition-colors"
                  >
                    <a
                      href={`tel:${phone}`}
                      className="text-sm font-extrabold text-brand-sky-950 font-mono hover:text-brand-sky-500"
                    >
                      {phone}
                    </a>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg bg-brand-sky-400 text-white hover:bg-brand-sky-500 text-[11px] font-bold cursor-pointer transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {language === "am" ? "ደውል" : "Call"}
                      </a>
                      <button
                        onClick={() => handleCopy(phone)}
                        className="px-2 py-1.5 rounded-lg bg-white border border-brand-sky-200 text-brand-sky-600 hover:border-brand-sky-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copiedPhone === phone ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-brand-green-500" />
                            <span className="text-brand-green-600">
                              {language === "am" ? "ተቀደ" : "Copied"}
                            </span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{language === "am" ? "ቅዳ" : "Copy"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-brand-sky-700 hover:text-brand-sky-500"
                  >
                    <Mail className="w-4 h-4" />
                    {email}
                  </a>
                  <span className="inline-flex items-center gap-1.5 text-gray-500">
                    <MessageCircle className="w-4 h-4 text-brand-green-500" />
                    {language === "am" ? "በየቀኑ ክፍት" : "Open every day"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-full bg-white border-2 border-brand-sky-100 rounded-3xl overflow-hidden shadow-sm p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">
                  {language === "am"
                    ? "የእንጦጦ ራጉኤል ማዕከል"
                    : "Shelter Map (Entoto)"}
                </h3>
                <p className="text-xs text-gray-500">
                  {t(address)}
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Entoto+Raguel+Church+Addis+Ababa"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-sky-400 text-white hover:bg-brand-sky-500 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <span>{language === "am" ? "ጉግል ካርታ" : "Open Google Maps"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-brand-sky-100 relative shadow-inner bg-gray-100">
            <iframe
              title="Selihom Shelter Map"
              src="https://maps.google.com/maps?q=Entoto+Raguel+Church,+Addis+Ababa,+Ethiopia&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-200/80 text-xs shadow-lg max-w-sm">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sky-400 animate-pulse inline-block" />
                <span className="font-extrabold text-brand-sky-950 text-sm">
                  Selihom Support Shelter
                </span>
              </div>
              <span className="text-xs text-gray-500 block font-medium">
                Entoto Raguel Area, Addis Ababa, Ethiopia
              </span>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
