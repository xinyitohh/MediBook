import { Check, ArrowRight } from "lucide-react";
import { formatDateDisplay, formatTime } from "../utils";

export function BookingSuccess({ data, onViewAppointments, onDone }) {
  return (
    <div className="mb-3">
      <div className="bg-mint-50 border border-mint-400/30 rounded-xl overflow-hidden">
        <div className="px-4 py-4 text-center">
          <div className="w-10 h-10 rounded-full bg-mint-500 flex items-center justify-center mx-auto mb-2">
            <Check size={20} className="text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-800 mb-1">Appointment Booked!</p>
          <p className="text-xs text-gray-500">
            Dr. {data.doctor.fullName} &middot; {formatDateDisplay(data.date)} &middot; {formatTime(data.slot)}
          </p>
        </div>
        <div className="px-4 pb-3 flex gap-2">
          <button
            onClick={onViewAppointments}
            className="flex-1 bg-brand-500 text-white text-xs font-semibold rounded-lg py-2 hover:bg-brand-600 cursor-pointer flex items-center justify-center gap-1"
          >
            <ArrowRight size={12} /> View My Appointments
          </button>
          <button
            onClick={onDone}
            className="px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
