import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

/* Custom input that matches the design system */
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="relative cursor-pointer w-full" onClick={onClick} ref={ref}>
    <CalendarDays size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    <div className="input-field pl-10 flex items-center min-h-[42px] select-none">
      <span className={value ? "text-gray-700" : "text-gray-400"}>
        {value || placeholder || "Select date"}
      </span>
    </div>
  </div>
));
CustomInput.displayName = "CustomInput";

export default function DatePicker({ value, onChange }) {
  const selected = value ? new Date(value + "T00:00:00") : null;

  const handleChange = (date) => {
    if (!date) { onChange(""); return; }
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
      maxDate={new Date()}
      placeholderText="Select date"
      isClearable
      popperPlacement="bottom-start"
    />
  );
}
