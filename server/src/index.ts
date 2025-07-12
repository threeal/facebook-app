import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const fastify = Fastify({ logger: true });

fastify.register(fastifyStatic, {
  root: process.env.APP_DIST_DIR ?? "dist",
  prefix: "/",
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exitCode = 1;
}
