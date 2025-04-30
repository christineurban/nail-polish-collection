import { transformSheetData } from './transform-sheet-data';
import type { SheetRow } from './transform-sheet-data';
import fetch from 'node-fetch';

const SPREADSHEET_ID = '1kvLvggx5kp4GI6IFHAhTA2DsKux_-aCRqel7h_e1VUU';

async function main() {
  try {
    // Fetch the sheet as CSV
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csv = await response.text();

    // Parse CSV
    const rows = csv.split('\n').map((row: string) =>
      row.split(',').map((cell: string) =>
        // Remove quotes and trim
        cell.replace(/^"(.*)"$/, '$1').trim()
      )
    );

    // Transform headers to match our expected format
    const headers = rows[0];
    const data = rows.slice(1).map((row: string[]): SheetRow => {
      const obj: Partial<SheetRow> = {};
      headers.forEach((header: string, i: number) => {
        // Map sheet headers to our expected format
        const mappedHeader = {
          'Image': 'Image',
          'Brand': 'Brand',
          'Polish': 'Polish',
          'Color': 'Color',
          'Finishes/Types': 'Finishes/Types',
          'Link': 'Link',
          'Coats': 'Coats',
          'Rating': 'Rating',
          'Notes': 'Notes',
        }[header] || header;

        (obj as any)[mappedHeader] = row[i] || '';
      });
      return obj as SheetRow;
    });

    // Transform the data
    const transformedData = transformSheetData(data);

    // Output the result
    console.log(JSON.stringify(transformedData, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
