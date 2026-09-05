import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pill,
  Users,
  AlertCircle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  getMedicineItems,
  saveMedicinePledge,
  MedicineItem,
  type MedicinePledge as MedicinePledgeType,
} from "../utils/adminStorage";
import {
  sanitizeText,
  sanitizePhone,
  isValidEmail,
  isNonEmpty,
} from "../utils/sanitize";
import LoadingDots from "./LoadingDots";

const URGENCY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-brand-sky-100 text-brand-sky-700 border-brand-sky-200",
};

// ── Single medicine row ────────────────────────────────────────────────────────
function MedicineRow({
  med,
  qty,
  language,
  onChangeQty,
}: {
  med: MedicineItem;
  qty: number;
  language: string;
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
          className={`w-2 h-2 rounded-full shrink-0 ${
            med.urgency === "High"
              ? "bg-red-500"
              : med.urgency === "Medium"
                ? "bg-amber-400"
                : "bg-brand-sky-400"
          }`}
        />

        {/* Name */}
        <span className="font-semibold text-sm text-brand-sky-950 flex-1 text-left leading-snug">
          {med.name}
        </span>

        {/* Patients helped — compact */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-brand-sky-600 font-bold shrink-0">
          <Users className="w-3 h-3" />
          {med.patientsHelped}
          <span className="text-gray-400 font-normal">
            {language === "am" ? "ታካሚ" : "pts"}
          </span>
        </div>

        {/* Urgency badge */}
        <span
          className={`hidden sm:inline text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${URGENCY_COLORS[med.urgency]}`}
        >
          {med.urgency}
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
              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed">
                {language === "am" ? med.description.am : med.description.en}
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white rounded-xl p-2 border border-gray-100">
                  <span className="text-[9px] text-gray-400 uppercase font-bold block">
                    {language === "am" ? "ወርሃዊ ብዛት" : "Monthly qty"}
                  </span>
                  <span className="text-sm font-black text-brand-sky-950">
                    {med.monthlyQty.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-gray-400 block">
                    {language === "am" ? "ክኒን" : "tablets"}
                  </span>
                </div>
                <div className="bg-white rounded-xl p-2 border border-gray-100">
                  <span className="text-[9px] text-gray-400 uppercase font-bold block">
                    {language === "am" ? "ዋጋ/ክኒን" : "Unit price"}
                  </span>
                  <span className="text-sm font-black text-brand-sky-950">
                    {med.unitPrice.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-gray-400 block">ETB</span>
                </div>
                <div className="bg-amber-50 rounded-xl p-2 border border-amber-100">
                  <span className="text-[9px] text-amber-600 uppercase font-bold block">
                    {language === "am" ? "ወርሃዊ ዋጋ" : "Monthly cost"}
                  </span>
                  <span className="text-sm font-black text-amber-900">
                    {(med.totalMonthly / 1000).toFixed(0)}K
                  </span>
                  <span className="text-[9px] text-amber-600 block">ETB</span>
                </div>
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
                  {language === "am" ? "ብዛት (ኩሪ)" : "Pledge quantity (strips)"}
                </span>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeQty(med.id, -1);
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
                      onChangeQty(med.id, 1);
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
export default function MedicinePledge() {
  const { language } = useLanguage();

  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customMedicines, setCustomMedicines] = useState<{ id: string; name: string }[]>([]);
  const [customName, setCustomName] = useState("");
  const [showCustomMedicine, setShowCustomMedicine] = useState(false);

  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<MedicinePledgeType | null>(null);

  useEffect(() => {
    getMedicineItems()
      .then(setMedicines)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const changeQty = (id: string, delta: number) =>
    setQuantities((p) => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedItems = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const med = medicines.find((m) => m.id === id);
      return { medicineId: id, medicineName: med?.name || "", quantity: qty };
    });
  const selectedCustomItems = customMedicines.map((item) => ({
    medicineId: item.id,
    medicineName: item.name,
    quantity: 1,
  }));
  const allSelectedItems = [...selectedItems, ...selectedCustomItems];

  const totalCost = selectedItems.reduce((sum, item) => {
    const med = medicines.find((m) => m.id === item.medicineId);
    return sum + (med?.unitPrice || 0) * item.quantity;
  }, 0);

  const addCustomMedicine = () => {
    const name = sanitizeText(customName, 120);
    if (!isNonEmpty(name)) return;
    setCustomMedicines((items) => [...items, { id: `custom-med-${Date.now()}`, name }]);
    setCustomName("");
    setShowCustomMedicine(false);
  };

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
    if (allSelectedItems.length === 0) {
      setError(
        language === "am"
          ? "ቢያንስ 1 መድሃኒት ይምረጡ።"
          : "Please select at least one medicine.",
      );
      return;
    }

    setSubmitting(true);
    const pledge: MedicinePledgeType = {
      id: "MED-" + Math.floor(Math.random() * 900000 + 100000),
      donorName: cleanName,
      donorPhone: cleanPhone,
      donorEmail: cleanEmail,
      items: allSelectedItems,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: "pledged",
      notes: sanitizeText(notes, 500),
    };
    await saveMedicinePledge(pledge);
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
            : "Our team will reach out shortly to coordinate the medicine delivery."}
        </p>
        <button
          onClick={() => {
            setSubmitted(null);
            setQuantities({});
            setCustomMedicines([]);
            setDonorName("");
            setDonorPhone("");
            setDonorEmail("");
          }}
          className="px-6 py-2.5 bg-brand-sky-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-brand-sky-500 transition-colors cursor-pointer"
        >
          {language === "am" ? "ሌላ ቃልኪዳን" : "Make Another Pledge"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  language === "am" ? "መድሃኒት ይፈልጉ..." : "Search medicines..."
                }
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-brand-sky-200 rounded-xl text-xs focus:border-brand-sky-400 outline-none"
              />
            </div>
            {!showCustomMedicine ? (
              <button type="button" onClick={() => setShowCustomMedicine(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-brand-sky-300 text-brand-sky-600 hover:bg-brand-sky-50 transition-colors text-xs font-bold shrink-0">
                <Plus className="w-4 h-4" />
                {language === "am" ? "ሌላ መድሃኒት" : "Custom medicine"}
              </button>
            ) : (
              <div className="flex gap-2 shrink-0">
                <input autoFocus value={customName} onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomMedicine())}
                  placeholder={language === "am" ? "የመድሃኒት ስም" : "Medicine name"}
                  className="w-36 px-3 py-2.5 bg-white border border-brand-sky-300 rounded-xl text-xs outline-none focus:border-brand-sky-500" />
                <button type="button" onClick={addCustomMedicine} className="px-3 rounded-xl bg-brand-sky-400 text-white text-xs font-bold hover:bg-brand-sky-500">Add</button>
                <button type="button" onClick={() => { setShowCustomMedicine(false); setCustomName(""); }} className="px-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>
          {customMedicines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customMedicines.map((item) => (
                <span key={item.id} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-sky-50 border border-brand-sky-200 px-2.5 py-1.5 text-[11px] font-semibold text-brand-sky-800">
                  {item.name}
                  <button type="button" onClick={() => setCustomMedicines((items) => items.filter((entry) => entry.id !== item.id))} className="text-brand-sky-500 hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}

          {/* Medicine list */}
          {loading ? (
            <div className="flex items-center justify-center h-80 gap-2 text-brand-sky-400">
              <LoadingDots />
              <span className="text-sm font-medium">
                {language === "am" ? "በመጫን ላይ..." : "Loading medicines..."}
              </span>
            </div>
          ) : (
            <div className="space-y-2 h-80 overflow-y-scroll pr-2 scrollbar-subtle">
              {filteredMedicines.map((med) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <MedicineRow
                    med={med}
                    qty={quantities[med.id] || 0}
                    language={language}
                    onChangeQty={changeQty}
                  />
                </motion.div>
              ))}
              {filteredMedicines.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-8">
                  {language === "am"
                    ? "ምንም አልተገኘም"
                    : "No medicines match your search."}
                </p>
              )}
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
                {language === "am" ? "ግምታዊ ድምር" : "Estimated total"}:{" "}
                {totalCost.toLocaleString()} ETB
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
                    <Pill className="w-4 h-4" />
                    {language === "am" ? "ቃልኪዳኑን ላክ" : "Submit Medicine Pledge"}
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
