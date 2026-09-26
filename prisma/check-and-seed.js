const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function main() {
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    console.log(`==> [Database Check] Found ${userCount} existing user(s), ${adminCount} admin(s).`);

    const forceSeed = process.env.PRISMA_SEED === 'true' || process.env.AUTO_SEED === 'true';

    if (userCount === 0 || adminCount === 0 || forceSeed) {
      console.log('==> [Database Seeding] Database missing admin account or fresh seed required. Seeding sample creators, brands & admin...');
      await prisma.$disconnect();
      execSync('node prisma/seed.js', { stdio: 'inherit' });
      console.log('==> [Database Seeding] Data seeded successfully on server startup!');
    } else {
      console.log('==> [Database Seeding] Database has up-to-date seed. Skipping seed to protect existing data.');
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
