import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, NEIGHBORHOODS, PROVIDERS, formatFCFA } from "@/lib/mock-data";
import { MapPin, Star, SlidersHorizontal, BadgeCheck, SearchX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProviderRowSkeleton } from "@/components/ui/provider-card-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

type SearchParams = { q?: string; hood?: string; cat?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: (s.q as string) || "",
    hood: (s.hood as string) || "",
    cat: (s.cat as string) || "",
  }),
  head: () => ({ meta: [{ title: "Recherche — AppointEase" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q, hood, cat } = Route.useSearch();
  const [cat2, setCat2] = useState(cat || "");
  const [hood2, setHood2] = useState(hood || "");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [query, setQuery] = useState(q || "");

  const results = useMemo(() => {
    return PROVIDERS.filter((p) => {
      if (cat2 && p.category !== cat2) return false;
      if (hood2 && p.neighborhood !== hood2) return false;
      if (p.rating < minRating) return false;
      if (p.priceFrom > maxPrice) return false;
      if (query) {
        const s = query.toLowerCase();
        if (!p.name.toLowerCase().includes(s) && !p.category.toLowerCase().includes(s) && !p.description.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [cat2, hood2, minRating, maxPrice, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un service ou un pro…"
          className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-sm shadow-soft outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="space-y-5 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4" /> Filtres
          </div>

          <FilterBlock title="Catégorie">
            <select value={cat2} onChange={(e) => setCat2(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="">Toutes</option>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </FilterBlock>

          <FilterBlock title="Quartier">
            <select value={hood2} onChange={(e) => setHood2(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="">Tous</option>
              {NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </FilterBlock>

          <FilterBlock title={`Note min : ${minRating}★`}>
            <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="w-full accent-[var(--brand-violet)]" />
          </FilterBlock>

          <FilterBlock title={`Prix max : ${formatFCFA(maxPrice)}`}>
            <input type="range" min={1000} max={50000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-[var(--brand-violet)]" />
          </FilterBlock>

          <button
            onClick={() => { setCat2(""); setHood2(""); setMinRating(0); setMaxPrice(50000); setQuery(""); }}
            className="w-full rounded-lg border border-border py-2 text-sm hover:bg-secondary"
          >
            Réinitialiser
          </button>
        </aside>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length}</span> prestataire(s) trouvé(s)
          </p>
          <div className="space-y-4">
            {results.map((p) => (
              <Link
                key={p.id}
                to="/provider/$id"
                params={{ id: p.id }}
                className="group flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/40 p-4 backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-brand dark:border-white/10 dark:bg-black/40 sm:flex-row"
              >
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-44 sm:shrink-0">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {CATEGORIES.find((c) => c.slug === p.category)?.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-semibold">
                      <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                      {p.rating} <span className="text-muted-foreground">({p.reviews})</span>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {p.neighborhood}, {p.city}
                    </span>
                    <span className="text-sm font-semibold text-gradient-brand">Dès {formatFCFA(p.priceFrom)}</span>
                  </div>
                </div>
              </Link>
            ))}
            {results.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
                Aucun prestataire ne correspond à vos critères.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-muted-foreground">{title}</label>
      {children}
    </div>
  );
}
