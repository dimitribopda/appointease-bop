import { createFileRoute } from "@tanstack/react-router";
import { formatFCFA } from "@/lib/mock-data";
import { TrendingUp, Users, Calendar, Wallet, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/pro/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard Pro — AppointEase" }] }),
  component: ProDashboard,
});

function ProDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Bonsoir, Salon Aminata 💇🏾‍♀️</h1>
          <p className="mt-1 text-sm text-muted-foreground">Voici votre activité du jour, 28 mai 2026.</p>
        </div>
        <span className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-brand">
          Forfait Business actif
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Wallet className="h-5 w-5" />} label="Chiffre d'affaires (mois)" value={formatFCFA(385000)} trend="+18%" />
        <StatCard icon={<Calendar className="h-5 w-5" />} label="RDV cette semaine" value="42" trend="+6" />
        <StatCard icon={<Users className="h-5 w-5" />} label="Nouveaux clients" value="12" trend="+3" />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Taux d'occupation" value="78%" trend="+5%" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Prochains rendez-vous</h2>
          <ul className="space-y-3">
            {[
              { time: "14:00", client: "Aïssatou N.", service: "Tresses africaines", price: 15000 },
              { time: "15:30", client: "Marie K.", service: "Coloration", price: 20000 },
              { time: "17:00", client: "Sandra T.", service: "Brushing", price: 5000 },
            ].map((rdv, i) => (
              <li key={i} className="flex items-center gap-4 rounded-xl border border-border p-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-brand-soft text-sm font-bold text-gradient-brand">
                  {rdv.time}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{rdv.client}</div>
                  <div className="text-xs text-muted-foreground">{rdv.service}</div>
                </div>
                <div className="text-sm font-semibold">{formatFCFA(rdv.price)}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-gradient-brand p-5 text-primary-foreground shadow-brand">
            <p className="text-xs opacity-90">Votre note moyenne</p>
            <div className="mt-1 text-4xl font-bold">4.8 ★</div>
            <p className="mt-1 text-xs opacity-90">Basé sur 124 avis vérifiés</p>
            <button className="mt-4 rounded-full bg-background/20 px-4 py-2 text-xs font-semibold backdrop-blur">
              Voir tous les avis
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold">💡 Suggestion IA</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Les mardis matin sont sous-réservés. Activez une promo -20% pour booster votre taux d'occupation.
            </p>
            <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Configurer <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand-soft text-primary">{icon}</div>
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">{trend}</span>
      </div>
      <div className="mt-4 text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
