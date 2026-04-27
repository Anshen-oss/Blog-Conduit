// Client HTTP centralisé vers notre API NestJS (port 3001)

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

// ─── Classe d'erreur structurée ───────────────────────────────────────────────
// Le backend du Blog renvoie { errors: { field: ["message"] } }
// On conserve cette structure pour afficher les erreurs dans les formulaires

export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: Record<string, string[]>,
  ) {
    super(`API Error ${status}`);
    this.name = 'ApiError';
  }
}

// ─── Client HTTP interne ──────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
  token?: string;
}

async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // ⚠️ Conduit spec impose "Token xxx" — pas "Bearer xxx"
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...fetchOptions.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // On propage la structure { errors } pour les formulaires
    throw new ApiError(
      response.status,
      (error as { errors?: Record<string, string[]> }).errors ?? {},
    );
  }

  // 204 No Content (ex: DELETE) ne renvoie pas de body
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  return apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  username: string,
  email: string,
  password: string,
) {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export interface UserResponse {
  user: {
    email: string
    username: string
    bio: string | null
    image: string | null
    token: string
  }
}

export async function getCurrentUser(token: string): Promise<UserResponse> {
  return apiFetch<UserResponse>('/user', { token }) // ← token, pas headers manuel
}

export async function updateUser(
  data: Record<string, string>,
  token: string,
) {
  return apiFetch('/user', {
    method: 'PUT',
    body: JSON.stringify({ user: data }),
    token,
  });
}

// ─── Articles ─────────────────────────────────────────────────────────────────

export interface Article {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Profile
}

export interface ArticlesResponse {
  articles: Article[]
  articlesCount: number
}

export async function getArticles(
  params: Record<string, string | number> = {},
  token?: string,
): Promise<ArticlesResponse> {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  ).toString()

  const endpoint = `/articles${query ? `?${query}` : ''}`
  return apiFetch<ArticlesResponse>(endpoint, { token })
}

export interface ArticleResponse {
  article: Article
}

export async function getArticle(slug: string, token?: string): Promise<ArticleResponse> {
  return apiFetch<ArticleResponse>(`/articles/${slug}`, { token })
}

export async function getFeed(token: string) {
  return apiFetch('/articles/feed', { token });
}

export async function getArticlesFeed(
  token: string,
  params: { limit?: number; offset?: number } = {},
): Promise<ArticlesResponse> {
  const qs = new URLSearchParams()
  qs.set('limit', String(params.limit ?? 10))
  qs.set('offset', String(params.offset ?? 0))

  return apiFetch<ArticlesResponse>(`/articles/feed?${qs.toString()}`, { token })
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function getTags() {
  return apiFetch<{ tags: string[] }>('/tags');
}

// ─── Favoris ──────────────────────────────────────────────────────────────────

export async function favoriteArticle(slug: string, token: string) {
  return apiFetch(`/articles/${slug}/favorite`, {
    method: 'POST',
    token,
  });
}

export async function unfavoriteArticle(slug: string, token: string) {
  return apiFetch(`/articles/${slug}/favorite`, {
    method: 'DELETE',
    token,
  });
}

// ─── Commentaires ─────────────────────────────────────────────────────────────

export interface Comment {
  id: number
  body: string
  createdAt: string
  updatedAt: string
  author: Profile
}

export interface CommentsResponse {
  comments: Comment[]
}

export async function getComments(slug: string, token?: string): Promise<CommentsResponse> {
  return apiFetch<CommentsResponse>(`/articles/${slug}/comments`, { token })
}

// ─── Profils ─────────────────────────────────────────────────────────────────

export interface Profile {
  username: string
  bio: string | null
  image: string | null
  following: boolean
}

export interface ProfileResponse {
  profile: Profile
}

/** GET /api/profiles/:username — public */
export async function getProfile(username: string, token?: string): Promise<Profile> {
  const data = await apiFetch<ProfileResponse>(`/profiles/${username}`, {
    token,
    // Pas de cache — le statut "following" dépend de l'utilisateur connecté
    cache: 'no-store',
  })
  return data.profile
}

/** POST /api/profiles/:username/follow — auth requise */
export async function followUser(username: string, token: string): Promise<Profile> {
  const data = await apiFetch<ProfileResponse>(`/profiles/${username}/follow`, {
    method: 'POST',
    token,
  })
  return data.profile
}

/** DELETE /api/profiles/:username/follow — auth requise */
export async function unfollowUser(username: string, token: string): Promise<Profile> {
  const data = await apiFetch<ProfileResponse>(`/profiles/${username}/follow`, {
    method: 'DELETE',
    token,
  })
  return data.profile
}
