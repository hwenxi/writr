FROM node:20-alpine AS base

# Install dependencies as needed
FROM base as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./

RUN npm ci


# Rebuild source code as needed
FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Load in env variables (as args) from Dockerfile - otherwise need to use Dotenv at node build (isolate .env reading in Dockerfile)
ARG OPENAI_KEY
ARG PUBLIC_DEFAULT_TOOL
ARG POCKETBASE_ADMIN_PW
ARG POCKETBASE_ADMIN_USER
ARG WEB_DOMAIN

ENV OPENAI_KEY=${OPENAI_KEY}
ENV PUBLIC_DEFAULT_TOOL=${PUBLIC_DEFAULT_TOOL}
ENV POCKETBASE_ADMIN_USER=${POCKETBASE_ADMIN_USER}
ENV POCKETBASE_ADMIN_PW=${POCKETBASE_ADMIN_PW}
ENV WEB_DOMAIN=${WEB_DOMAIN}

RUN npm run build
# After building, node build errors on build/index.js line 1 "Cannot use import statement outside a module". Placing package.json in /build/ fixes: https://www.reddit.com/r/sveltejs/comments/108ayfb/sveltekit_adapternode_deploy/
COPY --from=deps /app/package.json  /app/build/

# Run prod. image
FROM base as runner

# Remove global node modules (all needed are in /app)
RUN rm -rf /usr/local/lib/node_modules

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit
USER sveltekit

WORKDIR /app
COPY --from=builder --chown=nodejs:sveltekit /app/build ./build
COPY --from=builder --chown=nodejs:sveltekit /app/node_modules ./node_modules

# Copy in static (public resources, images may be added here)
COPY  --from=builder --chown=nodejs:sveltekit /app/static ./static

ARG OPENAI_KEY
ARG PUBLIC_DEFAULT_TOOL
ARG POCKETBASE_ADMIN_PW
ARG POCKETBASE_ADMIN_USER
ARG WEB_DOMAIN

ENV OPENAI_KEY=${OPENAI_KEY}
ENV PUBLIC_DEFAULT_TOOL=${PUBLIC_DEFAULT_TOOL}
ENV POCKETBASE_ADMIN_USER=${POCKETBASE_ADMIN_USER}
ENV POCKETBASE_ADMIN_PW=${POCKETBASE_ADMIN_PW}
ENV WEB_DOMAIN=${WEB_DOMAIN}

# Port exposed in docker compose

CMD ["node", "build"]
