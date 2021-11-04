import dayjs from 'dayjs';
import { Transaction } from 'pta-js';

// Removes empty entries
function clearTransaction(trx: Transaction): Transaction {
  return {
    ...trx,
    entries: trx.entries.filter((e) => !(e.account == "" && e.amount === "")),
  };
}

export default clearTransaction;
