import { FastifyInstance } from "fastify";
import type { PostSchema } from "shared";
import { db } from "./db.js";

export default function (fastify: FastifyInstance) {
  fastify.get("/api/posts", (): PostSchema[] => {
    return db
      .prepare(
        `
      SELECT
        posts.caption,
        posts.image,
        posts.video,
        posts.reactions,
        posts.date,
        authors.name AS author_name,
        authors.avatar AS author_avatar
      FROM posts
      JOIN authors ON posts.author_id = authors.id
    `,
      )
      .all() as PostSchema[];
  });
}
