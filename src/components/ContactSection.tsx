import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Phone,
  CreditCard,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
  Building2
} from "lucide-react";
import { SELIHOM_INFO, BANK_ACCOUNTS } from "../data";
import { useLanguage } from "../context/LanguageContext";

export default function ContactSection() {
  const { t, language } = useLanguage();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopy = (text: string, type: "bank" | "phone") => {
    navigator.clipboard.writeText(text);
    if (type === "bank") {
      setCopiedBank(text);
      setTimeout(() => setCopiedBank(null), 2000);
    } else {
      setCopiedPhone(text);
      setTimeout(() => setCopiedPhone(null), 2000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#FAF8F5] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green-950 tracking-tight mb-4"
          >
            {language === "am" ? "የመገናኛ አድራሻችን" : "Get in Touch"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-sm sm:text-base leading-relaxed"
          >
            {language === "am"
              ? "በስልክ ቁጥሮቻችን ወይም በህጋዊ የባንክ ሂሳቦቻችን ድጋፍ ለማድረግ ቀጥታ ያግኙን።"
              : "Reach out directly to our team via phone or support through verified bank accounts."
            }
          </motion.p>
        </div>

        {/* Top Grid: Phone Lines & Official Bank Accounts Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
          
          {/* Phone Lines Card (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white border-2 border-brand-green-950/10 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-green-950 text-brand-yellow-400 flex items-center justify-center mb-6 shadow-sm">
                <Phone className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-brand-green-800 block mb-1">
                {language === "am" ? "ቀጥታ ስልክ" : "Direct Phone Lines"}
              </span>
              <h3 className="font-serif font-bold text-2xl text-brand-green-950 mb-4">
                {language === "am" ? "ደውለው ያግኙን" : "Call Our Office"}
              </h3>
              
              <div className="space-y-3">
                {SELIHOM_INFO.contact.phones.map((phone) => (
                  <div
                    key={phone}
                    className="flex items-center justify-between p-3.5 bg-gray-50/90 rounded-2xl border border-gray-200 hover:border-brand-green-400 transition-colors"
                  >
                    <a href={`tel:${phone}`} className="text-sm font-extrabold text-brand-green-950 font-mono hover:underline">
                      {phone}
                    </a>
                    <button
                      onClick={() => handleCopy(phone, "phone")}
                      className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-brand-green-900 hover:border-brand-green-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                    >
                      {copiedPhone === phone ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-green-700">{language === "am" ? "ተገለበጠ" : "Copied"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>{language === "am" ? "ገልብጥ" : "Copy"}</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
              <Clock className="w-4 h-4 text-brand-green-700" />
              <span>{language === "am" ? "ከሰኞ - እሁድ ክፍት ነው" : "Open Mon - Sun (Office Hours)"}</span>
            </div>
          </motion.div>

          {/* Official Bank Accounts Card (7 cols - Dark Luxury Banner) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 bg-brand-green-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-brand-green-800 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-brand-green-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-yellow-500 text-brand-green-950 flex items-center justify-center shrink-0 shadow-md">
                    <CreditCard className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-brand-yellow-400">
                        {language === "am" ? "ህጋዊ የባንክ ሂሳቦች" : "Verified Bank Accounts"}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                      {language === "am" ? "የባንክ ሂሳብ ቁጥሮች" : "Direct Bank Transfer Accounts"}
                    </h3>
                  </div>
                </div>

                <div className="bg-brand-green-900/80 border border-brand-green-700/80 px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-yellow-400" />
                  <span>Reg No. 6131</span>
                </div>
              </div>

              {/* Bank accounts list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BANK_ACCOUNTS.map((bank) => (
                  <div
                    key={bank.accountNumber}
                    className="p-4 bg-brand-green-900/70 border border-brand-green-800 hover:border-brand-yellow-500/60 rounded-2xl transition-all space-y-2 group"
                  >
                    <div className="text-[11px] font-black uppercase text-brand-yellow-400 tracking-wider flex items-center justify-between">
                      <span>{t(bank.bank)}</span>
                      <span className="text-[9px] bg-brand-yellow-500/20 text-brand-yellow-300 px-2 py-0.5 rounded-md font-mono">
                        ETB
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-black text-base text-white tracking-wider">
                        {bank.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(bank.accountNumber, "bank")}
                        className="px-3 py-1.5 bg-brand-yellow-500 hover:bg-brand-yellow-400 text-brand-green-950 font-black text-[10px] uppercase rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0"
                      >
                        {copiedBank === bank.accountNumber ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{language === "am" ? "ተገለበጠ" : "Copied"}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{language === "am" ? "ገልብጥ" : "Copy"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Full-width Map Banner Card at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-brand-green-950/15 rounded-3xl overflow-hidden shadow-sm p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-green-100 text-brand-green-800 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-brand-green-950">
                  {language === "am" ? "የእንጦጦ ራጉኤል ማዕከል ካርታ" : "Interactive Shelter Map (Entoto)"}
                </h3>
                <p className="text-xs text-gray-600">
                  {language === "am" ? "ከእንጦጦ ቅዱስ ራጉኤል ቤተክርስቲያን ወደ ፍተሻ በሚወስደው መንገድ ላይ ይገኛል።" : "Located on the main road toward Fetesha from Entoto St. Raguel Church."}
                </p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Entoto+Raguel+Church+Addis+Ababa"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green-950 text-white hover:bg-brand-green-900 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span>{language === "am" ? "በጉግል ካርታ ክፈት" : "Open Google Maps"}</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-yellow-400" />
            </a>
          </div>

          <div className="w-full h-96 sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden border border-gray-200 relative shadow-inner bg-gray-100">
            <iframe
              title="Selihom Shelter Map"
              src="https://maps.google.com/maps?q=Entoto+Raguel+Church,+Addis+Ababa,+Ethiopia&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-200/80 text-xs shadow-lg max-w-sm">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green-600 animate-pulse inline-block" />
                <span className="font-extrabold text-brand-green-950 text-sm">Selihom Support Shelter</span>
              </div>
              <span className="text-xs text-gray-600 block font-medium">Entoto Raguel Area, Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
