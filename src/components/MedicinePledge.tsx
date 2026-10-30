import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pill,
  Users,
  AlertCircle,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  X,
  Calendar,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import {
  getMedicineItems,
  getMedicinePledges,
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

// ── Single medicine row with polished collapsed & expanded progress scale ────
export function MedicineRow({
  med,
  qty,
  pledgedSoFar = 0,
  language,
  onChangeQty,
}: {
  med: MedicineItem;
  qty: number;
  pledgedSoFar?: number;
  language: string;
  onChangeQty: (id: string, delta: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = qty > 0;

  // Monthly goal and progress calculation
  const targetGoal = Math.max(1, med.monthlyQty || 100);
  const totalWithSelected = pledgedSoFar + qty;
  const progressPercent = Math.min(100, Math.round((totalWithSelected / targetGoal) * 100));
  const remainingNeeded = Math.max(0, targetGoal - totalWithSelected);

  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        selected
          ? "border-rose-400 bg-rose-50/30"
          : "border-gray-100 bg-white hover:border-rose-200"
      }`}
    >
      {/* ── Collapsed row — 2 Rows Minimalistic ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full p-3.5 text-left cursor-pointer hover:bg-rose-50/20 transition-colors space-y-2.5 block"
      >
        {/* Row 1: Name on Left, People Icon + Number & Priority Pill & Qty & Chevron on Right */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                med.urgency === "High"
                  ? "bg-red-500 ring-2 ring-red-200"
                  : med.urgency === "Medium"
                    ? "bg-amber-400 ring-2 ring-amber-200"
                    : "bg-brand-sky-400 ring-2 ring-brand-sky-200"
              }`}
            />
            <span className="font-serif font-bold text-sm sm:text-base text-brand-sky-950 truncate">
              {med.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* People Helped: Icon + Number ONLY */}
            <div className="flex items-center gap-1 text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
              <Users className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{med.patientsHelped}</span>
            </div>

            {/* Priority Pill: Urgency level ONLY (no "priority" text) */}
            <span
              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${URGENCY_COLORS[med.urgency]}`}
            >
              {language === "am"
                ? med.urgency === "High"
                  ? "ከፍተኛ"
                  : med.urgency === "Medium"
                    ? "መካከለኛ"
                    : "ዝቅተኛ"
                : med.urgency}
            </span>

            {/* Selected Qty Badge */}
            {selected && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 shadow-xs">
                ×{qty}
              </span>
            )}

            {/* Expand chevron */}
            <span className="text-gray-400 shrink-0 ml-0.5 hover:text-brand-sky-950 transition-colors">
              {open ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </div>
        </div>

        {/* Row 2: Progress Bar & Status */}
        <div className="space-y-1">
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200/60 shadow-inner">
            <div
              className="bg-linear-to-r from-rose-400 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium">
            <span>
              {language === "am" ? "የተሰበሰበ:" : "Progress:"}{" "}
              <strong className="text-brand-sky-950 font-bold">
                {totalWithSelected.toLocaleString()}
              </strong>{" "}
              / {targetGoal.toLocaleString()} {language === "am" ? "ክኒኖች" : "units"}
            </span>
            <span
              className={`font-black ${
                progressPercent >= 100
                  ? "text-emerald-700"
                  : progressPercent >= 50
                    ? "text-amber-700"
                    : "text-rose-600"
              }`}
            >
              {progressPercent}% {language === "am" ? "ተሟልቷል" : "funded"}
            </span>
          </div>
        </div>
      </button>

      {/* ── Expanded detail — Rich motivational scale ── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 border-t border-gray-100 space-y-3.5">
              {/* Motivational Goal Scale Box */}
              <div className="bg-linear-to-r from-emerald-50/80 to-rose-50/80 border border-emerald-200/70 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-brand-sky-950">
                    <Target className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === "am" ? "ወርሃዊ የፍላጎት ግብ" : "Monthly Need Goal"}</span>
                  </div>
                  <span className="font-mono font-black text-brand-sky-900">
                    {totalWithSelected.toLocaleString()} / {targetGoal.toLocaleString()}{" "}
                    <span className="text-[10px] text-gray-500 font-normal">
                      {language === "am" ? "ክኒን" : "tablets"}
                    </span>
                  </span>
                </div>

                {/* Main Progress Bar Scale */}
                <div className="w-full bg-white/80 border border-emerald-200/50 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="bg-linear-to-r from-rose-400 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {progressPercent >= 100
                      ? language === "am"
                        ? "🎉 ወርሃዊው ግብ ተሳክቷል!"
                        : "🎉 Monthly goal reached!"
                      : language === "am"
                        ? `ግብ ለማሟላት ${remainingNeeded.toLocaleString()} ክኒን ይቀራሉ`
                        : `${remainingNeeded.toLocaleString()} more needed to meet goal`}
                  </span>
                  <span className="font-bold text-rose-700 bg-white px-2 py-0.5 rounded-lg border border-rose-100">
                    {progressPercent}%
                  </span>
                </div>
              </div>

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
                    ? "bg-rose-50 border-rose-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <span className="text-xs font-bold text-gray-600">
                  {language === "am" ? "የቃልኪዳን ብዛት (ኩሪ/ክኒን)" : "Pledge quantity (strips/tablets)"}
                </span>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-0.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeQty(med.id, -1);
                    }}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
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
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
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

// ── Main MedicinePledge component ──────────────────────────────────────────────
export default function MedicinePledge() {
  const { language } = useLanguage();

  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [pledges, setPledges] = useState<MedicinePledgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customMedicines, setCustomMedicines] = useState<{ id: string; name: string }[]>([]);
  const [customName, setCustomName] = useState("");
  const [showCustomMedicine, setShowCustomMedicine] = useState(false);

  // Contact & Delivery Fields
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<MedicinePledgeType | null>(null);

  useEffect(() => {
    Promise.all([
      getMedicineItems().catch(() => []),
      getMedicinePledges().catch(() => []),
    ])
      .then(([meds, pldgs]) => {
        setMedicines(meds);
        setPledges(pldgs);
      })
      .finally(() => setLoading(false));
  }, []);

  // Compute total already pledged for each medicine
  const pledgedTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    pledges.forEach((p) => {
      if (p.status !== "cancelled") {
        (p.items || []).forEach((it) => {
          if (it.medicineId) {
            totals[it.medicineId] = (totals[it.medicineId] || 0) + (it.quantity || 1);
          }
        });
      }
    });
    return totals;
  }, [pledges]);

  // Dynamic Overall Aggregate Goals for Top Minimalist Card
  const generalGoalStats = useMemo(() => {
    const totalPatients = medicines.reduce((sum, m) => sum + (m.patientsHelped || 0), 0) || 200;
    const totalMonthlyBudget = medicines.reduce(
      (sum, m) => sum + (m.totalMonthly || (m.monthlyQty * m.unitPrice) || 0),
      0
    );
    const totalTargetUnits = medicines.reduce((sum, m) => sum + (m.monthlyQty || 0), 0);
    const totalPledgedFromDb = Object.values(pledgedTotals).reduce((sum, qty) => sum + qty, 0);
    const totalCurrentlySelected = Object.values(quantities).reduce((sum, q) => sum + q, 0);
    const totalPledgedUnits = totalPledgedFromDb + totalCurrentlySelected;
    const overallPercent =
      totalTargetUnits > 0
        ? Math.min(100, Math.round((totalPledgedUnits / totalTargetUnits) * 100))
        : 0;

    return {
      totalPatients,
      totalMonthlyBudget,
      totalTargetUnits,
      totalPledgedUnits,
      overallPercent,
    };
  }, [medicines, pledgedTotals, quantities]);

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
    const cleanDate = sanitizeText(estimatedDeliveryDate, 80);

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
    if (!cleanDate) {
      setError(
        language === "am"
          ? "የሚያስረክቡበትን ግምታዊ ቀን ይምረጡ።"
          : "Please specify an estimated delivery date.",
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
      estimatedDeliveryDate: cleanDate,
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
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>
        <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-lg block w-fit mx-auto">
          {submitted.id}
        </span>
        <h3 className="font-serif text-2xl font-bold text-brand-sky-950">
          {language === "am"
            ? "ምስጋና! የመድሃኒት ቃልኪዳንዎ ደርሶናል።"
            : "Thank you! Medicine pledge received."}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {language === "am"
            ? `እናመሰግናለን ${submitted.donorName}! ግምታዊ የማድረሻ ቀንዎ (${submitted.estimatedDeliveryDate}) ላይ የተመሰረተ ክትትል እናደርጋለን።`
            : `Thank you ${submitted.donorName}! We noted your estimated delivery date (${submitted.estimatedDeliveryDate}) and our team will follow up.`}
        </p>
        <button
          onClick={() => {
            setSubmitted(null);
            setQuantities({});
            setCustomMedicines([]);
            setDonorName("");
            setDonorPhone("");
            setDonorEmail("");
            setEstimatedDeliveryDate("");
            setNotes("");
          }}
          className="px-6 py-2.5 bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-rose-600 transition-colors cursor-pointer shadow-md"
        >
          {language === "am" ? "ሌላ ቃልኪዳን" : "Make Another Pledge"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Minimalistic General Goal Overview Card (Top Section) ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-rose-50/70 via-white to-brand-sky-50/70 border-2 border-rose-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-extrabold text-base sm:text-lg text-brand-sky-950 leading-tight">
                {language === "am"
                  ? "ወርሃዊ የመድሃኒትና የህክምና ግብ"
                  : "Monthly Need & Healthcare Goal"}
              </h4>
              <p className="text-xs text-gray-500">
                {language === "am"
                  ? `ለ${generalGoalStats.totalPatients}+ የአዕምሮ ህሙማን ቀጣይነት ያለው የመድሃኒትና የህክምና ድጋፍ ማሟያ`
                  : `Sustaining vital psychiatric medications & clinical support for ${generalGoalStats.totalPatients}+ beneficiaries`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100/80 border border-rose-200 rounded-xl text-xs font-black text-rose-800 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{generalGoalStats.overallPercent}% {language === "am" ? "ተሟልቷል" : "Overall Funded"}</span>
          </div>
        </div>

        {/* Overall Slim Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-100 border border-gray-200/80 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="bg-linear-to-r from-rose-400 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${generalGoalStats.overallPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
            <span>
              {language === "am" ? "የተሰበሰበ ቃልኪዳን:" : "Pledged so far:"}{" "}
              <strong className="text-brand-sky-950 font-bold">
                {generalGoalStats.totalPledgedUnits.toLocaleString()}
              </strong>{" "}
              / {generalGoalStats.totalTargetUnits.toLocaleString()}{" "}
              <span className="text-gray-400 font-normal">
                {language === "am" ? "ክኒኖች" : "units"}
              </span>
            </span>
            <span>
              {generalGoalStats.totalTargetUnits > generalGoalStats.totalPledgedUnits ? (
                <span className="text-amber-700 font-semibold">
                  {language === "am"
                    ? `የሚቀረው: ${(generalGoalStats.totalTargetUnits - generalGoalStats.totalPledgedUnits).toLocaleString()} ክኒን`
                    : `Remaining: ${(generalGoalStats.totalTargetUnits - generalGoalStats.totalPledgedUnits).toLocaleString()} units`}
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">
                  {language === "am" ? "🎉 ግቡ ተሳክቷል!" : "🎉 Target Reached!"}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* 4 Minimalist Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="bg-white/90 border border-rose-100 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              {language === "am" ? "ታካሚዎች" : "Patients"}
            </span>
            <span className="font-serif font-black text-base text-brand-sky-950">
              {generalGoalStats.totalPatients}+
            </span>
            <span className="text-[10px] text-gray-400 block">
              {language === "am" ? "በወር የሚረዱ" : "Supported/mo"}
            </span>
          </div>

          <div className="bg-white/90 border border-rose-100 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              {language === "am" ? "ወርሃዊ ፍላጎት" : "Monthly Target"}
            </span>
            <span className="font-serif font-black text-base text-brand-sky-950">
              {generalGoalStats.totalTargetUnits.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 block">
              {language === "am" ? "ክኒኖች" : "Doses/units"}
            </span>
          </div>

          <div className="bg-white/90 border border-rose-100 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              {language === "am" ? "ወርሃዊ ዋጋ" : "Monthly Budget"}
            </span>
            <span className="font-serif font-black text-base text-rose-700">
              {(generalGoalStats.totalMonthlyBudget / 1000).toFixed(0)}K
            </span>
            <span className="text-[10px] text-gray-400 block">ETB / Month</span>
          </div>

          <div className="bg-white/90 border border-rose-100 rounded-2xl p-3 text-center shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              {language === "am" ? "ተሟልቷል" : "Fulfillment"}
            </span>
            <span className="font-serif font-black text-base text-emerald-700">
              {generalGoalStats.overallPercent}%
            </span>
            <span className="text-[10px] text-gray-400 block">
              {language === "am" ? "የተሸፈነ" : "Achieved"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Medicine Selection & Contact Form Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          {/* Search & Custom Medicine button */}
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
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-rose-200 rounded-xl text-xs focus:border-rose-400 outline-none font-medium"
              />
            </div>
            {!showCustomMedicine ? (
              <button
                type="button"
                onClick={() => setShowCustomMedicine(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors text-xs font-bold shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {language === "am" ? "ሌላ መድሃኒት" : "Custom medicine"}
              </button>
            ) : (
              <div className="flex gap-2 shrink-0">
                <input
                  autoFocus
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomMedicine())}
                  placeholder={language === "am" ? "የመድሃኒት ስም" : "Medicine name"}
                  className="w-36 px-3 py-2.5 bg-white border border-rose-300 rounded-xl text-xs outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={addCustomMedicine}
                  className="px-3 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 cursor-pointer"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomMedicine(false);
                    setCustomName("");
                  }}
                  className="px-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {customMedicines.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customMedicines.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-800"
                >
                  {item.name}
                  <button
                    type="button"
                    onClick={() =>
                      setCustomMedicines((items) => items.filter((entry) => entry.id !== item.id))
                    }
                    className="text-rose-500 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Medicine list */}
          {loading ? (
            <div className="flex items-center justify-center h-80 gap-2 text-rose-400">
              <LoadingDots />
              <span className="text-sm font-medium">
                {language === "am" ? "በመጫን ላይ..." : "Loading medicines..."}
              </span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
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
                    pledgedSoFar={pledgedTotals[med.id] || 0}
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

        {/* Contact form & Estimated Date */}
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <h3 className="font-serif font-bold text-base text-brand-sky-950">
              {language === "am" ? "የእርስዎ መረጃና የማስረከቢያ ቀን" : "Contact & Delivery Date"}
            </h3>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                {language === "am" ? "ሙሉ ስም *" : "Full Name *"}
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder={language === "am" ? "ስምዎን ያስገቡ" : "Enter your full name"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-rose-400 outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {language === "am" ? "ስልክ ቁጥር *" : "Phone *"}
                </label>
                <input
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-rose-400 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {language === "am" ? "ኢሜይል (አማራጭ)" : "Email (Optional)"}
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-rose-400 outline-none font-medium"
                />
              </div>
            </div>

            {/* Estimated Delivery Date Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-900 mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
                {language === "am" ? "የሚያስረክቡበት ግምታዊ ቀን *" : "Estimated Delivery Date *"}
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-rose-50/50 border border-rose-200 rounded-xl text-xs focus:border-rose-400 outline-none font-bold text-brand-sky-950 cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 block mt-1">
                {language === "am"
                  ? "መድሃኒቱን መቼ ለማድረስ ወይም ለማስረከብ ያቅዳሉ?"
                  : "When do you plan to bring or send these medicines to Selihom?"}
              </span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                {language === "am" ? "ማስታወሻ (አማራጭ)" : "Notes (Optional)"}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  language === "am" ? "ተጨማሪ መልእክት ወይም መረጃ..." : "Additional notes or instructions..."
                }
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:border-rose-400 outline-none resize-none font-medium"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-3 text-center sm:text-left">
                {language === "am" ? "ግምታዊ ዋጋ" : "Est. Value"}:{" "}
                <strong className="text-brand-sky-950 font-black">{totalCost.toLocaleString()} ETB</strong>
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <LoadingDots label={language === "am" ? "በመላክ..." : "Submitting..."} className="justify-center" />
                ) : (
                  <>
                    <Pill className="w-4 h-4" />
                    <span>{language === "am" ? "ቃልኪዳን ላክ" : "Submit Pledge"}</span>
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
