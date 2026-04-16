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
    body: JSON.stringify({ user: { email, password } }),
  });
}

export async function register(
  username: string,
  email: string,
  password: string,
) {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({ user: { username, email, password } }),
  });
}

export async function getCurrentUser(token: string) {
  return apiFetch('/user', { token });
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

export async function getArticles(
  params: Record<string, string | number> = {},
  token?: string,
) {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
  ).toString();

  const endpoint = `/articles${query ? `?${query}` : ''}`;
  return apiFetch(endpoint, { token });
}

export async function getArticle(slug: string, token?: string) {
  return apiFetch(`/articles/${slug}`, { token });
}

export async function getFeed(token: string) {
  return apiFetch('/articles/feed', { token });
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function getTags() {
  return apiFetch<{ tags: string[] }>('/tags');
}

// ─── Profils ──────────────────────────────────────────────────────────────────

export async function getProfile(username: string, token?: string) {
  return apiFetch(`/profiles/${username}`, { token });
}
