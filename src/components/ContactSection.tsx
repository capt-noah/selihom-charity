import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, CreditCard, Copy, Check, ExternalLink, ShieldCheck, Clock, Building2 } from "lucide-react";
import { SELIHOM_INFO, BANK_ACCOUNTS } from "../data";
import { useLanguage } from "../context/LanguageContext";

export default function ContactSection() {
  const { t, language } = useLanguage();
  const [copiedBank, setCopiedBank]   = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopy = (text: string, type: "bank" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "bank") { setCopiedBank(text); setTimeout(() => setCopiedBank(null), 2000); }
    else                 { setCopiedPhone(text); setTimeout(() => setCopiedPhone(null), 2000); }
  };

  return (
    <section id="contact" className="py-24 bg-brand-sky-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sky-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3">
            {language === "am" ? "ያግኙን" : "Contact Us"}
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-sky-950 tracking-tight mb-4">
            {language === "am" ? "አድራሻና ስልክ" : "Get in Touch"}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-gray-500 text-sm sm:text-base leading-relaxed">
            {language === "am" ? "ስልክ ቁጥሮቻችን ወይም ባንክ ሂሳቦቻችን ድጋፍ ያድርጉ።"
              : "Reach our team via phone or support through our verified bank accounts."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">

          {/* Phone card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-5 bg-white border-2 border-brand-sky-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-sky-400 text-white flex items-center justify-center mb-6 shadow-sm">
                <Phone className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-brand-sky-600 block mb-1">{language === "am" ? "ቀጥታ ስልክ" : "Direct Phone Lines"}</span>
              <h3 className="font-serif font-bold text-2xl text-brand-sky-950 mb-4">{language === "am" ? "ደውለው ያግኙን" : "Call Our Office"}</h3>
              <div className="space-y-3">
                {SELIHOM_INFO.contact.phones.map((phone) => (
                  <div key={phone} className="flex items-center justify-between p-3.5 bg-brand-sky-50 rounded-2xl border border-brand-sky-100 hover:border-brand-sky-300 transition-colors">
                    <a href={`tel:${phone}`} className="text-sm font-extrabold text-brand-sky-950 font-mono hover:underline">{phone}</a>
                    <button onClick={() => handleCopy(phone, "phone")}
                      className="px-3 py-1.5 rounded-xl bg-white border border-brand-sky-200 text-brand-sky-600 hover:border-brand-sky-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs">
                      {copiedPhone === phone
                        ? <><Check className="w-3.5 h-3.5 text-brand-green-500" /><span className="text-brand-green-600">{language === "am" ? "ተቀደ" : "Copied"}</span></>
                        : <><Copy className="w-3.5 h-3.5" /><span>{language === "am" ? "ቅዳ" : "Copy"}</span></>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-brand-sky-100 text-xs text-gray-400 font-medium">
              <Clock className="w-4 h-4 text-brand-sky-400" />
              <span>{language === "am" ? "ከሰኞ - እሁድ ክፍት" : "Open Mon - Sun"}</span>
            </div>
          </motion.div>

          {/* Bank accounts card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="lg:col-span-7 bg-brand-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-brand-sky-800 relative overflow-hidden flex flex-col justify-between">

            {/* Colour stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 flex">
              <div className="flex-1 bg-brand-sky-400" /><div className="flex-1 bg-brand-green-400" />
              <div className="flex-1 bg-brand-yellow-400" /><div className="flex-1 bg-brand-orange-400" />
            </div>

            <div className="mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-brand-sky-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-yellow-400 text-brand-sky-950 flex items-center justify-center shrink-0 shadow-md">
                    <CreditCard className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-brand-yellow-400">{language === "am" ? "ህጋዊ ሂሳቦች" : "Verified Accounts"}</span>
                      <ShieldCheck className="w-4 h-4 text-brand-green-400" />
                    </div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">{language === "am" ? "ቀጥታ ባንክ ሂሳቦች" : "Direct Bank Transfer"}</h3>
                  </div>
                </div>
                <div className="bg-brand-sky-900/80 border border-brand-sky-700 px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-sky-200 self-start sm:self-auto flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-yellow-400" /><span>Reg No. 6131</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BANK_ACCOUNTS.map((bank) => (
                  <div key={bank.accountNumber} className="p-4 bg-brand-sky-900/70 border border-brand-sky-800 hover:border-brand-yellow-400/60 rounded-2xl transition-all space-y-2 group">
                    <div className="text-[11px] font-black uppercase text-brand-yellow-400 tracking-wider flex items-center justify-between">
                      <span>{t(bank.bank)}</span>
                      <span className="text-[9px] bg-brand-yellow-400/20 text-brand-yellow-300 px-2 py-0.5 rounded-md font-mono">ETB</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-black text-base text-white tracking-wider">{bank.accountNumber}</span>
                      <button onClick={() => handleCopy(bank.accountNumber, "bank")}
                        className="px-3 py-1.5 bg-brand-yellow-400 hover:bg-brand-yellow-300 text-brand-sky-950 font-black text-[10px] uppercase rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0">
                        {copiedBank === bank.accountNumber
                          ? <><Check className="w-3.5 h-3.5" /><span>{language === "am" ? "ተቀደ" : "Copied"}</span></>
                          : <><Copy className="w-3.5 h-3.5" /><span>{language === "am" ? "ቅዳ" : "Copy"}</span></>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white border-2 border-brand-sky-100 rounded-3xl overflow-hidden shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">{language === "am" ? "የእንጦጦ ራጉኤል ማዕከል" : "Shelter Map (Entoto)"}</h3>
                <p className="text-xs text-gray-500">{t(SELIHOM_INFO.contact.address)}</p>
              </div>
            </div>
            <a href="https://maps.google.com/?q=Entoto+Raguel+Church+Addis+Ababa" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-sky-400 text-white hover:bg-brand-sky-500 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer">
              <span>{language === "am" ? "ጉግል ካርታ" : "Open Google Maps"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="w-full h-96 sm:h-[450px] rounded-2xl overflow-hidden border border-brand-sky-100 relative shadow-inner bg-gray-100">
            <iframe title="Selihom Shelter Map"
              src="https://maps.google.com/maps?q=Entoto+Raguel+Church,+Addis+Ababa,+Ethiopia&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0" loading="lazy" />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-200/80 text-xs shadow-lg max-w-sm">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sky-400 animate-pulse inline-block" />
                <span className="font-extrabold text-brand-sky-950 text-sm">Selihom Support Shelter</span>
              </div>
              <span className="text-xs text-gray-500 block font-medium">Entoto Raguel Area, Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
