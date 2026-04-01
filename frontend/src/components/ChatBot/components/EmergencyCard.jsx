import { Phone, AlertTriangle, MapPin } from "lucide-react";

export function EmergencyCard({ onNavigate }) {
  return (
    <div className="mb-3">
      <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500">
          <AlertTriangle size={15} className="text-white" />
          <span className="text-white font-semibold text-sm">Emergency Contacts</span>
        </div>
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-red-400 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              Emergency / Ambulance:{" "}
              <a href="tel:999" className="font-bold text-red-500 hover:underline">999</a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-red-400 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              Fire &amp; Rescue:{" "}
              <a href="tel:994" className="font-bold text-red-500 hover:underline">994</a>
            </span>
          </div>
          <button
            onClick={onNavigate}
            className="flex items-center gap-1.5 text-xs text-brand-500 font-semibold mt-1 hover:underline cursor-pointer"
          >
            <MapPin size={12} /> Find a doctor near you
          </button>
        </div>
        <p className="text-[10px] text-red-400 px-4 pb-2.5">
          If life-threatening, call <strong>999</strong> immediately.
        </p>
      </div>
    </div>
  );
}
