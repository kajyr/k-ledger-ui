import { isTransaction, Journal, Transaction } from 'pta-journal';

import { filename, readFile } from '../dal';
import { unique } from '../helpers/array';

function isTransactionWithPayee(data: any): data is Transaction {
  return isTransaction(data) && !!data.description;
}

function getPayees(trxs: Journal): string[] {
  return unique(
    trxs
      .filter(isTransactionWithPayee)
      .map((trx: Transaction) => trx.description || "")
  );
}

export default function (fastify, opts, done) {
  const routes = [
    {
      method: "GET",
      url: `/api/bootstrap`,
      handler: async function () {
        const data = await readFile();
        return {
          file: filename,
          accounts: data.accounts,
          commodities: data.commodities,
          payees: getPayees(data.journal),
        };
      },
    },
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
