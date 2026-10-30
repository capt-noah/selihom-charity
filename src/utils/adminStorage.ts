import { Booking, DonationPledge, VolunteerApplication, AdminProfile, InKindItem, BankAccount } from "../types";

// ─── helpers ────────────────────────────────────────────────────────────────
export const getApiUrl = (endpoint: string): string => {
  const isNested = window.location.pathname.startsWith("/selihom");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return isNested ? `/selihom${cleanEndpoint}` : cleanEndpoint;
};

export const resolveImagePath = (path: string | undefined | null): string => {
  if (!path) return "";
  // If already absolute or blob/data url, return as is
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  const isNested = window.location.pathname.startsWith("/selihom");
  if (isNested) {
    if (path.startsWith("/selihom/")) return path;
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `/selihom${clean}`;
  }
  return path.startsWith("/") ? path : `/${path}`;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const fullUrl = getApiUrl(path);
  const res = await fetch(fullUrl, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    throw new Error(`API ${options?.method ?? "GET"} ${fullUrl} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// No-op kept for legacy callers
export const syncWithServer = async (): Promise<void> => {};

// ─── ADMIN PROFILE ───────────────────────────────────────────────────────────

export const getAdminProfile = async (): Promise<AdminProfile | null> => {
  try {
    return await apiFetch<AdminProfile>("/api/admin_profile");
  } catch {
    return null;
  }
};

export const saveAdminProfile = async (profile: AdminProfile): Promise<AdminProfile> => {
  return apiFetch<AdminProfile>("/api/admin_profile", {
    method: "POST",
    body: JSON.stringify(profile),
  });
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────

export const getBookings = async (): Promise<Booking[]> => {
  return apiFetch<Booking[]>("/api/bookings");
};

export const saveBooking = async (booking: Booking): Promise<Booking[]> => {
  return apiFetch<Booking[]>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(booking),
  });
};

export const updateBookingStatus = async (
  id: string,
  status: Booking["status"]
): Promise<Booking[]> => {
  return apiFetch<Booking[]>(`/api/bookings/${encodeURIComponent(id)}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const deleteBooking = async (id: string): Promise<Booking[]> => {
  return apiFetch<Booking[]>(`/api/bookings/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ─── PLEDGES ─────────────────────────────────────────────────────────────────

export const getPledges = async (): Promise<DonationPledge[]> => {
  return apiFetch<DonationPledge[]>("/api/pledges");
};

export const savePledge = async (pledge: DonationPledge): Promise<DonationPledge[]> => {
  return apiFetch<DonationPledge[]>("/api/pledges", {
    method: "POST",
    body: JSON.stringify(pledge),
  });
};

export const updatePledgeStatus = async (
  id: string,
  status: DonationPledge["status"]
): Promise<DonationPledge[]> => {
  return apiFetch<DonationPledge[]>(`/api/pledges/${encodeURIComponent(id)}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

export const deletePledge = async (id: string): Promise<DonationPledge[]> => {
  return apiFetch<DonationPledge[]>(`/api/pledges/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

// ─── VOLUNTEERS ──────────────────────────────────────────────────────────────

export const getVolunteers = async (): Promise<VolunteerApplication[]> => {
  return apiFetch<VolunteerApplication[]>("/api/volunteers");
};

export const saveVolunteer = async (
  volunteer: VolunteerApplication
): Promise<VolunteerApplication[]> => {
  return apiFetch<VolunteerApplication[]>("/api/volunteers", {
    method: "POST",
    body: JSON.stringify(volunteer),
  });
};

export const updateVolunteerStatus = async (
  id: string,
  status: VolunteerApplication["status"]
): Promise<VolunteerApplication[]> => {
  return apiFetch<VolunteerApplication[]>(
    `/api/volunteers/${encodeURIComponent(id)}/status`,
    { method: "PUT", body: JSON.stringify({ status }) }
  );
};

export const deleteVolunteer = async (id: string): Promise<VolunteerApplication[]> => {
  return apiFetch<VolunteerApplication[]>(
    `/api/volunteers/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
};

// ─── IN-KIND NEEDED ITEMS ────────────────────────────────────────────────────

export const getInKindNeeds = async (): Promise<InKindItem[]> => {
  return apiFetch<InKindItem[]>("/api/inkind_needs");
};

export const saveInKindNeed = async (item: InKindItem): Promise<InKindItem[]> => {
  return apiFetch<InKindItem[]>("/api/inkind_needs", {
    method: "POST",
    body: JSON.stringify(item),
  });
};

export const deleteInKindNeed = async (id: string): Promise<InKindItem[]> => {
  return apiFetch<InKindItem[]>(
    `/api/inkind_needs/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );
};

export const resetInKindNeeds = async (): Promise<InKindItem[]> => {
  return apiFetch<InKindItem[]>("/api/inkind_needs/reset", { method: "POST" });
};

// ─── IMPORT / EXPORT ─────────────────────────────────────────────────────────

export const exportDataAsJSON = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importDatabaseJSON = async (jsonData: any): Promise<boolean> => {
  try {
    await apiFetch<any>("/api/db", {
      method: "POST",
      body: JSON.stringify(jsonData),
    });
    return true;
  } catch {
    return false;
  }
};

// ─── AVAILABILITY SLOTS ───────────────────────────────────────────────────────

export interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  label: string;
  maxBookings: number;
  currentBookings: number;
  isActive: boolean;
}

export const getAvailabilitySlots = async (): Promise<AvailabilitySlot[]> =>
  apiFetch<AvailabilitySlot[]>("/api/availability_slots");

export const getAvailableSlots = async (): Promise<AvailabilitySlot[]> =>
  apiFetch<AvailabilitySlot[]>("/api/availability_slots/available");

export const saveAvailabilitySlot = async (slot: AvailabilitySlot): Promise<AvailabilitySlot[]> =>
  apiFetch<AvailabilitySlot[]>("/api/availability_slots", { method: "POST", body: JSON.stringify(slot) });

export const updateAvailabilitySlot = async (id: string, slot: Partial<AvailabilitySlot>): Promise<AvailabilitySlot[]> =>
  apiFetch<AvailabilitySlot[]>(`/api/availability_slots/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(slot) });

export const deleteAvailabilitySlot = async (id: string): Promise<AvailabilitySlot[]> =>
  apiFetch<AvailabilitySlot[]>(`/api/availability_slots/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── MEDICINE ITEMS ───────────────────────────────────────────────────────────

export interface MedicineItem {
  id: string;
  name: string;
  monthlyQty: number;
  unitPrice: number;
  totalMonthly: number;
  patientsHelped: number;
  urgency: "High" | "Medium" | "Low";
  description: { en: string; am: string };
}

export const getMedicineItems = async (): Promise<MedicineItem[]> =>
  apiFetch<MedicineItem[]>("/api/medicine_items");

export const saveMedicineItem = async (item: MedicineItem): Promise<MedicineItem[]> =>
  apiFetch<MedicineItem[]>("/api/medicine_items", { method: "POST", body: JSON.stringify(item) });

export const deleteMedicineItem = async (id: string): Promise<MedicineItem[]> =>
  apiFetch<MedicineItem[]>(`/api/medicine_items/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── MEDICINE PLEDGES ─────────────────────────────────────────────────────────

export interface MedicinePledge {
  id: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  items: { medicineId: string; medicineName: string; quantity: number }[];
  date: string;
  estimatedDeliveryDate?: string;
  status: "pledged" | "received" | "cancelled";
  notes: string;
}

export const getMedicinePledges = async (): Promise<MedicinePledge[]> =>
  apiFetch<MedicinePledge[]>("/api/medicine_pledges");

export const saveMedicinePledge = async (pledge: MedicinePledge): Promise<MedicinePledge[]> =>
  apiFetch<MedicinePledge[]>("/api/medicine_pledges", { method: "POST", body: JSON.stringify(pledge) });

export const updateMedicinePledgeStatus = async (id: string, status: MedicinePledge["status"]): Promise<MedicinePledge[]> =>
  apiFetch<MedicinePledge[]>(`/api/medicine_pledges/${encodeURIComponent(id)}/status`, { method: "PUT", body: JSON.stringify({ status }) });

export const deleteMedicinePledge = async (id: string): Promise<MedicinePledge[]> =>
  apiFetch<MedicinePledge[]>(`/api/medicine_pledges/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── SUPPLY CATEGORIES ───────────────────────────────────────────────────────

export interface SupplyItem {
  id: string;
  name: { en: string; am: string };
  neededQty: { en: string; am: string };
  urgency: "High" | "Medium" | "Low";
  impactDesc: { en: string; am: string };
}

export interface SupplyCategory {
  id: string;
  name: { en: string; am: string };
  icon: string;
  color: string;
  items: SupplyItem[];
}

export const getSupplyCategories = async (): Promise<SupplyCategory[]> =>
  apiFetch<SupplyCategory[]>("/api/supply_categories");

export const saveSupplyCategory = async (cat: SupplyCategory): Promise<SupplyCategory[]> =>
  apiFetch<SupplyCategory[]>("/api/supply_categories", { method: "POST", body: JSON.stringify(cat) });

export const deleteSupplyCategory = async (id: string): Promise<SupplyCategory[]> =>
  apiFetch<SupplyCategory[]>(`/api/supply_categories/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── SUPPLIES PLEDGES ─────────────────────────────────────────────────────────

export interface SuppliesPledge {
  id: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  categoryId: string;
  items: { itemId: string; itemName: string; quantity: number; custom: string }[];
  date: string;
  estimatedDeliveryDate?: string;
  status: "pledged" | "received" | "cancelled";
  notes: string;
}

export const getSuppliesPledges = async (): Promise<SuppliesPledge[]> =>
  apiFetch<SuppliesPledge[]>("/api/supplies_pledges");

export const saveSuppliesPledge = async (pledge: SuppliesPledge): Promise<SuppliesPledge[]> =>
  apiFetch<SuppliesPledge[]>("/api/supplies_pledges", { method: "POST", body: JSON.stringify(pledge) });

export const updateSuppliesPledgeStatus = async (id: string, status: SuppliesPledge["status"]): Promise<SuppliesPledge[]> =>
  apiFetch<SuppliesPledge[]>(`/api/supplies_pledges/${encodeURIComponent(id)}/status`, { method: "PUT", body: JSON.stringify({ status }) });

export const deleteSuppliesPledge = async (id: string): Promise<SuppliesPledge[]> =>
  apiFetch<SuppliesPledge[]>(`/api/supplies_pledges/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── EVENT PLEDGES ────────────────────────────────────────────────────────────

export interface EventPledge {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: "birthday" | "wedding" | "anniversary" | "other";
  customType: string;
  preferredDate: string;
  message: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  submittedAt: string;
}

export const getEventPledges = async (): Promise<EventPledge[]> =>
  apiFetch<EventPledge[]>("/api/event_pledges");

export const saveEventPledge = async (pledge: EventPledge): Promise<EventPledge[]> =>
  apiFetch<EventPledge[]>("/api/event_pledges", { method: "POST", body: JSON.stringify(pledge) });

export const updateEventPledgeStatus = async (id: string, status: EventPledge["status"]): Promise<EventPledge[]> =>
  apiFetch<EventPledge[]>(`/api/event_pledges/${encodeURIComponent(id)}/status`, { method: "PUT", body: JSON.stringify({ status }) });

export const deleteEventPledge = async (id: string): Promise<EventPledge[]> =>
  apiFetch<EventPledge[]>(`/api/event_pledges/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── VOLUNTEER ROLES ──────────────────────────────────────────────────────────

export interface VolunteerRole {
  id: string;
  name: { en: string; am: string };
  description: { en: string; am: string };
}

export interface VolunteerCategory {
  id: string;
  name: { en: string; am: string };
  icon: string;
  color: string;
  roles: VolunteerRole[];
}

export const getVolunteerRoles = async (): Promise<VolunteerCategory[]> =>
  apiFetch<VolunteerCategory[]>("/api/volunteer_roles");

export const saveVolunteerCategory = async (cat: VolunteerCategory): Promise<VolunteerCategory[]> =>
  apiFetch<VolunteerCategory[]>("/api/volunteer_roles", { method: "POST", body: JSON.stringify(cat) });

export const deleteVolunteerCategory = async (id: string): Promise<VolunteerCategory[]> =>
  apiFetch<VolunteerCategory[]>(`/api/volunteer_roles/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── NEWS ─────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  slug: string;
  title: { en: string; am: string };
  excerpt?: { en: string; am: string };
  body: { en: string; am: string };
  category: string;
  coverImage: string;
  imagePaths?: string[];
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

export const uploadImageFile = async (file: File): Promise<string> => {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const res = await apiFetch<{ url?: string; path?: string }>("/api/upload", {
    method: "POST",
    body: JSON.stringify({ filename: file.name, data: base64 }),
  });
  return res.url || res.path || "";
};

export const uploadImageFiles = async (files: File[]): Promise<string[]> => {
  const payload = await Promise.all(
    files.map(async (f) => {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(f);
      });
      return { filename: f.name, data };
    })
  );
  const res = await apiFetch<{ urls: string[] }>("/api/upload", {
    method: "POST",
    body: JSON.stringify({ files: payload }),
  });
  return res.urls || [];
};

export const getNews = async (all = false): Promise<NewsArticle[]> =>
  apiFetch<NewsArticle[]>(`/api/news${all ? "?all=true" : ""}`);

export const getArticle = async (slug: string): Promise<NewsArticle> =>
  apiFetch<NewsArticle>(`/api/news/${encodeURIComponent(slug)}`);

export const saveArticle = async (article: NewsArticle): Promise<NewsArticle> =>
  apiFetch<NewsArticle>("/api/news", { method: "POST", body: JSON.stringify(article) });

export const publishArticle = async (id: string, isPublished: boolean): Promise<NewsArticle[]> =>
  apiFetch<NewsArticle[]>(`/api/news/${encodeURIComponent(id)}/publish`, { method: "PUT", body: JSON.stringify({ isPublished }) });

export const deleteArticle = async (id: string): Promise<NewsArticle[]> =>
  apiFetch<NewsArticle[]>(`/api/news/${encodeURIComponent(id)}`, { method: "DELETE" });

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export type { BankAccount } from "../types";

export interface SiteSettings {
  bankAccounts: BankAccount[];
  social: {
    telegram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    instagram?: string;
    linkedin?: string;
  };
  contact: {
    phones: string[];
    email: string;
    address: {
      en: string;
      am: string;
    };
  };
  registration?: {
    agency?: { en: string; am: string };
    date?: string;
    number?: string;
  };
  motto?: {
    en: string;
    am: string;
  };
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  bankAccounts: [
    {
      bank: { am: "የኢትዮጵያ ንግድ ባንክ", en: "Commercial Bank of Ethiopia (CBE)" },
      accountNumber: "1000275107518",
      accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
    },
    {
      bank: { am: "አቢሲንያ ባንክ", en: "Bank of Abyssinia" },
      accountNumber: "77984852",
      accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
    },
    {
      bank: { am: "አዋሽ ባንክ", en: "Awash Bank" },
      accountNumber: "01303572131300",
      accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
    },
    {
      bank: { am: "ቡና ባንክ", en: "Bunna Bank" },
      accountNumber: "2919601000145",
      accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
    },
    {
      bank: { am: "ስንቄ ባንክ", en: "Sinquee Bank" },
      accountNumber: "1106177681225",
      accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር",
    },
    {
      bank: { am: "ቴሌብር (ሞባይል ገንዘብ)", en: "Telebirr (Mobile Money)" },
      accountNumber: "0911004903",
      accountName: "ሰሊሆም የአዕምሮ ህሙማን መርጃ ማህበር (ሚኪያስ ለገሰ)",
    },
  ],
  social: {
    telegram: "https://t.me/Selihommentallyill",
    facebook: "https://facebook.com/SelihomSupport",
    tiktok: "https://tiktok.com/@selihomcharity",
    youtube: "https://youtube.com/@selihomcharity",
    instagram: "",
    linkedin: "",
  },
  contact: {
    phones: ["+251911004903", "+251953905050", "0118195444", "0904440157"],
    email: "selihomc@gmail.com",
    address: {
      am: "ከእንጦጦ ቅዱስ ራጉኤል ወኤልያስ ቤተክርስቲያን ወደ ፍተሻ በሚወስደው መንገድ 300 ሜትር ዝቅ ብሎ፣ አዲስ አበባ",
      en: "Near Entoto St. Raguel & Elias Church, 300 meters down on the road towards Fetesha, Addis Ababa, Ethiopia",
    },
  },
  registration: {
    number: "1113/2019",
    date: "30/02/2011 ዓ.ም (Oct 30, 2018)",
    agency: {
      am: "የኢትዮጵያ ፌደራላዊ ዲሞክራሲያዊ ሪፐብሊክ የሲቪል ማህበረሰብ ድርጅቶች ኤጀንሲ",
      en: "Federal Democratic Republic of Ethiopia Agency for Civil Society Organizations",
    },
  },
  motto: {
    am: "ደግ ልቦች ከውብ ፊቶች ይበልጣሉ!",
    en: "Kind hearts excel beautiful faces!",
  },
};

const SETTINGS_STORAGE_KEY = "selihom_site_settings";

export const getBankAccounts = async (): Promise<BankAccount[]> => {
  try {
    return await apiFetch<BankAccount[]>("/api/bank_accounts");
  } catch {
    const s = await getSiteSettings();
    return s.bankAccounts || DEFAULT_SITE_SETTINGS.bankAccounts;
  }
};

export const saveBankAccount = async (account: BankAccount): Promise<BankAccount[]> => {
  return apiFetch<BankAccount[]>("/api/bank_accounts", {
    method: "POST",
    body: JSON.stringify(account),
  });
};

export const deleteBankAccount = async (id: string): Promise<BankAccount[]> => {
  return apiFetch<BankAccount[]>(`/api/bank_accounts/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const res = await apiFetch<SiteSettings>("/api/settings");
    if (res && res.bankAccounts && Array.isArray(res.bankAccounts)) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(res));
      return res;
    }
  } catch {
    // API not responding or offline
  }

  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // JSON parse fallback
    }
  }
  return DEFAULT_SITE_SETTINGS;
};

export const saveSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  try {
    const res = await apiFetch<SiteSettings>("/api/settings", {
      method: "POST",
      body: JSON.stringify(settings),
    });
    return res;
  } catch {
    return settings;
  }
};

export const resetSiteSettings = async (): Promise<SiteSettings> => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
  try {
    const res = await apiFetch<SiteSettings>("/api/settings/reset", {
      method: "POST",
    });
    return res;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
};
