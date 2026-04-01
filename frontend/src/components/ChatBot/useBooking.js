import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDoctors, getAvailableSlots } from "../../services/doctorService";
import { bookAppointment } from "../../services/appointmentService";
import { formatDate, formatTime, formatDateDisplay } from "./utils";
import { INITIAL_BOOKING, WELCOME_MESSAGE, CANCEL_QR } from "./constants";

/**
 * Manages the multi-step appointment booking flow.
 * Returns { booking, startBooking, handleBookingAction, resetBooking }.
 */
export function useBooking({ setMessages, setIsLoading }) {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(INITIAL_BOOKING);
  const doctorsCache = useRef(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const addBotMsg = useCallback(
    (msg) => setMessages((prev) => [...prev, msg]),
    [setMessages],
  );

  const addUserMsg = useCallback(
    (text) =>
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "user", text },
      ]),
    [setMessages],
  );

  const fetchDoctors = useCallback(async () => {
    if (doctorsCache.current) return doctorsCache.current;
    const { data } = await getAllDoctors();
    doctorsCache.current = data;
    return data;
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(INITIAL_BOOKING);
    doctorsCache.current = null;
  }, []);

  // ── Booking steps ─────────────────────────────────────────────────────────

  const startBooking = useCallback(
    async (suggestedSpecialty, alternatives = []) => {
      setIsLoading(true);
      try {
        const allDoctors = await fetchDoctors();
        const available = allDoctors.filter((d) => d.isAvailable !== false);
        const specialties = new Set(
          available.map((d) => d.specialty).filter(Boolean),
        );

        const candidates = [suggestedSpecialty, ...alternatives].filter(Boolean);
        const match = candidates.find((s) => specialties.has(s));

        if (match) {
          const filtered = available.filter((d) => d.specialty === match);
          const cardId = Date.now() + 1;
          const notePrefix =
            match !== suggestedSpecialty && suggestedSpecialty
              ? `No ${suggestedSpecialty} doctors available. `
              : "";
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: "user", text: suggestedSpecialty || match },
            {
              id: cardId,
              cardId,
              role: "assistant",
              type: "doctor-picker",
              text: `${notePrefix}Here are the available ${match} doctors:`,
              data: { doctors: filtered, specialty: match },
              quickReplies: CANCEL_QR,
            },
          ]);
          setBooking({ ...INITIAL_BOOKING, step: "doctor", specialty: match, activeCardId: cardId });
        } else if (suggestedSpecialty) {
          const allNames = candidates.join(" or ");
          addBotMsg({
            id: Date.now(),
            role: "assistant",
            text: `Sorry, no ${allNames} doctors are available at the moment. You can try again later or contact us directly.`,
            quickReplies: [
              { label: "Try Another Specialty", action: "BOOK_APPOINTMENT" },
              ...CANCEL_QR,
            ],
          });
          setBooking(INITIAL_BOOKING);
        } else {
          // Generic booking — show full specialty picker
          const specialtyList = [...specialties].sort();
          const cardId = Date.now() + 1;
          addBotMsg({
            id: cardId,
            cardId,
            role: "assistant",
            type: "specialty-picker",
            text: "What type of doctor would you like to see?",
            data: { specialties: specialtyList, suggested: null },
            quickReplies: CANCEL_QR,
          });
          setBooking({ ...INITIAL_BOOKING, step: "specialty", activeCardId: cardId });
        }
      } catch {
        addBotMsg({
          id: Date.now(),
          role: "assistant",
          text: "Sorry, I couldn't load the doctor list. Please try again.",
          quickReplies: [],
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDoctors, setIsLoading, setMessages, addBotMsg],
  );

  const selectSpecialty = useCallback(
    async (specialty) => {
      addUserMsg(specialty);
      setIsLoading(true);
      try {
        const allDoctors = await fetchDoctors();
        const filtered = allDoctors.filter(
          (d) => d.specialty === specialty && d.isAvailable !== false,
        );
        const cardId = Date.now() + 1;
        addBotMsg({
          id: cardId,
          cardId,
          role: "assistant",
          type: "doctor-picker",
          text:
            filtered.length > 0
              ? `Here are the available ${specialty} doctors:`
              : `No available ${specialty} doctors at the moment. Please try another specialty.`,
          data: { doctors: filtered, specialty },
          quickReplies: CANCEL_QR,
        });
        setBooking((prev) => ({ ...prev, step: "doctor", specialty, activeCardId: cardId }));
      } catch {
        addBotMsg({
          id: Date.now(),
          role: "assistant",
          text: "Something went wrong loading doctors. Please try again.",
          quickReplies: [],
        });
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDoctors, setIsLoading, addBotMsg, addUserMsg],
  );

  const selectDoctor = useCallback(
    (doctor) => {
      const cardId = Date.now() + 1;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "user", text: `Dr. ${doctor.fullName}` },
        {
          id: cardId,
          cardId,
          role: "assistant",
          type: "date-picker",
          text: `When would you like to see Dr. ${doctor.fullName}? Pick a date:`,
          data: { doctor },
          quickReplies: CANCEL_QR,
        },
      ]);
      setBooking((prev) => ({ ...prev, step: "date", doctor, activeCardId: cardId }));
    },
    [setMessages],
  );

  const selectDate = useCallback(
    async (dateObj) => {
      const dateStr = formatDate(dateObj);
      addUserMsg(formatDateDisplay(dateStr));
      setIsLoading(true);
      try {
        const { data: slots } = await getAvailableSlots(booking.doctor.id, dateStr);
        const cardId = Date.now() + 1;
        addBotMsg({
          id: cardId,
          cardId,
          role: "assistant",
          type: "slot-picker",
          text: slots.length > 0 ? "Pick a time slot:" : "No slots available on this date.",
          data: { slots, date: dateStr, doctor: booking.doctor },
          quickReplies: CANCEL_QR,
        });
        setBooking((prev) => ({
          ...prev,
          step: slots.length > 0 ? "slot" : "date",
          date: dateStr,
          activeCardId: cardId,
        }));
        // Re-show date picker if no slots available
        if (slots.length === 0) {
          const dateCardId = Date.now() + 2;
          addBotMsg({
            id: dateCardId,
            cardId: dateCardId,
            role: "assistant",
            type: "date-picker",
            text: "Try picking another date:",
            data: { doctor: booking.doctor },
          });
          setBooking((prev) => ({ ...prev, step: "date", activeCardId: dateCardId }));
        }
      } catch {
        addBotMsg({
          id: Date.now(),
          role: "assistant",
          text: "Couldn't load time slots. Please try again.",
          quickReplies: [],
        });
      } finally {
        setIsLoading(false);
      }
    },
    [booking.doctor, setIsLoading, addBotMsg, addUserMsg],
  );

  const selectSlot = useCallback(
    (slot) => {
      const cardId = Date.now() + 1;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "user", text: formatTime(slot) },
        {
          id: cardId,
          cardId,
          role: "assistant",
          type: "booking-summary",
          text: "Here's your appointment summary:",
          data: {
            doctor: booking.doctor,
            date: booking.date,
            slot,
            specialty: booking.specialty,
          },
        },
      ]);
      setBooking((prev) => ({ ...prev, step: "confirm", slot, activeCardId: cardId }));
    },
    [booking.doctor, booking.date, booking.specialty, setMessages],
  );

  const confirmBooking = useCallback(async () => {
    setIsLoading(true);
    try {
      await bookAppointment({
        doctorId: booking.doctor.id,
        appointmentDate: booking.date,
        timeSlot: booking.slot,
        notes: "Booked via AI assistant",
      });
      const cardId = Date.now();
      addBotMsg({
        id: cardId,
        cardId,
        role: "assistant",
        type: "booking-success",
        text: "Your appointment has been booked!",
        data: { doctor: booking.doctor, date: booking.date, slot: booking.slot },
      });
      setBooking(INITIAL_BOOKING);
    } catch {
      addBotMsg({
        id: Date.now(),
        role: "assistant",
        text: "Sorry, booking failed. Please try again or book through the appointments page.",
        quickReplies: [
          { label: "Try Again", action: "BOOK_APPOINTMENT" },
          { label: "Go to Appointments", action: "NAVIGATE", value: "/appointments" },
        ],
      });
      setBooking(INITIAL_BOOKING);
    } finally {
      setIsLoading(false);
    }
  }, [booking, setIsLoading, addBotMsg]);

  // ── Action dispatcher ─────────────────────────────────────────────────────

  const handleBookingAction = useCallback(
    (action, data) => {
      switch (action) {
        case "selectSpecialty": selectSpecialty(data); break;
        case "selectDoctor":   selectDoctor(data);     break;
        case "selectDate":     selectDate(data);       break;
        case "selectSlot":     selectSlot(data);       break;
        case "confirm":        confirmBooking();        break;
        case "cancel":
          addBotMsg({
            id: Date.now(),
            role: "assistant",
            text: "Booking cancelled. You can start again anytime!",
            quickReplies: WELCOME_MESSAGE.quickReplies,
          });
          setBooking(INITIAL_BOOKING);
          break;
        case "viewAppointments":
          navigate("/appointments");
          break;
        case "done":
          addBotMsg({
            id: Date.now(),
            role: "assistant",
            text: "Anything else I can help you with?",
            quickReplies: WELCOME_MESSAGE.quickReplies,
          });
          break;
        default:
          break;
      }
    },
    [
      selectSpecialty, selectDoctor, selectDate,
      selectSlot, confirmBooking, addBotMsg, navigate,
    ],
  );

  return { booking, startBooking, handleBookingAction, resetBooking };
}
