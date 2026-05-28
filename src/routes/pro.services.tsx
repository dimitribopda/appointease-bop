import { createFileRoute } from "@tanstack/react-router";
import { formatFCFA } from "@/lib/mock-data";
import { Plus, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/pro/services")({
  head: () => ({ meta: [{ title: "Services & Tarifs — AppointEase" }] }),
  component: ProServices,
});

type S = { id: number; name: string; duration: number; price: number };

function ProServices() {
  const [services, setServices] = useState<S[]>([
    { id: 1, name: "Tresses africaines", duration: 180, price: 15000 },
    { id: 2, name: "Shampoing + Brushing", duration: 60, price: 5000 },
    { id: 3, name: "Coloration", duration: 120, price: 20000 },
  ]);
  const [form, setForm] = useState({ name: "", duration: 60, price: 5000 });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return toast.error("Nom requis");
    setServices((s) => [...s, { id: Date.now(), ...form }]);
    setForm({ name: "", duration: 60, price: 5000 });
    toast.success("Service ajouté !");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Mes services</h1>
      <p className="mt-1 text-sm text-muted-foreground">Gérez votre catalogue, durées et tarifs.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
              <div className="flex-1">
                <div className="font-semibold">{s.name}</div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.duration} min</span>
                  <span className="font-semibold text-gradient-brand">{formatFCFA(s.price)}</span>
                </div>
              </div>
              <button onClick={() => setServices((x) => x.filter((y) => y.id !== s.id))} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={add} className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold"><Plus className="h-4 w-4" /> Ajouter un service</h2>
          <Field label="Nom du service">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Manucure" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </Field>
          <Field label="Durée (minutes)">
            <input type="number" min={5} step={5} value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <Field label="Prix (FCFA)">
            <input type="number" min={500} step={500} value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
          </Field>
          <button className="w-full rounded-xl bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-brand">
            Ajouter le service
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
