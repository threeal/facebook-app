import Fastify from "fastify";
import fastifyHttpProxy from "@fastify/http-proxy";
import fastifyStatic from "@fastify/static";
import apiRoute from "./api.js";

const fastify = Fastify({ logger: true });

fastify.register(apiRoute);

if (process.env.APP_DIST_DIR) {
  fastify.register(fastifyStatic, {
    root: process.env.APP_DIST_DIR,
    prefix: "/",
  });
}

if (process.env.APP_DEV_UPSTREAM) {
  fastify.register(fastifyHttpProxy, {
    upstream: process.env.APP_DEV_UPSTREAM,
    prefix: "/",
  });
}

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exitCode = 1;
}
