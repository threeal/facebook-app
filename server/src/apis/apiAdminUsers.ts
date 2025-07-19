import { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

import {
  AdminCreateResultInput,
  AdminUsersInput,
  parseAdminCreatetResult,
  parseAdminSubmitUser,
  parseAdminUsers,
} from "shared";

import { db } from "../db.js";
import { assertAdminSecret } from "../utils/admin.js";

export function apiAdminUsersRoute(fastify: FastifyInstance) {
  fastify.get("/api/admin/users", async (request) => {
    assertAdminSecret(request);
    const rows: AdminUsersInput = await db
      .selectFrom("users")
      .select(["id", "name", "has_avatar as hasAvatar"])
      .execute();

    return parseAdminUsers(rows);
  });

  fastify.post("/api/admin/users", async (request) => {
    assertAdminSecret(request);
    const user = parseAdminSubmitUser(request.body);
    const row: AdminCreateResultInput = await db
      .insertInto("users")
      .values({
        id: nanoid(),
        name: user.name,
        has_avatar: 0,
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    return parseAdminCreatetResult(row);
  });
}
