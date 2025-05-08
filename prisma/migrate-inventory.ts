import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type PolishWithRelations = {
  id: string;
  image_url: string | null;
  brand_id: string;
  name: string;
  link: string | null;
  coats: number | null;
  rating: string | null;
  notes: string | null;
  total_bottles: number;
  empty_bottles: number;
  is_old: boolean | null;
  last_used: Date | null;
  created_at: Date;
  updated_at: Date;
  brands: {
    name: string;
    id: string;
    created_at: Date;
    updated_at: Date;
  };
  colors: Array<{
    color: {
      name: string;
      id: string;
      created_at: Date;
      updated_at: Date;
    };
    created_at: Date;
    updated_at: Date;
    nail_polish_id: string;
    color_id: string;
  }>;
  finishes: Array<{
    finish: {
      name: string;
      id: string;
      created_at: Date;
      updated_at: Date;
    };
    created_at: Date;
    updated_at: Date;
    nail_polish_id: string;
    finish_id: string;
  }>;
};

async function main() {
  try {
    console.log('Starting inventory migration...');

    // Step 1: Find all nail polishes
    const allPolishes = await prisma.nail_polish.findMany({
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
    }) as PolishWithRelations[];

    // Step 2: Group by brand and name to find duplicates
    const groupedPolishes = allPolishes.reduce((acc: Record<string, PolishWithRelations[]>, polish) => {
      const key = `${polish.brands.name}-${polish.name}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(polish);
      return acc;
    }, {});

    // Step 3: Process each group
    for (const [key, duplicates] of Object.entries(groupedPolishes)) {
      if (duplicates.length <= 1) continue;

      console.log(`\nProcessing duplicates for ${key}:`);
      console.log(`Found ${duplicates.length} duplicates`);

      // Sort by most complete record (most relations, most fields filled)
      const sortedDuplicates = duplicates.sort((a, b) => {
        const aScore = (a.colors?.length || 0) + (a.finishes?.length || 0) + (a.image_url ? 1 : 0) + (a.rating ? 1 : 0);
        const bScore = (b.colors?.length || 0) + (b.finishes?.length || 0) + (b.image_url ? 1 : 0) + (b.rating ? 1 : 0);
        return bScore - aScore;
      });

      const keepPolish = sortedDuplicates[0];
      const deletePolishes = sortedDuplicates.slice(1);

      console.log(`Keeping polish with ID: ${keepPolish.id}`);
      console.log(`Deleting ${deletePolishes.length} duplicates`);

      // Update the kept polish with total bottles
      await prisma.nail_polish.update({
        where: { id: keepPolish.id },
        data: {
          total_bottles: duplicates.length,
          updated_at: new Date()
        }
      });

      // Delete duplicate polishes
      for (const polish of deletePolishes) {
        await prisma.nail_polish.delete({
          where: { id: polish.id }
        });
      }
    }

    console.log('\nMigration completed successfully!');
    console.log('You can now use Prisma Studio to update the status and empty_bottles fields manually.');

  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
