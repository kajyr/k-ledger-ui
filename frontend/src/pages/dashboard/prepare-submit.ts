import { Transaction } from 'pta-journal';

import { FormData, OPTION_SPLITWISE } from './';

function prepareSubmitData(data: FormData, options: string[]): Transaction {
  const { payingAccount, ...trx } = data;

  if (options.includes(OPTION_SPLITWISE)) {
    let split: number = 0;
    trx.entries = trx.entries.map((entry) => {
      const half = Number(entry.amount) / 2;
      split += half;
      return { ...entry, amount: half.toString() };
    });
    trx.entries.push({
      account: "Assets:Splitwise",
      amount: split.toString(),
      commodity: trx.entries[0].commodity,
    });
  }

  if (payingAccount) {
    trx.entries.push({ account: payingAccount });
  }
  return trx;
}

export default prepareSubmitData;
