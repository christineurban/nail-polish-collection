import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';
import { transformSheetData, type SheetRow } from './transform-sheet-data';
import { NextResponse } from 'next/server';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function promptForConfirmation(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\x1b[31m%s\x1b[0m', '⚠️  WARNING: This will delete all existing data in the database.');
  console.log('\x1b[31m%s\x1b[0m', '   Please make sure you have a backup before proceeding.');
  console.log('\x1b[31m%s\x1b[0m', '   Run `npm run backup` to create a backup first.');

  const answer = await new Promise<string>(resolve => {
    rl.question('\nAre you sure you want to proceed? (y/N): ', resolve);
  });

  rl.close();
  return answer.toLowerCase() === 'y';
}

async function seedFromCsv() {
  const shouldProceed = await promptForConfirmation();

  if (!shouldProceed) {
    console.log('Operation cancelled');
    process.exit(0);
  }

  const stats = {
    totalRows: 0,
    successfullyAdded: 0,
    failedToAdd: 0,
    failures: [] as { brand: string; name: string; error: string }[],
  };

  try {
    // Read the CSV file
    const csvFilePath = path.join(__dirname, 'polish-data.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as SheetRow[];

    stats.totalRows = records.length;
    console.log(`Found ${stats.totalRows} rows in CSV file`);

    // Transform the data
    const transformedData = transformSheetData(records);
    console.log(`Transformed ${transformedData.length} records`);

    // Clear existing data in correct order
    console.log('Clearing existing data...');
    await prisma.nail_polish_color.deleteMany();
    await prisma.nail_polish_finish.deleteMany();
    await prisma.nail_polish.deleteMany();
    await prisma.brands.deleteMany();
    await prisma.colors.deleteMany();
    await prisma.finishes.deleteMany();
    console.log('Existing data cleared');

    // Create brands first
    console.log('Creating brands...');
    const brandMap = new Map<string, string>();
    const uniqueBrands = new Set(transformedData.map(p => p.brand));
    console.log(`Found ${uniqueBrands.size} unique brands`);

    for (const polish of transformedData) {
      if (!brandMap.has(polish.brand)) {
        const brand = await prisma.brands.create({
          data: {
            name: polish.brand,
            updated_at: new Date(),
          },
        });
        brandMap.set(polish.brand, brand.id);
      }
    }

    // Create colors
    console.log('Creating colors...');
    const colorMap = new Map<string, string>();
    const uniqueColors = new Set(transformedData.flatMap(p => p.colors));
    console.log(`Found ${uniqueColors.size} unique colors`);

    for (const polish of transformedData) {
      for (const color of polish.colors) {
        if (!colorMap.has(color)) {
          const colorRecord = await prisma.colors.create({
            data: {
              name: color,
              updated_at: new Date(),
            },
          });
          colorMap.set(color, colorRecord.id);
        }
      }
    }

    // Create finishes
    console.log('Creating finishes...');
    const finishMap = new Map<string, string>();
    const uniqueFinishes = new Set(transformedData.flatMap(p => p.finishes));
    console.log(`Found ${uniqueFinishes.size} unique finishes`);

    for (const polish of transformedData) {
      for (const finish of polish.finishes) {
        if (!finishMap.has(finish)) {
          const finishRecord = await prisma.finishes.create({
            data: {
              name: finish,
              updated_at: new Date(),
            },
          });
          finishMap.set(finish, finishRecord.id);
        }
      }
    }

    // Insert all polishes with relationships
    console.log('Creating nail polishes...');
    for (const polish of transformedData) {
      try {
        const brandId = brandMap.get(polish.brand)!;

        await prisma.nail_polish.create({
          data: {
            name: polish.name,
            image_url: polish.image_url,
            brand_id: brandId,
            link: polish.link,
            coats: polish.coats,
            rating: polish.rating,
            notes: polish.notes,
            is_old: polish.is_old,
            empty_bottles: polish.empty_bottles,
            total_bottles: polish.total_bottles,
            last_used: polish.last_used,
            no_image_available: polish.no_image_available,
            updated_at: new Date(),
            colors: {
              create: polish.colors.map(color => ({
                color_id: colorMap.get(color)!,
                updated_at: new Date(),
              })),
            },
            finishes: {
              create: polish.finishes.map(finish => ({
                finish_id: finishMap.get(finish)!,
                updated_at: new Date(),
              })),
            },
          },
        });
        stats.successfullyAdded++;
      } catch (error) {
        stats.failedToAdd++;
        stats.failures.push({
          brand: polish.brand,
          name: polish.name,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Print final statistics
    console.log('\nSeeding completed!');
    console.log('-------------------');
    console.log(`Total rows in CSV: ${stats.totalRows}`);
    console.log(`Successfully added: ${stats.successfullyAdded}`);
    console.log(`Failed to add: ${stats.failedToAdd}`);

    if (stats.failures.length > 0) {
      console.log('\nFailures:');
      stats.failures.forEach(failure => {
        console.log(`- ${failure.brand} "${failure.name}": ${failure.error}`);
      });
    }

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedFromCsv();
