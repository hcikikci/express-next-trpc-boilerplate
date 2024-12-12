import { PrismaClient } from '@prisma/client';
import { seedTodos } from './todoSeeder';

const prisma = new PrismaClient();

async function main() {
  await seedTodos(prisma);
  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
