const path = require("path");
const fullFile = process.env.LEDGER_FILE;

export const filename = path.basename(fullFile);
