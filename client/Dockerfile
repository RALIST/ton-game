FROM node:latest AS base

FROM base AS deps
WORKDIR /cache

#.lock
COPY package.json yarn.lock* ./
RUN yarn install

FROM base AS builder
WORKDIR /client
COPY . .
COPY --from=deps /cache/node_modules /node_modules

RUN yarn run build

# Production image, copy all the files and run next
FROM base AS production
WORKDIR /client

ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder /cache/node_modules /node_modules
COPY --from=builder /cache/package.json /package.json
COPY --from=builder /cache/public ./public

CMD yarn run start

FROM base AS dev
WORKDIR /client
ENV NODE_ENV=development

COPY . .
COPY --from=deps /cache/node_modules /node_modules

CMD yarn run dev
