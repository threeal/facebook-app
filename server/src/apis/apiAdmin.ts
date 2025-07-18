import { FastifyInstance } from "fastify";
import { AdminUsersInput, parseAdminUsers } from "shared";
import { db } from "../db.js";
import { assertAdminSecret } from "../utils/admin.js";

export function apiAdminRoute(fastify: FastifyInstance) {
  fastify.post("/api/admin/verify", (request): null => {
    assertAdminSecret(request);
    return null;
  });

  fastify.get("/api/admin/users", async (request) => {
    assertAdminSecret(request);
    const rows: AdminUsersInput = await db
      .selectFrom("users")
      .select(["id", "name", "has_avatar as hasAvatar"])
      .execute();

    return parseAdminUsers(rows);
  });
}
