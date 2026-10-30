import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Package,
  Pill,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Download,
  Search,
  RefreshCw,
  ArrowUpRight,
  Sparkles,
  PieChart,
  BarChart3,
  LineChart,
  Activity,
  Heart,
  ShieldAlert,
  ChevronRight,
  Layers,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { Booking, DonationPledge, VolunteerApplication, InKindItem } from "../types";
import {
  getBookings,
  getPledges,
  getVolunteers,
  getInKindNeeds,
  getMedicineItems,
  getMedicinePledges,
  getSuppliesPledges,
  getSupplyCategories,
  getEventPledges,
  MedicineItem,
  MedicinePledge,
  SuppliesPledge,
  SupplyCategory,
  EventPledge
} from "../utils/adminStorage";

interface AdminAnalyticsDashboardProps {
  language: string;
}

// Normalized unified pledge item for cross-category analytics
interface UnifiedPledge {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  category: "inkind" | "medicine" | "supplies" | "event" | "money";
  categoryLabel: string;
  subCategory?: string;
  date: string; // YYYY-MM-DD or parseable
  timestamp: number;
  status: "delivered" | "pending" | "cancelled";
  rawStatus: string;
  items: { name: string; quantity: number; unit?: string }[];
  totalItemCount: number;
  notes?: string;
}

export default function AdminAnalyticsDashboard({ language }: AdminAnalyticsDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Raw data from DB
  const [rawPledges, setRawPledges] = useState<DonationPledge[]>([]);
  const [rawMedicinePledges, setRawMedicinePledges] = useState<MedicinePledge[]>([]);
  const [rawSuppliesPledges, setRawSuppliesPledges] = useState<SuppliesPledge[]>([]);
  const [rawEventPledges, setRawEventPledges] = useState<EventPledge[]>([]);
  const [rawBookings, setRawBookings] = useState<Booking[]>([]);
  const [rawVolunteers, setRawVolunteers] = useState<VolunteerApplication[]>([]);
  const [rawNeeds, setRawNeeds] = useState<InKindItem[]>([]);
  const [rawMedicines, setRawMedicines] = useState<MedicineItem[]>([]);
  const [rawSupplyCats, setRawSupplyCats] = useState<SupplyCategory[]>([]);

  // Filter States
  const [timeRange, setTimeRange] = useState<"all" | "today" | "7d" | "30d" | "90d" | "this_month" | "this_year" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "inkind" | "medicine" | "supplies" | "event">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "delivered" | "pending" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTimelineTab, setActiveTimelineTab] = useState<"all" | "delivered" | "pending">("all");
  const [chartDisplayMode, setChartDisplayMode] = useState<"area" | "bar">("area");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Load all real data from API
  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [
        pledges,
        medPledges,
        supPledges,
        evtPledges,
        bookings,
        volunteers,
        needs,
        medicines,
        supplyCats
      ] = await Promise.all([
        getPledges().catch(() => []),
        getMedicinePledges().catch(() => []),
        getSuppliesPledges().catch(() => []),
        getEventPledges().catch(() => []),
        getBookings().catch(() => []),
        getVolunteers().catch(() => []),
        getInKindNeeds().catch(() => []),
        getMedicineItems().catch(() => []),
        getSupplyCategories().catch(() => [])
      ]);

      setRawPledges(pledges);
      setRawMedicinePledges(medPledges);
      setRawSuppliesPledges(supPledges);
      setRawEventPledges(evtPledges);
      setRawBookings(bookings);
      setRawVolunteers(volunteers);
      setRawNeeds(needs);
      setRawMedicines(medicines);
      setRawSupplyCats(supplyCats);
    } catch (err) {
      console.error("Failed to load analytics data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper date parse to timestamp
  const parseDateToTime = (dStr: string | undefined): number => {
    if (!dStr) return 0;
    const parsed = Date.parse(dStr);
    if (!isNaN(parsed)) return parsed;
    // Try cleaning format e.g. "Feb 03, 2026" or "2026-03-01 12:00:00"
    const cleaned = dStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
    const p2 = Date.parse(cleaned);
    return isNaN(p2) ? 0 : p2;
  };

  // Convert all diverse pledges into a unified dataset for unified analytics
  const unifiedPledges: UnifiedPledge[] = useMemo(() => {
    const list: UnifiedPledge[] = [];

    // 1. General In-Kind & Money pledges
    rawPledges.forEach((p) => {
      const isDelivered = p.status === "received";
      const isCancelled = p.status === "cancelled";
      const normStatus: "delivered" | "pending" | "cancelled" = isDelivered
        ? "delivered"
        : isCancelled
        ? "cancelled"
        : "pending";

      const items = (p.pledgedItems || []).map((it) => ({
        name: it.name || "In-Kind Item",
        quantity: it.quantity || 1
      }));

      list.push({
        id: p.id,
        donorName: p.donorName || "Anonymous Donor",
        donorEmail: p.donorEmail || "",
        donorPhone: p.donorPhone || "",
        category: p.type === "money" ? "money" : "inkind",
        categoryLabel: p.type === "money" ? "Financial / Bank" : "In-Kind Goods",
        subCategory: p.type === "money" ? "Bank Transfer" : "Food / Living Essentials",
        date: p.date || new Date().toISOString().split("T")[0],
        timestamp: parseDateToTime(p.date) || Date.now(),
        status: normStatus,
        rawStatus: p.status || "pledged",
        items: items.length > 0 ? items : [{ name: p.type === "money" ? `Cash / Bank (ETB ${p.amount || 0})` : "General Donation", quantity: 1 }],
        totalItemCount: items.reduce((sum, it) => sum + (it.quantity || 1), 0) || 1,
        notes: p.adminNotes
      });
    });

    // 2. Medicine Pledges
    rawMedicinePledges.forEach((m) => {
      const isDelivered = m.status === "received";
      const isCancelled = m.status === "cancelled";
      const normStatus: "delivered" | "pending" | "cancelled" = isDelivered
        ? "delivered"
        : isCancelled
        ? "cancelled"
        : "pending";

      const items = (m.items || []).map((it) => ({
        name: it.medicineName || "Prescription Medicine",
        quantity: it.quantity || 1,
        unit: "packs/monthly"
      }));

      list.push({
        id: m.id,
        donorName: m.donorName || "Medicine Donor",
        donorEmail: m.donorEmail || "",
        donorPhone: m.donorPhone || "",
        category: "medicine",
        categoryLabel: "Medicines & Health",
        subCategory: "Psychiatric & General Meds",
        date: m.date || new Date().toISOString().split("T")[0],
        timestamp: parseDateToTime(m.date) || Date.now(),
        status: normStatus,
        rawStatus: m.status || "pledged",
        items: items.length > 0 ? items : [{ name: "Medicine Item", quantity: 1 }],
        totalItemCount: items.reduce((sum, it) => sum + (it.quantity || 1), 0) || 1,
        notes: m.notes
      });
    });

    // 3. Supplies Pledges
    rawSuppliesPledges.forEach((s) => {
      const isDelivered = s.status === "received";
      const isCancelled = s.status === "cancelled";
      const normStatus: "delivered" | "pending" | "cancelled" = isDelivered
        ? "delivered"
        : isCancelled
        ? "cancelled"
        : "pending";

      const items = (s.items || []).map((it) => ({
        name: it.itemName || it.custom || "Supply Item",
        quantity: it.quantity || 1
      }));

      list.push({
        id: s.id,
        donorName: s.donorName || "Supplies Donor",
        donorEmail: s.donorEmail || "",
        donorPhone: s.donorPhone || "",
        category: "supplies",
        categoryLabel: "Care & Shelter Supplies",
        subCategory: s.categoryId || "General Supplies",
        date: s.date || new Date().toISOString().split("T")[0],
        timestamp: parseDateToTime(s.date) || Date.now(),
        status: normStatus,
        rawStatus: s.status || "pledged",
        items: items.length > 0 ? items : [{ name: "Shelter Supply", quantity: 1 }],
        totalItemCount: items.reduce((sum, it) => sum + (it.quantity || 1), 0) || 1,
        notes: s.notes
      });
    });

    // 4. Event Pledges
    rawEventPledges.forEach((e) => {
      const isDelivered = e.status === "completed";
      const isCancelled = e.status === "cancelled";
      const normStatus: "delivered" | "pending" | "cancelled" = isDelivered
        ? "delivered"
        : isCancelled
        ? "cancelled"
        : "pending";

      const eventTypeStr = e.eventType || "Event";
      const eventTitle = e.customType || `${eventTypeStr.charAt(0).toUpperCase() + eventTypeStr.slice(1)} Event`;

      list.push({
        id: e.id,
        donorName: e.name || "Event Host",
        donorEmail: e.email || "",
        donorPhone: e.phone || "",
        category: "event",
        categoryLabel: "Celebration & Events",
        subCategory: e.eventType || "Event",
        date: e.preferredDate || e.submittedAt || new Date().toISOString().split("T")[0],
        timestamp: parseDateToTime(e.preferredDate || e.submittedAt) || Date.now(),
        status: normStatus,
        rawStatus: e.status || "pending",
        items: [{ name: eventTitle, quantity: 1 }],
        totalItemCount: 1,
        notes: e.message
      });
    });

    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [rawPledges, rawMedicinePledges, rawSuppliesPledges, rawEventPledges]);

  // Apply User Filters
  const filteredPledges = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return unifiedPledges.filter((p) => {
      // 1. Time Filter
      if (timeRange === "today") {
        if (now - p.timestamp > dayMs) return false;
      } else if (timeRange === "7d") {
        if (now - p.timestamp > 7 * dayMs) return false;
      } else if (timeRange === "30d") {
        if (now - p.timestamp > 30 * dayMs) return false;
      } else if (timeRange === "90d") {
        if (now - p.timestamp > 90 * dayMs) return false;
      } else if (timeRange === "this_month") {
        const d = new Date(p.timestamp);
        const cur = new Date();
        if (d.getMonth() !== cur.getMonth() || d.getFullYear() !== cur.getFullYear()) return false;
      } else if (timeRange === "this_year") {
        const d = new Date(p.timestamp);
        const cur = new Date();
        if (d.getFullYear() !== cur.getFullYear()) return false;
      } else if (timeRange === "custom") {
        if (customStartDate && p.timestamp < parseDateToTime(customStartDate)) return false;
        if (customEndDate && p.timestamp > parseDateToTime(customEndDate) + dayMs) return false;
      }

      // 2. Category Filter
      if (categoryFilter !== "all" && p.category !== categoryFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter !== "all" && p.status !== statusFilter) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.donorName.toLowerCase().includes(query);
        const matchesCategory = p.categoryLabel.toLowerCase().includes(query);
        const matchesItems = p.items.some((it) => it.name.toLowerCase().includes(query));
        const matchesPhone = p.donorPhone.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesItems && !matchesPhone) return false;
      }

      return true;
    });
  }, [unifiedPledges, timeRange, customStartDate, customEndDate, categoryFilter, statusFilter, searchQuery]);

  // Executive KPI Calculations
  const kpis = useMemo(() => {
    const totalCount = filteredPledges.length;
    const delivered = filteredPledges.filter((p) => p.status === "delivered");
    const pending = filteredPledges.filter((p) => p.status === "pending");
    const cancelled = filteredPledges.filter((p) => p.status === "cancelled");

    const deliveredCount = delivered.length;
    const pendingCount = pending.length;
    const cancelledCount = cancelled.length;

    // Delivery Rate %
    const activeTotal = deliveredCount + pendingCount;
    const deliveryRate = activeTotal > 0 ? Math.round((deliveredCount / activeTotal) * 100) : 0;

    // Item Quantities (Delivered vs Pledged)
    const totalItemsPledged = filteredPledges.reduce((sum, p) => sum + p.totalItemCount, 0);
    const totalItemsDelivered = delivered.reduce((sum, p) => sum + p.totalItemCount, 0);
    const totalItemsPending = pending.reduce((sum, p) => sum + p.totalItemCount, 0);

    // Bookings & Volunteers in scope
    const totalBookings = rawBookings.length;
    const totalVisitors = rawBookings.reduce((sum, b) => sum + (b.visitorCount || 1), 0);
    const completedTours = rawBookings.filter((b) => b.status === "completed").length;

    const totalVolunteers = rawVolunteers.length;
    const acceptedVolunteers = rawVolunteers.filter((v) => v.status === "accepted").length;

    return {
      totalCount,
      deliveredCount,
      pendingCount,
      cancelledCount,
      deliveryRate,
      totalItemsPledged,
      totalItemsDelivered,
      totalItemsPending,
      totalBookings,
      totalVisitors,
      completedTours,
      totalVolunteers,
      acceptedVolunteers
    };
  }, [filteredPledges, rawBookings, rawVolunteers]);

  // Category Breakdown Stats
  const categoryBreakdown = useMemo(() => {
    const cats: Record<string, { label: string; total: number; delivered: number; pending: number; color: string }> = {
      inkind: { label: "In-Kind Goods (Food & Essentials)", total: 0, delivered: 0, pending: 0, color: "#0ea5e9" }, // sky-500
      medicine: { label: "Medicines & Medical Supplies", total: 0, delivered: 0, pending: 0, color: "#10b981" }, // emerald-500
      supplies: { label: "Care & Shelter Supplies", total: 0, delivered: 0, pending: 0, color: "#f59e0b" }, // amber-500
      event: { label: "Celebration & Hosted Events", total: 0, delivered: 0, pending: 0, color: "#8b5cf6" }, // purple-500
      money: { label: "Financial & Bank Pledges", total: 0, delivered: 0, pending: 0, color: "#ec4899" } // pink-500
    };

    filteredPledges.forEach((p) => {
      const target = cats[p.category];
      if (target) {
        target.total += 1;
        if (p.status === "delivered") target.delivered += 1;
        else if (p.status === "pending") target.pending += 1;
      }
    });

    return Object.entries(cats).map(([key, data]) => ({
      key,
      ...data,
      percent: kpis.totalCount > 0 ? Math.round((data.total / kpis.totalCount) * 100) : 0,
      deliveryRate: data.total > 0 ? Math.round((data.delivered / data.total) * 100) : 0
    }));
  }, [filteredPledges, kpis.totalCount]);

  // Top Donated Items Ranking
  const topDonatedItems = useMemo(() => {
    const itemMap: Record<string, { name: string; totalQty: number; deliveredQty: number; category: string }> = {};

    filteredPledges.forEach((p) => {
      p.items.forEach((it) => {
        const key = it.name.toLowerCase().trim();
        if (!key) return;
        if (!itemMap[key]) {
          itemMap[key] = {
            name: it.name,
            totalQty: 0,
            deliveredQty: 0,
            category: p.categoryLabel
          };
        }
        itemMap[key].totalQty += it.quantity || 1;
        if (p.status === "delivered") {
          itemMap[key].deliveredQty += it.quantity || 1;
        }
      });
    });

    return Object.values(itemMap)
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 8);
  }, [filteredPledges]);

  // Timeline Activity Series (Continuous Chronological Rolling Buckets)
  const timelineData = useMemo(() => {
    const now = new Date();
    let numDays = 14;
    if (timeRange === "7d") numDays = 7;
    else if (timeRange === "30d" || timeRange === "this_month") numDays = 30;
    else if (timeRange === "90d") numDays = 30;
    else if (timeRange === "all" || timeRange === "this_year") numDays = 14;

    // Create continuous chronological daily buckets ending today
    const buckets: Array<{
      date: string;
      label: string;
      total: number;
      delivered: number;
      pending: number;
      unitsDelivered: number;
    }> = [];

    const bucketMap: Record<string, (typeof buckets)[0]> = {};

    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const displayLabel = d.toLocaleDateString(language === "am" ? "am-ET" : "en-US", {
        month: "short",
        day: "numeric"
      });

      const entry = {
        date: dateKey,
        label: displayLabel,
        total: 0,
        delivered: 0,
        pending: 0,
        unitsDelivered: 0
      };
      buckets.push(entry);
      bucketMap[dateKey] = entry;
    }

    // Populate filtered pledges into bucketMap
    filteredPledges.forEach((p) => {
      const d = new Date(p.timestamp);
      const dateKey = !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : p.date;

      if (bucketMap[dateKey]) {
        bucketMap[dateKey].total += 1;
        if (p.status === "delivered") {
          bucketMap[dateKey].delivered += 1;
          bucketMap[dateKey].unitsDelivered += p.totalItemCount;
        } else if (p.status === "pending") {
          bucketMap[dateKey].pending += 1;
        }
      }
    });

    const totalInBuckets = buckets.reduce((acc, b) => acc + b.total, 0);

    // If pledges are outside the recent rolling window, dynamically build date buckets around actual pledge timestamps
    if (totalInBuckets === 0 && filteredPledges.length > 0) {
      const dayMap: Record<string, (typeof buckets)[0]> = {};
      const sorted = [...filteredPledges].sort((a, b) => a.timestamp - b.timestamp);

      sorted.forEach((p) => {
        const d = new Date(p.timestamp);
        const dateKey = !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : p.date;
        const displayLabel = !isNaN(d.getTime())
          ? d.toLocaleDateString(language === "am" ? "am-ET" : "en-US", { month: "short", day: "numeric" })
          : p.date;

        if (!dayMap[dateKey]) {
          dayMap[dateKey] = {
            date: dateKey,
            label: displayLabel,
            total: 0,
            delivered: 0,
            pending: 0,
            unitsDelivered: 0
          };
        }
        dayMap[dateKey].total += 1;
        if (p.status === "delivered") {
          dayMap[dateKey].delivered += 1;
          dayMap[dateKey].unitsDelivered += p.totalItemCount;
        } else if (p.status === "pending") {
          dayMap[dateKey].pending += 1;
        }
      });

      return Object.values(dayMap);
    }

    return buckets;
  }, [filteredPledges, language, timeRange]);

  // Tour Booking Types Breakdown
  const bookingVisitorMix = useMemo(() => {
    const types: Record<string, number> = {
      individual: 0,
      group: 0,
      corporate: 0,
      school: 0,
      volunteer: 0
    };

    rawBookings.forEach((b) => {
      const t = b.visitType || "individual";
      types[t] = (types[t] || 0) + (b.visitorCount || 1);
    });

    return Object.entries(types).map(([type, count]) => ({
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percent: kpis.totalVisitors > 0 ? Math.round((count / kpis.totalVisitors) * 100) : 0
    }));
  }, [rawBookings, kpis.totalVisitors]);

  // Volunteer Skill Areas
  const volunteerSkillMix = useMemo(() => {
    const areas: Record<string, number> = {
      kitchen: 0,
      medical: 0,
      psychiatry: 0,
      education: 0,
      general: 0
    };

    rawVolunteers.forEach((v) => {
      const area = v.interestArea || "general";
      areas[area] = (areas[area] || 0) + 1;
    });

    return Object.entries(areas).map(([area, count]) => ({
      area,
      label: area.charAt(0).toUpperCase() + area.slice(1),
      count,
      percent: kpis.totalVolunteers > 0 ? Math.round((count / kpis.totalVolunteers) * 100) : 0
    }));
  }, [rawVolunteers, kpis.totalVolunteers]);

  // CSV Export Function
  const exportAnalyticsCSV = () => {
    if (filteredPledges.length === 0) {
      alert("No pledge data available to export with current filters.");
      return;
    }

    const headers = ["ID", "Donor Name", "Phone", "Email", "Category", "Date", "Status", "Items Description", "Total Units"];
    const rows = filteredPledges.map((p) => [
      `"${p.id}"`,
      `"${p.donorName.replace(/"/g, '""')}"`,
      `"${p.donorPhone}"`,
      `"${p.donorEmail}"`,
      `"${p.categoryLabel}"`,
      `"${p.date}"`,
      `"${p.status.toUpperCase()}"`,
      `"${p.items.map((it) => `${it.name} (${it.quantity})`).join("; ").replace(/"/g, '""')}"`,
      p.totalItemCount
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `selihom_analytics_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Title & Action Bar ── */}
      <div className="bg-white border border-brand-sky-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-linear-to-br from-brand-sky-400 to-brand-sky-600 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
            <Activity className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-black text-xl sm:text-2xl text-brand-sky-950 tracking-tight">
                {language === "am" ? "የልገሳና ክንውን ዳሽቦርድ" : "Donations & Operations Analytics"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-sky-100 text-brand-sky-700 text-[10px] font-black uppercase tracking-wider border border-brand-sky-200">
                Live Data
              </span>
            </div>
            <p className="text-xs text-brand-sky-600 font-medium mt-0.5">
              {language === "am"
                ? "በእውነተኛ መረጃ ላይ የተመሰረተ የልገሳዎች አፈጻጸም፣ የገቢ ዕቃዎችና የጉብኝቶች ትንተና"
                : "Real-time insights on delivered pledges, fulfillment rates, categories, and shelter operations"}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap w-full xl:w-auto justify-end">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="px-3.5 py-2.5 bg-white hover:bg-brand-sky-50 text-brand-sky-700 border border-brand-sky-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
            title="Refresh from Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-brand-sky-500" : ""}`} />
            <span>{refreshing ? "Updating..." : "Refresh"}</span>
          </button>

          <button
            onClick={exportAnalyticsCSV}
            className="px-4 py-2.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            title="Export filtered data to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === "am" ? "መረጃውን አውርድ (CSV)" : "Export CSV Report"}</span>
          </button>
        </div>
      </div>

      {/* ── Multi-Parameter Filter Toolbar ── */}
      <div className="bg-white border border-brand-sky-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-brand-sky-50 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-sky-900">
            <Filter className="w-4 h-4 text-brand-sky-500" />
            <span>{language === "am" ? "የመረጃ ማጣሪያዎች (Filters)" : "Interactive Filters"}</span>
          </div>
          <span className="text-[11px] font-bold text-brand-sky-600">
            {filteredPledges.length} / {unifiedPledges.length} {language === "am" ? "የተገኙ ልገሳዎች" : "Pledges Matched"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Time Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-brand-sky-500 mb-1">
              Time Horizon
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="w-full px-3 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-bold text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500 cursor-pointer"
            >
              <option value="all">All Time (ሁሉም ጊዜ)</option>
              <option value="today">Today (ዛሬ)</option>
              <option value="7d">Last 7 Days (ባለፉት 7 ቀናት)</option>
              <option value="30d">Last 30 Days (ባለፉት 30 ቀናት)</option>
              <option value="90d">Last 90 Days (ባለፉት 3 ወራት)</option>
              <option value="this_month">This Month (በዚህ ወር)</option>
              <option value="this_year">This Year (በዚህ ዓመት)</option>
              <option value="custom">Custom Date Range (የተወሰነ ቀን)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-brand-sky-500 mb-1">
              Donation Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-bold text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500 cursor-pointer"
            >
              <option value="all">All Categories (ሁሉም ዘርፎች)</option>
              <option value="inkind">In-Kind Goods (Food & Clothing)</option>
              <option value="medicine">Medicines & Healthcare</option>
              <option value="supplies">Care & Shelter Supplies</option>
              <option value="event">Celebration Events</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-brand-sky-500 mb-1">
              Fulfillment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-bold text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500 cursor-pointer"
            >
              <option value="all">All Statuses (ሁሉም ሁኔታዎች)</option>
              <option value="delivered">Delivered / Received (የገቡ / የተረከቡ)</option>
              <option value="pending">Pending Delivery (ቃል የተገቡ)</option>
              <option value="cancelled">Cancelled (የተሰረዙ)</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-brand-sky-500 mb-1">
              Search Donor or Item
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-brand-sky-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search oil, medicine, name..."
                className="w-full pl-9 pr-3 py-2 bg-brand-sky-50/50 border border-brand-sky-200 rounded-xl text-xs font-medium text-brand-sky-950 focus:outline-hidden focus:border-brand-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Custom Date Pickers (Shown if custom is selected) */}
        {timeRange === "custom" && (
          <div className="p-3 bg-brand-sky-50/70 border border-brand-sky-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-brand-sky-800 mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-brand-sky-200 rounded-lg text-xs font-mono text-brand-sky-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-brand-sky-800 mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-brand-sky-200 rounded-lg text-xs font-mono text-brand-sky-900"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Top Executive KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Delivered Card */}
        <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
              Fulfilled
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 block">
              {language === "am" ? "በእጅ የደረሱ ልገሳዎች" : "Delivered Donations"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-black text-brand-sky-950">
                {kpis.deliveredCount}
              </span>
              <span className="text-xs text-gray-500 font-bold">
                ({kpis.totalCount > 0 ? Math.round((kpis.deliveredCount / kpis.totalCount) * 100) : 0}%)
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              {kpis.totalItemsDelivered} physical items handed over
            </p>
          </div>
        </div>

        {/* Pending Pledges Card */}
        <div className="bg-white border-2 border-amber-100 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-xs">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase">
              Awaiting
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 block">
              {language === "am" ? "ቃል የተገቡ (በመጠበቅ ላይ)" : "Pending Pledges"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-black text-brand-sky-950">
                {kpis.pendingCount}
              </span>
              <span className="text-xs text-gray-500 font-bold">
                ({kpis.totalCount > 0 ? Math.round((kpis.pendingCount / kpis.totalCount) * 100) : 0}%)
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              {kpis.totalItemsPending} items committed by donors
            </p>
          </div>
        </div>

        {/* Fulfillment Rate Gauge Card */}
        <div className="bg-white border-2 border-brand-sky-100 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-sky-50 text-brand-sky-600 flex items-center justify-center border border-brand-sky-200 shadow-xs">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-sky-100 text-brand-sky-800 uppercase">
              Efficiency
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-sky-700 block">
              {language === "am" ? "የአፈጻጸም ምጣኔ (Fulfillment)" : "Fulfillment Rate"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-black text-brand-sky-950">
                {kpis.deliveryRate}%
              </span>
              <span className="text-xs text-emerald-600 font-bold">
                {kpis.deliveryRate >= 70 ? "Healthy" : "Needs Follow-up"}
              </span>
            </div>
            {/* Mini Progress bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-brand-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, kpis.deliveryRate)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Shelter Visitors & Operations Card */}
        <div className="bg-white border-2 border-purple-100 rounded-2xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-xs">
              <Users className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase">
              Operations
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 block">
              {language === "am" ? "የጎብኝዎችና በጎ ፈቃድ ተሳትፎ" : "Visitors & Volunteers"}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-black text-brand-sky-950">
                {kpis.totalVisitors}
              </span>
              <span className="text-xs text-gray-500 font-bold">Visitors</span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              {kpis.totalBookings} tour bookings · {kpis.totalVolunteers} volunteer apps
            </p>
          </div>
        </div>
      </div>

      {/* ── Middle Row: Fulfillment Comparison & Time Series Graphs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Fulfillment Status Donut / Ratio (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-brand-sky-500" />
                {language === "am" ? "የልገሳዎች የመድረስ ሁኔታ" : "Donation Fulfillment Status"}
              </h3>
            </div>
            <p className="text-[11px] text-brand-sky-500 font-medium">
              Actual deliveries completed versus open commitments
            </p>
          </div>

          {/* Visual Progress Bar & Donut representation */}
          <div className="space-y-4 my-auto">
            {/* Visual Multi-Segment Bar */}
            <div className="h-5 w-full bg-gray-100 rounded-xl overflow-hidden flex shadow-inner">
              {kpis.totalCount > 0 ? (
                <>
                  <div
                    style={{ width: `${(kpis.deliveredCount / kpis.totalCount) * 100}%` }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Delivered: ${kpis.deliveredCount}`}
                  />
                  <div
                    style={{ width: `${(kpis.pendingCount / kpis.totalCount) * 100}%` }}
                    className="bg-amber-400 h-full transition-all duration-500"
                    title={`Pending: ${kpis.pendingCount}`}
                  />
                  <div
                    style={{ width: `${(kpis.cancelledCount / kpis.totalCount) * 100}%` }}
                    className="bg-red-400 h-full transition-all duration-500"
                    title={`Cancelled: ${kpis.cancelledCount}`}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* Legend and stats */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-900">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span>Delivered to Shelter (የገቡ / የተረከቡ)</span>
                </div>
                <span>{kpis.deliveredCount} ({kpis.totalCount > 0 ? Math.round((kpis.deliveredCount / kpis.totalCount) * 100) : 0}%)</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs font-bold text-amber-900">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                  <span>Pending Delivery (ቃል የተገቡ)</span>
                </div>
                <span>{kpis.pendingCount} ({kpis.totalCount > 0 ? Math.round((kpis.pendingCount / kpis.totalCount) * 100) : 0}%)</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50/60 rounded-xl border border-red-100 text-xs font-bold text-red-900">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 shrink-0" />
                  <span>Cancelled (የተሰረዙ)</span>
                </div>
                <span>{kpis.cancelledCount} ({kpis.totalCount > 0 ? Math.round((kpis.cancelledCount / kpis.totalCount) * 100) : 0}%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-sky-50 text-[11px] text-gray-500 flex items-center justify-between font-medium">
            <span>Total Logged Pledges: <strong>{kpis.totalCount}</strong></span>
            <span>Total Units: <strong>{kpis.totalItemsPledged}</strong></span>
          </div>
        </div>

        {/* Right: Time-Series Donation Timeline Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-sky-50 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-sky-500" />
                  {language === "am" ? "የልገሳዎች እንቅስቃሴ በጊዜ ሂደት" : "Donation Activity Graph"}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  Interactive
                </span>
              </div>
              <p className="text-[11px] text-brand-sky-500 font-medium">
                {language === "am"
                  ? "የተመዘገቡ እና የተረከቧቸው ልገሳዎች የቀን እንቅስቃሴ"
                  : "Daily flow of pledged vs verified delivered donations"}
              </p>
            </div>

            {/* View Mode & Filter Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Area / Bar toggle */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setChartDisplayMode("area")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    chartDisplayMode === "area"
                      ? "bg-white text-brand-sky-950 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Smooth Wave Area Chart"
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span>Curve</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartDisplayMode("bar")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    chartDisplayMode === "bar"
                      ? "bg-white text-brand-sky-950 shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Stacked Bar Chart"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Bars</span>
                </button>
              </div>

              {/* Status Filter Toggle */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTimelineTab("all")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTimelineTab === "all"
                      ? "bg-brand-sky-500 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTimelineTab("delivered")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeTimelineTab === "delivered"
                      ? "bg-emerald-500 text-white shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Delivered
                </button>
              </div>
            </div>
          </div>

          {/* SVG Line / Spline Area / Bar Chart Component */}
          {timelineData.length > 0 ? (
            <div className="space-y-3 pt-1">
              {chartDisplayMode === "area" ? (
                /* ── SVG Smooth Curved Spline Area Chart ── */
                <div className="relative w-full h-56 select-none">
                  {(() => {
                    const width = 700;
                    const height = 210;
                    const padLeft = 32;
                    const padRight = 16;
                    const padTop = 20;
                    const padBottom = 28;
                    const plotWidth = width - padLeft - padRight;
                    const plotHeight = height - padTop - padBottom;

                    const maxVal = Math.max(
                      ...timelineData.map((d) => (activeTimelineTab === "delivered" ? d.delivered : d.total)),
                      4
                    );

                    const pointsTotal = timelineData.map((d, i) => {
                      const x = padLeft + (i / Math.max(timelineData.length - 1, 1)) * plotWidth;
                      const y = padTop + (1 - d.total / maxVal) * plotHeight;
                      return { x, y, data: d };
                    });

                    const pointsDelivered = timelineData.map((d, i) => {
                      const x = padLeft + (i / Math.max(timelineData.length - 1, 1)) * plotWidth;
                      const y = padTop + (1 - d.delivered / maxVal) * plotHeight;
                      return { x, y, data: d };
                    });

                    // Bezier spline path constructor
                    const buildSplinePath = (pts: { x: number; y: number }[], closeToBottom = false) => {
                      if (pts.length === 0) return "";
                      if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;

                      let pStr = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
                      for (let i = 0; i < pts.length - 1; i++) {
                        const p0 = pts[i === 0 ? 0 : i - 1];
                        const p1 = pts[i];
                        const p2 = pts[i + 1];
                        const p3 = pts[i + 2] || p2;

                        const cp1x = p1.x + (p2.x - p0.x) / 6;
                        const cp1y = p1.y + (p2.y - p0.y) / 6;
                        const cp2x = p2.x - (p3.x - p1.x) / 6;
                        const cp2y = p2.y - (p3.y - p1.y) / 6;

                        pStr += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
                      }

                      if (closeToBottom) {
                        pStr += ` L ${pts[pts.length - 1].x.toFixed(1)},${(padTop + plotHeight).toFixed(1)} L ${pts[0].x.toFixed(1)},${(padTop + plotHeight).toFixed(1)} Z`;
                      }
                      return pStr;
                    };

                    const activePoints = activeTimelineTab === "delivered" ? pointsDelivered : pointsTotal;
                    const hoveredItem = hoveredPointIndex !== null ? activePoints[hoveredPointIndex] : null;

                    return (
                      <div className="relative w-full h-full">
                        <svg
                          viewBox={`0 0 ${width} ${height}`}
                          className="w-full h-full overflow-visible"
                          onMouseLeave={() => setHoveredPointIndex(null)}
                        >
                          <defs>
                            {/* Total gradient fill */}
                            <linearGradient id="totalAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.08" />
                              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                            </linearGradient>

                            {/* Delivered gradient fill */}
                            <linearGradient id="deliveredAreaGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
                              <stop offset="70%" stopColor="#10b981" stopOpacity="0.1" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>

                            {/* Glow filter */}
                            <filter id="glowDelivered" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* Horizontal Gridlines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, gIdx) => {
                            const yPos = padTop + (1 - ratio) * plotHeight;
                            const gridVal = Math.round(ratio * maxVal);
                            return (
                              <g key={gIdx}>
                                <line
                                  x1={padLeft}
                                  y1={yPos}
                                  x2={width - padRight}
                                  y2={yPos}
                                  stroke="#e2e8f0"
                                  strokeDasharray="4 4"
                                  strokeWidth="1"
                                />
                                <text
                                  x={padLeft - 6}
                                  y={yPos + 3.5}
                                  fill="#94a3b8"
                                  fontSize="9"
                                  fontWeight="600"
                                  textAnchor="end"
                                >
                                  {gridVal}
                                </text>
                              </g>
                            );
                          })}

                          {/* Area & Curves */}
                          {activeTimelineTab === "all" && (
                            <>
                              {/* Total Pledges Area & Stroke */}
                              <path
                                d={buildSplinePath(pointsTotal, true)}
                                fill="url(#totalAreaGrad)"
                              />
                              <path
                                d={buildSplinePath(pointsTotal, false)}
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                              />
                            </>
                          )}

                          {/* Delivered Area & Stroke */}
                          <path
                            d={buildSplinePath(pointsDelivered, true)}
                            fill="url(#deliveredAreaGrad)"
                          />
                          <path
                            d={buildSplinePath(pointsDelivered, false)}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter="url(#glowDelivered)"
                          />

                          {/* Vertical Crosshair Line on Hover */}
                          {hoveredItem && (
                            <line
                              x1={hoveredItem.x}
                              y1={padTop}
                              x2={hoveredItem.x}
                              y2={padTop + plotHeight}
                              stroke="#0f172a"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              opacity="0.6"
                            />
                          )}

                          {/* Interactive Points & Trigger Zones */}
                          {activePoints.map((pt, pIdx) => {
                            const isHovered = hoveredPointIndex === pIdx;
                            const delVal = pt.data.delivered;
                            const totVal = pt.data.total;

                            return (
                              <g
                                key={pIdx}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredPointIndex(pIdx)}
                              >
                                {/* Invisible wide touch target */}
                                <rect
                                  x={pt.x - plotWidth / Math.max(timelineData.length, 1) / 2}
                                  y={padTop}
                                  width={plotWidth / Math.max(timelineData.length, 1)}
                                  height={plotHeight + padBottom}
                                  fill="transparent"
                                />

                                {/* Total Dot if in 'all' view */}
                                {activeTimelineTab === "all" && totVal > 0 && (
                                  <circle
                                    cx={pointsTotal[pIdx].x}
                                    cy={pointsTotal[pIdx].y}
                                    r={isHovered ? "5" : "3.5"}
                                    fill="#ffffff"
                                    stroke="#0284c7"
                                    strokeWidth="2"
                                    className="transition-all duration-200"
                                  />
                                )}

                                {/* Delivered Dot */}
                                {delVal > 0 && (
                                  <circle
                                    cx={pointsDelivered[pIdx].x}
                                    cy={pointsDelivered[pIdx].y}
                                    r={isHovered ? "6" : "4"}
                                    fill="#ffffff"
                                    stroke="#059669"
                                    strokeWidth="2.5"
                                    className="transition-all duration-200"
                                  />
                                )}

                                {/* Bottom X-Axis Date Labels (shown at periodic intervals) */}
                                {(timelineData.length <= 14 || pIdx % 2 === 0 || pIdx === timelineData.length - 1) && (
                                  <text
                                    x={pt.x}
                                    y={padTop + plotHeight + 18}
                                    fill={isHovered ? "#0f172a" : "#94a3b8"}
                                    fontSize="9.5"
                                    fontWeight={isHovered ? "800" : "600"}
                                    textAnchor="middle"
                                  >
                                    {pt.data.label}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                        </svg>

                        {/* Floating Tooltip Card */}
                        {hoveredItem && (
                          <div
                            style={{
                              left: `${(hoveredItem.x / width) * 100}%`,
                              top: `${Math.max(10, (hoveredItem.y / height) * 100 - 20)}%`
                            }}
                            className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-30 bg-brand-sky-950 text-white p-3 rounded-2xl shadow-xl border border-brand-sky-800 text-[11px] min-w-[150px] space-y-1"
                          >
                            <p className="font-bold text-gray-200 border-b border-white/10 pb-1">
                              📅 {hoveredItem.data.date} ({hoveredItem.data.label})
                            </p>
                            <div className="flex items-center justify-between text-emerald-300 font-bold">
                              <span>Delivered:</span>
                              <span>{hoveredItem.data.delivered} pledges</span>
                            </div>
                            <div className="flex items-center justify-between text-amber-300 font-bold">
                              <span>Pending:</span>
                              <span>{hoveredItem.data.pending} pledges</span>
                            </div>
                            <div className="flex items-center justify-between text-brand-sky-200 font-semibold pt-0.5 border-t border-white/10 text-[10px]">
                              <span>Delivered Units:</span>
                              <span>{hoveredItem.data.unitsDelivered} units</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ) : (
                /* ── Modern Rounded Stacked Bar Chart ── */
                <div className="h-56 w-full flex items-end justify-between gap-1.5 sm:gap-2 px-2 pt-4 pb-2 border-b border-gray-100">
                  {timelineData.map((d, idx) => {
                    const maxVal = Math.max(...timelineData.map((t) => t.total), 1);
                    const totalHeight = Math.max(14, Math.round((d.total / maxVal) * 170));
                    const deliveredHeight = d.total > 0 ? Math.round((d.delivered / d.total) * totalHeight) : 0;
                    const pendingHeight = totalHeight - deliveredHeight;

                    return (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                      >
                        {/* Hover Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute -top-16 z-20 bg-brand-sky-950 text-white text-[10px] font-bold p-2 rounded-xl shadow-xl whitespace-nowrap space-y-0.5">
                          <p className="text-gray-300">📅 {d.date}</p>
                          <p className="text-emerald-400">Delivered: {d.delivered} / {d.total}</p>
                          <p className="text-amber-400">Pending: {d.pending}</p>
                        </div>

                        {/* Bar Stack */}
                        <div
                          className="w-full max-w-[28px] rounded-t-xl bg-gray-100 relative overflow-hidden transition-all group-hover:scale-105 group-hover:shadow-sm flex flex-col justify-end"
                          style={{ height: `${totalHeight}px` }}
                        >
                          {/* Pending portion on top */}
                          {d.pending > 0 && (
                            <div
                              className="w-full bg-amber-400 transition-all duration-300"
                              style={{ height: `${pendingHeight}px` }}
                              title={`Pending: ${d.pending}`}
                            />
                          )}
                          {/* Delivered portion on bottom */}
                          {d.delivered > 0 && (
                            <div
                              className="w-full bg-emerald-500 transition-all duration-300"
                              style={{ height: `${deliveredHeight}px` }}
                              title={`Delivered: ${d.delivered}`}
                            />
                          )}
                          {d.total === 0 && <div className="w-full h-1 bg-gray-200" />}
                        </div>

                        <span className="text-[9px] font-bold text-gray-400 mt-2 truncate max-w-full">
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Chart Legend & Summary Info */}
              <div className="flex items-center justify-between pt-1 border-t border-brand-sky-50 text-[11px] font-bold text-gray-600 flex-wrap gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs" />
                    <span className="text-gray-800">{language === "am" ? "የተረከቡ" : "Delivered"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-brand-sky-400 shadow-xs" />
                    <span className="text-gray-800">{language === "am" ? "አጠቃላይ ቃልኪዳኖች" : "Total Pledges"}</span>
                  </div>
                </div>

                <div className="text-[10px] text-brand-sky-600 font-semibold">
                  <span>{language === "am" ? "ዝርዝር መረጃዎችን ለማየት ነጥቦቹ ላይ ያንዣብቡ" : "Hover over points to inspect date metrics"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 text-xs font-bold">
              {language === "am" ? "ለተመረጠው ጊዜ ምንም የልገሳ መረጃ አልተገኘም።" : "No donation timeline data found for the selected filter range."}
            </div>
          )}
        </div>
      </div>

      {/* ── Category Breakdown & Top Donated Items Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-brand-sky-50 pb-3">
            <h3 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-sky-500" />
              {language === "am" ? "የልገሳ ዓይነቶችና ምድቦች" : "Donations by Category"}
            </h3>
            <p className="text-[11px] text-brand-sky-500 font-medium">
              Pledges and fulfillment rates across care categories
            </p>
          </div>

          <div className="space-y-3.5">
            {categoryBreakdown.map((cat) => (
              <div key={cat.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-brand-sky-950">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700">{cat.delivered} delivered</span>
                    <span className="text-gray-400">/ {cat.total} total</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono">
                      {cat.deliveryRate}% fulfilled
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${cat.total > 0 ? (cat.delivered / cat.total) * 100 : 0}%`, backgroundColor: cat.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Donated Items Ranking (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-brand-sky-50 pb-3">
            <h3 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-sky-500" />
              {language === "am" ? "በብዛት የተለገሱ ዋና ዋና ዕቃዎች" : "Top Donated Items Ranking"}
            </h3>
            <p className="text-[11px] text-brand-sky-500 font-medium">
              Ranked by total quantity pledged & delivered by community
            </p>
          </div>

          {topDonatedItems.length > 0 ? (
            <div className="space-y-3">
              {topDonatedItems.map((item, idx) => {
                const maxTopQty = Math.max(...topDonatedItems.map((t) => t.totalQty), 1);
                const percentWidth = Math.min(100, Math.round((item.totalQty / maxTopQty) * 100));

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-lg bg-brand-sky-100 text-brand-sky-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-brand-sky-950 truncate max-w-[200px]">{item.name}</span>
                        <span className="text-[10px] text-gray-400 hidden sm:inline">({item.category})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600">{item.deliveredQty} delivered</span>
                        <span className="text-brand-sky-900 font-mono">/ {item.totalQty} total</span>
                      </div>
                    </div>

                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-sky-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs font-bold">
              No item details recorded yet for this criteria.
            </div>
          )}
        </div>
      </div>

      {/* ── Community Operations: Visitors & Volunteers ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shelter Tour Visitors Mix */}
        <div className="bg-white border border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand-sky-50 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-sky-500" />
                {language === "am" ? "የጉብኝት ዓይነቶችና የተሳታፊ ብዛት" : "Tour Visitors Breakdown"}
              </h3>
              <p className="text-[11px] text-brand-sky-500 font-medium">
                Headcount by visit type ({kpis.totalVisitors} total visitors)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {bookingVisitorMix.map((v) => (
              <div key={v.type} className="p-3 bg-brand-sky-50/60 rounded-2xl border border-brand-sky-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-brand-sky-600 block">
                    {v.label}
                  </span>
                  <span className="text-base font-serif font-bold text-brand-sky-950">
                    {v.count} Visitors
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-brand-sky-700 bg-white px-2 py-1 rounded-lg border border-brand-sky-200">
                  {v.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Skill Talent Pool */}
        <div className="bg-white border border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-brand-sky-50 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-sky-500" />
                {language === "am" ? "የበጎ ፈቃደኞች የሙያ መስኮች" : "Volunteer Talent Distribution"}
              </h3>
              <p className="text-[11px] text-brand-sky-500 font-medium">
                Applicant interest areas ({kpis.totalVolunteers} applicants, {kpis.acceptedVolunteers} accepted)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {volunteerSkillMix.map((vol) => (
              <div key={vol.area} className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-700 block">
                    {vol.label}
                  </span>
                  <span className="text-base font-serif font-bold text-purple-950">
                    {vol.count} Applicants
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-white px-2 py-1 rounded-lg border border-purple-200">
                  {vol.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filtered Recent Transactions Log Table ── */}
      <div className="bg-white border border-brand-sky-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-brand-sky-50 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-brand-sky-950 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-brand-sky-500" />
              {language === "am" ? "የቅርብ ጊዜ የተመዘገቡ ልገሳዎች ዝርዝር" : "Recent Filtered Pledge Logs"}
            </h3>
            <p className="text-[11px] text-brand-sky-500 font-medium">
              Showing matching donations with delivery confirmation status
            </p>
          </div>
          <span className="text-xs font-bold text-brand-sky-700 bg-brand-sky-50 px-3 py-1 rounded-xl border border-brand-sky-200">
            {filteredPledges.length} records
          </span>
        </div>

        {filteredPledges.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-sky-950">
              <thead className="bg-brand-sky-50/70 border-b border-brand-sky-100 text-[10px] font-black uppercase tracking-wider text-brand-sky-600">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-xl">Date</th>
                  <th className="py-2.5 px-3">Donor Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Items / Units</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 text-right rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredPledges.slice(0, 10).map((p) => {
                  const isDelivered = p.status === "delivered";
                  const isPending = p.status === "pending";

                  return (
                    <tr key={p.id} className="hover:bg-brand-sky-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">{p.date}</td>
                      <td className="py-2.5 px-3 font-bold">{p.donorName}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-sky-50 text-brand-sky-700 border border-brand-sky-200">
                          {p.categoryLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-brand-sky-900 font-semibold truncate max-w-xs block">
                          {p.items.map((it) => `${it.name} (${it.quantity})`).join(", ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-gray-500">{p.donorPhone || "—"}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isPending
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                          {isPending && <Clock className="w-3 h-3" />}
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-400 text-xs font-bold">
            No pledge records match the active filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
