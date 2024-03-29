import fastify from 'fastify';
import path from 'path';

const PUBLIC_PATH = path.join(__dirname, '..', 'public');

async function build(opts = {}) {
  const app = await fastify(opts);
  app.register(require('fastify-log'));
  app.register(require('fastify-routes-table'));

  await app.register(require('./config'));
  await app.register(require('./suggestions'));
  await app.register(require('./journal'));

  // Block other api
  app.route({
    handler: (req, reply) => {
      reply.code(404).send();
    },
    method: ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS'],
    url: '/api/*'
  });

  app.register(require('@fastify/static'), {
    root: PUBLIC_PATH
  });

  app.setNotFoundHandler((_, reply) => {
    //@ts-ignore This is added by a fastify plugin
    reply.sendFile('index.html');
  });

  app.get('/', (_, reply) => {
    //@ts-ignore This is added by a fastify plugin
    reply.sendFile('index.html');
  });

  return app;
}

export default build;
