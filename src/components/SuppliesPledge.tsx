import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Minus,
  UtensilsCrossed,
  Droplets,
  Stethoscope,
  Brain,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  getSupplyCategories,
  saveSuppliesPledge,
  SupplyCategory,
  SupplyItem,
  type SuppliesPledge as SuppliesPledgeType,
} from "../utils/adminStorage";
import {
  sanitizeText,
  sanitizePhone,
  isValidEmail,
  isNonEmpty,
} from "../utils/sanitize";
import LoadingDots from "./LoadingDots";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  UtensilsCrossed,
  Droplets,
  Stethoscope,
  Brain,
  Package,
};

const URGENCY_DOT: Record<string, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-400",
  Low: "bg-brand-sky-400",
};

const URGENCY_BADGE: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-brand-sky-100 text-brand-sky-700 border-brand-sky-200",
};

// ── Single supply item row ─────────────────────────────────────────────────────
function SupplyRow({
  item,
  qty,
  language,
  t,
  onChangeQty,
}: {
  item: SupplyItem;
  qty: number;
  language: string;
  t: (b: { en: string; am: string }) => string;
  onChangeQty: (id: string, delta: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = qty > 0;

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        selected
          ? "border-brand-sky-400 bg-brand-sky-50/40"
          : "border-gray-100 bg-white hover:border-brand-sky-200"
      }`}
    >
      {/* ── Collapsed row ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
      >
        {/* Urgency dot */}
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${URGENCY_DOT[item.urgency]}`}
        />

        {/* Name */}
        <span className="font-semibold text-sm text-brand-sky-950 flex-1 leading-snug">
          {t(item.name)}
        </span>

        {/* Needed qty — compact */}
        <span className="hidden sm:inline text-[10px] text-gray-400 font-medium shrink-0">
          {t(item.neededQty)}
        </span>

        {/* Urgency badge */}
        <span
          className={`hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${URGENCY_BADGE[item.urgency]}`}
        >
          {item.urgency}
        </span>

        {/* Qty badge if selected */}
        {selected && (
          <span className="bg-brand-sky-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
            ×{qty}
          </span>
        )}

        {/* Expand chevron */}
        <span className="text-gray-400 shrink-0 ml-1">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* ── Expanded detail ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3">
              {/* Impact description */}
              <p className="text-xs text-brand-sky-700 font-medium bg-brand-sky-50 border border-brand-sky-100 px-3 py-2 rounded-xl">
                {t(item.impactDesc)}
              </p>

              {/* Needed quantity */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  {language === "am" ? "ፍላጎት" : "Needed"}
                </span>
                <span className="font-black text-brand-sky-950">
                  {t(item.neededQty)}
                </span>
              </div>

              {/* Qty stepper */}
              <div
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 border ${
                  selected
                    ? "bg-brand-sky-50 border-brand-sky-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span className="text-xs font-bold text-gray-600">
                  {language === "am" ? "ብዛት" : "Pledge quantity"}
                </span>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeQty(item.id, -1);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 hover:bg-brand-sky-50 rounded-md cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-brand-sky-950 min-w-[32px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeQty(item.id, 1);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 hover:bg-brand-sky-50 rounded-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SuppliesPledge() {
  const { language, t } = useLanguage();

  const [categories, setCategories] = useState<SupplyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCatId, setActiveCatId] = useState<string>("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customItems, setCustomItems] = useState<
    { id: string; name: string; qty: number }[]
  >([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");

  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<SuppliesPledgeType | null>(null);

  useEffect(() => {
    getSupplyCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setActiveCatId(cats[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCatId);

  const changeQty = (itemId: string, delta: number) =>
    setQuantities((p) => ({
      ...p,
      [itemId]: Math.max(0, (p[itemId] || 0) + delta),
    }));

  const addCustom = () => {
    if (!customName.trim()) return;
    setCustomItems((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, name: customName.trim(), qty: 1 },
    ]);
    setCustomName("");
    setShowCustom(false);
  };

  const changeCustomQty = (id: string, delta: number) =>
    setCustomItems((prev) =>
      prev
        .map((it) =>
          it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it,
        )
        .filter((it) => it.qty > 0),
    );

  const selectedRegular = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([itemId, qty]) => {
      let itemName = "";
      for (const cat of categories) {
        const found = cat.items.find((it: SupplyItem) => it.id === itemId);
        if (found) {
          itemName = t(found.name);
          break;
        }
      }
      return { itemId, itemName, quantity: qty, custom: "" };
    });

  const selectedCustom = customItems.map((it) => ({
    itemId: it.id,
    itemName: it.name,
    quantity: it.qty,
    custom: it.name,
  }));

  const allSelected = [...selectedRegular, ...selectedCustom];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanName = sanitizeText(donorName, 120);
    const cleanPhone = sanitizePhone(donorPhone);
    const cleanEmail = sanitizeText(donorEmail, 120);

    if (!isNonEmpty(cleanName)) {
      setError(language === "am" ? "ስምዎን ያስገቡ።" : "Please enter your name.");
      return;
    }
    if (!isNonEmpty(cleanPhone) && !isNonEmpty(cleanEmail)) {
      setError(
        language === "am"
          ? "ስልክ ወይም ኢሜይልዎን ያስገቡ።"
          : "Please provide your phone or email.",
      );
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setError(
        language === "am" ? "ኢሜይሉ ትክክል አይደለም።" : "Please enter a valid email.",
      );
      return;
    }
    if (allSelected.length === 0) {
      setError(
        language === "am"
          ? "ቢያንስ 1 እቃ ይምረጡ።"
          : "Please select at least one item.",
      );
      return;
    }

    setSubmitting(true);
    const pledge: SuppliesPledgeType = {
      id: "SUP-" + Math.floor(Math.random() * 900000 + 100000),
      donorName: cleanName,
      donorPhone: cleanPhone,
      donorEmail: cleanEmail,
      categoryId: activeCatId,
      items: allSelected,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: "pledged",
      notes: sanitizeText(notes, 500),
    };
    await saveSuppliesPledge(pledge);
    setSubmitted(pledge);
    setSubmitting(false);
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 space-y-4 max-w-lg mx-auto"
      >
        <div className="w-16 h-16 bg-brand-sky-100 text-brand-sky-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>
        <span className="font-mono text-xs font-bold text-brand-sky-600 bg-brand-sky-50 border border-brand-sky-200 px-3 py-1 rounded-lg block w-fit mx-auto">
          {submitted.id}
        </span>
        <h3 className="font-serif text-2xl font-bold text-brand-sky-950">
          {language === "am"
            ? "ምስጋና! ቃልኪዳንዎ ደርሶናል።"
            : "Thank you! Pledge received."}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {language === "am"
            ? "አስተዳደር ቡድናችን ብዙም ሳይቆይ ያናጋጥዎናል።"
            : "Our team will contact you shortly to arrange the supply delivery."}
        </p>
        <button
          onClick={() => {
            setSubmitted(null);
            setQuantities({});
            setCustomItems([]);
            setDonorName("");
            setDonorPhone("");
            setDonorEmail("");
          }}
          className="px-6 py-2.5 bg-brand-sky-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-sky-500 cursor-pointer transition-colors"
        >
          {language === "am" ? "ሌላ ቃልኪዳን" : "Make Another Pledge"}
        </button>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 gap-2 text-brand-sky-400">
        <LoadingDots />
        <span className="text-sm font-medium">
          {language === "am" ? "በመጫን ላይ..." : "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Package;
          const isActive = activeCatId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? `${cat.color} text-white border-transparent shadow-md`
                  : "bg-white text-brand-sky-700 border-brand-sky-200 hover:border-brand-sky-400 hover:bg-brand-sky-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t(cat.name)}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          {/* Selection counter */}
          {allSelected.length > 0 && (
            <div className="flex items-center justify-between bg-brand-sky-50 border border-brand-sky-200 rounded-xl px-4 py-2.5">
              <span className="text-xs font-bold text-brand-sky-700">
                {allSelected.length}{" "}
                {language === "am" ? "እቃዎች ተምርጠዋል" : "item(s) selected"}
              </span>
            </div>
          )}

          {/* Item rows */}
          {activeCategory && (
            <div className="space-y-2 h-80 overflow-y-scroll pr-2 scrollbar-subtle">
              {activeCategory.items.map((item: SupplyItem) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  <SupplyRow
                    item={item}
                    qty={quantities[item.id] || 0}
                    language={language}
                    t={t}
                    onChangeQty={changeQty}
                  />
                </motion.div>
              ))}

              {/* Add custom item */}
              <div className="rounded-2xl border-2 border-dashed border-brand-sky-200 bg-white hover:border-brand-sky-400 transition-colors">
                {showCustom ? (
                  <div className="p-4 space-y-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder={
                        language === "am"
                          ? "ሌላ እቃ ስም..."
                          : "Custom item name..."
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none"
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addCustom())
                      }
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addCustom}
                        className="flex-1 py-2 bg-brand-sky-400 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-sky-500 transition-colors"
                      >
                        {language === "am" ? "ጨምር" : "Add"}
                      </button>
                      <button
                        onClick={() => {
                          setShowCustom(false);
                          setCustomName("");
                        }}
                        className="px-3 py-2 border border-gray-200 text-gray-500 rounded-xl text-xs cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCustom(true)}
                    className="w-full flex items-center gap-2 px-4 py-3.5 text-xs font-bold text-brand-sky-500 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {language === "am" ? "ሌላ እቃ ጨምር" : "Add a custom item"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Custom items list */}
          {customItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-sky-500">
                {language === "am" ? "ሌሎች እቃዎች" : "Custom Items"}
              </p>
              {customItems.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center gap-3 bg-white border-2 border-brand-sky-200 rounded-2xl px-4 py-3"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-sky-400 shrink-0" />
                  <span className="text-sm font-semibold text-brand-sky-950 flex-1">
                    {it.name}
                  </span>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                    <button
                      onClick={() => changeCustomQty(it.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 rounded-md cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-black text-brand-sky-950 min-w-[28px] text-center">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => changeCustomQty(it.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-brand-sky-600 rounded-md cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact form */}
        <div className="bg-white border-2 border-brand-sky-200 rounded-3xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-serif font-bold text-base text-brand-sky-950">
              {language === "am" ? "የእርስዎ መረጃ" : "Your Contact Info"}
            </h3>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <input
              type="text"
              required
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder={language === "am" ? "ሙሉ ስም *" : "Full Name *"}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder={language === "am" ? "ስልክ" : "Phone"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none"
              />
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder={language === "am" ? "ኢሜይል" : "Email"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none"
              />
            </div>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                language === "am" ? "ማስታወሻ (አማራጭ)" : "Notes (optional)"
              }
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none resize-none"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <span className="text-xs font-bold text-brand-sky-700 bg-brand-sky-50 border border-brand-sky-200 rounded-xl px-3 py-3 text-center sm:text-left">
                {language === "am" ? "የተመረጡ" : "Selected items"}:{" "}
                {allSelected.length}
              </span>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <LoadingDots label={language === "am" ? "በመላክ..." : "Sending..."} className="justify-center" />
                    {language === "am" ? "በመላክ..." : "Sending..."}
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    {language === "am" ? "ቃልኪዳን ላክ" : "Submit Pledge"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
