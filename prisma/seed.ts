import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed brands
  const brands = [
    'OPI',
    'Essie',
    'China Glaze',
    'Sally Hansen',
    'Zoya',
    'Orly',
    'Butter London',
    'Deborah Lippmann',
    'Nails Inc',
    'CND',
    'Revlon',
    'Maybelline',
    'Sinful Colors',
    'Wet n Wild',
    'L.A. Colors',
    'Color Club',
    'ILNP',
    'Holo Taco',
    'Cirque Colors',
    'KBShimmer',
  ];

  // Seed colors
  const colors = [
    'Red',
    'Pink',
    'Purple',
    'Blue',
    'Green',
    'Yellow',
    'Orange',
    'Brown',
    'Black',
    'White',
    'Gray',
    'Silver',
    'Gold',
    'Nude',
    'Coral',
    'Teal',
    'Navy',
    'Burgundy',
    'Mint',
    'Lavender',
  ];

  // Seed finishes
  const finishes = [
    'Cream',
    'Shimmer',
    'Glitter',
    'Metallic',
    'Holographic',
    'Jelly',
    'Matte',
    'Satin',
    'Pearl',
    'Duochrome',
    'Multichrome',
    'Thermal',
    'Magnetic',
    'Cat Eye',
    'Flakie',
    'Sheer',
    'Opaque',
    'Frost',
    'Chrome',
    'Gel',
  ];

  const now = new Date();

  // Create brands
  for (const brand of brands) {
    await prisma.brands.upsert({
      where: { name: brand },
      update: {},
      create: {
        name: brand,
        updated_at: now
      },
    });
  }

  // Create colors
  for (const color of colors) {
    await prisma.colors.upsert({
      where: { name: color },
      update: {},
      create: {
        name: color,
        updated_at: now
      },
    });
  }

  // Create finishes
  for (const finish of finishes) {
    await prisma.finishes.upsert({
      where: { name: finish },
      update: {},
      create: {
        name: finish,
        updated_at: now
      },
    });
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
