// Types qui reflètent les réponses de notre API NestJS / spec Conduit

export interface User {
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: Profile;
}

// Réponse paginée de GET /api/articles
export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

// Paramètres de filtre pour la liste d'articles
export interface ArticlesQueryParams {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}
