

import { filename, readFile } from '../dal';

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
        };
      },
    },
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
