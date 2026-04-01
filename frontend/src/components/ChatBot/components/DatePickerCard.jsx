import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { tomorrow } from "../utils";

export function DatePickerCard({ onSelect, active }) {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="mb-3">
      <div
        className={`rounded-xl border border-gray-200 overflow-hidden ${
          !active ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <div className="flex justify-center py-2 chatbot-datepicker">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              if (date) onSelect(date);
            }}
            inline
            minDate={tomorrow()}
          />
        </div>
      </div>
    </div>
  );
}
