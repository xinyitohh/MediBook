import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../services";

export default function DoctorCard({ doctor }) {
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (doctor.profileImageUrl) {
            // if it already starts with http, just use it
            if (doctor.profileImageUrl.startsWith("http")) {
                setAvatarUrl(doctor.profileImageUrl);
            } else {
                getImageUrl(doctor.profileImageUrl)
                    .then((res) => setAvatarUrl(res.data.imageUrl))
                    .catch((err) => console.error("Could not load doctor image", err));
            }
        }
    }, [doctor.profileImageUrl]);

    // Generate initials from name
    const initials = doctor.fullName
        .replace("Dr. ", "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);

    // Cycle through gradient combos based on doctor id
    const gradients = [
        "from-brand-500 to-mint-500",
        "from-purple-600 to-brand-500",
        "from-mint-500 to-teal-400",
        "from-orange-500 to-rose-500",
        "from-pink-500 to-purple-500",
        "from-amber-400 to-orange-500",
    ];
    const gradient = gradients[(doctor.id || 0) % gradients.length];

    // Lighter bg version for avatar
    const bgColors = [
        "bg-brand-50 text-brand-600",
        "bg-purple-50 text-purple-600",
        "bg-mint-50 text-mint-600",
        "bg-orange-50 text-orange-600",
        "bg-pink-50 text-pink-600",
        "bg-amber-50 text-amber-600",
    ];
    const avatarStyle = bgColors[(doctor.id || 0) % bgColors.length];

    return (
        <div
            className="card-hover p-5 cursor-pointer"
            onClick={() => navigate(`/doctors/${doctor.id}`)}
        >
            {/* Doctor info */}
            <div className="flex gap-4 mb-4">
                {avatarUrl ? (
                    <img
                        src={avatarUrl} 
                        alt={doctor.fullName}
                        className="w-14 h-14 rounded-2xl object-cover shrink-0"
                    />
                ) : (
                    <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${avatarStyle}`}
                    >
                        {initials}
                    </div>
                )}

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-bold text-heading truncate">
                            {doctor.fullName}
                        </h3>
                        {doctor.isAvailable && (
                            <span className="w-2 h-2 rounded-full bg-mint-500 shrink-0" />
                        )}
                    </div>
                    <p className="text-sm text-gray-500">
                        {doctor.specialty}
                        {doctor.experience && ` · ${doctor.experience}`}
                    </p>
                </div>
            </div>

            {/* Rating & fee */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-heading">
                        {doctor.rating || "4.8"}
                    </span>
                    <span className="text-xs text-gray-400">
                        ({doctor.reviewCount || 0})
                    </span>
                </div>
                {doctor.consultationFee && (
                    <span className="text-sm font-bold text-brand-500">
                        RM {doctor.consultationFee}
                    </span>
                )}
            </div>

            {/* Book button */}
            <button
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${doctor.isAvailable
                        ? "bg-brand-500 text-white hover:bg-brand-600 active:scale-[0.98] shadow-[0_4px_12px_rgba(15,111,255,0.2)]"
                        : "border-[1.5px] border-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                disabled={!doctor.isAvailable}
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/doctors/${doctor.id}`);
                }}
            >
                {doctor.isAvailable ? "Book Appointment" : "Not Available"}
            </button>
        </div>
    );
}
