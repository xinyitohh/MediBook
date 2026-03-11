import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DatePicker from "../components/DatePicker";
import PageHeader from "../components/PageHeader";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../services/patientService";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [savedForm, setSavedForm] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getPatientProfile();
        if (response.data) {
          const loaded = {
            fullName: response.data.fullName || user?.fullName || "",
            email: response.data.email || user?.email || "",
            phone: response.data.phone || "",
            dateOfBirth: response.data.dateOfBirth || "",
            gender: response.data.gender || "",
            address: response.data.address || "",
          };
          setForm(loaded);
          setSavedForm(loaded);
        }
      } catch (error) {
        console.log("No existing profile found. User needs to create one.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updatePatientProfile(form);
      setSavedForm({ ...form });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = savedForm
    ? Object.keys(form).some((k) => form[k] !== savedForm[k])
    : true;

  const fields = [
    { key: "fullName", label: "Full Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
    { key: "dateOfBirth", label: "Date of Birth", type: "date" },
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: ["", "Male", "Female", "Other"],
    },
    { key: "address", label: "Address", type: "text" },
  ];

  return (
    <div>
      <PageHeader title="My Profile" />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* Avatar card */}
        <div className="card-padded text-center h-fit">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-3xl mx-auto mb-4">
            {initials}
          </div>
          <h3 className="text-lg font-bold text-heading">{user?.fullName}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {user?.role} since Jan 2026
          </p>
          <button className="btn-outline w-full text-sm">Change Photo</button>
        </div>

        {/* Form */}
        <div className="card-padded">
          <h3 className="text-base font-bold text-heading mb-5">
            Personal Information
          </h3>

          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-mint-50 text-mint-600 text-sm font-medium">
              Profile saved successfully!
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="input-label">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      className="input-field"
                    >
                      {f.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt || "Select..."}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "date" ? (
                    <DatePicker
                      maxDate={new Date()}
                      value={form[f.key]}
                      onChange={(val) => setForm({ ...form, [f.key]: val })}
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={(e) =>
                        setForm({ ...form, [f.key]: e.target.value })
                      }
                      disabled={f.key === "fullName" || f.key === "email"}
                      className="input-field disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="btn-primary disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
