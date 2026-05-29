export type Provider = {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  city: "Yaoundé" | "Douala";
  rating: number;
  reviews: number;
  priceFrom: number;
  image: string;
  description: string;
  verified?: boolean;
  services: { id: string; name: string; duration: number; price: number }[];
};

export const CATEGORIES = [
  { slug: "coiffure", label: "Coiffure & Beauté", emoji: "💇🏾‍♀️" },
  { slug: "dentiste", label: "Dentiste & Santé", emoji: "🦷" },
  { slug: "mecanique", label: "Mécanique Auto", emoji: "🔧" },
  { slug: "spa", label: "Spa & Massage", emoji: "💆🏾" },
  { slug: "couture", label: "Couture", emoji: "🧵" },
  { slug: "fitness", label: "Coach Fitness", emoji: "🏋🏾" },
];

export const NEIGHBORHOODS = ["Melen", "Bastos", "Mvan", "Akwa", "Bonapriso", "Nlongkak"];

export const PROVIDERS: Provider[] = [
  {
    id: "salon-aminata",
    verified: true,
    name: "Salon Aminata",
    category: "coiffure",
    neighborhood: "Bastos",
    city: "Yaoundé",
    rating: 4.8,
    reviews: 124,
    priceFrom: 5000,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
    description: "Salon de coiffure afro spécialisé en tresses, locks et soins capillaires naturels. Plus de 8 ans d'expérience à Yaoundé.",
    services: [
      { id: "s1", name: "Tresses africaines", duration: 180, price: 15000 },
      { id: "s2", name: "Shampoing + Brushing", duration: 60, price: 5000 },
      { id: "s3", name: "Coloration", duration: 120, price: 20000 },
    ],
  },
  {
    id: "dr-mbarga",
    verified: true,
    name: "Cabinet Dr. Mbarga",
    category: "dentiste",
    neighborhood: "Melen",
    city: "Yaoundé",
    rating: 4.9,
    reviews: 87,
    priceFrom: 10000,
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800",
    description: "Cabinet dentaire moderne. Détartrage, soins, orthodontie. Équipement aux normes internationales.",
    services: [
      { id: "s1", name: "Consultation", duration: 30, price: 10000 },
      { id: "s2", name: "Détartrage", duration: 45, price: 25000 },
      { id: "s3", name: "Soin de carie", duration: 60, price: 35000 },
    ],
  },
  {
    id: "garage-tonton",
    name: "Garage Tonton Auto",
    category: "mecanique",
    neighborhood: "Mvan",
    city: "Yaoundé",
    rating: 4.6,
    reviews: 203,
    priceFrom: 3000,
    image: "https://images.unsplash.com/photo-1632823471565-1ecdf5c6da77?w=800",
    description: "Mécanique générale, vidange, freins, diagnostic électronique. Spécialiste Toyota et Mercedes.",
    services: [
      { id: "s1", name: "Vidange complète", duration: 60, price: 15000 },
      { id: "s2", name: "Diagnostic", duration: 45, price: 5000 },
      { id: "s3", name: "Remplacement freins", duration: 120, price: 30000 },
    ],
  },
  {
    id: "spa-zen",
    verified: true,
    name: "Spa Zen Bonapriso",
    category: "spa",
    neighborhood: "Bonapriso",
    city: "Douala",
    rating: 4.9,
    reviews: 156,
    priceFrom: 12000,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    description: "Massage relaxant, soins du corps, sauna. Une parenthèse de bien-être au cœur de Douala.",
    services: [
      { id: "s1", name: "Massage relaxant 60min", duration: 60, price: 20000 },
      { id: "s2", name: "Soin du visage", duration: 45, price: 15000 },
      { id: "s3", name: "Forfait Détente", duration: 120, price: 35000 },
    ],
  },
  {
    id: "atelier-fatou",
    name: "Atelier Couture Fatou",
    category: "couture",
    neighborhood: "Akwa",
    city: "Douala",
    rating: 4.7,
    reviews: 98,
    priceFrom: 2000,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
    description: "Confection sur mesure, retouches, broderie. Tissus locaux et import.",
    services: [
      { id: "s1", name: "Prise de mesures", duration: 30, price: 2000 },
      { id: "s2", name: "Confection robe", duration: 240, price: 25000 },
      { id: "s3", name: "Retouches", duration: 45, price: 5000 },
    ],
  },
  {
    id: "coach-eric",
    name: "Coach Eric Fitness",
    category: "fitness",
    neighborhood: "Nlongkak",
    city: "Yaoundé",
    rating: 4.8,
    reviews: 64,
    priceFrom: 7000,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    description: "Coach certifié. Séances personnalisées musculation, cardio, perte de poids.",
    services: [
      { id: "s1", name: "Séance individuelle", duration: 60, price: 7000 },
      { id: "s2", name: "Pack 10 séances", duration: 60, price: 60000 },
    ],
  },
];

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export const PLANS = [
  {
    id: "artisan",
    name: "Artisan",
    price: 2000,
    tagline: "Pour démarrer en solo",
    features: ["1 calendrier", "20 RDV / mois", "Rappels SMS basiques", "Page vitrine"],
    highlighted: false,
  },
  {
    id: "business",
    name: "Business",
    price: 5000,
    tagline: "Le plus populaire",
    features: ["3 calendriers", "RDV illimités", "Rappels SMS + WhatsApp", "Statistiques", "Messagerie client"],
    highlighted: true,
  },
  {
    id: "expert",
    name: "Expert",
    price: 10000,
    tagline: "Pour les équipes & cliniques",
    features: ["Calendriers illimités", "Multi-employés", "API & exports", "Assistant IA Gemini", "Support prioritaire"],
    highlighted: false,
  },
];

export function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}
