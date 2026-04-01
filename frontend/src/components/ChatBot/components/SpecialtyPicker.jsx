import { Activity } from "lucide-react";
import { SPECIALTY_ICONS, SPECIALTY_COLORS, DEFAULT_SPECIALTY_COLOR } from "../constants";

export function SpecialtyPicker({ specialties, suggested, onSelect, active }) {
  return (
    <div className="mb-3">
      <div className="grid grid-cols-2 gap-2">
        {specialties.map((name) => {
          const Icon = SPECIALTY_ICONS[name] || Activity;
          const color = active
            ? (SPECIALTY_COLORS[name] || DEFAULT_SPECIALTY_COLOR)
            : "bg-gray-50 text-gray-400 border-gray-200";
          const isSuggested = suggested && name === suggested;
          return (
            <button
              key={name}
              onClick={() => active && onSelect(name)}
              disabled={!active}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${color} ${
                !active ? "cursor-not-allowed opacity-60" : "cursor-pointer active:scale-95"
              } ${isSuggested ? "ring-2 ring-brand-400 ring-offset-1" : ""}`}
            >
              <Icon size={15} />
              <span className="truncate">{name}</span>
              {isSuggested && (
                <span className="ml-auto text-[9px] bg-brand-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                  Suggested
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
