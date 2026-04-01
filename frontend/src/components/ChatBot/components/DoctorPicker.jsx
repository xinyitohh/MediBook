import { User, Star, ChevronRight } from "lucide-react";

export function DoctorPicker({ doctors, onSelect, active }) {
  if (doctors.length === 0) {
    return (
      <div className="mb-3 px-1">
        <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500">
          No available doctors found for this specialty.
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 space-y-2">
      {doctors.map((doc) => (
        <button
          key={doc.id}
          onClick={() => active && onSelect(doc)}
          disabled={!active}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
            active
              ? "bg-white border-gray-200 hover:border-brand-400 hover:shadow-sm cursor-pointer active:scale-[0.98]"
              : "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed"
          }`}
        >
          {doc.profileImageUrl ? (
            <img src={doc.profileImageUrl} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-brand-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">Dr. {doc.fullName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-0.5 text-xs text-amber-500">
                <Star size={11} fill="currentColor" /> {doc.rating || "4.8"}
              </span>
              <span className="text-[10px] text-gray-400">({doc.reviewCount || 0} reviews)</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">RM {doc.consultationFee || "—"}</p>
          </div>
          {active && <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
        </button>
      ))}
    </div>
  );
}
