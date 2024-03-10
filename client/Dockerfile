FROM node:latest AS base

FROM base AS deps
WORKDIR /client

#.lock
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /client
COPY --from=deps /client/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS production
WORKDIR /client

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder /client/node_modules ./node_modules
COPY --from=builder /client/package.json ./package.json
COPY --from=builder /client/public ./public

CMD \
  if [ -f yarn.lock ]; then yarn run start; \
  elif [ -f package-lock.json ]; then npm run start; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run start; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS dev
WORKDIR /client
ENV NODE_ENV=development

COPY --from=deps /client/node_modules ./node_modules
COPY . .

CMD \
  if [ -f yarn.lock ]; then yarn run start; \
  elif [ -f package-lock.json ]; then npm run start; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run start; \
  else echo "Lockfile not found." && exit 1; \
  fi