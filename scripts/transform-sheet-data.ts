import { Rating } from '@prisma/client';

// Valid finishes from seed.ts
const VALID_FINISHES = [
  'Bar Glitter',
  'Chunky Glitter',
  'Chunky Holo Glitter',
  'Crackle',
  'Crelly',
  'Creme',
  'Duochrome',
  'Flakie',
  'Frost',
  'Glass Fleck',
  'Glitter',
  'Glow in the Dark',
  'Holo Glitter',
  'Iridescent',
  'Iridescent Shimmer',
  'Iridescent Flakie',
  'Iridescent Glitter',
  'Jelly',
  'Linear Holo',
  'Flakie Holo',
  'Magnetic',
  'Matte',
  'Metallic',
  'Micro Glitter',
  'Micro Holo Glitter',
  'Multichrome',
  'Neon',
  'Reflective Glitter',
  'Scattered Holo',
  'Scented',
  'Sheer',
  'Shifty',
  'Shimmer',
  'Textured',
  'Thermal',
  'Topper',
  'UV',
];

export type SheetRow = {
  Image: string;
  Brand: string;
  Polish: string;
  Color: string;
  'Finishes/Types': string;
  Link: string;
  Coats: string;
  Rating: string;
  Notes: string;
};

type TransformedPolish = {
  image_url: string | null;
  brand: string;
  name: string;
  colors: string[];
  finishes: string[];
  link: string | undefined;
  coats: number | undefined;
  rating: Rating | undefined;
  notes: string | undefined;
  is_old: undefined;
  empty_bottles: number;
  total_bottles: number;
  last_used: undefined;
};

const ratingMap: Record<string, Rating> = {
  'A+': 'A_PLUS',
  'A': 'A',
  'A-': 'A_MINUS',
  'B+': 'B_PLUS',
  'B': 'B',
  'B-': 'B_MINUS',
  'C+': 'C_PLUS',
  'C': 'C',
  'C-': 'C_MINUS',
  'D+': 'D_PLUS',
  'D': 'D',
  'D-': 'D_MINUS',
  'F': 'F',
} as const;

export const transformSheetRow = (row: SheetRow, duplicateCounts: Map<string, number>): TransformedPolish => {
  const polishKey = `${row.Brand}|||${row.Polish}`;
  const totalBottles = duplicateCounts.get(polishKey) || 1;

  // Filter out invalid finishes
  const finishes = row['Finishes/Types']
    ? row['Finishes/Types']
        .split(', ')
        .filter(finish => VALID_FINISHES.includes(finish))
    : [];

  return {
    image_url: row.Image || null,  // Use null when no image URL exists
    brand: row.Brand === 'zzz *unmarked*' ? 'N/A' : row.Brand,
    name: row.Polish,
    colors: [row.Color], // Single color wrapped in array
    finishes, // Only include valid finishes
    link: row.Link || undefined,
    coats: row.Coats ? parseInt(row.Coats) : undefined,
    rating: row.Rating ? ratingMap[row.Rating] : undefined,
    notes: row.Notes || undefined,
    is_old: undefined,
    empty_bottles: 0, // Default to 0
    total_bottles: totalBottles,
    last_used: undefined
  };
};

export const transformSheetData = (rows: SheetRow[]): TransformedPolish[] => {
  // Count duplicates using brand + polish name as key
  const duplicateCounts = new Map<string, number>();
  rows.forEach(row => {
    const polishKey = `${row.Brand}|||${row.Polish}`;
    duplicateCounts.set(polishKey, (duplicateCounts.get(polishKey) || 0) + 1);
  });

  // Get unique polishes and transform them
  const uniquePolishes = new Map<string, SheetRow>();
  rows.forEach(row => {
    const polishKey = `${row.Brand}|||${row.Polish}`;
    if (!uniquePolishes.has(polishKey)) {
      uniquePolishes.set(polishKey, row);
    }
  });

  return Array.from(uniquePolishes.values()).map(row => transformSheetRow(row, duplicateCounts));
};
