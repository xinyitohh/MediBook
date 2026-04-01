import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Bot, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { WELCOME_MESSAGE, INITIAL_BOOKING } from "./constants";
import { useChat } from "./useChat";
import { useBooking } from "./useBooking";
import { MessageBubble } from "./components/MessageBubble";
import { TypingIndicator } from "./components/TypingIndicator";

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const { sendMessage, resetHistory } = useChat();
  const { booking, startBooking, handleBookingAction, resetBooking } = useBooking({
    setMessages,
    setIsLoading,
  });

  const lastAssistantIdx = messages.reduce(
    (acc, msg, i) => (msg.role === "assistant" ? i : acc),
    -1,
  );

  // ── Effects ────────────────────────────────────────────────────────────────

  // Smooth scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Instant scroll to latest when panel reopens
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "instant" }),
      0,
    );
    return () => clearTimeout(t);
  }, [isOpen]);

  // Focus textarea on open
  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [isOpen]);

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [input]);

  // ── Chat handlers ──────────────────────────────────────────────────────────

  const handleSendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed || isLoading) return;

      setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
      setInput("");
      setIsLoading(true);

      const botMsg = await sendMessage(trimmed);
      if (botMsg) setMessages((prev) => [...prev, botMsg]);

      setIsLoading(false);
    },
    [isLoading, sendMessage],
  );

  const handleSend = () => handleSendMessage(input);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Quick reply handler ────────────────────────────────────────────────────

  const handleQuickReply = useCallback(
    ({ action, value }) => {
      switch (action) {
        case "ASK_QUESTION":
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "assistant",
              text: "What health question can I help you with? Type your question below.",
              quickReplies: [],
            },
          ]);
          setTimeout(() => textareaRef.current?.focus(), 50);
          break;
        case "BOOK_APPOINTMENT":
          startBooking();
          break;
        case "BOOK_SPECIALTY": {
          // Collect sibling BOOK_SPECIALTY replies as ordered fallbacks
          const lastBotMsg = [...messages]
            .reverse()
            .find(
              (m) =>
                m.role === "assistant" &&
                m.quickReplies?.some((qr) => qr.action === "BOOK_SPECIALTY"),
            );
          const alternatives = (lastBotMsg?.quickReplies ?? [])
            .filter((qr) => qr.action === "BOOK_SPECIALTY" && qr.value !== value)
            .map((qr) => qr.value);
          startBooking(value, alternatives);
          break;
        }
        case "CANCEL_BOOKING":
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "assistant",
              text: "Booking cancelled. Anything else I can help you with?",
              quickReplies: WELCOME_MESSAGE.quickReplies,
            },
          ]);
          resetBooking();
          break;
        case "NAVIGATE":
          setIsOpen(false);
          navigate(value);
          break;
        case "FIND_EMERGENCY":
          setMessages((prev) => [...prev, { id: Date.now(), role: "emergency" }]);
          break;
        default:
          handleSendMessage(value ?? action);
      }
    },
    [startBooking, handleSendMessage, resetBooking, navigate, messages],
  );

  // ── New conversation reset ─────────────────────────────────────────────────

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
    resetHistory();
    resetBooking();
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-[385px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: "560px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-700 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">MediBook AI Assistant</p>
                <p className="text-brand-100 text-xs">Powered by AWS Bedrock</p>
              </div>
              <button
                onClick={handleReset}
                title="New conversation"
                className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLastAssistant={i === lastAssistantIdx}
                  onQuickReply={handleQuickReply}
                  onNavigate={() => { setIsOpen(false); navigate("/doctors"); }}
                  booking={booking}
                  onBookingAction={handleBookingAction}
                  isLoading={isLoading}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-gray-400 px-4 pb-1 flex-shrink-0">
              Not medical advice. Always consult a healthcare professional.
            </p>

            {/* Input */}
            <div className="px-3 pb-3 flex-shrink-0">
              <div className="flex gap-2 items-center border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all bg-white shadow-sm">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a health question..."
                  className="flex-1 resize-none outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent max-h-32 leading-relaxed py-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        animate={isOpen ? {} : { scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-[0_8px_24px_rgba(15,111,255,0.35)] flex items-center justify-center hover:shadow-[0_8px_28px_rgba(15,111,255,0.5)] transition-shadow cursor-pointer"
        aria-label="Open AI chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={22} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
