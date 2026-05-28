import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";
import { Send, Sparkles, Bot, Check, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messagerie — AppointEase" }] }),
  component: MessagesPage,
});

type Msg = { id: number; from: "me" | "them" | "ai"; text: string; ts: string };
type Conv = { id: string; name: string; avatar: string; isAI?: boolean; last: string; unread?: number; messages: Msg[] };

const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

function MessagesPage() {
  const { role } = useRole();

  const initial: Conv[] = [
    {
      id: "ai",
      name: "AppointEase AI (Gemini)",
      avatar: "✨",
      isAI: true,
      last: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      messages: [
        { id: 1, from: "ai", text: role === "client" ? "Bonjour ! Je suis votre assistant AppointEase. Je peux vous aider à trouver un pro, résumer vos rendez-vous ou répondre à vos questions. Que cherchez-vous ?" : "Bonjour ! Je suis votre assistant pro. Je peux vous aider à rédiger des réponses, optimiser votre planning ou analyser vos performances. Que voulez-vous faire ?", ts: now() },
      ],
    },
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
  const [activeId, setActiveId] = useState("ai");
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = convs.find((c) => c.id === activeId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [active?.messages.length, aiTyping]);

  const smartReplies = role === "provider"
    ? ["Bonjour, oui c'est confirmé 😊", "Merci pour votre patience !", "Pouvez-vous me préciser ?"]
    : ["Merci !", "Parfait, à demain.", "Pouvez-vous décaler ?"];

  const send = (text: string) => {
    if (!text.trim()) return;
    const msg: Msg = { id: Date.now(), from: "me", text, ts: now() };
    setConvs((cs) => cs.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, msg], last: text } : c));
    setInput("");

    if (active.isAI) {
      setAiTyping(true);
      setTimeout(() => {
        const reply = mockAIReply(text, role);
        const ai: Msg = { id: Date.now() + 1, from: "ai", text: reply, ts: now() };
        setConvs((cs) => cs.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, ai], last: reply } : c));
        setAiTyping(false);
      }, 1400);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid h-[calc(100vh-10rem)] overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-[320px_1fr]">
        {/* Conv list */}
        <aside className="overflow-y-auto border-b border-border md:border-b-0 md:border-r">
          <div className="border-b border-border p-4">
            <h2 className="text-lg font-bold">Messagerie</h2>
            <p className="text-xs text-muted-foreground">Discussions et assistant IA</p>
          </div>
          <ul>
            {convs.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveId(c.id)}
                  className={`flex w-full items-start gap-3 border-b border-border p-4 text-left transition ${activeId === c.id ? "bg-gradient-brand-soft" : "hover:bg-secondary/50"}`}
                >
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl ${c.isAI ? "bg-gradient-brand text-primary-foreground" : "bg-secondary"}`}>
                    {c.isAI ? <Sparkles className="h-5 w-5" /> : c.avatar}
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
            <div className={`grid h-10 w-10 place-items-center rounded-full text-xl ${active.isAI ? "bg-gradient-brand text-primary-foreground" : "bg-secondary"}`}>
              {active.isAI ? <Bot className="h-5 w-5" /> : active.avatar}
            </div>
            <div>
              <div className="font-semibold">{active.name}</div>
              <div className="text-xs text-muted-foreground">
                {active.isAI ? "Assistant IA · Propulsé par Gemini" : "En ligne"}
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gradient-brand-soft/30 p-4">
            {active.messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm shadow-soft ${
                  m.from === "me"
                    ? "rounded-br-sm bg-gradient-brand text-primary-foreground"
                    : m.from === "ai"
                    ? "rounded-bl-sm border border-primary/20 bg-card"
                    : "rounded-bl-sm bg-card"
                }`}>
                  {m.from === "ai" && (
                    <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-primary"><Sparkles className="h-3 w-3" /> Gemini</div>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${m.from === "me" ? "opacity-80" : "text-muted-foreground"}`}>
                    {m.ts}
                    {m.from === "me" && <CheckCheck className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            ))}
            {aiTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl border border-primary/20 bg-card px-4 py-3 shadow-soft">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          {/* Smart replies (Pro only) */}
          {role === "provider" && !active.isAI && (
            <div className="flex gap-2 overflow-x-auto border-t border-border bg-background/50 px-4 py-2">
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-gradient-brand-soft px-2 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3 w-3" /> IA</span>
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
              placeholder={active.isAI ? "Demandez-moi n'importe quoi…" : "Écrire un message…"}
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

function mockAIReply(input: string, role: "client" | "provider") {
  const i = input.toLowerCase();
  if (role === "client") {
    if (i.includes("coiff")) return "Excellent choix ! 💇🏾‍♀️ À Yaoundé, je recommande Salon Aminata (Bastos, 4.8★) pour les tresses et soins naturels. Voulez-vous que je vous propose des créneaux disponibles cette semaine ?";
    if (i.includes("dent")) return "Pour un dentiste, le Cabinet Dr. Mbarga à Melen est très bien noté (4.9★, 87 avis). Consultations à partir de 10 000 FCFA. Souhaitez-vous prendre rendez-vous ?";
    if (i.includes("rendez") || i.includes("rdv")) return "Voici un résumé de vos rendez-vous à venir :\n• 02/06 à 14h — Salon Aminata (Tresses)\n• 08/06 à 16h — Spa Zen (Massage)\n\nVoulez-vous en ajouter un autre ?";
    return "Je peux vous aider à trouver un prestataire, comparer des prix, ou résumer vos rendez-vous. Quel service recherchez-vous ?";
  } else {
    if (i.includes("plann") || i.includes("optim")) return "📊 Analyse rapide : vos mardis matin sont à 35% d'occupation. Je suggère une promo -20% sur les soins ce créneau, ce qui pourrait générer ~45 000 FCFA supplémentaires/semaine. Voulez-vous l'activer ?";
    if (i.includes("client") || i.includes("répondre")) return "Voici 3 réponses suggérées :\n1. \"Bonjour, votre rendez-vous est bien confirmé. À très bientôt !\"\n2. \"Merci de votre patience, je reviens vers vous dans la journée.\"\n3. \"Pourriez-vous me préciser la prestation souhaitée ?\"";
    if (i.includes("revenu") || i.includes("ca")) return "💰 Votre CA du mois : 385 000 FCFA (+18% vs mois dernier). Top services : Tresses (45%), Coloration (30%). Bravo ! 🎉";
    return "Je peux rédiger vos réponses clients, analyser vos revenus ou optimiser votre planning. Que voulez-vous faire ?";
  }
}
