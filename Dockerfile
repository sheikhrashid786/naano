# -------------------------------------------------------------------
# Base Stage: Alpine Linux with Node.js 20 and system libraries
# -------------------------------------------------------------------
FROM node:20-alpine AS base

# libc6-compat and openssl are required for Prisma engine on Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# -------------------------------------------------------------------
# Dependencies Stage: Install all npm packages and generate Prisma client
# -------------------------------------------------------------------
FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies strictly matching package-lock.json
RUN npm ci

# Generate Prisma client for linux-musl
RUN npx prisma generate

# -------------------------------------------------------------------
# Builder Stage: Build Next.js standalone application
# -------------------------------------------------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Baked-in environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="mysql://root:@127.0.0.1:3306/naano"
ENV JWT_SECRET="naano_super_secret_session_jwt_key_2026_b2b_marketplace"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Build Next.js standalone bundle
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
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

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
