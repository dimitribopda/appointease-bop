/**
 * NLU mock : analyse de l'intention utilisateur pour APPOINTEASE AI by BOP.
 * Détecte intent, entités (métier, quartier, date, budget), langue et émotion.
 */

import { CATEGORIES, NEIGHBORHOODS } from "@/lib/mock-data";

export type Intent =
  | "search_provider"
  | "book_appointment"
  | "list_appointments"
  | "cancel_appointment"
  | "recommendation"
  | "reminder"
  | "smart_reply_request"
  | "optimize_calendar"
  | "forecast"
  | "revenue_analysis"
  | "marketing"
  | "crm"
  | "summarize"
  | "greeting"
  | "unknown";

export type Language = "fr" | "en" | "camfranglais";
export type Emotion = "neutral" | "urgent" | "frustrated" | "advice";

export type NLUResult = {
  intent: Intent;
  language: Language;
  emotion: Emotion;
  entities: {
    category?: string;
    categoryLabel?: string;
    neighborhood?: string;
    city?: "Yaoundé" | "Douala";
    date?: string; // "demain", "samedi", "aujourd'hui"
    time?: string; // "15h", "14:00"
    budget?: number;
  };
};

const DATE_KEYWORDS: Record<string, string> = {
  "aujourd'hui": "today",
  "aujourdhui": "today",
  "today": "today",
  "demain": "tomorrow",
  "tomorrow": "tomorrow",
  "lundi": "lundi",
  "mardi": "mardi",
  "mercredi": "mercredi",
  "jeudi": "jeudi",
  "vendredi": "vendredi",
  "samedi": "samedi",
  "dimanche": "dimanche",
};

function detectLanguage(text: string): Language {
  const t = text.toLowerCase();
  if (/\b(the|hello|i need|please|tomorrow|today|book|find)\b/.test(t)) return "en";
  if (/\b(wandalou|wèh|tara|ngolo|kombi|mola|na how|ashia)\b/.test(t)) return "camfranglais";
  return "fr";
}

function detectEmotion(text: string): Emotion {
  const t = text.toLowerCase();
  if (/(urgent|vite|tout de suite|asap|immédiat|maintenant)/.test(t)) return "urgent";
  if (/(nul|déçu|marre|frustré|énervé|jamais|toujours pas)/.test(t)) return "frustrated";
  if (/(conseil|recommand|suggér|que pense|aide-moi à choisir)/.test(t)) return "advice";
  return "neutral";
}

function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/(annul|cancel|je ne peux plus|décommand)/.test(t)) return "cancel_appointment";
  if (/(réserv|book|prend|reserve.*\d|samedi.*\d{1,2}h)/.test(t)) return "book_appointment";
  if (/(mes (rendez|rdv)|my appointments|quels sont mes)/.test(t)) return "list_appointments";
  if (/(rappel|reminder|n'oublie pas)/.test(t)) return "reminder";
  if (/(recommand|suggér|mieux noté|moins cher|proche|similaire)/.test(t)) return "recommendation";
  if (/(résume|summary|résumé|recap)/.test(t)) return "summarize";
  if (/(rédige|réponse rapide|smart reply|que dire|comment répondre)/.test(t)) return "smart_reply_request";
  if (/(optim|trou|conflit|plann|calendrier)/.test(t)) return "optimize_calendar";
  if (/(prévis|forecast|demande à venir|sera chargé)/.test(t)) return "forecast";
  if (/(ca|chiffre.*affaire|revenu|gains|combien.*gagn)/.test(t)) return "revenue_analysis";
  if (/(promo|marketing|annonce|post|campagne|relance)/.test(t)) return "marketing";
  if (/(vip|fidèle|no.?show|crm|meilleur client)/.test(t)) return "crm";
  if (/(bonjour|hello|salut|hi|hey|coucou|na how)/.test(t)) return "greeting";
  if (/(cherche|trouve|find|besoin de|il me faut|dentiste|coiff|spa|méca|garage|massage|couture)/.test(t)) {
    return "search_provider";
  }
  return "unknown";
}

function extractCategory(text: string): { slug?: string; label?: string } {
  const t = text.toLowerCase();
  const aliases: Record<string, string> = {
    coiff: "coiffure", tress: "coiffure", salon: "coiffure",
    dent: "dentiste", dental: "dentiste",
    méca: "mecanique", meca: "mecanique", garage: "mecanique", voiture: "mecanique", auto: "mecanique",
    spa: "spa", massage: "spa", détente: "spa", detente: "spa",
    coutur: "couture", tailleur: "couture",
    fitness: "fitness", coach: "fitness", sport: "fitness", muscul: "fitness",
  };
  for (const [k, v] of Object.entries(aliases)) {
    if (t.includes(k)) {
      const cat = CATEGORIES.find((c) => c.slug === v);
      return { slug: v, label: cat?.label };
    }
  }
  return {};
}

function extractNeighborhood(text: string): { neighborhood?: string; city?: "Yaoundé" | "Douala" } {
  const t = text.toLowerCase();
  const yaoundeHoods = ["melen", "bastos", "mvan", "nlongkak"];
  const doualaHoods = ["akwa", "bonapriso", "bonanjo", "deido"];
  for (const n of NEIGHBORHOODS) {
    if (t.includes(n.toLowerCase())) {
      const city = yaoundeHoods.includes(n.toLowerCase()) ? "Yaoundé" : "Douala";
      return { neighborhood: n, city };
    }
  }
  for (const n of doualaHoods) {
    if (t.includes(n)) return { neighborhood: n[0].toUpperCase() + n.slice(1), city: "Douala" };
  }
  if (t.includes("yaound")) return { city: "Yaoundé" };
  if (t.includes("douala")) return { city: "Douala" };
  return {};
}

function extractDate(text: string): string | undefined {
  const t = text.toLowerCase();
  for (const [k, v] of Object.entries(DATE_KEYWORDS)) {
    if (t.includes(k)) return v;
  }
  return undefined;
}

function extractTime(text: string): string | undefined {
  const m = text.match(/(\d{1,2})\s*[h:]\s*(\d{0,2})/);
  if (!m) return undefined;
  const h = m[1].padStart(2, "0");
  const min = (m[2] || "00").padStart(2, "0");
  return `${h}:${min}`;
}

function extractBudget(text: string): number | undefined {
  const m = text.match(/(\d{1,3}(?:\s?\d{3})*)\s*(fcfa|cfa|f)/i);
  if (m) return parseInt(m[1].replace(/\s/g, ""), 10);
  const cheap = /(pas cher|moins cher|cheap|abordable|petit budget)/i.test(text);
  if (cheap) return 10000;
  return undefined;
}

export function analyze(text: string): NLUResult {
  const cat = extractCategory(text);
  const hood = extractNeighborhood(text);
  return {
    intent: detectIntent(text),
    language: detectLanguage(text),
    emotion: detectEmotion(text),
    entities: {
      category: cat.slug,
      categoryLabel: cat.label,
      neighborhood: hood.neighborhood,
      city: hood.city,
      date: extractDate(text),
      time: extractTime(text),
      budget: extractBudget(text),
    },
  };
}
