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
