/**
 * Configuration Gemini API pour APPOINTEASE AI by BOP.
 * En production : déplacer GEMINI_API_KEY côté serveur (Edge Function) et
 * appeler le modèle via une route protégée. Ce fichier reste un point
 * central pour ne pas disperser la config dans le code.
 */
export const GEMINI_CONFIG = {
  // ⚠️ Ne jamais committer une vraie clé. Laisser vide en dev/mock.
  API_KEY: "",
  MODEL: "google/gemini-3-flash-preview",
  // Lovable AI Gateway recommandé en prod (proxy sécurisé)
  GATEWAY_URL: "https://ai.gateway.lovable.dev/v1",
  // Activé = on tape la vraie API. Désactivé = on utilise le moteur mock local.
  ENABLED: false,
  SYSTEM_PROMPT: `Tu es APPOINTEASE AI by BOP, l'assistant intelligent de la plateforme
camerounaise AppointEase (Yaoundé & Douala). Tu aides les clients à réserver
des rendez-vous et tu aides les prestataires à gérer leur business.
Sois chaleureux, concis, utilise des emojis avec parcimonie, parle français,
anglais ou camfranglais selon l'utilisateur.`,
} as const;
