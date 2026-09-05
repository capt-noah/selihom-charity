/**
 * AdminTabs.tsx
 * All 5 new admin panel tabs:
 *   - AdminMedicineTab    (Phase 6A)
 *   - AdminSuppliesTab    (Phase 6B)
 *   - AdminEventsTab      (Phase 6C)
 *   - AdminVolRolesTab    (Phase 6D)
 *   - AdminNewsTab        (Phase 6E)
 */
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Pill, Package, Heart, Users, Newspaper,
  Plus, Edit3, Trash2, Check, X, Save,
  Loader2, AlertCircle, CheckCircle2, Eye, EyeOff,
  RefreshCw, Globe, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  getMedicineItems,    saveMedicineItem,    deleteMedicineItem,    MedicineItem,
  getMedicinePledges,  updateMedicinePledgeStatus, deleteMedicinePledge, MedicinePledge,
  getSupplyCategories, saveSupplyCategory,  deleteSupplyCategory,  SupplyCategory, SupplyItem,
  getSuppliesPledges,  updateSuppliesPledgeStatus, deleteSuppliesPledge,
  getEventPledges,     updateEventPledgeStatus,    deleteEventPledge,  EventPledge,
  getVolunteerRoles,   saveVolunteerCategory,      deleteVolunteerCategory, VolunteerCategory,
  getNews,             saveArticle,         deleteArticle,         publishArticle, NewsArticle,
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
        <div className="w-9 h-9 bg-brand-sky-100 text-brand-sky-600 rounded-xl flex items-center justify-center border border-brand-sky-200">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-base text-brand-sky-950 leading-tight">{title}</h2>
          {subtitle && <p className="text-[11px] text-brand-sky-500 font-medium">{subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 self-end xl:self-auto justify-end w-full xl:w-auto">
        {actions}
        {onRefresh && (
          <button onClick={onRefresh} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-sky-600 bg-brand-sky-50 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-100 cursor-pointer disabled:opacity-50 transition-colors">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />Refresh
          </button>
        )}
        {onAdd && (
          <button onClick={onAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-brand-sky-400 hover:bg-brand-sky-500 rounded-xl cursor-pointer shadow-sm transition-colors">
            <Plus className="w-3.5 h-3.5" />{addLabel || "Add"}
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Phase 6A — Admin Medicine Tab
// ══════════════════════════════════════════════════════════════════════════════

export function AdminMedicineTab({ language, onPledgeTypeChange }: { language: string; onPledgeTypeChange?: (type: "inkind" | "medicine" | "supplies") => void }) {
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
    if (!form.name) return;
    const item: MedicineItem = {
      id:             editing?.id || `med-${Date.now()}`,
      name:           form.name!,
      monthlyQty:     form.monthlyQty || 0,
      unitPrice:      form.unitPrice  || 0,
      totalMonthly:   form.totalMonthly || 0,
      patientsHelped: form.patientsHelped || 0,
      urgency:        form.urgency as MedicineItem["urgency"],
      description:    form.description || { en: "", am: "" },
    };
    await saveMedicineItem(item);
    setShowForm(false); load();
  };

  const del = async (id: string, name: string) => {
    if (!(await confirm(`Delete "${name}"?`))) return;
    await deleteMedicineItem(id); load();
  };

  const visibleMedicines = medicines.filter((med) => med.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const visiblePledges = pledges.filter((pledge) => `${pledge.id} ${pledge.donorName}`.toLowerCase().includes(searchQuery.toLowerCase()) && (pledgeStatus === "all" || pledge.status === pledgeStatus));

  const urgencyColor: Record<string,string> = {
    High:"bg-red-100 text-red-700 border-red-200",
    Medium:"bg-amber-100 text-amber-700 border-amber-200",
    Low:"bg-sky-100 text-sky-700 border-sky-200",
  };

  return (
    <div className="space-y-4">
      {modal}
      <SectionHeader icon={Pill} title={language==="am"?"መድሃኒቶች አስተዳደር":"Medicine Management"} onRefresh={load} loading={loading}
        actions={<>
          <div className="relative w-44 sm:w-56">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search medicines..."
              className="w-full rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs outline-none focus:border-brand-sky-400" />
          </div>
          <select value={subTab} onChange={(e) => setSubTab(e.target.value as "items" | "pledges")}
            className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400">
            <option value="items">{language === "am" ? "የመድሃኒት ዝርዝር" : "Medicine List"}</option>
            <option value="pledges">{language === "am" ? "ቃልኪዳኖች" : "Pledges"}</option>
          </select>
          {subTab === "pledges" && <select value={pledgeStatus} onChange={(e) => setPledgeStatus(e.target.value)} className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400">
            <option value="all">{language === "am" ? "ሁሉም" : "All"}</option>
            <option value="pledged">{language === "am" ? "ቃልኪዳን" : "Pledged"}</option>
            <option value="received">{language === "am" ? "ተቀበለ" : "Received"}</option>
            <option value="cancelled">{language === "am" ? "ተሰርዟል" : "Cancelled"}</option>
          </select>}
          {onPledgeTypeChange && <select value="medicine" onChange={(e) => onPledgeTypeChange(e.target.value as "inkind" | "medicine" | "supplies")}
            className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400">
            <option value="inkind">{language === "am" ? "ዓይነት እቃ" : "In-Kind"}</option>
            <option value="medicine">{language === "am" ? "መድሃኒት" : "Medicine"}</option>
            <option value="supplies">{language === "am" ? "ቁሳቁስ" : "Supplies"}</option>
          </select>}
          {subTab === "items" && <button onClick={openAdd} className="flex items-center gap-1.5 rounded-xl bg-brand-sky-400 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-sky-500"><Plus className="w-3.5 h-3.5" />Add</button>}
        </>} />

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
          {visiblePledges.map(p => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black text-brand-sky-700 bg-brand-sky-50 border border-brand-sky-200 px-2 py-0.5 rounded-md">{p.id}</span>
                  <StatusBadge status={p.status} map={BOOKING_STATUS_COLORS} />
                </div>
                <p className="font-serif font-bold text-sm text-brand-sky-950">{p.donorName}</p>
                <p className="text-[11px] text-gray-500">{p.donorPhone || p.donorEmail} · {p.date}</p>
                <p className="text-[11px] text-gray-700">{p.items.map(i => `${i.medicineName} ×${i.quantity}`).join(", ")}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
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
          ))}
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

export function AdminSuppliesTab({ language, onPledgeTypeChange }: { language: string; onPledgeTypeChange?: (type: "inkind" | "medicine" | "supplies") => void }) {
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
    const [c, p] = await Promise.all([getSupplyCategories(), (await import("../utils/adminStorage")).getSuppliesPledges()]);
    setCategories(c); setPledges(p); setLoading(false);
  };
  useEffect(() => { load(); }, []);

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
    if (!(await confirm(`Delete "${name}"?`))) return;
    await deleteSupplyCategory(id); load();
  };

  const saveItem = async () => {
    if (!itf.nameEn.trim()) return;
    const cat = categories.find(c => c.id === itemForm.catId);
    if (!cat) return;
    const newItem: SupplyItem = {
      id:           itemForm.editing?.id || `itm-${Date.now()}`,
      name:         { en: itf.nameEn.trim(), am: itf.nameAm.trim() },
      neededQty:    { en: itf.neededQtyEn.trim(), am: itf.neededQtyAm.trim() },
      impactDesc:   { en: itf.impactEn.trim(), am: itf.impactAm.trim() },
      urgency:      itf.urgency,
    };
    const updatedItems = itemForm.editing
      ? cat.items.map((i: SupplyItem) => i.id === newItem.id ? newItem : i)
      : [...cat.items, newItem];
    await saveSupplyCategory({ ...cat, items: updatedItems });
    setItemForm({ open:false, catId:"", editing:null }); load();
  };

  const delItem = async (catId: string, itemId: string, name: string) => {
    if (!(await confirm(`Delete "${name}"?`))) return;
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    await saveSupplyCategory({ ...cat, items: cat.items.filter((i: SupplyItem) => i.id !== itemId) });
    load();
  };

  const visibleCategories = categories.filter((cat) => `${cat.name.en} ${cat.name.am}`.toLowerCase().includes(searchQuery.toLowerCase()));
  const visiblePledges = pledges.filter((pledge) => `${pledge.id} ${pledge.donorName || ""}`.toLowerCase().includes(searchQuery.toLowerCase()) && (pledgeStatus === "all" || pledge.status === pledgeStatus));

  return (
    <div className="space-y-4">
      {modal}
      <SectionHeader icon={Package} title={language==="am"?"ቁሳቁሶች አስተዳደር":"Supplies Management"} onRefresh={load} loading={loading}
        actions={<>
          <div className="relative w-44 sm:w-56">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search supplies..."
              className="w-full rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs outline-none focus:border-brand-sky-400" />
          </div>
          <select value={subTab} onChange={(e) => setSubTab(e.target.value as "cats" | "pledges")}
            className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400">
            <option value="cats">{language === "am" ? "ምድቦች" : "Categories"}</option>
            <option value="pledges">{language === "am" ? "ቃልኪዳኖች" : "Pledges"}</option>
          </select>
          {subTab === "pledges" && <select value={pledgeStatus} onChange={(e) => setPledgeStatus(e.target.value)} className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400">
            <option value="all">{language === "am" ? "ሁሉም" : "All"}</option>
            <option value="pledged">{language === "am" ? "ቃልኪዳን" : "Pledged"}</option>
            <option value="received">{language === "am" ? "ተቀበለ" : "Received"}</option>
            <option value="cancelled">{language === "am" ? "ተሰርዟል" : "Cancelled"}</option>
          </select>}
          {onPledgeTypeChange && <select value="supplies" onChange={(e) => onPledgeTypeChange(e.target.value as "inkind" | "medicine" | "supplies")}
            className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400">
            <option value="inkind">{language === "am" ? "ዓይነት እቃ" : "In-Kind"}</option>
            <option value="medicine">{language === "am" ? "መድሃኒት" : "Medicine"}</option>
            <option value="supplies">{language === "am" ? "ቁሳቁስ" : "Supplies"}</option>
          </select>}
          {subTab === "cats" && <button onClick={() => { setCf({nameEn:"",nameAm:"",icon:"Package",color:"bg-brand-sky-400"}); setCatForm({open:true,editing:null}); }} className="flex items-center gap-1.5 rounded-xl bg-brand-sky-400 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-sky-500"><Plus className="w-3.5 h-3.5" />Add</button>}
        </>} />

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
          {visiblePledges.map((p: any) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black text-brand-sky-700 bg-brand-sky-50 border border-brand-sky-200 px-2 py-0.5 rounded-md">{p.id}</span>
                  <StatusBadge status={p.status} map={BOOKING_STATUS_COLORS} />
                </div>
                <p className="font-serif font-bold text-sm text-brand-sky-950">{p.donorName}</p>
                <p className="text-[11px] text-gray-500">{p.donorPhone || p.donorEmail} · {p.date}</p>
                <p className="text-[11px] text-gray-600">{p.items?.map((i: any) => `${i.itemName||i.custom} ×${i.quantity}`).join(", ")}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {["pledged","received","cancelled"].map(s => (
                  <button key={s} onClick={async () => { await updateSuppliesPledgeStatus(p.id, s as any); load(); }}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer ${p.status===s?"bg-brand-sky-400 text-white":"bg-gray-50 text-gray-600 hover:bg-brand-sky-50 border border-gray-200"}`}>
                    {s}
                  </button>
                ))}
                <button onClick={async () => { if(await confirm(`Delete "${p.id}"?`)){await deleteSuppliesPledge(p.id);load();} }}
                  className="p-1 bg-red-50 text-red-500 rounded-lg cursor-pointer border border-red-200 flex items-center justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
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

  const visibleCategories = categories.filter((cat) => `${cat.name.en} ${cat.name.am}`.toLowerCase().includes(searchQuery.toLowerCase()));

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
      <SectionHeader icon={Users} title={language==="am"?"የበጎ ፈቃደኝነት ሚናዎች":"Volunteer Roles Management"} onRefresh={load} loading={loading}
        actions={<>
          <div className="relative w-44 sm:w-56"><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search roles..." className="w-full rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs outline-none focus:border-brand-sky-400" /></div>
          {onVolunteerTypeChange && <select value="roles" onChange={(e) => onVolunteerTypeChange(e.target.value as "applications" | "roles")} className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-1.5 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400"><option value="applications">{language === "am" ? "ማመልከቻዎች" : "Applications"}</option><option value="roles">{language === "am" ? "ሚናዎች" : "Volunteer Roles"}</option></select>}
          <button onClick={() => { setCf({nameEn:"",nameAm:"",icon:"Users",color:"bg-brand-sky-400"}); setCatModal({open:true,editing:null}); }} className="flex items-center gap-1.5 rounded-xl bg-brand-sky-400 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-sky-500"><Plus className="w-3.5 h-3.5" />Add</button>
        </>} />

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
    title:{en:"",am:""}, excerpt:{en:"",am:""}, body:{en:"",am:""},
    category:"Community", coverImage:"", author:"", isPublished:false,
  });
  const [formLang, setFormLang] = useState<"en"|"am">("en");

  const load = async () => { setLoading(true); setArticles(await getNews(true)); setLoading(false); };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setAf({ title:{en:"",am:""}, excerpt:{en:"",am:""}, body:{en:"",am:""}, category:"Community", coverImage:"", author:"", isPublished:false });
    setShowForm(true);
  };
  const openEdit = (a: NewsArticle) => { setEditing(a); setAf(a); setShowForm(true); };

  const handleSave = async () => {
    if (!af.title?.en?.trim()) return;
    const slug = (editing?.slug || af.title.en).toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9\-]/g,"").slice(0,80) || `article-${Date.now()}`;
    const article: NewsArticle = {
      id:          editing?.id || `news-${Date.now()}`,
      slug,
      title:       af.title   || {en:"",am:""},
      excerpt:     af.excerpt || {en:"",am:""},
      body:        af.body    || {en:"",am:""},
      category:    af.category || "Community",
      coverImage:  af.coverImage || "",
      author:      af.author || "",
      publishedAt: editing?.publishedAt || new Date().toISOString(),
      isPublished: af.isPublished || false,
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

      <div className="space-y-3">
        {articles.map(a => (
          <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-4 group">
            {a.coverImage && (
              <img src={a.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100" />
            )}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${catColors[a.category]||"bg-gray-100 text-gray-600"}`}>{a.category}</span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${a.isPublished?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>
                  {a.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="font-serif font-bold text-sm text-brand-sky-950 line-clamp-1">{a.title.en}</p>
              {a.excerpt.en && <p className="text-[11px] text-gray-500 line-clamp-1">{a.excerpt.en}</p>}
              <p className="text-[10px] text-gray-400">{a.author} · {new Date(a.publishedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <button onClick={() => togglePublish(a)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${a.isPublished?"bg-green-50 text-green-700 border border-green-200 hover:bg-green-100":"bg-gray-50 text-gray-600 border border-gray-200 hover:bg-brand-sky-50"}`}>
                {a.isPublished ? <><EyeOff className="w-3 h-3"/>Unpublish</> : <><Eye className="w-3 h-3"/>Publish</>}
              </button>
              <button onClick={() => openEdit(a)}
                className="px-3 py-1.5 bg-brand-sky-50 text-brand-sky-700 rounded-xl text-[9px] font-bold cursor-pointer hover:bg-brand-sky-100 border border-brand-sky-200 flex items-center gap-1 transition-colors">
                <Edit3 className="w-3 h-3"/>Edit
              </button>
              <button onClick={() => del(a.id, a.title.en)}
                className="p-1.5 bg-red-50 text-red-500 rounded-xl cursor-pointer border border-red-200 hover:bg-red-100 flex items-center justify-center transition-colors">
                <Trash2 className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>
        ))}
        {articles.length===0 && !loading && (
          <div className="text-center py-12 text-xs text-gray-400 space-y-2">
            <Newspaper className="w-10 h-10 text-brand-sky-200 mx-auto"/>
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
                  <button key={l} onClick={() => setFormLang(l)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${formLang===l?"bg-white text-brand-sky-950 shadow-xs":"text-gray-600 hover:text-gray-900"}`}>
                    {l === "en" ? "English" : "አማርኛ"}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div><label className="block text-xs font-bold text-gray-600 mb-1">Title ({formLang.toUpperCase()}) *</label>
                  <input value={(af.title as any)?.[formLang]||""} onChange={e=>setAf(p=>({...p,title:{...(p.title||{en:"",am:""}), [formLang]:e.target.value}}))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400" /></div>

                <div><label className="block text-xs font-bold text-gray-600 mb-1">Excerpt ({formLang.toUpperCase()})</label>
                  <textarea rows={1} value={(af.excerpt as any)?.[formLang]||""} onChange={e=>setAf(p=>({...p,excerpt:{...(p.excerpt||{en:"",am:""}), [formLang]:e.target.value}}))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 resize-none"/></div>

                <div><label className="block text-xs font-bold text-gray-600 mb-1">Body ({formLang.toUpperCase()}) — use blank lines for paragraphs</label>
                  <textarea rows={4} value={(af.body as any)?.[formLang]||""} onChange={e=>setAf(p=>({...p,body:{...(p.body||{en:"",am:""}), [formLang]:e.target.value}}))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 resize-none font-mono"/></div>

                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                    <select value={af.category||"Community"} onChange={e=>setAf(p=>({...p,category:e.target.value}))}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400 bg-white">
                      {NEWS_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                    </select></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">Author</label>
                    <input value={af.author||""} onChange={e=>setAf(p=>({...p,author:e.target.value}))}
                      placeholder="Admin name"
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>
                </div>

                <div><label className="block text-xs font-bold text-gray-600 mb-1">Cover Image URL (optional)</label>
                  <input value={af.coverImage||""} onChange={e=>setAf(p=>({...p,coverImage:e.target.value}))}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand-sky-400"/></div>

                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div><span className="text-xs font-bold text-gray-700 block">Publish immediately</span>
                    <span className="text-[10px] text-gray-400">If off, saved as draft</span></div>
                  <button type="button" onClick={() => setAf(p=>({...p,isPublished:!p.isPublished}))}
                    className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${af.isPublished?"bg-brand-sky-400":"bg-gray-300"}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${af.isPublished?"translate-x-4":"translate-x-0"}`}/>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm flex items-center justify-center gap-1.5">
                  <Save className="w-3.5 h-3.5"/>{af.isPublished?"Save & Publish":"Save as Draft"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
