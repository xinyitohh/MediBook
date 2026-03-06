// DEV ONLY — mock data for testing without backend

export const mockAppointments = {
  Patient: [
    { id: 101, doctor: "Dr. Sarah Lee", patient: "Dev Patient", specialty: "Cardiology", date: "2026-03-10", time: "09:00 AM", status: "Confirmed", notes: "Routine checkup" },
    { id: 102, doctor: "Dr. James Tan", patient: "Dev Patient", specialty: "Dermatology", date: "2026-02-20", time: "02:30 PM", status: "Completed", notes: "Skin rash follow-up" },
    { id: 103, doctor: "Dr. Aisha Rahman", patient: "Dev Patient", specialty: "General Practice", date: "2026-03-18", time: "11:00 AM", status: "Pending", notes: "" },
    { id: 104, doctor: "Dr. Kevin Wong", patient: "Dev Patient", specialty: "Orthopedics", date: "2026-01-15", time: "10:00 AM", status: "Cancelled", notes: "Knee pain" },
  ],
  Doctor: [
    { id: 201, doctor: "Dev Doctor", patient: "Ahmad Faris", specialty: "General Practice", date: "2026-03-05", time: "08:30 AM", status: "Completed", notes: "Fever, cough" },
    { id: 202, doctor: "Dev Doctor", patient: "Nurul Aina", specialty: "General Practice", date: "2026-03-06", time: "10:00 AM", status: "Completed", notes: "Hypertension follow-up" },
    { id: 203, doctor: "Dev Doctor", patient: "Lim Wei Jian", specialty: "General Practice", date: "2026-03-07", time: "11:30 AM", status: "Confirmed", notes: "Annual checkup" },
    { id: 204, doctor: "Dev Doctor", patient: "Priya Nair", specialty: "General Practice", date: "2026-03-08", time: "02:00 PM", status: "Pending", notes: "" },
  ],
  Admin: [
    { id: 301, doctor: "Dr. Sarah Lee", patient: "Ahmad Faris", specialty: "Cardiology", date: "2026-03-01", time: "09:00 AM", status: "Completed", notes: "" },
    { id: 302, doctor: "Dr. James Tan", patient: "Nurul Aina", specialty: "Dermatology", date: "2026-03-03", time: "03:00 PM", status: "Confirmed", notes: "" },
    { id: 303, doctor: "Dr. Aisha Rahman", patient: "Lim Wei Jian", specialty: "General Practice", date: "2026-03-05", time: "10:30 AM", status: "Pending", notes: "" },
  ],
};

export const mockReports = [
  { id: 1, fileName: "Blood_Test_Results.pdf", fileType: "application/pdf", fileSize: 204800, uploadedAt: "2026-02-10T08:00:00Z", fileUrl: "#" },
  { id: 2, fileName: "Chest_Xray_Jan2026.png", fileType: "image/png", fileSize: 1572864, uploadedAt: "2026-01-22T10:30:00Z", fileUrl: "#" },
  { id: 3, fileName: "MediBook_Report_Ahmad_Faris.pdf", fileType: "application/pdf", fileSize: 98304, uploadedAt: "2026-03-05T09:00:00Z", fileUrl: "#" },
];

export const isDev = import.meta.env.DEV;
export const isDevToken = () => localStorage.getItem("medibook_token") === "dev-fake-token";
