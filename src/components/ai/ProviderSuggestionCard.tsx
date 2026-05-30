import { Star, MapPin, BadgeCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatFCFA, type Provider } from "@/lib/mock-data";

/** Carte prestataire compacte affichée dans le chat IA */
export function ProviderSuggestionCard({ provider }: { provider: Provider }) {
  return (
    <Link
      to="/provider/$id"
      params={{ id: provider.id }}
      className="group flex items-center gap-3 rounded-2xl border border-white/30 bg-white/60 p-2.5 shadow-soft backdrop-blur-md transition hover:scale-[1.02] hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      <img
        src={provider.image}
        alt={provider.name}
        loading="lazy"
        className="h-14 w-14 shrink-0 rounded-xl object-cover transition group-hover:scale-105"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="truncate text-sm font-bold">{provider.name}</p>
          {provider.verified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#6B2D8E]" />}
        </div>
        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="h-3 w-3" /> {provider.neighborhood}, {provider.city}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-0.5 font-semibold text-[#F5A623]">
            <Star className="h-3 w-3 fill-current" /> {provider.rating}
          </span>
          <span className="text-muted-foreground">dès {formatFCFA(provider.priceFrom)}</span>
        </div>
      </div>
    </Link>
  );
}
