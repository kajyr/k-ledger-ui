import { Transaction } from 'pta-journal';

type Temp = { k: string; n: number };

function getAccountsSorted(trxs: Transaction[]): string[] {
  const obj = trxs
    .flatMap((trx) => trx.entries.map((entry) => entry.account))
    .reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  let a: Temp[] = [];
  for (let k in obj) {
    a.push({ k: k, n: obj[k] });
  }

  return a.sort((a, b) => b.n - a.n).map((a) => a.k);
}

export default getAccountsSorted;
