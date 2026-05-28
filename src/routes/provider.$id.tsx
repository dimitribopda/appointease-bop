import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PROVIDERS, TIME_SLOTS, formatFCFA } from "@/lib/mock-data";
import { MapPin, Star, Clock, MessageSquare, CheckCircle2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/provider/$id")({
  head: ({ params }) => {
    const p = PROVIDERS.find((x) => x.id === params.id);
    return { meta: [{ title: `${p?.name ?? "Prestataire"} — AppointEase` }] };
  },
  component: ProviderPage,
});

function ProviderPage() {
  const { id } = Route.useParams();
  const provider = PROVIDERS.find((p) => p.id === id);
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState(provider?.services[0].id);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [provider2] = useState(provider);

  if (!provider2) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Prestataire introuvable</h1>
        <Link to="/search" className="mt-4 inline-block text-primary hover:underline">Retour à la recherche</Link>
      </div>
    );
  }

  const service = provider2.services.find((s) => s.id === selectedService)!;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative h-56 sm:h-72">
          <img src={provider2.image} alt={provider2.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-2xl font-bold sm:text-3xl">{provider2.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-brand-orange text-brand-orange" /> {provider2.rating} ({provider2.reviews} avis)</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {provider2.neighborhood}, {provider2.city}</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted-foreground">{provider2.description}</p>
          <Link to="/messages" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <MessageSquare className="h-4 w-4" /> Envoyer un message
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Services + calendar */}
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Choisissez un service</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {provider2.services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedService === s.id ? "border-primary bg-gradient-brand-soft shadow-soft" : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {s.duration} min
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gradient-brand">{formatFCFA(s.price)}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Choisissez une date</h2>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm"
            />

            <h3 className="mb-3 mt-5 text-sm font-semibold">Créneaux disponibles</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TIME_SLOTS.map((slot) => {
                const taken = ["10:00", "15:00"].includes(slot);
                return (
                  <button
                    key={slot}
                    disabled={taken}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border py-2.5 text-sm font-medium transition ${
                      taken
                        ? "cursor-not-allowed border-border bg-muted text-muted-foreground line-through"
                        : selectedSlot === slot
                        ? "border-transparent bg-gradient-brand text-primary-foreground shadow-brand"
                        : "border-border bg-card hover:border-primary"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sticky summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="font-semibold">Récapitulatif</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Service" value={service.name} />
              <Row label="Durée" value={`${service.duration} min`} />
              <Row label="Date" value={selectedDate} />
              <Row label="Heure" value={selectedSlot || "—"} />
            </dl>
            <div className="my-4 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-gradient-brand">{formatFCFA(service.price)}</span>
            </div>
            <button
              disabled={!selectedSlot}
              onClick={() => setShowSuccess(true)}
              className="mt-4 w-full rounded-xl bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-brand transition disabled:opacity-50"
            >
              Confirmer la réservation
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Réservation gratuite · Vous payez sur place</p>
          </div>
        </aside>
      </div>

      {showPayment && (
        <PaymentModal
          amount={service.price}
          onClose={() => setShowPayment(false)}
          onSuccess={() => { setShowPayment(false); setShowSuccess(true); }}
        />
      )}

      {showSuccess && (
        <SuccessModal
          providerName={provider2.name}
          service={service.name}
          date={selectedDate}
          time={selectedSlot!}
          onClose={() => { setShowSuccess(false); navigate({ to: "/client/dashboard" }); }}
        />
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export function PaymentModal({ amount, onClose, onSuccess, label = "rendez-vous" }: { amount: number; onClose: () => void; onSuccess: () => void; label?: string }) {
  const [method, setMethod] = useState<"orange" | "mtn" | null>(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!method || phone.length < 9) {
      toast.error("Choisissez une méthode et entrez un numéro valide");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    toast.success("Paiement validé !");
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">Paiement Mobile Money</h3>
            <p className="text-sm text-muted-foreground">Pour votre {label}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-brand-soft p-4 text-center">
          <div className="text-xs text-muted-foreground">Montant à payer</div>
          <div className="text-3xl font-bold text-gradient-brand">{formatFCFA(amount)}</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => setMethod("orange")}
            className={`rounded-2xl border-2 p-4 transition ${method === "orange" ? "border-brand-orange bg-accent" : "border-border hover:border-brand-orange"}`}
          >
            <div className="mx-auto h-10 w-10 rounded-lg bg-brand-orange" />
            <div className="mt-2 text-sm font-semibold">Orange Money</div>
          </button>
          <button
            onClick={() => setMethod("mtn")}
            className={`rounded-2xl border-2 p-4 transition ${method === "mtn" ? "border-brand-orange bg-accent" : "border-border hover:border-brand-orange"}`}
          >
            <div className="mx-auto h-10 w-10 rounded-lg bg-yellow-400" />
            <div className="mt-2 text-sm font-semibold">MTN MoMo</div>
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-muted-foreground">Numéro de téléphone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="6XX XXX XXX"
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          disabled={loading}
          onClick={submit}
          className="mt-5 w-full rounded-xl bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-brand disabled:opacity-60"
        >
          {loading ? "Traitement en cours…" : `Valider le paiement`}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Vous recevrez un code USSD sur votre téléphone pour confirmer.
        </p>
      </div>
    </div>
  );
}

function SuccessModal({ providerName, service, date, time, onClose }: { providerName: string; service: string; date: string; time: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-brand text-primary-foreground">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-bold">Rendez-vous confirmé !</h3>
        <p className="mt-1 text-sm text-muted-foreground">Un SMS de confirmation vous a été envoyé.</p>
        <div className="mt-5 rounded-2xl bg-secondary p-4 text-left text-sm">
          <Row label="Pro" value={providerName} />
          <Row label="Service" value={service} />
          <Row label="Date" value={date} />
          <Row label="Heure" value={time} />
        </div>
        <button onClick={onClose} className="mt-5 w-full rounded-xl bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-brand">
          Voir mes rendez-vous
        </button>
      </div>
    </div>
  );
}
