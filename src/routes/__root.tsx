import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { RoleProvider } from "@/lib/role-context";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-brand"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-brand"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AppointEase — Réservez en ligne à Yaoundé & Douala" },
      { name: "description", content: "AppointEase : la plateforme camerounaise de réservation de rendez-vous en ligne pour coiffeurs, dentistes, mécaniciens et plus." },
      { property: "og:title", content: "AppointEase — Réservez en ligne à Yaoundé & Douala" },
      { property: "og:description", content: "AppointEase : la plateforme camerounaise de réservation de rendez-vous en ligne pour coiffeurs, dentistes, mécaniciens et plus." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "AppointEase — Réservez en ligne à Yaoundé & Douala" },
      { name: "twitter:description", content: "AppointEase : la plateforme camerounaise de réservation de rendez-vous en ligne pour coiffeurs, dentistes, mécaniciens et plus." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f55abfcf-8154-4b72-a87e-eb3862b316e3/id-preview-6d83b8da--81ddfbf1-8773-4e1b-806b-0796ab096331.lovable.app-1780009899954.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f55abfcf-8154-4b72-a87e-eb3862b316e3/id-preview-6d83b8da--81ddfbf1-8773-4e1b-806b-0796ab096331.lovable.app-1780009899954.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1"><Outlet /></main>
          <Footer />
        </div>
        <Toaster />
      </RoleProvider>
    </QueryClientProvider>
  );
}
