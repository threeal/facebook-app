import { FastifyRequest } from "fastify";
import httpErrors from "http-errors";

export function assertAdminSecret(request: FastifyRequest) {
  const adminSecret = request.headers["admin-secret"];
  if (adminSecret !== process.env.ADMIN_SECRET) {
    throw httpErrors.Unauthorized();
  }
}
