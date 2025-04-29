import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type NailPolishWithBrand = {
  id: string;
  name: string;
  image_url: string | null;
  coats: number | null;
  rating: string | null;
  notes: string | null;
  link: string | null;
  brand_id: string;
  updated_at: Date;
  brands: {
    id: string;
    name: string;
    updated_at: Date;
  };
};

async function main() {
  // Get all nail polishes
  const allPolishes = await prisma.nail_polish.findMany({
    include: {
      brands: true,
    },
  }) as NailPolishWithBrand[];

  // Group polishes by brand and name
  const groupedPolishes = allPolishes.reduce((acc: Record<string, NailPolishWithBrand[]>, polish: NailPolishWithBrand) => {
    const key = `${polish.brands.name}-${polish.name}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(polish);
    return acc;
  }, {});

  // Find duplicates
  const entries = Object.entries(groupedPolishes) as [string, NailPolishWithBrand[]][];
  const duplicates = entries.filter(([_, polishes]) => polishes.length > 1);

  console.log(`Found ${duplicates.length} groups of duplicates`);

  // For each group of duplicates
  for (const [key, polishes] of duplicates) {
    console.log(`\nProcessing duplicates for ${key}`);

    // Sort by updated_at to keep the most recent one
    const sortedPolishes = polishes.sort((a: NailPolishWithBrand, b: NailPolishWithBrand) =>
      b.updated_at.getTime() - a.updated_at.getTime()
    );

    const [keepPolish, ...duplicatesToRemove] = sortedPolishes;

    console.log(`Keeping polish with ID: ${keepPolish.id}`);
    console.log(`Removing ${duplicatesToRemove.length} duplicates`);

    // Delete the duplicates
    for (const duplicate of duplicatesToRemove) {
      try {
        // First remove any related records
        await prisma.nail_polish_finish.deleteMany({
          where: { nail_polish_id: duplicate.id }
        });

        await prisma.nail_polish_color.deleteMany({
          where: { nail_polish_id: duplicate.id }
        });

        // Then delete the polish itself
        await prisma.nail_polish.delete({
          where: { id: duplicate.id }
        });

        console.log(`Successfully deleted duplicate with ID: ${duplicate.id}`);
      } catch (error) {
        console.error(`Error deleting duplicate ${duplicate.id}:`, error);
      }
    }
  }

  console.log('\nCleanup completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
