FROM node:latest AS base

FROM base AS deps
WORKDIR /cache

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
COPY --from=deps /cache/node_modules /node_modules
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

COPY --from=deps /cache/node_modules /node_modules
COPY --from=builder /server/package.json ./package.json

CMD \
  if [ -f yarn.lock ]; then yarn run start; \
  elif [ -f package-lock.json ]; then npm run start; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run start; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS dev
WORKDIR /server
ENV NODE_ENV=development

COPY . .
COPY --from=deps /cache/node_modules /node_modules

CMD \
  if [ -f yarn.lock ]; then yarn start; \
  elif [ -f package-lock.json ]; then npm start; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm start; \
  else echo "Lockfile not found." && exit 1; \
  fi
