import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';
import { type SheetRow } from './transform-sheet-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function verifyImport() {
  try {
    // Read the CSV file
    const csvFilePath = path.join(__dirname, 'polish-data.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as SheetRow[];

    // Get all polishes from database with their relationships
    const dbPolishes = await prisma.nail_polish.findMany({
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

    // Find duplicates in CSV
    const duplicateCounts = new Map<string, number>();
    const duplicateEntries = new Map<string, SheetRow[]>();

    records.forEach(row => {
      // Include color in the key to differentiate polishes with same brand/name but different colors
      const polishKey = `${row.Brand}|||${row.Polish}|||${row.Color}`;
      duplicateCounts.set(polishKey, (duplicateCounts.get(polishKey) || 0) + 1);

      if (!duplicateEntries.has(polishKey)) {
        duplicateEntries.set(polishKey, []);
      }
      duplicateEntries.get(polishKey)!.push(row);
    });

    // Create sets for comparison - now including color
    const csvPolishes = new Set(records.map(r => `${r.Brand}|||${r.Polish}|||${r.Color}`));
    const dbPolishSet = new Set(dbPolishes.map(p => {
      const color = p.colors[0]?.color.name || 'Unknown';
      return `${p.brands.name}|||${p.name}|||${color}`;
    }));

    // Find missing polishes
    const missingPolishes = Array.from(csvPolishes).filter(x => !dbPolishSet.has(x));

    console.log('\nVerification Results:');
    console.log('---------------------');
    console.log(`Total rows in CSV: ${records.length}`);
    console.log(`Unique polishes in CSV (by brand, name, and color): ${csvPolishes.size}`);
    console.log(`Total polishes in DB: ${dbPolishes.length}`);
    console.log(`Missing polishes: ${missingPolishes.length}`);

    // Show duplicates
    console.log('\nDuplicate Polishes in CSV:');
    console.log('-------------------------');
    let totalDuplicates = 0;
    for (const [key, count] of Array.from(duplicateCounts.entries())) {
      if (count > 1) {
        const [brand, name, color] = key.split('|||');
        const entries = duplicateEntries.get(key)!;
        console.log(`\n${brand} "${name}" (Color: ${color}) (${count} bottles):`);

        // Find this polish in DB
        const dbPolish = dbPolishes.find(p =>
          p.brands.name === brand &&
          p.name === name &&
          p.colors.some(c => c.color.name === color)
        );

        entries.forEach((entry, idx) => {
          console.log(`  Entry ${idx + 1}:`);
          console.log(`    Color: ${entry.Color}`);
          console.log(`    Finishes: ${entry['Finishes/Types']}`);
          if (entry.Rating) console.log(`    Rating: ${entry.Rating}`);
          if (entry.Notes) console.log(`    Notes: ${entry.Notes}`);
        });

        if (dbPolish) {
          console.log('  In Database:');
          console.log(`    Total Bottles: ${dbPolish.total_bottles}`);
          console.log(`    Colors: ${dbPolish.colors.map(c => c.color.name).join(', ')}`);
          console.log(`    Finishes: ${dbPolish.finishes.map(f => f.finish.name).join(', ')}`);
        }

        totalDuplicates += count - 1;
      }
    }

    console.log(`\nTotal duplicate entries: ${totalDuplicates}`);

    if (missingPolishes.length > 0) {
      console.log('\nMissing Polishes:');
      missingPolishes.forEach(polish => {
        const [brand, name, color] = polish.split('|||');
        const originalRecord = records.find(r => r.Brand === brand && r.Polish === name && r.Color === color);
        console.log(`- ${brand} "${name}" (Color: ${color})`);
        if (originalRecord) {
          console.log(`  Finishes: ${originalRecord['Finishes/Types']}`);
        }
      });
    }

  } catch (error) {
    console.error('Error verifying import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyImport();
