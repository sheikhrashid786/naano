#!/bin/sh
set -e

echo "==> [Coolify] Initializing Naano container..."

# Check if DATABASE_URL contains localhost / 127.0.0.1
# In Docker, 127.0.0.1 points to the container itself. If MySQL is running on the host machine,
# we test if host.docker.internal is reachable and switch automatically.
if [ -n "$DATABASE_URL" ]; then
  if echo "$DATABASE_URL" | grep -q "127.0.0.1\|localhost"; then
    echo "==> [Coolify] Testing database host connection..."
    if ! nc -z 127.0.0.1 3306 2>/dev/null; then
      if nc -z host.docker.internal 3306 2>/dev/null; then
        echo "==> [Coolify] Automatically redirecting 127.0.0.1 to host.docker.internal for host MySQL..."
        DATABASE_URL=$(echo "$DATABASE_URL" | sed 's/127\.0\.0\.1/host.docker.internal/g' | sed 's/localhost/host.docker.internal/g')
        export DATABASE_URL
      fi
    fi
  fi

  # 1. Automatically run prisma db push on startup
  if [ "${PRISMA_AUTO_MIGRATE:-true}" = "true" ]; then
    echo "==> [Coolify] Synchronizing database schema with Prisma..."
    if [ -f "./node_modules/prisma/build/index.js" ]; then
      node ./node_modules/prisma/build/index.js db push --skip-generate || echo "==> [Coolify] Warning: prisma db push encountered an issue, proceeding..."
    elif [ -f "./node_modules/.bin/prisma" ]; then
      ./node_modules/.bin/prisma db push --skip-generate || echo "==> [Coolify] Warning: prisma db push encountered an issue, proceeding..."
    fi

    # 2. Check and seed sample data if database is fresh
    if [ -f "./prisma/check-and-seed.js" ]; then
      echo "==> [Coolify] Checking if initial seed data is required..."
      node ./prisma/check-and-seed.js || echo "==> [Coolify] Warning: check-and-seed encountered an issue, proceeding..."
    fi
  fi
fi

# 3. Start Next.js server
echo "==> [Coolify] Starting Next.js on port ${PORT:-3000}..."
exec "$@"
