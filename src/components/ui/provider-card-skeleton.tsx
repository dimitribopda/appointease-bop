export function ProviderCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-black/40">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function ProviderRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/40 p-4 backdrop-blur-md dark:border-white/10 dark:bg-black/40 sm:flex-row">
      <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-muted sm:h-32 sm:w-44 sm:shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function AppointmentSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="h-20 w-20 animate-pulse rounded-xl bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
