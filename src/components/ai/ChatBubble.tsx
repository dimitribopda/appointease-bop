import { useState } from "react";
import { BopAvatar } from "./BopAvatar";
import { Sparkles, Smile } from "lucide-react";
import type { ChatMessage } from "@/hooks/useAIChat";
import { ProviderSuggestionCard } from "./ProviderSuggestionCard";
import { AppointmentCard } from "./AppointmentCard";
import { SmartReplies } from "./SmartReplies";
import { formatFCFA } from "@/lib/mock-data";

const REACTIONS = ["👍", "❤️", "🙏", "🔥"];

/** Rendu markdown très léger : transforme **bold** en <strong> */
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-bold text-foreground">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function ChatBubble({
  message,
  onSelectSuggestion,
  onReact,
}: {
  message: ChatMessage;
  onSelectSuggestion: (text: string) => void;
  onReact: (id: string, emoji: string) => void;
}) {
  const [showReactions, setShowReactions] = useState(false);
  const isAI = message.from === "ai";

  return (
    <div className={`flex items-end gap-2 ${isAI ? "justify-start" : "justify-end"}`}>
      {isAI && <BopAvatar size={28} />}
      <div className="group relative max-w-[85%] sm:max-w-[78%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm shadow-soft backdrop-blur-md ${
            isAI
              ? "rounded-bl-sm border border-white/30 bg-white/70 dark:border-white/10 dark:bg-white/5"
              : "rounded-br-sm bg-gradient-to-br from-[#6B2D8E] to-[#F5A623] text-white"
          }`}
        >
          {isAI && (
            <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#6B2D8E] dark:text-[#C084FC]">
              <Sparkles className="h-3 w-3" /> APPOINTEASE AI by BOP
            </div>
          )}
          <p className="whitespace-pre-wrap leading-relaxed">{renderText(message.text)}</p>

          {/* Payloads riches */}
          {message.payload?.kind === "providers" && (
            <div className="mt-3 flex flex-col gap-2">
              {message.payload.items.map((p) => (
                <ProviderSuggestionCard key={p.id} provider={p} />
              ))}
            </div>
          )}

          {message.payload?.kind === "appointments" && (
            <div className="mt-3 flex flex-col gap-2">
              {message.payload.items.map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
              ))}
            </div>
          )}

          {message.payload?.kind === "appointment" && (
            <div className="mt-3">
              <AppointmentCard appointment={message.payload.item} />
            </div>
          )}

          {message.payload?.kind === "reminders" && (
            <div className="mt-3 flex flex-col gap-2">
              {message.payload.items.map((a) => (
                <AppointmentCard key={a.id} appointment={a} />
              ))}
            </div>
          )}

          {message.payload?.kind === "smart-replies" && (
            <div className="mt-3">
              <SmartReplies items={message.payload.items} onSelect={onSelectSuggestion} variant="reply" />
            </div>
          )}

          {message.payload?.kind === "analytics" && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Stat label="CA mois" value={formatFCFA(message.payload.data.monthRevenue)} />
              <Stat label="Croissance" value={`+${message.payload.data.monthGrowth}%`} />
              <Stat label="Meilleur jour" value={message.payload.data.bestDay} />
              <Stat label="Top service" value={message.payload.data.bestService} />
            </div>
          )}

          {message.payload?.kind === "crm" && (
            <div className="mt-3 flex flex-col gap-1.5">
              {message.payload.items.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-white/30 bg-white/60 px-3 py-2 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5"
                >
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-muted-foreground">{c.visits} visites · {formatFCFA(c.totalSpent)}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      c.tag === "VIP"
                        ? "bg-gradient-to-r from-[#6B2D8E] to-[#F5A623] text-white"
                        : c.tag === "No-show"
                          ? "bg-red-500/20 text-red-600 dark:text-red-300"
                          : "bg-secondary text-foreground"
                    }`}
                  >
                    {c.tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {message.payload?.kind === "marketing" && (
            <div className="mt-3 flex flex-col gap-2">
              {message.payload.items.map((t) => (
                <div key={t.title} className="rounded-xl border border-white/30 bg-white/60 p-3 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  <p className="mb-1 font-bold text-[#6B2D8E] dark:text-[#C084FC]">{t.title}</p>
                  <p className="text-muted-foreground">{t.body}</p>
                </div>
              ))}
            </div>
          )}

          {message.payload?.kind === "calendar-tips" && (
            <ul className="mt-3 space-y-1.5 text-xs">
              {message.payload.tips.map((tip) => (
                <li key={tip} className="rounded-lg border border-white/30 bg-white/60 px-3 py-2 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                  💡 {tip}
                </li>
              ))}
            </ul>
          )}

          <div className={`mt-1.5 flex items-center justify-between gap-2 text-[10px] ${isAI ? "text-muted-foreground" : "text-white/80"}`}>
            <span>{message.ts}</span>
            {isAI && (
              <button
                aria-label="Ajouter une réaction"
                onClick={() => setShowReactions((s) => !s)}
                className="opacity-0 transition group-hover:opacity-100"
              >
                <Smile className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-1 flex gap-1">
              {message.reactions.map((r) => (
                <span key={r} className="rounded-full border border-white/40 bg-white/80 px-1.5 text-[11px] dark:border-white/10 dark:bg-black/30">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        {showReactions && isAI && (
          <div className="absolute -bottom-3 left-2 flex gap-0.5 rounded-full border border-white/30 bg-white/90 px-1.5 py-0.5 shadow-soft backdrop-blur-md dark:border-white/10 dark:bg-black/60">
            {REACTIONS.map((r) => (
              <button
                key={r}
                onClick={() => { onReact(message.id, r); setShowReactions(false); }}
                className="text-sm transition hover:scale-125"
              >
                {r}
              </button>
            ))}
          </div>
        )}

        {isAI && message.suggestions && (
          <div className="mt-2">
            <SmartReplies items={message.suggestions} onSelect={onSelectSuggestion} />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/30 bg-white/60 px-3 py-2 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
