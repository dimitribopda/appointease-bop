import { createFileRoute, Link } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";
import { Send, CheckCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messagerie — AppointEase" }] }),
  component: MessagesPage,
});

type Msg = { id: number; from: "me" | "them"; text: string; ts: string };
type Conv = { id: string; name: string; avatar: string; last: string; unread?: number; messages: Msg[] };

const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

function MessagesPage() {
  const { role } = useRole();

  const initial: Conv[] = [
    {
      id: "1",
      name: role === "client" ? "Salon Aminata" : "Aïssatou N.",
      avatar: role === "client" ? "💇🏾‍♀️" : "👩🏾",
      last: "Parfait, à demain 14h !",
      unread: 1,
      messages: [
        { id: 1, from: "them", text: "Bonjour, votre rendez-vous de demain est bien confirmé 😊", ts: "10:24" },
        { id: 2, from: "me", text: "Merci ! Je peux apporter mes propres extensions ?", ts: "10:25" },
        { id: 3, from: "them", text: "Bien sûr, aucun souci. À demain !", ts: "10:26" },
      ],
    },
    {
      id: "2",
      name: role === "client" ? "Cabinet Dr. Mbarga" : "Marie K.",
      avatar: role === "client" ? "🦷" : "👨🏾",
      last: "Pensez à venir 10 min en avance.",
      messages: [
        { id: 1, from: "them", text: "Bonjour, pensez à venir 10 min en avance pour les formalités.", ts: "Hier" },
      ],
    },
  ];

  const [convs, setConvs] = useState(initial);
  const [activeId, setActiveId] = useState("1");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = convs.find((c) => c.id === activeId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [active?.messages.length]);

  const smartReplies = role === "provider"
    ? ["Bonjour, oui c'est confirmé 😊", "Merci pour votre patience !", "Pouvez-vous me préciser ?"]
    : ["Merci !", "Parfait, à demain.", "Pouvez-vous décaler ?"];

  const send = (text: string) => {
    if (!text.trim()) return;
    const msg: Msg = { id: Date.now(), from: "me", text, ts: now() };
    setConvs((cs) => cs.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, msg], last: text } : c));
    setInput("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* AI banner */}
      <Link
        to="/ai-assistant"
        className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-[hsl(280_85%_55%/0.15)] to-[hsl(25_95%_55%/0.15)] p-3 backdrop-blur-md transition hover:scale-[1.01] dark:border-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[hsl(280_85%_55%)] to-[hsl(25_95%_55%)] text-xs font-black text-white">BOP</span>
          <div>
            <div className="text-sm font-bold uppercase tracking-wide">APPOINTEASE by BOP</div>
            <div className="text-xs text-muted-foreground">Votre assistant IA dédié · Espace séparé</div>
          </div>
        </div>
        <Sparkles className="h-4 w-4 text-[hsl(280_85%_55%)]" />
      </Link>

      <div className="grid h-[calc(100vh-14rem)] overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-soft backdrop-blur-lg dark:border-white/10 dark:bg-black/40 md:grid-cols-[320px_1fr]">
        {/* Conv list */}
        <aside className="overflow-y-auto border-b border-white/20 bg-white/30 backdrop-blur-md dark:border-white/10 dark:bg-black/30 md:border-b-0 md:border-r">
          <div className="border-b border-border p-4">
            <h2 className="text-lg font-bold">Messagerie</h2>
            <p className="text-xs text-muted-foreground">Discussions avec {role === "client" ? "vos prestataires" : "vos clients"}</p>
          </div>
          <ul>
            {/* Contact IA permanent — épinglé en tête de liste */}
            <li>
              <Link
                to="/ai-assistant"
                className="flex w-full items-start gap-3 border-b border-border p-4 text-left transition hover:bg-gradient-to-r hover:from-[#6B2D8E]/10 hover:to-[#F5A623]/10"
              >
                <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full p-[2px]" style={{ background: "conic-gradient(from 180deg, #6B2D8E, #9333EA, #F5A623, #6B2D8E)" }}>
                  <div className="grid h-full w-full place-items-center rounded-full bg-[#0b0b1a] text-[10px] font-black text-white">BOP</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold uppercase tracking-wide">APPOINTEASE AI by BOP</span>
                    <span className="rounded-full bg-gradient-to-r from-[#6B2D8E] to-[#F5A623] px-1.5 text-[10px] font-bold text-white">IA</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">Votre assistant intelligent · Toujours en ligne</p>
                </div>
              </Link>
            </li>
            {convs.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-start gap-3 border-b border-border p-4 text-left transition ${activeId === c.id ? "bg-gradient-brand-soft" : "hover:bg-secondary/50"}`}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-xl">
                    {c.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold">{c.name}</span>
                      {c.unread && <span className="rounded-full bg-gradient-brand px-1.5 text-xs font-bold text-primary-foreground">{c.unread}</span>}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{c.last}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat */}
        <section className="flex min-h-0 flex-col">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-xl">{active.avatar}</div>
            <div>
              <div className="font-semibold">{active.name}</div>
              <div className="text-xs text-muted-foreground">En ligne</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-brand-soft/30 p-4">
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm shadow-soft backdrop-blur-md ${
                  m.from === "me"
                    ? "rounded-br-sm bg-gradient-brand text-primary-foreground"
                    : "rounded-bl-sm border border-white/30 bg-white/60 dark:border-white/10 dark:bg-black/50"
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${m.from === "me" ? "opacity-80" : "text-muted-foreground"}`}>
                    {m.ts}
                    {m.from === "me" && <CheckCheck className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {role === "provider" && (
            <div className="flex gap-2 overflow-x-auto border-t border-border bg-background/50 px-4 py-2">
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-brand-soft px-2 py-1 text-xs font-semibold text-primary">Réponses rapides</span>
              {smartReplies.map((s) => (
                <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-xs hover:bg-secondary">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrire un message…"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-brand">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
