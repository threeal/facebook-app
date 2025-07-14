import { FastifyInstance } from "fastify";
import httpErrors from "http-errors";

export default function adminApiRoute(fastify: FastifyInstance) {
  fastify.post("/api/admin/verify", (request): null => {
    const adminSecret = request.headers["admin-secret"];
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw httpErrors.Unauthorized();
    }
    return null;
  });
}
