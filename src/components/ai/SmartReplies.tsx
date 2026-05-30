import { Sparkles } from "lucide-react";

/** Boutons de suggestions cliquables sous un message IA */
export function SmartReplies({
  items,
  onSelect,
  variant = "suggestion",
}: {
  items: string[];
  onSelect: (text: string) => void;
  variant?: "suggestion" | "reply";
}) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className={`group inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition hover:scale-[1.03] ${
            variant === "reply"
              ? "border-[#6B2D8E]/40 bg-gradient-to-r from-[#6B2D8E]/10 to-[#F5A623]/10 text-foreground hover:border-[#6B2D8E]/70"
              : "border-white/30 bg-white/60 text-foreground hover:border-[#6B2D8E]/50 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          }`}
        >
          {variant === "reply" && <Sparkles className="h-3 w-3 text-[#F5A623]" />}
          {s}
        </button>
      ))}
    </div>
  );
}
