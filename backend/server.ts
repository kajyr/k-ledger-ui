require("dotenv").config();

import colors from 'colors/safe';

import app from './app';
import { fullFile } from './dal';
import pkg from './package.json';
import { Server } from './types';

const PORT = 4445;

const spaces = (num: number): string => Array(num).join(" ");

function logRoutes(routes: Server.FastifyRoutesMap) {
  console.log(colors.blue("Routes"));

  const obj = Object.fromEntries(routes as any);

  const lineLength = Object.keys(obj).reduce(
    (val, url) => Math.max(val, url.length + 3),
    20
  );

  Object.keys(obj).forEach((url) => {
    const list = obj[url];
    const methods = list
      .flatMap((m) => m.method)
      .sort((a, b) => a.localeCompare(b))
      .join(", ");

    console.log(
      `${colors.blue(url)}${spaces(lineLength - url.length)}${methods}`
    );
  });
}

const nodeEnv = (process.env.NODE_ENV || "development").toLowerCase();
const isDev = nodeEnv === "development";

const init = async () => {
  const server = await app({
    logger: isDev
      ? {
          prettyPrint: {
            translateTime: "HH:MM:ss",
            colorize: true,
            ignore: "pid,hostname,reqId",
          },
        }
      : false,
  });

  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.fatal(err);
    process.exit(1);
  }

  console.log("----");
  console.log("Server version:", pkg.version);
  console.log("Journal file:", fullFile);
  console.log();

  //@ts-ignore This is added by a fastify plugin
  logRoutes(server.routes);
};

init();
