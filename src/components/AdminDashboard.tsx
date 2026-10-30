import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  KeyRound,
  LogOut,
  Calendar,
  Gift,
  Users,
  Clock,
  Search,
  Trash2,
  Shield,
  Phone,
  Mail,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  Filter,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  Plus,
  Edit3,
  Package,
  Globe,
  RefreshCw,
  Pill,
  Award,
  Settings,
  LayoutDashboard,
  Activity,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Booking, DonationPledge, VolunteerApplication, AdminProfile, InKindItem } from "../types";
import {
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getPledges,
  updatePledgeStatus,
  deletePledge,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
  getAdminProfile,
  saveAdminProfile,
  getInKindNeeds,
  saveInKindNeed,
  deleteInKindNeed,
  resetInKindNeeds,
} from "../utils/adminStorage";
import { sanitizeText, sanitizePhone, isValidEmail, isNonEmpty } from "../utils/sanitize";
import selihomLogo from "../assets/images/selihom_logo.jpg";
import AdminCalendar from "./AdminCalendar";
import { AdminMedicineTab, AdminSuppliesTab, AdminEventsTab, AdminVolRolesTab, AdminNewsTab, AdminSettingsTab } from "./AdminTabs";
import AdminAnalyticsDashboard from "./AdminAnalyticsDashboard";
import AdminDeliveredDonors from "./AdminDeliveredDonors";
import LoadingDots from "./LoadingDots";

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConfirmationModalConfig {
  isOpen: boolean;
  type: "booking" | "pledge" | "volunteer" | "need" | "resetNeeds";
  id: string;
  recordName: string;
  action: "status_change" | "delete" | "save_need" | "save_profile";
  payload?: any;
  newStatus?: string;
  statusLabel?: string;
  title?: string;
  message?: string;
}

interface NotificationToast {
  type: "success" | "error" | "info";
  message: string;
}

interface DetailModalConfig {
  isOpen: boolean;
  type: "booking" | "pledge" | "volunteer";
  data: Booking | DonationPledge | VolunteerApplication | null;
}

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auth fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Tab state
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "pledges" | "volunteers" | "profile" | "calendar" | "events" | "news" | "settings">("dashboard");
  const [pledgeAdminType, setPledgeAdminType] = useState<"inkind" | "medicine" | "supplies" | "delivered_donors">("inkind");
  const [volunteerAdminType, setVolunteerAdminType] = useState<"applications" | "roles">("applications");

  // Admin Profile State
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  // Profile Form fields — populated from db.json via refreshAllData on mount
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showPasswords, setShowPasswords] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data lists
  const [bookings, setBookingsList] = useState<Booking[]>([]);
  const [pledges, setPledgesList] = useState<DonationPledge[]>([]);
  const [volunteers, setVolunteersList] = useState<VolunteerApplication[]>([]);
  const [inKindNeeds, setInKindNeeds] = useState<InKindItem[]>([]);

  // Sub-tab under Pledges
  const [pledgeSubTab, setPledgeSubTab] = useState<"pledges" | "needs">("pledges");

  // In-Kind Need Editor Form & Modal state
  const [needModalOpen, setNeedModalOpen] = useState(false);
  const [editingNeedId, setEditingNeedId] = useState<string | null>(null);
  const [needFormLangTab, setNeedFormLangTab] = useState<"en" | "am">("en");
  const [needValidationError, setNeedValidationError] = useState<string | null>(null);
  const [needForm, setNeedForm] = useState({
    nameEn: "",
    nameAm: "",
    category: "Food" as InKindItem["category"],
    neededQtyEn: "",
    neededQtyAm: "",
    urgency: "High" as InKindItem["urgency"],
    descEn: "",
    descAm: "",
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Refresh Loader & Timestamp State
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Confirmation & Detail Modals
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalConfig | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [detailModal, setDetailModal] = useState<DetailModalConfig | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    refreshAllData();
    const authSaved = sessionStorage.getItem("selihom_admin_logged_in");
    if (authSaved === "true") {
      setIsLoggedIn(true);
    }
  }, [isOpen]);

  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      const [bk, pl, vl, ik, prof] = await Promise.all([
        getBookings(),
        getPledges(),
        getVolunteers(),
        getInKindNeeds(),
        getAdminProfile(),
      ]);
      setBookingsList(bk);
      setPledgesList(pl);
      setVolunteersList(vl);
      setInKindNeeds(ik);
      if (prof) {
        setProfile(prof);
        setProfileName(prof.name);
        setProfileEmail(prof.email);
        setProfileRole(prof.role);
        setProfilePhone(prof.phone);
        setEditUsername(prof.username);
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateNeed = () => {
    setEditingNeedId(null);
    setNeedFormLangTab("en");
    setNeedValidationError(null);
    setNeedForm({
      nameEn: "",
      nameAm: "",
      category: "Food",
      neededQtyEn: "",
      neededQtyAm: "",
      urgency: "High",
      descEn: "",
      descAm: "",
    });
    setNeedModalOpen(true);
  };

  const handleOpenEditNeed = (item: InKindItem) => {
    setEditingNeedId(item.id);
    setNeedFormLangTab("en");
    setNeedValidationError(null);
    setNeedForm({
      nameEn: item.name.en || "",
      nameAm: item.name.am || "",
      category: item.category || "Food",
      neededQtyEn: item.neededQuantity.en || "",
      neededQtyAm: item.neededQuantity.am || "",
      urgency: item.urgency || "High",
      descEn: item.description.en || "",
      descAm: item.description.am || "",
    });
    setNeedModalOpen(true);
  };

  const handleSaveNeed = (e: React.FormEvent) => {
    e.preventDefault();
    setNeedValidationError(null);

    const nameEn = needForm.nameEn.trim();
    const nameAm = needForm.nameAm.trim();
    const qtyEn = needForm.neededQtyEn.trim();
    const qtyAm = needForm.neededQtyAm.trim();
    const descEn = needForm.descEn.trim();
    const descAm = needForm.descAm.trim();

    // Check English required fields
    if (!nameEn || !qtyEn || !descEn) {
      setNeedValidationError("Both English and Amharic text are required for Item Name, Quantity Goal, and Description. Please complete missing English fields.");
      setNeedFormLangTab("en");
      return;
    }

    // Check Amharic required fields
    if (!nameAm || !qtyAm || !descAm) {
      setNeedValidationError("Both English and Amharic text are required for Item Name, Quantity Goal, and Description. Please complete missing Amharic fields.");
      setNeedFormLangTab("am");
      return;
    }

    const newNeed: InKindItem = {
      id: editingNeedId || `ik-${Date.now()}`,
      name: { en: nameEn, am: nameAm },
      category: needForm.category,
      neededQuantity: { en: qtyEn, am: qtyAm },
      urgency: needForm.urgency,
      description: { en: descEn, am: descAm },
    };

    setConfirmModal({
      isOpen: true,
      type: "need",
      id: newNeed.id,
      recordName: newNeed.name.en,
      action: "save_need",
      payload: newNeed,
      title: editingNeedId ? "Confirm Update Supply Need" : "Confirm Add Supply Need",
      message: editingNeedId
        ? `Are you sure you want to update supply item "${newNeed.name.en}" (${newNeed.name.am})?`
        : `Are you sure you want to add new supply item "${newNeed.name.en}" (${newNeed.name.am}) to the public needed items list?`
    });
  };

  const handleDeleteNeed = (id: string, name: string) => {
    requestDelete("need", id, name);
  };

  const handleRefreshClick = async () => {
    await refreshAllData();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const cleanUsername = sanitizeText(username, 60);
    const cleanPassword = sanitizeText(password, 200);

    if (!isNonEmpty(cleanUsername) || !isNonEmpty(cleanPassword)) {
      setAuthError("Username and password are required.");
      return;
    }

    const currentProf = await getAdminProfile();
    if (!currentProf) {
      setAuthError("Could not reach the server. Please make sure the server is running.");
      return;
    }
    if (cleanUsername === currentProf.username && cleanPassword === currentProf.passwordHash) {
      setIsLoggedIn(true);
      sessionStorage.setItem("selihom_admin_logged_in", "true");
      await refreshAllData();
    } else {
      setAuthError(language === "am" ? "የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል!" : "Invalid admin username or password.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("selihom_admin_logged_in");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    const cleanUsername = sanitizeText(editUsername, 60);
    const cleanName     = sanitizeText(profileName, 120);
    const cleanEmail    = sanitizeText(profileEmail, 120);
    const cleanRole     = sanitizeText(profileRole, 120);
    const cleanPhone    = sanitizePhone(profilePhone);
    const cleanNew      = sanitizeText(newPassword, 200);
    const cleanConfirm  = sanitizeText(confirmNewPassword, 200);
    const cleanCurrent  = sanitizeText(currentPasswordConfirm, 200);

    if (!isNonEmpty(cleanUsername)) {
      setProfileMessage({ type: "error", text: "Username cannot be empty." });
      return;
    }
    if (cleanEmail && !isValidEmail(cleanEmail)) {
      setProfileMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    const existingProfile = await getAdminProfile();
    if (!existingProfile) {
      setProfileMessage({ type: "error", text: "Could not reach the server. Please try again." });
      return;
    }

    if (cleanNew) {
      if (cleanCurrent !== existingProfile.passwordHash) {
        setProfileMessage({ type: "error", text: "Current password verification failed." });
        return;
      }
      if (cleanNew.length < 6) {
        setProfileMessage({ type: "error", text: "New password must be at least 6 characters long." });
        return;
      }
      if (cleanNew !== cleanConfirm) {
        setProfileMessage({ type: "error", text: "New passwords do not match." });
        return;
      }
    }

    const updatedProfile = {
      name:         cleanName,
      email:        cleanEmail,
      role:         cleanRole,
      phone:        cleanPhone,
      username:     cleanUsername,
      passwordHash: cleanNew ? cleanNew : existingProfile.passwordHash,
    };

    setConfirmModal({
      isOpen: true,
      type: "booking",
      id: "admin-profile",
      recordName: updatedProfile.name,
      action: "save_profile",
      payload: updatedProfile,
      title: "Confirm Admin Profile Update",
      message: `Are you sure you want to update administrative account details for "${updatedProfile.username}"?`
    });
  };

  // Status change request with confirmation modal
  const requestStatusChange = (
    type: "booking" | "pledge" | "volunteer",
    id: string,
    recordName: string,
    newStatus: string,
    statusLabel: string
  ) => {
    setConfirmModal({
      isOpen: true,
      type,
      id,
      recordName,
      action: "status_change",
      newStatus,
      statusLabel,
      title: "Confirm Status Change",
      message: `Are you sure you want to change the status of ${type} record (${id}) for "${recordName}" to "${statusLabel.toUpperCase()}"?`
    });
  };

  // Direct status update executor after confirmation
  const handleDirectStatusChange = async (
    type: "booking" | "pledge" | "volunteer",
    id: string,
    newStatus: string
  ) => {
    try {
      if (type === "booking") {
        const updated = await updateBookingStatus(id, newStatus as Booking["status"]);
        setBookingsList(updated);
        setDetailModal((prev) => {
          if (!prev || !prev.data || prev.type !== "booking") return prev;
          const fresh = updated.find((b) => b.id === id);
          return fresh ? { ...prev, data: fresh } : prev;
        });
      } else if (type === "pledge") {
        const updated = await updatePledgeStatus(id, newStatus as DonationPledge["status"]);
        setPledgesList(updated);
        setDetailModal((prev) => {
          if (!prev || !prev.data || prev.type !== "pledge") return prev;
          const fresh = updated.find((p) => p.id === id);
          return fresh ? { ...prev, data: fresh } : prev;
        });
      } else if (type === "volunteer") {
        const updated = await updateVolunteerStatus(id, newStatus as VolunteerApplication["status"]);
        setVolunteersList(updated);
        setDetailModal((prev) => {
          if (!prev || !prev.data || prev.type !== "volunteer") return prev;
          const fresh = updated.find((v) => v.id === id);
          return fresh ? { ...prev, data: fresh } : prev;
        });
      }
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  // Delete request
  const requestDelete = (
    type: "booking" | "pledge" | "volunteer" | "need" | "resetNeeds",
    id: string,
    recordName: string
  ) => {
    let customMsg = `Are you sure you want to permanently delete record ${id} for "${recordName}"? This record will be permanently removed.`;
    if (type === "need") {
      customMsg = `Are you sure you want to delete supply item "${recordName}"? This item will be removed from the public needed supplies list.`;
    } else if (type === "resetNeeds") {
      customMsg = `Are you sure you want to reset all needed supply items back to default? Any custom items added will be replaced.`;
    }

    setConfirmModal({
      isOpen: true,
      type,
      id,
      recordName,
      action: "delete",
      title: "Confirm Deletion",
      message: customMsg
    });
  };

  const executeConfirmAction = async () => {
    if (!confirmModal) return;
    const { type, id, action, newStatus, payload } = confirmModal;
    setConfirmBusy(true);

    try {
      if (action === "status_change" && newStatus) {
        await handleDirectStatusChange(type as any, id, newStatus);

      } else if (action === "delete") {
        if (type === "booking") {
          const updated = await deleteBooking(id);
          setBookingsList(updated);
        } else if (type === "pledge") {
          const updated = await deletePledge(id);
          setPledgesList(updated);
        } else if (type === "volunteer") {
          const updated = await deleteVolunteer(id);
          setVolunteersList(updated);
        } else if (type === "need") {
          const updated = await deleteInKindNeed(id);
          setInKindNeeds(updated);
        } else if (type === "resetNeeds") {
          const updated = await resetInKindNeeds();
          setInKindNeeds(updated);
        }
        // Always close the detail modal after any deletion
        setDetailModal(null);

      } else if (action === "save_need" && payload) {
        const updated = await saveInKindNeed(payload);
        setInKindNeeds(updated);
        setNeedModalOpen(false);

      } else if (action === "save_profile" && payload) {
        const updated = await saveAdminProfile(payload);
        setProfile(updated);
        setCurrentPasswordConfirm("");
        setNewPassword("");
        setConfirmNewPassword("");
        setProfileMessage({ type: "success", text: "Admin profile updated successfully!" });
      }
    } catch (err) {
      console.error("Action failed:", err);
      alert("Operation failed. Please check the server is running and try again.");
    } finally {
      setConfirmBusy(false);
      setConfirmModal(null);
    }
  };

  if (!isOpen) return null;

  // Filtered lists
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || (b.status || "pending") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isPledgeOverdue = (p: DonationPledge) => {
    if ((p.status || "pledged") !== "pledged" || !p.estimatedDeliveryDate) return false;
    const estTs = new Date(p.estimatedDeliveryDate).setHours(23, 59, 59, 999);
    return !isNaN(estTs) && estTs < Date.now();
  };

  const filteredPledges = pledges.filter((p) => {
    const matchesSearch =
      p.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.donorPhone && p.donorPhone.includes(searchQuery));
    const isOverdue = isPledgeOverdue(p);
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "overdue"
        ? isOverdue
        : (p.status || "pledged") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredNeeds = inKindNeeds.filter((it) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      query === "" ||
      (it.name.en && it.name.en.toLowerCase().includes(query)) ||
      (it.name.am && it.name.am.toLowerCase().includes(query)) ||
      (it.category && it.category.toLowerCase().includes(query)) ||
      (it.neededQuantity.en && it.neededQuantity.en.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" || it.urgency.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || (v.status || "new") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-brand-sky-50 text-brand-sky-950 flex flex-col font-sans relative z-50">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-brand-sky-200 px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <img src={selihomLogo} alt="Selihom Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white p-0.5 object-contain border-2 border-brand-sky-400 shadow-sm shrink-0" />
          <div>
            <h1 className="font-serif font-bold text-base sm:text-xl text-brand-sky-950 tracking-tight leading-tight">
              {language === "am" ? "ሰሊሆም አስተዳደር" : "Selihom Admin Portal"}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-brand-sky-500 hidden sm:block">
              {language === "am" ? "የተጠቃሚዎች መዝገቦች አስተዳደር" : "Internal Shelter Management & Operations"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-brand-sky-50 hover:bg-brand-sky-100 text-brand-sky-700 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-brand-sky-200 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-sky-400" />
            <span>{language === "am" ? "ወደ ድህረ ገጹ" : "Website"}</span>
          </button>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === "am" ? "ውጣ" : "Logout"}</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {!isLoggedIn ? (
        /* LOGIN SCREEN */
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-brand-sky-50 min-h-[calc(100vh-70px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-brand-sky-100 relative"
          >
            {/* 4-colour top stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 flex rounded-t-3xl overflow-hidden">
              <div className="flex-1 bg-brand-sky-400" /><div className="flex-1 bg-brand-green-400" />
              <div className="flex-1 bg-brand-yellow-400" /><div className="flex-1 bg-brand-orange-400" />
            </div>

            <div className="text-center mb-6 sm:mb-8 pt-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-sky-400 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-sky-950">
                {language === "am" ? "ወደ አስተዳደር ይግቡ" : "Admin Sign In"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {language === "am" ? "የመዝገብ ቁጥርዎን ያስገቡ" : "Enter administrator credentials to access shelter records."}
              </p>
            </div>

            {authError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center leading-snug">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {language === "am" ? "የተጠቃሚ ስም" : "Username"}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-sky-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder={language === "am" ? "የተጠቃሚ ስምዎን ያስገቡ" : "Enter username"}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-brand-sky-200 text-xs text-gray-900 focus:border-brand-sky-400 focus:ring-2 focus:ring-brand-sky-100 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {language === "am" ? "የይለፍ ቃል" : "Password"}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-brand-sky-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-brand-sky-200 text-xs text-gray-900 focus:border-brand-sky-400 focus:ring-2 focus:ring-brand-sky-100 outline-none transition-all"
                  />
                </div>
              </div>

              <button type="submit"
                className="w-full py-3 sm:py-3.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md mt-2">
                {language === "am" ? "ይግቡ" : "Login to Portal"}
              </button>
            </form>
          </motion.div>
        </div>
      ) : (
        /* LOGGED IN DASHBOARD - FULL PAGE */
        <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Navigation Tabs Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-brand-sky-200 shadow-xs">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
              {/* Primary Dashboard / Analytics Tab */}
              <button
                onClick={() => { setActiveTab("dashboard"); setSearchQuery(""); setStatusFilter("all"); }}
                className={`flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === "dashboard"
                    ? "bg-brand-sky-500 text-white shadow-md ring-2 ring-brand-sky-200"
                    : "text-brand-sky-800 bg-brand-sky-50/70 hover:bg-brand-sky-100/70 border border-brand-sky-100"
                }`}
              >
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span>{language === "am" ? "ዳሽቦርድ" : "Dashboard"}</span>
              </button>

              <button
                onClick={() => { setActiveTab("bookings"); setSearchQuery(""); setStatusFilter("all"); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === "bookings" ? "bg-brand-sky-400 text-white shadow-sm" : "text-brand-sky-700 hover:bg-brand-sky-50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{language === "am" ? `ጉብኝቶች (${bookings.length})` : `Bookings (${bookings.length})`}</span>
              </button>

              <button
                onClick={() => { setActiveTab("pledges"); setPledgeAdminType("inkind"); setSearchQuery(""); setStatusFilter("all"); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === "pledges" ? "bg-brand-sky-400 text-white shadow-sm" : "text-brand-sky-700 hover:bg-brand-sky-50"
                }`}
              >
                <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{language === "am" ? `ቃልኪዳኖች (${pledges.length})` : `Pledges (${pledges.length})`}</span>
              </button>

              <button
                onClick={() => { setActiveTab("volunteers"); setSearchQuery(""); setStatusFilter("all"); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === "volunteers" ? "bg-brand-sky-400 text-white shadow-sm" : "text-brand-sky-700 hover:bg-brand-sky-50"
                }`}
              >
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{language === "am" ? `በጎ ፈቃደኞች (${volunteers.length})` : `Volunteers (${volunteers.length})`}</span>
              </button>

              <button
                onClick={() => { setActiveTab("calendar"); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === "calendar" ? "bg-brand-sky-400 text-white shadow-sm" : "text-brand-sky-700 hover:bg-brand-sky-50"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{language === "am" ? "የቀን መቁጠሪያ" : "Calendar"}</span>
              </button>

              {/* Dynamic tabs */}
              {([
                { key:"events",    icon:Users,   label:{ en:"Events",     am:"ድግሶች"   } },
                { key:"news",      icon:FileText,label:{ en:"News",       am:"ዜናዎች"   } },
                { key:"settings",  icon:Settings,label:{ en:"Settings",   am:"ቅንብሮች" } },
              ] as { key: string; icon: React.ComponentType<any>; label: { en: string; am: string } }[]).map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 ${
                      activeTab === tab.key ? "bg-brand-sky-400 text-white shadow-sm" : "text-brand-sky-700 hover:bg-brand-sky-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{language === "am" ? tab.label.am : tab.label.en}</span>
                  </button>
                );
              })}
              <button
                onClick={() => { setActiveTab("profile"); setProfileMessage(null); }}
                className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === "profile" ? "bg-brand-sky-400 text-white shadow-sm" : "text-brand-sky-700 hover:bg-brand-sky-50"
                }`}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{language === "am" ? "መገለጫ" : "Profile"}</span>
              </button>
            </div>
            <div />
          </div>

          {/* Shared title, search, reload, and filter controls */}
          {activeTab !== "dashboard" && activeTab !== "profile" && activeTab !== "calendar" && activeTab !== "events" && activeTab !== "news" && activeTab !== "settings" && (activeTab !== "pledges" || pledgeAdminType === "inkind") && (activeTab !== "volunteers" || volunteerAdminType === "applications") && (
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-sky-200 shadow-xs space-y-3 sm:space-y-4">
              <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
                {activeTab === "pledges" ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => { setPledgeAdminType("inkind"); setSearchQuery(""); setStatusFilter("all"); }}
                      className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        pledgeAdminType === "inkind"
                          ? "bg-emerald-500 text-white shadow-sm border border-emerald-600"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      <Gift className="w-4 h-4" />
                      <span>{language === "am" ? "ዓይነት እቃ" : "In-Kind"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPledgeAdminType("medicine"); setSearchQuery(""); setStatusFilter("all"); }}
                      className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        pledgeAdminType === "medicine"
                          ? "bg-rose-500 text-white shadow-sm border border-rose-600"
                          : "bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
                      }`}
                    >
                      <Pill className="w-4 h-4" />
                      <span>{language === "am" ? "መድሃኒት" : "Medicine"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPledgeAdminType("supplies"); setSearchQuery(""); setStatusFilter("all"); }}
                      className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        pledgeAdminType === "supplies"
                          ? "bg-amber-500 text-white shadow-sm border border-amber-600"
                          : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      <span>{language === "am" ? "ቁሳቁስ" : "Supplies"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPledgeAdminType("delivered_donors"); setSearchQuery(""); setStatusFilter("all"); }}
                      className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        pledgeAdminType === "delivered_donors"
                          ? "bg-brand-sky-500 text-white shadow-sm border border-brand-sky-600"
                          : "bg-brand-sky-50 text-brand-sky-800 border border-brand-sky-200 hover:bg-brand-sky-100"
                      }`}
                    >
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{language === "am" ? "⭐ ታማኝ ደጋፊዎች" : "⭐ Delivered Donors"}</span>
                    </button>
                  </div>
                ) : activeTab === "volunteers" ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => { setVolunteerAdminType("applications"); setSearchQuery(""); setStatusFilter("all"); }}
                      className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        volunteerAdminType === "applications"
                          ? "bg-brand-sky-500 text-white shadow-sm border border-brand-sky-600"
                          : "bg-brand-sky-50 text-brand-sky-800 border border-brand-sky-200 hover:bg-brand-sky-100"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>{language === "am" ? "ማመልከቻዎች" : "Applications"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setVolunteerAdminType("roles"); setSearchQuery(""); setStatusFilter("all"); }}
                      className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        volunteerAdminType === "roles"
                          ? "bg-purple-600 text-white shadow-sm border border-purple-700"
                          : "bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100"
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>{language === "am" ? "የበጎ ፈቃድ ሚናዎች" : "Volunteer Roles"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-brand-sky-100 text-brand-sky-600 rounded-xl flex items-center justify-center border border-brand-sky-200 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h2 className="font-serif font-bold text-base sm:text-lg text-brand-sky-950 leading-tight">
                      {language === "am" ? "የጉብኝት ምዝገቦች አስተዳደር" : "Visit Bookings Management"}
                    </h2>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center xl:justify-end">
                  {activeTab !== "pledges" || pledgeAdminType === "inkind" ? <div className="relative w-full sm:w-72 md:w-80">
                  <Search className="w-4 h-4 text-brand-sky-400 absolute left-3.5 top-2.5 sm:top-3 pointer-events-none" />
                  <input
                    type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "am" ? "ስም፣ መታወቂያ ወይም ስልክ ይፈልጉ..." : "Search name, ID, or phone..."}
                    className="w-full pl-9 pr-9 py-2 sm:py-2.5 bg-brand-sky-50 rounded-xl border border-brand-sky-200 text-xs text-gray-900 focus:bg-white focus:border-brand-sky-400 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 sm:top-3 text-gray-400 hover:text-gray-600 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  </div> : null}
                  {(activeTab !== "pledges" || pledgeAdminType === "inkind") && <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-2 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400 cursor-pointer">
                    <option value="all">{language === "am" ? "ሁሉም" : "All"}</option>
                    {activeTab === "bookings" && <>
                      <option value="pending">{language === "am" ? "በቅድሚያ" : "Pending"}</option>
                      <option value="approved">{language === "am" ? "ተቀባይነት" : "Approved"}</option>
                      <option value="completed">{language === "am" ? "ተጠናቋል" : "Completed"}</option>
                      <option value="cancelled">{language === "am" ? "ተሰርዟል" : "Cancelled"}</option>
                    </>}
                    {activeTab === "pledges" && pledgeSubTab === "pledges" && <>
                      <option value="pledged">{language === "am" ? "ቃልኪዳን" : "Pledged"}</option>
                      <option value="overdue">{language === "am" ? "ጊዜው ያለፈበት" : "Overdue"}</option>
                      <option value="received">{language === "am" ? "ተቀበለ" : "Received"}</option>
                      <option value="cancelled">{language === "am" ? "ተሰርዟል" : "Cancelled"}</option>
                    </>}
                    {activeTab === "pledges" && pledgeSubTab === "needs" && <>
                      <option value="high">{language === "am" ? "ከፍተኛ" : "High"}</option>
                      <option value="medium">{language === "am" ? "መካከለኛ" : "Medium"}</option>
                      <option value="low">{language === "am" ? "ዝቅተኛ" : "Low"}</option>
                    </>}
                    {activeTab === "volunteers" && <>
                      <option value="new">{language === "am" ? "አዲስ" : "New"}</option>
                      <option value="reviewed">{language === "am" ? "በግምገማ" : "Reviewed"}</option>
                      <option value="accepted">{language === "am" ? "ተቀበለ" : "Accepted"}</option>
                      <option value="declined">{language === "am" ? "ተነፍጓል" : "Declined"}</option>
                    </>}
                  </select>}
                  {activeTab === "pledges" && (
                    <>
                      <select value={pledgeSubTab} onChange={(e) => { setPledgeSubTab(e.target.value as "pledges" | "needs"); setStatusFilter("all"); }}
                        className="rounded-xl border border-brand-sky-200 bg-brand-sky-50 px-3 py-2 text-xs font-bold text-brand-sky-700 outline-none focus:border-brand-sky-400">
                        <option value="pledges">{language === "am" ? "ቃልኪዳኖች" : "Donor Pledges"}</option>
                        <option value="needs">{language === "am" ? "የሚፈለጉ እቃዎች" : "Needed Items"}</option>
                      </select>
                      {pledgeSubTab === "needs" && (
                        <button onClick={handleOpenCreateNeed}
                          className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0">
                          <Plus className="w-3.5 h-3.5" />
                          <span>{language === "am" ? "እቃ ጨምር" : "Add Item"}</span>
                        </button>
                      )}
                    </>
                  )}
                  {activeTab !== "pledges" || pledgeAdminType === "inkind" ? <button onClick={handleRefreshClick} disabled={isRefreshing}
                    className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70 shrink-0">
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    <span>{isRefreshing ? (language === "am" ? "በመጫን ላይ..." : "Reloading...") : (language === "am" ? "አዙር" : "Reload")}</span>
                  </button> : null}
                </div>
              </div>

              <div className="hidden flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <span className="font-extrabold text-gray-400 uppercase tracking-wider text-[10px] shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-gray-400" /> {language === "am" ? "ማጣሪያ:" : "Filter:"}
                </span>
                <button onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "all" ? "bg-brand-sky-400 text-white shadow-xs" : "bg-brand-sky-50 text-brand-sky-700 border border-brand-sky-200 hover:bg-brand-sky-100"}`}>
                  {language === "am" ? "ሁሉም" : "All"}
                </button>

                {activeTab === "bookings" && (<>
                  <button onClick={() => setStatusFilter("pending")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "pending" ? "bg-amber-500 text-white shadow-xs" : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"}`}>
                    {language === "am" ? `በቅድሚያ (${bookings.filter(b=>(b.status||"pending")==="pending").length})` : `Pending (${bookings.filter(b=>(b.status||"pending")==="pending").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("approved")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "approved" ? "bg-brand-green-500 text-white shadow-xs" : "bg-brand-green-50 text-brand-green-900 border border-brand-green-200 hover:bg-brand-green-100"}`}>
                    {language === "am" ? `ተቀባይነት (${bookings.filter(b=>b.status==="approved").length})` : `Approved (${bookings.filter(b=>b.status==="approved").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("completed")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "completed" ? "bg-brand-sky-500 text-white shadow-xs" : "bg-brand-sky-50 text-brand-sky-900 border border-brand-sky-200 hover:bg-brand-sky-100"}`}>
                    {language === "am" ? `ተጠናቋል (${bookings.filter(b=>b.status==="completed").length})` : `Completed (${bookings.filter(b=>b.status==="completed").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("cancelled")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "cancelled" ? "bg-red-600 text-white shadow-xs" : "bg-red-50 text-red-900 border border-red-200 hover:bg-red-100"}`}>
                    {language === "am" ? `ተሰርዟል (${bookings.filter(b=>b.status==="cancelled").length})` : `Cancelled (${bookings.filter(b=>b.status==="cancelled").length})`}
                  </button>
                </>)}

                {activeTab === "pledges" && pledgeSubTab === "pledges" && (<>
                  <button onClick={() => setStatusFilter("pledged")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "pledged" ? "bg-amber-500 text-white shadow-xs" : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"}`}>
                    {language === "am" ? `ቃልኪዳን (${pledges.filter(p=>(p.status||"pledged")==="pledged").length})` : `Pledged (${pledges.filter(p=>(p.status||"pledged")==="pledged").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("overdue")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "overdue" ? "bg-rose-600 text-white shadow-xs" : "bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100"}`}>
                    {language === "am" ? `ጊዜው ያለፈበት (${pledges.filter(isPledgeOverdue).length})` : `Overdue (${pledges.filter(isPledgeOverdue).length})`}
                  </button>
                  <button onClick={() => setStatusFilter("received")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "received" ? "bg-brand-green-500 text-white shadow-xs" : "bg-brand-green-50 text-brand-green-900 border border-brand-green-200 hover:bg-brand-green-100"}`}>
                    {language === "am" ? `ተቀበለ (${pledges.filter(p=>p.status==="received").length})` : `Received (${pledges.filter(p=>p.status==="received").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("cancelled")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "cancelled" ? "bg-red-600 text-white shadow-xs" : "bg-red-50 text-red-900 border border-red-200 hover:bg-red-100"}`}>
                    {language === "am" ? `ተሰርዟል (${pledges.filter(p=>p.status==="cancelled").length})` : `Cancelled (${pledges.filter(p=>p.status==="cancelled").length})`}
                  </button>
                </>)}

                {activeTab === "pledges" && pledgeSubTab === "needs" && (<>
                  <button onClick={() => setStatusFilter("high")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "high" ? "bg-red-600 text-white shadow-xs" : "bg-red-50 text-red-900 border border-red-200 hover:bg-red-100"}`}>
                    {language === "am" ? `ከፍተኛ (${inKindNeeds.filter(it=>it.urgency==="High").length})` : `High (${inKindNeeds.filter(it=>it.urgency==="High").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("medium")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "medium" ? "bg-amber-500 text-white shadow-xs" : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"}`}>
                    {language === "am" ? `መካከለኛ (${inKindNeeds.filter(it=>it.urgency==="Medium").length})` : `Medium (${inKindNeeds.filter(it=>it.urgency==="Medium").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("low")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "low" ? "bg-brand-green-600 text-white shadow-xs" : "bg-brand-green-50 text-brand-green-900 border border-brand-green-200 hover:bg-brand-green-100"}`}>
                    {language === "am" ? `ዝቅተኛ (${inKindNeeds.filter(it=>it.urgency==="Low").length})` : `Low (${inKindNeeds.filter(it=>it.urgency==="Low").length})`}
                  </button>
                </>)}

                {activeTab === "volunteers" && (<>
                  <button onClick={() => setStatusFilter("new")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "new" ? "bg-amber-500 text-white shadow-xs" : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"}`}>
                    {language === "am" ? `አዲስ (${volunteers.filter(v=>(v.status||"new")==="new").length})` : `New (${volunteers.filter(v=>(v.status||"new")==="new").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("reviewed")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "reviewed" ? "bg-brand-sky-500 text-white shadow-xs" : "bg-brand-sky-50 text-brand-sky-900 border border-brand-sky-200 hover:bg-brand-sky-100"}`}>
                    {language === "am" ? `በግምገማ (${volunteers.filter(v=>v.status==="reviewed").length})` : `Reviewed (${volunteers.filter(v=>v.status==="reviewed").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("accepted")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "accepted" ? "bg-brand-green-500 text-white shadow-xs" : "bg-brand-green-50 text-brand-green-900 border border-brand-green-200 hover:bg-brand-green-100"}`}>
                    {language === "am" ? `ተቀበለ (${volunteers.filter(v=>v.status==="accepted").length})` : `Accepted (${volunteers.filter(v=>v.status==="accepted").length})`}
                  </button>
                  <button onClick={() => setStatusFilter("declined")} className={`px-3 py-1.5 rounded-lg font-extrabold transition-all shrink-0 cursor-pointer ${statusFilter === "declined" ? "bg-red-600 text-white shadow-xs" : "bg-red-50 text-red-900 border border-red-200 hover:bg-red-100"}`}>
                    {language === "am" ? `ተነፍጓል (${volunteers.filter(v=>v.status==="declined").length})` : `Declined (${volunteers.filter(v=>v.status==="declined").length})`}
                  </button>
                </>)}
              </div>
            </div>
          )}

          {/* TAB 1: BOOKINGS LIST */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between gap-4 hover:border-brand-green-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-black text-brand-sky-950 bg-brand-sky-50 border border-brand-sky-200 px-2.5 py-0.5 rounded-md">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : item.status === "completed"
                            ? "bg-brand-sky-100 text-brand-sky-900 border-brand-sky-200"
                            : item.status === "cancelled"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {item.status || "pending"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-lg text-brand-sky-950 group-hover:text-brand-sky-700 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Booked: {item.createdAt}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-sky-700" />
                        {item.date}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-sky-700" />
                        {item.timeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Clean Primary Details Button */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => setDetailModal({ isOpen: true, type: "booking", data: item })}
                      className="w-full py-2.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-brand-yellow-400" />
                      <span>{language === "am" ? "ዝርዝር" : "Details"}</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredBookings.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
                  No visit bookings found matching search criteria.
                </div>
              )}
              </div>
            </div>
          )}

          {/* TAB 2: IN-KIND PLEDGES & NEEDED ITEMS MANAGER */}
          {activeTab === "pledges" && pledgeAdminType === "inkind" && (
            <div className="space-y-4">
              {/* VIEW A: DONOR PLEDGES RECEIVED */}
              {pledgeSubTab === "pledges" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPledges.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between gap-4 hover:border-brand-green-300 hover:shadow-md transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-black text-brand-sky-950 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                            {item.id}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isPledgeOverdue(item) && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-red-100 text-red-800 border border-red-300 animate-pulse">
                                ⚠️ {language === "am" ? "ያለፈበት" : "Overdue"}
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                                item.status === "received"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : item.status === "cancelled"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                            >
                              {item.status || "pledged"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-serif font-bold text-lg text-brand-sky-950 group-hover:text-brand-sky-700 transition-colors">
                            {item.donorName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium mt-0.5">
                            <span>Pledged: {item.date}</span>
                            {item.estimatedDeliveryDate && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className={isPledgeOverdue(item) ? "text-red-700 font-bold bg-red-50 px-1.5 py-0.5 rounded-md border border-red-200" : "text-brand-sky-800 font-semibold bg-brand-sky-50 px-1.5 py-0.5 rounded-md border border-brand-sky-100"}>
                                  📅 {language === "am" ? "የተገመተበት ቀን:" : "Est. Date:"} {item.estimatedDeliveryDate}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <span className="text-[11px] font-extrabold uppercase text-gray-600 block mb-1">
                            Pledged Goods ({item.pledgedItems?.length || 0} items)
                          </span>
                          <p className="text-xs text-gray-800 font-medium truncate">
                            {item.pledgedItems?.map((it) => `${it.name} (x${it.quantity})`).join(", ") || "In-kind donation"}
                          </p>
                        </div>
                      </div>

                      {/* Clean Primary Details & Contact Actions */}
                      <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => setDetailModal({ isOpen: true, type: "pledge", data: item })}
                          className="flex-1 py-2.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Eye className="w-4 h-4 text-brand-yellow-400" />
                          <span>{language === "am" ? "ዝርዝር" : "Details"}</span>
                        </button>
                        {item.donorPhone && (
                          <a
                            href={`tel:${item.donorPhone}`}
                            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl border border-emerald-200 transition-colors"
                            title={language === "am" ? "ደውል" : "Call Donor"}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {item.donorEmail && (
                          <a
                            href={`mailto:${item.donorEmail}`}
                            className="p-2.5 bg-brand-sky-50 hover:bg-brand-sky-100 text-brand-sky-700 rounded-xl border border-brand-sky-200 transition-colors"
                            title={language === "am" ? "ኢሜይል ላክ" : "Send Email"}
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredPledges.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
                      No in-kind pledges found matching search criteria.
                    </div>
                  )}
                </div>
              )}

              {/* VIEW B: HIGH-PRIORITY NEEDED ITEMS LIST EDITOR */}
              {pledgeSubTab === "needs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNeeds.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between gap-4 hover:border-brand-green-400 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                      <div className="space-y-3">
                        {/* Top Metadata row */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                            {item.category}
                          </span>

                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                              item.urgency === "High"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : item.urgency === "Medium"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                          >
                            {item.urgency} Priority
                          </span>
                        </div>

                        {/* Title (English & Amharic) */}
                        <div>
                          <h4 className="font-serif font-bold text-base text-brand-sky-950 group-hover:text-brand-sky-700 transition-colors">
                            {item.name.en}
                          </h4>
                          <p className="text-xs font-bold text-gray-500 font-sans mt-0.5">
                            {item.name.am}
                          </p>
                        </div>

                        {/* Quantity / Goal */}
                        <div className="bg-brand-sky-50/60 p-2.5 rounded-xl border border-brand-sky-100/80">
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-sky-700 block mb-0.5">
                            {language === "am" ? "የሚፈለግ ብዛት:" : "Needed Quantity Goal:"}
                          </span>
                          <p className="text-xs font-extrabold text-brand-sky-950">
                            {item.neededQuantity.en} <span className="text-gray-300 font-normal">|</span> {item.neededQuantity.am}
                          </p>
                        </div>

                        {/* Description */}
                        <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 space-y-1">
                          <p className="font-medium text-gray-700">{item.description.en}</p>
                          <p className="text-[11px] text-gray-500">{item.description.am}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditNeed(item)}
                          className="flex-1 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-brand-yellow-400" />
                          <span>{language === "am" ? "እቃ አርትዕ" : "Edit Supply"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteNeed(item.id, item.name.en || item.name.am || "Supply Item")}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition-all cursor-pointer border border-red-200"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredNeeds.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-brand-sky-100 text-gray-500 text-xs space-y-3">
                      <p>{language === "am" ? "ምንም የሚፈለጉ እቃዎች አልተገኙም።" : "No needed supplies found matching search/filter criteria."}</p>
                      <button onClick={handleOpenCreateNeed}
                        className="px-4 py-2 bg-brand-sky-400 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs">
                        <Plus className="w-4 h-4" />
                        <span>{language === "am" ? "እቃ ጨምር" : "Add First Needed Supply"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "pledges" && pledgeAdminType === "medicine" && <AdminMedicineTab language={language} onPledgeTypeChange={setPledgeAdminType} />}
          {activeTab === "pledges" && pledgeAdminType === "supplies" && <AdminSuppliesTab language={language} onPledgeTypeChange={setPledgeAdminType} />}
          {activeTab === "pledges" && pledgeAdminType === "delivered_donors" && <AdminDeliveredDonors language={language} onPledgeTypeChange={setPledgeAdminType} />}

          {/* TAB 3: VOLUNTEERS LIST */}
          {activeTab === "volunteers" && volunteerAdminType === "applications" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVolunteers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between gap-4 hover:border-brand-green-300 hover:shadow-md transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-black text-emerald-950 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                          item.status === "accepted"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : item.status === "declined"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : item.status === "reviewed"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        {item.status || "new"}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-lg text-brand-sky-950 group-hover:text-brand-sky-700 transition-colors">
                        {item.fullName}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Applied: {item.submittedAt}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <span><strong>Interest:</strong> {item.interestArea.toUpperCase()}</span>
                      <span className="text-gray-300">•</span>
                      <span><strong>Availability:</strong> {item.availability}</span>
                    </div>
                  </div>

                  {/* Clean Primary Details Button */}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setDetailModal({ isOpen: true, type: "volunteer", data: item })}
                      className="w-full py-2.5 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Eye className="w-4 h-4 text-brand-yellow-400" />
                      <span>{language === "am" ? "ዝርዝር" : "Details"}</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredVolunteers.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
                  No volunteer applications found matching search criteria.
                </div>
              )}
              </div>
            </div>
          )}

          {activeTab === "volunteers" && volunteerAdminType === "roles" && <AdminVolRolesTab language={language} onVolunteerTypeChange={setVolunteerAdminType} />}

          {/* TAB 4: ADMIN PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Section Header with Reload Button */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-sky-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-brand-sky-50 text-brand-sky-950 rounded-xl flex items-center justify-center font-bold border border-brand-sky-200 shrink-0">
                    <User className="w-5 h-5 text-brand-sky-800" />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-base sm:text-lg text-brand-sky-950 leading-tight">
                      {language === "am" ? "የአስተዳደር መገለጫ" : "Admin Profile & Settings"}
                    </h2>
                    <p className="text-[11px] text-brand-sky-500 font-medium">
                    </p>
                  </div>
                </div>
                <button onClick={handleRefreshClick} disabled={isRefreshing}
                  className="px-3.5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70 self-end sm:self-auto shrink-0">
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>{isRefreshing ? (language === "am" ? "በመጫን ላይ..." : "Reloading...") : (language === "am" ? "አዙር" : "Reload")}</span>
                </button>
              </div>
              {/* Profile Summary Header Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-brand-sky-100 shadow-xs space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-brand-sky-100">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-sky-400 text-white rounded-2xl flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-md shrink-0">
                    {profile.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-sky-950">{profile.name}</h3>
                      <span className="bg-brand-sky-100 text-brand-sky-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-brand-sky-200">
                        {profile.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      Username: <strong className="text-gray-800">{profile.username}</strong>
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-xs text-gray-600 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> {profile.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" /> {profile.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Record Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      {language === "am" ? "የጉብኝት ምዝገቦች" : "Visit Bookings"}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-brand-sky-950">{bookings.length}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{language === "am" ? "የታቀዱ ጉብኝቶች" : "Scheduled center tours"}</span>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      {language === "am" ? "የዓይነት ቃልኪዳኖች" : "In-Kind Pledges"}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-brand-sky-950">{pledges.length}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{language === "am" ? "የተሰጡ እቃዎች" : "Donated goods & items"}</span>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      {language === "am" ? "በጎ ፈቃደኞች" : "Volunteers"}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-brand-sky-950">{volunteers.length}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{language === "am" ? "ንቁ ማመልከቻዎች" : "Active applicant forms"}</span>
                  </div>
                </div>
              </div>

              {/* Edit Admin Profile Form */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200 shadow-xs space-y-4 sm:space-y-6">
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-extrabold text-brand-sky-950">{language === "am" ? "መገለጫ ማዘመን" : "Update Profile & Password"}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "am" ? "የአስተዳደር መረጃዎን ያዘምኑ።" : "Edit your administrator personal info and update your account login password."}
                  </p>
                </div>

                {profileMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      profileMessage.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {profileMessage.type === "success" ? (
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{profileMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Administrative Role</label>
                      <input
                        type="text"
                        required
                        value={profileRole}
                        onChange={(e) => setProfileRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Login Security Credentials */}
                  <div className="space-y-3.5 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-serif text-sm font-bold text-brand-sky-950">Security & Credentials</h5>
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="text-xs font-semibold text-brand-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {showPasswords ? "Hide Passwords" : "Show Passwords"}
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Login Username</label>
                      <input
                        type="text"
                        required
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                      />
                    </div>

                    <div className="bg-amber-50/60 p-3.5 sm:p-4 rounded-2xl border border-amber-100 space-y-3">
                      <p className="text-[11px] text-amber-900 font-medium leading-relaxed">
                        Leave password fields empty if you do not want to change your current login password.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Current Password</label>
                          <input
                            type={showPasswords ? "text" : "password"}
                            value={currentPasswordConfirm}
                            onChange={(e) => setCurrentPasswordConfirm(e.target.value)}
                            placeholder="Current password"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">New Password</label>
                          <input
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 6 chars"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">Confirm New Password</label>
                          <input
                            type={showPasswords ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirm new pass"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-brand-sky-400 hover:bg-brand-sky-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <Save className="w-4 h-4 text-brand-yellow-400" />
                      {language === "am" ? "መገለጫ አስቀምጥ" : "Save Admin Profile"}
                    </button>
                  </div>
                </form>
            </div>
          </div>
          )}

          {/* TAB 0: ANALYTICS DASHBOARD */}
          {activeTab === "dashboard" && (
            <AdminAnalyticsDashboard language={language} />
          )}

          {/* TAB 5: CALENDAR */}
          {activeTab === "calendar" && (
            <AdminCalendar language={language} />
          )}

          {/* TAB 6: EVENTS */}
          {activeTab === "events" && <AdminEventsTab language={language} />}

          {/* TAB 10: NEWS */}
          {activeTab === "news" && <AdminNewsTab language={language} />}

          {/* TAB 11: SETTINGS */}
          {activeTab === "settings" && <AdminSettingsTab language={language} />}

        </main>
      )}

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal && confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-gray-200 space-y-4 sm:space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      confirmModal.action === "delete"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : confirmModal.action === "status_change"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : confirmModal.action === "save_need" || confirmModal.action === "save_profile"
                        ? "bg-brand-sky-50 text-brand-sky-800 border-brand-sky-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}
                  >
                    {confirmModal.action === "delete" ? (
                      <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                    ) : confirmModal.action === "status_change" ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                    ) : confirmModal.action === "save_need" ? (
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                    ) : confirmModal.action === "save_profile" ? (
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                    ) : (
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-brand-sky-950">
                      {confirmModal.title || (confirmModal.action === "delete" ? "Confirm Deletion" : "Confirm Action")}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Target: <span className="font-bold text-gray-800">{confirmModal.recordName}</span> ({confirmModal.id})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !confirmBusy && setConfirmModal(null)}
                  disabled={confirmBusy}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-50 p-3.5 sm:p-4 rounded-2xl border border-gray-100 space-y-2">
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => !confirmBusy && setConfirmModal(null)}
                  disabled={confirmBusy}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeConfirmAction}
                  disabled={confirmBusy}
                  className={`w-full sm:w-auto px-5 py-2.5 text-xs font-extrabold rounded-xl text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-70 ${
                    confirmModal.action === "delete"
                      ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                      : confirmModal.action === "status_change"
                      ? "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/20"
                      : "bg-brand-sky-950 hover:bg-brand-sky-900 shadow-brand-sky-950/20"
                  }`}
                >
                  {confirmBusy ? <LoadingDots label="Working" className="justify-center" /> : <>
                  <Check className="w-4 h-4" />
                  <span>
                    {confirmModal.action === "delete"
                      ? "Confirm Delete"
                      : confirmModal.action === "status_change"
                      ? `Update to ${confirmModal.statusLabel || "New Status"}`
                      : confirmModal.action === "save_need"
                      ? "Save Supply Item"
                      : confirmModal.action === "save_profile"
                      ? "Update Profile"
                      : "Confirm & Restore DB"}
                  </span>
                  </>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPREHENSIVE DETAIL INSPECTION POP-UP CARD */}
      <AnimatePresence>
        {detailModal && detailModal.isOpen && detailModal.data && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl border border-gray-200 space-y-3 max-h-[calc(100vh-2rem)] overflow-y-auto relative"
            >
              {/* Pop-Up Header */}
              <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-brand-sky-950 bg-brand-sky-50 border border-brand-sky-200 px-2.5 py-0.5 rounded-md">
                      {detailModal.data.id}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-sky-800 bg-brand-sky-100/80 px-2 py-0.5 rounded-md">
                      {detailModal.type} RECORD
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-brand-sky-950">
                    {"name" in detailModal.data
                      ? detailModal.data.name
                      : "donorName" in detailModal.data
                      ? detailModal.data.donorName
                      : detailModal.data.fullName}
                  </h3>
                </div>

                <button
                  onClick={() => setDetailModal(null)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CURRENT STATUS READOUT BANNER */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                    Current Application / Record Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                        detailModal.data.status === "accepted" || detailModal.data.status === "approved" || detailModal.data.status === "received" || detailModal.data.status === "completed"
                          ? "bg-green-100 text-green-900 border-green-300"
                          : detailModal.data.status === "reviewed"
                          ? "bg-blue-100 text-blue-900 border-blue-300"
                          : detailModal.data.status === "declined" || detailModal.data.status === "cancelled"
                          ? "bg-red-100 text-red-900 border-red-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{detailModal.data.status?.toUpperCase() || "NEW / PENDING"}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Call / Email Contacts */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {"phone" in detailModal.data && detailModal.data.phone && (
                    <a
                      href={`tel:${detailModal.data.phone}`}
                      className="px-3 py-1.5 bg-white hover:bg-brand-sky-50 text-brand-sky-900 text-xs font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-1 transition-colors"
                      title="Call Phone Number"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-sky-700" />
                      <span>{detailModal.data.phone}</span>
                    </a>
                  )}
                  {"donorPhone" in detailModal.data && detailModal.data.donorPhone && (
                    <a
                      href={`tel:${detailModal.data.donorPhone}`}
                      className="px-3 py-1.5 bg-white hover:bg-brand-sky-50 text-brand-sky-900 text-xs font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-1 transition-colors"
                      title="Call Phone Number"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-sky-700" />
                      <span>{detailModal.data.donorPhone}</span>
                    </a>
                  )}
                  {(detailModal.data as any).email && (
                    <a
                      href={`mailto:${(detailModal.data as any).email}`}
                      className="px-3 py-1.5 bg-white hover:bg-brand-sky-50 text-brand-sky-900 text-xs font-bold rounded-xl border border-gray-200 flex items-center justify-center gap-1 transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5 text-brand-sky-700" />
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>

              {/* ALL DATAS & FIELD SPECIFIC DETAILS */}
              {detailModal.type === "volunteer" && (
                <div className="space-y-3.5 sm:space-y-4">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-brand-sky-950 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-sky-700" />
                    Volunteer Application Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Full Name</span>
                      <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{(detailModal.data as VolunteerApplication).fullName}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Application Date</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as VolunteerApplication).submittedAt}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Interest Area</span>
                      <span className="font-extrabold text-brand-sky-900 uppercase">
                        {(detailModal.data as VolunteerApplication).interestArea}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Availability</span>
                      <span className="font-extrabold text-gray-900">
                        {(detailModal.data as VolunteerApplication).availability}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Phone Number</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as VolunteerApplication).phone}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Email Address</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as VolunteerApplication).email || "Not provided"}</span>
                    </div>
                  </div>

                  {(detailModal.data as VolunteerApplication).experience && (
                    <div className="bg-emerald-50/60 p-3.5 sm:p-4 rounded-2xl border border-emerald-100 text-xs">
                      <span className="text-emerald-950 font-extrabold block mb-1">Experience & Motivation</span>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {(detailModal.data as VolunteerApplication).experience}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {detailModal.type === "booking" && (
                <div className="space-y-3.5 sm:space-y-4">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-brand-sky-950 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-sky-700" />
                    Visit Booking Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Booker Name</span>
                      <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{(detailModal.data as Booking).name}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Booking Date & Time</span>
                      <span className="font-extrabold text-brand-sky-950">
                        {(detailModal.data as Booking).date} at {(detailModal.data as Booking).timeSlot}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Visit Type</span>
                      <span className="font-extrabold text-gray-900 capitalize">{(detailModal.data as Booking).visitType}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Number of Visitors</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as Booking).visitorCount} visitors</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Phone Number</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as Booking).phone}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">Email Address</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as Booking).email || "Not provided"}</span>
                    </div>
                  </div>

                  {(detailModal.data as Booking).notes && (
                    <div className="bg-amber-50/60 p-3.5 sm:p-4 rounded-2xl border border-amber-100 text-xs">
                      <span className="text-amber-900 font-extrabold block mb-1">Special Requirements / Notes</span>
                      <p className="text-gray-700 leading-relaxed font-medium">{(detailModal.data as Booking).notes}</p>
                    </div>
                  )}
                </div>
              )}

              {detailModal.type === "pledge" && (
                <div className="space-y-3.5 sm:space-y-4">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-brand-sky-950 uppercase tracking-wider flex items-center gap-2">
                    <Gift className="w-4 h-4 text-brand-sky-700" />
                    {language === "am" ? "የዓይነት ልገሳ ቃልኪዳን ዝርዝር" : "In-Kind Donation Pledge Details"}
                  </h4>

                  {isPledgeOverdue(detailModal.data as DonationPledge) && (
                    <div className="bg-rose-50 border border-rose-200 p-3 sm:p-3.5 rounded-xl text-xs text-rose-900 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">
                          {language === "am" ? "የቃልኪዳኑ የመድረሻ ጊዜ አልፏል!" : "Pledge Delivery is Overdue!"}
                        </strong>
                        <p className="text-[11px] text-rose-700 mt-0.5">
                          {language === "am"
                            ? `ለጋሹ የተገመተው የመድረሻ ቀን ${(detailModal.data as DonationPledge).estimatedDeliveryDate} ነበር። እባክዎ ለጋሹን በቀጥታ ያግኙ።`
                            : `The donor specified an estimated delivery date of ${(detailModal.data as DonationPledge).estimatedDeliveryDate}. Please follow up to verify arrival.`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">{language === "am" ? "የለጋሽ ስም" : "Donor Name"}</span>
                      <span className="font-extrabold text-gray-900 text-xs sm:text-sm">{(detailModal.data as DonationPledge).donorName}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">{language === "am" ? "ቃል የተገባበት ቀን" : "Pledge Date"}</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as DonationPledge).date}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">{language === "am" ? "የተገመተበት ቀን" : "Est. Delivery Date"}</span>
                      <span className={`font-extrabold ${isPledgeOverdue(detailModal.data as DonationPledge) ? "text-rose-700" : "text-brand-sky-950"}`}>
                        {(detailModal.data as DonationPledge).estimatedDeliveryDate || (language === "am" ? "አልተገለጸም" : "Not specified")}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">{language === "am" ? "ሁኔታ" : "Status"}</span>
                      <span className="font-extrabold text-brand-sky-950 capitalize">
                        {(detailModal.data as DonationPledge).status || "pledged"}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">{language === "am" ? "ስልክ ቁጥር" : "Donor Phone"}</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as DonationPledge).donorPhone || "N/A"}</span>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-0.5">{language === "am" ? "ኢሜይል" : "Donor Email"}</span>
                      <span className="font-extrabold text-gray-900">{(detailModal.data as DonationPledge).donorEmail || "N/A"}</span>
                    </div>
                  </div>

                  {/* Goods List */}
                  <div className="bg-gray-50 p-3.5 sm:p-4 rounded-2xl border border-gray-200 space-y-2">
                    <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider block">
                      {language === "am" ? "የተለገሱ እቃዎች ዝርዝር" : "Pledged Goods & Supplies List"}
                    </span>
                    <div className="space-y-1.5">
                      {(detailModal.data as DonationPledge).pledgedItems?.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200">
                          <span className="font-bold text-gray-900 text-xs">{it.name}</span>
                          <span className="font-black text-brand-sky-900 bg-brand-sky-50 border border-brand-sky-200 px-2.5 py-1 rounded-lg text-xs">
                            {language === "am" ? "ብዛት:" : "Quantity:"} {it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION OPTIONS BUTTONS INSIDE THE POPUP CARD */}
              <div className="bg-brand-sky-950/5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-brand-sky-950/10 space-y-2.5 sm:space-y-3">
                <span className="text-xs font-black text-brand-sky-950 uppercase tracking-wider block">
                  Update Status Options
                </span>

                {/* VOLUNTEER ACTIONS */}
                {detailModal.type === "volunteer" && (
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
                    <button
                      onClick={() =>
                        requestStatusChange(
                          "volunteer",
                          detailModal.data!.id,
                          (detailModal.data as VolunteerApplication).fullName,
                          "accepted",
                          "Accepted"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "accepted"
                          ? "bg-green-700 text-white ring-2 ring-green-400 shadow-md"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{detailModal.data.status === "accepted" ? "✓ Accepted" : "Accept"}</span>
                    </button>

                    <button
                      onClick={() =>
                        requestStatusChange(
                          "volunteer",
                          detailModal.data!.id,
                          (detailModal.data as VolunteerApplication).fullName,
                          "reviewed",
                          "Under Review"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "reviewed"
                          ? "bg-blue-700 text-white ring-2 ring-blue-400 shadow-md"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <Clock3 className="w-4 h-4" />
                      <span>{detailModal.data.status === "reviewed" ? "✓ Under Review" : "Review"}</span>
                    </button>

                    <button
                      onClick={() =>
                        requestStatusChange(
                          "volunteer",
                          detailModal.data!.id,
                          (detailModal.data as VolunteerApplication).fullName,
                          "declined",
                          "Declined"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "declined"
                          ? "bg-red-700 text-white ring-2 ring-red-400 shadow-md"
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{detailModal.data.status === "declined" ? "✓ Declined" : "Decline"}</span>
                    </button>
                  </div>
                )}

                {/* BOOKING ACTIONS */}
                {detailModal.type === "booking" && (
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
                    <button
                      onClick={() =>
                        requestStatusChange(
                          "booking",
                          detailModal.data!.id,
                          (detailModal.data as Booking).name,
                          "approved",
                          "Approved"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "approved"
                          ? "bg-green-700 text-white ring-2 ring-green-400 shadow-md"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{detailModal.data.status === "approved" ? "✓ Approved" : "Approve"}</span>
                    </button>

                    <button
                      onClick={() =>
                        requestStatusChange(
                          "booking",
                          detailModal.data!.id,
                          (detailModal.data as Booking).name,
                          "completed",
                          "Completed"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "completed"
                          ? "bg-brand-sky-950 text-white ring-2 ring-brand-green-400 shadow-md"
                          : "bg-brand-sky-900 hover:bg-brand-sky-800 text-white"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{detailModal.data.status === "completed" ? "✓ Completed" : "Complete"}</span>
                    </button>

                    <button
                      onClick={() =>
                        requestStatusChange(
                          "booking",
                          detailModal.data!.id,
                          (detailModal.data as Booking).name,
                          "cancelled",
                          "Cancelled"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "cancelled"
                          ? "bg-red-700 text-white ring-2 ring-red-400 shadow-md"
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{detailModal.data.status === "cancelled" ? "✓ Cancelled" : "Cancel"}</span>
                    </button>
                  </div>
                )}

                {/* PLEDGE ACTIONS */}
                {detailModal.type === "pledge" && (
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
                    <button
                      onClick={() =>
                        requestStatusChange(
                          "pledge",
                          detailModal.data!.id,
                          (detailModal.data as DonationPledge).donorName,
                          "received",
                          "Received at Shelter"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "received"
                          ? "bg-green-700 text-white ring-2 ring-green-400 shadow-md"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{detailModal.data.status === "received" ? "✓ Received at Shelter" : "Mark Received"}</span>
                    </button>

                    <button
                      onClick={() =>
                        requestStatusChange(
                          "pledge",
                          detailModal.data!.id,
                          (detailModal.data as DonationPledge).donorName,
                          "cancelled",
                          "Cancelled"
                        )
                      }
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        detailModal.data.status === "cancelled"
                          ? "bg-red-700 text-white ring-2 ring-red-400 shadow-md"
                          : "bg-amber-600 hover:bg-amber-700 text-white"
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{detailModal.data.status === "cancelled" ? "✓ Cancelled" : "Cancel Pledge"}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-gray-100">
                <button
                  onClick={() =>
                    requestDelete(
                      detailModal.type,
                      detailModal.data!.id,
                      "name" in detailModal.data!
                        ? detailModal.data!.name
                        : "donorName" in detailModal.data!
                        ? detailModal.data!.donorName
                        : detailModal.data!.fullName
                    )
                  }
                  className="px-3.5 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-red-100 sm:border-none"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Record</span>
                </button>

                <button
                  onClick={() => setDetailModal(null)}
                  className="px-6 py-2.5 bg-brand-sky-400 text-white font-bold text-xs rounded-xl hover:bg-brand-sky-500 transition-colors cursor-pointer shadow-sm text-center"
                >
                  Close Pop-Up
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IN-KIND NEEDED ITEM CREATION / EDITING MODAL */}
      <AnimatePresence>
        {needModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-sky-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-brand-sky-50 rounded-xl text-brand-sky-800">
                    <Package className="w-5 h-5 text-brand-sky-900" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-brand-sky-950">
                      {editingNeedId ? "Edit Needed Item" : "Add New Needed Item"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Configure details displayed on public donation section
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNeedModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNeed} className="space-y-4">
                {/* Validation Error Banner */}
                {needValidationError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-bold flex items-start gap-2">
                    <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{needValidationError}</span>
                  </div>
                )}

                {/* Common Fields: Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 mb-1">
                      Category
                    </label>
                    <select
                      value={needForm.category}
                      onChange={(e) => setNeedForm({ ...needForm, category: e.target.value as InKindItem["category"] })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:border-brand-sky-600 outline-none cursor-pointer"
                    >
                      <option value="Food">Food (ምግብ)</option>
                      <option value="Medical">Medical (ህክምና)</option>
                      <option value="Clothing">Clothing (ልብስና ብርድልብስ)</option>
                      <option value="Hygiene">Hygiene (ንፅህና)</option>
                      <option value="Education">Education (ትምህርት)</option>
                      <option value="Other">Other (ሌላ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-600 mb-1">
                      Urgency Priority
                    </label>
                    <select
                      value={needForm.urgency}
                      onChange={(e) => setNeedForm({ ...needForm, urgency: e.target.value as InKindItem["urgency"] })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:border-brand-sky-600 outline-none cursor-pointer"
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>

                {/* Language Switcher Tab Control */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-700">
                      <Globe className="w-4 h-4 text-brand-sky-800" />
                      <span>Item Details in Dual Languages</span>
                    </div>

                    {/* Language Switch Toggle Pills */}
                    <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setNeedFormLangTab("en")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          needFormLangTab === "en"
                            ? "bg-brand-sky-950 text-white shadow-xs"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <span>English (EN)</span>
                        {(!needForm.nameEn.trim() || !needForm.neededQtyEn.trim() || !needForm.descEn.trim()) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Incomplete" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setNeedFormLangTab("am")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          needFormLangTab === "am"
                            ? "bg-brand-sky-950 text-white shadow-xs"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <span>አማርኛ (AM)</span>
                        {(!needForm.nameAm.trim() || !needForm.neededQtyAm.trim() || !needForm.descAm.trim()) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Incomplete" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ENGLISH FIELDS TAB */}
                  {needFormLangTab === "en" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">
                          Item Name (English) *
                        </label>
                        <input
                          type="text"
                          value={needForm.nameEn}
                          onChange={(e) => {
                            setNeedForm({ ...needForm, nameEn: e.target.value });
                            setNeedValidationError(null);
                          }}
                          placeholder="e.g. Teff & Food Grains"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">
                          Quantity Goal (English) *
                        </label>
                        <input
                          type="text"
                          value={needForm.neededQtyEn}
                          onChange={(e) => {
                            setNeedForm({ ...needForm, neededQtyEn: e.target.value });
                            setNeedValidationError(null);
                          }}
                          placeholder="e.g. 50 Sacks of Teff"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">
                          Description (English) *
                        </label>
                        <textarea
                          rows={3}
                          value={needForm.descEn}
                          onChange={(e) => {
                            setNeedForm({ ...needForm, descEn: e.target.value });
                            setNeedValidationError(null);
                          }}
                          placeholder="Brief description of why this supply is needed..."
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* AMHARIC FIELDS TAB */}
                  {needFormLangTab === "am" && (
                    <div className="space-y-3 animate-fadeIn">
                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">
                          Item Name (Amharic / አማርኛ) *
                        </label>
                        <input
                          type="text"
                          value={needForm.nameAm}
                          onChange={(e) => {
                            setNeedForm({ ...needForm, nameAm: e.target.value });
                            setNeedValidationError(null);
                          }}
                          placeholder="ምሳሌ: ጤፍና የእህል እቃዎች"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">
                          Quantity Goal (Amharic / አማርኛ) *
                        </label>
                        <input
                          type="text"
                          value={needForm.neededQtyAm}
                          onChange={(e) => {
                            setNeedForm({ ...needForm, neededQtyAm: e.target.value });
                            setNeedValidationError(null);
                          }}
                          placeholder="ምሳሌ: 50 ጆንያ ጤፍ"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-gray-700 uppercase mb-1">
                          Description (Amharic / አማርኛ) *
                        </label>
                        <textarea
                          rows={3}
                          value={needForm.descAm}
                          onChange={(e) => {
                            setNeedForm({ ...needForm, descAm: e.target.value });
                            setNeedValidationError(null);
                          }}
                          placeholder="የእቃው ዝርዝር ገለፃ በአማርኛ..."
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-brand-sky-600 outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setNeedModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-sky-400 hover:bg-brand-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Save className="w-4 h-4 text-brand-yellow-400" />
                    <span>Save Item</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
