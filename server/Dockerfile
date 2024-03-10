FROM node:latest AS base

FROM base AS deps
WORKDIR /server

#.lock
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /server
COPY --from=deps /server/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS production
WORKDIR /server

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /server/node_modules ./node_modules
COPY --from=builder /server/package.json ./package.json
COPY --from=builder /server/public ./public

CMD \
  if [ -f yarn.lock ]; then yarn run start; \
  elif [ -f package-lock.json ]; then npm run start; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run start; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS dev
WORKDIR /server
ENV NODE_ENV=development

COPY --from=deps /server/node_modules ./node_modules
COPY . .

CMD \
  if [ -f yarn.lock ]; then yarn start; \
  elif [ -f package-lock.json ]; then npm start; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm start; \
  else echo "Lockfile not found." && exit 1; \
  fi
