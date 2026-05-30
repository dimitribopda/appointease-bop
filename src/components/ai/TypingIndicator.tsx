import { BopAvatar } from "./BopAvatar";

/** Animation de saisie premium pour APPOINTEASE AI by BOP */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BopAvatar size={28} />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/30 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B2D8E] dark:text-[#C084FC]">
          BOP réfléchit
        </span>
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6B2D8E] [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9333EA] [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F5A623] [animation-delay:240ms]" />
      </div>
    </div>
  );
}

/** Skeleton de chargement initial */
export function MessageSkeleton() {
  return (
    <div className="flex items-end gap-2">
      <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-white/30 dark:bg-white/10" />
      <div className="space-y-2">
        <div className="h-3 w-32 animate-pulse rounded bg-white/30 dark:bg-white/10" />
        <div className="h-3 w-48 animate-pulse rounded bg-white/30 dark:bg-white/10" />
      </div>
    </div>
  );
}
