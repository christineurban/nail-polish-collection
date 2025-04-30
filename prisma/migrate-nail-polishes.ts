import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Read the transformed JSON data
const transformedDataPath = path.join(process.cwd(), 'transformed-polishes.json');
const nailPolishes = JSON.parse(readFileSync(transformedDataPath, 'utf-8'));

async function main() {
  for (const polish of nailPolishes) {
    try {
      // Find or create brand
      const brand = await prisma.brands.upsert({
        where: { name: polish.brand },
        update: {},
        create: {
          name: polish.brand,
          updated_at: new Date()
        },
      });

      // Find or create color (using first color if multiple)
      const color = await prisma.colors.upsert({
        where: { name: polish.colors[0] },
        update: {},
        create: {
          name: polish.colors[0],
          updated_at: new Date()
        },
      });

      // Create nail polish
      const nailPolish = await prisma.nail_polish.create({
        data: {
          name: polish.name,
          image_url: polish.image_url,
          coats: polish.coats,
          rating: polish.rating,
          notes: polish.notes,
          link: polish.link,
          brand_id: brand.id,
          total_bottles: polish.total_bottles || 1,
          empty_bottles: polish.empty_bottles || 0,
          updated_at: new Date(),
          colors: {
            create: {
              color_id: color.id,
              updated_at: new Date()
            }
          }
        },
      });

      // Handle additional colors if present
      if (polish.colors.length > 1) {
        for (const colorName of polish.colors.slice(1)) {
          const additionalColor = await prisma.colors.upsert({
            where: { name: colorName },
            update: {},
            create: {
              name: colorName,
              updated_at: new Date()
            },
          });

          await prisma.nail_polish_color.create({
            data: {
              nail_polish_id: nailPolish.id,
              color_id: additionalColor.id,
              updated_at: new Date()
            },
          });
        }
      }

      // Handle finishes
      if (polish.finishes && polish.finishes.length > 0) {
        for (const finishName of polish.finishes) {
          const finish = await prisma.finishes.upsert({
            where: { name: finishName },
            update: {},
            create: {
              name: finishName,
              updated_at: new Date()
            },
          });

          // Create finish relationship through junction table
          await prisma.nail_polish_finish.create({
            data: {
              nail_polish_id: nailPolish.id,
              finish_id: finish.id,
              updated_at: new Date()
            },
          });
        }
      }

      console.log(`Successfully created polish: ${polish.brand} - ${polish.name}`);
    } catch (e: any) {
      console.error(`Failed to create polish: ${polish.brand} - ${polish.name}`);
      console.error('Error details:', {
        name: e.name,
        message: e.message,
        code: e.code,
        meta: e.meta
      });
    }
  }

  console.log('Migration completed successfully');
}

main()
  .catch((e: any) => {
    console.error('Error details:', {
      name: e.name,
      message: e.message,
      code: e.code,
      meta: e.meta
    });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
