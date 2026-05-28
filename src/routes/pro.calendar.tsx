import { createFileRoute } from "@tanstack/react-router";
import { formatFCFA } from "@/lib/mock-data";
import { Check, X, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/pro/calendar")({
  head: () => ({ meta: [{ title: "Agenda Pro — AppointEase" }] }),
  component: ProCalendar,
});

type RDV = { id: number; day: string; time: string; client: string; service: string; price: number; status: "confirmed" | "pending" };

const SEED: RDV[] = [
  { id: 1, day: "Lun", time: "09:00", client: "Sandra T.", service: "Brushing", price: 5000, status: "confirmed" },
  { id: 2, day: "Lun", time: "14:00", client: "Aïssatou N.", service: "Tresses africaines", price: 15000, status: "confirmed" },
  { id: 3, day: "Mar", time: "10:00", client: "Marie K.", service: "Coloration", price: 20000, status: "pending" },
  { id: 4, day: "Mer", time: "11:00", client: "Linda B.", service: "Soins", price: 8000, status: "confirmed" },
  { id: 5, day: "Jeu", time: "15:00", client: "Fatima O.", service: "Tresses", price: 15000, status: "pending" },
  { id: 6, day: "Ven", time: "16:00", client: "Carole M.", service: "Brushing", price: 5000, status: "confirmed" },
  { id: 7, day: "Sam", time: "10:00", client: "Estelle D.", service: "Coloration", price: 20000, status: "confirmed" },
];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function ProCalendar() {
  const [rdvs, setRdvs] = useState(SEED);

  const update = (id: number, status: "confirmed" | "cancelled") => {
    if (status === "cancelled") {
      setRdvs((r) => r.filter((x) => x.id !== id));
      toast.success("Rendez-vous refusé");
    } else {
      setRdvs((r) => r.map((x) => (x.id === id ? { ...x, status: "confirmed" } : x)));
      toast.success("Rendez-vous accepté");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Agenda de la semaine</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceptez ou refusez les demandes en attente.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <Legend color="bg-success" label="Confirmé" />
          <Legend color="bg-brand-orange" label="En attente" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {DAYS.map((d) => {
          const items = rdvs.filter((r) => r.day === d);
          return (
            <div key={d} className="rounded-2xl border border-border bg-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{d}</span>
                <span className="text-xs text-muted-foreground">{items.length} RDV</span>
              </div>
              <div className="space-y-2">
                {items.length === 0 && (
                  <p className="rounded-lg border border-dashed border-border py-4 text-center text-xs text-muted-foreground">Libre</p>
                )}
                {items.map((r) => (
                  <div key={r.id} className={`rounded-xl border p-2.5 text-xs ${r.status === "pending" ? "border-brand-orange/40 bg-brand-orange/5" : "border-success/40 bg-success/5"}`}>
                    <div className="flex items-center gap-1 font-semibold"><Clock className="h-3 w-3" /> {r.time}</div>
                    <div className="mt-1 font-medium">{r.client}</div>
                    <div className="text-muted-foreground">{r.service}</div>
                    <div className="mt-1 font-semibold">{formatFCFA(r.price)}</div>
                    {r.status === "pending" && (
                      <div className="mt-2 flex gap-1">
                        <button onClick={() => update(r.id, "confirmed")} className="flex-1 rounded-md bg-success px-2 py-1 text-success-foreground"><Check className="mx-auto h-3 w-3" /></button>
                        <button onClick={() => update(r.id, "cancelled")} className="flex-1 rounded-md bg-destructive px-2 py-1 text-destructive-foreground"><X className="mx-auto h-3 w-3" /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1"><span className={`h-2 w-2 rounded-full ${color}`} /> {label}</span>;
}
