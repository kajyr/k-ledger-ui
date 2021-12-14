import { isPosting, isTransaction, Journal, Transaction } from 'pta-tools';

type Pivot = {
  account: string;
  descrMatch: number;
  sortMatch: boolean;
  uses: number;
};

function getAccounts(trx: Transaction) {
  const accounts: string[] = [];
  for (const entry of trx.entries) {
    if (isPosting(entry)) {
      accounts.push(entry.account);
    }
  }
  return accounts;
}

function getSortedAccountsMatchingDescr(
  journal: Journal,
  query: string | undefined,
  description: string | undefined,
  sort: string | undefined
): string[] {
  const descr = description?.toLowerCase();
  const q = query?.toLowerCase();
  const s = sort?.toLowerCase();

  const map = {} as Record<string, Pivot>;

  for (const trx of journal) {
    if (!isTransaction(trx)) {
      continue;
    }
    const descrMatch =
      descr && trx.description?.toLowerCase().startsWith(descr) ? 1 : 0;

    for (const account of getAccounts(trx)) {
      const accName = account.toLowerCase();
      const sortMatch = !!s && accName.startsWith(s);

      if (!q || accName.includes(q)) {
        if (!map[account]) {
          map[account] = { account, descrMatch, sortMatch, uses: 1 };
        } else {
          map[account].descrMatch += descrMatch;
          map[account].sortMatch = map[account].sortMatch || sortMatch;
          map[account].uses++;
        }
      }
    }
  }

  // Sort by sorting matching
  // Then by descr matching
  // Then by usage
  // Then by name
  const sorted = Object.values(map).sort(
    (a, b) =>
      Number(b.sortMatch) - Number(a.sortMatch) ||
      b.descrMatch - a.descrMatch ||
      b.uses - a.uses ||
      a.account.localeCompare(b.account)
  );

  return sorted.map((v) => v.account);
}

export default getSortedAccountsMatchingDescr;
