const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const collabs = await prisma.collaboration.findMany({
    include: {
      creator: { include: { user: true } },
      campaign: { include: { company: true } }
    }
  });
  console.log('Total collaborations:', collabs.length);
  for (const c of collabs) {
    console.log({
      id: c.id,
      creator: c.creator.user.name,
      creatorEmail: c.creator.user.email,
      campaign: c.campaign.title,
      company: c.campaign.company.name,
      status: c.status,
      rate: c.fixedRate
    });
  }
}

main().finally(() => prisma.$disconnect());
