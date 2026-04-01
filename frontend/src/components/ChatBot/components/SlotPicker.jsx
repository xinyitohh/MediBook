import { formatTime, formatDateDisplay } from "../utils";

export function SlotPicker({ slots, date, onSelect, active }) {
  const morning = slots.filter((s) => parseInt(s) < 12);
  const afternoon = slots.filter((s) => parseInt(s) >= 12);

  if (slots.length === 0) {
    return (
      <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 text-center">
        No slots available for {formatDateDisplay(date)}. Please pick another date.
      </div>
    );
  }

  const renderGroup = (label, items) => {
    if (items.length === 0) return null;
    return (
      <div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
          {label}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {items.map((slot) => (
            <button
              key={slot}
              onClick={() => active && onSelect(slot)}
              disabled={!active}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                active
                  ? "border-gray-200 bg-white text-gray-700 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 cursor-pointer active:scale-95"
                  : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
            >
              {formatTime(slot)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-3 space-y-3">
      {renderGroup("Morning", morning)}
      {renderGroup("Afternoon", afternoon)}
    </div>
  );
}
