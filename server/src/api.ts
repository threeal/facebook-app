import { FastifyInstance } from "fastify";
import type { PostSchema } from "shared";
import { db } from "./db.js";

export default function (fastify: FastifyInstance) {
  fastify.get("/api/posts", async (): Promise<PostSchema[]> => {
    const rows = await db
      .selectFrom("posts")
      .innerJoin("authors", "posts.author_id", "authors.id")
      .select([
        "authors.name as author_name",
        "authors.avatar as author_avatar",
        "posts.caption",
        "posts.image",
        "posts.video",
        "posts.reactions",
        "posts.date",
      ])
      .execute();

    return rows.map((row) => ({
      author: {
        name: row.author_name,
        avatar: row.author_avatar,
      },
      caption: row.caption,
      image: row.image,
      video: row.video,
      reactions: row.reactions,
      date: row.date,
    }));
  });
}
