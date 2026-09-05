import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ChevronRight, Plus, X, Trash2, Edit3,
  Calendar, Clock, Users, CheckCircle2, XCircle, Clock3,
  Heart, RefreshCw, AlertCircle,
} from "lucide-react";
import {
  getAvailabilitySlots, saveAvailabilitySlot, updateAvailabilitySlot,
  deleteAvailabilitySlot, AvailabilitySlot, getBookings, getEventPledges,
  EventPledge,
} from "../utils/adminStorage";
import { Booking } from "../types";

type ViewMode = "week" | "day" | "month";

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(str: string): Date | null {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatDateKey(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function startOfWeek(d: Date): Date {
  const clone = new Date(d);
  const day = clone.getDay(); // 0=Sun
  clone.setDate(clone.getDate() - day);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function addDays(d: Date, n: number): Date {
  const clone = new Date(d);
  clone.setDate(clone.getDate() + n);
  return clone;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES   = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Slot modal form ────────────────────────────────────────────────────────

interface SlotModalProps {
  initial?: AvailabilitySlot | null;
  onSave: (slot: AvailabilitySlot) => void;
  onClose: () => void;
  defaultDate?: string;
}

function SlotModal({ initial, onSave, onClose, defaultDate }: SlotModalProps) {
  const [date,      setDate]      = useState(initial?.date      || defaultDate || "");
  const [startTime, setStartTime] = useState(initial?.startTime || "09:00 AM");
  const [endTime,   setEndTime]   = useState(initial?.endTime   || "10:30 AM");
  const [label,     setLabel]     = useState(initial?.label     || "");
  const [maxBook,   setMaxBook]   = useState(initial?.maxBookings ?? 10);
  const [isActive,  setIsActive]  = useState(initial?.isActive ?? true);
  const [error,     setError]     = useState("");

  const handleSave = () => {
    if (!date.trim())      { setError("Date is required.");       return; }
    if (!startTime.trim()) { setError("Start time is required."); return; }
    if (!endTime.trim())   { setError("End time is required.");   return; }
    onSave({
      id:              initial?.id || `slot-${Date.now()}`,
      date:            date.trim(),
      startTime:       startTime.trim(),
      endTime:         endTime.trim(),
      label:           label.trim(),
      maxBookings:     maxBook,
      currentBookings: initial?.currentBookings ?? 0,
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
        className="bg-white rounded-2xl shadow-2xl border border-brand-sky-100 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif font-bold text-lg text-brand-sky-950">
            {initial ? "Edit Availability Slot" : "Add Availability Slot"}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500"><X className="w-4 h-4" /></button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Date *</label>
            <input type="text" value={date} onChange={e => setDate(e.target.value)}
              placeholder="e.g. September 15, 2026"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-brand-sky-400 outline-none" />
            <p className="text-[10px] text-gray-400 mt-1">Or use date picker:</p>
            <input type="date" onChange={e => {
              if (!e.target.value) return;
              const d = new Date(e.target.value + "T00:00:00");
              setDate(d.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" }));
            }} className="mt-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 outline-none focus:border-brand-sky-400 cursor-pointer" />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Start Time *</label>
              <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-brand-sky-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">End Time *</label>
              <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-brand-sky-400 outline-none" />
            </div>
          </div>

          {/* Label */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Label (optional)</label>
            <input type="text" value={label} onChange={e => setLabel(e.target.value)}
              placeholder="e.g. Morning Tour Group A"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-brand-sky-400 outline-none" />
          </div>

          {/* Max bookings */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Max Bookings</label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
              <button type="button" onClick={() => setMaxBook(Math.max(1, maxBook - 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center cursor-pointer text-xs shadow-xs">-</button>
              <span className="text-sm font-black text-brand-sky-950 min-w-[32px] text-center">{maxBook}</span>
              <button type="button" onClick={() => setMaxBook(Math.min(200, maxBook + 1))}
                className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center cursor-pointer text-xs shadow-xs">+</button>
              <span className="text-[10px] text-gray-400 ml-1">people per slot</span>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div>
              <span className="text-xs font-bold text-gray-700 block">Slot Active</span>
              <span className="text-[10px] text-gray-400">Inactive slots won't appear on public site</span>
            </div>
            <button type="button" onClick={() => setIsActive(!isActive)}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${isActive ? "bg-brand-sky-400" : "bg-gray-300"}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isActive ? "translate-x-4" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-2.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
            {initial ? "Save Changes" : "Add Slot"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Slot block pill ───────────────────────────────────────────────────────────

function SlotPill({ slot, bookings, events, onEdit, onDelete }: {
  slot: AvailabilitySlot;
  bookings: Booking[];
  events: EventPledge[];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const left = slot.maxBookings - slot.currentBookings;
  const pct  = slot.currentBookings / slot.maxBookings;
  const color = !slot.isActive ? "bg-gray-200 border-gray-300 text-gray-500"
    : pct >= 1   ? "bg-red-100 border-red-300 text-red-800"
    : pct >= 0.7 ? "bg-orange-100 border-orange-300 text-orange-800"
    : "bg-brand-sky-100 border-brand-sky-300 text-brand-sky-900";

  const slotBookings = bookings.filter((b: any) => b.slotId === slot.id);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-lg border px-2 py-1.5 mb-1 cursor-pointer group ${color}`} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="w-3 h-3 shrink-0" />
          <span className="text-[10px] font-black truncate">{slot.startTime}–{slot.endTime}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[9px] font-bold">{slot.currentBookings}/{slot.maxBookings}</span>
          <button onClick={e => { e.stopPropagation(); onEdit(); }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-brand-sky-700 transition-opacity cursor-pointer">
            <Edit3 className="w-3 h-3" />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-600 transition-opacity cursor-pointer">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      {slot.label && <p className="text-[9px] opacity-70 truncate mt-0.5">{slot.label}</p>}

      {/* Expanded bookings list */}
      <AnimatePresence>
        {expanded && slotBookings.length > 0 && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            className="mt-2 pt-2 border-t border-current/20 space-y-1 overflow-hidden">
            {slotBookings.map(b => (
              <div key={b.id} className="text-[9px] flex items-center gap-1.5">
                <Users className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate font-bold">{b.name}</span>
                <span className="opacity-60 shrink-0">{b.phone}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Event pill ────────────────────────────────────────────────────────────────

function EventPill({ evt }: { evt: EventPledge }) {
  const color = evt.status === "confirmed" ? "bg-purple-100 border-purple-300 text-purple-900"
    : evt.status === "completed" ? "bg-green-100 border-green-300 text-green-800"
    : evt.status === "cancelled" ? "bg-gray-200 border-gray-300 text-gray-500"
    : "bg-pink-100 border-pink-300 text-pink-900";

  return (
    <div className={`rounded-lg border px-2 py-1.5 mb-1 ${color}`}>
      <div className="flex items-center gap-1.5">
        <Heart className="w-3 h-3 shrink-0" />
        <span className="text-[10px] font-black truncate capitalize">{evt.eventType}</span>
      </div>
      <p className="text-[9px] opacity-70 truncate mt-0.5">{evt.name}</p>
    </div>
  );
}

// ── Main Calendar component ───────────────────────────────────────────────────

interface AdminCalendarProps {
  language: string;
}

export default function AdminCalendar({ language }: AdminCalendarProps) {
  const [view,    setView]    = useState<ViewMode>("week");
  const [cursor,  setCursor]  = useState(new Date());
  const [slots,   setSlots]   = useState<AvailabilitySlot[]>([]);
  const [bookings,setBookings]= useState<Booking[]>([]);
  const [events,  setEvents]  = useState<EventPledge[]>([]);
  const [loading, setLoading] = useState(false);

  const [slotModal, setSlotModal] = useState<{ open: boolean; editing?: AvailabilitySlot | null; defaultDate?: string }>({ open: false });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [s, b, e] = await Promise.all([getAvailabilitySlots(), getBookings(), getEventPledges()]);
      setSlots(s); setBookings(b as Booking[]); setEvents(e);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // ── Save slot ──────────────────────────────────────────────────────────────
  const handleSaveSlot = async (slot: AvailabilitySlot) => {
    if (slotModal.editing) { await updateAvailabilitySlot(slot.id, slot); }
    else                   { await saveAvailabilitySlot(slot); }
    setSlotModal({ open: false });
    load();
  };

  const handleDeleteSlot = async (id: string) => {
    await deleteAvailabilitySlot(id);
    setDeleteConfirm(null);
    load();
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const go = (dir: 1 | -1) => {
    const d = new Date(cursor);
    if (view === "day")   d.setDate(d.getDate() + dir);
    if (view === "week")  d.setDate(d.getDate() + dir * 7);
    if (view === "month") d.setMonth(d.getMonth() + dir);
    setCursor(d);
  };

  const today = new Date();

  // ── Build visible days ─────────────────────────────────────────────────────
  const visibleDays: Date[] = [];
  if (view === "day") {
    visibleDays.push(new Date(cursor));
  } else if (view === "week") {
    const sw = startOfWeek(cursor);
    for (let i = 0; i < 7; i++) visibleDays.push(addDays(sw, i));
  } else {
    // month: pad to full 6-week grid
    const sm = startOfMonth(cursor);
    const firstDow = sm.getDay();
    for (let i = -firstDow; i < 42 - firstDow; i++) visibleDays.push(addDays(sm, i));
  }

  // ── Helper: items on a given day ───────────────────────────────────────────
  const slotsOnDay = (d: Date) =>
    slots.filter(s => {
      const sd = parseDate(s.date);
      return sd ? isSameDay(sd, d) : false;
    });

  const eventsOnDay = (d: Date) =>
    events.filter(e => {
      const ed = parseDate(e.preferredDate);
      return ed ? isSameDay(ed, d) : false;
    });

  // ── Header label ───────────────────────────────────────────────────────────
  const headerLabel = () => {
    if (view === "day")   return cursor.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
    if (view === "week") {
      const sw = startOfWeek(cursor);
      const ew = addDays(sw, 6);
      return `${sw.toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${ew.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;
    }
    return `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`;
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="bg-white border border-brand-sky-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-brand-sky-50 border border-brand-sky-200 p-1 rounded-xl">
            {(["day","week","month"] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                  view === v ? "bg-brand-sky-400 text-white shadow-sm" : "text-brand-sky-700 hover:bg-brand-sky-100"
                }`}>{v}</button>
            ))}
          </div>

          {/* Nav arrows */}
          <button onClick={() => go(-1)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-brand-sky-200 hover:bg-brand-sky-50 text-brand-sky-700 cursor-pointer transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCursor(new Date())}
            className="px-3 py-1.5 text-xs font-bold text-brand-sky-600 bg-brand-sky-50 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-100 cursor-pointer transition-colors">
            Today
          </button>
          <button onClick={() => go(1)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-brand-sky-200 hover:bg-brand-sky-50 text-brand-sky-700 cursor-pointer transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="font-serif font-bold text-sm text-brand-sky-950 ml-1">{headerLabel()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-sky-600 bg-brand-sky-50 border border-brand-sky-200 rounded-xl hover:bg-brand-sky-100 cursor-pointer transition-colors disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => setSlotModal({ open: true, editing: null })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-brand-sky-400 hover:bg-brand-sky-500 rounded-xl cursor-pointer transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            Add Slot
          </button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-3 text-[10px] font-bold">
        {[
          { color:"bg-brand-sky-100 border-brand-sky-300", label:"Available slot" },
          { color:"bg-orange-100 border-orange-300",       label:"Nearly full" },
          { color:"bg-red-100 border-red-300",             label:"Full" },
          { color:"bg-gray-200 border-gray-300",           label:"Inactive" },
          { color:"bg-pink-100 border-pink-300",           label:"Event (pending)" },
          { color:"bg-purple-100 border-purple-300",       label:"Event (confirmed)" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded border ${l.color}`} />
            <span className="text-gray-600">{l.label}</span>
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div className="bg-white border border-brand-sky-200 rounded-2xl overflow-hidden">

        {/* Month / Week header row */}
        {(view === "week" || view === "month") && (
          <div className={`grid border-b border-brand-sky-100 ${view === "week" ? "grid-cols-7" : "grid-cols-7"}`}>
            {WEEKDAY_SHORT.map(d => (
              <div key={d} className="py-2 text-center text-[10px] font-black uppercase tracking-widest text-brand-sky-500 border-r border-brand-sky-50 last:border-r-0">{d}</div>
            ))}
          </div>
        )}

        {/* Day columns */}
        {view === "day" && (
          <div className="p-4">
            <div className="text-center mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-brand-sky-500 mb-1">
                {cursor.toLocaleDateString("en-US",{ weekday:"long" })}
              </p>
              <p className={`font-serif text-4xl font-black ${isSameDay(cursor, today) ? "text-brand-sky-400" : "text-brand-sky-950"}`}>
                {cursor.getDate()}
              </p>
            </div>
            <div className="max-w-sm mx-auto space-y-2">
              {slotsOnDay(cursor).length === 0 && eventsOnDay(cursor).length === 0 && (
                <div className="text-center py-10 text-xs text-gray-400 font-medium">
                  No slots or events on this day.
                  <button onClick={() => setSlotModal({ open:true, editing:null, defaultDate: formatDateKey(cursor) })}
                    className="block mx-auto mt-3 text-brand-sky-500 font-bold hover:underline cursor-pointer">+ Add Slot</button>
                </div>
              )}
              {slotsOnDay(cursor).map(slot => (
                <SlotPill key={slot.id} slot={slot} bookings={bookings} events={events}
                  onEdit={() => setSlotModal({ open:true, editing:slot })}
                  onDelete={() => setDeleteConfirm(slot.id)} />
              ))}
              {eventsOnDay(cursor).map(evt => <EventPill key={evt.id} evt={evt} />)}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="grid grid-cols-7 divide-x divide-brand-sky-50 min-h-[400px]">
            {visibleDays.map((d, i) => {
              const daySlots  = slotsOnDay(d);
              const dayEvents = eventsOnDay(d);
              const isToday   = isSameDay(d, today);
              return (
                <div key={i} className={`p-2 min-h-[100px] ${isToday ? "bg-brand-sky-50/60" : ""}`}>
                  <div className="text-center mb-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black
                      ${isToday ? "bg-brand-sky-400 text-white" : "text-brand-sky-950"}`}>
                      {d.getDate()}
                    </span>
                  </div>
                  {daySlots.map(slot => (
                    <SlotPill key={slot.id} slot={slot} bookings={bookings} events={events}
                      onEdit={() => setSlotModal({ open:true, editing:slot })}
                      onDelete={() => setDeleteConfirm(slot.id)} />
                  ))}
                  {dayEvents.map(evt => <EventPill key={evt.id} evt={evt} />)}
                  <button onClick={() => setSlotModal({ open:true, editing:null, defaultDate: formatDateKey(d) })}
                    className="w-full mt-1 py-1 text-[9px] text-brand-sky-400 hover:bg-brand-sky-50 rounded-lg transition-colors cursor-pointer font-bold flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {view === "month" && (
          <div className="grid grid-cols-7 divide-x divide-brand-sky-50">
            {visibleDays.map((d, i) => {
              const daySlots  = slotsOnDay(d);
              const dayEvents = eventsOnDay(d);
              const isToday   = isSameDay(d, today);
              const isCurrentMonth = d.getMonth() === cursor.getMonth();
              return (
                <div key={i} className={`p-2 min-h-[80px] border-b border-brand-sky-50 ${isToday ? "bg-brand-sky-50/60" : ""} ${!isCurrentMonth ? "opacity-40" : ""}`}>
                  <div className="mb-1 text-right">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black
                      ${isToday ? "bg-brand-sky-400 text-white" : "text-brand-sky-950"}`}>
                      {d.getDate()}
                    </span>
                  </div>
                  {daySlots.slice(0, 2).map(slot => (
                    <SlotPill key={slot.id} slot={slot} bookings={bookings} events={events}
                      onEdit={() => setSlotModal({ open:true, editing:slot })}
                      onDelete={() => setDeleteConfirm(slot.id)} />
                  ))}
                  {dayEvents.slice(0, 1).map(evt => <EventPill key={evt.id} evt={evt} />)}
                  {(daySlots.length + dayEvents.length) > 3 && (
                    <p className="text-[9px] text-brand-sky-500 font-bold mt-0.5">+{daySlots.length + dayEvents.length - 3} more</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Slot modal ── */}
      <AnimatePresence>
        {slotModal.open && (
          <SlotModal
            initial={slotModal.editing}
            defaultDate={slotModal.defaultDate}
            onSave={handleSaveSlot}
            onClose={() => setSlotModal({ open: false })}
          />
        )}
      </AnimatePresence>

      {/* ── Delete confirm ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brand-sky-950/50 backdrop-blur-sm">
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-brand-sky-100">
              <h3 className="font-serif font-bold text-lg text-brand-sky-950 mb-2">Delete Slot?</h3>
              <p className="text-xs text-gray-500 mb-5">This slot will be permanently removed from the calendar and will no longer be available for public booking.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer">Cancel</button>
                <button onClick={() => handleDeleteSlot(deleteConfirm)}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
