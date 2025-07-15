import { FastifyInstance } from "fastify";
import type { PostSchema } from "shared";
import { db } from "../db.js";

export default function postsApiRoute(fastify: FastifyInstance) {
  fastify.get("/api/posts", async (): Promise<PostSchema[]> => {
    const rows = await db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "users.name as authorName",
        "users.avatar as authorAvatar",
        "posts.caption",
        "posts.media",
        "posts.reactions",
        "posts.date",
      ])
      .execute();

    return rows.map((row) => ({
      author: {
        name: row.authorName,
        avatar: row.authorAvatar,
      },
      caption: row.caption,
      media: row.media,
      reactions: row.reactions,
      date: row.date,
    }));
  });
}
