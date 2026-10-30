/**
 * AdminTabs.tsx
 * All 5 new admin panel tabs:
 *   - AdminMedicineTab    (Phase 6A)
 *   - AdminSuppliesTab    (Phase 6B)
 *   - AdminEventsTab      (Phase 6C)
 *   - AdminVolRolesTab    (Phase 6D)
 *   - AdminNewsTab        (Phase 6E)
 */
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Pill, Package, Heart, Users, Newspaper,
  Plus, Edit3, Trash2, Check, X, Save,
  Loader2, AlertCircle, CheckCircle2, Eye, EyeOff,
  RefreshCw, Globe, ChevronDown, ChevronUp,
  Search, Gift, Award, Upload, Image as ImageIcon,
  Copy, ExternalLink, FileText, Settings, Building,
  Phone, Mail, Share2, Send, Smartphone, Info,
  ArrowUp, ArrowDown, RotateCcw,
} from "lucide-react";
import {
  getMedicineItems,    saveMedicineItem,    deleteMedicineItem,    MedicineItem,
  getMedicinePledges,  updateMedicinePledgeStatus, deleteMedicinePledge, MedicinePledge,
  getSupplyCategories, saveSupplyCategory,  deleteSupplyCategory,  SupplyCategory, SupplyItem,
  getSuppliesPledges,  updateSuppliesPledgeStatus, deleteSuppliesPledge,
  getEventPledges,     updateEventPledgeStatus,    deleteEventPledge,  EventPledge,
  getVolunteerRoles,   saveVolunteerCategory,      deleteVolunteerCategory, VolunteerCategory,
  getNews,             saveArticle,         deleteArticle,         publishArticle, NewsArticle,
  getSiteSettings,     saveSiteSettings,    resetSiteSettings,     SiteSettings, BankAccount,
  uploadImageFiles,    resolveImagePath,
} from "../utils/adminStorage";
import { useConfirmation } from "./ConfirmationModal";

const URGENCIES = ["High", "Medium", "Low"] as const;
const NEWS_CATS = ["Health","Community","Events","Announcements","Stories"] as const;

// ── Shared mini-components ────────────────────────────────────────────────────

function StatusBadge({ status, map }: { status: string; map: Record<string, string> }) {
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pledged:   "bg-amber-100 text-amber-800 border-amber-200",
  received:  "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  pending:   "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-brand-sky-100 text-brand-sky-800 border-brand-sky-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

function SectionHeader({ icon: Icon, title, subtitle, onAdd, addLabel, onRefresh, loading, actions }:
  { icon: React.ComponentType<any>; title: string; subtitle?: string; onAdd?: () => void; addLabel?: string; onRefresh?: () => void; loading?: boolean; actions?: React.ReactNode }) {
  return (
    <div className="bg-white border border-brand-sky-200 rounded-2xl p-3.5 sm:p-4 shadow-xs flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-sky-100 text-brand-sky-600 rounded-xl flex items-center justify-center border border-brand-sky-200 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-base sm:text-lg text-brand-sky-950 leading-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-brand-sky-500 font-medium">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center xl:justify-end w-full xl:w-auto">
        {actions}
        {onAdd && (
          <button onClick={onAdd}
            className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0">
            <Plus className="w-3.5 h-3.5" />{addLabel || "Add"}
          </button>
        )}
        {onRefresh && (
          <button onClick={onRefresh} disabled={loading}
            className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70 shrink-0">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Reloading..." : "Reload"}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Phase 6A — Admin Medicine Tab
// ══════════════════════════════════════════════════════════════════════════════

export function AdminMedicineTab({ language, onPledgeTypeChange }: { language: string; onPledgeTypeChange?: (type: "inkind" | "medicine" | "supplies" | "delivered_donors") => void }) {
  const { confirm, modal } = useConfirmation();
  const [medicines, setMedicines]     = useState<MedicineItem[]>([]);
  const [pledges,   setPledges]       = useState<MedicinePledge[]>([]);
  const [loading,   setLoading]       = useState(false);
  const [subTab,    setSubTab]        = useState<"items"|"pledges">("items");
  const [editing,   setEditing]       = useState<MedicineItem | null>(null);
  const [showForm,  setShowForm]      = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pledgeStatus, setPledgeStatus] = useState("all");

  const [form, setForm] = useState<Partial<MedicineItem>>({
    name: "", monthlyQty: 0, unitPrice: 0, totalMonthly: 0, patientsHelped: 0,
    urgency: "Medium", description: { en: "", am: "" },
  });

  const load = async () => {
    setLoading(true);
    const [m, p] = await Promise.all([getMedicineItems(), getMedicinePledges()]);
    setMedicines(m); setPledges(p); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openEdit = (med: MedicineItem) => { setEditing(med); setForm(med); setShowForm(true); };
  const openAdd  = () => { setEditing(null); setForm({ name:"", monthlyQty:0, unitPrice:0, totalMonthly:0, patientsHelped:0, urgency:"Medium", description:{en:"",am:""} }); setShowForm(true); };

  const handleSave = async () => {
    if (!form.name || !form.name.trim()) return;
    const mQty = Number(form.monthlyQty) || 0;
    const uPrice = Number(form.unitPrice) || 0;
    const totM = Number(form.totalMonthly) || (mQty * uPrice);
    const item: MedicineItem = {
      id:             editing?.id || `med-${Date.now()}`,
      name:           form.name.trim(),
      monthlyQty:     mQty,
      unitPrice:      uPrice,
      totalMonthly:   totM,
      patientsHelped: Number(form.patientsHelped) || 0,
      urgency:        (form.urgency as MedicineItem["urgency"]) || "Medium",
      description:    form.description || { en: "", am: "" },
    };
    await saveMedicineItem(item);
    setShowForm(false); load();
  };

  const del = async (id: string, name: string) => {
    if (!(await confirm(`Delete "${name}"?`))) return;
    await deleteMedicineItem(id); load();
  };

  const isMedicinePledgeOverdue = (p: MedicinePledge) => {
    if ((p.status || "pledged") !== "pledged" || !p.estimatedDeliveryDate) return false;
    const estTs = new Date(p.estimatedDeliveryDate).setHours(23, 59, 59, 999);
    return !isNaN(estTs) && estTs < Date.now();
  };

  const visibleMedicines = medicines.filter((med) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || med.name.toLowerCase().includes(term) || (med.description?.en || "").toLowerCase().includes(term) || (med.description?.am || "").toLowerCase().includes(term);
    const matchesUrgency = pledgeStatus === "all" || med.urgency.toLowerCase() === pledgeStatus.toLowerCase();
    return matchesSearch && matchesUrgency;
  });
  const visiblePledges = pledges.filter((pledge) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      `${pledge.id} ${pledge.donorName || ""} ${pledge.donorPhone || ""} ${pledge.donorEmail || ""} ${pledge.items?.map(i => i.medicineName).join(" ") || ""}`.toLowerCase().includes(term);
    const isOverdue = isMedicinePledgeOverdue(pledge);
    const matchesStatus =
      pledgeStatus === "all"
        ? true
        : pledgeStatus === "overdue"
        ? isOverdue
        : (pledge.status || "pledged") === pledgeStatus;
    return matchesSearch && matchesStatus;
  });

  const urgencyColor: Record<string,string> = {
    High:"bg-red-100 text-red-700 border-red-200",
    Medium:"bg-amber-100 text-amber-700 border-amber-200",
    Low:"bg-sky-100 text-sky-700 border-sky-200",
  };

  return (
    <div className="space-y-4">
      {modal}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-sky-200 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("inkind")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            >
              <Gift className="w-4 h-4" />
              <span>{language === "am" ? "የዓይነት ቃልኪዳን" : "In-Kind"}</span>
            </button>

            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("medicine")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-rose-500 text-white shadow-sm border border-rose-600"
            >
              <Pill className="w-4 h-4" />
              <span>{language === "am" ? "መድሃኒት" : "Medicine"}</span>
            </button>

            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("supplies")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
            >
              <Package className="w-4 h-4" />
              <span>{language === "am" ? "ቁሳቁስ" : "Supplies"}</span>
            </button>

            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("delivered_donors")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-brand-sky-50 text-brand-sky-800 border border-brand-sky-200 hover:bg-brand-sky-100"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>{language === "am" ? "⭐ ታማኝ ደጋፊዎች" : "⭐ Delivered Donors"}</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center xl:justify-end">

            <div className="relative w-full sm:w-72 md:w-80">
              <Search className="w-4 h-4 text-brand-sky-400 absolute left-3.5 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  subTab === "items"
                    ? (language === "am" ? "የመድሃኒት ስም ይፈልጉ..." : "Search medicine name...")
                    : (language === "am" ? "ስም፣ መታወቂያ ወይም ስልክ ይፈልጉ..." : "Search name, ID, or phone...")
                }
                className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-brand-sky-50 rounded-xl border border-brand-sky-200 text-xs text-gray-900 focus:bg-white focus:border-brand-sky-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={pledgeStatus}
              onChange={(e) => setPledgeStatus(e.target.value)}
              className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-2 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400 cursor-pointer"
            >
              <option value="all">{language === "am" ? "ሁሉም" : "All"}</option>
              {subTab === "pledges" && (
                <>
                  <option value="pledged">{language === "am" ? "ቃልኪዳን" : "Pledged"}</option>
                  <option value="overdue">{language === "am" ? "ጊዜው ያለፈበት" : "Overdue"}</option>
                  <option value="received">{language === "am" ? "ተቀበለ" : "Received"}</option>
                  <option value="cancelled">{language === "am" ? "ተሰርዟል" : "Cancelled"}</option>
                </>
              )}
              {subTab === "items" && (
                <>
                  <option value="high">{language === "am" ? "ከፍተኛ" : "High"}</option>
                  <option value="medium">{language === "am" ? "መካከለኛ" : "Medium"}</option>
                  <option value="low">{language === "am" ? "ዝቅተኛ" : "Low"}</option>
                </>
              )}
            </select>

            <select
              value={subTab}
              onChange={(e) => {
                setSubTab(e.target.value as "items" | "pledges");
                setPledgeStatus("all");
              }}
              className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-2 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400 cursor-pointer"
            >
              <option value="items">{language === "am" ? "የመድሃኒት ዝርዝር" : "Medicine List"}</option>
              <option value="pledges">{language === "am" ? "ቃልኪዳኖች" : "Donor Pledges"}</option>
            </select>

            {subTab === "items" && (
              <button
                onClick={openAdd}
                className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === "am" ? "መድሃኒት ጨምር" : "Add Medicine"}</span>
              </button>
            )}

            <button
              onClick={load}
              disabled={loading}
              className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? (language === "am" ? "በመጫን ላይ..." : "Reloading...") : (language === "am" ? "አዙር" : "Reload")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Medicine list */}
      {subTab === "items" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleMedicines.map(med => (
            <div key={med.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3 group">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-serif font-bold text-sm text-brand-sky-950 leading-snug flex-1">{med.name}</h4>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${urgencyColor[med.urgency]}`}>{med.urgency}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-brand-sky-50 rounded-xl p-2 border border-brand-sky-100">
                  <span className="text-[9px] text-brand-sky-500 font-bold block">Patients</span>
                  <span className="text-sm font-black text-brand-sky-950">{med.patientsHelped}</span>
                </div>
                <div className="bg-amber-50 rounded-xl p-2 border border-amber-100">
                  <span className="text-[9px] text-amber-600 font-bold block">Monthly ETB</span>
                  <span className="text-sm font-black text-amber-900">{med.totalMonthly.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-500 space-y-0.5">
                <p>Qty: {med.monthlyQty.toLocaleString()} · Unit: {med.unitPrice} ETB</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => openEdit(med)} className="flex-1 py-1.5 bg-brand-sky-50 hover:bg-brand-sky-100 text-brand-sky-700 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1 transition-colors border border-brand-sky-200">
                  <Edit3 className="w-3.5 h-3.5" />Edit
                </button>
                <button onClick={() => del(med.id, med.name)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl cursor-pointer border border-red-200 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {visibleMedicines.length === 0 && !loading && (
            <div className="col-span-3 text-center py-10 text-xs text-gray-400">No medicines yet.</div>
          )}
        </div>
      )}

      {/* Pledges list */}
      {subTab === "pledges" && (
        <div className="space-y-3">
          {visiblePledges.map(p => {
            const isOverdue = isMedicinePledgeOverdue(p);
            return (
              <div key={p.id} className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4 transition-all ${isOverdue ? "border-red-300 ring-1 ring-red-200 bg-red-50/20" : "border-gray-100"}`}>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-brand-sky-700 bg-brand-sky-50 border border-brand-sky-200 px-2 py-0.5 rounded-md">{p.id}</span>
                    <StatusBadge status={p.status} map={BOOKING_STATUS_COLORS} />
                    {isOverdue && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 animate-pulse">
                        ⚠️ {language === "am" ? "ጊዜው ያለፈበት" : "Overdue"}
                      </span>
                    )}
                  </div>
                  <p className="font-serif font-bold text-sm text-brand-sky-950">{p.donorName}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span>{p.donorPhone || p.donorEmail}</span>
                    <span className="text-gray-300">•</span>
                    <span>Pledged: {p.date}</span>
                    {p.estimatedDeliveryDate && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className={isOverdue ? "text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200" : "text-brand-sky-800 font-semibold bg-brand-sky-50 px-1.5 py-0.5 rounded-md border border-brand-sky-100"}>
                          📅 {language === "am" ? "የተገመተበት ቀን:" : "Est. Delivery:"} {p.estimatedDeliveryDate}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    {p.items.map(i => `${i.medicineName} ×${i.quantity}`).join(", ")}
                  </p>
                  {/* Quick Contact Shortcuts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {p.donorPhone && (
                      <a href={`tel:${p.donorPhone}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors">
                        <Phone className="w-3 h-3" /> {language === "am" ? "ደውል" : "Call"}
                      </a>
                    )}
                    {p.donorPhone && (
                      <a href={`https://wa.me/${p.donorPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg border border-green-200 transition-colors">
                        <span>💬 WhatsApp</span>
                      </a>
                    )}
                    {p.donorEmail && (
                      <a href={`mailto:${p.donorEmail}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-sky-700 hover:text-brand-sky-800 bg-brand-sky-50 hover:bg-brand-sky-100 px-2.5 py-1 rounded-lg border border-brand-sky-200 transition-colors">
                        <Mail className="w-3 h-3" /> {language === "am" ? "ኢሜይል" : "Email"}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-1.5 shrink-0 self-end sm:self-center">
                  {["pledged","received","cancelled"].map(s => (
                    <button key={s} onClick={async () => { await updateMedicinePledgeStatus(p.id, s as any); load(); }}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-colors ${p.status===s?"bg-brand-sky-400 text-white":"bg-gray-50 text-gray-600 hover:bg-brand-sky-50 border border-gray-200"}`}>
                      {s}
                    </button>
                  ))}
                  <button onClick={async () => { if(await confirm(`Delete "${p.id}"?`)) { await deleteMedicinePledge(p.id); load(); } }}
                    className="p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg cursor-pointer border border-red-200 flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          {visiblePledges.length === 0 && <p className="text-center text-xs text-gray-400 py-10">No medicine pledges found.</p>}
        </div>
      )}

      {/* Edit / Add modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-lg p-6 my-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">{editing ? "Edit Medicine" : "Add Medicine"}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Medicine Name *</label>
                  <input value={form.name||""} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" placeholder="e.g. Olanzapine 5mg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { key:"monthlyQty",    label:"Monthly Qty" },
                    { key:"unitPrice",     label:"Unit Price (ETB)" },
                    { key:"totalMonthly",  label:"Monthly Cost (ETB)" },
                    { key:"patientsHelped",label:"Patients Helped" },
                  ] as { key: keyof MedicineItem; label: string }[]).map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-gray-600 mb-1">{f.label}</label>
                      <input type="number" value={(form as any)[f.key]||0} onChange={e=>setForm(p=>({...p,[f.key]:parseFloat(e.target.value)||0}))}
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Urgency</label>
                  <select value={form.urgency||"Medium"} onChange={e=>setForm(p=>({...p,urgency:e.target.value as any}))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 bg-white">
                    {URGENCIES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Description (EN)</label>
                    <textarea rows={2} value={form.description?.en||""} onChange={e=>setForm(p=>({...p,description:{...p.description!,en:e.target.value}}))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Description (AM)</label>
                    <textarea rows={2} value={form.description?.am||""} onChange={e=>setForm(p=>({...p,description:{...p.description!,am:e.target.value}}))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 resize-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm flex items-center justify-center gap-1.5">
                  <Save className="w-3.5 h-3.5" />{editing ? "Save Changes" : "Add Medicine"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Phase 6B — Admin Supplies Tab
// ══════════════════════════════════════════════════════════════════════════════

export function AdminSuppliesTab({ language, onPledgeTypeChange }: { language: string; onPledgeTypeChange?: (type: "inkind" | "medicine" | "supplies" | "delivered_donors") => void }) {
  const { confirm, modal } = useConfirmation();
  const [categories, setCategories] = useState<SupplyCategory[]>([]);
  const [pledges,    setPledges]    = useState<any[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [subTab,     setSubTab]     = useState<"cats"|"pledges">("cats");
  const [searchQuery, setSearchQuery] = useState("");
  const [pledgeStatus, setPledgeStatus] = useState("all");
  const [expanded,   setExpanded]   = useState<string|null>(null);
  const [catForm,    setCatForm]    = useState<{ open:boolean; editing:SupplyCategory|null }>({ open:false, editing:null });
  const [itemForm,   setItemForm]   = useState<{ open:boolean; catId:string; editing:SupplyItem|null }>({ open:false, catId:"", editing:null });
  const [cf,         setCf]         = useState({ nameEn:"", nameAm:"", icon:"Package", color:"bg-brand-sky-400" });
  const [itf,        setItf]        = useState({ nameEn:"", nameAm:"", neededQtyEn:"", neededQtyAm:"", impactEn:"", impactAm:"", urgency:"Medium" as SupplyItem["urgency"] });

  const load = async () => {
    setLoading(true);
    const [c, p] = await Promise.all([getSupplyCategories(), getSuppliesPledges()]);
    setCategories(c); setPledges(p); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAddCat  = () => { setCatForm({ open:true, editing:null }); setCf({ nameEn:"", nameAm:"", icon:"Package", color:"bg-brand-sky-400" }); };
  const openEditCat = (cat: SupplyCategory) => { setCatForm({ open:true, editing:cat }); setCf({ nameEn:cat.name.en, nameAm:cat.name.am, icon:cat.icon, color:cat.color }); };

  const saveCat = async () => {
    if (!cf.nameEn.trim()) return;
    const existing = catForm.editing;
    const cat: SupplyCategory = {
      id:    existing?.id || `cat-${Date.now()}`,
      name:  { en: cf.nameEn.trim(), am: cf.nameAm.trim() },
      icon:  cf.icon,
      color: cf.color,
      items: existing?.items || [],
    };
    await saveSupplyCategory(cat);
    setCatForm({ open:false, editing:null }); load();
  };

  const delCat = async (id: string, name: string) => {
    if (!(await confirm(`Delete category "${name}" and all its items?`))) return;
    await deleteSupplyCategory(id); load();
  };

  const openAddItem  = (catId: string) => { setItemForm({ open:true, catId, editing:null }); setItf({ nameEn:"", nameAm:"", neededQtyEn:"", neededQtyAm:"", impactEn:"", impactAm:"", urgency:"Medium" }); };
  const openEditItem = (catId: string, item: SupplyItem) => {
    setItemForm({ open:true, catId, editing:item });
    setItf({ nameEn:item.name.en, nameAm:item.name.am, neededQtyEn:item.neededQty.en, neededQtyAm:item.neededQty.am, impactEn:item.impactDesc.en, impactAm:item.impactDesc.am, urgency:item.urgency });
  };

  const saveItem = async () => {
    if (!itf.nameEn.trim()) return;
    const cat = categories.find((c) => c.id === itemForm.catId);
    if (!cat) return;
    const newItem: SupplyItem = {
      id:          itemForm.editing?.id || `itm-${Date.now()}`,
      name:        { en: itf.nameEn.trim(), am: itf.nameAm.trim() },
      neededQty:   { en: itf.neededQtyEn.trim(), am: itf.neededQtyAm.trim() },
      impactDesc:  { en: itf.impactEn.trim(), am: itf.impactAm.trim() },
      urgency:     itf.urgency,
    };
    const updatedItems = itemForm.editing
      ? cat.items.map((i: SupplyItem) => (i.id === newItem.id ? newItem : i))
      : [...cat.items, newItem];
    await saveSupplyCategory({ ...cat, items: updatedItems });
    setItemForm({ open:false, catId:"", editing:null }); load();
  };

  const delItem = async (catId: string, itemId: string, name: string) => {
    if (!(await confirm(`Delete item "${name}"?`))) return;
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    await saveSupplyCategory({ ...cat, items: cat.items.filter((i) => i.id !== itemId) }); load();
  };

  const isSuppliesPledgeOverdue = (p: any) => {
    if ((p.status || "pledged") !== "pledged" || !p.estimatedDeliveryDate) return false;
    const estTs = new Date(p.estimatedDeliveryDate).setHours(23, 59, 59, 999);
    return !isNaN(estTs) && estTs < Date.now();
  };

  const visibleCategories = categories.filter((cat) => {
    const term = searchQuery.toLowerCase();
    const matchesSearchCat = !searchQuery || `${cat.name.en} ${cat.name.am}`.toLowerCase().includes(term);
    const matchesSearchItem = cat.items.some((item) =>
      `${item.name.en} ${item.name.am} ${item.neededQty.en} ${item.neededQty.am} ${item.impactDesc.en} ${item.impactDesc.am}`.toLowerCase().includes(term)
    );
    const matchesUrgency = pledgeStatus === "all" || cat.items.some((item) => item.urgency.toLowerCase() === pledgeStatus.toLowerCase());
    return (matchesSearchCat || matchesSearchItem) && matchesUrgency;
  });

  const visiblePledges = pledges.filter((pledge) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      `${pledge.id} ${pledge.donorName || ""} ${pledge.donorPhone || ""} ${pledge.donorEmail || ""} ${pledge.items?.map((i: any) => i.itemName).join(" ") || ""}`.toLowerCase().includes(term);
    const isOverdue = isSuppliesPledgeOverdue(pledge);
    const matchesStatus =
      pledgeStatus === "all"
        ? true
        : pledgeStatus === "overdue"
        ? isOverdue
        : (pledge.status || "pledged") === pledgeStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {modal}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-sky-200 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("inkind")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            >
              <Gift className="w-4 h-4" />
              <span>{language === "am" ? "የዓይነት ቃልኪዳን" : "In-Kind"}</span>
            </button>

            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("medicine")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
            >
              <Pill className="w-4 h-4" />
              <span>{language === "am" ? "መድሃኒት" : "Medicine"}</span>
            </button>

            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("supplies")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-amber-500 text-white shadow-sm border border-amber-600"
            >
              <Package className="w-4 h-4" />
              <span>{language === "am" ? "ቁሳቁስ" : "Supplies"}</span>
            </button>

            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("delivered_donors")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-brand-sky-50 text-brand-sky-800 border border-brand-sky-200 hover:bg-brand-sky-100"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>{language === "am" ? "⭐ ታማኝ ደጋፊዎች" : "⭐ Delivered Donors"}</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center xl:justify-end">

            <div className="relative w-full sm:w-72 md:w-80">
              <Search className="w-4 h-4 text-brand-sky-400 absolute left-3.5 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  subTab === "cats"
                    ? (language === "am" ? "ምድብ ወይም እቃ ይፈልጉ..." : "Search categories or items...")
                    : (language === "am" ? "ስም፣ መታወቂያ ወይም ስልክ ይፈልጉ..." : "Search name, ID, or phone...")
                }
                className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-brand-sky-50 rounded-xl border border-brand-sky-200 text-xs text-gray-900 focus:bg-white focus:border-brand-sky-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={pledgeStatus}
              onChange={(e) => setPledgeStatus(e.target.value)}
              className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-2 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400 cursor-pointer"
            >
              <option value="all">{language === "am" ? "ሁሉም" : "All"}</option>
              {subTab === "pledges" && (
                <>
                  <option value="pledged">{language === "am" ? "ቃልኪዳን" : "Pledged"}</option>
                  <option value="overdue">{language === "am" ? "ጊዜው ያለፈበት" : "Overdue"}</option>
                  <option value="received">{language === "am" ? "ተቀበለ" : "Received"}</option>
                  <option value="cancelled">{language === "am" ? "ተሰርዟል" : "Cancelled"}</option>
                </>
              )}
              {subTab === "cats" && (
                <>
                  <option value="high">{language === "am" ? "ከፍተኛ" : "High"}</option>
                  <option value="medium">{language === "am" ? "መካከለኛ" : "Medium"}</option>
                  <option value="low">{language === "am" ? "ዝቅተኛ" : "Low"}</option>
                </>
              )}
            </select>

            <select
              value={subTab}
              onChange={(e) => {
                setSubTab(e.target.value as "cats" | "pledges");
                setPledgeStatus("all");
              }}
              className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-2 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400 cursor-pointer"
            >
              <option value="cats">{language === "am" ? "ምድቦች" : "Categories"}</option>
              <option value="pledges">{language === "am" ? "ቃልኪዳኖች" : "Donor Pledges"}</option>
            </select>

            {subTab === "cats" && (
              <button
                onClick={() => {
                  setCf({ nameEn: "", nameAm: "", icon: "Package", color: "bg-brand-sky-400" });
                  setCatForm({ open: true, editing: null });
                }}
                className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === "am" ? "ምድብ ጨምር" : "Add Category"}</span>
              </button>
            )}

            <button
              onClick={load}
              disabled={loading}
              className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? (language === "am" ? "በመጫን ላይ..." : "Reloading...") : (language === "am" ? "አዙር" : "Reload")}</span>
            </button>
          </div>
        </div>
      </div>

      {subTab === "cats" && (
        <div className="space-y-3">
          {visibleCategories.map(cat => (
            <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded===cat.id ? null : cat.id)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl ${cat.color} flex items-center justify-center text-white text-xs font-black`}>
                    {cat.name.en.slice(0,2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-brand-sky-950">{cat.name.en}</p>
                    <p className="text-[10px] text-gray-400">{cat.items.length} items</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={e=>{e.stopPropagation(); setCf({nameEn:cat.name.en,nameAm:cat.name.am,icon:cat.icon,color:cat.color}); setCatForm({open:true,editing:cat});}}
                    className="p-1.5 bg-brand-sky-50 text-brand-sky-600 rounded-lg hover:bg-brand-sky-100 cursor-pointer border border-brand-sky-200 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={e=>{e.stopPropagation(); delCat(cat.id, cat.name.en);}}
                    className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer border border-red-200 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {expanded===cat.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </div>
              <AnimatePresence>
                {expanded===cat.id && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                    <div className="border-t border-gray-100 p-4 space-y-2">
                      {cat.items.map((item: SupplyItem) => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl p-3 gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-brand-sky-950 truncate">{item.name.en}</p>
                            <p className="text-[10px] text-gray-400 truncate">{item.neededQty.en} · {item.urgency}</p>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={() => { setItf({nameEn:item.name.en,nameAm:item.name.am,neededQtyEn:item.neededQty.en,neededQtyAm:item.neededQty.am,impactEn:item.impactDesc.en,impactAm:item.impactDesc.am,urgency:item.urgency}); setItemForm({open:true,catId:cat.id,editing:item}); }}
                              className="p-1.5 bg-white text-brand-sky-600 rounded-lg hover:bg-brand-sky-50 cursor-pointer border border-brand-sky-200 transition-colors">
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button onClick={() => delItem(cat.id, item.id, item.name.en)}
                              className="p-1.5 bg-white text-red-400 rounded-lg hover:bg-red-50 cursor-pointer border border-red-200 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => { setItf({nameEn:"",nameAm:"",neededQtyEn:"",neededQtyAm:"",impactEn:"",impactAm:"",urgency:"Medium"}); setItemForm({open:true,catId:cat.id,editing:null}); }}
                        className="w-full py-2 border-2 border-dashed border-brand-sky-200 rounded-xl text-xs font-bold text-brand-sky-500 hover:bg-brand-sky-50 cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {visibleCategories.length === 0 && !loading && (
            <p className="text-center text-xs text-gray-400 py-10">No categories found.</p>
          )}
        </div>
      )}

      {subTab === "pledges" && (
        <div className="space-y-3">
          {visiblePledges.map((p: any) => {
            const isOverdue = isSuppliesPledgeOverdue(p);
            return (
              <div key={p.id} className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4 transition-all ${isOverdue ? "border-red-300 ring-1 ring-red-200 bg-red-50/20" : "border-gray-100"}`}>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-brand-sky-700 bg-brand-sky-50 border border-brand-sky-200 px-2 py-0.5 rounded-md">{p.id}</span>
                    <StatusBadge status={p.status} map={BOOKING_STATUS_COLORS} />
                    {isOverdue && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 animate-pulse">
                        ⚠️ {language === "am" ? "ጊዜው ያለፈበት" : "Overdue"}
                      </span>
                    )}
                  </div>
                  <p className="font-serif font-bold text-sm text-brand-sky-950">{p.donorName}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span>{p.donorPhone || p.donorEmail}</span>
                    <span className="text-gray-300">•</span>
                    <span>Pledged: {p.date}</span>
                    {p.estimatedDeliveryDate && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className={isOverdue ? "text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200" : "text-brand-sky-800 font-semibold bg-brand-sky-50 px-1.5 py-0.5 rounded-md border border-brand-sky-100"}>
                          📅 {language === "am" ? "የተገመተበት ቀን:" : "Est. Delivery:"} {p.estimatedDeliveryDate}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    {p.items?.map((i: any) => `${i.itemName||i.custom} ×${i.quantity}`).join(", ")}
                  </p>
                  {/* Quick Contact Shortcuts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {p.donorPhone && (
                      <a href={`tel:${p.donorPhone}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors">
                        <Phone className="w-3 h-3" /> {language === "am" ? "ደውል" : "Call"}
                      </a>
                    )}
                    {p.donorPhone && (
                      <a href={`https://wa.me/${p.donorPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg border border-green-200 transition-colors">
                        <span>💬 WhatsApp</span>
                      </a>
                    )}
                    {p.donorEmail && (
                      <a href={`mailto:${p.donorEmail}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-sky-700 hover:text-brand-sky-800 bg-brand-sky-50 hover:bg-brand-sky-100 px-2.5 py-1 rounded-lg border border-brand-sky-200 transition-colors">
                        <Mail className="w-3 h-3" /> {language === "am" ? "ኢሜይል" : "Email"}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-1.5 shrink-0 self-end sm:self-center">
                  {["pledged","received","cancelled"].map(s => (
                    <button key={s} onClick={async () => { await updateSuppliesPledgeStatus(p.id, s as any); load(); }}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-colors ${p.status===s?"bg-brand-sky-400 text-white":"bg-gray-50 text-gray-600 hover:bg-brand-sky-50 border border-gray-200"}`}>
                      {s}
                    </button>
                  ))}
                  <button onClick={async () => { if(await confirm(`Delete "${p.id}"?`)){await deleteSuppliesPledge(p.id);load();} }}
                    className="p-1 bg-red-50 text-red-500 rounded-lg cursor-pointer border border-red-200 flex items-center justify-center transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          {visiblePledges.length===0 && <p className="text-center text-xs text-gray-400 py-10">No supplies pledges found.</p>}
        </div>
      )}

      {/* Category form modal */}
      <AnimatePresence>
        {catForm.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">{catForm.editing?"Edit Category":"Add Category"}</h3>
                <button onClick={() => setCatForm({open:false,editing:null})} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Name (EN) *</label>
                    <input value={cf.nameEn} onChange={e=>setCf(p=>({...p,nameEn:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Name (AM)</label>
                    <input value={cf.nameAm} onChange={e=>setCf(p=>({...p,nameAm:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                </div>
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Icon (Lucide name)</label>
                  <input value={cf.icon} onChange={e=>setCf(p=>({...p,icon:e.target.value}))} placeholder="e.g. Package, UtensilsCrossed" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Color class</label>
                  <input value={cf.color} onChange={e=>setCf(p=>({...p,color:e.target.value}))} placeholder="e.g. bg-brand-sky-400" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setCatForm({open:false,editing:null})} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button onClick={saveCat} className="flex-1 py-2.5 bg-brand-sky-400 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm">{catForm.editing?"Save":"Add"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item form modal */}
      <AnimatePresence>
        {itemForm.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-md p-6 my-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">{itemForm.editing?"Edit Item":"Add Item"}</h3>
                <button onClick={() => setItemForm({open:false,catId:"",editing:null})} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Name (EN) *</label>
                    <input value={itf.nameEn} onChange={e=>setItf(p=>({...p,nameEn:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Name (AM)</label>
                    <input value={itf.nameAm} onChange={e=>setItf(p=>({...p,nameAm:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Needed Qty (EN)</label>
                    <input value={itf.neededQtyEn} onChange={e=>setItf(p=>({...p,neededQtyEn:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Needed Qty (AM)</label>
                    <input value={itf.neededQtyAm} onChange={e=>setItf(p=>({...p,neededQtyAm:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Impact (EN)</label>
                    <input value={itf.impactEn} onChange={e=>setItf(p=>({...p,impactEn:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Impact (AM)</label>
                    <input value={itf.impactAm} onChange={e=>setItf(p=>({...p,impactAm:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>
                </div>
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Urgency</label>
                  <select value={itf.urgency} onChange={e=>setItf(p=>({...p,urgency:e.target.value as any}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 bg-white">
                    {URGENCIES.map(u=><option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setItemForm({open:false,catId:"",editing:null})} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button onClick={saveItem} className="flex-1 py-2.5 bg-brand-sky-400 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm">{itemForm.editing?"Save":"Add Item"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Phase 6C — Admin Events Tab
// ══════════════════════════════════════════════════════════════════════════════

export function AdminEventsTab({ language }: { language: string }) {
  const { confirm, modal } = useConfirmation();
  const [events,  setEvents]  = useState<EventPledge[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail,  setDetail]  = useState<EventPledge|null>(null);

  const load = async () => { setLoading(true); setEvents(await getEventPledges()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const statusColors: Record<string,string> = {
    pending:   "bg-amber-100 text-amber-800 border-amber-200",
    confirmed: "bg-brand-sky-100 text-brand-sky-800 border-brand-sky-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  const eventTypeIcon: Record<string, string> = { birthday:"🎂", wedding:"💍", anniversary:"⭐", other:"✨" };

  return (
    <div className="space-y-4">
      {modal}
      <SectionHeader icon={Heart} title={language==="am"?"ፍቅር ድግሶች":"Celebration Event Requests"} onRefresh={load} loading={loading}
        subtitle={`${events.length} total · ${events.filter(e=>e.status==="pending").length} pending`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(evt => (
          <div key={evt.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-3 group">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-black text-pink-700 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md">{evt.id}</span>
              <StatusBadge status={evt.status} map={statusColors} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{eventTypeIcon[evt.eventType]||"✨"}</span>
              <div>
                <p className="font-serif font-bold text-base text-brand-sky-950">{evt.name}</p>
                <p className="text-xs text-gray-500 capitalize">{evt.eventType}{evt.customType ? ` — ${evt.customType}` : ""}</p>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 space-y-0.5">
              <p>📅 {evt.preferredDate} · Submitted: {evt.submittedAt}</p>
              <p>📞 {evt.phone || evt.email}</p>
              {evt.message && <p className="text-gray-600 italic line-clamp-1">"{evt.message}"</p>}
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => setDetail(evt)} className="flex-1 py-2 bg-brand-sky-50 text-brand-sky-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-sky-100 border border-brand-sky-200 transition-colors">Details</button>
              {["confirmed","completed","cancelled"].map(s => (
                <button key={s} onClick={async () => { await updateEventPledgeStatus(evt.id, s as any); load(); }}
                  className={`px-3 py-2 rounded-xl text-[9px] font-bold cursor-pointer transition-colors ${evt.status===s?"bg-brand-sky-400 text-white":"bg-gray-50 text-gray-600 hover:bg-brand-sky-50 border border-gray-200"}`}>
                  {s.slice(0,4)}
                </button>
              ))}
              <button onClick={async () => { if(await confirm(`Delete "${evt.id}"?`)){await deleteEventPledge(evt.id);load();} }}
                className="p-2 bg-red-50 text-red-500 rounded-xl cursor-pointer border border-red-200 hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {events.length===0 && !loading && (
          <div className="col-span-2 text-center py-12 text-xs text-gray-400">No event requests yet.</div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {detail && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">Event Request Detail</h3>
                <button onClick={() => setDetail(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4" /></button>
              </div>
              <dl className="space-y-3 text-xs">
                {[
                  { label:"ID", value:detail.id },
                  { label:"Name", value:detail.name },
                  { label:"Type", value:`${detail.eventType}${detail.customType ? ` — ${detail.customType}` : ""}` },
                  { label:"Preferred Date", value:detail.preferredDate },
                  { label:"Phone", value:detail.phone },
                  { label:"Email", value:detail.email },
                  { label:"Status", value:detail.status },
                  { label:"Submitted", value:detail.submittedAt },
                  { label:"Message", value:detail.message || "—" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                    <dt className="font-bold text-gray-500 shrink-0">{row.label}</dt>
                    <dd className="text-brand-sky-950 text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <button onClick={() => setDetail(null)} className="w-full mt-5 py-2.5 bg-brand-sky-400 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-sky-500">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Phase 6D — Admin Volunteer Roles Tab
// ══════════════════════════════════════════════════════════════════════════════

export function AdminVolRolesTab({ language, onVolunteerTypeChange }: { language: string; onVolunteerTypeChange?: (type: "applications" | "roles") => void }) {
  const { confirm, modal } = useConfirmation();
  const [categories, setCategories] = useState<VolunteerCategory[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded,   setExpanded]   = useState<string|null>(null);
  const [catModal,   setCatModal]   = useState<{open:boolean;editing:VolunteerCategory|null}>({open:false,editing:null});
  const [cf, setCf] = useState({ nameEn:"", nameAm:"", icon:"Users", color:"bg-brand-sky-400" });
  const [roleModal, setRoleModal] = useState<{open:boolean;catId:string;editing:any|null}>({open:false,catId:"",editing:null});
  const [rf, setRf] = useState({ nameEn:"", nameAm:"", descEn:"", descAm:"" });

  const load = async () => { setLoading(true); setCategories(await getVolunteerRoles()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const visibleCategories = categories.filter((cat) => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    const matchesCat = `${cat.name.en} ${cat.name.am}`.toLowerCase().includes(term);
    const matchesRoles = cat.roles?.some((role: any) =>
      `${role.name.en} ${role.name.am} ${role.description?.en || ""} ${role.description?.am || ""}`.toLowerCase().includes(term)
    );
    return matchesCat || matchesRoles;
  });

  const saveCat = async () => {
    if (!cf.nameEn.trim()) return;
    const existing = catModal.editing;
    const cat: VolunteerCategory = {
      id:    existing?.id || `vcat-${Date.now()}`,
      name:  { en: cf.nameEn.trim(), am: cf.nameAm.trim() },
      icon:  cf.icon,
      color: cf.color,
      roles: existing?.roles || [],
    };
    await saveVolunteerCategory(cat);
    setCatModal({open:false,editing:null}); load();
  };

  const saveRole = async () => {
    if (!rf.nameEn.trim()) return;
    const cat = categories.find(c => c.id === roleModal.catId);
    if (!cat) return;
    const newRole = {
      id:          roleModal.editing?.id || `vr-${Date.now()}`,
      name:        { en: rf.nameEn.trim(), am: rf.nameAm.trim() },
      description: { en: rf.descEn.trim(), am: rf.descAm.trim() },
    };
    const updatedRoles = roleModal.editing
      ? cat.roles.map((r: any) => r.id === newRole.id ? newRole : r)
      : [...cat.roles, newRole];
    await saveVolunteerCategory({ ...cat, roles: updatedRoles });
    setRoleModal({open:false,catId:"",editing:null}); load();
  };

  const delRole = async (catId: string, roleId: string, name: string) => {
    if (!(await confirm(`Delete "${name}"?`))) return;
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    await saveVolunteerCategory({ ...cat, roles: cat.roles.filter((r: any) => r.id !== roleId) });
    load();
  };

  return (
    <div className="space-y-4">
      {modal}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-sky-200 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onVolunteerTypeChange?.("applications")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-brand-sky-50 text-brand-sky-800 border border-brand-sky-200 hover:bg-brand-sky-100"
            >
              <Users className="w-4 h-4" />
              <span>{language === "am" ? "ማመልከቻዎች" : "Applications"}</span>
            </button>

            <button
              type="button"
              onClick={() => onVolunteerTypeChange?.("roles")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-purple-600 text-white shadow-sm border border-purple-700"
            >
              <Award className="w-4 h-4" />
              <span>{language === "am" ? "የበጎ ፈቃድ ሚናዎች" : "Volunteer Roles"}</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center xl:justify-end">

            <div className="relative w-full sm:w-72 md:w-80">
              <Search className="w-4 h-4 text-brand-sky-400 absolute left-3.5 top-2.5 sm:top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "am" ? "የሚና ስም ወይም ምድብ ይፈልጉ..." : "Search roles or categories..."}
                className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-brand-sky-50 rounded-xl border border-brand-sky-200 text-xs text-gray-900 focus:bg-white focus:border-brand-sky-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setCf({ nameEn: "", nameAm: "", icon: "Users", color: "bg-brand-sky-400" });
                setCatModal({ open: true, editing: null });
              }}
              className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === "am" ? "ምድብ ጨምር" : "Add Category"}</span>
            </button>

            <button
              onClick={load}
              disabled={loading}
              className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? (language === "am" ? "በመጫን ላይ..." : "Reloading...") : (language === "am" ? "አዙር" : "Reload")}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {visibleCategories.map(cat => (
          <div key={cat.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded===cat.id?null:cat.id)}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl ${cat.color} flex items-center justify-center text-white text-xs font-black`}>{cat.name.en.slice(0,2)}</div>
                <div>
                  <p className="font-bold text-sm text-brand-sky-950">{cat.name.en}</p>
                  <p className="text-[10px] text-gray-400">{cat.roles.length} roles</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e=>{e.stopPropagation();setCf({nameEn:cat.name.en,nameAm:cat.name.am,icon:cat.icon,color:cat.color});setCatModal({open:true,editing:cat});}}
                  className="p-1.5 bg-brand-sky-50 text-brand-sky-600 rounded-lg hover:bg-brand-sky-100 cursor-pointer border border-brand-sky-200 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={async e=>{e.stopPropagation();if(await confirm(`Delete "${cat.name.en}"?`)){deleteVolunteerCategory(cat.id).then(load);}}}
                  className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 cursor-pointer border border-red-200 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {expanded===cat.id?<ChevronUp className="w-4 h-4 text-gray-400"/>:<ChevronDown className="w-4 h-4 text-gray-400"/>}
              </div>
            </div>
            <AnimatePresence>
              {expanded===cat.id && (
                <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
                  <div className="border-t border-gray-100 p-4 space-y-2">
                    {cat.roles.map((role: any) => (
                      <div key={role.id} className="flex items-start justify-between bg-gray-50 border border-gray-100 rounded-xl p-3 gap-3">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-brand-sky-950">{role.name.en}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{role.description.en}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => { setRf({nameEn:role.name.en,nameAm:role.name.am,descEn:role.description.en,descAm:role.description.am}); setRoleModal({open:true,catId:cat.id,editing:role}); }}
                            className="p-1.5 bg-white text-brand-sky-600 rounded-lg hover:bg-brand-sky-50 cursor-pointer border border-brand-sky-200 transition-colors">
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button onClick={() => delRole(cat.id, role.id, role.name.en)}
                            className="p-1.5 bg-white text-red-400 rounded-lg hover:bg-red-50 cursor-pointer border border-red-200 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => { setRf({nameEn:"",nameAm:"",descEn:"",descAm:""}); setRoleModal({open:true,catId:cat.id,editing:null}); }}
                      className="w-full py-2 border-2 border-dashed border-brand-sky-200 rounded-xl text-xs font-bold text-brand-sky-500 hover:bg-brand-sky-50 cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Add Role
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {visibleCategories.length===0 && !loading && <p className="text-center text-xs text-gray-400 py-10">No roles found.</p>}
      </div>

      {/* Category modal */}
      <AnimatePresence>
        {catModal.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">{catModal.editing?"Edit Category":"Add Category"}</h3>
                <button onClick={()=>setCatModal({open:false,editing:null})} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Name (EN) *</label>
                    <input value={cf.nameEn} onChange={e=>setCf(p=>({...p,nameEn:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Name (AM)</label>
                    <input value={cf.nameAm} onChange={e=>setCf(p=>({...p,nameAm:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Icon</label>
                    <input value={cf.icon} onChange={e=>setCf(p=>({...p,icon:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Color class</label>
                    <input value={cf.color} onChange={e=>setCf(p=>({...p,color:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={()=>setCatModal({open:false,editing:null})} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50">Cancel</button>
                <button onClick={saveCat} className="flex-1 py-2.5 bg-brand-sky-400 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm">{catModal.editing?"Save":"Add"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Role modal */}
      <AnimatePresence>
        {roleModal.open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">{roleModal.editing?"Edit Role":"Add Role"}</h3>
                <button onClick={()=>setRoleModal({open:false,catId:"",editing:null})} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Role Name (EN) *</label>
                    <input value={rf.nameEn} onChange={e=>setRf(p=>({...p,nameEn:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Role Name (AM)</label>
                    <input value={rf.nameAm} onChange={e=>setRf(p=>({...p,nameAm:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Description (EN)</label>
                    <input value={rf.descEn} onChange={e=>setRf(p=>({...p,descEn:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Description (AM)</label>
                    <input value={rf.descAm} onChange={e=>setRf(p=>({...p,descAm:e.target.value}))} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={()=>setRoleModal({open:false,catId:"",editing:null})} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50">Cancel</button>
                <button onClick={saveRole} className="flex-1 py-2.5 bg-brand-sky-400 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm">{roleModal.editing?"Save":"Add"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Phase 6E — Admin News Tab
// ══════════════════════════════════════════════════════════════════════════════

export function AdminNewsTab({ language }: { language: string }) {
  const { confirm, modal } = useConfirmation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [editing,  setEditing]  = useState<NewsArticle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [af, setAf] = useState<Partial<NewsArticle>>({
    title:{en:"",am:""}, body:{en:"",am:""},
    category:"Community", coverImage:"", imagePaths:[], author:"", isPublished:false,
  });
  const [formLang, setFormLang] = useState<"en"|"am">("en");
  const [uploading, setUploading] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => { setLoading(true); setArticles(await getNews(true)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setAf({
      title:{en:"",am:""}, body:{en:"",am:""},
      category:"Community", coverImage:"", imagePaths:[], author:"", isPublished:false,
    });
    setShowForm(true);
  };

  const openEdit = (a: NewsArticle) => {
    setEditing(a);
    const paths = (a.imagePaths && a.imagePaths.length > 0)
      ? a.imagePaths
      : (a.coverImage ? [a.coverImage] : []);
    setAf({
      ...a,
      imagePaths: paths,
      coverImage: a.coverImage || paths[0] || "",
    });
    setShowForm(true);
  };

  const copyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleFileUpload = async (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList);
    setUploading(true);
    try {
      const uploadedUrls = await uploadImageFiles(files);
      if (uploadedUrls && uploadedUrls.length > 0) {
        setAf((prev) => {
          const currentPaths = prev.imagePaths || [];
          const updated = [...currentPaths, ...uploadedUrls];
          return {
            ...prev,
            imagePaths: updated,
            coverImage: prev.coverImage || updated[0] || "",
          };
        });
      }
    } catch (err) {
      console.error("Failed to upload image(s):", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setAf((prev) => {
      const updated = (prev.imagePaths || []).filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        imagePaths: updated,
        coverImage: updated[0] || "",
      };
    });
  };

  const handleSave = async (publish: boolean = false) => {
    if (!af.title?.en?.trim()) return;
    const slug = (editing?.slug || af.title.en).toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9\-]/g,"").slice(0,80) || `article-${Date.now()}`;
    const paths = af.imagePaths || [];
    const article: NewsArticle = {
      id:          editing?.id || `news-${Date.now()}`,
      slug,
      title:       af.title   || {en:"",am:""},
      body:        af.body    || {en:"",am:""},
      category:    af.category || "Community",
      coverImage:  paths[0] || af.coverImage || "",
      imagePaths:  paths,
      author:      af.author || "",
      publishedAt: editing?.publishedAt || new Date().toISOString(),
      isPublished: publish,
    };
    await saveArticle(article);
    setShowForm(false); load();
  };

  const togglePublish = async (a: NewsArticle) => {
    await publishArticle(a.id, !a.isPublished); load();
  };

  const del = async (id: string, title: string) => {
    if (!(await confirm(`Delete "${title}"?`))) return;
    await deleteArticle(id); load();
  };

  const catColors: Record<string,string> = {
    Health:"bg-brand-sky-100 text-brand-sky-700",
    Community:"bg-brand-green-100 text-brand-green-700",
    Events:"bg-brand-yellow-100 text-brand-yellow-600",
    Announcements:"bg-brand-orange-100 text-brand-orange-700",
    Stories:"bg-purple-100 text-purple-700",
  };

  return (
    <div className="space-y-4">
      {modal}
      <SectionHeader icon={Newspaper} title={language==="am"?"ዜናዎች አስተዳደር":"News Management"} onRefresh={load} loading={loading}
        onAdd={openAdd} addLabel="New Article"
        subtitle={`${articles.filter(a=>a.isPublished).length} published · ${articles.filter(a=>!a.isPublished).length} drafts`} />

      {/* News Table */}
      <div className="bg-white border border-brand-sky-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-brand-sky-50/70 border-b border-brand-sky-100 text-[11px] font-black uppercase text-brand-sky-900 tracking-wider">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4 w-36">Status</th>
                <th className="py-3 px-4">Attached Images / Path</th>
                <th className="py-3 px-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {articles.map(a => {
                const paths = (a.imagePaths && a.imagePaths.length > 0)
                  ? a.imagePaths
                  : (a.coverImage ? [a.coverImage] : []);
                return (
                  <tr key={a.id} className="hover:bg-brand-sky-50/30 transition-colors">
                    {/* Article / Title column */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1 max-w-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${catColors[a.category] || "bg-gray-100 text-gray-600"}`}>
                            {a.category}
                          </span>
                        </div>
                        <p className="font-serif font-bold text-sm text-brand-sky-950 line-clamp-1">{a.title.en}</p>
                        {a.title.am && (
                          <p className="text-[11px] text-gray-600 line-clamp-1">{a.title.am}</p>
                        )}
                        <p className="text-[10px] text-gray-400">
                          {a.author ? `${a.author} · ` : ""}{new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </td>

                    {/* Status column */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-2">
                        <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${a.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {a.isPublished ? "Published" : "Draft"}
                        </span>
                        <div>
                          <button
                            onClick={() => togglePublish(a)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${a.isPublished ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-brand-sky-50"}`}
                          >
                            {a.isPublished ? <><EyeOff className="w-3 h-3" />Unpublish</> : <><Eye className="w-3 h-3" />Publish</>}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Attached Images / Path column */}
                    <td className="py-3.5 px-4 align-top">
                      {paths.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-sky-700">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>{paths.length} {paths.length === 1 ? "Image" : "Images"}</span>
                          </div>
                          <div className="space-y-1.5">
                            {paths.map((p, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-gray-50 hover:bg-brand-sky-50/50 p-1.5 rounded-xl border border-gray-100 transition-colors">
                                <img
                                  src={resolveImagePath(p)}
                                  alt=""
                                  className="w-8 h-8 rounded-lg object-cover shrink-0 border border-gray-200 bg-white"
                                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    {idx === 0 && (
                                      <span className="text-[8px] font-bold uppercase px-1 py-0.2 bg-brand-sky-100 text-brand-sky-700 rounded shrink-0">Cover</span>
                                    )}
                                    <span className="font-mono text-[10px] text-gray-700 truncate select-all block max-w-[200px]" title={p}>
                                      {p}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => copyPath(p)}
                                  title="Copy image path"
                                  className="p-1 rounded-md text-gray-400 hover:text-brand-sky-600 hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-brand-sky-200"
                                >
                                  {copiedPath === p ? (
                                    <Check className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                                <a
                                  href={resolveImagePath(p)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open in new tab"
                                  className="p-1 rounded-md text-gray-400 hover:text-brand-sky-600 hover:bg-white transition-colors border border-transparent hover:border-brand-sky-200"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-gray-400 italic flex items-center gap-1.5 py-1">
                          <ImageIcon className="w-3.5 h-3.5 text-gray-300" />
                          <span>No attached images</span>
                        </div>
                      )}
                    </td>

                    {/* Actions column */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(a)}
                          className="px-2.5 py-1.5 bg-brand-sky-50 text-brand-sky-700 rounded-xl text-[10px] font-bold cursor-pointer hover:bg-brand-sky-100 border border-brand-sky-200 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />Edit
                        </button>
                        <button
                          onClick={() => del(a.id, a.title.en)}
                          className="p-1.5 bg-red-50 text-red-500 rounded-xl cursor-pointer border border-red-200 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {articles.length === 0 && !loading && (
          <div className="text-center py-12 text-xs text-gray-400 space-y-2">
            <Newspaper className="w-10 h-10 text-brand-sky-200 mx-auto" />
            <p>No articles yet. Create your first one!</p>
          </div>
        )}
      </div>

      {/* Article form modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-4xl max-h-[calc(100vh-2rem)] overflow-y-auto p-4 sm:p-5 my-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">{editing?"Edit Article":"New Article"}</h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4"/></button>
              </div>

              {/* Language tabs */}
              <div className="flex gap-2 mb-3 bg-gray-100 p-1 rounded-xl">
                {(["en","am"] as const).map(l => (
                  <button key={l} type="button" onClick={() => setFormLang(l)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${formLang===l?"bg-white text-brand-sky-950 shadow-xs":"text-gray-600 hover:text-gray-900"}`}>
                    {l === "en" ? "English" : "አማርኛ"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Title ({formLang.toUpperCase()}) *</label>
                  <input
                    value={(af.title as any)?.[formLang]||""}
                    onChange={e=>setAf(p=>({...p,title:{...(p.title||{en:"",am:""}), [formLang]:e.target.value}}))}
                    placeholder={formLang === "en" ? "Article title in English..." : "የዜናው ርዕስ በአማርኛ..."}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Body ({formLang.toUpperCase()}) — use blank lines for paragraphs</label>
                  <textarea
                    rows={5}
                    value={(af.body as any)?.[formLang]||""}
                    onChange={e=>setAf(p=>({...p,body:{...(p.body||{en:"",am:""}), [formLang]:e.target.value}}))}
                    placeholder={formLang === "en" ? "Write article content here..." : "የዜናውን ዝርዝር እዚህ ይጻፉ..."}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 resize-none font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                    <select
                      value={af.category||"Community"}
                      onChange={e=>setAf(p=>({...p,category:e.target.value}))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 bg-white"
                    >
                      {NEWS_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Author</label>
                    <input
                      value={af.author||""}
                      onChange={e=>setAf(p=>({...p,author:e.target.value}))}
                      placeholder="Admin name"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"
                    />
                  </div>
                </div>

                {/* Attached Images Section - Independent of language tabs */}
                <div className="p-3.5 bg-brand-sky-50/50 border border-brand-sky-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-brand-sky-950 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-brand-sky-500" />
                        Attached Images
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        Images are saved under <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-brand-sky-700">uploads/</code> and persist across languages.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-brand-sky-700 bg-brand-sky-100 px-2 py-0.5 rounded-full">
                      {(af.imagePaths || []).length} attached
                    </span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => handleFileUpload(e.target.files)}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); }}
                    onDrop={e => {
                      e.preventDefault();
                      handleFileUpload(e.dataTransfer.files);
                    }}
                    className="border-2 border-dashed border-brand-sky-300 hover:border-brand-sky-500 rounded-xl p-4 text-center cursor-pointer bg-white hover:bg-brand-sky-50/40 transition-all group"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center gap-2 text-brand-sky-600 text-xs font-bold py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading images to codebase...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="w-8 h-8 rounded-full bg-brand-sky-100 text-brand-sky-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-brand-sky-950">
                          Click to upload or drag and drop images
                        </p>
                        <p className="text-[10px] text-gray-400">
                          PNG, JPG, WEBP, GIF · Multiple images supported
                        </p>
                      </div>
                    )}
                  </div>

                  {(af.imagePaths || []).length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Attached Files & Codebase Paths:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {(af.imagePaths || []).map((path, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-gray-200 shadow-xs group">
                            <div className="relative shrink-0">
                              <img src={resolveImagePath(path)} alt="" className="w-11 h-11 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                              {idx === 0 && (
                                <span className="absolute -top-1.5 -left-1.5 bg-brand-sky-600 text-white text-[8px] font-black uppercase px-1 py-0.2 rounded shadow-xs">
                                  Cover
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-[10px] text-gray-700 truncate select-all" title={path}>
                                {path}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => copyPath(path)}
                                  className="text-[9px] text-brand-sky-600 hover:text-brand-sky-800 font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedPath === path ? (
                                    <><Check className="w-3 h-3 text-green-600" /> Copied</>
                                  ) : (
                                    <><Copy className="w-3 h-3" /> Copy Path</>
                                  )}
                                </button>
                                <a
                                  href={path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[9px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" /> View
                                </a>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              title="Remove image"
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 border border-gray-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    className="py-2.5 px-5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all hover:shadow-md flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Publish
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Admin Settings Tab (Site Configuration: Banks, Social Media, Contact & Legal)
// ══════════════════════════════════════════════════════════════════════════════

export function AdminSettingsTab({ language }: { language: string }) {
  const { confirm, modal } = useConfirmation();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState<"banks" | "social" | "contact">("banks");

  // Bank edit/add modal state
  const [editingBankIndex, setEditingBankIndex] = useState<number | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState<BankAccount>({
    bank: { en: "", am: "" },
    accountNumber: "",
    accountName: "",
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveAll = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await saveSiteSettings(settings);
      setSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to save settings:", err);
      alert("Failed to save settings. Please check server connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    const isOk = await confirm("Are you sure you want to reset all site settings (Bank accounts, Social links, Contact info) to factory defaults?");
    if (!isOk) return;
    setSaving(true);
    try {
      const def = await resetSiteSettings();
      setSettings(def);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to reset settings:", err);
    } finally {
      setSaving(false);
    }
  };

  // Bank operations
  const openAddBank = () => {
    setEditingBankIndex(null);
    setBankForm({
      bank: { en: "", am: "" },
      accountNumber: "",
      accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
    });
    setShowBankModal(true);
  };

  const openEditBank = (index: number) => {
    if (!settings) return;
    setEditingBankIndex(index);
    setBankForm({ ...settings.bankAccounts[index] });
    setShowBankModal(true);
  };

  const handleSaveBank = () => {
    if (!settings || !bankForm.accountNumber) return;
    const list = [...settings.bankAccounts];
    if (editingBankIndex !== null) {
      list[editingBankIndex] = bankForm;
    } else {
      list.push(bankForm);
    }
    setSettings({ ...settings, bankAccounts: list });
    setShowBankModal(false);
  };

  const handleDeleteBank = async (index: number) => {
    if (!settings) return;
    const target = settings.bankAccounts[index];
    const ok = await confirm(`Remove bank account "${target.bank.en || target.bank.am} (${target.accountNumber})"?`);
    if (!ok) return;
    const list = settings.bankAccounts.filter((_, i) => i !== index);
    setSettings({ ...settings, bankAccounts: list });
  };

  const handleMoveBank = (index: number, direction: "up" | "down") => {
    if (!settings) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= settings.bankAccounts.length) return;
    const list = [...settings.bankAccounts];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setSettings({ ...settings, bankAccounts: list });
  };

  // Phone operations
  const handleAddPhone = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      contact: {
        ...settings.contact,
        phones: [...settings.contact.phones, ""],
      },
    });
  };

  const handleUpdatePhone = (index: number, val: string) => {
    if (!settings) return;
    const phones = [...settings.contact.phones];
    phones[index] = val;
    setSettings({
      ...settings,
      contact: { ...settings.contact, phones },
    });
  };

  const handleDeletePhone = (index: number) => {
    if (!settings) return;
    const phones = settings.contact.phones.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      contact: { ...settings.contact, phones },
    });
  };

  if (!settings && loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white border border-brand-sky-200 rounded-3xl">
        <Loader2 className="w-8 h-8 text-brand-sky-500 animate-spin mb-3" />
        <p className="text-xs font-bold text-brand-sky-600">Loading site configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {modal}

      {/* Header */}
      <SectionHeader
        icon={Settings}
        title={language === "am" ? "የድርጅት መረጃ እና ቅንብሮች" : "Site Configuration & Settings"}
        subtitle={
          language === "am"
            ? "የባንክና ቴሌብር አካውንቶች፣ ማህበራዊ ሚዲያ እና የመገኛ አድራሻዎች ማስተዳደሪያ"
            : "Manage Bank/Telebirr accounts, social media links, and organization information"
        }
        onRefresh={loadSettings}
        loading={loading}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              disabled={saving || loading}
              className="px-3.5 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Reset to default settings"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>{language === "am" ? "ወደ ነባሪ መልስ" : "Defaults"}</span>
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving || loading}
              className="px-4 py-2 bg-brand-green-500 hover:bg-brand-green-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === "am" ? "በማስቀመጥ ላይ..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === "am" ? "ቅንብሮቹን አስቀምጥ" : "Save Settings"}</span>
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Save Success Alert */}
      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between text-green-800"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">
                  {language === "am" ? "ቅንብሮቹ በተሳካ ሁኔታ ተቀምጠዋል!" : "Settings saved and published successfully!"}
                </p>
                <p className="text-[11px] text-green-600">
                  {language === "am"
                    ? "ለውጦቹ በዋናው ድረ-ገጽ ላይ ወዲያውኑ ይታያሉ።"
                    : "Live changes are now active across the entire website."}
                </p>
              </div>
            </div>
            <button onClick={() => setSavedSuccess(false)} className="p-1 hover:bg-green-100 rounded-lg text-green-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-brand-sky-100 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubSection("banks")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubSection === "banks"
              ? "bg-brand-sky-500 text-white shadow-sm"
              : "bg-white text-brand-sky-700 hover:bg-brand-sky-50 border border-brand-sky-100"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{language === "am" ? "ባንክና ቴሌብር" : "Bank & Telebirr"}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeSubSection === "banks" ? "bg-white/20 text-white" : "bg-brand-sky-100 text-brand-sky-700"}`}>
            {settings?.bankAccounts.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveSubSection("social")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubSection === "social"
              ? "bg-brand-sky-500 text-white shadow-sm"
              : "bg-white text-brand-sky-700 hover:bg-brand-sky-50 border border-brand-sky-100"
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>{language === "am" ? "ማህበራዊ ሚዲያ" : "Social Media Links"}</span>
        </button>

        <button
          onClick={() => setActiveSubSection("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubSection === "contact"
              ? "bg-brand-sky-500 text-white shadow-sm"
              : "bg-white text-brand-sky-700 hover:bg-brand-sky-50 border border-brand-sky-100"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>{language === "am" ? "አድራሻ፣ ስልክና ምዝገባ" : "Contact & Organization Info"}</span>
        </button>
      </div>

      {/* ── Sub-Section: Banks ── */}
      {activeSubSection === "banks" && settings && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-brand-sky-950">
                {language === "am" ? "የባንክና የቴሌብር አካውንቶች" : "Configured Bank & Mobile Money Accounts"}
              </h3>
              <p className="text-xs text-brand-sky-500">
                {language === "am"
                  ? "በልገሳ ክፍል (Donation Section) ውስጥ የሚታዩ የባንክ ቁጥሮች"
                  : "Accounts displayed on the public donation page for direct deposits and transfers"}
              </p>
            </div>
            <button
              onClick={openAddBank}
              className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {language === "am" ? "አዲስ ባንክ ጨምር" : "Add Account"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.bankAccounts.map((item, idx) => {
              const isTelebirr =
                item.bank.en.toLowerCase().includes("telebirr") ||
                item.bank.am.includes("ቴሌብር");
              return (
                <div
                  key={idx}
                  className={`bg-white border rounded-2xl p-4 shadow-xs transition-all relative flex flex-col justify-between ${
                    isTelebirr
                      ? "border-emerald-200 bg-linear-to-br from-white to-emerald-50/30"
                      : "border-brand-sky-100"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isTelebirr
                              ? "bg-emerald-500 text-white shadow-sm"
                              : "bg-brand-sky-100 text-brand-sky-700"
                          }`}
                        >
                          {isTelebirr ? <Smartphone className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-brand-sky-950">
                            {item.bank.en || item.bank.am}
                          </h4>
                          {item.bank.am && item.bank.am !== item.bank.en && (
                            <p className="text-[11px] text-brand-sky-500 font-medium">{item.bank.am}</p>
                          )}
                        </div>
                      </div>

                      {/* Move & Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveBank(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveBank(idx, "down")}
                          disabled={idx === settings.bankAccounts.length - 1}
                          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditBank(idx)}
                          className="p-1.5 hover:bg-brand-sky-50 rounded-lg text-brand-sky-600 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBank(idx)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Account Number box */}
                    <div className="p-3 bg-brand-sky-50/70 rounded-xl border border-brand-sky-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-brand-sky-500 uppercase font-black tracking-wider block">
                          {isTelebirr ? "Telebirr Number" : "Account Number"}
                        </span>
                        <code className="text-sm font-black font-mono text-brand-sky-900 tracking-wide">
                          {item.accountNumber}
                        </code>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.accountNumber);
                          alert(`Copied ${item.accountNumber}`);
                        }}
                        className="p-1.5 hover:bg-brand-sky-200/50 rounded-lg text-brand-sky-600 transition-colors cursor-pointer"
                        title="Copy account number"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Account Name */}
                    {item.accountName && (
                      <div className="text-[11px] text-brand-sky-600 font-medium">
                        <span className="text-gray-400">Recipient Name:</span> {item.accountName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Sub-Section: Social Media ── */}
      {activeSubSection === "social" && settings && (
        <div className="bg-white border border-brand-sky-100 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-serif font-bold text-base text-brand-sky-950">
              {language === "am" ? "የማህበራዊ ሚዲያ አድራሻዎች" : "Official Social Media Channels"}
            </h3>
            <p className="text-xs text-brand-sky-500">
              {language === "am"
                ? "በግርጌ (Footer) እና በመገኛ ክፍል ውስጥ የሚታዩ አድራሻዎች"
                : "Links displayed in the website header, footer, and contact sections"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Telegram */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-sky-900 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-500" /> Telegram Channel / Group
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://t.me/..."
                  value={settings.social.telegram || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, telegram: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                />
                {settings.social.telegram && (
                  <a
                    href={settings.social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-50 text-brand-sky-600 transition-colors shrink-0"
                    title="Test Telegram link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Facebook */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-sky-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" /> Facebook Page
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={settings.social.facebook || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, facebook: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                />
                {settings.social.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-50 text-brand-sky-600 transition-colors shrink-0"
                    title="Test Facebook link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* TikTok */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-sky-900 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-gray-800" /> TikTok Channel
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://tiktok.com/@..."
                  value={settings.social.tiktok || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, tiktok: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                />
                {settings.social.tiktok && (
                  <a
                    href={settings.social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-50 text-brand-sky-600 transition-colors shrink-0"
                    title="Test TikTok link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* YouTube */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-sky-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-red-600" /> YouTube Channel
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://youtube.com/@..."
                  value={settings.social.youtube || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, youtube: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                />
                {settings.social.youtube && (
                  <a
                    href={settings.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-50 text-brand-sky-600 transition-colors shrink-0"
                    title="Test YouTube link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-sky-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-pink-600" /> Instagram Profile (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={settings.social.instagram || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, instagram: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                />
                {settings.social.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-50 text-brand-sky-600 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            {/* LinkedIn / X */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-sky-900 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-700" /> LinkedIn / Other (Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://linkedin.com/..."
                  value={settings.social.linkedin || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      social: { ...settings.social, linkedin: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                />
                {settings.social.linkedin && (
                  <a
                    href={settings.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-50 text-brand-sky-600 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Section: Contact & Organization Info ── */}
      {activeSubSection === "contact" && settings && (
        <div className="space-y-5">
          {/* Phone Numbers */}
          <div className="bg-white border border-brand-sky-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-brand-sky-950 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-sky-500" />
                  {language === "am" ? "የስልክ ቁጥሮች" : "Direct Phone Lines"}
                </h4>
                <p className="text-[11px] text-brand-sky-500">
                  {language === "am"
                    ? "ጎብኝዎች እና ደጋፊዎች በቀጥታ የሚደውሉባቸው ቁጥሮች"
                    : "Phone numbers displayed for callers and donors"}
                </p>
              </div>
              <button
                onClick={handleAddPhone}
                className="px-3 py-1.5 bg-brand-sky-100 hover:bg-brand-sky-200 text-brand-sky-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" /> {language === "am" ? "ስልክ ጨምር" : "Add Phone"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {settings.contact.phones.map((phone, pIdx) => (
                <div key={pIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handleUpdatePhone(pIdx, e.target.value)}
                    placeholder="+251..."
                    className="flex-1 px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-mono font-bold text-brand-sky-900 focus:outline-hidden focus:border-brand-sky-500"
                  />
                  <button
                    onClick={() => handleDeletePhone(pIdx)}
                    disabled={settings.contact.phones.length <= 1}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-20 cursor-pointer"
                    title="Remove phone number"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Email & Address */}
          <div className="bg-white border border-brand-sky-100 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-brand-sky-950 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-sky-500" />
              {language === "am" ? "ኢሜይል እና አድራሻ" : "Email & Physical Address"}
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      contact: { ...settings.contact, email: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                    Physical Address (English)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.contact.address.en}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: {
                          ...settings.contact,
                          address: { ...settings.contact.address, en: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                    የአድራሻ ዝርዝር (አማርኛ)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.contact.address.am}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        contact: {
                          ...settings.contact,
                          address: { ...settings.contact.address, am: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Legal Registration & Motto */}
          <div className="bg-white border border-brand-sky-100 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-brand-sky-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-sky-500" />
              {language === "am" ? "የህጋዊ ምዝገባ መረጃ እና መሪ ቃል" : "Legal Registration & Organization Motto"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={settings.registration?.number || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      registration: {
                        agency: settings.registration?.agency || { en: "", am: "" },
                        date: settings.registration?.date || "",
                        number: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-mono text-brand-sky-950 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                  Registration Date
                </label>
                <input
                  type="text"
                  value={settings.registration?.date || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      registration: {
                        agency: settings.registration?.agency || { en: "", am: "" },
                        number: settings.registration?.number || "",
                        date: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                  Regulating Agency (English)
                </label>
                <input
                  type="text"
                  value={settings.registration?.agency.en || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      registration: {
                        number: settings.registration?.number || "",
                        date: settings.registration?.date || "",
                        agency: {
                          am: settings.registration?.agency.am || "",
                          en: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                  የመዘገበው ኤጀንሲ ስም (አማርኛ)
                </label>
                <input
                  type="text"
                  value={settings.registration?.agency.am || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      registration: {
                        number: settings.registration?.number || "",
                        date: settings.registration?.date || "",
                        agency: {
                          en: settings.registration?.agency.en || "",
                          am: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Motto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-brand-sky-50">
              <div>
                <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                  Motto (English)
                </label>
                <input
                  type="text"
                  value={settings.motto?.en || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      motto: {
                        am: settings.motto?.am || "",
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                  መሪ ቃል (አማርኛ)
                </label>
                <input
                  type="text"
                  value={settings.motto?.am || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      motto: {
                        en: settings.motto?.en || "",
                        am: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Add / Edit Bank Account ── */}
      <AnimatePresence>
        {showBankModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-brand-sky-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-serif font-bold text-lg text-brand-sky-950">
                  {editingBankIndex !== null ? "Edit Bank Account" : "Add New Account"}
                </h3>
                <button
                  onClick={() => setShowBankModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 py-4">
                {/* Bank name EN */}
                <div>
                  <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                    Bank / Service Name (English) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Telebirr (Mobile Money), Commercial Bank of Ethiopia"
                    value={bankForm.bank.en}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        bank: { ...bankForm.bank, en: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                  />
                </div>

                {/* Bank name AM */}
                <div>
                  <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                    የባንክ / የአገልግሎት ስም (አማርኛ)
                  </label>
                  <input
                    type="text"
                    placeholder="ለምሳሌ፡ ቴሌብር / Telebirr, የኢትዮጵያ ንግድ ባንክ"
                    value={bankForm.bank.am}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        bank: { ...bankForm.bank, am: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                    Account / Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0911004903 or 1000275107518"
                    value={bankForm.accountNumber}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        accountNumber: e.target.value.replace(/\s+/g, ""),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-mono font-bold text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                  />
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="text-xs font-bold text-brand-sky-900 block mb-1">
                    Account Holder / Recipient Name (የሂሳቡ ባለቤት ስም)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ሚኪያስ ለገሰ / ሰሊሆም (Mikiyas Legesse)"
                    value={bankForm.accountName || ""}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        accountName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveBank}
                  disabled={!bankForm.accountNumber || (!bankForm.bank.en && !bankForm.bank.am)}
                  className="py-2.5 px-5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {editingBankIndex !== null ? "Update Account" : "Add Account"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

