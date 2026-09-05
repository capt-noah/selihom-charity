import { Booking, DonationPledge, VolunteerApplication, AdminProfile, InKindItem } from "../types";

// ─── helpers ────────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
  });
  if (!res.ok) {
    throw new Error(`API ${options?.method ?? "GET"} ${path} failed: ${res.status}`);
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
  excerpt: { en: string; am: string };
  body: { en: string; am: string };
  category: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
}

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
