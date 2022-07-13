import { filename, readFile } from '../dal';

export default function (fastify, opts, done) {
  const routes = [
    {
      handler: async function () {
        const data = await readFile();
        return {
          accounts: data.accounts,
          commodities: data.commodities,
          file: filename
        };
      },
      method: 'GET',
      url: `/api/bootstrap`
    }
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
