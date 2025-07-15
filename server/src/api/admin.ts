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
    return db.selectFrom("users").select(["id", "name"]).execute();
  });

  fastify.get("/api/admin/posts", async (request): Promise<RawPostSchema[]> => {
    assertAdminSecret(request);
    return db
      .selectFrom("posts")
      .innerJoin("users", "posts.author_id", "users.id")
      .select([
        "posts.id",
        "users.name as authorName",
        "posts.caption",
        "posts.media_type as mediaType",
        "posts.reactions",
        "posts.date",
      ])
      .execute();
  });
}
