import { filename } from '../dal';

export default function (fastify, opts, done) {
  const routes = [
    {
      method: "GET",
      url: `/api/bootstrap`,
      handler: async function () {
        return { file: filename };
      },
    },
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
