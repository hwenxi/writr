FROM node:20-alpine AS base

# Install dependencies as needed
FROM base as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./

RUN npm ci --omit dev


# Rebuild source code as needed
FROM base as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Load in env variables (as args) from Dockerfile - otherwise need to use Dotenv at node build (isolate .env reading in Dockerfile)
ARG OPENAI_KEY
ARG PUBLIC_DEFAULT_TOOL

ENV OPENAI_KEY=${OPENAI_KEY}
ENV PUBLIC_DEFAULT_TOOL=${PUBLIC_DEFAULT_TOOL}

RUN npm run build


# Run prod. image
FROM base as runner

# Remove global node modules (all needed are in /app)
RUN rm -rf /usr/local/lib/node_modules

# Don't run production as root
RUN addgroup --system -gid 1001 nodejs
RUN adduser --system -uid 1001 sveltekit
USER sveltekit

WORKDIR /app
COPY --from=builder --chown=nodejs:sveltekit /app/build ./build
COPY --from=builder --chown=nodejs:sveltekit /app/node_modules ./node_modules

# Copy in static (public resources, images may be added here)
COPY  --from=builder --chown=nodejs:sveltekit /app/public ./public

# Port exposed in docker compose

CMD ["node", "build"]
