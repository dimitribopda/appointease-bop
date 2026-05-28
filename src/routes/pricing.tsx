import { createFileRoute } from "@tanstack/react-router";
import { PLANS, formatFCFA } from "@/lib/mock-data";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { PaymentModal } from "./provider.$id";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [
    { title: "Forfaits Pro — AppointEase" },
    { name: "description", content: "Choisissez votre abonnement AppointEase : Artisan 2 000 F, Business 5 000 F, Expert 10 000 F / mois." },
  ] }),
  component: PricingPage,
});

function PricingPage() {
  const [pay, setPay] = useState<{ amount: number; name: string } | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-brand-orange" /> Sans engagement · Résiliable à tout moment
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
          Des forfaits <span className="text-gradient-brand">pensés pour vous</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Que vous soyez artisan indépendant ou clinique, AppointEase grandit avec votre activité.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-3xl border p-6 ${
              plan.highlighted
                ? "border-transparent bg-gradient-brand text-primary-foreground shadow-brand"
                : "border-border bg-card"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                Le plus populaire
              </span>
            )}
            <div className="text-sm font-semibold uppercase tracking-wide opacity-90">{plan.name}</div>
            <p className={`mt-1 text-sm ${plan.highlighted ? "opacity-90" : "text-muted-foreground"}`}>{plan.tagline}</p>
            <div className="mt-5">
              <span className="text-4xl font-bold">{formatFCFA(plan.price)}</span>
              <span className={`text-sm ${plan.highlighted ? "opacity-90" : "text-muted-foreground"}`}> / mois</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "" : "text-success"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setPay({ amount: plan.price, name: plan.name })}
              className={`mt-6 rounded-xl py-3 text-sm font-semibold transition ${
                plan.highlighted
                  ? "bg-background text-foreground hover:opacity-90"
                  : "bg-gradient-brand text-primary-foreground shadow-brand"
              }`}
            >
              Choisir {plan.name}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-border bg-gradient-brand-soft p-8 text-center">
        <h3 className="text-xl font-bold">Vous avez plusieurs établissements ?</h3>
        <p className="mt-1 text-sm text-muted-foreground">Parlons d'une offre Entreprise sur-mesure.</p>
        <button className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">Nous contacter</button>
      </div>

      {pay && (
        <PaymentModal
          amount={pay.amount}
          label={`abonnement ${pay.name}`}
          onClose={() => setPay(null)}
          onSuccess={() => setPay(null)}
        />
      )}
    </div>
  );
}
