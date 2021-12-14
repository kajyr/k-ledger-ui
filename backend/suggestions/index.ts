import { isTransaction, Journal } from 'pta-tools';

import { readFile } from '../dal';
import { sortByOccurrence } from '../helpers/array';

function getPayees(trxs: Journal): string[] {
  return trxs.reduce((acc, trx) => {
    if (isTransaction(trx) && trx.description) {
      acc.push(trx.description);
    }
    return acc;
  }, [] as string[]);
}

export default function (fastify, opts, done) {
  const routes = [
    {
      method: "GET",
      url: `/api/s/description/:query?`,
      handler: async function (request) {
        const data = await readFile();

        const { query } = request.params;

        let list;

        if (!query) {
          list = getPayees(data.journal);
        } else {
          list = data.journal.reduce((acc, trx) => {
            if (
              isTransaction(trx) &&
              trx.description?.toLowerCase().includes(query.toLowerCase())
            ) {
              acc.push(trx.description);
            }
            return acc;
          }, [] as string[]);
        }

        return sortByOccurrence(list).splice(0, 5);
      },
    },
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
