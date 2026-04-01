// ── API ───────────────────────────────────────────────────────────────────────
export const CHAT_API = import.meta.env.VITE_CHAT_API_URL;

// ── Messages ──────────────────────────────────────────────────────────────────
export const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm MediBook's AI health assistant.\nI can help with health questions, finding doctors, or booking appointments. What can I do for you?",
  quickReplies: [
    { label: "Book an Appointment", action: "BOOK_APPOINTMENT" },
    { label: "Ask a Health Question", action: "ASK_QUESTION" },
    { label: "My Appointments", action: "NAVIGATE", value: "/appointments" },
    { label: "Emergency Help", action: "FIND_EMERGENCY" },
  ],
};

// ── Booking ───────────────────────────────────────────────────────────────────
export const INITIAL_BOOKING = {
  step: "idle",
  specialty: null,
  doctor: null,
  date: null,
  slot: null,
  activeCardId: null,
};

export const CANCEL_QR = [{ label: "✕ Cancel", action: "CANCEL_BOOKING" }];

// ── Specialty metadata ────────────────────────────────────────────────────────
import { Heart, Stethoscope, Sparkles, Bone, Baby, Brain } from "lucide-react";

export const SPECIALTY_ICONS = {
  Cardiology: Heart,
  "General Practice": Stethoscope,
  Dermatology: Sparkles,
  Orthopedics: Bone,
  Pediatrics: Baby,
  Neurology: Brain,
};

export const SPECIALTY_COLORS = {
  Cardiology: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
  "General Practice":
    "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
  Dermatology: "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100",
  Orthopedics: "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100",
  Pediatrics:
    "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
  Neurology: "bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100",
};

export const DEFAULT_SPECIALTY_COLOR =
  "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100";
