import { Transaction } from 'pta-journal';

import { addTransaction } from '../dal/';

export default function (fastify, opts, done) {
  const routes = [
    {
      method: "GET",
      url: `/api/journal`,
      handler: async function () {
        return { test: 5 };
      },
    },
    {
      method: "POST",
      path: `/api/journal`,
      handler: async function (request, reply) {
        const trx = request.body as Transaction;
        if (!trx.date) {
          return reply.status(405).send({ error: "Missing date" });
        }

        await addTransaction(trx);
        return reply.status(200).send();
      },
    },
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
