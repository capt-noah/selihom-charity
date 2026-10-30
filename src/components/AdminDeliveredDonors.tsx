import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Search,
  Phone,
  Mail,
  Gift,
  Pill,
  Package,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Download,
  ArrowUpDown,
  X,
  Clock,
  CheckCircle2,
  Star,
  Award,
  RefreshCw,
  Eye,
  FileSpreadsheet
} from "lucide-react";
import { DonationPledge } from "../types";
import {
  getPledges,
  getMedicinePledges,
  getSuppliesPledges,
  getEventPledges,
  MedicinePledge,
  SuppliesPledge,
  EventPledge
} from "../utils/adminStorage";

export interface DeliveredDonorRecord {
  id: string; // Unique grouped donor key
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  totalDeliveries: number;
  totalUnits: number;
  categories: ("inkind" | "medicine" | "supplies" | "event")[];
  firstDeliveryDate: string;
  firstDeliveryTimestamp: number;
  latestDeliveryDate: string;
  latestDeliveryTimestamp: number;
  history: DeliveredItemHistory[];
}

export interface DeliveredItemHistory {
  id: string;
  category: "inkind" | "medicine" | "supplies" | "event";
  categoryLabel: string;
  date: string;
  timestamp: number;
  status: string;
  items: { name: string; quantity: number; unit?: string }[];
  totalQty: number;
  notes?: string;
  additionalContact?: string;
  eventDetails?: {
    eventType?: string;
    guestCount?: number;
    preferredDate?: string;
  };
}

interface AdminDeliveredDonorsProps {
  language: string;
  onPledgeTypeChange?: (type: "inkind" | "medicine" | "supplies" | "delivered_donors") => void;
}

export default function AdminDeliveredDonors({ language, onPledgeTypeChange }: AdminDeliveredDonorsProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [donors, setDonors] = useState<DeliveredDonorRecord[]>([]);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "inkind" | "medicine" | "supplies" | "event" | "repeat">("all");
  const [sortBy, setSortBy] = useState<"latest" | "most_deliveries" | "most_units" | "name">("latest");
  
  // Modal state
  const [selectedDonor, setSelectedDonor] = useState<DeliveredDonorRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchDeliveredDonors = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [rawPledges, rawMedicine, rawSupplies, rawEvents] = await Promise.all([
        getPledges().catch(() => [] as DonationPledge[]),
        getMedicinePledges().catch(() => [] as MedicinePledge[]),
        getSuppliesPledges().catch(() => [] as SuppliesPledge[]),
        getEventPledges().catch(() => [] as EventPledge[])
      ]);

      const historyItems: DeliveredItemHistory[] = [];

      // 1. Process standard In-Kind / Money pledges (delivered = 'received')
      rawPledges.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "received") {
          const itemsList = Array.isArray(p.pledgedItems)
            ? p.pledgedItems.map((it) => ({
                name: it.name || "In-Kind Item",
                quantity: Number(it.quantity) || 1,
                unit: "pcs"
              }))
            : [];
          
          if (itemsList.length === 0 && p.type === "money" && p.amount) {
            itemsList.push({
              name: `Financial Donation (${p.bankSelected || "Bank Transfer"})`,
              quantity: p.amount,
              unit: "ETB"
            });
          }

          const totalQty = itemsList.reduce((acc, curr) => acc + curr.quantity, 0) || 1;
          const ts = new Date(p.date || Date.now()).getTime();

          historyItems.push({
            id: `inkind-${p.id}`,
            category: "inkind",
            categoryLabel: language === "am" ? "ዓይነት እቃ" : "In-Kind Goods",
            date: p.date || new Date(ts).toISOString().split("T")[0],
            timestamp: isNaN(ts) ? Date.now() : ts,
            status: p.status,
            items: itemsList.length > 0 ? itemsList : [{ name: "In-Kind Donation", quantity: 1, unit: "pkg" }],
            totalQty,
            notes: p.type === "money" ? `Financial Support: ${p.amount} ETB` : "In-Kind Donation",
            additionalContact: `${p.donorName} | ${p.donorPhone || ""} | ${p.donorEmail}`
          });
        }
      });

      // 2. Process Medicine Pledges
      rawMedicine.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "received") {
          const itemsList = Array.isArray(p.items)
            ? p.items.map((it) => ({
                name: it.medicineName || "Medicine",
                quantity: Number(it.quantity) || 1,
                unit: "boxes"
              }))
            : [];
          const totalQty = itemsList.reduce((acc, curr) => acc + curr.quantity, 0) || 1;
          const ts = new Date(p.date || Date.now()).getTime();

          historyItems.push({
            id: `medicine-${p.id}`,
            category: "medicine",
            categoryLabel: language === "am" ? "መድሃኒት" : "Medicine Supplies",
            date: p.date || new Date(ts).toISOString().split("T")[0],
            timestamp: isNaN(ts) ? Date.now() : ts,
            status: p.status,
            items: itemsList.length > 0 ? itemsList : [{ name: "Medicine Supplies", quantity: 1, unit: "boxes" }],
            totalQty,
            notes: p.notes,
            additionalContact: `${p.donorName} | ${p.donorPhone} | ${p.donorEmail}`
          });
        }
      });

      // 3. Process Supplies Pledges
      rawSupplies.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "received") {
          const itemsList = Array.isArray(p.items)
            ? p.items.map((it) => ({
                name: it.itemName || "Shelter Supply",
                quantity: Number(it.quantity) || 1,
                unit: "units"
              }))
            : [];
          const totalQty = itemsList.reduce((acc, curr) => acc + curr.quantity, 0) || 1;
          const ts = new Date(p.date || Date.now()).getTime();

          historyItems.push({
            id: `supplies-${p.id}`,
            category: "supplies",
            categoryLabel: language === "am" ? "የማዕከል ቁሳቁስ" : "Shelter Supplies",
            date: p.date || new Date(ts).toISOString().split("T")[0],
            timestamp: isNaN(ts) ? Date.now() : ts,
            status: p.status,
            items: itemsList.length > 0 ? itemsList : [{ name: "Shelter Supplies", quantity: 1, unit: "units" }],
            totalQty,
            notes: p.notes,
            additionalContact: `${p.donorName} | ${p.donorPhone} | ${p.donorEmail}`
          });
        }
      });

      // 4. Process Event Pledges
      rawEvents.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "completed" || s === "confirmed") {
          const ts = new Date(p.preferredDate || p.submittedAt || Date.now()).getTime();
          historyItems.push({
            id: `event-${p.id}`,
            category: "event",
            categoryLabel: language === "am" ? "የመርሐግብር ድጋፍ" : "Event Hosting Support",
            date: p.preferredDate || p.submittedAt || new Date(ts).toISOString().split("T")[0],
            timestamp: isNaN(ts) ? Date.now() : ts,
            status: p.status,
            items: [{
              name: p.eventType ? `${p.eventType.toUpperCase()} (${p.customType || "Community Event"})` : "Community Event",
              quantity: 1,
              unit: "event"
            }],
            totalQty: 1,
            notes: p.message,
            additionalContact: `${p.name} | ${p.phone} | ${p.email}`,
            eventDetails: {
              eventType: p.eventType,
              preferredDate: p.preferredDate
            }
          });
        }
      });

      // Group records into Unique Donors
      const donorMap: Record<string, DeliveredDonorRecord> = {};

      const allDeliveredRaw: Array<{
        name: string;
        email: string;
        phone: string;
        historyItem: DeliveredItemHistory;
      }> = [];

      rawPledges.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "received") {
          const item = historyItems.find((h) => h.id === `inkind-${p.id}`);
          if (item) {
            allDeliveredRaw.push({
              name: p.donorName || "Anonymous Supporter",
              email: p.donorEmail || "",
              phone: p.donorPhone || "",
              historyItem: item
            });
          }
        }
      });

      rawMedicine.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "received") {
          const item = historyItems.find((h) => h.id === `medicine-${p.id}`);
          if (item) {
            allDeliveredRaw.push({
              name: p.donorName || "Anonymous Supporter",
              email: p.donorEmail || "",
              phone: p.donorPhone || "",
              historyItem: item
            });
          }
        }
      });

      rawSupplies.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "received") {
          const item = historyItems.find((h) => h.id === `supplies-${p.id}`);
          if (item) {
            allDeliveredRaw.push({
              name: p.donorName || "Anonymous Supporter",
              email: p.donorEmail || "",
              phone: p.donorPhone || "",
              historyItem: item
            });
          }
        }
      });

      rawEvents.forEach((p) => {
        const s = (p.status || "").toLowerCase();
        if (s === "completed" || s === "confirmed") {
          const item = historyItems.find((h) => h.id === `event-${p.id}`);
          if (item) {
            allDeliveredRaw.push({
              name: p.name || "Anonymous Supporter",
              email: p.email || "",
              phone: p.phone || "",
              historyItem: item
            });
          }
        }
      });

      allDeliveredRaw.forEach(({ name, email, phone, historyItem }) => {
        const cleanPhone = (phone || "").replace(/[^0-9+]/g, "").trim();
        const cleanEmail = (email || "").toLowerCase().trim();
        const cleanName = (name || "").toLowerCase().trim();
        
        const donorKey = cleanPhone.length > 5 
          ? `phone:${cleanPhone}` 
          : cleanEmail.length > 3 
            ? `email:${cleanEmail}` 
            : `name:${cleanName || "anonymous"}`;

        if (!donorMap[donorKey]) {
          donorMap[donorKey] = {
            id: donorKey,
            donorName: name || "Anonymous Donor",
            donorEmail: email,
            donorPhone: phone,
            totalDeliveries: 0,
            totalUnits: 0,
            categories: [],
            firstDeliveryDate: historyItem.date,
            firstDeliveryTimestamp: historyItem.timestamp,
            latestDeliveryDate: historyItem.date,
            latestDeliveryTimestamp: historyItem.timestamp,
            history: []
          };
        }

        const rec = donorMap[donorKey];
        rec.totalDeliveries += 1;
        rec.totalUnits += historyItem.totalQty;
        if (!rec.categories.includes(historyItem.category)) {
          rec.categories.push(historyItem.category);
        }
        if (historyItem.timestamp > rec.latestDeliveryTimestamp) {
          rec.latestDeliveryTimestamp = historyItem.timestamp;
          rec.latestDeliveryDate = historyItem.date;
        }
        if (historyItem.timestamp < rec.firstDeliveryTimestamp) {
          rec.firstDeliveryTimestamp = historyItem.timestamp;
          rec.firstDeliveryDate = historyItem.date;
        }
        if (!rec.donorPhone && phone) rec.donorPhone = phone;
        if (!rec.donorEmail && email) rec.donorEmail = email;
        if ((!rec.donorName || rec.donorName === "Anonymous Donor") && name) rec.donorName = name;

        rec.history.push(historyItem);
      });

      Object.values(donorMap).forEach((d) => {
        d.history.sort((a, b) => b.timestamp - a.timestamp);
      });

      setDonors(Object.values(donorMap));
    } catch (err) {
      console.error("Failed to load delivered donors directory", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeliveredDonors();
  }, []);

  const filteredDonors = useMemo(() => {
    return donors
      .filter((d) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = (d.donorName || "").toLowerCase().includes(q);
          const matchesPhone = (d.donorPhone || "").toLowerCase().includes(q);
          const matchesEmail = (d.donorEmail || "").toLowerCase().includes(q);
          const matchesItems = d.history.some((h) =>
            h.items.some((it) => (it.name || "").toLowerCase().includes(q))
          );
          if (!matchesName && !matchesPhone && !matchesEmail && !matchesItems) return false;
        }

        if (selectedCategory === "repeat") {
          return d.totalDeliveries > 1;
        }
        if (selectedCategory !== "all") {
          return d.categories.includes(selectedCategory as any);
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "latest") return b.latestDeliveryTimestamp - a.latestDeliveryTimestamp;
        if (sortBy === "most_deliveries") return b.totalDeliveries - a.totalDeliveries;
        if (sortBy === "most_units") return b.totalUnits - a.totalUnits;
        if (sortBy === "name") return a.donorName.localeCompare(b.donorName);
        return 0;
      });
  }, [donors, searchQuery, selectedCategory, sortBy]);

  const stats = useMemo(() => {
    const totalDonors = donors.length;
    const totalDeliveries = donors.reduce((acc, d) => acc + d.totalDeliveries, 0);
    const totalUnits = donors.reduce((acc, d) => acc + d.totalUnits, 0);
    const repeatDonors = donors.filter((d) => d.totalDeliveries > 1).length;
    const multiCategoryDonors = donors.filter((d) => d.categories.length > 1).length;

    return {
      totalDonors,
      totalDeliveries,
      totalUnits,
      repeatDonors,
      multiCategoryDonors
    };
  }, [donors]);

  const handleCopyContact = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const exportDeliveredDonorsCSV = () => {
    if (filteredDonors.length === 0) {
      alert("No delivered donor data to export.");
      return;
    }

    const headers = [
      "Donor Name",
      "Phone Number",
      "Email Address",
      "Total Deliveries",
      "Total Units Donated",
      "Delivered Categories",
      "First Delivery Date",
      "Latest Delivery Date",
      "Itemized Donations Summary"
    ];

    const rows = filteredDonors.map((d) => {
      const catLabels = d.categories
        .map((c) => (c === "inkind" ? "In-Kind" : c === "medicine" ? "Medicine" : c === "supplies" ? "Supplies" : "Event"))
        .join(", ");
      
      const itemSummary = d.history
        .map((h) => `[${h.date} - ${h.categoryLabel}]: ${h.items.map((i) => `${i.name} (x${i.quantity} ${i.unit || ""})`).join(", ")}`)
        .join(" | ")
        .replace(/"/g, '""');

      return [
        `"${d.donorName.replace(/"/g, '""')}"`,
        `"${d.donorPhone}"`,
        `"${d.donorEmail}"`,
        d.totalDeliveries,
        d.totalUnits,
        `"${catLabels}"`,
        `"${d.firstDeliveryDate}"`,
        `"${d.latestDeliveryDate}"`,
        `"${itemSummary}"`
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `selihom_delivered_donors_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSingleDonorStatementCSV = (donor: DeliveredDonorRecord) => {
    const headers = ["Donation ID", "Date", "Category", "Item / Description", "Quantity", "Unit", "Status", "Notes"];
    const rows: string[][] = [];

    donor.history.forEach((h) => {
      h.items.forEach((item) => {
        rows.push([
          `"${h.id}"`,
          `"${h.date}"`,
          `"${h.categoryLabel}"`,
          `"${item.name.replace(/"/g, '""')}"`,
          String(item.quantity),
          `"${item.unit || "unit"}"`,
          `"${h.status.toUpperCase()}"`,
          `"${(h.notes || "").replace(/"/g, '""')}"`
        ]);
      });
    });

    const csvContent = [
      `"DONOR CONTRIBUTION STATEMENT - SELIHOM CHARITY"`,
      `"Donor: ${donor.donorName}"`,
      `"Phone: ${donor.donorPhone}"`,
      `"Email: ${donor.donorEmail}"`,
      `"Generated: ${new Date().toLocaleDateString()}"`,
      "",
      headers.join(","),
      ...rows.map((r) => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `selihom_donor_${donor.donorName.replace(/[^a-zA-Z0-9]/g, "_")}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* ── Sub-navigation Header for Pledge Types ── */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-sky-200 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("inkind")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            >
              <Gift className="w-4 h-4" />
              <span>{language === "am" ? "ዓይነት እቃ" : "In-Kind"}</span>
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
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
            >
              <Package className="w-4 h-4" />
              <span>{language === "am" ? "ቁሳቁስ" : "Supplies"}</span>
            </button>

            <button
              type="button"
              onClick={() => onPledgeTypeChange?.("delivered_donors")}
              className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-brand-sky-500 text-white shadow-sm border border-brand-sky-600"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{language === "am" ? "⭐ ታማኝ ደጋፊዎች (ያደረሱ)" : "⭐ Delivered Donors"}</span>
            </button>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchDeliveredDonors(true)}
              disabled={refreshing || loading}
              className="px-3 py-2 bg-white hover:bg-brand-sky-50 text-brand-sky-700 border border-brand-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-brand-sky-500" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              onClick={exportDeliveredDonorsCSV}
              className="px-3.5 py-2 bg-brand-sky-500 hover:bg-brand-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === "am" ? "ሁሉንም አውርድ (CSV)" : "Export CSV"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Banner / Overview Card ── */}
      <div className="bg-linear-to-r from-brand-sky-950 via-brand-sky-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sky-800/80 border border-brand-sky-700/60 text-brand-sky-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Verified Fulfillment Directory</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
              {language === "am" ? "የተረከቧቸው ታማኝ ደጋፊዎች ማውጫ" : "Delivered Donors & Benefactors CRM"}
            </h2>
            <p className="text-xs sm:text-sm text-brand-sky-200/90 leading-relaxed">
              {language === "am"
                ? "እውነተኛ ልገሳቸውን ለማዕከሉ ያስረከቡ ግለሰቦች እና ድርጅቶች ዝርዝር። ለቀጣይ ትብብር፣ ምስጋና እና ድጋፍ በቀላሉ ያግኟቸው።"
                : "A verified list of all people and organizations who pledged and actually delivered their donations to the shelter. Click any donor to view their complete itemized history."}
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="block text-2xl font-black text-white">{stats.totalDonors}</span>
              <span className="text-[11px] text-brand-sky-200 font-semibold">Verified Donors</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center">
              <span className="block text-2xl font-black text-emerald-300">{stats.totalDeliveries}</span>
              <span className="text-[11px] text-brand-sky-200 font-semibold">Deliveries Done</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
              <span className="block text-2xl font-black text-amber-300">{stats.totalUnits}</span>
              <span className="text-[11px] text-brand-sky-200 font-semibold">Total Item Units</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white border border-brand-sky-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-brand-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              language === "am"
                ? "በስም፣ በስልክ ቁጥር፣ በኢሜል ወይም በዕቃ ዓይነት ፈልግ..."
                : "Search by donor name, phone, email, or item donated..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-medium text-brand-sky-950 focus:bg-white focus:border-brand-sky-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: "all", label: language === "am" ? "ሁሉም" : "All", icon: Users },
            { key: "repeat", label: language === "am" ? "ደጋገሚ (2+)" : "Repeat (2+)", icon: Star },
            { key: "inkind", label: language === "am" ? "ዓይነት እቃ" : "In-Kind", icon: Gift },
            { key: "medicine", label: language === "am" ? "መድሃኒት" : "Medicine", icon: Pill },
            { key: "supplies", label: language === "am" ? "ቁሳቁስ" : "Supplies", icon: Package },
            { key: "event", label: language === "am" ? "መርሐግብር" : "Events", icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-brand-sky-500 text-white shadow-xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none cursor-pointer"
          >
            <option value="latest">Sort: Most Recent Delivery</option>
            <option value="most_deliveries">Sort: Delivery Count</option>
            <option value="most_units">Sort: Total Item Units</option>
            <option value="name">Sort: Donor Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ── Donors Grid / Table List ── */}
      {loading ? (
        <div className="bg-white border border-brand-sky-100 rounded-3xl p-12 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-sky-500 animate-spin mx-auto" />
          <p className="text-sm font-bold text-brand-sky-950">Loading verified delivered donors...</p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="bg-white border border-brand-sky-100 rounded-3xl p-12 text-center space-y-3">
          <Award className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">
            {language === "am" ? "ምንም የተረከቡ ደጋፊዎች አልተገኙም" : "No Delivered Donors Found"}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {searchQuery
              ? "No donors match your search criteria. Try adjusting your query or filter."
              : "Once pledges are marked as 'Received' or 'Completed' in the admin panel, donors will automatically appear in this verified directory."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => {
            const isRepeat = donor.totalDeliveries > 1;
            const isChampion = donor.totalDeliveries >= 5 || donor.totalUnits >= 50;

            return (
              <motion.div
                key={donor.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-brand-sky-200/80 hover:border-brand-sky-400 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Donor Name & Loyalty Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-serif font-black text-base text-brand-sky-950 group-hover:text-brand-sky-600 transition-colors">
                          {donor.donorName}
                        </h4>
                        {isChampion ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-black uppercase flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            Champion
                          </span>
                        ) : isRepeat ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-[10px] font-black uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            Repeat ({donor.totalDeliveries})
                          </span>
                        ) : null}
                      </div>

                      <p className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>Latest: {donor.latestDeliveryDate}</span>
                      </p>
                    </div>

                    {/* Category Icons */}
                    <div className="flex items-center gap-1 shrink-0 bg-brand-sky-50 px-2 py-1 rounded-xl border border-brand-sky-100">
                      {donor.categories.includes("inkind") && (
                        <span title="In-Kind Goods">
                          <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      )}
                      {donor.categories.includes("medicine") && (
                        <span title="Medicine Supplies">
                          <Pill className="w-3.5 h-3.5 text-rose-600" />
                        </span>
                      )}
                      {donor.categories.includes("supplies") && (
                        <span title="Shelter Supplies">
                          <Package className="w-3.5 h-3.5 text-amber-600" />
                        </span>
                      )}
                      {donor.categories.includes("event") && (
                        <span title="Event Hosting">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info Pills */}
                  <div className="space-y-1.5 my-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100 text-xs">
                    {donor.donorPhone ? (
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={`tel:${donor.donorPhone}`}
                          className="text-brand-sky-800 hover:text-brand-sky-950 font-bold flex items-center gap-2 hover:underline truncate"
                        >
                          <Phone className="w-3.5 h-3.5 text-brand-sky-500 shrink-0" />
                          <span className="truncate">{donor.donorPhone}</span>
                        </a>
                        <button
                          onClick={() => handleCopyContact(`phone-${donor.id}`, donor.donorPhone)}
                          className="text-gray-400 hover:text-brand-sky-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Copy Phone"
                        >
                          {copiedId === `phone-${donor.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic text-[11px] flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                        <span>No phone provided</span>
                      </div>
                    )}

                    {donor.donorEmail ? (
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100">
                        <a
                          href={`mailto:${donor.donorEmail}`}
                          className="text-brand-sky-800 hover:text-brand-sky-950 font-bold flex items-center gap-2 hover:underline truncate"
                        >
                          <Mail className="w-3.5 h-3.5 text-brand-sky-500 shrink-0" />
                          <span className="truncate">{donor.donorEmail}</span>
                        </a>
                        <button
                          onClick={() => handleCopyContact(`email-${donor.id}`, donor.donorEmail)}
                          className="text-gray-400 hover:text-brand-sky-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedId === `email-${donor.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-400 italic text-[11px] flex items-center gap-2 pt-1 border-t border-gray-100">
                        <Mail className="w-3.5 h-3.5 text-gray-300" />
                        <span>No email provided</span>
                      </div>
                    )}
                  </div>

                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-2 gap-2 my-3">
                    <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
                      <span className="block text-base font-black text-emerald-900">{donor.totalDeliveries}</span>
                      <span className="text-[10px] font-bold text-emerald-700">Fulfilled Deliveries</span>
                    </div>
                    <div className="p-2.5 bg-brand-sky-50/60 rounded-xl border border-brand-sky-100 text-center">
                      <span className="block text-base font-black text-brand-sky-900">{donor.totalUnits}</span>
                      <span className="text-[10px] font-bold text-brand-sky-700">Total Units Donated</span>
                    </div>
                  </div>

                  {/* Recent items snapshot */}
                  <div className="space-y-1 my-2">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                      Recent Donations
                    </span>
                    <p className="text-xs font-semibold text-gray-700 line-clamp-2">
                      {donor.history
                        .slice(0, 2)
                        .map((h) => h.items.map((i) => `${i.name} (${i.quantity})`).join(", "))
                        .join(" • ")}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2 mt-2">
                  <button
                    onClick={() => setSelectedDonor(donor)}
                    className="flex-1 py-2.5 px-3 bg-brand-sky-50 hover:bg-brand-sky-100 text-brand-sky-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:bg-brand-sky-500 group-hover:text-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === "am" ? "ዝርዝር ታሪክ ይመልከቱ" : "View Full History"}</span>
                  </button>

                  <button
                    onClick={() => exportSingleDonorStatementCSV(donor)}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
                    title="Export donor history to CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Donor History Modal ── */}
      <AnimatePresence>
        {selectedDonor && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-brand-sky-100"
            >
              {/* Modal Header */}
              <div className="bg-linear-to-r from-brand-sky-900 to-indigo-950 text-white p-6 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-serif font-black text-2xl text-white">
                      {selectedDonor.donorName}
                    </h3>
                    {selectedDonor.totalDeliveries > 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black uppercase">
                        ⭐ {selectedDonor.totalDeliveries} Verified Deliveries
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-sky-200 flex items-center gap-2">
                    <span>First Delivery: {selectedDonor.firstDeliveryDate}</span>
                    <span>•</span>
                    <span>Latest: {selectedDonor.latestDeliveryDate}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => exportSingleDonorStatementCSV(selectedDonor)}
                    className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Statement CSV</span>
                  </button>

                  <button
                    onClick={() => setSelectedDonor(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Donor Quick Contact Header Card */}
              <div className="bg-brand-sky-50/70 p-4 border-b border-brand-sky-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-6 flex-wrap">
                  {selectedDonor.donorPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-sky-600" />
                      <a
                        href={`tel:${selectedDonor.donorPhone}`}
                        className="font-bold text-brand-sky-950 hover:underline"
                      >
                        {selectedDonor.donorPhone}
                      </a>
                    </div>
                  )}

                  {selectedDonor.donorEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-sky-600" />
                      <a
                        href={`mailto:${selectedDonor.donorEmail}`}
                        className="font-bold text-brand-sky-950 hover:underline"
                      >
                        {selectedDonor.donorEmail}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                  <span>Total Delivered Units: <strong className="text-brand-sky-900">{selectedDonor.totalUnits}</strong></span>
                  <span>Categories: <strong className="text-brand-sky-900">{selectedDonor.categories.join(", ").toUpperCase()}</strong></span>
                </div>
              </div>

              {/* Itemized Deliveries Table */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-brand-sky-600" />
                    <span>Itemized Donation & Delivery History</span>
                  </h4>
                  <span className="text-xs text-gray-500 font-semibold">
                    {selectedDonor.history.length} Record{selectedDonor.history.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="border border-brand-sky-100 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-brand-sky-950 text-white font-bold">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Donated Items & Quantities</th>
                        <th className="py-3 px-4 text-center">Total Units</th>
                        <th className="py-3 px-4 text-center">Delivery Status</th>
                        <th className="py-3 px-4">Remarks / Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-sky-100">
                      {selectedDonor.history.map((record, index) => {
                        const isEven = index % 2 === 0;
                        const catBadgeColors: Record<string, string> = {
                          inkind: "bg-emerald-50 text-emerald-800 border-emerald-200",
                          medicine: "bg-rose-50 text-rose-800 border-rose-200",
                          supplies: "bg-amber-50 text-amber-800 border-amber-200",
                          event: "bg-indigo-50 text-indigo-800 border-indigo-200"
                        };

                        return (
                          <tr
                            key={record.id}
                            className={`${isEven ? "bg-white" : "bg-brand-sky-50/30"} hover:bg-brand-sky-50/80 transition-colors`}
                          >
                            {/* Date */}
                            <td className="py-3.5 px-4 font-bold text-brand-sky-950 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-brand-sky-500" />
                                <span>{record.date}</span>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${
                                  catBadgeColors[record.category] || "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {record.categoryLabel}
                              </span>
                            </td>

                            {/* Itemized breakdown */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                {record.items.map((it, itIdx) => (
                                  <div
                                    key={itIdx}
                                    className="flex items-center justify-between gap-2 bg-white/80 px-2.5 py-1 rounded-lg border border-gray-200/60"
                                  >
                                    <span className="font-bold text-gray-800">{it.name}</span>
                                    <span className="text-[11px] font-black text-brand-sky-700">
                                      {it.quantity} {it.unit || "units"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Total Qty */}
                            <td className="py-3.5 px-4 text-center font-black text-brand-sky-950">
                              {record.totalQty}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase">
                                ✓ {record.status}
                              </span>
                            </td>

                            {/* Notes */}
                            <td className="py-3.5 px-4 text-gray-600 max-w-xs">
                              {record.notes ? (
                                <p className="italic text-[11px] leading-snug line-clamp-2" title={record.notes}>
                                  "{record.notes}"
                                </p>
                              ) : (
                                <span className="text-gray-400 text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-500 font-medium">
                  Direct Contact: <strong>{selectedDonor.donorPhone || selectedDonor.donorEmail || selectedDonor.donorName}</strong>
                </p>
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="px-5 py-2.5 bg-brand-sky-950 hover:bg-brand-sky-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
