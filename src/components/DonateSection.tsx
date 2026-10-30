import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Check,
  Package,
  Building,
  Copy,
  PhoneCall,
  Coins,
} from "lucide-react";
import { BANK_ACCOUNTS, SELIHOM_INFO } from "../data";
import { BankAccount } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { getBankAccounts } from "../utils/adminStorage";
import { DotGridPattern } from "./Sketches";
import SuppliesPledge from "./SuppliesPledge";

interface DonateSectionProps {
  initialInitiativeId?: string | null;
  initialCustomAmount?: number | null;
  onClearInitialValues: () => void;
}

export default function DonateSection({
  initialInitiativeId,
  initialCustomAmount,
  onClearInitialValues,
}: DonateSectionProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"money" | "inkind">("money");
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(BANK_ACCOUNTS);

  useEffect(() => {
    getBankAccounts()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          setBankAccounts(accounts);
        }
      })
      .catch(() => {});
  }, [activeTab]);

  useEffect(() => {
    if (initialInitiativeId || initialCustomAmount) {
      const el = document.getElementById("donate");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      onClearInitialValues();
    }
  }, [initialInitiativeId, initialCustomAmount]);

  const copy = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(acc);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  return (
    <section
      id="donate"
      className="py-24 bg-white relative overflow-hidden border-t border-brand-sky-100"
    >
      <DotGridPattern />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-[11px] font-black uppercase tracking-widest text-brand-sky-500 mb-3"
          >
            {language === "am" ? "ይደግፉ" : "Ways to Support"}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-brand-sky-950 mb-4 tracking-tight leading-tight"
          >
            {language === "am" ? (
              <>
                ለሰሊሆም{" "}
                <span className="text-brand-sky-400 italic font-medium">
                  ድጋፍ ያድርጉ
                </span>
              </>
            ) : (
              <>
                Ways to{" "}
                <span className="text-brand-sky-400 italic font-medium">
                  Support Selihom
                </span>
              </>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm md:text-base leading-relaxed"
          >
            {language === "am"
              ? "በባንክ ሂሳቦቻችን የገንዘብ ድጋፍ በማድረግ ወይም በምግብ፣ በቁሳቁስና በመድሃኒት የዓይነት እቃዎች ድጋፍዎን ያድርሱን።"
              : "Support Selihom through direct bank contributions (Money) or categorized in-kind supplies and medicines."}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border-2 border-brand-sky-100 overflow-hidden shadow-xl max-w-5xl mx-auto"
        >
          {/* Two Primary Ways to Support: Money & In-Kind Pledges */}
          <div className="relative z-10 grid grid-cols-2 border-b border-brand-sky-100 bg-brand-sky-50/50">
            <button
              onClick={() => setActiveTab("money")}
              className={`py-4 sm:py-5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "money"
                  ? "border-brand-sky-400 text-brand-sky-600 bg-white shadow-xs"
                  : "border-transparent text-gray-400 hover:text-brand-sky-500"
              }`}
            >
              <Coins className="w-5 h-5 shrink-0 text-amber-500" />
              <span>{language === "am" ? "ገንዘብ" : "Money"}</span>
            </button>

            <button
              onClick={() => setActiveTab("inkind")}
              className={`py-4 sm:py-5 text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "inkind"
                  ? "border-brand-sky-400 text-brand-sky-600 bg-white shadow-xs"
                  : "border-transparent text-gray-400 hover:text-brand-sky-500"
              }`}
            >
              <Package className="w-5 h-5 shrink-0 text-brand-sky-500" />
              <span>{language === "am" ? "የዓይነት ድጋፍ" : "In-Kind Pledges"}</span>
            </button>
          </div>

          <div className="relative z-0 p-6 md:p-10 overflow-hidden">
            {/* ── MONEY / BANK ACCOUNTS ── */}
            {activeTab === "money" && (
              <div className="space-y-8">
                <div className="text-center max-w-xl mx-auto mb-6">
                  <span className="text-brand-sky-600 text-[11px] font-black uppercase tracking-widest block mb-2">
                    {language === "am"
                      ? "ህጋዊ የባንክ ሂሳቦች"
                      : "Official NGO Bank Accounts"}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-brand-sky-950">
                    {t(SELIHOM_INFO.fullName)}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {language === "am"
                      ? "በሞባይል ባንኪንግ ወይም በቅርንጫፍ ቀጥታ ገቢ ማድረግ ይቻላል።"
                      : "Deposit directly via Mobile Banking (Telebirr/CBE Birr) or at any branch."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bankAccounts.map((acc, idx) => {
                    const colours = [
                      "bg-brand-sky-400",
                      "bg-brand-green-400",
                      "bg-brand-yellow-400",
                      "bg-indigo-500",
                    ];
                    return (
                      <div
                        key={idx}
                        className="bg-gray-50 hover:bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-brand-sky-300 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div
                            className={`w-10 h-10 rounded-xl ${colours[idx % colours.length]} text-white font-serif font-black flex items-center justify-center text-lg mb-4 shadow-sm`}
                          >
                            {idx + 1}
                          </div>
                          <h4 className="font-serif font-extrabold text-brand-sky-950 text-base mb-1">
                            {t(acc.bank)}
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-brand-sky-950 mb-2">
                            {acc.accountName}
                          </p>
                          <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between gap-2 shadow-inner">
                            <span className="font-mono font-black text-xs sm:text-sm text-brand-sky-950 tracking-wider break-all">
                              {acc.accountNumber}
                            </span>
                            <button
                              onClick={() => copy(acc.accountNumber)}
                              className="p-1.5 hover:bg-brand-sky-50 text-brand-sky-500 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Copy Account Number"
                            >
                              {copiedAccount === acc.accountNumber ? (
                                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => copy(acc.accountNumber)}
                          className="mt-5 w-full py-2.5 bg-brand-sky-950 hover:bg-brand-sky-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                          {copiedAccount === acc.accountNumber ? (
                            <>
                              <Check className="w-4 h-4 text-brand-yellow-400" />
                              <span>{language === "am" ? "ተቀድቷል!" : "Copied!"}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>{language === "am" ? "ቁጥሩን ቅዳ" : "Copy Account No"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-brand-sky-950 text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-brand-yellow-400 text-[10px] font-black uppercase tracking-widest block">
                      {language === "am" ? "ቀጥታ ስልክ" : "Direct Phone Contact"}
                    </span>
                    <h4 className="font-serif text-xl font-bold text-white">
                      {language === "am" ? "ለበለጠ ድጋፍና መረጃ ይደውሉ" : "Call Us for Direct Donations"}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
                    {SELIHOM_INFO.contact.phones.map((phone, pIdx) => (
                      <a
                        key={pIdx}
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="px-4 py-2 bg-white/10 hover:bg-brand-yellow-400 hover:text-brand-sky-950 text-white font-mono font-extrabold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── IN-KIND PLEDGES (Supplies + Medicines with Goals Scale) ── */}
            {activeTab === "inkind" && (
              <div>
                <SuppliesPledge />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
