import { createReadStream } from 'fs';
import { appendFile } from 'fs/promises';
import path from 'path';
import { ParseResult, Transaction, formatTransaction, parse } from 'pta-tools';

export const fullFile = path.resolve(process.env.K_LEDGER_FILE || '');

export const filename = path.basename(fullFile);

export function addTransaction(data: Transaction): Promise<void> {
  return appendFile(fullFile, `\n${formatTransaction(data)}`, 'utf8');
}

export function readFile(): Promise<ParseResult> {
  const readStream = createReadStream(fullFile);

  return parse(readStream).then(contents => {
    readStream.close();
    return contents;
  });
}
