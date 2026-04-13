import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DatePicker from "../components/DatePicker";
import PageHeader from "../components/PageHeader";
import {
    getPatientProfile,
    updatePatientProfile,
    uploadProfileImage,
    getImageUrl
} from "../services";

/* ─── tiny helpers ──────────────────────────────────────────────── */
function Field({ label, value, fieldKey, editMode, onChange, type = "text", colSpan }) {
    return (
        <div className={colSpan === 2 ? "sm:col-span-2" : ""}>
            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
            {editMode ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition"
                />
            ) : (
                <p className="text-sm font-medium text-gray-800">{value || <span className="text-gray-300 italic">—</span>}</p>
            )}
        </div>
    );
}

function InfoCard({ title, onEdit, children }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
                {onEdit && (
                    <button onClick={onEdit} className="text-blue-400 hover:text-blue-600 transition">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="border-t border-gray-50 pt-3 space-y-2.5">{children}</div>
        </div>
    );
}

/* ─── main component ────────────────────────────────────────────── */
export default function Profile() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        bloodType: "",
        allergies: "",
        chronicConditions: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
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
                        profileImageUrl: response.data.profileImageUrl || "",
                        bloodType: response.data.bloodType || "",
                        allergies: response.data.allergies || "",
                        chronicConditions: response.data.chronicConditions || "",
                        emergencyContactName: response.data.emergencyContactName || "",
                        emergencyContactPhone: response.data.emergencyContactPhone || "",
                    };
                    setForm(loaded);
                    setSavedForm(loaded);

                    if (loaded.profileImageUrl) {
                        getImageUrl(loaded.profileImageUrl)
                            .then(res => setAvatarUrl(res.data.imageUrl))
                            .catch(err => console.error("Failed to load avatar", err));
                    }
                }
            } catch {
                console.log("No profile found.");
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

    const handleChange = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

    const handleSave = async (e) => {
        e?.preventDefault();
        setSaving(true);
        setSuccess(false);
        try {
            await updatePatientProfile(form);
            setSavedForm({ ...form });
            setSuccess(true);
            setEditMode(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            alert("Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm(savedForm);
        setEditMode(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        } 

        setIsUploading(true);
        try {
            const res = await uploadProfileImage(file);

            const urlRes = await getImageUrl(res.data.fileKey);
            setAvatarUrl(urlRes.data.imageUrl);

            alert("Profile picture updated!");
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const hasChanges = savedForm
        ? Object.keys(form).some((k) => form[k] !== savedForm[k])
        : true;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                Loading profile...
            </div>
        );
    }

    const tabs = [
        { key: "general", label: "General Information" },
        { key: "medical", label: "Medical Information" },
        { key: "emergency", label: "Emergency Contact" },
    ];

    return (
        <div className="pb-10">
            <div className="flex items-center justify-between mb-6">
                <PageHeader title="Patient Profile" />
                <div className="flex gap-2">
                    {editMode ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !hasChanges}
                                className="px-5 py-2 text-sm rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50 transition"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="px-4 py-2 text-sm rounded-xl border border-blue-200 text-blue-500 font-semibold hover:bg-blue-50 transition">
                                Print
                            </button>
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-5 py-2 text-sm rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                            >
                                Edit
                            </button>
                        </>
                    )}
                </div>
            </div>

            {success && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium flex items-center gap-2">
                    ✅ Profile updated successfully
                </div>
            )}

            {/* Three-column layout: sidebar | main | right panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_260px] gap-5">

                {/* ── LEFT: Avatar / contact sidebar ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center h-fit">
                    {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover mb-4 shadow border-2 border-white"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-3xl mb-4 shadow">
                                {initials}
                            </div>
                        )}

                    <h2 className="text-base font-bold text-gray-900 leading-tight">{form.fullName}</h2>

                    {form.phone && (
                        <p className="text-sm text-blue-500 font-medium mt-1">{form.phone}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">{form.email}</p>

                    <div className="w-full border-t border-gray-100 my-4" />

                    <div className="w-full space-y-2 text-left">
                        {form.gender && (
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Gender</span>
                                <span className="font-medium text-gray-700">{form.gender}</span>
                            </div>
                        )}
                        {form.dateOfBirth && (
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Date of birth</span>
                                <span className="font-medium text-gray-700">{form.dateOfBirth}</span>
                            </div>
                        )}
                        {form.bloodType && (
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Blood type</span>
                                <span className="font-medium text-gray-700">{form.bloodType}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Role</span>
                            <span className="font-medium text-gray-700">{user?.role || "Patient"}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Member since</span>
                            <span className="font-medium text-gray-700">2026</span>
                        </div>
                    </div>

                    <label className="mt-5 w-full text-center block cursor-pointer text-xs py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
                            {isUploading ? "Uploading..." : "Change Photo"}
                            <input
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg,.png"
                                disabled={isUploading}
                                onChange={handleImageUpload}
                            />
                    </label>
                </div>

                {/* ── CENTER: Tabbed info ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`px-5 py-3.5 text-sm font-medium transition border-b-2 -mb-px ${
                                    activeTab === t.key
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* General Information */}
                        {activeTab === "general" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                {[
                                    { label: "Full Name", key: "fullName", disabled: true },
                                    { label: "Email Address", key: "email", disabled: true },
                                    { label: "Phone Number", key: "phone" },
                                    { label: "Gender", key: "gender", isSelect: true },
                                    { label: "Date of Birth", key: "dateOfBirth", isDate: true },
                                    { label: "Address", key: "address", colSpan: 2 },
                                ].map((f) => (
                                    <div key={f.key} className={f.colSpan === 2 ? "sm:col-span-2" : ""}>
                                        <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                                        {f.isSelect && editMode ? (
                                            <select
                                                value={form[f.key]}
                                                onChange={(e) => handleChange(f.key, e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition"
                                            >
                                                <option value="">Select...</option>
                                                <option>Male</option>
                                                <option>Female</option>
                                                <option>Other</option>
                                            </select>
                                        ) : f.isDate && editMode ? (
                                            <DatePicker
                                                value={form[f.key]}
                                                onChange={(val) => handleChange(f.key, val)}
                                                disabled={false}
                                                maxDate={new Date()}
                                            />
                                        ) : editMode && !f.disabled ? (
                                            <input
                                                value={form[f.key]}
                                                onChange={(e) => handleChange(f.key, e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition"
                                            />
                                        ) : (
                                            <p className={`text-sm font-medium ${f.disabled ? "text-gray-400" : "text-gray-800"}`}>
                                                {form[f.key] || <span className="text-gray-300 italic">—</span>}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Medical Information */}
                        {activeTab === "medical" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                {[
                                    { label: "Blood Type", key: "bloodType" },
                                    { label: "Allergies", key: "allergies" },
                                    { label: "Chronic Conditions", key: "chronicConditions", colSpan: 2 },
                                ].map((f) => (
                                    <div key={f.key} className={f.colSpan === 2 ? "sm:col-span-2" : ""}>
                                        <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                                        {editMode ? (
                                            <input
                                                value={form[f.key]}
                                                onChange={(e) => handleChange(f.key, e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-800">
                                                {form[f.key] || <span className="text-gray-300 italic">—</span>}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Emergency Contact */}
                        {activeTab === "emergency" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                {[
                                    { label: "Contact Name", key: "emergencyContactName" },
                                    { label: "Contact Phone", key: "emergencyContactPhone" },
                                ].map((f) => (
                                    <div key={f.key}>
                                        <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                                        {editMode ? (
                                            <input
                                                value={form[f.key]}
                                                onChange={(e) => handleChange(f.key, e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition"
                                            />
                                        ) : (
                                            <p className="text-sm font-medium text-gray-800">
                                                {form[f.key] || <span className="text-gray-300 italic">—</span>}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: Medical snapshot + quick info ── */}
                <div className="space-y-4">
                    <InfoCard title="Anamnesis" onEdit={() => { setActiveTab("medical"); setEditMode(true); }}>
                        <div className="space-y-2.5">
                            {[
                                { label: "Allergies", key: "allergies" },
                                { label: "Chronic diseases", key: "chronicConditions" },
                                { label: "Blood type", key: "bloodType" },
                            ].map((f) => (
                                <div key={f.key} className="flex justify-between gap-2">
                                    <span className="text-xs text-gray-400 shrink-0">{f.label}:</span>
                                    <span className="text-xs font-medium text-gray-700 text-right">
                                        {form[f.key] || <span className="text-gray-300 italic">—</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                    <InfoCard title="Emergency Contact" onEdit={() => { setActiveTab("emergency"); setEditMode(true); }}>
                        <div className="space-y-2.5">
                            {[
                                { label: "Name", key: "emergencyContactName" },
                                { label: "Phone", key: "emergencyContactPhone" },
                            ].map((f) => (
                                <div key={f.key} className="flex justify-between gap-2">
                                    <span className="text-xs text-gray-400 shrink-0">{f.label}:</span>
                                    <span className="text-xs font-medium text-gray-700 text-right">
                                        {form[f.key] || <span className="text-gray-300 italic">—</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </InfoCard>

                    <InfoCard title="Account">
                        <div className="space-y-2.5">
                            <div className="flex justify-between gap-2">
                                <span className="text-xs text-gray-400">Role:</span>
                                <span className="text-xs font-medium text-gray-700">{user?.role || "Patient"}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="text-xs text-gray-400">Member since:</span>
                                <span className="text-xs font-medium text-gray-700">2026</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="text-xs text-gray-400">Email:</span>
                                <span className="text-xs font-medium text-gray-700 truncate max-w-[130px]">{form.email || "—"}</span>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}
