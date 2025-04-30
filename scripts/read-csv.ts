import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { transformSheetData, type SheetRow } from './transform-sheet-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readAndTransformCsv = () => {
  try {
    // Read the CSV file
    const csvFilePath = path.join(__dirname, 'polish-data.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

    // Parse CSV content
    const records = parse(fileContent, {
      columns: true, // Use the first row as headers
      skip_empty_lines: true,
    }) as SheetRow[];

    // Transform the data
    const transformedData = transformSheetData(records);

    // Write the transformed data to a JSON file
    const outputPath = path.join(__dirname, '..', 'transformed-polishes.json');
    fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

    console.log(`Successfully transformed ${records.length} records`);
    console.log(`Output written to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing CSV:', error);
    process.exit(1);
  }
};

readAndTransformCsv();
