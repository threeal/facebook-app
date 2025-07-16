import { FastifyInstance } from "fastify";
import { parsePosts, PostsInput } from "shared";
import { db } from "../db.js";

export default function postsApiRoute(fastify: FastifyInstance) {
  fastify.get("/api/posts", async () => {
    const rows: PostsInput = await db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "posts.id",
        "users.id as authorId",
        "users.name as authorName",
        "users.has_avatar as authorHasAvatar",
        "posts.timestamp",
        "posts.caption",
        "posts.media_type as mediaType",
        "posts.reactions",
      ])
      .execute();

    return parsePosts(rows);
  });
}
