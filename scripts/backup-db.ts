import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', timestamp);

  try {
    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });

    // Backup each table
    const tables = [
      { name: 'brands', query: () => prisma.brands.findMany() },
      { name: 'colors', query: () => prisma.colors.findMany() },
      { name: 'finishes', query: () => prisma.finishes.findMany() },
      {
        name: 'nail_polish',
        query: () => prisma.nail_polish.findMany({
          include: {
            colors: {
              include: {
                color: true
              }
            },
            finishes: {
              include: {
                finish: true
              }
            },
            brands: true
          }
        })
      }
    ];

    for (const table of tables) {
      console.log(`Backing up ${table.name}...`);
      const data = await table.query();
      fs.writeFileSync(
        path.join(backupDir, `${table.name}.json`),
        JSON.stringify(data, null, 2)
      );
      console.log(`✓ ${table.name} backed up successfully`);
    }

    console.log(`\nBackup completed successfully in: ${backupDir}`);
  } catch (error) {
    console.error('Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
