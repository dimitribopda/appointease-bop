/**
 * Configuration des passerelles Mobile Money pour AppointEase.
 * À remplir côté serveur en production via les secrets Lovable Cloud.
 */
export const MOBILE_MONEY_CONFIG = {
  ORANGE_MONEY: {
    MERCHANT_KEY: "",
    CLIENT_ID: "",
    CLIENT_SECRET: "",
    SANDBOX_URL: "https://api.orange.com/orange-money-webpay/dev/v1",
    PRODUCTION_URL: "https://api.orange.com/orange-money-webpay/cm/v1",
  },
  MTN_MOMO: {
    SUBSCRIPTION_KEY: "",
    API_USER: "",
    API_KEY: "",
    SANDBOX_URL: "https://sandbox.momodeveloper.mtn.com",
    PRODUCTION_URL: "https://momodeveloper.mtn.com",
  },
  CURRENCY: "XAF",
  COUNTRY: "CM",
} as const;
