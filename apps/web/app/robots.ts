import type { MetadataRoute } from 'next';

// Next.js génère automatiquement /robots.txt à partir de cet objet
export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002';

  return {
    rules: [
      {
        userAgent: '*',        // S'applique à tous les robots (Google, Bing, etc.)
        allow: '/',            // Tout le site est crawlable par défaut
        disallow: [
          '/settings',         // Page de paramètres — privée, rien à indexer
          '/editor',           // Pages de création/modification — privées
          '/editor/',          // Couvre aussi /editor/[slug]
        ],
      },
    ],
    // Indique aux robots où trouver la carte du site
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
