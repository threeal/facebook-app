import { FastifyInstance } from "fastify";
import { assertAdminSecret } from "../utils/admin.js";

export function apiAdminRoute(fastify: FastifyInstance) {
  fastify.post("/api/admin/verify", (request): null => {
    assertAdminSecret(request);
    return null;
  });
}
