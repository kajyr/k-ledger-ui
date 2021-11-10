import { createReadStream } from 'fs';
import path from 'path';
import { formatTransaction, parse, ParseResult, Transaction } from 'pta-journal';

import fs from 'fs/promises';

export const fullFile = path.resolve(process.env.K_LEDGER_FILE || "");

export const filename = path.basename(fullFile);

export function addTransaction(data: Transaction): Promise<void> {
  return fs.appendFile(fullFile, `\n${formatTransaction(data)}`, "utf8");
}

export function readFile(): Promise<ParseResult> {
  const readStream = createReadStream(fullFile);

  return parse(readStream).then((contents) => {
    readStream.close();
    return contents;
  });
}
