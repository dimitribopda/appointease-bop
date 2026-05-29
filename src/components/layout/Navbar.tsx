import { Link, useRouterState } from "@tanstack/react-router";
import { useRole } from "@/lib/role-context";
import { useTheme } from "@/lib/theme-context";
import { Home, Calendar, MessageSquare, Sparkles, User2, Briefcase, Moon, Sun, Bot } from "lucide-react";

export function Navbar() {
  const { role, setRole } = useRole();
  const { theme, toggle } = useTheme();
  const { location } = useRouterState();
  const isActive = (p: string) => location.pathname === p || (p !== "/" && location.pathname.startsWith(p));

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/40 backdrop-blur-lg dark:border-white/10 dark:bg-black/40">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-brand">
            <Calendar className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">
            Appoint<span className="text-gradient-brand">Ease</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {role === "client" ? (
            <>
              <NavLink to="/" label="Accueil" active={isActive("/") && location.pathname === "/"} />
              <NavLink to="/search" label="Rechercher" active={isActive("/search")} />
              <NavLink to="/client/dashboard" label="Mes RDV" active={isActive("/client")} />
            </>
          ) : (
            <>
              <NavLink to="/pro/dashboard" label="Dashboard" active={isActive("/pro/dashboard")} />
              <NavLink to="/pro/calendar" label="Calendrier" active={isActive("/pro/calendar")} />
              <NavLink to="/pro/services" label="Services" active={isActive("/pro/services")} />
            </>
          )}
          <NavLink to="/messages" label="Messagerie" icon={<MessageSquare className="h-4 w-4" />} active={isActive("/messages")} />
          <NavLink to="/ai-assistant" label="BOP IA" icon={<Sparkles className="h-4 w-4" />} active={isActive("/ai-assistant")} />
          <NavLink to="/pricing" label="Forfaits" active={isActive("/pricing")} />
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Basculer le thème"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/40 backdrop-blur-md transition hover:bg-white/60 dark:border-white/10 dark:bg-black/40 dark:hover:bg-black/60"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-brand-orange" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Persistent role switcher */}
          <div className="hidden items-center rounded-full border border-white/20 bg-white/40 p-1 text-xs font-medium shadow-soft backdrop-blur-md dark:border-white/10 dark:bg-black/40 sm:flex">
            <button
              onClick={() => setRole("client")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                role === "client" ? "bg-gradient-brand text-primary-foreground shadow-brand" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User2 className="h-3.5 w-3.5" /> Client
            </button>
            <button
              onClick={() => setRole("provider")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                role === "provider" ? "bg-gradient-brand text-primary-foreground shadow-brand" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Pro
            </button>
          </div>
          <Link
            to="/auth"
            className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 sm:inline-flex"
          >
            <Sparkles className="h-4 w-4" /> Connexion
          </Link>
        </div>
      </div>

      {/* Bottom tab bar mobile - Glassmorphism */}
      <nav
        aria-label="Navigation principale"
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/20 bg-white/50 px-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-black/50 md:hidden"
      >
        <TabLink to="/" label="Accueil" icon={<Home className="h-5 w-5" />} active={location.pathname === "/"} />
        <TabLink
          to={role === "client" ? "/client/dashboard" : "/pro/calendar"}
          label="Agenda"
          icon={<Calendar className="h-5 w-5" />}
          active={isActive("/client/dashboard") || isActive("/pro/calendar") || isActive("/pro/dashboard")}
        />
        <TabLink to="/messages" label="Chat" icon={<MessageSquare className="h-5 w-5" />} active={isActive("/messages")} />
        <TabLink to="/auth" label="Profil" icon={<User2 className="h-5 w-5" />} active={isActive("/auth")} />
      </nav>
    </header>
  );
}

function TabLink({ to, label, icon, active }: { to: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-medium transition ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className={`grid h-8 w-8 place-items-center rounded-lg transition ${active ? "bg-gradient-brand text-primary-foreground shadow-brand" : ""}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}

function NavLink({ to, label, active, icon }: { to: string; label: string; active?: boolean; icon?: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-primary-foreground">
              <Calendar className="h-4 w-4" />
            </span>
            AppointEase
          </div>
          <p className="text-sm text-muted-foreground">
            La plateforme camerounaise de réservation en ligne. Yaoundé & Douala.
          </p>
        </div>
        <FooterCol title="Produit" items={["Forfaits", "Pour les pros", "Sécurité"]} />
        <FooterCol title="Entreprise" items={["À propos", "Blog", "Contact"]} />
        <FooterCol title="Légal" items={["CGU", "Confidentialité", "Cookies"]} />
      </div>
      <div className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground">
        © 2026 AppointEase — Made with ❤️ in Cameroun
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((i) => <li key={i} className="hover:text-foreground cursor-pointer">{i}</li>)}
      </ul>
    </div>
  );
}
