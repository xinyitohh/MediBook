import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getAllDoctors } from "../services";
import PageHeader from "../components/PageHeader";
import DoctorCard from "../components/DoctorCard";

const SPECIALTIES = [
  "All",
  "Cardiology",
  "General Practice",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
];

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");

  useEffect(() => {
    getAllDoctors()
      .then((res) => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = doctors.filter((d) => {
    const matchSearch = d.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchSpec =
      specialty === "All" || d.specialty === specialty;
    return matchSearch && matchSpec;
  });

  return (
    <div>
      <PageHeader
        title="Find a Doctor"
        subtitle="Book appointments with our experienced specialists"
      />

      {/* Search & Filter */}
      <div className="card flex items-center gap-2 p-1.5 mb-6">
        <div className="flex-1 flex items-center gap-2.5 px-3.5 bg-gray-50 rounded-xl">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-3 bg-transparent border-none outline-none text-sm placeholder:text-gray-400"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="px-4 py-3 bg-gray-50 rounded-xl border-none outline-none text-sm text-gray-600 font-medium cursor-pointer"
        >
          {SPECIALTIES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Specialties" : s}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading doctors...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No doctors found. Try a different search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
