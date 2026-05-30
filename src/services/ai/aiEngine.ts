/**
 * Moteur IA mock pour APPOINTEASE AI by BOP.
 * Convertit l'intention NLU en réponse structurée (texte + payload riche).
 * En production : remplacer generateReply() par un appel à Gemini via Edge Function.
 */

import { PROVIDERS, type Provider, formatFCFA } from "@/lib/mock-data";
import {
  CLIENT_APPOINTMENTS,
  PROVIDER_ANALYTICS,
  PROVIDER_CRM,
  MARKETING_TEMPLATES,
  SMART_REPLIES_PROVIDER,
  type MockAppointment,
} from "@/mock/aiBookings";
import { analyze, type NLUResult } from "./nlu";

export type AIPayload =
  | { kind: "providers"; items: Provider[] }
  | { kind: "appointment"; item: MockAppointment; action: "booked" | "cancelled" | "info" }
  | { kind: "appointments"; items: MockAppointment[] }
  | { kind: "smart-replies"; items: string[] }
  | { kind: "analytics"; data: typeof PROVIDER_ANALYTICS }
  | { kind: "crm"; items: typeof PROVIDER_CRM }
  | { kind: "marketing"; items: typeof MARKETING_TEMPLATES }
  | { kind: "calendar-tips"; tips: string[] }
  | { kind: "reminders"; items: MockAppointment[] }
  | null;

export type AIReply = {
  text: string;
  payload: AIPayload;
  /** suggestions textuelles cliquables sous le message */
  suggestions?: string[];
  /** Émotion détectée — utile pour adapter l'UI */
  emotion?: NLUResult["emotion"];
};

function filterProviders(nlu: NLUResult): Provider[] {
  let list = PROVIDERS.slice();
  if (nlu.entities.category) list = list.filter((p) => p.category === nlu.entities.category);
  if (nlu.entities.city) list = list.filter((p) => p.city === nlu.entities.city);
  if (nlu.entities.neighborhood) list = list.filter((p) => p.neighborhood === nlu.entities.neighborhood);
  if (nlu.entities.budget) list = list.filter((p) => p.priceFrom <= (nlu.entities.budget ?? Infinity));
  if (!list.length) list = PROVIDERS.slice(0, 3);
  return list.slice(0, 3);
}

function clientReply(nlu: NLUResult, raw: string): AIReply {
  const empathy = nlu.emotion === "urgent" ? "Je comprends l'urgence. " : nlu.emotion === "frustrated" ? "Désolé pour la gêne. " : "";

  switch (nlu.intent) {
    case "greeting":
      return {
        text: "Bonjour 👋 je suis APPOINTEASE AI by BOP. Dites-moi ce que vous cherchez : un dentiste à Bastos, une coiffeuse pas chère à Melen, ou vos prochains rendez-vous ?",
        payload: null,
        suggestions: ["Coiffeuse à Bastos demain", "Mes rendez-vous", "Dentiste pas cher à Melen"],
      };

    case "search_provider": {
      const items = filterProviders(nlu);
      const ctx = [
        nlu.entities.categoryLabel,
        nlu.entities.neighborhood && `à ${nlu.entities.neighborhood}`,
        nlu.entities.city && !nlu.entities.neighborhood && `à ${nlu.entities.city}`,
        nlu.entities.budget && `≤ ${formatFCFA(nlu.entities.budget)}`,
      ].filter(Boolean).join(" · ");
      return {
        text: `${empathy}Voici ${items.length} prestataire${items.length > 1 ? "s" : ""} ${ctx ? `(${ctx})` : ""} qui correspondent à votre recherche :`,
        payload: { kind: "providers", items },
        suggestions: ["Réserve avec le mieux noté", "Compare les prix", "Plus proche de moi"],
        emotion: nlu.emotion,
      };
    }

    case "book_appointment": {
      const fav = filterProviders(nlu)[0] ?? PROVIDERS[0];
      const time = nlu.entities.time ?? "15:00";
      const dateLabel = nlu.entities.date ?? "samedi";
      const booking: MockAppointment = {
        id: `new-${Date.now()}`,
        providerId: fav.id,
        providerName: fav.name,
        service: fav.services[0].name,
        date: new Date().toISOString().slice(0, 10),
        time,
        status: "confirmed",
        price: fav.services[0].price,
        city: fav.city,
      };
      return {
        text: `✅ Créneau ${dateLabel} ${time} disponible chez **${fav.name}**. Réservation confirmée !`,
        payload: { kind: "appointment", item: booking, action: "booked" },
        suggestions: ["Ajouter au calendrier", "Annuler ce RDV", "Voir l'itinéraire"],
      };
    }

    case "list_appointments":
      return {
        text: `Voici vos ${CLIENT_APPOINTMENTS.filter((a) => a.status === "confirmed").length} prochains rendez-vous :`,
        payload: { kind: "appointments", items: CLIENT_APPOINTMENTS.filter((a) => a.status === "confirmed") },
        suggestions: ["Annule mon prochain RDV", "Rappelle-moi demain", "Réserve un nouveau RDV"],
      };

    case "cancel_appointment": {
      const next = CLIENT_APPOINTMENTS.find((a) => a.status === "confirmed");
      if (!next) return { text: "Vous n'avez aucun rendez-vous à annuler.", payload: null };
      return {
        text: `J'ai annulé votre rendez-vous chez **${next.providerName}** (${next.service}, ${next.date} ${next.time}). Voulez-vous reprogrammer ?`,
        payload: { kind: "appointment", item: { ...next, status: "cancelled" }, action: "cancelled" },
        suggestions: ["Reprogrammer la semaine prochaine", "Trouver un autre prestataire", "Non merci"],
      };
    }

    case "recommendation": {
      const top = PROVIDERS.slice().sort((a, b) => b.rating - a.rating).slice(0, 3);
      return {
        text: "Mes recommandations basées sur les avis, la proximité et le rapport qualité/prix :",
        payload: { kind: "providers", items: top },
        suggestions: ["Le moins cher", "Le plus proche", "Le mieux noté"],
      };
    }

    case "reminder": {
      const upcoming = CLIENT_APPOINTMENTS.filter((a) => new Date(a.date) >= new Date());
      return {
        text: `🔔 Rappel : ${upcoming.length} rendez-vous à venir. Je vous préviens 24h et 2h avant chaque RDV.`,
        payload: { kind: "reminders", items: upcoming },
        suggestions: ["Désactiver les rappels", "Ajouter à mon calendrier", "Préparer ma visite"],
      };
    }

    default:
      return {
        text: "Je peux vous aider à **trouver un prestataire**, **réserver un créneau**, **lister vos RDV** ou **annuler**. Que souhaitez-vous ?",
        payload: null,
        suggestions: ["Trouve un coiffeur à Bastos", "Mes rendez-vous", "Annule mon prochain RDV"],
      };
  }
}

function providerReply(nlu: NLUResult, _raw: string): AIReply {
  switch (nlu.intent) {
    case "greeting":
      return {
        text: "Bonjour 👋 je suis APPOINTEASE AI by BOP, votre assistant business. Je peux analyser vos revenus, optimiser votre planning, ou rédiger vos réponses clients.",
        payload: null,
        suggestions: ["Analyse mon CA", "Optimise mon planning", "Suggère une promo"],
      };

    case "smart_reply_request":
      return {
        text: "Voici 3 réponses prêtes à envoyer :",
        payload: { kind: "smart-replies", items: SMART_REPLIES_PROVIDER.slice(0, 3) },
        suggestions: ["Plus de variantes", "Ton plus formel", "Ton plus chaleureux"],
      };

    case "optimize_calendar":
      return {
        text: `📊 J'ai détecté ${PROVIDER_ANALYTICS.emptySlots.length} créneaux sous-utilisés. Lancer une promo ciblée pourrait remplir ces trous (~45 000 FCFA/sem).`,
        payload: { kind: "calendar-tips", tips: PROVIDER_ANALYTICS.emptySlots.map((s) => `${s} → -20% pour booster les réservations`) },
        suggestions: ["Active la promo automatique", "Bloque les créneaux vides", "Voir le détail"],
      };

    case "forecast":
      return {
        text: `📈 Prévision : ${PROVIDER_ANALYTICS.forecast.nextPeak} sera votre pic (~${PROVIDER_ANALYTICS.forecast.expectedBookings} RDV attendus). Préparez vos stocks et votre équipe.`,
        payload: { kind: "analytics", data: PROVIDER_ANALYTICS },
        suggestions: ["Recruter un assistant", "Augmenter les prix ce jour", "Voir les détails"],
      };

    case "revenue_analysis":
      return {
        text: `💰 CA du mois : **${formatFCFA(PROVIDER_ANALYTICS.monthRevenue)}** (+${PROVIDER_ANALYTICS.monthGrowth}% vs mois dernier). Meilleur jour : ${PROVIDER_ANALYTICS.bestDay}. Service phare : ${PROVIDER_ANALYTICS.bestService} (${PROVIDER_ANALYTICS.bestServiceShare}%).`,
        payload: { kind: "analytics", data: PROVIDER_ANALYTICS },
        suggestions: ["Détail par service", "Comparer aux confrères", "Exporter en PDF"],
      };

    case "marketing":
      return {
        text: "✨ Voici 3 modèles de messages prêts à diffuser :",
        payload: { kind: "marketing", items: MARKETING_TEMPLATES },
        suggestions: ["Cibler les clientes VIP", "Programmer dans 1h", "Générer une variante"],
      };

    case "crm":
      return {
        text: `👥 ${PROVIDER_CRM.filter((c) => c.tag === "VIP").length} clients VIP · ${PROVIDER_CRM.filter((c) => c.tag === "Fidèle").length} fidèles · ${PROVIDER_CRM.filter((c) => c.tag === "No-show").length} no-show à recontacter.`,
        payload: { kind: "crm", items: PROVIDER_CRM },
        suggestions: ["Relancer les no-show", "Récompenser les VIP", "Exporter la liste"],
      };

    case "summarize":
      return {
        text: "📝 Résumé : la cliente confirme son RDV de demain 14h et demande si elle peut apporter ses propres extensions. Vous avez accepté.",
        payload: null,
        suggestions: ["Sauvegarder dans la fiche cliente", "Envoyer un rappel", "Marquer comme important"],
      };

    default:
      return {
        text: "Je peux **analyser votre CA**, **optimiser votre planning**, **rédiger des smart replies** ou **générer une campagne marketing**. Par quoi commençons-nous ?",
        payload: null,
        suggestions: ["Analyse mon CA", "Optimise mon planning", "Rédige une promo"],
      };
  }
}

/**
 * Point d'entrée principal du moteur. Réponse réaliste basée sur le NLU mock.
 */
export function generateReply(input: string, role: "client" | "provider"): AIReply {
  const nlu = analyze(input);
  return role === "client" ? clientReply(nlu, input) : providerReply(nlu, input);
}
