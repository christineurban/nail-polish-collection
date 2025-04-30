import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed brands
  const brands = [
    'A England',
    'Arcane Lacquer',
    'Barry M',
    'Barry M Gelly Hi-Shine',
    'Barry M Speedy Quick Dry',
    'Believe Beauty',
    'Bow Nail Polish',
    'Calvin Klein',
    'Cherimoya',
    'China Glaze',
    'Ciaté',
    'Cirque Colors',
    'Color Club',
    'Colores de Carol',
    'Colors By Llarowe',
    'CoverGirl Outlast',
    'Crowstoes',
    'Cupcake Polish',
    'Dance Legend',
    'Deborah Lippmann',
    'Del Sol',
    'Emily de Molly',
    'Esmaltes da Kelly',
    'Essie',
    'Essie Gel Couture',
    'Essie Luxeffects',
    'Expressie',
    'Fancy Gloss',
    'Forever 21',
    'Formula X',
    'Gabriel',
    'Glisten & Glow',
    'Hit the Bottle',
    'Hits',
    'Holo Taco',
    'ILNP',
    'Jade Diamond',
    'Joss',
    'KBShimmer',
    'Kleancolor',
    'Konad',
    'L.A. Colors Art Deco',
    'L.A. Colors Color Craze',
    'Lancome Vernis In Love',
    'Loreal',
    'Maybelline',
    'Milani Color Statement',
    'Models Own',
    'Mooncat',
    'Morgan Taylor',
    'Mundo de Unas',
    'N/A',
    'Nfu Oh',
    'Nicole By OPI',
    'No7',
    'NYC',
    'OPI',
    'Orly',
    'Penelope Luz',
    'Phoenix',
    'Polish Me Silly',
    'Poshe',
    'Revlon',
    'Revlon Colorstay',
    'Revlon Top Speed',
    'Sally Hansen Diamond Strength',
    'Sally Hansen I ❤️ Nail Art',
    'Sally Hansen Insta-Dri',
    'Sally Hansen Nailgrowth Miracle',
    'Sally Hansen Xtreme Wear',
    'Seche',
    'Sephora by OPI',
    'Sephora Collection',
    'Serum No. 5',
    'Shaka',
    'Sinful Colors',
    'Sonia Kashuk',
    'Sparitual',
    'Up Colors',
    'Urban Outfitters',
    'Wet n Wild',
    "What's Up Nails",
    'Wing Dust',
    'YSL',
    'Zoya'
  ];

  // Seed colors
  const colors = [
    'Beige',
    'Black',
    'Blue',
    'Brown',
    'Clear',
    'Gold',
    'Gray',
    'Green',
    'Multi',
    'Orange',
    'Pink',
    'Purple',
    'Red',
    'Silver',
    'Teal',
    'White',
    'Yellow'
  ];

  // Seed finishes
  const finishes = [
    'Crackle',
    'Creme',
    'Crelly',
    'Duochrome',
    'Flakie',
    'Frost',
    'Glass Fleck',
    'Glitter',
    'Glitter - Chunky',
    'Glitter - Micro',
    'Glow in the Dark',
    'Holo',
    'Holo - Linear',
    'Holo - Scattered',
    'Iridescent',
    'Jelly',
    'Matte',
    'Metallic',
    'Multichrome',
    'Neon',
    'Reflective',
    'Scented',
    'Sheer',
    'Shifty',
    'Shimmer',
    'Textured',
    'Thermal',
    'UV'
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
