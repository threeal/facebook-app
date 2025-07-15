import { FastifyInstance } from "fastify";
import type { PostSchema } from "shared";
import { db } from "../db.js";

export default function postsApiRoute(fastify: FastifyInstance) {
  fastify.get("/api/posts", async (): Promise<PostSchema[]> => {
    const rows = await db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "posts.id",
        "users.id as authorId",
        "users.name as authorName",
        "posts.caption",
        "posts.media_type as mediaType",
        "posts.reactions",
        "posts.date",
      ])
      .execute();

    return rows.map((row) => ({
      id: row.id,
      author: {
        id: row.authorId,
        name: row.authorName,
      },
      caption: row.caption,
      mediaType: row.mediaType,
      reactions: row.reactions,
      date: row.date,
    }));
  });
}
