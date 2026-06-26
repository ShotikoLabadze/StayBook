"use client";

import { aiService } from "@/services/aiService";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your premium StayBook AI assistant. How can I help you refine your luxury travel plans today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const data = await aiService.chatReply(userMessage.text);

      const aiText =
        data.response || "How else can I assist your luxury journey?";

      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, sender: "ai", text: aiText },
      ]);
    } catch (err) {
      console.error("AI Chat Widget Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "Apologies, I am experiencing a brief connection issue. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body flex flex-col items-end">
      {isOpen && (
        <div className="w-[360px] h-[480px] bg-card-bg border border-border-subtle rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-200 text-left">
          <header className="p-4 bg-primary dark:bg-secondary text-white dark:text-neutral-bg flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold tracking-tight">
                  StayBook AI Concierge
                </h4>
                <p className="text-[9px] opacity-80 font-medium">
                  Bespoke Travel Intelligence
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 dark:hover:bg-black/10 p-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer outline-none text-current"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-bg/20 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs font-medium shadow-3xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-primary dark:bg-secondary text-white dark:text-neutral-bg rounded-tr-none"
                      : "bg-card-bg border border-border-subtle text-primary rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card-bg border border-border-subtle rounded-2xl rounded-tl-none px-4 py-2.5 shadow-3xs flex items-center gap-1">
                  <div
                    className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce duration-300"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce duration-300"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce duration-300"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-border-subtle bg-card-bg flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your workspace..."
              className="flex-1 bg-neutral-bg rounded-xl border border-border-subtle px-3 py-2 text-xs font-medium outline-none focus:border-primary dark:focus:border-secondary transition-colors text-primary placeholder:text-text-muted"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="h-8 w-8 bg-primary dark:bg-secondary disabled:opacity-40 text-white dark:text-neutral-bg rounded-xl flex items-center justify-center shrink-0 transition-all border-none active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 bg-primary dark:bg-secondary text-white dark:text-neutral-bg rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all border-none cursor-pointer outline-none relative group"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
        ) : (
          <MessageSquare className="h-5 w-5 transition-transform duration-200" />
        )}

        {!isOpen && (
          <span className="absolute top-0 right-0 h-3 w-3 bg-purple-500 rounded-full border-2 border-card-bg animate-pulse" />
        )}
      </button>
    </div>
  );
}
