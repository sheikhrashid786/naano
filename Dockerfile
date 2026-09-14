# -------------------------------------------------------------------
# Base Stage: Debian Slim with Node.js 20, glibc, and OpenSSL
# Matches @next/swc-linux-x64-gnu in package-lock.json
# -------------------------------------------------------------------
FROM node:20-slim AS base

# Install openssl, ca-certificates, and netcat for database host reachability checks
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl ca-certificates netcat-openbsd && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# -------------------------------------------------------------------
# Dependencies Stage: Install all npm packages and generate Prisma client
# -------------------------------------------------------------------
FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies strictly matching package-lock.json
RUN npm ci

# Generate Prisma client for linux-glibc
RUN npx prisma generate

# -------------------------------------------------------------------
# Builder Stage: Build Next.js standalone application
# -------------------------------------------------------------------
FROM base AS builder

# Copy application source code
COPY . .

# Ensure clean Linux dependencies and Prisma from deps stage are used
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Baked-in environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="mysql://root:@127.0.0.1:3306/naano"
ENV JWT_SECRET="naano_super_secret_session_jwt_key_2026_b2b_marketplace"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Ensure Prisma client is in sync and build Next.js standalone bundle
RUN npx prisma generate
RUN npm run build

# -------------------------------------------------------------------
# Production Runner Stage: Minimal, hardened container for Coolify
# -------------------------------------------------------------------
FROM base AS runner

# Baked-in environment variables for runtime in Coolify (no manual entry needed)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="mysql://root:@127.0.0.1:3306/naano"
ENV JWT_SECRET="naano_super_secret_session_jwt_key_2026_b2b_marketplace"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV PRISMA_AUTO_MIGRATE="true"
ENV PRISMA_SEED="false"

# Create non-root system user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 -g nodejs nextjs

# Copy static assets and public files
COPY --from=builder /app/public ./public

# Prepare .next directory with correct permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone build and static bundles
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy Prisma engines and CLI so migrations can run at startup if desired
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin

# Copy startup entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
