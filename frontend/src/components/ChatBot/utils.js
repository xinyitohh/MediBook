/** Formats a Date object to "YYYY-MM-DD" string */
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Formats a "YYYY-MM-DD" date string for display (e.g. "Mon, 1 Jan 2025") */
export function formatDateDisplay(dateStr) {
  return new Date(dateStr + "T00:00").toLocaleDateString("en-MY", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Formats a "HH:MM:SS" time slot to "12-hour AM/PM" */
export function formatTime(slot) {
  const d = new Date(`2000-01-01T${slot}`);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** Returns a Date set to the start of tomorrow */
export function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
