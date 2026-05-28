import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";
import { User2, Briefcase, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion / Inscription — AppointEase" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [step, setStep] = useState<"form" | "role">("form");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") setStep("role");
    else { setRole("client"); navigate({ to: "/client/dashboard" }); }
  };

  const pickRole = (r: "client" | "provider") => {
    setRole(r);
    navigate({ to: r === "client" ? "/" : "/pro/dashboard" });
  };

  return (
    <div className="relative grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-gradient-brand-soft" />

      {step === "form" && (
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-soft">
          <h1 className="text-2xl font-bold">
            {mode === "signup" ? "Créer un compte" : "Bon retour 👋"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signup" ? "Rejoignez AppointEase en 30 secondes." : "Connectez-vous à votre espace."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <InputRow icon={<User2 className="h-4 w-4" />} placeholder="Nom complet" />
            )}
            <InputRow icon={<Mail className="h-4 w-4" />} type="email" placeholder="Email" />
            {mode === "signup" && (
              <InputRow icon={<Phone className="h-4 w-4" />} type="tel" placeholder="+237 6XX XXX XXX" />
            )}
            <InputRow icon={<Lock className="h-4 w-4" />} type="password" placeholder="Mot de passe" />

            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 text-sm font-semibold text-primary-foreground shadow-brand">
              {mode === "signup" ? "Continuer" : "Se connecter"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Déjà un compte ?" : "Pas encore inscrit ?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="font-semibold text-primary hover:underline">
              {mode === "signup" ? "Se connecter" : "Créer un compte"}
            </button>
          </p>
        </div>
      )}

      {step === "role" && (
        <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h2 className="text-center text-2xl font-bold">Bienvenue sur AppointEase ! 🎉</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Que souhaitez-vous faire aujourd'hui ?
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => pickRole("client")}
              className="group rounded-2xl border-2 border-border bg-background p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-brand"
            >
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
                <User2 className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">Je cherche un service</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Trouvez et réservez des coiffeurs, dentistes, mécaniciens près de chez vous.
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Continuer en tant que client <ArrowRight className="h-4 w-4" />
              </div>
            </button>

            <button
              onClick={() => pickRole("provider")}
              className="group rounded-2xl border-2 border-border bg-background p-6 text-left transition hover:-translate-y-1 hover:border-brand-orange hover:shadow-brand"
            >
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">Je propose un service</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Gérez vos rendez-vous, vos clients et développez votre business pro.
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange group-hover:gap-2 transition-all">
                Devenir prestataire <ArrowRight className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InputRow({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary">
      <span className="text-muted-foreground">{icon}</span>
      <input {...props} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
    </div>
  );
}
