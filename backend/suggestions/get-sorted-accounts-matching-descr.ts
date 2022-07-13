import { Journal, Transaction, isPosting, isTransaction } from 'pta-tools';

type Pivot = {
  account: string;
  descrMatch: number;
  sortMatch: boolean;
  uses: number;
};

function getKeysFromPostings(trx: Transaction, filterKey: string): string[] {
  const accounts: string[] = [];
  for (const entry of trx.entries) {
    if (isPosting(entry) && entry[filterKey]) {
      accounts.push(entry[filterKey]);
    }
  }
  return accounts;
}

/**
 * At lease on item in the list should be the
 * starting string of the query
 *
 * @param str expenses:cash
 * @param list ['exp', 'liabl']
 */
function startsWith(str, list) {
  return list.some(s => str.startsWith(s));
}

function getSortedAccountsMatchingDescr(
  journal: Journal,
  query: string | undefined,
  description: string | undefined,
  filterKey: string,
  sort?: string[]
): string[] {
  const descr = description?.toLowerCase();
  const q = query?.toLowerCase();
  const s = (sort || []).map(s => s.toLowerCase());

  const map = {} as Record<string, Pivot>;

  for (const trx of journal) {
    if (!isTransaction(trx)) {
      continue;
    }
    const descrMatch = descr && trx.description?.toLowerCase().startsWith(descr) ? 1 : 0;

    for (const key of getKeysFromPostings(trx, filterKey)) {
      const keyLower = key.toLowerCase();
      const sortMatch = startsWith(keyLower, s);

      if (!q || keyLower.includes(q)) {
        if (!map[key]) {
          map[key] = { account: key, descrMatch, sortMatch, uses: 1 };
        } else {
          map[key].descrMatch += descrMatch;
          map[key].sortMatch = map[key].sortMatch || sortMatch;
          map[key].uses++;
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

  return sorted.map(v => v.account);
}

export default getSortedAccountsMatchingDescr;
