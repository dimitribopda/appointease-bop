import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Mic, MapPin, Languages } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useAIChat } from "@/hooks/useAIChat";
import { BopAvatar } from "@/components/ai/BopAvatar";
import { ChatBubble } from "@/components/ai/ChatBubble";
import { TypingIndicator, MessageSkeleton } from "@/components/ai/TypingIndicator";
import { SmartReplies } from "@/components/ai/SmartReplies";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "APPOINTEASE AI by BOP — Assistant IA" }] }),
  component: AIAssistantPage,
});

function AIAssistantPage() {
  const { role } = useRole();
  const { messages, typing, send, react } = useAIChat(role);
  const [input, setInput] = useState("");
  const [booting, setBooting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const quickPrompts =
    role === "client"
      ? [
          "Coiffeuse à Bastos demain",
          "Spa pas cher à Akwa Douala",
          "Mes prochains rendez-vous",
          "Annule mon prochain RDV",
        ]
      : [
          "Analyse mon CA du mois",
          "Optimise mon planning",
          "Smart replies pour client",
          "Génère une promo week-end",
          "Mes clients VIP",
        ];

  return (
    <div className="relative mx-auto min-h-[calc(100vh-8rem)] max-w-5xl px-4 py-6 sm:px-6">
      {/* Backdrop dégradé violet/orange */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#6B2D8E]/30 blur-3xl" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-[#F5A623]/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#9333EA]/20 blur-3xl" />
      </div>

      {/* Header carte */}
      <div className="mb-4 flex items-center gap-4 rounded-3xl border border-white/20 bg-white/40 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <BopAvatar size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
              <span className="bg-gradient-to-r from-[#6B2D8E] via-[#9333EA] to-[#F5A623] bg-clip-text text-transparent">
                APPOINTEASE AI by BOP
              </span>
            </h1>
            <span className="rounded-full border border-white/20 bg-white/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md dark:border-white/10 dark:bg-black/30">
              {role === "client" ? "Assistant personnel" : "Assistant business"}
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            <MapPin className="h-3 w-3" /> Yaoundé & Douala
            <span className="mx-1">·</span>
            <Languages className="h-3 w-3" /> FR · EN · Camfranglais
            <span className="mx-1">·</span>
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> En ligne
          </p>
        </div>
      </div>

      {/* Chat shell */}
      <div className="flex h-[calc(100vh-18rem)] min-h-[460px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 scroll-smooth">
          {booting ? (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          ) : (
            messages.map((m) => (
              <ChatBubble key={m.id} message={m} onSelectSuggestion={send} onReact={react} />
            ))
          )}
          {typing && <TypingIndicator />}
        </div>

        {/* Quick prompts */}
        <div className="border-t border-white/20 px-3 py-2.5 dark:border-white/10">
          <SmartReplies items={quickPrompts} onSelect={send} />
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); setInput(""); }}
          className="flex items-center gap-2 border-t border-white/20 p-3 dark:border-white/10"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ex: "Je cherche un dentiste à Bastos demain"'
            className="flex-1 rounded-full border border-white/30 bg-white/60 px-4 py-2.5 text-sm outline-none backdrop-blur-md transition focus:border-[#6B2D8E] dark:border-white/10 dark:bg-white/5"
          />
          {/* Voice-ready : préparé pour Web Speech API en V2 */}
          <button
            type="button"
            aria-label="Saisie vocale (bientôt)"
            title="Saisie vocale bientôt disponible"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/60 text-muted-foreground backdrop-blur-md transition hover:text-foreground dark:border-white/10 dark:bg-white/5"
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#6B2D8E] to-[#F5A623] text-white shadow-brand transition hover:scale-105 disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
