import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'silvia.popova2004@gmail.com' },
    update: {},
    create: {
      email: 'silvia.popova2004@gmail.com',
      password: ''
    }
  });

  // Seed measurements for past 2 days
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.measurement.createMany({
    data: [
      {
        userId: user.id,
        date: new Date("2025-06-28").toISOString(),
        waist: 80,
        hips: 90,
        thigh: 50,
        arm: 30,
        chest: 95,
        underNavel: 85,
        weight: 61.8,
      },
      {
        userId: user.id,
        date: new Date("2025-06-29").toISOString(),
        waist: 81,
        hips: 91,
        thigh: 51,
        arm: 31,
        chest: 96,
        underNavel: 86,
        weight: 62.3,
      },
    ],
  });
  console.log('Seeding done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
