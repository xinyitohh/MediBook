import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DatePicker from "../components/DatePicker";
import PageHeader from "../components/PageHeader";
import {
    getDoctorProfile,
    updateDoctorProfile,
} from "../services/doctorService";
import { getAllSpecialties } from "../services/specialtyService";

function Section({ title, children }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 hover:shadow-md transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {title}
            </h3>
            <div className="border-t pt-4">{children}</div>
        </div>
    );
}

export default function DoctorProfile() {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [specialties, setSpecialties] = useState([]);

    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: "",
        specialtyId: null,
        description: "",
        consultationFee: 0,
        dateOfBirth: "",
        gender: "",
        experience: "",
        qualifications: "",
        languages: "",
    });

    const [savedForm, setSavedForm] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch specialties
                const specialtiesResponse = await getAllSpecialties();
                if (specialtiesResponse.data) {
                    setSpecialties(specialtiesResponse.data);
                }

                // Fetch doctor profile
                const response = await getDoctorProfile();
                if (response.data) {
                    const loaded = {
                        fullName: response.data.fullName || user?.fullName || "",
                        email: response.data.email || user?.email || "",
                        phone: response.data.phone || "",
                        specialtyId: response.data.specialtyId || null,
                        description: response.data.description || "",
                        consultationFee: response.data.consultationFee || 0,
                        dateOfBirth: response.data.dateOfBirth || "",
                        gender: response.data.gender || "",
                        experience: response.data.experience || "",
                        qualifications: response.data.qualifications || "",
                        languages: response.data.languages || "",
                    };

                    setForm(loaded);
                    setSavedForm(loaded);
                }
            } catch (error) {
                console.log("Error fetching profile:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const initials = (user?.fullName || "D")
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
            await updateDoctorProfile(form);
            setSavedForm({ ...form });
            setSuccess(true);
            setEditMode(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert("Failed to save profile: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = savedForm
        ? Object.keys(form).some((k) => form[k] !== savedForm[k])
        : true;

    if (loading) {
        return <div className="p-6 text-center">Loading profile...</div>;
    }

    const selectedSpecialty = specialties.find(s => s.id === form.specialtyId);

    return (
        <div className="pb-10">
            <PageHeader title="My Profile" />

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">

                {/* Sidebar / Avatar Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-purple-100 opacity-40"></div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-4xl mx-auto mb-4 shadow-lg">
                            {initials}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900">{user?.fullName}</h3>
                        <p className="text-sm text-gray-500 mb-4">{user?.role} • Member since 2026</p>

                        {/* Placeholder button for future AWS integration */}
                        <button
                            className="btn-outline w-full text-sm hover:shadow-md transition bg-white"
                            onClick={() => alert("Photo upload coming soon via AWS S3!")}
                        >
                            Change Photo
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">Manage your professional and personal information</p>

                        {!editMode ? (
                            <button className="btn-primary px-5" onClick={() => setEditMode(true)}>
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    className="btn-outline"
                                    onClick={() => {
                                        setForm(savedForm);
                                        setEditMode(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="btn-primary"
                                    disabled={saving || !hasChanges}
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        )}
                    </div>

                    {success && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm font-medium flex items-center gap-2">
                            ✅ Profile updated successfully
                        </div>
                    )}

                    <Section title="Personal Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="input-label">Full Name</label>
                                <input
                                    value={form.fullName}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="input-label">Email</label>
                                <input
                                    value={form.email}
                                    disabled={true}
                                    className="input-field bg-gray-100 text-gray-500 cursor-not-allowed opacity-80"
                                />
                            </div>

                            <div>
                                <label className="input-label">Phone</label>
                                <input
                                    value={form.phone}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="input-label">Date of Birth</label>
                                <DatePicker
                                    value={form.dateOfBirth}
                                    onChange={(val) => setForm(prev => ({ ...prev, dateOfBirth: val }))}
                                    disabled={!editMode}
                                    maxDate={new Date()}
                                />
                            </div>

                            <div>
                                <label className="input-label">Gender</label>
                                <select
                                    value={form.gender}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))}
                                    className="input-field"
                                >
                                    <option value="">Select...</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </Section>

                    <Section title="Professional Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Specialty</label>
                                <select
                                    value={form.specialtyId || ""}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ 
                                        ...prev, 
                                        specialtyId: e.target.value ? parseInt(e.target.value) : null 
                                    }))}
                                    className="input-field"
                                >
                                    <option value="">Select a specialty...</option>
                                    {specialties.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="input-label">Consultation Fee (RM)</label>
                                <input
                                    type="number"
                                    value={form.consultationFee}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, consultationFee: parseFloat(e.target.value) }))}
                                    className="input-field"
                                    step="0.01"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="input-label">Description</label>
                                <textarea
                                    value={form.description}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="input-field resize-none"
                                    rows="4"
                                />
                            </div>

                            <div>
                                <label className="input-label">Experience (Years)</label>
                                <input
                                    value={form.experience}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, experience: e.target.value }))}
                                    className="input-field"
                                    placeholder="e.g., 10 years"
                                />
                            </div>

                            <div>
                                <label className="input-label">Qualifications</label>
                                <input
                                    value={form.qualifications}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, qualifications: e.target.value }))}
                                    className="input-field"
                                    placeholder="e.g., MBBS, MD"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="input-label">Languages Spoken</label>
                                <input
                                    value={form.languages}
                                    disabled={!editMode}
                                    onChange={(e) => setForm(prev => ({ ...prev, languages: e.target.value }))}
                                    className="input-field"
                                    placeholder="e.g., English, Chinese, Malay"
                                />
                            </div>
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}
