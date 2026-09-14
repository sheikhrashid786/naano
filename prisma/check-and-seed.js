const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function main() {
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    console.log(`==> [Database Check] Found ${userCount} existing user(s) in database.`);

    const forceSeed = process.env.PRISMA_SEED === 'true' || process.env.AUTO_SEED === 'true';

    if (userCount === 0 || forceSeed) {
      console.log('==> [Database Seeding] Database is empty or PRISMA_SEED=true. Seeding sample creators & brands...');
      await prisma.$disconnect();
      execSync('node prisma/seed.js', { stdio: 'inherit' });
      console.log('==> [Database Seeding] Sample data seeded successfully!');
    } else {
      console.log('==> [Database Seeding] Database already has data. Skipping seed to protect existing data.');
    }
  } catch (error) {
    console.warn('==> [Database Seeding Notice]', error.message);
  } finally {
    try {
      await prisma.$disconnect();
    } catch {}
  }
}

main();
