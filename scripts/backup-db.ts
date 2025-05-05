import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

const prisma = new PrismaClient();

const MAX_BACKUPS = 30; // Keep last 30 days of backups

async function cleanOldBackups(backupsDir: string) {
  if (!fs.existsSync(backupsDir)) return;

  const backups = fs.readdirSync(backupsDir)
    .filter(f => fs.statSync(path.join(backupsDir, f)).isDirectory())
    .sort((a, b) => b.localeCompare(a)); // Sort newest to oldest

  // Remove old backups beyond MAX_BACKUPS
  if (backups.length > MAX_BACKUPS) {
    backups.slice(MAX_BACKUPS).forEach(backup => {
      const backupPath = path.join(backupsDir, backup);
      fs.rmSync(backupPath, { recursive: true, force: true });
      console.log(`Removed old backup: ${backup}`);
    });
  }
}

async function compressFile(inputPath: string, outputPath: string) {
  const gzip = createGzip();
  const source = fs.createReadStream(inputPath);
  const destination = fs.createWriteStream(outputPath);

  await pipeline(source, gzip, destination);
  fs.unlinkSync(inputPath); // Remove original file after compression
}

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupsDir = path.join(process.cwd(), 'backups');
  const backupDir = path.join(backupsDir, timestamp);

  try {
    // Create backup directories
    fs.mkdirSync(backupsDir, { recursive: true });
    fs.mkdirSync(backupDir, { recursive: true });

    // Clean old backups first
    await cleanOldBackups(backupsDir);

    // Backup each table
    const tables = [
      {
        name: 'brands' as const,
        query: () => prisma.brands.findMany(),
        count: () => prisma.brands.count()
      },
      {
        name: 'colors' as const,
        query: () => prisma.colors.findMany(),
        count: () => prisma.colors.count()
      },
      {
        name: 'finishes' as const,
        query: () => prisma.finishes.findMany(),
        count: () => prisma.finishes.count()
      },
      {
        name: 'nail_polish' as const,
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
        }),
        count: () => prisma.nail_polish.count()
      }
    ] as const;

    for (const table of tables) {
      console.log(`Backing up ${table.name}...`);
      const data = await table.query();

      // Write uncompressed file first
      const tempPath = path.join(backupDir, `${table.name}.json`);
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));

      // Compress the file
      const compressedPath = `${tempPath}.gz`;
      await compressFile(tempPath, compressedPath);

      console.log(`✓ ${table.name} backed up and compressed successfully`);
    }

    // Create a manifest file with backup info
    const manifest = {
      timestamp,
      tables: tables.map(t => t.name),
      compressed: true
    };
    fs.writeFileSync(
      path.join(backupDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log(`\nBackup completed successfully in: ${backupDir}`);

    // Export total counts for verification
    const counts = await Promise.all(tables.map(async table => ({
      table: table.name,
      count: await table.count()
    })));
    fs.writeFileSync(
      path.join(backupDir, 'counts.json'),
      JSON.stringify(counts, null, 2)
    );

  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
