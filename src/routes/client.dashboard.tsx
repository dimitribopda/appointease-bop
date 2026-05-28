import { createFileRoute, Link } from "@tanstack/react-router";
import { PROVIDERS, formatFCFA } from "@/lib/mock-data";
import { Calendar, Clock, MapPin, User2, Mail, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/client/dashboard")({
  head: () => ({ meta: [{ title: "Mes rendez-vous — AppointEase" }] }),
  component: ClientDashboard,
});

const upcoming = [
  { id: 1, provider: PROVIDERS[0], service: "Tresses africaines", date: "2026-06-02", time: "14:00", price: 15000, status: "Confirmé" },
  { id: 2, provider: PROVIDERS[3], service: "Massage relaxant 60min", date: "2026-06-08", time: "16:00", price: 20000, status: "En attente" },
];
const past = [
  { id: 3, provider: PROVIDERS[1], service: "Détartrage", date: "2026-05-12", time: "09:00", price: 25000, status: "Terminé" },
  { id: 4, provider: PROVIDERS[2], service: "Vidange complète", date: "2026-04-28", time: "11:00", price: 15000, status: "Terminé" },
];

function ClientDashboard() {
  const [tab, setTab] = useState<"upcoming" | "past" | "profile">("upcoming");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 rounded-3xl bg-gradient-brand p-6 text-primary-foreground shadow-brand sm:p-8">
        <p className="text-sm opacity-90">Bonjour 👋</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Aïssatou Nkoulou</h1>
        <p className="mt-1 text-sm opacity-90">Vous avez {upcoming.length} rendez-vous à venir.</p>
      </div>

      <div className="mb-5 flex gap-1 rounded-full border border-border bg-card p-1 text-sm font-medium shadow-soft">
        {([["upcoming", "À venir"], ["past", "Passés"], ["profile", "Profil"]] as const).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 rounded-full px-4 py-2 transition ${tab === k ? "bg-gradient-brand text-primary-foreground shadow-brand" : "text-muted-foreground"}`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "upcoming" && <AppointmentList items={upcoming} />}
      {tab === "past" && <AppointmentList items={past} />}
      {tab === "profile" && <Profile />}
    </div>
  );
}

function AppointmentList({ items }: { items: typeof upcoming }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Aucun rendez-vous.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((a) => (
        <div key={a.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <img src={a.provider.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to="/provider/$id" params={{ id: a.provider.id }} className="font-semibold hover:text-primary">{a.provider.name}</Link>
                <div className="text-sm text-muted-foreground">{a.service}</div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${a.status === "Confirmé" ? "bg-success/15 text-success" : a.status === "Terminé" ? "bg-muted text-muted-foreground" : "bg-brand-orange/15 text-brand-orange"}`}>
                {a.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {a.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.time}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {a.provider.neighborhood}</span>
              <span className="font-semibold text-gradient-brand">{formatFCFA(a.price)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Profile() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field icon={<User2 className="h-4 w-4" />} label="Nom complet" value="Aïssatou Nkoulou" />
      <Field icon={<Mail className="h-4 w-4" />} label="Email" value="aissatou@example.cm" />
      <Field icon={<Phone className="h-4 w-4" />} label="Téléphone" value="+237 6 77 12 34 56" />
      <Field icon={<MapPin className="h-4 w-4" />} label="Ville" value="Yaoundé, Bastos" />
    </div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">{icon} {label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
