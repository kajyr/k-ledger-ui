import app from './app';
import { fullFile } from './dal';
import pkg from './package.json';

require('dotenv').config();

const PORT = 4445;

const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
const isDev = nodeEnv === 'development';

const init = async () => {
  const server = await app({
    logger: isDev
      ? {
          prettyPrint: {
            colorize: true,
            ignore: 'pid,hostname,reqId',
            translateTime: 'HH:MM:ss'
          }
        }
      : false
  });

  try {
    await server.listen({ host: '0.0.0.0', port: PORT });
  } catch (err) {
    server.log.fatal(err);
    process.exit(1);
  }

  console.log('----');
  console.log('Server version:', pkg.version);
  console.log('Journal file:', fullFile);
  console.log();

  //@ts-ignore This is added by a fastify plugin
  server.logRoutes();
};

init();
