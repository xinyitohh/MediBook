import { User, Calendar, Clock, CalendarCheck } from "lucide-react";
import { formatDateDisplay, formatTime } from "../utils";

export function BookingSummary({ data, onConfirm, onCancel, active, isLoading }) {
  return (
    <div className="mb-3">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 space-y-2.5">
          {/* Doctor info */}
          <div className="flex items-center gap-3">
            {data.doctor.profileImageUrl ? (
              <img src={data.doctor.profileImageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <User size={18} className="text-brand-500" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-800">Dr. {data.doctor.fullName}</p>
              <p className="text-xs text-gray-500">{data.specialty}</p>
            </div>
          </div>
          {/* Date & time */}
          <div className="flex gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatDateDisplay(data.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {formatTime(data.slot)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Consultation fee:{" "}
            <span className="font-semibold text-gray-700">RM {data.doctor.consultationFee || "—"}</span>
          </p>
        </div>
        {active && (
          <div className="px-4 pb-3 flex gap-2">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-lg py-2 hover:from-brand-600 hover:to-brand-700 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isLoading ? "Booking..." : <><CalendarCheck size={14} /> Confirm Booking</>}
            </button>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
