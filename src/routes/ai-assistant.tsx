import { createFileRoute } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";
import { Send, Sparkles, MapPin, Calendar, Search, TrendingUp, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "APPOINTEASE by BOP — Assistant IA" }] }),
  component: AIAssistantPage,
});

type Msg = { id: number; from: "me" | "ai"; text: string; ts: string };

const now = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

function AIAssistantPage() {
  const { role } = useRole();

  const welcome: Msg = {
    id: 1,
    from: "ai",
    text:
      role === "client"
        ? "Bonjour, je suis APPOINTEASE CRÉÉ PAR BOP, votre assistant personnel. Je peux vous aider à trouver le meilleur prestataire à Yaoundé ou Douala, comparer les prix et organiser vos rendez-vous. Que recherchez-vous ?"
        : "Bonjour, je suis APPOINTEASE CRÉÉ PAR BOP, votre assistant pro. Je peux rédiger vos réponses clients, analyser vos revenus et optimiser votre planning à Yaoundé ou Douala. Par où commençons-nous ?",
    ts: now(),
  };

  const [messages, setMessages] = useState<Msg[]>([welcome]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const suggestions =
    role === "client"
      ? [
          { icon: <Search className="h-3.5 w-3.5" />, text: "Trouve un coiffeur à Bastos, Yaoundé" },
          { icon: <MapPin className="h-3.5 w-3.5" />, text: "Meilleurs spas à Akwa, Douala" },
          { icon: <Calendar className="h-3.5 w-3.5" />, text: "Résume mes prochains rendez-vous" },
          { icon: <Wand2 className="h-3.5 w-3.5" />, text: "Compare 2 dentistes près de Melen" },
        ]
      : [
          { icon: <TrendingUp className="h-3.5 w-3.5" />, text: "Analyse mon CA du mois" },
          { icon: <Wand2 className="h-3.5 w-3.5" />, text: "Optimise mon planning à Douala" },
          { icon: <Calendar className="h-3.5 w-3.5" />, text: "Rédige une relance client" },
          { icon: <Sparkles className="h-3.5 w-3.5" />, text: "Suggère une promo Yaoundé" },
        ];

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now(), from: "me", text, ts: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply: Msg = { id: Date.now() + 1, from: "ai", text: mockReply(text, role), ts: now() };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 1300);
  };

  return (
    <div className="relative mx-auto min-h-[calc(100vh-8rem)] max-w-5xl px-4 py-6 sm:px-6">
      {/* Ambient gradient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[hsl(280_85%_55%/0.35)] blur-3xl" />
        <div className="absolute top-40 right-10 h-80 w-80 rounded-full bg-[hsl(25_95%_55%/0.30)] blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[hsl(260_90%_60%/0.25)] blur-3xl" />
      </div>

      {/* Header card */}
      <div className="mb-4 flex items-center gap-4 rounded-3xl border border-white/20 bg-white/40 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        <BopAvatar size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
              <span className="bg-gradient-to-r from-[hsl(280_85%_60%)] via-[hsl(300_80%_60%)] to-[hsl(25_95%_55%)] bg-clip-text text-transparent">
                APPOINTEASE by BOP
              </span>
            </h1>
            <span className="rounded-full border border-white/20 bg-white/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-md dark:border-white/10 dark:bg-black/30">
              IA · v1
            </span>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Assistant intelligent dédié · Yaoundé & Douala · Disponible 24/7
          </p>
        </div>
      </div>

      {/* Chat shell */}
      <div className="flex h-[calc(100vh-18rem)] min-h-[420px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
        {/* Subheader under avatar */}
        <div className="flex items-center gap-3 border-b border-white/20 px-4 py-3 dark:border-white/10">
          <BopAvatar size={40} />
          <div>
            <div className="text-sm font-bold uppercase tracking-wide">APPOINTEASE by BOP</div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              En ligne · Réponses instantanées
            </div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex items-end gap-2 ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              {m.from === "ai" && <BopAvatar size={28} />}
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-soft backdrop-blur-md ${
                  m.from === "me"
                    ? "rounded-br-sm bg-gradient-to-br from-[hsl(280_85%_55%)] to-[hsl(25_95%_55%)] text-white"
                    : "rounded-bl-sm border border-white/30 bg-white/70 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                {m.from === "ai" && (
                  <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(280_85%_55%)] dark:text-[hsl(280_90%_75%)]">
                    <Sparkles className="h-3 w-3" /> APPOINTEASE by BOP
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                <div className={`mt-1 text-right text-[10px] ${m.from === "me" ? "text-white/80" : "text-muted-foreground"}`}>{m.ts}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <BopAvatar size={28} />
              <div className="flex items-center gap-1 rounded-2xl border border-white/30 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[hsl(280_85%_55%)] [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[hsl(300_80%_60%)] [animation-delay:120ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[hsl(25_95%_55%)] [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        <div className="flex gap-2 overflow-x-auto border-t border-white/20 px-3 py-2.5 dark:border-white/10">
          {suggestions.map((s) => (
            <button
              key={s.text}
              onClick={() => send(s.text)}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/30 bg-white/60 px-3 py-1.5 text-xs font-medium text-foreground transition hover:scale-[1.03] hover:border-[hsl(280_85%_55%/0.5)] hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <span className="text-[hsl(280_85%_55%)] dark:text-[hsl(280_90%_75%)]">{s.icon}</span>
              {s.text}
            </button>
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-white/20 p-3 dark:border-white/10"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Demandez quelque chose à APPOINTEASE by BOP…"
            className="flex-1 rounded-full border border-white/30 bg-white/60 px-4 py-2.5 text-sm outline-none backdrop-blur-md transition focus:border-[hsl(280_85%_55%)] dark:border-white/10 dark:bg-white/5"
          />
          <button
            type="submit"
            className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[hsl(280_85%_55%)] to-[hsl(25_95%_55%)] text-white shadow-brand transition hover:scale-105"
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function BopAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 rounded-full p-[2px]"
      style={{
        width: size,
        height: size,
        background: "conic-gradient(from 180deg, hsl(280 85% 55%), hsl(300 80% 60%), hsl(25 95% 55%), hsl(280 85% 55%))",
      }}
    >
      <div className="absolute inset-0 rounded-full opacity-60 blur-md" style={{ background: "conic-gradient(from 180deg, hsl(280 85% 55%), hsl(25 95% 55%))" }} />
      <div className="relative grid h-full w-full place-items-center rounded-full bg-[hsl(230_35%_8%)] text-white">
        <span
          className="font-black tracking-tighter"
          style={{
            fontSize: size * 0.36,
            background: "linear-gradient(135deg, hsl(280 90% 80%), hsl(25 95% 70%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          BOP
        </span>
      </div>
    </div>
  );
}

function mockReply(input: string, role: "client" | "provider") {
  const i = input.toLowerCase();
  if (role === "client") {
    if (i.includes("coiff") || i.includes("bastos")) return "💇🏾‍♀️ À Bastos (Yaoundé), Salon Aminata (4.8★) est excellent pour les tresses et soins naturels. Créneaux dispo cette semaine : mardi 14h, jeudi 10h. Je réserve ?";
    if (i.includes("douala") || i.includes("akwa") || i.includes("spa")) return "🌿 À Akwa (Douala) : Spa Zen (4.9★) et Lotus Wellness (4.7★). Massages dès 15 000 FCFA. Vous préférez lequel ?";
    if (i.includes("dent") || i.includes("melen")) return "🦷 Près de Melen : Cabinet Dr. Mbarga (4.9★, 87 avis, dès 10 000 FCFA) et Clinique Dentaire Plus (4.6★, dès 12 000 FCFA). Mbarga a plus de disponibilités cette semaine.";
    if (i.includes("rdv") || i.includes("rendez")) return "📅 Vos prochains rendez-vous :\n• 02/06 · 14h — Salon Aminata (Tresses)\n• 08/06 · 16h — Spa Zen Douala (Massage)\n\nVoulez-vous en ajouter un ?";
    return "Je peux vous aider à Yaoundé ou Douala : trouver un pro, comparer les prix, ou organiser vos rendez-vous. Que recherchez-vous ?";
  } else {
    if (i.includes("ca") || i.includes("revenu") || i.includes("mois")) return "💰 CA du mois : 385 000 FCFA (+18% vs mois dernier). Top services : Tresses 45%, Coloration 30%. Continuez ! 🎉";
    if (i.includes("plann") || i.includes("optim") || i.includes("douala")) return "📊 Vos mardis matin à Douala sont à 35% d'occupation. Suggestion : promo -20% sur ce créneau → ~45 000 FCFA/sem supplémentaires. J'active ?";
    if (i.includes("relance") || i.includes("client")) return "✍️ Proposition :\n« Bonjour, on ne vous a pas vu depuis un moment 🌸. En remerciement, profitez de -15% sur votre prochain soin chez nous. À bientôt ! »";
    if (i.includes("promo") || i.includes("yaound")) return "🎯 Promo Yaoundé suggérée : « -20% sur les tresses du mercredi (10h-13h) » — affichage push sur l'app pour les clientes dans un rayon de 5 km.";
    return "Je peux analyser vos revenus, rédiger des messages clients, ou optimiser votre planning à Yaoundé/Douala. Par quoi on commence ?";
  }
}
