import { useCallback, useEffect, useRef, useState } from "react";
import { generateReply, type AIReply } from "@/services/ai/aiEngine";
import type { Role } from "@/lib/role-context";

export type ChatMessage = {
  id: string;
  from: "user" | "ai";
  text: string;
  ts: string;
  payload?: AIReply["payload"];
  suggestions?: string[];
  reactions?: string[];
};

const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function useAIChat(role: Role) {
  const welcome: ChatMessage = {
    id: "welcome",
    from: "ai",
    text:
      role === "client"
        ? "Bonjour 👋 je suis **APPOINTEASE AI by BOP**, votre assistant personnel. Dites-moi en langage naturel ce que vous cherchez — je m'occupe du reste."
        : "Bonjour 👋 je suis **APPOINTEASE AI by BOP**, votre assistant business. Je peux analyser vos revenus, optimiser votre planning ou rédiger vos réponses clients.",
    ts: now(),
    suggestions:
      role === "client"
        ? ["Je cherche un dentiste à Bastos demain", "Mes prochains rendez-vous", "Coiffeuse pas chère à Melen"]
        : ["Analyse mon CA du mois", "Optimise mon planning", "Génère une promo week-end"],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [typing, setTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // reset si on change de rôle
  useEffect(() => {
    setMessages([welcome]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: ChatMessage = { id: uid(), from: "user", text: trimmed, ts: now() };
      setMessages((m) => [...m, userMsg]);
      setTyping(true);

      // Latence simulée — 700-1500ms pour un effet réaliste
      const delay = 700 + Math.floor(Math.random() * 800);
      timerRef.current = setTimeout(() => {
        const reply = generateReply(trimmed, role);
        const aiMsg: ChatMessage = {
          id: uid(),
          from: "ai",
          text: reply.text,
          ts: now(),
          payload: reply.payload,
          suggestions: reply.suggestions,
        };
        setMessages((m) => [...m, aiMsg]);
        setTyping(false);
      }, delay);
    },
    [role],
  );

  const react = useCallback((messageId: string, emoji: string) => {
    setMessages((m) =>
      m.map((msg) => {
        if (msg.id !== messageId) return msg;
        const existing = msg.reactions ?? [];
        return { ...msg, reactions: existing.includes(emoji) ? existing.filter((e) => e !== emoji) : [...existing, emoji] };
      }),
    );
  }, []);

  const clear = useCallback(() => setMessages([welcome]), []); // eslint-disable-line react-hooks/exhaustive-deps

  return { messages, typing, send, react, clear };
}
