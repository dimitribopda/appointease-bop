import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CATEGORIES, NEIGHBORHOODS, PROVIDERS, formatFCFA } from "@/lib/mock-data";
import { Search, MapPin, Star, ArrowRight, Sparkles, ShieldCheck, Smartphone, BadgeCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AppointEase — Réservez en ligne à Yaoundé & Douala" },
      { name: "description", content: "Trouvez et réservez instantanément un rendez-vous chez un pro au Cameroun. Coiffure, santé, mécanique et plus." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [hood, setHood] = useState("");

  const featured = PROVIDERS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand-soft" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand-orange opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-brand-orange" /> Nouveau au Cameroun · Yaoundé & Douala
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
              Votre prochain rendez-vous,<br />
              <span className="text-gradient-brand">en 2 clics.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Coiffeurs, dentistes, mécaniciens, coachs — trouvez le bon pro près de chez vous et réservez en ligne, payez via Orange Money ou MTN MoMo.
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (hood) params.set("hood", hood);
              navigate({ to: "/search", search: Object.fromEntries(params) as any });
            }}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Métier ou nom (coiffure, dentiste…)"
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="flex flex-1 items-center gap-2 px-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <select
                value={hood}
                onChange={(e) => setHood(e.target.value)}
                className="w-full bg-transparent py-3 text-sm outline-none"
              >
                <option value="">Tous les quartiers</option>
                {NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button className="rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition hover:opacity-95">
              Rechercher
            </button>
          </form>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            {["Coiffure Bastos", "Dentiste Melen", "Garage Mvan", "Spa Bonapriso"].map((t) => (
              <button
                key={t}
                onClick={() => { setQ(t.split(" ")[0].toLowerCase()); }}
                className="rounded-full border border-border bg-card/60 px-3 py-1 backdrop-blur hover:bg-card"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Explorez par catégorie</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tous les services dont vous avez besoin au quotidien.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/search"
              search={{ cat: c.slug } as any}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-brand"
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-3 text-sm font-semibold">{c.label}</div>
              <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured providers */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold sm:text-3xl">Pros mis en avant</h2>
          <Link to="/search" className="text-sm font-medium text-primary hover:underline">Voir tout →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Link
              key={p.id}
              to="/provider/$id"
              params={{ id: p.id }}
              className="group overflow-hidden rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand dark:border-white/10 dark:bg-black/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                {p.verified && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-primary shadow-soft backdrop-blur dark:bg-black/70">
                    <BadgeCheck className="h-3 w-3" /> Vérifié
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="flex items-center gap-1 font-semibold">
                    {p.name}
                    {p.verified && <BadgeCheck className="h-4 w-4 text-primary" />}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-semibold">
                    <Star className="h-3.5 w-3.5 fill-brand-orange text-brand-orange" />
                    {p.rating}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.neighborhood}, {p.city}</p>
                <div className="mt-3 text-sm font-semibold text-gradient-brand">Dès {formatFCFA(p.priceFrom)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-5 rounded-3xl border border-border bg-gradient-brand-soft p-6 sm:p-10 md:grid-cols-3">
          <ValueProp icon={<Smartphone className="h-5 w-5" />} title="Paiement Mobile Money" desc="Orange Money & MTN MoMo intégrés. Payez en sécurité depuis votre téléphone." />
          <ValueProp icon={<ShieldCheck className="h-5 w-5" />} title="Pros vérifiés" desc="Chaque prestataire est validé par notre équipe locale à Yaoundé et Douala." />
          <ValueProp icon={<Sparkles className="h-5 w-5" />} title="Assistant IA inclus" desc="Notre IA Gemini vous aide à trouver le bon pro et résume vos RDV." />
        </div>
      </section>
    </div>
  );
}

function ValueProp({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card/80 p-5 backdrop-blur">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
