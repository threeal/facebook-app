import fastifyHttpProxy from "@fastify/http-proxy";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import "dotenv/config";
import Fastify from "fastify";
import path from "node:path";
import { apiAdminRoute } from "./apis/apiAdmin.js";
import { apiAdminPostsRoute } from "./apis/apiAdminPosts.js";
import { apiAdminPostsIdRoute } from "./apis/apiAdminPostsId.js";
import { apiAdminPostsIdMediaRoute } from "./apis/apiAdminPostsIdMedia.js";
import { apiPostsRoute } from "./apis/apiPosts.js";

const fastify = Fastify({ logger: true });

fastify.register(fastifyMultipart);

if (process.env.ADMIN_SECRET) {
  fastify.register(apiAdminRoute);
  fastify.register(apiAdminPostsRoute);
  fastify.register(apiAdminPostsIdRoute);
  fastify.register(apiAdminPostsIdMediaRoute);
}

fastify.register(apiPostsRoute);

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
  await fastify.listen({
    host: process.env.HOST,
    port: parseInt(process.env.PORT ?? "3000"),
  });
} catch (err) {
  fastify.log.error(err);
  process.exitCode = 1;
}
