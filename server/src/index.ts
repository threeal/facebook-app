import fastifyHttpProxy from "@fastify/http-proxy";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import path from "node:path";
import adminApiRoute from "./api/admin.js";
import postsApiRoute from "./api/posts.js";

const fastify = Fastify({ logger: true });

fastify.register(postsApiRoute);

if (process.env.ADMIN_SECRET) {
  fastify.register(adminApiRoute);
}

fastify.register(fastifyStatic, {
  root: path.resolve("data/static"),
  prefix: "/static",
});

if (process.env.APP_DIST_DIR) {
  fastify.register(fastifyStatic, {
    root: process.env.APP_DIST_DIR,
    prefix: "/",
    decorateReply: false,
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
