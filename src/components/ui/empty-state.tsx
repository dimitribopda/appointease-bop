import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaTo,
  onCta,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
  onCta?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/40 p-10 text-center shadow-soft backdrop-blur-md dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition hover:opacity-95"
        >
          {ctaLabel}
        </Link>
      )}
      {ctaLabel && !ctaTo && onCta && (
        <button
          onClick={onCta}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition hover:opacity-95"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
