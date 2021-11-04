import path from 'path';
import { formatTransaction, Transaction } from 'pta-js';

import fs from 'fs/promises';

export const fullFile = path.resolve(process.env.K_LEDGER_FILE || "");

export const filename = path.basename(fullFile);

export function addTransaction(data: Transaction): Promise<void> {
  return fs.appendFile(fullFile, `\n${formatTransaction(data)}`, "utf8");
}
