#!/bin/sh
set -e

# Automatically run prisma db push on startup if enabled (default: true if DATABASE_URL is set)
if [ "${PRISMA_AUTO_MIGRATE:-true}" = "true" ] && [ -n "$DATABASE_URL" ] && [ "$DATABASE_URL" != "mysql://dummy:dummy@localhost:3306/dummy" ]; then
  echo "==> [Coolify Entrypoint] Checking database and applying Prisma schema..."
  if [ -f "./node_modules/.bin/prisma" ]; then
    ./node_modules/.bin/prisma db push --skip-generate || echo "==> [Coolify Entrypoint] Prisma push skipped or failed. Continuing to start app..."
  fi
fi

# Execute the main container command (defaults to: node server.js)
echo "==> [Coolify Entrypoint] Starting Next.js on port ${PORT:-3000}..."
exec "$@"
