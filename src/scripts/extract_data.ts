import * as fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const filePath = './panini_wc2026_latam_8_sticker_tracker.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = 'Sticker_Checklist_LATAM';
const worksheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(worksheet);

const stickerData = data.map((row: any) => ({
  id: row.Sticker_No,
  code: row.Sticker_Code,
  name: row.Official_Name,
  category: row.Category,
  type: row.Sticker_Type,
  nation: row.Nation || null,
  group: row.Group || null,
  teamOrder: row.Team_Order ? parseInt(row.Team_Order) : null,
  isSpecial: row.Is_Special === 1 || row.Is_Special === true || row.Is_Special === "TRUE",
}));

fs.writeFileSync('./src/scripts/stickers_seed.json', JSON.stringify(stickerData, null, 2));
console.log(`Successfully extracted ${stickerData.length} stickers.`);
