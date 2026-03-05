/**
 * ──────────────────────────────────────────────
 *  DEV-ONLY mock data for frontend UI testing.
 *  Used exclusively by the "Dev Quick Login"
 *  buttons (import.meta.env.DEV guard).
 *  Does NOT touch any backend or database.
 * ──────────────────────────────────────────────
 */

// ── Users ────────────────────────────────────
export const DEV_USERS = {
  Patient: {
    id: 901,
    name: "Dev Patient",
    fullName: "Sarah Johnson",
    email: "patient@test.com",
    phone: "+60 12-345 6789",
    dateOfBirth: "1995-06-15",
    gender: "Female",
    role: "Patient",
    address: "12, Jalan Bukit Bintang, 55100 Kuala Lumpur",
  },
  Doctor: {
    id: 902,
    name: "Dev Doctor",
    fullName: "Dr. Ahmad Razak",
    email: "doctor@test.com",
    phone: "+60 11-222 3344",
    dateOfBirth: "1980-03-22",
    gender: "Male",
    role: "Doctor",
    specialty: "General Practice",
    consultationFee: 85,
    experience: "15 years",
    description:
      "Experienced general practitioner specialising in preventive medicine and chronic disease management.",
    rating: 4.9,
    reviewCount: 214,
    isAvailable: true,
  },
  Admin: {
    id: 903,
    name: "Dev Admin",
    fullName: "Admin Mei Ling",
    email: "admin@test.com",
    role: "Admin",
  },
};

// ── Doctors ──────────────────────────────────
export const MOCK_DOCTORS = [
  {
    id: 1,
    fullName: "Dr. Ahmad Razak",
    specialty: "General Practice",
    rating: 4.9,
    reviewCount: 214,
    consultationFee: 85,
    description:
      "Experienced general practitioner specialising in preventive medicine and chronic disease management. Fluent in Malay, English and Mandarin.",
    isAvailable: true,
    experience: "15 years",
    profileImageUrl: null,
  },
  {
    id: 2,
    fullName: "Dr. Emily Wong",
    specialty: "Pediatrics",
    rating: 4.8,
    reviewCount: 187,
    consultationFee: 120,
    description:
      "Paediatric specialist with a gentle approach to child healthcare. Special interest in childhood asthma and allergies.",
    isAvailable: true,
    experience: "12 years",
    profileImageUrl: null,
  },
  {
    id: 3,
    fullName: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 200,
    description:
      "Board-certified cardiologist with expertise in interventional cardiology, heart failure management and cardiac imaging.",
    isAvailable: true,
    experience: "20 years",
    profileImageUrl: null,
  },
  {
    id: 4,
    fullName: "Dr. Siti Aminah",
    specialty: "Dermatology",
    rating: 4.7,
    reviewCount: 156,
    consultationFee: 150,
    description:
      "Dermatology specialist focusing on acne treatment, skin cancer screening and cosmetic dermatology procedures.",
    isAvailable: true,
    experience: "10 years",
    profileImageUrl: null,
  },
  {
    id: 5,
    fullName: "Dr. Jason Lim",
    specialty: "Orthopedics",
    rating: 4.8,
    reviewCount: 203,
    consultationFee: 180,
    description:
      "Orthopaedic surgeon specialising in sports injuries, joint replacement and minimally invasive spine surgery.",
    isAvailable: false,
    experience: "18 years",
    profileImageUrl: null,
  },
  {
    id: 6,
    fullName: "Dr. Priya Nair",
    specialty: "Neurology",
    rating: 4.6,
    reviewCount: 98,
    consultationFee: 190,
    description:
      "Neurologist with special interest in headache disorders, epilepsy management and neurodegenerative diseases.",
    isAvailable: true,
    experience: "8 years",
    profileImageUrl: null,
  },
];

// ── Appointments ─────────────────────────────
export const MOCK_APPOINTMENTS = [
  {
    id: 1,
    doctor: "Dr. Ahmad Razak",
    patient: "Sarah Johnson",
    specialty: "General Practice",
    date: "2026-03-10",
    time: "09:00 AM",
    status: "Pending",
    notes: "Annual health check-up",
  },
  {
    id: 2,
    doctor: "Dr. Emily Wong",
    patient: "Sarah Johnson",
    specialty: "Pediatrics",
    date: "2026-03-12",
    time: "10:30 AM",
    status: "Pending",
    notes: "Child vaccination follow-up",
  },
  {
    id: 3,
    doctor: "Dr. Rajesh Kumar",
    patient: "Sarah Johnson",
    specialty: "Cardiology",
    date: "2026-03-08",
    time: "02:00 PM",
    status: "Confirmed",
    notes: "Heart palpitation consultation",
  },
  {
    id: 4,
    doctor: "Dr. Siti Aminah",
    patient: "Sarah Johnson",
    specialty: "Dermatology",
    date: "2026-03-09",
    time: "11:00 AM",
    status: "Confirmed",
    notes: "Skin rash examination",
  },
  {
    id: 5,
    doctor: "Dr. Ahmad Razak",
    patient: "Sarah Johnson",
    specialty: "General Practice",
    date: "2026-02-20",
    time: "09:30 AM",
    status: "Completed",
    notes: "Flu symptoms — prescribed antibiotics",
    doctorNotes:
      "Patient presented with mild fever and sore throat. Prescribed amoxicillin 500mg.",
  },
  {
    id: 6,
    doctor: "Dr. Priya Nair",
    patient: "Sarah Johnson",
    specialty: "Neurology",
    date: "2026-02-15",
    time: "03:00 PM",
    status: "Completed",
    notes: "Recurring headache evaluation",
    doctorNotes:
      "MRI results normal. Likely tension headaches — advised stress management.",
  },
  {
    id: 7,
    doctor: "Dr. Jason Lim",
    patient: "Sarah Johnson",
    specialty: "Orthopedics",
    date: "2026-02-10",
    time: "10:00 AM",
    status: "Cancelled",
    notes: "Knee pain follow-up",
  },
  {
    id: 8,
    doctor: "Dr. Emily Wong",
    patient: "Sarah Johnson",
    specialty: "Pediatrics",
    date: "2026-01-25",
    time: "04:00 PM",
    status: "Cancelled",
    notes: "Scheduled check-up — rescheduled",
  },
];

// Doctor-view appointments (patients coming to them)
export const MOCK_DOCTOR_APPOINTMENTS = [
  {
    id: 101,
    doctor: "Dr. Ahmad Razak",
    patient: "Alice Tan",
    specialty: "General Practice",
    date: "2026-03-10",
    time: "09:00 AM",
    status: "Pending",
    notes: "Persistent cough for two weeks",
  },
  {
    id: 102,
    doctor: "Dr. Ahmad Razak",
    patient: "Mike Ross",
    specialty: "General Practice",
    date: "2026-03-10",
    time: "10:30 AM",
    status: "Confirmed",
    notes: "Blood pressure monitoring",
  },
  {
    id: 103,
    doctor: "Dr. Ahmad Razak",
    patient: "Wei Liang Chen",
    specialty: "General Practice",
    date: "2026-03-11",
    time: "02:00 PM",
    status: "Pending",
    notes: "Stomach discomfort and nausea",
  },
  {
    id: 104,
    doctor: "Dr. Ahmad Razak",
    patient: "Nurul Huda",
    specialty: "General Practice",
    date: "2026-02-28",
    time: "11:00 AM",
    status: "Completed",
    notes: "Diabetic check-up",
    doctorNotes: "HbA1c at 6.8%. Adjusted metformin dosage. Good progress.",
  },
  {
    id: 105,
    doctor: "Dr. Ahmad Razak",
    patient: "Jane Doe",
    specialty: "General Practice",
    date: "2026-02-25",
    time: "03:30 PM",
    status: "Completed",
    notes: "Allergy consultation",
    doctorNotes:
      "Prescribed antihistamines. Referred to allergy specialist if symptoms persist.",
  },
  {
    id: 106,
    doctor: "Dr. Ahmad Razak",
    patient: "Arjun Patel",
    specialty: "General Practice",
    date: "2026-02-20",
    time: "09:00 AM",
    status: "Cancelled",
    notes: "Routine check-up — patient no-show",
  },
];

// ── Medical Reports ──────────────────────────
export const MOCK_REPORTS = [
  {
    id: 1,
    fileName: "Blood_Test_Results_Feb2026.pdf",
    fileType: "application/pdf",
    fileSize: 245760,
    uploadedAt: "2026-02-20T10:30:00Z",
    fileUrl: "#",
    description: "Complete blood count and metabolic panel",
  },
  {
    id: 2,
    fileName: "Chest_Xray_Report.pdf",
    fileType: "application/pdf",
    fileSize: 1048576,
    uploadedAt: "2026-02-15T14:20:00Z",
    fileUrl: "#",
    description: "Chest X-ray — no abnormalities detected",
  },
  {
    id: 3,
    fileName: "MRI_Brain_Scan.jpg",
    fileType: "image/jpeg",
    fileSize: 3145728,
    uploadedAt: "2026-02-15T16:00:00Z",
    fileUrl: "#",
    description: "MRI brain scan — normal findings",
  },
  {
    id: 4,
    fileName: "Prescription_Amoxicillin.pdf",
    fileType: "application/pdf",
    fileSize: 102400,
    uploadedAt: "2026-02-20T11:00:00Z",
    fileUrl: "#",
    description: "Prescription for amoxicillin 500mg",
  },
];

// ── Time Slots ───────────────────────────────
export const MOCK_TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];
