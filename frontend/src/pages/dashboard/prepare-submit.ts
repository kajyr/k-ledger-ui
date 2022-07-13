import { Comment, Posting, Transaction, isPosting } from 'pta-tools';

import { FormData, OPTION_SPLITWISE } from './';

const round = (num: number) => Math.round(num * 100) / 100;

function splitEntries(trx: Transaction): Transaction {
  let split = 0;
  const entries: (Posting | Comment)[] = trx.entries.map(entry => {
    if (!isPosting(entry)) {
      return entry;
    }
    const amount = Number(entry.amount);
    const half = round(amount / 2);
    split += half;
    return { ...entry, amount: amount - half } as Posting;
  });

  const splitPosting: Posting = {
    account: 'Assets:Splitwise',
    amount: split,
    commodity: (trx.entries[0] as Posting).commodity
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
    transaction.entries = transaction.entries.concat({
      account: payingAccount
    });
  }
  return transaction;
}

export default prepareSubmitData;
