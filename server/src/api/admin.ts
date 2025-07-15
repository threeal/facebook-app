import { FastifyInstance, FastifyRequest } from "fastify";
import httpErrors from "http-errors";
import { RawPostSchema, RawUserSchema } from "shared";
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

  fastify.get("/api/admin/users", async (request): Promise<RawUserSchema[]> => {
    assertAdminSecret(request);
    return db.selectFrom("authors").select(["id", "name", "avatar"]).execute();
  });

  fastify.get("/api/admin/posts", async (request): Promise<RawPostSchema[]> => {
    assertAdminSecret(request);
    return db
      .selectFrom("posts")
      .innerJoin("authors", "posts.author_id", "authors.id")
      .select([
        "posts.id",
        "authors.name as authorName",
        "posts.caption",
        "posts.media",
        "posts.reactions",
        "posts.date",
      ])
      .execute();
  });
}
