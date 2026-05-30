/**
 * Données mockées pour APPOINTEASE AI by BOP.
 * Simule rendez-vous, rappels, CRM et analytics côté client et prestataire.
 */

export type MockAppointment = {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  date: string; // ISO
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  price: number;
  city: "Yaoundé" | "Douala";
};

export type MockClientCRM = {
  id: string;
  name: string;
  visits: number;
  lastVisit: string;
  totalSpent: number;
  tag: "VIP" | "Fidèle" | "No-show" | "Nouveau";
};

const today = new Date();
const addDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const CLIENT_APPOINTMENTS: MockAppointment[] = [
  {
    id: "a1",
    providerId: "salon-aminata",
    providerName: "Salon Aminata",
    service: "Tresses africaines",
    date: addDays(1),
    time: "14:00",
    status: "confirmed",
    price: 15000,
    city: "Yaoundé",
  },
  {
    id: "a2",
    providerId: "spa-zen",
    providerName: "Spa Zen Bonapriso",
    service: "Massage relaxant 60min",
    date: addDays(6),
    time: "16:00",
    status: "confirmed",
    price: 20000,
    city: "Douala",
  },
  {
    id: "a3",
    providerId: "dr-mbarga",
    providerName: "Cabinet Dr. Mbarga",
    service: "Détartrage",
    date: addDays(-3),
    time: "09:00",
    status: "confirmed",
    price: 25000,
    city: "Yaoundé",
  },
];

export const PROVIDER_CRM: MockClientCRM[] = [
  { id: "c1", name: "Aïssatou N.", visits: 12, lastVisit: addDays(-5), totalSpent: 180000, tag: "VIP" },
  { id: "c2", name: "Marie K.", visits: 6, lastVisit: addDays(-12), totalSpent: 75000, tag: "Fidèle" },
  { id: "c3", name: "Eric T.", visits: 2, lastVisit: addDays(-45), totalSpent: 10000, tag: "No-show" },
  { id: "c4", name: "Sophie M.", visits: 1, lastVisit: addDays(-2), totalSpent: 5000, tag: "Nouveau" },
];

export const PROVIDER_ANALYTICS = {
  monthRevenue: 385000,
  monthGrowth: 18,
  bestDay: "Samedi",
  bestService: "Tresses africaines",
  bestServiceShare: 45,
  forecast: {
    nextPeak: "Samedi prochain",
    expectedBookings: 14,
  },
  emptySlots: ["Mardi 09h-11h", "Jeudi 13h-15h"],
};

export const SMART_REPLIES_PROVIDER = [
  "Oui, disponible à 14h 😊",
  "Mon agenda est complet aujourd'hui",
  "Je vérifie et reviens vers vous",
  "Merci pour votre message !",
  "Pouvez-vous préciser le service ?",
];

export const MARKETING_TEMPLATES = [
  {
    title: "Promo flash week-end",
    body: "🎉 -20% sur tous les services ce samedi ! Réservez vite sur AppointEase.",
  },
  {
    title: "Relance client inactif",
    body: "Bonjour 🌸, on ne vous a pas vu depuis un moment. -15% sur votre prochain rendez-vous.",
  },
  {
    title: "Annonce nouveau service",
    body: "✨ Nouveau ! Découvrez notre forfait détente à 35 000 FCFA. Places limitées.",
  },
];
