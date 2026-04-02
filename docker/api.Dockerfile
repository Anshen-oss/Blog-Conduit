# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Stage 1 — BASE : partagé dev + prod
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FROM node:22-alpine AS base

# Active pnpm via corepack (inclus dans Node 22)
RUN corepack enable

WORKDIR /app

# Copie les fichiers de dépendances en PREMIER (cache Docker optimisé)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Installe les dépendances
RUN pnpm install --frozen-lockfile

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Stage 2 — BUILDER : compilation TypeScript
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FROM base AS builder

# Maintenant on copie le vrai code source
COPY apps/api ./apps/api

# Compile TypeScript → JavaScript
RUN pnpm --filter=api build

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Stage 3 — RUNNER : image de production légère
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FROM node:22-alpine AS runner

RUN corepack enable

WORKDIR /app

# On ne copie QUE ce dont on a besoin pour tourner
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# NestJS tourne sur le port 3001
EXPOSE 3001

# Commande de démarrage en prod
CMD ["node", "dist/main.js"]
