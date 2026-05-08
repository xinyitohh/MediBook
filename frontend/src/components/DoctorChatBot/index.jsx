import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, RotateCcw, Stethoscope } from "lucide-react";
import api from "../../services/api";

const buildWelcome = (patientName) => ({
  id: "welcome",
  role: "assistant",
  text: `I'm your Medical AI Assistant. I have access to ${patientName ? `${patientName}'s` : "the patient's"} Textract & Medical Comprehend analysis.\n\nAsk me about findings, diagnoses, drug interactions, or treatment guidelines — I can also search for up-to-date clinical information.`,
  quickReplies: [
    { label: "Explain red flags", text: "Explain the red flags found in this patient's report" },
    { label: "Suggest treatment", text: "Based on the analysis, what treatment options should I consider?" },
    { label: "Drug interactions", text: "Check for potential drug interactions in the medications listed" },
    { label: "Clinical guidelines", text: "What are the latest clinical guidelines for the primary diagnosis in this report?" },
  ],
});

export default function DoctorChatBot({ analysisData, patientName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [buildWelcome(patientName)]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input]);

  const analysisContext = analysisData?.status === "Completed" ? analysisData.summary : null;

  const sendMessage = useCallback(async (text) => {
    const trimmed = text?.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await api.post("/api/doctor-chat", {
        message: trimmed,
        history: history.slice(-10),
        analysisContext,
      });
      const reply = data.reply ?? "Sorry, I didn't get a response. Please try again.";

      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", text: reply }]);
      setHistory((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: "I'm having trouble connecting right now. Please try again shortly." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [history, isLoading, analysisContext]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([buildWelcome(patientName)]);
    setHistory([]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
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
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Stethoscope size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">Medical AI Assistant</p>
                <p className="text-indigo-100 text-xs">Report Analysis Mode · AWS Bedrock</p>
              </div>
              <button onClick={handleReset} title="New conversation" className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer">
                <RotateCcw size={15} />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Context badge */}
            {analysisData?.status === "Completed" && (
              <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <p className="text-xs text-indigo-700 font-medium">Patient report analysis loaded as context</p>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-[75%] bg-indigo-600 text-white text-sm px-3.5 py-2.5 rounded-2xl rounded-br-sm leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Stethoscope size={13} className="text-indigo-600" />
                        </div>
                        <div className="max-w-[80%] bg-gray-100 text-gray-800 text-sm px-3.5 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </div>
                      </div>
                      {msg.quickReplies?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pl-9">
                          {msg.quickReplies.map((qr, i) => (
                            <button
                              key={i}
                              onClick={() => sendMessage(qr.text)}
                              className="text-xs bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors font-medium"
                            >
                              {qr.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2 pl-9">
                  <div className="flex gap-1 pt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-indigo-300"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 flex-shrink-0">
              <div className="flex gap-2 items-center border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all bg-white shadow-sm">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about findings, treatments, guidelines..."
                  className="flex-1 resize-none outline-none text-sm text-gray-700 placeholder:text-gray-400 bg-transparent max-h-32 leading-relaxed py-1"
                  rows={1}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all flex-shrink-0 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        animate={isOpen ? {} : { scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_8px_24px_rgba(99,102,241,0.35)] flex items-center justify-center hover:shadow-[0_8px_28px_rgba(99,102,241,0.5)] transition-shadow cursor-pointer"
        aria-label="Open Medical AI chat"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <Stethoscope size={22} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
