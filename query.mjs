import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const polishes = await prisma.nail_polish.findMany({
      where: {
        brand_id: '2aa3ac70-bf5f-44a9-8f6c-7d96493ba3ba'
      },
      include: {
        brands: true,
        colors: {
          include: {
            color: true
          }
        },
        finishes: {
          include: {
            finish: true
          }
        }
      }
    });
    console.log(JSON.stringify(polishes, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
