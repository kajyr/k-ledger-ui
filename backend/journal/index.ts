const RESOURCE_ID = "dives";

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
        /*  const { guid, ...item } = request.body;
        if (!guid) {
          return reply.status(405).send({ error: "Missing item id" });
        }

 */
        return reply.status(200).send();
      },
    },
  ];

  for (const route of routes) {
    fastify.route(route);
  }

  done();
}
