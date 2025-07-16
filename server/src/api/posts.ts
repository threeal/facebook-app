import { FastifyInstance } from "fastify";
import { parsePostsSchema } from "shared";
import { db } from "../db.js";

export default function postsApiRoute(fastify: FastifyInstance) {
  fastify.get("/api/posts", async () => {
    const rows = await db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "posts.id",
        "users.id as authorId",
        "posts.timestamp",
        "users.name as authorName",
        "posts.caption",
        "posts.media_type as mediaType",
        "posts.reactions",
      ])
      .execute();

    return parsePostsSchema(rows);
  });
}
