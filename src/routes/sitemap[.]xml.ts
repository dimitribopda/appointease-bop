import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PROVIDERS } from "@/lib/mock-data";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = [
          "/", "/search", "/auth", "/pricing", "/messages",
          "/client/dashboard", "/pro/dashboard", "/pro/calendar", "/pro/services",
          ...PROVIDERS.map((p) => `/provider/${p.id}`),
        ];
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc></url>`).join("\n") +
          `\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
