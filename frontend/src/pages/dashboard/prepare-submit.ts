import { Comment, isPosting, Posting, Transaction } from 'pta-tools';

import { FormData, OPTION_SPLITWISE } from './';

function splitEntries(trx: Transaction): Transaction {
  let split: number = 0;
  const entries: (Posting | Comment)[] = trx.entries.map((entry) => {
    if (!isPosting(entry)) {
      return entry;
    }
    const half = Number(entry.amount) / 2;
    split += half;
    return { ...entry, amount: half.toString() } as Posting;
  });

  const splitPosting: Posting = {
    account: "Assets:Splitwise",
    amount: split.toString(),
    commodity: (trx.entries[0] as Posting).commodity,
  };
  entries.push(splitPosting);

  return { ...trx, entries };
}

function prepareSubmitData(data: FormData, options: string[]): Transaction {
  const { payingAccount, ...trx } = data;
  let transaction = trx;
  if (options.includes(OPTION_SPLITWISE)) {
    transaction = splitEntries(transaction);
  }

  if (payingAccount) {
    transaction.entries.push({ account: payingAccount });
  }
  return transaction;
}

export default prepareSubmitData;
