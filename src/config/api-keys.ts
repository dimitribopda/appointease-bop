/**
 * Configuration centralisée des clés API externes pour AppointEase.
 * Remplacez les valeurs vides par vos clés en production.
 * Pour des vrais secrets côté serveur, utilisez Lovable Cloud secrets.
 */
export const API_KEYS = {
  // Google Gemini (Assistant IA) — côté serveur uniquement en prod
  GEMINI_API_KEY: "",

  // Orange Money — Sandbox / Production
  ORANGE_MONEY: {
    MERCHANT_KEY: "",
    CLIENT_ID: "",
    CLIENT_SECRET: "",
  },

  // MTN Mobile Money — Collection API
  MTN_MOMO: {
    SUBSCRIPTION_KEY: "",
    API_USER: "",
    API_KEY: "",
  },
} as const;
