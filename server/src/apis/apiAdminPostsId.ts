import { FastifyInstance } from "fastify";
import { rm } from "fs/promises";

import {
  AdminPostDetailsInput,
  parseAdminPostDetails,
  parseAdminSubmitPost,
} from "shared";

import { db } from "../db.js";
import { assertAdminSecret } from "../utils/admin.js";

export function apiAdminPostsIdRoute(fastify: FastifyInstance) {
  fastify.get<{
    Params: { id: string };
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
    Params: { id: string };
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
    Params: { id: string };
  }>("/api/admin/posts/:id", async (request) => {
    assertAdminSecret(request);
    const { id } = request.params;

    await rm(`data/static/posts/medias/${id}`, {
      recursive: true,
      force: true,
    });

    await db.deleteFrom("posts").where("id", "=", id).execute();
  });
}
