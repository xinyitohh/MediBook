import { Bot } from "lucide-react";
import { EmergencyCard } from "./EmergencyCard";
import { QuickReplies } from "./QuickReplies";
import { SpecialtyPicker } from "./SpecialtyPicker";
import { DoctorPicker } from "./DoctorPicker";
import { DatePickerCard } from "./DatePickerCard";
import { SlotPicker } from "./SlotPicker";
import { BookingSummary } from "./BookingSummary";
import { BookingSuccess } from "./BookingSuccess";

/**
 * Renders a single message bubble (user or assistant).
 * Handles all booking flow card types via an internal switch.
 */
export function MessageBubble({
  message,
  isLastAssistant,
  onQuickReply,
  onNavigate,
  booking,
  onBookingAction,
  isLoading,
}) {
  if (message.role === "emergency") {
    return <EmergencyCard onNavigate={onNavigate} />;
  }

  const isUser = message.role === "user";
  const cardActive =
    message.cardId != null && message.cardId === booking.activeCardId;

  const renderCard = () => {
    switch (message.type) {
      case "specialty-picker":
        return (
          <SpecialtyPicker
            specialties={message.data.specialties}
            suggested={message.data.suggested}
            onSelect={(s) => onBookingAction("selectSpecialty", s)}
            active={cardActive}
          />
        );
      case "doctor-picker":
        return (
          <DoctorPicker
            doctors={message.data.doctors}
            onSelect={(d) => onBookingAction("selectDoctor", d)}
            active={cardActive}
          />
        );
      case "date-picker":
        return (
          <DatePickerCard
            onSelect={(d) => onBookingAction("selectDate", d)}
            active={cardActive}
          />
        );
      case "slot-picker":
        return (
          <SlotPicker
            slots={message.data.slots}
            date={message.data.date}
            onSelect={(s) => onBookingAction("selectSlot", s)}
            active={cardActive}
          />
        );
      case "booking-summary":
        return (
          <BookingSummary
            data={message.data}
            onConfirm={() => onBookingAction("confirm")}
            onCancel={() => onBookingAction("cancel")}
            active={cardActive}
            isLoading={isLoading}
          />
        );
      case "booking-success":
        return (
          <BookingSuccess
            data={message.data}
            onViewAppointments={() => onBookingAction("viewAppointments")}
            onDone={() => onBookingAction("done")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-start gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-mint-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%]`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-brand-500 text-white rounded-2xl rounded-br-sm"
              : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
          }`}
        >
          {message.text}
        </div>
        {message.type && <div className="mt-2 w-full">{renderCard()}</div>}
        {message.quickReplies?.length > 0 && (
          <QuickReplies
            items={message.quickReplies}
            onSelect={onQuickReply}
            disabled={!isLastAssistant}
          />
        )}
      </div>
    </div>
  );
}
