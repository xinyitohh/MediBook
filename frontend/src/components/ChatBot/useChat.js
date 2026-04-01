import { useState, useCallback } from "react";
import { CHAT_API } from "./constants";

/**
 * Manages sending messages to the Bedrock API and tracking conversation history.
 * Returns { sendMessage, isLoading }.
 */
export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const sendMessage = useCallback(
    async (text, intentOverride, valueOverride, onBotReply) => {
      const trimmed = text?.trim();
      if (!trimmed || isLoading) return null;

      setIsLoading(true);
      const last6 = history.slice(-6);

      try {
        const body = { message: trimmed, history: last6 };
        if (intentOverride) body.intent = intentOverride;
        if (valueOverride !== undefined) body.value = valueOverride;

        const res = await fetch(CHAT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const botMsg = {
          id: Date.now() + 1,
          role: "assistant",
          text: data.reply ?? "Sorry, I didn't get a response. Please try again.",
          quickReplies: data.quickReplies ?? [],
        };

        setHistory((prev) => [
          ...prev,
          { role: "user", content: trimmed },
          { role: "assistant", content: data.reply ?? "" },
        ]);

        return botMsg;
      } catch {
        return {
          id: Date.now() + 1,
          role: "assistant",
          text: "I'm having trouble connecting right now. Please try again shortly.",
          quickReplies: [],
        };
      } finally {
        setIsLoading(false);
      }
    },
    [history, isLoading],
  );

  const resetHistory = useCallback(() => setHistory([]), []);

  return { sendMessage, isLoading, resetHistory };
}
