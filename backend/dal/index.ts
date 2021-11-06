import { createReadStream } from 'fs';
import path from 'path';
import { formatTransaction, parse, ParseResult, Transaction } from 'pta-journal';

import fs from 'fs/promises';

export const fullFile = path.resolve(process.env.K_LEDGER_FILE || "");

export const filename = path.basename(fullFile);

export function addTransaction(data: Transaction): Promise<void> {
  return fs.appendFile(fullFile, `\n${formatTransaction(data)}`, "utf8");
}

let fileContents: ParseResult;

export function readFile(): Promise<ParseResult> {
  if (fileContents) {
    return Promise.resolve(fileContents);
  }

  const readStream = createReadStream(fullFile);

  return parse(readStream).then((contents) => {
    fileContents = contents;
    return contents;
  });
}
