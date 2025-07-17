import { FastifyInstance, FastifyRequest } from "fastify";
import httpErrors from "http-errors";

import {
  AdminPostDetailsInput,
  AdminPostsInput,
  AdminUsersInput,
  parseAdminPostDetails,
  parseAdminPosts,
  parseAdminSubmitPost,
  parseAdminUsers,
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

  fastify.get("/api/admin/users", async (request) => {
    assertAdminSecret(request);
    const rows: AdminUsersInput = await db
      .selectFrom("users")
      .select(["id", "name", "has_avatar as hasAvatar"])
      .execute();

    return parseAdminUsers(rows);
  });

  fastify.get("/api/admin/posts", async (request) => {
    assertAdminSecret(request);
    const rows: AdminPostsInput = await db
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

    return parseAdminPosts(rows);
  });

  fastify.post("/api/admin/posts", async (request) => {
    assertAdminSecret(request);
    const post = parseAdminSubmitPost(request.body);
    await db
      .insertInto("posts")
      .values({
        author_id: post.authorId,
        timestamp: post.timestamp,
        caption: post.caption,
        media_type: null,
        reactions: post.reactions,
      })
      .execute();
  });

  fastify.get<{
    Params: { id: number };
  }>("/api/admin/posts/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;
    const rows: AdminPostDetailsInput = await db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "posts.id",
        "users.id as authorId",
        "posts.timestamp",
        "posts.caption",
        "posts.media_type as mediaType",
        "posts.reactions",
      ])
      .where("posts.id", "=", id)
      .executeTakeFirstOrThrow();

    return parseAdminPostDetails(rows);
  });

  fastify.put<{
    Params: { id: number };
  }>("/api/admin/posts/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;
    const post = parseAdminSubmitPost(request.body);
    await db
      .updateTable("posts")
      .set({
        author_id: post.authorId,
        timestamp: post.timestamp,
        caption: post.caption,
        reactions: post.reactions,
      })
      .where("id", "=", id)
      .execute();
  });

  fastify.delete<{
    Params: { id: number };
  }>("/api/admin/posts/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;
    await db.deleteFrom("posts").where("id", "=", id).execute();
  });
}
