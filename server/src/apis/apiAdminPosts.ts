import { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";

import {
  AdminCreateResultInput,
  AdminPostsInput,
  parseAdminCreatetResult,
  parseAdminPosts,
  parseAdminSubmitPost,
} from "shared";

import { db } from "../db.js";
import { assertAdminSecret } from "../utils/admin.js";

export function apiAdminPostsRoute(fastify: FastifyInstance) {
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
    const row: AdminCreateResultInput = await db
      .insertInto("posts")
      .values({
        id: nanoid(),
        author_id: post.authorId,
        timestamp: post.timestamp,
        caption: post.caption,
        media_type: null,
        reactions: post.reactions,
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    return parseAdminCreatetResult(row);
  });
}
