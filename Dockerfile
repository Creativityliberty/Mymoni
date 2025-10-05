# Dockerfile for Mymoni - Production Build

# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Install OpenSSL 1.1 (required by Prisma)
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Install ALL dependencies (including dev dependencies needed for build)
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Install OpenSSL 1.1 (required by Prisma)
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js (without database connection)
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
RUN npm run build

# Stage 3: Runner
FROM node:20-slim AS runner
WORKDIR /app

# Install OpenSSL 1.1 (required by Prisma at runtime)
RUN apt-get update -y && \
    apt-get install -y openssl libssl-dev && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=Europe/Paris

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
