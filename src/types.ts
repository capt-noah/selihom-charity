export type Language = "en" | "am";

export interface BilingualText {
  en: string;
  am: string;
}

export interface Initiative {
  id: string;
  title: BilingualText;
  description: BilingualText;
  goal: number;
  raised: number;
  image?: string;
  tags: { en: string[]; am: string[] };
  icon: string; // Lucide icon name
}

export interface ProgramItem {
  id: string;
  title: BilingualText;
  description: BilingualText;
  icon: string;
  image: string;
}

export interface TransformationStory {
  id: string;
  name: BilingualText;
  age?: number;
  storyBefore: BilingualText;
  storyAfter: BilingualText;
  image: string;
  status: BilingualText;
  imagePosition?: string;
}

export interface ValueItem {
  id: string;
  title: BilingualText;
  description?: BilingualText;
}

export interface StatisticItem {
  label: BilingualText;
  value: number;
  icon?: string;
  unit?: string;
}

export interface BankAccount {
  bank: BilingualText;
  accountNumber: string;
  accountName?: string;
  logo?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: BilingualText;
  quote: BilingualText;
  avatar: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  visitType: "individual" | "group" | "corporate" | "school" | "volunteer";
  visitorCount: number;
  notes?: string;
  status: "pending" | "approved" | "completed" | "cancelled";
  createdAt: string;
}

export interface InKindItem {
  id: string;
  name: BilingualText;
  category: "Food" | "Clothing" | "Education" | "Medical" | "Hygiene" | "Other";
  neededQuantity: BilingualText;
  urgency: "High" | "Medium" | "Low";
  description: BilingualText;
}

export interface DonationPledge {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  type: "money" | "inkind";
  amount?: number;
  bankSelected?: string;
  paymentMethod?: string;
  pledgedItems?: { itemId: string; name: string; quantity: number }[];
  date: string;
  estimatedDeliveryDate?: string;
  status: "pledged" | "received" | "cancelled";
  adminNotes?: string;
}

export interface VolunteerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  availability: "weekdays" | "weekends" | "flexible";
  interestArea: "kitchen" | "medical" | "education" | "psychiatry" | "general";
  experience?: string;
  status: "new" | "reviewed" | "accepted" | "declined";
  submittedAt: string;
  adminNotes?: string;
}

export interface EventItem {
  id: string;
  title: BilingualText;
  category: "fundraising" | "upcoming";
  date: BilingualText;
  time?: BilingualText;
  location: BilingualText;
  description: BilingualText;
  goalAmount?: number;
  raisedAmount?: number;
  image?: string;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  title: BilingualText;
  category: "mental-health" | "children" | "elderly" | "kitchen" | "volunteers";
  url: string;
  thumbnail?: string;
  description?: BilingualText;
  imagePosition?: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  role: string;
  phone: string;
  username: string;
  passwordHash: string;
}

