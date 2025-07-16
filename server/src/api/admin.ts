import { FastifyInstance, FastifyRequest } from "fastify";
import httpErrors from "http-errors";

import {
  AdminPostSchema,
  AdminUserSchema,
  parseAdminCreatePostSchema,
} from "shared";

import { db } from "../db.js";

export default function adminApiRoute(fastify: FastifyInstance) {
  const assertAdminSecret = (request: FastifyRequest) => {
    const adminSecret = request.headers["admin-secret"];
    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw httpErrors.Unauthorized();
    }
  };

  fastify.post("/api/admin/verify", (request): null => {
    assertAdminSecret(request);
    return null;
  });

  fastify.get(
    "/api/admin/users",
    async (request): Promise<AdminUserSchema[]> => {
      assertAdminSecret(request);
      return db.selectFrom("users").select(["id", "name"]).execute();
    },
  );

  fastify.get(
    "/api/admin/posts",
    async (request): Promise<AdminPostSchema[]> => {
      assertAdminSecret(request);
      return db
        .selectFrom("posts")
        .innerJoin("users", "posts.author_id", "users.id")
        .select([
          "posts.id",
          "users.name as authorName",
          "posts.timestamp",
          "posts.caption",
          "posts.media_type as mediaType",
          "posts.reactions",
        ])
        .execute();
    },
  );

  fastify.post("/api/admin/posts", async (request): Promise<void> => {
    assertAdminSecret(request);
    const post = parseAdminCreatePostSchema(request.body);
    await db
      .insertInto("posts")
      .values({
        author_id: post.authorId,
        timestamp: post.timestamp,
        caption: post.caption.trim(),
        media_type: null,
        reactions: post.reactions,
      })
      .execute();
  });

  fastify.delete<{
    Params: { id: number };
  }>("/api/admin/posts/:id", async (request): Promise<void> => {
    assertAdminSecret(request);
    const { id } = request.params;
    await db.deleteFrom("posts").where("id", "=", id).execute();
  });
}
