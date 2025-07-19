import { FastifyInstance } from "fastify";

import {
  AdminUserDetailsInput,
  parseAdminSubmitUser,
  parseAdminUserDetails,
} from "shared";

import { db } from "../db.js";
import { assertAdminSecret } from "../utils/admin.js";

export function apiAdminUsersIdRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: { id: string };
  }>("/api/admin/users/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;
    const rows: AdminUserDetailsInput = await db
      .selectFrom("users")
      .select(["name", "has_avatar as hasAvatar"])
      .where("id", "=", id)
      .executeTakeFirstOrThrow();

    return parseAdminUserDetails(rows);
  });

  fastify.put<{
    Params: { id: string };
  }>("/api/admin/users/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;
    const post = parseAdminSubmitUser(request.body);
    await db
      .updateTable("users")
      .set({ name: post.name })
      .where("id", "=", id)
      .execute();
  });
}
