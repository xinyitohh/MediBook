import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

const CustomInput = forwardRef(({ value, onClick, placeholder, disabled }, ref) => (
  <div
    className={`relative w-full ${disabled ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
    onClick={disabled ? undefined : onClick}
    ref={ref}
  >
    <CalendarDays
      size={16}
      className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
        disabled ? "text-gray-300" : "text-gray-400"
      }`}
    />
    <div
      className={`input-field pl-10 flex items-center min-h-[42px] select-none ${
        disabled ? "bg-gray-50 border-gray-100 text-gray-400" : ""
      }`}
    >
      <span className={value ? (disabled ? "text-gray-400" : "text-gray-700") : "text-gray-400"}>
        {value || placeholder || "Select date"}
      </span>
    </div>
  </div>
));
CustomInput.displayName = "CustomInput";

// ADDED minDate and maxDate to the props here
export default function DatePicker({ value, onChange, minDate, maxDate, disabled }) {
  const selected = value
    ? (() => {
        // Handle full ISO strings or dates already containing 'T'
        const baseDate = typeof value === "string" && value.includes("T") 
          ? value.split("T")[0] 
          : value;
        const date = new Date(baseDate + "T00:00:00");
        return isNaN(date.getTime()) ? null : date;
      })()
    : null;

  const handleChange = (date) => {
    if (!date) {
      onChange("");
      return;
    }
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
  };

  return (
    <ReactDatePicker
      selected={selected}
      onChange={handleChange}
      customInput={<CustomInput />}
      wrapperClassName="w-full"
      dateFormat="d MMM yyyy"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      minDate={minDate}
      maxDate={maxDate} 
      disabled={disabled}
      placeholderText="Select date"
      isClearable={!disabled}
      popperPlacement="bottom-start"
    />
  );
}
