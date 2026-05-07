import type { MetadataRoute } from 'next';

// Type minimal pour les articles dans le sitemap
interface ArticleForSitemap {
  slug: string;
  updatedAt: string;
}

// Next.js génère automatiquement /sitemap.xml à partir de ce tableau
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3002';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

  // Pages statiques — toujours présentes dans le sitemap
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,       // La homepage est la plus importante
    },
  ];

  // Pages dynamiques — récupérées depuis l'API
  try {
    const res = await fetch(`${apiUrl}/articles?limit=1000`, {
      next: { revalidate: 3600 },  // Regenerer le sitemap toutes les heures
    });

    if (!res.ok) return staticPages;

    const { articles } = await res.json() as { articles: ArticleForSitemap[] };

    const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${appUrl}/article/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,     // Articles moins prioritaires que la homepage
    }));

    return [...staticPages, ...articlePages];
  } catch {
    // En cas d'erreur API, on retourne au moins les pages statiques
    return staticPages;
  }
}
