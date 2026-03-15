import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Brands that should be marked as indie
const INDIE_BRANDS = [
  'KBShimmer',
  'Holo Taco',
  'ILNP',
  'Cirque Colors',
  'Polish Me Silly',
  'Mooncat',
  'Penelope Luz',
  'Phoenix',
  'Cadillacquer',
  'Glisten & Glow',
  'Cupcake Polish',
  'Painted Polish',
  "What's Up Nails",
  'Colores de Carol',
  'Dance Legend',
  'Serum No. 5',
  'Wing Dust',
  'A England',
  'Arcane Lacquer',
  'Bow Nail Polish',
  'Colors By Llarowe',
  'Crowstoes',
  'Emily de Molly',
  'Esmaltes da Kelly',
  'Fancy Gloss',
  'Hit the Bottle',
  'I Scream Nails',
  'Jade Diamond',
  'Joss',
  'Up Colors',
];

async function main() {
  // First mark everything as non-indie
  await prisma.$executeRaw`UPDATE nail_polish SET is_indie = false`;

  // Then mark indie brands as true
  await prisma.$executeRaw`
    UPDATE nail_polish
    SET is_indie = true
    FROM brands
    WHERE nail_polish.brand_id = brands.id
      AND brands.name IN (${Prisma.join(INDIE_BRANDS)})
  `;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

