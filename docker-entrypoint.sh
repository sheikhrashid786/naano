#!/bin/sh
set -e

echo "==> [Coolify] Initializing Naano container..."

# 1. Automatically run prisma db push and seed on startup if database is configured
if [ "${PRISMA_AUTO_MIGRATE:-true}" = "true" ] && [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "mysql://dummy:dummy@localhost:3306/dummy" ]; then
  echo "==> [Coolify] Synchronizing database schema with Prisma..."
  if [ -f "./node_modules/.bin/prisma" ]; then
    ./node_modules/.bin/prisma db push --skip-generate || echo "==> [Coolify] Warning: prisma db push encountered an issue, proceeding..."
  fi

  # 2. Check and seed sample data if database is fresh
  if [ -f "./prisma/check-and-seed.js" ]; then
    echo "==> [Coolify] Checking if initial seed data is required..."
    node ./prisma/check-and-seed.js || echo "==> [Coolify] Warning: check-and-seed encountered an issue, proceeding..."
  fi
fi

# 3. Start Next.js server
echo "==> [Coolify] Starting Next.js on port ${PORT:-3000}..."
exec "$@"
